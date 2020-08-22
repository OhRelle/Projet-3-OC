class Countdown {
    constructor(stationName, clientName, clientSurname) {
        this.stationName = stationName;
        this.clientName = clientName;
        this.clientSurname = clientSurname;
        this.submit = document.getElementById('submit');
        this.display = document.getElementById('dispo-time');
        this.stationNameHtml = document.getElementById('station-name');
        this.clientNameHtml = document.getElementById('name-reservation');
        this.clientSurnameHtml = document.getElementById('surname-reservation');
        this.timer = document.getElementById('timer');
        this.time = 1200; // Défini le temps en secondes. 20 minutes -> 1200 secondes
        this.minutes = Number;
        this.secondes = Number;
        this.intervalId = null;
        this.timeStorage = null;
    }

    init(){
        this.submit.addEventListener('click', () => this.launchCountdown(this.time));
        // Si stationName n'est pas null alors on l'envoie dans le sessionStorage (ce if n'est donc executé que a la premiere instance de Countdown ( Countdown(name).init()))
        if (this.stationName) {
            sessionStorage.setItem('stationName', this.stationName)
        }
    }

    launchCountdown = (time) => {
        this.intervalId = sessionStorage.getItem('intervalId');
        // Dans le cas ou on lance le compteur, alors le stationName est null. On le défini via le sessionStorage précédament utilisé (ligne 22)
        this.stationName = sessionStorage.getItem('stationName')
        if(this.intervalId){
            clearInterval(this.intervalId);
        }
        this.timer.style.display='flex';
        this.timer.style.opacity='1';  
        this.intervalId = setInterval(() => {
            this.minutes = Math.floor(time / 60);
            this.secondes = Math.floor(time - (this.minutes * 60));
            time--;
            if(this.minutes===0 && this.secondes===0){
                clearInterval(this.intervalId);
                this.display.innerHTML = "Votre réservation est annulée";
                sessionStorage.clear();
                return;
            };  
            this.display.textContent = `Votre vélo est réservé pour une durée de ${this.minutes} min et ${this.secondes} s`;
            sessionStorage.setItem('timeStorage', time);
        }, 1000)
        sessionStorage.setItem('stationName', this.stationName);
        this.stationNameHtml.innerHTML = `${this.stationName}`;
        sessionStorage.setItem('intervalId',this.intervalId);
        sessionStorage.setItem('name',this.clientName);
        this.clientNameHtml.innerHTML = `${this.clientName}`;
        sessionStorage.setItem('surname',this.clientSurname);
        this.clientSurnameHtml.innerHTML = `${this.clientSurname}`;
        
    }

    countdownFromSessionStorage(){
        this.launchCountdown(sessionStorage.getItem('timeStorage'));
    }
}
    