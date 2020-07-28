
class Canvas {
    constructor() {
        // --> Gestion du canvas.
        this.canvas = document.getElementById("canvas");
        this.ctx = canvas.getContext("2d");
        this.dessin = null;

        // --> Gestion du test signature
        this.signatureTest = 0;
        this.validationSignature = 0;
        this.erreurSignature = document.getElementById("erreur__signature");
        
        // --> Gestion validation signature.
        this.btnAnnuler = document.getElementById("btn__canvas__annuler");
        this.btnConfirmerRes = document.getElementById("btn__canvas__confirmer");
        this.btnEffaceCanvas = document.getElementById("btn__canvas__annuler");
        
        // -->Affichage message réservation.
        this.contReservation = document.getElementById("reservation")
        this.blocReservation = document.getElementById("block__reservation");
        this.blocCanvas = document.getElementById("bloc__canvas");
        this.messageReservation = document.getElementById("message__reservation");

        // --> ecoute s'il y a une annulation de réservation
        this.ecouteNouvelleAnnulation = document.addEventListener("nouvelleAnnulation", (e) => {
            this.rest(e.detail);
            this.grilleReperes();
            this.affichageMessConfirmer(e.detail);
        });
    }

                    /* --> Hello Canvas
                                ========================================================================== */
    // --> Méthode qui rend plus facile les dessins sur canvas.
    grilleReperes() {
        try{
            this.ctx.save();
            this.ctx.fillStyle = "rgba(0, 0, 0, 0.87)";
            this.ctx.font = "20px greatvibes-regular";
            this.ctx.fillText("Signature", 10, 140);
            this.ctx.restore();
        } catch (e) { 
            console.log(e);
        }
    }
    
    //--> Effacer le canvas
    rest() {
        canvas.getContext("2d").clearRect(0, 0, 260, 150);
    }

    // --> Position de la souris
    positionSouris(canvas, e) {
        try{
            let rect = this.canvas.getBoundingClientRect();
            return {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
                down: false
            }
        } catch (e) {
            console.log(e);
        };
    }
 
    initCanvas() {
        try{
            let that = this

            that.grilleReperes();
            // --> Dessine moi un mouton (souris)
            function movePos(e) { 
                
                if (that.dessin === null) {
                    that.dessin = 1;
                }

                let signature = that.positionSouris(canvas, e);
                that.ctx.lineWidth = "3"
                that.ctx.lineCap = "round";
                that.ctx.lineTo(signature.x, signature.y);
                that.signatureTest++;
                that.ctx.stroke();
            };

            // --> Effacer la signature.
            that.btnAnnuler.addEventListener("click", function () {
                that.rest();
                that.signatureTest = 0;
                that.btnConfirmerRes.hidden = true;
                that.btnEffaceCanvas.hidden = true;
                that.dessin = null;
                that.grilleReperes();
            });

            // --> Stop le dessin (souris)
            that.canvas.addEventListener("mouseup", function () {
                that.canvas.removeEventListener("mousemove", movePos, false);
                that.regexSignature();
            }, false);

            // --> On peut dessiner (souris)
            that.canvas.addEventListener("mousedown", function (e) {
                let signature = that.positionSouris(canvas, e);
            
                that.ctx.beginPath();
                that.ctx.moveTo(signature.x, signature.y);
                e.preventDefault;
                that.canvas.addEventListener("mousemove", movePos, false);
            });

            // --> Souris hors Canvas
            that.canvas.addEventListener("mouseout", function () {
                that.canvas.removeEventListener("mousemove", movePos, false);
            }, false);

                    /* --> Dessine moi un mouton mobile et tablette
                            ========================================================================== */

            // --> Set up événements tactiles pour mobile et tablette
            let mousePos = { x:0, y:0 };
            
            // --> On peut dessiner (mobile et tablette)
            that.canvas.addEventListener("touchstart", function (e) {
                that.ctx.lineWidth = "3"
                that.ctx.lineCap = "round";
                mousePos = getTouchPos(canvas, e);
                let touch = e.touches[0];
                let mouseEvent = new MouseEvent("mousedown", {
                    clientX: touch.clientX,
                    clientY: touch.clientY
                });
                that.canvas.dispatchEvent(mouseEvent);
                e.preventDefault();
            }, false);

            // --> Stop le dessin (mobile et tablette)
            that.canvas.addEventListener("touchend", function (e) {
                let mouseEvent = new MouseEvent("mouseup", {});
                that.canvas.dispatchEvent(mouseEvent);
            }, false);

            // --> Mouvement (mobile et tablette)
            that.canvas.addEventListener("touchmove", function (e) {
                let touch = e.touches[0];
                let mouseEvent = new MouseEvent("mousemove", {
                    clientX: touch.clientX,
                    clientY: touch.clientY
                });
                that.canvas.dispatchEvent(mouseEvent);
                e.preventDefault();
            }, false);

            // --> Position mobile et tablette
            function getTouchPos(canvasDom, touchEvent) {
                let rect = canvasDom.getBoundingClientRect();
                return {
                    x: touchEvent.touches[0].clientX - rect.left,
                    y: touchEvent.touches[0].clientY - rect.top
                };
            }
        } catch (e) {
            console.log(e);
        }
    }
                    /* --> Affiche le message de confirmation de réservation
                                            ========================================================================== */
    // --> Test de la signature pour éviter de signer avec un point.
    regexSignature() {
        if (this.signatureTest > 40) {
            this.validationSignature = 1;
            this.btnConfirmerRes.hidden = false;
            this.btnEffaceCanvas.hidden = false;
            this.erreurSignature.hidden = true;
        } else {
            if (this.signatureTest < 40) {
                this.validationSignature = 0;
                this.btnConfirmerRes.hidden = true;
                this.btnEffaceCanvas.hidden = true;
                this.erreurSignature.hidden = false;
                this.erreurSignature.textContent = "La signature est incorrect";
                this.erreurSignature.style.color = "#FF0000";
            }
        }
    }

    // --> Une fois la validation de la signature, on autorise la réservation.
    affichageMessConfirmer() { 
        try {
            this.messageReservation.hidden = true
            this.btnConfirmerRes.addEventListener("click", (e) => {
                if (this.validationSignature === 1) {
                    this.blocCanvas.hidden = true;
                    this.blocReservation.hidden = true;
                    this.messageReservation.hidden = false;
                    this.signatureTest = 0;
                    this.rest();
                    this.grilleReperes();
                }
                let newMessConfRes = new CustomEvent("newMessConfRes", {detail: e});
                document.dispatchEvent(newMessConfRes);
            })

        } catch (e) {
            console.log(e);
        }
    }    
}


