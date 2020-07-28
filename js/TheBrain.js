/* <!-- The brain
        ========================================================================== --> */

class TheBrain {
    constructor () {
        this.newSlider = new Slider;
        this.newLyon = new Lyon;
        this.newReservation = new Reservation;
        this.newDessineMoiUnMouton = new Canvas;
    }

    initBrain() {
        this.newSlider.initControles(); // --> Activation du slider

        this.newLyon.initMap() // --> Affichage de la Google Map.
        this.newLyon.apiJcDecaux() // --> Vous dormez la data travail.

        this.newLyon.jeSuisUnelegende() // --> Je suis une légende

        this.newReservation.initStorage() // --> Activation pour les réservation
        this.newReservation.afficheBlocReservation() // --> Gestion des blocks d'affichages
        this.newReservation.afficheBlocSignature()
        this.newReservation.refresh() // --> Gestion du refresh et suite a la fermeture du navigateur

        this.newDessineMoiUnMouton.initCanvas() // --> Activation Dessine moi un mouton
        this.newDessineMoiUnMouton.affichageMessConfirmer() // --> Affichage du message de réservation.
    }
}

/* <!-- ACTIVATION The brain ......
        ========================================================================== --> */

let activation__IA = new TheBrain
activation__IA.initBrain()