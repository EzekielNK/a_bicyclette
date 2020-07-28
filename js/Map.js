/* Gestionnaire google map
   ========================================================================== */
class Lyon {
    constructor() {
        this.lat = 45.750000;
        this.lng = 4.850000;
        this.carte = null;
        this.marker = "image/marker1.png";
        this.tableauMarkers = [];
        this.stations = [];
    };

    
    // --> Initialisation de la carte google.
    initMap() {
        this.carte = new google.maps.Map(document.getElementById("map__lyon"), {
            center: {
                lat: this.lat,
                lng: this.lng
            },
            zoom: 12,
        }); 
    };

    // --> Ajout d'une légende des markers pour infos visiteurs.
    jeSuisUnelegende() {

        const divElt = document.createElement('div');
        divElt.id = 'legend';
        document.getElementById('map__lyon').appendChild(divElt);

        const titreElt = document.createElement('h3');
        titreElt.textContent = 'Légende';
        document.getElementById('legend').appendChild(titreElt);

        const iconBase = 'image';
        let icons = {
            stattionGreen: {
                name: 'Station Ouverte',
                icon: iconBase + '/marker_green.png'
            },
            stattionOrang: {
                name: 'Rendre son vélo',
                icon: iconBase + '/marker_orang.png'
            },
            stationRed: {
                name: 'Station Fermé',
                icon: iconBase + '/marker_red.png'
            }
        };

        let legend = document.getElementById('legend');
        for (let key in icons) {
            let type = icons[key];
            let name = type.name;
            let icon = type.icon;
            let div = document.createElement('div');
            div.innerHTML = '<img src="' + icon + '"> ' + name;
            legend.appendChild(div);
        }

        this.carte.controls[google.maps.ControlPosition.LEFT_TOP].push(legend);
    };

    /* --> Gestion des données Api JC Decaux avec Fetch Api qui permet de faire des appels AJAX beaucoup plus facilement,
    avec des fonctionnalités plus souples et plus puissantes.*/
    async apiJcDecaux() {
        try{ // --> Cherche les erreurs
            await fetch('https://api.jcdecaux.com/vls/v1/stations?contract=lyon&apiKey=dca631e1fc8cade2906446e4702f07ef118b4048')
            .then(async (response) => { 
                if (response.ok) {
                    return await response.json();
                }
            })
            .then(async (data) => {
                return await data;
            })
            .then((stations) => { // --> Gestion MarkerClusterer.
                stations.forEach(this.ajoutMarker.bind(this));
                this.stations = stations;
                let markerCluster = new MarkerClusterer(this.carte, this.tableauMarkers, {
                    maxZoom: 14,
                    imagePath: 'image/m'
                })
            })
        } catch (e) { // --> Les erreurs trouvées sont ici.
            console.log(e);
        }  
    };

    // --> Gestion des markers en fonction du statut de la station.
    stationOpenClosed(data) {
        if (data.status === "OPEN" && data.available_bikes > 0) {
            this.marker = "image/marker_green.png";
        } else if (data.status === "OPEN" && data.available_bikes === 0) {
            this.marker = "image/marker_orang.png";
        } else {
            this.marker = "image/marker_red.png";
        };
    };
    
    // --> Ajout des markers
    ajoutMarker(data) {
        this.stationOpenClosed(data)

        let marker = new google.maps.Marker({
            map: this.carte,
            title: data.name,
            icon: {
                url: this.marker,
                scaledSize: new google.maps.Size(50, 50)
            },
            position: data.position,
        });
        
        this.tableauMarkers.push(marker);

        // --> Ajout d'un écouteur sur les clics de la souris.
        google.maps.event.addListener(marker, "click", function () { // --> Gérer la communication inter-class 
            let newsMarkerClick = new CustomEvent("markerClick", {detail: data}); // --> Récupère la data de la station sélectionner
            document.dispatchEvent(newsMarkerClick); // --> Distribution de l'event
        })
    };

};
