import Route from "./Route.js";

//Définir toutes nos routes
export const allRoutes = [
    new Route("/" , "Accueil", "/Pages/home.html"),
    new Route("/connexion" , "Connexion", "/Pages/Auth/connexion.html", "/JS/Auth/connexion.js"),
    new Route("/register" , "S'enregistrer", "/Pages/Auth/register.html", "/JS/Auth/register.js"),
    new Route("/account" , "Mon profil", "Pages/Auth/account.html", "JS/Auth/account.js"),
    new Route("/covoiturage" , "Covoiturage", "/Pages/covoiturage.html", "/JS/covoiturage.js"),
    new Route("/contact" , "Contact", "/Pages/contact.html"),
];

//Le titre s'affiche comme ceci : Route.titre = websitename
export const websiteName = "ECORIDE";