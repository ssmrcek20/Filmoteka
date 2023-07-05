const konst= require("../konstante.js");
const express = require('express');
const sesija = require('express-session')
const kolacici = require('cookie-parser')
const Konfiguracija = require("../konfiguracija");
const htmlUpravitelj = require("./htmlUpravitelj.js");
const fetchUpravitelj = require("./fetchUpravitelj.js");
const cors = require("cors");
const server = express();
const jwt = require("./moduli/jwt.js")
let konfiguracija;
let port;
let portRest;

function pokreniServer() {
    server.use(express.urlencoded({ extended: true }));
    server.use(express.json());
    server.use(kolacici());
    server.use(cors());
    server.use(sesija({
        secret: konst.tajniKljucSesija, 
        saveUninitialized: true,
        cookie: {  maxAge: 1000 * 60 * 60 * 3 },
        resave: false
    }));
    
    pripremiPutanjePocetna();
    pripremiPutanjeAutentifikacija();
    pripremiPutanjePretrazivanjeFilmova();
    pripremiPutanjeDokumentacija();

    server.use(express.static(__dirname + "/angular"));
    server.use("/slika-mene", express.static(__dirname + "/dokumentacija/stanko.jpg"));
    server.get("*", (req, res) => {
        res.sendFile(`${__dirname}/angular/index.html`);
      });
    server.use((zahtjev, odgovor) => {
        odgovor.status(404);
        var poruka = { greska: "Stranica nije pronađena!" };
        //console.log(konf.dajKonf());
        odgovor.send(JSON.stringify(poruka));
    });
    port = konfiguracija["app.port"]
    server.listen(port, () => {
        console.log(`Server pokrenut na portu: ${port}`);
    });
}

let konf = new Konfiguracija();
konf.ucitajKonfiguraciju().then(provjeriPodatke).catch((greska) => {
    console.log(greska);
    if (process.argv.length == 2)
        console.error("Potrebno je dati naziv datoteke");
    else
        console.error("Nije moguće otvoriti datoteku: " + greska.path);
    process.exit()
});

function pripremiPutanjePocetna() {
    //server.get("/", htmlUpravitelj.pocetna);
    server.get('/dajSveZanrove', fetchUpravitelj.dajSveZanrove);
    server.get('/dajDvaFilma', fetchUpravitelj.dajDvaFilma);
}

function pripremiPutanjePretrazivanjeFilmova() {
    //server.get('/filmoviPretrazivanje', htmlUpravitelj.filmoviPretrazivanje);
    server.post('/filmoviPretrazivanje', fetchUpravitelj.filmoviPretrazivanje);
    server.post('/dodajFilm', fetchUpravitelj.dodajFilm);
    //server.get('/filmoviPregled', htmlUpravitelj.filmoviPregled);
    server.post('/filmoviPregled', fetchUpravitelj.filmoviPregled);
    //server.get('/film/:id', htmlUpravitelj.film);
    server.post('/film/', fetchUpravitelj.film);
}

function pripremiPutanjeAutentifikacija() {
    //server.get("/registracija", htmlUpravitelj.registracija);
    server.post("/registracija", htmlUpravitelj.registracija);
    server.get("/odjava", htmlUpravitelj.odjava);
    //server.get("/prijava", htmlUpravitelj.prijava);
    server.post("/prijava", htmlUpravitelj.prijava);
    server.get("/getJWT", fetchUpravitelj.getJWT);
    server.get("/getKorime", fetchUpravitelj.getKorime);
    server.get("/aktivacijaRacuna", fetchUpravitelj.aktvacijaRacuna);
    //server.get("/profil", htmlUpravitelj.profil);
    server.post("/profil", fetchUpravitelj.profil);
    server.post("/profilAzuriraj", fetchUpravitelj.profilAzuriraj);
    server.post('/korisnici', fetchUpravitelj.dajKorisnike);
}

function pripremiPutanjeDokumentacija(){
    //server.get("/dokumentacija", htmlUpravitelj.dokumentacija);
}

