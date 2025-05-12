import Route from "./Route.js";

//Définir toutes nos routes
export const allRoutes = [
    new Route("/" , "Accueil", "/Pages/home.html"),
    new Route("/covoiturage" , "Covoiturage", "/Pages/covoiturage.html", "/JS/covoiturage.js"),
    new Route("/contact" , "Contact", "/Pages/contact.html"),
];

//Le titre s'affiche comme ceci : Route.titre = websitename
export const websiteName = "ECORIDE";