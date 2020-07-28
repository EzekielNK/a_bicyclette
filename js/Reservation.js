class Reservation {
    constructor () {
        
        // --> Gestion de l'affichage des blocs.
        this.blocReservation = document.getElementById("block__reservation");
        this.blocCanvas = document.getElementById("bloc__canvas");
        this.messageReservation = document.getElementById("message__reservation");
        this.btnConfirmerRes = document.getElementById("btn__canvas__confirmer");
        this.btnEffaceCanvas = document.getElementById("btn__canvas__annuler");
        this.btnAnnulerRes = document.getElementById("btn__annuler__reservation");

        // --> Vous dormez, la data travail.
        //this.infosRes = document.getElementById("station");
        this.infosClient = document.getElementById("infos__client");
        this.stationStatut = document.getElementById("station__statut");
        this.stationName = document.getElementById("station__name");
        this.placeDispo = document.getElementById("place__dispo");
        this.veloDispo = document.getElementById("velo__dispo");

        // --> Gestion du localstorage.
        this.formulaireReservation = document.getElementById("formulaire__reservation");
        this.resNom = localStorage.getItem("nom");
        this.resPrenom = localStorage.getItem("prenom");
        this.resEnCours = sessionStorage.getItem("resEnCours");

        // --> Gestion pour la réservation.
        this.possibleReservation = null;
        this.validationInfoRes = null;
        this.resteNbVelo = document.getElementById("reste__velo");
        this.veloRes = document.getElementById("velo__reserver");

        // --> Gestion du Chonomètre
        this.compteurChrono = document.getElementById("compteur__chrono");
        this.chrono = null;
        this.tempsReservationMax = sessionStorage.getItem("tempsReservationMax");
        this.dateReservation = sessionStorage.getItem("dateReservation");
        this.dateExpire = sessionStorage.getItem("dateExpire");

        // --> Un écouteur réactif à chaque clic sur une station.
        this.ecouteMarker = document.addEventListener("markerClick", (e) => {
            this.captureInfosMarker(e.detail);
            this.testAffichage(e.detail);
            this.afficheBlocReservation();
            this.testnbVelo(e.detail);
            
        });

        // --> Un écouteur réactif à la validation de la signature canvas et qui lancera automatiquement la réservation du client.
        this.ecouteMessConfRes = document.addEventListener("newMessConfRes", (e) => {
            this.saveReservation(e.detail);
        });
    }

    initStorage() {
        try{   
            if (sessionStorage.resEnCours === undefined) { // --> Si le client n'a jamias fait de réservation
                this.resEnCours = 0;
                sessionStorage.setItem("resEnCours", this.resEnCours);
            }
        } catch (e) {
            console.log(e);
        }   
    };

                    /* --> Affichage des blocs en fonctions de la réservation du client
                    ========================================================================== */

    // --> Affiche le bloc de réservation
    afficheBlocReservation() {
        try{
            this.blocReservation.hidden = true; // --> On me voit plus
            this.blocCanvas.hidden = true;
            this.messageReservation.hidden = true;
            this.veloDispo.hidden = false;
            if (this.possibleReservation == true) { // --> Si on peut réserver
                this.blocReservation.hidden = false; // --> On me voit
                this.formulaireReservation.hidden = false; // --> On me voit aussi
                    let ancre = document.getElementById("last__ancre"); // --> Mouvement en direction du bloc de réservation
                        ancre.scrollIntoView();
                        ancre.scrollIntoView(false);
                        ancre.scrollIntoView({block: "end"});
                        ancre.scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"});
            } else if (this.possibleReservation === false) { // --> Sinon 
                this.blocReservation.hidden = false; // --> On me voit 
                this.formulaireReservation.hidden = true; // --> on me voit plus et vous ne pouvez pas réserver
            } 
        } catch (e) {
            console.log(e);
        }
    }

    // --> Affiche le bloc signature.
    afficheBlocSignature() {
        try{
            this.blocCanvas.hidden = true;
            this.formulaireReservation.addEventListener("submit", (e) => {
                e.preventDefault();
                let regexEspace = /^\S*$/; // --> Interdiction des espaces mon test en cours 23:44
                let regexLettre = /^[a-zA-Z-]{3,20}$/; // --> Min: 3 lettres, Max: 20 lettres
                if (regexEspace.test(this.formulaireReservation.nom.value) && regexEspace.test(this.formulaireReservation.prenom.value) && regexLettre.test(this.formulaireReservation.nom.value) && regexLettre.test(this.formulaireReservation.prenom.value)) {
                    this.validationInfoRes = true;
                    this.veloDispo.hidden = true;
                    this.resteNbVelo.hidden = false;
                    this.veloRes.hidden = false;
                    this.blocCanvas.hidden = false;
                    this.btnConfirmerRes.hidden = true;
                    this.btnEffaceCanvas.hidden = true;
                    this.checkRes();
                    let ancreOne = document.getElementById("last__ancre");
                        ancreOne.scrollIntoView();
                        ancreOne.scrollIntoView(false);
                        ancreOne.scrollIntoView({block: "end"});
                        ancreOne.scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"});
                    
                } else {
                    alert("N'utilisez pas d'espaces, ni de chiffres, ni trop de caractères spéciaux, et renseignez entre 3 et 20 caractère(s) pour chacun des champs du formulaire !");
                    this.validationInfoRes = false;
                    this.blocCanvas.hidden = true;
                    this.resteNbVelo.hidden = true;
                    this.veloRes.hidden = true;
                    this.veloDispo.hidden = false;
                }
            });
        } catch(e) {
            console.log(e);
        }
    }

                    /* --> Fin de l'affichage des blocs
                    ========================================================================== */

   

    
    // --> Sauvegarde de tout les infos nécessaire à une réservation.
    saveReservation() {
        try {
            if (this.validationInfoRes === true) {
                this.resetTimer();
                this.resPreNom = this.formulaireReservation.prenom.value
                this.resNom = this.formulaireReservation.nom.value
                this.resEnCours = 1;
                this.tempsReservationMax = 1200000; // 20 minutes en millisecondes
                this.dateReservation = Date.now();
                this.dateExpire = this.dateReservation + this.tempsReservationMax;
                localStorage.setItem("nom", this.resNom);
                localStorage.setItem("prenom", this.resPreNom);
                sessionStorage.setItem("station__name", this.stationName.textContent);
                sessionStorage.setItem("resEnCours", this.resEnCours);
                sessionStorage.setItem("tempsReservationMax", this.tempsReservationMax);
                sessionStorage.setItem("dateReservation", this.dateReservation);
                sessionStorage.setItem("dateExpire", this.dateExpire);
                this.chrono = setInterval(() => {
                    this.timer();
                }, 1000);
                
                this.testAffichage();
                this.resAnnulation(); // --> Donner le choix d'annuler une réservation manuellement a l'utilisateur
            }
        } catch (e) {
            console.log(e);
        }
    }
    
    // --> Convertir le temps ms en minutes et secondes
    convertir(temps) {
        let minutes = parseInt(temps / 60);
        let secondes = parseInt(temps % 60);
        return `Annulation dans ${minutes} minutes ${secondes}s`;

    }

    // --> Chonomètre
    timer() {
        this.dateExpire = sessionStorage.getItem("dateExpire");
        this.chrono = this.dateExpire - Date.now();
        this.compteurChrono.textContent = this.convertir(this.chrono / 1000);
        if (this.chrono <= 0) {
            this.compteurChrono.textContent = "La limite de temps à expirer, votre réservation a été annuler.";
            clearInterval(this.chrono);
            this.resetTimer();
            this.resEnCours = 0;
            sessionStorage.setItem("resEnCours", 0);
        }
    }

    // --> remise a zéro du Chonomètre.
    resetTimer() {
        try {
            this.tempsReservationMax = 0;
            sessionStorage.setItem("tempsReservationMax", this.tempsReservationMax);
            clearInterval(this.chrono);
        } catch (e) {
            console.log(e);
        }
    }

    // --> Annuler une réservation en cours
    resAnnulation() {
        try{
            this.btnAnnulerRes.addEventListener("click", (e) => {
                e.preventDefault();
                this.resEnCours = 0;
                sessionStorage.setItem("resEnCours", this.resEnCours);
                this.resetTimer();
                this.messageReservation.hidden = true;
                alert(`Votre annulation de réservation a bien été prise en compte.`)
                
                let nouvelleAnnulation = new CustomEvent("nouvelleAnnulation", {});
                document.dispatchEvent(nouvelleAnnulation);
            })
        } catch (e) {
            console.log(e);
        }
    }
    
    // --> Les données relative à la station sélectionner
    captureInfosMarker(data) {
        try {
            this.stationName;
            this.stationName.textContent = data.name;
            this.placeDispo;
            this.placeDispo.textContent = data.available_bike_stands;
            this.placeDispo.style.color = '#64ae11';
            this.veloDispo;
            this.veloDispo.textContent = `${data.available_bikes}`;
            this.veloDispo.style.color = "#64ae11";

            sessionStorage.getItem("station__name")
            this.formulaireReservation.nom.value = localStorage.getItem("nom");
            this.formulaireReservation.prenom.value = localStorage.getItem("prenom");
            
        
            if ((data.status === "OPEN") && (data.available_bikes > 0)) {
                this.stationStatut.textContent = "Station Ouverte";
                this.stationStatut.style.color = "#64ae11";
                this.possibleReservation = true;
            } else if ((data.status === "OPEN") && (data.available_bikes === 0)) {
                this.stationStatut.textContent = "Station Ouverte: Rendre son vélo uniquement";
                this.stationStatut.style.color = "#FF6A00";
                this.possibleReservation = false;
            } else {
                this.stationStatut.textContent = "Station Fermée";
                this.stationStatut.style.color = "#ff1e05";
                this.possibleReservation = false;
            };
                  
        } catch (e) {
            console.log(e);
        };
    };

    // --> Décompte de vélo après validation infos formulaire
    testnbVelo(data) {
        try{
            if (this.possibleReservation == true && data.available_bikes >= 1) {
                this.resteNbVelo.textContent = `${data.available_bikes -1}`;
                this.resteNbVelo.style.color = "#64ae11";
                this.resteNbVelo.hidden = true;

                this.veloRes.textContent = " 1 vélo réservé";
                this.veloRes.style.color = "#64ae11";
                this.veloRes.hidden = true;
            }
        } catch (e) {
            console.log(e);
        }
    }

    // --> on check s'il y a déjà une réservation en cours avant de faire une nouvelle réservation.
    checkRes() {
        try{
            if (this.resEnCours == 0) {
                this.blocCanvas.hidden = false;
            } else {
                let confirmationEcrasage = window.confirm(`Votre navigateur nous informe que vous avez déjà effectué une réservation. Cette nouvelle reservation ecrasera l'ancienne.`);
                if (confirmationEcrasage === true) { // Si l'utilisateur confirme, on lancera une nouvelle sauvegarde automatique de réservation qui écrassera l'ancienne.
                       this.blocReservation.hidden = true;
                      this.blocCanvas.hidden = true;
                      this.messageReservation.hidden = false;
                      this.saveReservation();
                } else { // --> sinon reprise de la réservation en cours
                    this.blocReservation.hidden = true;
                    this.blocCanvas.hidden = true;
                    this.messageReservation.hidden = false;
                }
            }
        } catch (e) {
            console.log(e);
        }
    }

    // --> Affichage des infos de la réservation.
    testAffichage() {
        try{
            if (this.resEnCours == 1 && localStorage.getItem("nom") != null && localStorage.getItem("prenom") != null && sessionStorage.getItem("station__name") != null) {
                this.formulaireReservation.nom.value;
                this.formulaireReservation.prenom.value;
                this.infosClient.textContent = localStorage.getItem("nom") + " " + localStorage.getItem("prenom"); 
                this.infosRes = document.getElementById("station");
                this.infosRes.textContent = sessionStorage.getItem("station__name");
            }  
        } catch (e) {
            console.log(e);
        }
    }
    // --> Gestion du refresh du navigature.
    refresh() {
        try{
            window.addEventListener("load", () => {
                if (sessionStorage.resEnCours == 1) {
                    this.chrono = setInterval(() => {
                        this.timer();
                    }, 1000);
                    this.messageReservation.hidden = false;
                    this.resAnnulation();
                    this.testAffichage();
                }
            });
        } catch (e) {
            console.log(e);
        }
    }
}
