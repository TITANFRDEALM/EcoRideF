    // Ce fichier script (covoiturage.js) DOIT définir une fonction d'initialisation
    // que votre routeur pourra appeler après avoir chargé le HTML de cette page.

    // Encapsulez toute la logique d'initialisation dans une fonction
    function initializeCovoituragePage() {
        console.log('DEBUG: initializeCovoituragePage() appelée.'); // Message de debug au début de la fonction

        // 1. Récupérer les éléments importants
        // Ces éléments doivent exister dans le DOM au moment où cette fonction est appelée.
        const searchForm = document.getElementById('search-form');
        const departureInput = document.getElementById('departure');
        const destinationInput = document.getElementById('destination');
        const resultsSection = document.getElementById('results-section');
        const filtersSection = document.getElementById('filters-section');
        const rideListingsDiv = document.getElementById('ride-listings');
        const noResultsMessageDiv = document.getElementById('no-results-message');

        // Récupérer les éléments de filtre
        const filterEcoCheckbox = document.getElementById('filter-eco');
        const filterPriceInput = document.getElementById('filter-price');
        const filterDurationInput = document.getElementById('filter-duration');
        const filterRatingInput = document.getElementById('filter-rating');
        const resetFiltersButton = document.getElementById('reset-filters');


        // --- Vérification des éléments ---
        if (!searchForm) { console.error('DEBUG: Erreur! Formulaire de recherche (#search-form) non trouvé. Le script ne peut pas s\'attacher.'); return; }
        if (!departureInput) { console.error('DEBUG: Erreur! Champ départ (#departure) non trouvé.'); return; }
        if (!destinationInput) { console.error('DEBUG: Erreur! Champ destination (#destination) non trouvé.'); return; }
        if (!resultsSection) { console.error('DEBUG: Erreur! Section résultats (#results-section) non trouvée.'); return; }
        if (!filtersSection) { console.error('DEBUG: Erreur! Section filtres (#filters-section) non trouvée.'); return; }
        if (!rideListingsDiv) { console.error('DEBUG: Erreur! Div liste résultats (#ride-listings) non trouvée.'); return; }
        if (!noResultsMessageDiv) { console.error('DEBUG: Erreur! Message aucun résultat (#no-results-message) non trouvé.'); return; }
         if (!filterEcoCheckbox || !filterPriceInput || !filterDurationInput || !filterRatingInput || !resetFiltersButton) {
             console.warn('DEBUG: Attention: Un ou plusieurs éléments de filtre ne sont pas trouvés. Le filtrage pourrait ne pas fonctionner correctement.'); // Changé en warn car pas bloquant
         }
        console.log('DEBUG: Tous les éléments nécessaires trouvés.');


        // Sélectionne les résultats fictifs présents dans le HTML au chargement
        // On utilise querySelectorAll car il y en a potentiellement plusieurs
        // Note: Ces éléments doivent être présents dans le HTML chargé par le routeur.
        const fictitiousResults = document.querySelectorAll('.fictitious-ride-listing');

        // Stocke les résultats fictifs dans un tableau pour pouvoir les filtrer
        const allFictitiousRides = Array.from(fictitiousResults);

        // Stocke les résultats de la recherche initiale (avant application des filtres)
        let currentSearchResults = []; // Ce tableau sera rempli après une recherche réussie

        // Optionnel: Retirer les résultats fictifs du HTML au chargement si vous voulez
        // que ride-listings soit vide tant que la recherche n'est pas faite.
        // Dans ce cas, le JS les remettra au besoin.
         fictitiousResults.forEach(result => result.remove());
         console.log(`DEBUG: Nombre de résultats fictifs trouvés et retirés initialement: ${allFictitiousRides.length}`);


        // 2. Cacher les sections filtre et résultats au chargement (déjà fait en CSS, mais bonne pratique de le confirmer en JS si besoin)
        resultsSection.style.display = 'none';
        filtersSection.style.display = 'none';
        noResultsMessageDiv.classList.add('d-none');
        console.log('DEBUG: Sections résultats et filtres cachées initialement (via JS).');

        console.log('DEBUG: Attachement de l\'écouteur d\'événement "submit" au formulaire de recherche.');
        // 3. Écouter la soumission du formulaire de recherche
        searchForm.addEventListener('submit', function(event) {
            console.log('DEBUG: Événement submit intercepté.');
            event.preventDefault();
            console.log('DEBUG: Comportement par défaut empêché.');

            const departure = departureInput.value.trim().toLowerCase();
            const destination = destinationInput.value.trim().toLowerCase();
            const travelDate = document.getElementById('travel-date').value;

            console.log(`DEBUG: Recherche simulée pour: Départ=${departure}, Destination=${destination}, Date=${travelDate}`);

            // Simulation de la recherche - Filtre les résultats fictifs en fonction des villes de départ et d'arrivée saisies
            currentSearchResults = allFictitiousRides.filter(rideElement => {
                const rideDeparture = rideElement.dataset.departure;
                const rideDestination = rideElement.dataset.destination;

                return rideDeparture === departure && rideDestination === destination;
            });

            console.log(`DEBUG: Simulation: Résultats trouvés après filtrage initial (par villes) (${currentSearchResults.length})`);

            // Appliquer les filtres immédiatement après la recherche initiale
            applyFilters();

            // Afficher la section résultats
            resultsSection.style.display = 'block';
            console.log('DEBUG: Affichage de la section résultats.');
        });

        // --- Logique de filtrage ---

        // Fonction pour appliquer les filtres aux résultats actuellement chargés
        function applyFilters() {
            console.log('DEBUG: applyFilters() appelée.');

            // Récupérer les valeurs des filtres avec validation simple
            const maxPrice = filterPriceInput ? parseFloat(filterPriceInput.value) : NaN;
            const maxDuration = filterDurationInput ? parseInt(filterDurationInput.value) : NaN;
            const minRating = filterRatingInput ? parseFloat(filterRatingInput.value) : NaN;
            const isEcoChecked = filterEcoCheckbox ? filterEcoCheckbox.checked : false;

            console.log(`DEBUG: Filtres actuels - Prix Max: ${maxPrice}, Durée Max: ${maxDuration}, Note Min: ${minRating}, Éco: ${isEcoChecked}`);


            // Vider la liste actuelle des résultats avant d'afficher les résultats filtrés
            rideListingsDiv.innerHTML = '';
            noResultsMessageDiv.classList.add('d-none');
            console.log('DEBUG: Liste de résultats vidée pour l\'application des filtres.');


            let filteredResults = currentSearchResults.filter(rideElement => {
                // Récupérer les données du trajet depuis les attributs data
                const ridePrice = parseFloat(rideElement.dataset.price);
                const rideDuration = parseInt(rideElement.dataset.duration);
                const rideRating = parseFloat(rideElement.dataset.rating);
                const rideEco = rideElement.dataset.eco === 'true'; // Convertit la chaîne 'true'/'false' en booléen

                let passesFilter = true;

                // Filtrer par prix maximum
                if (!isNaN(maxPrice) && ridePrice > maxPrice) {
                    passesFilter = false;
                }

                // Filtrer par durée maximum
                if (!isNaN(maxDuration) && rideDuration > maxDuration) {
                    passesFilter = false;
                }

                // Filtrer par note minimum
                if (!isNaN(minRating) && rideRating < minRating) {
                     passesFilter = false;
                }

                // Filtrer par écologique (si la case est cochée)
                if (isEcoChecked && !rideEco) {
                    passesFilter = false;
                }

                return passesFilter; // Inclure le résultat s'il passe tous les filtres
            });

            console.log(`DEBUG: Résultats après application des filtres (${filteredResults.length})`);


            if (filteredResults.length > 0) {
                // Il y a des résultats après filtrage
                rideListingsDiv.style.display = 'flex'; // Afficher la liste

                // Ajouter les résultats filtrés à la liste
                 filteredResults.forEach(resultElement => {
                     // Cloner l'élément
                     const clonedElement = resultElement.cloneNode(true);
                     // Trouver le lien "Voir le trajet" dans l'élément cloné
                     const detailLink = clonedElement.querySelector('.view-detail-btn');
                     // Récupérer l'ID de l'élément original, utiliser un ID par défaut si manquant
                     const tripId = resultElement.dataset.id || '1'; // NOUVEAU: Utilise '1' comme ID par défaut si data-id est manquant

                     // Définir l'attribut href
                     if (detailLink) {
                         detailLink.href = `/detailsRide/${tripId}`;
                         console.log(`DEBUG: Lien "Voir le trajet" mis à jour pour ID ${tripId}: ${detailLink.href}`);
                     } else {
                         console.warn(`DEBUG: Lien "Voir le trajet" (.view-detail-btn) non trouvé dans l'élément cloné pour ID ${tripId}.`);
                     }

                     rideListingsDiv.appendChild(clonedElement); // Ajouter l'élément cloné (avec href mis à jour)
                 });
                 console.log(`DEBUG: Résultats filtrés ajoutés à la liste.`);

                // Afficher la section des filtres SI il y a PLUS d'un résultat DANS LA RECHERCHE INITIALE (currentSearchResults)
                // et SI les éléments de filtre existent.
                 if (currentSearchResults.length > 1 && filtersSection) {
                     filtersSection.style.display = 'block';
                     console.log('DEBUG: Affichage de la section filtres (basé sur les résultats initiaux).');
                 } else if (filtersSection) {
                     filtersSection.style.display = 'none';
                     console.log('DEBUG: Masquage de la section filtres (1 résultat initial ou moins ou éléments manquants).');
                 }


            } else {
                // Aucun résultat après filtrage
                rideListingsDiv.style.display = 'none';
                noResultsMessageDiv.classList.remove('d-none');
                 // On garde l'affichage de la section filtre si elle était déjà visible (basé sur currentSearchResults.length)
                 if (currentSearchResults.length <= 1 && filtersSection) {
                     filtersSection.style.display = 'none'; // Masquer les filtres si la recherche initiale n'en justifiait pas
                 }
                console.log('DEBUG: Aucun résultat après filtrage. Affichage du message "aucun résultat".');
            }

        }

        // --- Écouteurs d'événements pour les filtres ---

        // Appliquer les filtres chaque fois qu'une valeur de filtre change
        if (filterPriceInput) filterPriceInput.addEventListener('input', applyFilters);
        if (filterDurationInput) filterDurationInput.addEventListener('input', applyFilters);
        if (filterRatingInput) filterRatingInput.addEventListener('input', applyFilters);
        if (filterEcoCheckbox) filterEcoCheckbox.addEventListener('change', applyFilters);

        console.log('DEBUG: Écouteurs d\'événements ajoutés aux champs de filtre.');


        // Gérer le bouton "Réinitialiser"
        if (resetFiltersButton) {
            resetFiltersButton.addEventListener('click', function() {
                console.log('DEBUG: Bouton Réinitialiser cliqué.');
                // Réinitialiser les valeurs des champs de filtre
                if (filterPriceInput) filterPriceInput.value = '';
                if (filterDurationInput) filterDurationInput.value = '';
                if (filterRatingInput) filterRatingInput.value = '';
                if (filterEcoCheckbox) filterEcoCheckbox.checked = false;

                // Appliquer les filtres (ce qui affichera tous les résultats de la recherche initiale)
                applyFilters();
                console.log('DEBUG: Filtres réinitialisés et applyFilters() appelée.');
            });
             console.log('DEBUG: Écouteur d\'événement ajouté au bouton Réinitialiser.');
        }


        console.log('DEBUG: Fin de initializeCovoituragePage().');
    }

    // IMPORTANT: Ne pas appeler initializeCovoituragePage() ici directement.
    // C'est le routeur qui doit l'appeler après avoir chargé le HTML.

    // Pour que le routeur puisse y accéder, vous pourriez avoir besoin de l'attacher
    // à l'objet window si vous n'utilisez pas de modules ES6, par exemple :
     window.initializeCovoituragePage = initializeCovoituragePage;