function provjeriPodatke() {
    konfiguracija = konf.dajKonf();

    if (konfiguracija['rest.korime'] == undefined) {
        console.log("ne postoji rest.korime")
        process.exit();
    }
    else if (konfiguracija['rest.korime'] != undefined) {
        let vrijednost = konfiguracija['rest.korime'];
        let regex = /^.{15,20}$/g;
        if (!regex.test(vrijednost)) {
            console.log("rest.korime treba biti 15-20 znakova dugo");
            process.exit();
        }
        regex = /^[A-Za-z0-9ćčžšđĆČŽŠĐ]{15,20}$/g;
        if (!regex.test(vrijednost)) {
            console.log("rest.korime smije samo koristiti slova i brojeve");
            process.exit();
        }
        regex = /^(\D*\d){2,}\D*$/g;
        if (!regex.test(vrijednost)) {
            console.log("rest.korime treba imati barem dva broja");
            process.exit();
        }
        regex = /^(\d*[A-Za-zćčžšđĆČŽŠĐ]){2,}\d*$/g;
        if (!regex.test(vrijednost)) {
            console.log("rest.korime treba imati barem dva slova");
            process.exit();
        }
    }

    if (konfiguracija['rest.lozinka'] == undefined) {
        console.log("ne postoji rest.lozinka")
        process.exit();
    }
    else if (konfiguracija['rest.lozinka'] != undefined) {
        let vrijednost = konfiguracija['rest.lozinka'];
        let regex = /^.{20,100}$/g;
        if (!regex.test(vrijednost)) {
            console.log("rest.lozinka treba biti 20-100 znakova dugo");
            process.exit();
        }
        regex = /^[\S]{20,100}$/g;
        if (!regex.test(vrijednost)) {
            console.log("rest.lozinka nesmije koristiti razmak");
            process.exit();
        }
        regex = /^(\D*\d){3,}\D*$/g;
        if (!regex.test(vrijednost)) {
            console.log("rest.lozinka treba imati barem tri broja");
            process.exit();
        }
        regex = /^(.*[A-Za-zćčžšđĆČŽŠĐ]){3,}.*$/g;
        if (!regex.test(vrijednost)) {
            console.log("rest.lozinka treba imati barem tri slova");
            process.exit();
        }
        regex = /^(.*[^A-Za-zćčžšđĆČŽŠĐ0-9]){3,}.*$/g;
        if (!regex.test(vrijednost)) {
            console.log("rest.lozinka treba imati barem 3 specijalna znaka");
            process.exit();
        }
    }

    if (konfiguracija['app.broj.stranica'] == undefined) {
        console.log("ne postoji app.broj.stranica")
        process.exit();
    }
    else if (konfiguracija['app.broj.stranica'] != undefined) {
        let vrijednost = konfiguracija['app.broj.stranica'];
        let regex = /^[5-9]$|^[1-9][0-9]$|^100$/g;
        if (!regex.test(vrijednost)) {
            console.log("app.broj.stranica treba biti između 5-100");
            process.exit();
        }
    }

    if (konfiguracija['tmdb.apikey.v3'] == undefined || konfiguracija['tmdb.apikey.v3'] == "") {
        console.log("ne postoji tmdb.apikey.v3")
        process.exit();
    }

    if (konfiguracija['tmdb.apikey.v4'] == undefined || konfiguracija['tmdb.apikey.v4'] == "") {
        console.log("ne postoji tmdb.apikey.v4")
        process.exit();
    }
    probniZahtjev().then(pokreniServer).catch((greska) => {
        console.log("Servis ne radi");
    });
}

async function probniZahtjev(){
    portRest = konfiguracija["rest.port"]
    let token = jwt.kreirajToken();
    let parametri = { method: 'GET', headers: {'Authorization': `Bearer ${token}`}};
    let odgovor = await fetch("http://localhost:" + portRest + "/api/korisnici",parametri)
        if (odgovor.status == 200) {
            return odgovor;
        } else {
            console.log(odgovor.status);
            console.log(await odgovor.text());
            process.exit()
        }
}