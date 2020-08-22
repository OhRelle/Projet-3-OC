class LeafletMap {
  constructor() {
    this.map = ''
    this.latCity = 43.6;
    this.lngCity = 1.43;
    this.apiKey = 'abd66f165c4efa8460a47fb0ec73559fe93eb879';
    this.city = 'toulouse';
    this.marker = '';
    this.form = document.getElementById('form');
    this.initMap();
    this.loadStation();
  }

  /*Fonction Charger map*/

  initMap() {
    this.map = L.map('mapid').setView([this.latCity, this.lngCity], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);
  }

  /*Charger station */

  loadStation() {
    fetch(`https://api.jcdecaux.com/vls/v1/stations?contract=${this.city}&apiKey=${this.apiKey}`)
      .then(response => response.json())
      .then(data => {
        /*parcourir tableau */
        data.forEach(station => {
          let latitude = station.position.lat;
          let longitude = station.position.lng;
          //Nom de la station
          let name = station.name;
          //Etat de la station Open or Close
          let status = station.status;
          //Adresse de la station
          let address = station.address;
          //Nombre de supports à vélo disponibles
          let availableBikeStands = station.available_bike_stands;
          //Nombre de vélos disponibles
          let availableBikes = station.available_bikes;
          //Nombre de supports à vélo totaux
          let bikeStands = station.bike_stands;

          const LeafIcon = L.Icon.extend({
            options: {
              iconSize: [50, 50],
              iconAnchor: [25, 50],
              popupAnchor: [0, -50]
            }
          });
          const newIconGreen = new LeafIcon({
            iconUrl: 'assets/images/marker_green.png'
          })
          const newIconRed = new LeafIcon({
            iconUrl: 'assets/images/marker_red.png'
          })
          const newIconBlue = new LeafIcon({
            iconUrl: 'assets/images/marker_blue.png'
          })
          const newIconOrange = new LeafIcon({
            iconUrl: 'assets/images/marker_orange.png'
          })

          if (status === 'OPEN' && availableBikeStands > 1 && availableBikes > 1) {
            this.marker = L.marker([latitude, longitude], {
              icon: newIconGreen
            }).addTo(this.map)
          } else if (status === 'CLOSE') {
            this.marker = L.marker([latitude, longitude], {
              icon: newIconRed
            }).addTo(this.map)
          } else if (status === "OPEN" && availableBikeStands > 0 && availableBikes < 1) {
            //Si la station est ouverte ET que Nbre de supports de vélo >0 ET que le Nbre de vélo dispo est <1 alors marqueur orange 
            this.marker = L.marker([latitude, longitude], {
              icon: newIconOrange
            }).addTo(this.map)
          }
          //Si la station est ouverte ET que Nbre de supports de vélo <1 ET que le Nbre de vélo dispo est >0 alors marqueur bleu
          else if (status === "OPEN" && availableBikeStands < 1 && availableBikes > 0) {
            this.marker = L.marker([latitude, longitude], {
              icon: newIconBlue
            }).addTo(this.map)
          }

          if (this.marker) {
            //Si la station est ouverte ET qu'il y a au moins 1 vélo de dispo alors le formulaire apparait
            this.marker.addEventListener('click', () => {
              if (status === 'OPEN' && availableBikes > 1) {
                this.form.style.display = 'flex';
                this.form.style.opacity = '1';
                new Countdown(name).init();
              } else(this.form.style.display = 'none',
                this.form.style.opacity = '0');
            })

            if (status === "CLOSE" || status === "OPEN" && availableBikeStands > 0 && availableBikes < 1) {
              this.marker.bindPopup(`<b> Nom de la Station </b><br> ${name} <br><b><br> Statut : ${status} </b><br><b>Adresse</b><br> ${address} </b><br><b>Nbres de places disponibles</b><br>${availableBikeStands}<br><b>Nbres de vélos disponibles</b><br> ${availableBikes} </br> Merci de choisir une autre station`);
            } else {
              this.marker.bindPopup(`<b> Nom de la Station </b><br> ${name} <br><b><br> Statut : ${status} </b><br><b>Adresse</b><br> ${address} </b><br><b>Nbres de places disponibles</b><br>${availableBikeStands}<br><b>Nbres de vélos disponibles</b><br> ${availableBikes} </br>`);
            }
          }
        })
      })
  }
}
const leafletMap = new LeafletMap()