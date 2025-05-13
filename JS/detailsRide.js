    // Ce script (detail-trajet.js) doit définir une fonction d'initialisation
    // que votre routeur pourra appeler après avoir chargé le HTML de cette page.

    function initializeDetailTrajetPage() {
        console.log('DEBUG: initializeDetailTrajetPage() appelée.');

        // 1. Récupérer l'ID du trajet depuis l'URL
        // Par exemple, si l'URL est /detail-trajet/123, l'ID est 123
        const urlParams = new URLSearchParams(window.location.search);
        const tripId = window.location.pathname.split('/').pop(); // Extrait l'ID si l'URL est /detail-trajet/ID

        console.log(`DEBUG: ID du trajet à charger : ${tripId}`);

        // 2. Simuler le chargement des données détaillées du trajet
        // En réalité, vous feriez un appel API ici : fetch(`/api/trips/${tripId}/details`)
        const tripDetails = simulateFetchTripDetails(tripId);

        if (tripDetails) {
            // 3. Remplir les éléments HTML avec les données chargées
            document.getElementById('detail-trip-route').textContent = `${tripDetails.departure} → ${tripDetails.destination}`;
            document.getElementById('detail-trip-date').textContent = tripDetails.date;
            document.getElementById('detail-trip-time').textContent = tripDetails.time;
            document.getElementById('detail-trip-price').textContent = `${tripDetails.price} €`;
            document.getElementById('detail-trip-seats').textContent = tripDetails.seats;
            document.getElementById('detail-trip-details').textContent = tripDetails.details || 'Aucun commentaire.';

            document.getElementById('detail-driver-name').textContent = tripDetails.driver.name;
            document.getElementById('detail-driver-rating').textContent = tripDetails.driver.rating.toFixed(1); // Affiche avec une décimale

            document.getElementById('detail-car-model').textContent = `${tripDetails.driver.car.make} ${tripDetails.driver.car.model}`;
            document.getElementById('detail-car-energy').textContent = tripDetails.driver.car.energy;
            const ecoIconContainer = document.getElementById('detail-car-eco-icon');
            if (ecoIconContainer) {
                if (tripDetails.driver.car.isEcoFriendly) {
                    ecoIconContainer.innerHTML = '<i class="fas fa-leaf text-success"></i>';
                } else {
                    ecoIconContainer.innerHTML = ''; // Masque l'icône si pas écologique
                }
            }


            document.getElementById('detail-driver-preferences').textContent = tripDetails.driver.preferences.join(', ') || 'Aucune préférence spécifiée.';

            // 4. Afficher les avis
            const reviewsListDiv = document.getElementById('driver-reviews-list');
            const noReviewsMessage = document.getElementById('no-reviews-message');
            reviewsListDiv.innerHTML = ''; // Vider la liste actuelle

            if (tripDetails.driver.reviews && tripDetails.driver.reviews.length > 0) {
                tripDetails.driver.reviews.forEach(review => {
                    const reviewElement = document.createElement('div');
                    reviewElement.classList.add('review-item');
                    reviewElement.innerHTML = `
                        <p class="mb-1"><strong>${review.user}</strong> <span class="text-muted small">- Note : ${review.rating} <i class="fas fa-star text-warning"></i></span></p>
                        <p class="mb-0">${review.comment}</p>
                    `;
                    reviewsListDiv.appendChild(reviewElement);
                });
                 noReviewsMessage.style.display = 'none'; // Cacher le message "aucun avis"
            } else {
                 noReviewsMessage.style.display = 'block'; // Afficher le message "aucun avis"
            }


        } else {
            console.error(`DEBUG: Détails du trajet avec l'ID ${tripId} non trouvés.`);
            // Afficher un message d'erreur à l'utilisateur
            document.getElementById('trip-details-container').innerHTML = '<div class="alert alert-danger text-center">Détails du trajet non trouvés.</div>';
        }

         console.log('DEBUG: Fin de initializeDetailTrajetPage().');
    }

    // --- Simulation de la récupération des données détaillées ---
    // En réalité, cette fonction ferait un appel API à votre backend.
    function simulateFetchTripDetails(tripId) {
        console.log(`DEBUG: Simulation de la récupération des détails pour le trajet ID: ${tripId}`);
        // Données fictives basées sur l'ID
        const mockData = {
            '1': { // ID 1 pourrait correspondre à un trajet Paris->Lyon
                departure: 'Paris',
                destination: 'Lyon',
                date: '2025-05-20',
                time: '08:00',
                price: 35,
                seats: 2,
                details: 'Rendez-vous près de la Gare de Lyon.',
                driver: {
                    name: 'Jean Dupont',
                    rating: 4.5,
                    car: { make: 'Peugeot', model: '308', energy: 'Essence', isEcoFriendly: false },
                    preferences: ['Non fumeur', 'Musique douce'],
                    reviews: [
                        { user: 'Alice', rating: 5, comment: 'Très bon trajet, conducteur sympa !' },
                        { user: 'Bob', rating: 4, comment: 'À l\'heure, voiture propre.' }
                    ]
                }
            },
             '2': { // ID 2 pourrait correspondre à un trajet Lyon->Marseille
                departure: 'Lyon',
                destination: 'Marseille',
                date: '2025-05-21',
                time: '14:30',
                price: 28,
                seats: 3,
                details: 'Départ depuis le centre-ville.',
                driver: {
                    name: 'Sophie Martin',
                    rating: 4.0,
                    car: { make: 'Renault', model: 'Clio', energy: 'Électrique', isEcoFriendly: true },
                    preferences: ['Animaux acceptés', 'Conversation'],
                    reviews: [
                        { user: 'Charlie', rating: 4, comment: 'Trajet agréable, Sophie est une bonne conductrice.' }
                    ]
                }
            },
             '3': { // ID 3 pourrait correspondre à un autre trajet Paris->Lyon
                departure: 'Paris',
                destination: 'Lyon',
                date: '2025-05-20',
                time: '10:00',
                price: 32,
                seats: 1,
                details: 'Point de RDV flexible à Paris.',
                driver: {
                    name: 'Pierre Dubois',
                    rating: 4.8,
                    car: { make: 'Citroën', model: 'C4', energy: 'Diesel', isEcoFriendly: false },
                    preferences: ['Bagages volumineux acceptés'],
                    reviews: [
                        { user: 'David', rating: 5, comment: 'Parfait ! Très arrangeant.' },
                        { user: 'Eva', rating: 5, comment: 'Voyage confortable et rapide.' },
                        { user: 'Frank', rating: 4, comment: 'Bonne expérience globale.' }
                    ]
                }
            }
            // Ajoutez d'autres données fictives pour d'autres IDs si nécessaire
        };

        // Retourne les données pour l'ID demandé, ou undefined si non trouvé
        return mockData[tripId];
    }


    // IMPORTANT: Si vous utilisez un routeur, cette fonction initializeDetailTrajetPage
    // doit être appelée par votre routeur après le chargement du HTML de cette page.
    // Pour que le routeur puisse y accéder, attachez-la à window:
     window.initializeDetailTrajetPage = initializeDetailTrajetPage;

    // Dans un script autonome (sans routeur), vous appelleriez ceci après DOMContentLoaded:
    // document.addEventListener('DOMContentLoaded', initializeDetailTrajetPage);
