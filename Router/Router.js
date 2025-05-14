import Route from "./Route.js";
import { allRoutes, websiteName } from "./allRoutes.js";

// Création d'une route pour la page 404 (page introuvable)
const route404 = new Route("404", "Page introuvable", "/Pages/404.html", []);

// Fonction pour récupérer la route correspondant à une URL donnée
const getRouteByUrl = (url) => {
  let currentRoute = null;

  // Parcours de toutes les routes pour trouver la correspondance
  allRoutes.forEach((element) => {
    if (element.url == url) {
      currentRoute = element;
    }
  });

  // Si aucune correspondance n'est trouvée, on retourne la route 404
  if (currentRoute != null) {
    return currentRoute;
  } else {
    return route404;
  }
};

// Fonction pour charger le contenu de la page
const LoadContentPage = async () => {
  const path = window.location.pathname;

  // Récupération de l'URL actuelle
  const actualRoute = getRouteByUrl(path);

  //Verifier les droits d'accès à la page
  const allRolesArray = actualRoute.authorize;
  if(allRolesArray.length > 0){
    if(allRolesArray.includes("disconnected")){
      if(isConnected()){
        window.location.replace("/");
      }
    }
    else{
      const roleUser = getRole();
      if(!allRolesArray.includes(roleUser)){
        window.location.replace("/");
      }
    }
  }

  // Récupération du contenu HTML de la route
  const html = await fetch(actualRoute.pathHtml).then((data) => data.text());

  // Ajout du contenu HTML à l'élément avec l'ID "main-page"
  // Assurez-vous que cet ID correspond à l'élément où vous insérez le contenu de la page
  const mainContentElement = document.getElementById("main-page");
  if (mainContentElement) {
      mainContentElement.innerHTML = html;
  } else {
      console.error("Erreur : Élément #main-page non trouvé dans le DOM.");
      // Gérer l'erreur, peut-être rediriger vers une page d'erreur ou afficher un message
      return; // Arrêter l'exécution si l'élément principal n'est pas trouvé
  }


  // Ajout du contenu JavaScript associé à la route
  if (actualRoute.pathJS) { // Vérifie si un chemin JS est défini pour la route
    // Supprimer l'ancien script si nécessaire pour éviter les écouteurs multiples
    // Cette partie dépend de comment votre routeur gère les scripts entre les pages.
    // Une approche simple est de s'assurer que les fonctions d'initialisation peuvent être appelées plusieurs fois sans problème.
    // Si vous avez des problèmes d'écouteurs multiples, il faudra une gestion plus fine ici.

    // Création d'une nouvelle balise script
    const scriptTag = document.createElement("script");
    scriptTag.setAttribute("type", "text/javascript");
    scriptTag.setAttribute("src", actualRoute.pathJS);

    // --- NOUVEAU : Attendre que le script soit chargé avant d'appeler la fonction d'initialisation ---
    scriptTag.onload = () => {
        console.log(`Script chargé avec succès : ${actualRoute.pathJS}`);
        // Appeler la fonction d'initialisation spécifique à la page
        // Assurez-vous que la fonction initializeCovoituragePage est accessible globalement (par exemple, attachée à window)
        if (typeof window.initializeCovoituragePage === 'function') {
            window.initializeCovoituragePage(); // Appelle la fonction d'initialisation de covoiturage.js
        } else {
            console.error(`Erreur : La fonction initializeCovoituragePage n'est pas définie ou accessible dans ${actualRoute.pathJS}`);
        }
    };

    // Gérer les erreurs de chargement du script
    scriptTag.onerror = () => {
        console.error(`Erreur lors du chargement du script : ${actualRoute.pathJS}`);
    };

    // Ajout de la balise script au corps du document pour qu'il soit chargé et exécuté
    document.body.appendChild(scriptTag); // Ajouter au body est souvent plus sûr
  } else {
      console.log(`Aucun script JS défini pour la route : ${actualRoute.url}`);
      // Si aucun script JS n'est défini, et que la page contient du JS inline ou des écouteurs,
      // vous pourriez avoir besoin d'une autre forme d'initialisation ici si nécessaire.
  }


  // Changement du titre de la page
  document.title = actualRoute.title + " - " + websiteName;
  // Afficher et Masquer les éléments en fonction du rôle
  showAndHideElementsForRoles();
};

// Fonction pour gérer les événements de routage (clic sur les liens)
const routeEvent = (event) => {
  event = event || window.event;
  event.preventDefault();

  // Mise à jour de l'URL dans l'historique du navigateur
  window.history.pushState({}, "", event.target.href);

  // Chargement du contenu de la nouvelle page
  LoadContentPage();

};

// Gestion de l'événement de retour en arrière dans l'historique du navigateur
window.onpopstate = LoadContentPage;

// Assignation de la fonction routeEvent à la propriété route de la fenêtre
window.route = routeEvent; // Permet d'appeler route() depuis le HTML (onclick="route()")

// Chargement du contenu de la page au chargement initial
LoadContentPage();
