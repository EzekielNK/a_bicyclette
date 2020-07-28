
/* Gestionnaire du Diaporama (Slider)
   ========================================================================== */

class Slider {
    constructor() {
        this.gauche = document.getElementById("bouton__gauche");
        this.droite = document.getElementById("bouton__droit");
        this.pause = document.getElementById("pause");
        this.play = document.getElementById("play");
        this.images = document.querySelectorAll(".img__slider");
        this.overlay = document.querySelectorAll(".overlay");
        this.cercle = document.querySelectorAll(".cercles");
        
        this.slideAuto = null;
        this.imageActuelle = 0;
        this.vitesse = 5000; 
    };
    
    // --> Reinitialiser l'affichage et pour en conserver une si le script n'est pas chargé ou desactive
    reset() {
        for (let i = 0; i < this.images.length; i ++) {
            this.images[i].classList.add("invisible");
            this.cercle[i].style.transform = "none";
            this.overlay[i].classList.remove("apparition");
        };
        if (this.imageActuelle === this.images.length) {
            this.imageActuelle = 0;
        };
        if (this.imageActuelle === - 1) {
            this.imageActuelle = this.images.length - 1;
        };
        this.affichage();
    };

    // --> gerer l'animation (images, cercles, et overlay du diaporama)
    affichage() {
        this.images[this.imageActuelle].classList.remove("invisible");
        this.cercle[this.imageActuelle].style.transform = "scale(1.2)";
        this.overlay[this.imageActuelle].classList.add("apparition");
    };

    // Images suivante
    suivImg() {
        this.imageActuelle ++;
        this.reset();
    };
    
    // Image précédente
    precImg() {
        this.imageActuelle --;
        this.reset();
    };
    // bouger les images avec le clavier
    touchesClavier(e) {
        if (e.key === "ArrowRight" || e.key === "Right") {
            this.suivImg();
        } else if (e.key === "ArrowLeft" || e.key === "Left") {
            this.precImg();
        }
        
    };

    // mode lecture
    lecture() {
        this.play.classList.add("invisible");
        this.pause.classList.remove("invisible");
        this.slideAuto = setInterval(this.suivImg.bind(this), this.vitesse);
    };

    // mode pause
    pauseLecture() {
        this.pause.classList.add("invisible");
        this.play.classList.remove("invisible");
        clearInterval(this.slideAuto);
    };

    // --> Evenements (4 boutons + les deux touches de clavier)
    initControles() {
        this.droite.addEventListener("click", this.suivImg.bind(this));
        this.gauche.addEventListener("click", this.precImg.bind(this));
        this.play.addEventListener("click", this.lecture.bind(this));
        this.pause.addEventListener("click", this.pauseLecture.bind(this));
        document.addEventListener("keydown", this.touchesClavier.bind(this));
        this.slideAuto = setInterval(this.suivImg.bind(this), this.vitesse); 
    };
};