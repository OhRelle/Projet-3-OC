class Reservation {
    constructor() {
        this.form = document.getElementById('form');
        this.name = document.getElementById('name');
        this.surname = document.getElementById('surname');
        this.button = document.getElementById('button');
        this.recupInfo = document.getElementById("info-reservation");
        this.nameReservation = document.getElementById("name-form-reservation");
        this.surnameReservation = document.getElementById('surname-form-reservation');
        this.canvasForm = document.getElementById('canvas-form');
        this.clientName = null;
        this.clientSurname = null;
        this.sessionStorage = null;

        this.getInfos();
        this.init();

    }

    getInfos() {
        //récupère les valeurs du local storage
        this.clientName = localStorage.getItem('Name');
        this.clientSurname = localStorage.getItem('Surname');
        //si clientName et clientSurname ne sont pas null, pré remplis les champs
        if (this.clientName && this.clientSurname) {
            this.name.setAttribute('value', this.clientName);
            this.surname.setAttribute('value', this.clientSurname);
        }

        this.form.addEventListener('submit', e => {
            e.preventDefault();
            this.canvasForm.style.opacity = '1';
            this.canvasForm.style.display = 'flex';
            this.clientName = this.name.value;
            this.clientSurname = this.surname.value;

            


            //créer localstorage à l'envoi du formulaire
            localStorage.setItem('Name', this.clientName);
            localStorage.setItem('Surname', this.clientSurname);
            new Countdown(null, this.clientName, this.clientSurname).init();
            // Ici on ne connait pas le nom de la station, mais le nom et le prénom. Donc on envoie null, et nom et prénom
        })
    }

    init(){
        this.sessionStorage = sessionStorage.getItem('timeStorage');
        if(this.sessionStorage){
           window.addEventListener('load', ()=> {
            //instance de countdown en appelant la fonction countdownFromSessionStorage()
               new Countdown(sessionStorage.getItem('stationName')).countdownFromSessionStorage();
           })
        }
    }
}

let reservation = new Reservation();