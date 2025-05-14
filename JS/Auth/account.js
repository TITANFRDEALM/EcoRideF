// Récupère les éléments du sélecteur de rôle et du formulaire chauffeur
    const userRoleSelect = document.getElementById('user-role');
    const chauffeurForm = document.getElementById('chauffeur-form');

    // Fonction pour afficher ou masquer le formulaire chauffeur
    function toggleChauffeurForm() {
        const selectedRole = userRoleSelect.value;

        // Si le rôle est 'chauffeur' ou 'passager_chauffeur', affiche le formulaire
        if (selectedRole === 'chauffeur' || selectedRole === 'passager_chauffeur') {
            chauffeurForm.style.display = 'block';
        } else {
            // Sinon, le masque
            chauffeurForm.style.display = 'none';
        }
    }

    // --- Exécution du script ---

    // 1. Exécute la fonction une première fois au chargement de la page
    //    pour régler l'état initial en fonction de la valeur sélectionnée
    //    (utile si une option est présélectionnée par le serveur)
    toggleChauffeurForm();

    // 2. Ajoute un écouteur d'événement 'change' au sélecteur de rôle
    //    pour appeler la fonction chaque fois que la sélection change
    userRoleSelect.addEventListener('change', toggleChauffeurForm);

    // Note : Le bouton "Ajouter un véhicule" nécessite du JavaScript supplémentaire
    // pour gérer l'ajout dynamique de champs de véhicule à la div #vehicles-container.
    // Cette logique n'est pas incluse ici mais peut être ajoutée séparément.

    // Note : Le bouton "Enregistrer" et le bouton "Se déconnecter" nécessitent
    // un traitement côté serveur pour effectuer les actions correspondantes.
    // Ce JavaScript ne gère que l'affichage du formulaire.

    
    // Récupère le titre et le conteneur du formulaire
    const settingsToggleH1 = document.getElementById('settingsToggleH1');
    const settingsFormContainer = document.getElementById('settingsFormContainer');

    // Ajoute un écouteur d'événement 'click' au titre
    settingsToggleH1.addEventListener('click', function() {
        // Vérifie si le conteneur est actuellement caché
        if (settingsFormContainer.style.display === 'none') {
            // S'il est caché, l'affiche
            settingsFormContainer.style.display = 'block';
        } else {
            // Sinon (s'il est visible), le cache
            settingsFormContainer.style.display = 'none';
        }
    });

        // Attache le bouton de déconnexion
const logoutBtn = document.getElementById('logout-btn');

if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        logout(); // Cette fonction vient de script.js, qui est global
    });
}