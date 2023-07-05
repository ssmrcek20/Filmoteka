const konst = require("../konstante.js");
const express = require('express');
const Konfiguracija = require("../konfiguracija");
const RestKorisnik = require("./restKorisnik.js")
const RestTMDB = require("./restTMDB");
const restFilm = require("./restFilm.js")
const restZanr = require("./restZanr.js")

let port;
const server = express();

let konf = new Konfiguracija();
let konfiguracija;
konf.ucitajKonfiguraciju().then(provjeriPodatke).catch((greska) => {
    if (process.argv.length == 2)
        console.error("Potrebno je unjeti naziv datoteke!");
    else if (greska.path == undefined)
        console.error(greska);
    else
        console.error("Naziv datoteke nije dobar: " + greska.path);
    process.exit()
});


function pokreniServer() {
    port = konfiguracija["rest.port"]
    server.use(express.urlencoded({ extended: true }));
    server.use(express.json());

    pripremiPutanjeKorisnik();
    pripremiPutanjeTMDB();
    pripremiPutanjeFilmova();
    pripremiPutanjeZanr();

    server.use((zahtjev, odgovor) => {
        odgovor.status(404);
        let poruka = { greska: "nema resursa" }
        odgovor.json(poruka);
    });

    server.listen(port, () => {
        console.log(`Server pokrenut na portu: ${port}`);
    });
}

function pripremiPutanjeKorisnik() {
    let restKorisnici = new RestKorisnik();
    server.get("/api/korisnici", restKorisnici.getKorisnici);
    server.post("/api/korisnici", restKorisnici.postKorisnici);
    server.put("/api/korisnici", restKorisnici.putKorisnici);
    server.delete("/api/korisnici", restKorisnici.deleteKorisnici);

    server.get("/api/korisnici/:korime", restKorisnici.getKorisnik);
    server.post("/api/korisnici/:korime", restKorisnici.postKorisnik);
    server.put("/api/korisnici/:korime", restKorisnici.putKorisnik);
    server.delete("/api/korisnici/:korime", restKorisnici.deleteKorisnik);

    server.get("/api/korisnici/:korime/aktivacija", restKorisnici.getKorisnikAktivacija);
    server.post("/api/korisnici/:korime/aktivacija", restKorisnici.postKorisnikAktivacija);
    server.put("/api/korisnici/:korime/aktivacija", restKorisnici.putKorisnikAktivacija);
    server.delete("/api/korisnici/:korime/aktivacija", restKorisnici.deleteKorisnikAktivacija);

    server.get("/api/korisnici/:korime/prijava", restKorisnici.getKorisnikPrijava);
    server.post("/api/korisnici/:korime/prijava", restKorisnici.postKorisnikPrijava);
    server.put("/api/korisnici/:korime/prijava", restKorisnici.putKorisnikPrijava);
    server.delete("/api/korisnici/:korime/prijava", restKorisnici.deleteKorisnikPrijava);

}

function pripremiPutanjeFilmova() {
    server.get("/api/filmovi/:id", restFilm.getFilm);
    server.post("/api/filmovi/:id", restFilm.postFilm);
    server.put("/api/filmovi/:id", restFilm.putFilm);
    server.delete("/api/filmovi/:id", restFilm.deleteFilm);

    server.get("/api/filmovi", restFilm.getFilmovi);
    server.post("/api/filmovi", restFilm.postFilmovi);
    server.put("/api/filmovi", restFilm.putFilmovi);
    server.delete("/api/filmovi", restFilm.deleteFilmovi);
}

function pripremiPutanjeZanr() {
    server.get("/api/zanr/:id", restZanr.getZanr);
    server.post("/api/zanr/:id", restZanr.postZanr);
    server.put("/api/zanr/:id", restZanr.putZanr);
    server.delete("/api/zanr/:id", restZanr.deleteZanr);

    server.get("/api/zanr", restZanr.getZanrovi);
    server.post("/api/zanr", restZanr.postZanrovi);
    server.put("/api/zanr", restZanr.putZanrovi);
    server.delete("/api/zanr", restZanr.deleteZanrovi);

}

function pripremiPutanjeTMDB() {
    let restTMDB = new RestTMDB(konfiguracija["tmdb.apikey.v3"]);
    server.get("/api/tmdb/zanr", restTMDB.getZanr.bind(restTMDB));
    server.post("/api/tmdb/zanr", restTMDB.postZanr.bind(restTMDB));
    server.put("/api/tmdb/zanr", restTMDB.putZanr.bind(restTMDB));
    server.delete("/api/tmdb/zanr", restTMDB.deleteZanr.bind(restTMDB));

    server.get("/api/tmdb/filmovi", restTMDB.getFilmovi.bind(restTMDB));
    server.post("/api/tmdb/filmovi", restTMDB.postFilmovi.bind(restTMDB));
    server.put("/api/tmdb/filmovi", restTMDB.putFilmovi.bind(restTMDB));
    server.delete("/api/tmdb/filmovi", restTMDB.deleteFilmovi.bind(restTMDB));
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

    pokreniServer();
}