const kodovi = require("./moduli/kodovi.js")
const Konfiguracija = require("../konfiguracija");
const jwt = require("./moduli/jwt.js")

let konf = new Konfiguracija
konf.ucitajKonfiguraciju();
class FilmoviZanroviPretrazivanje {

    async dohvatiFilmove(stranica, kljucnaRijec = "") {
        let token = jwt.kreirajToken();
        let parametri = { method: 'GET', headers: {'Authorization': `Bearer ${token}`}};
        let putanja = "http://localhost:" + konf.dajKonf()["rest.port"] + "/api/tmdb/filmovi?stranica=" + stranica + "&kljucnaRijec=" + kljucnaRijec
        let odgovor = await fetch(putanja,parametri);
        let podaci = await odgovor.text();
        let filmovi = JSON.parse(podaci);
        return filmovi;
    }

    async dohvatiSveZanrove() {
        let token = jwt.kreirajToken();
        let parametri = { method: 'GET', headers: {'Authorization': `Bearer ${token}`}};
        let odgovor = await fetch("http://localhost:" + konf.dajKonf()["rest.port"] + "/api/zanr",parametri);
        let podaci = await odgovor.text();
        let zanrovi = JSON.parse(podaci);
        return zanrovi;
    }

    async dohvatiNasumceFilm(zanr) {
        let token = jwt.kreirajToken();
        let parametri = { method: 'GET', headers: {'Authorization': `Bearer ${token}`}};
        let odgovor = await fetch("http://localhost:" + konf.dajKonf()["rest.port"] + "/api/filmovi?stranica=1&brojFilmova=10&zanr=" + zanr,parametri);
        let podaci = await odgovor.text();
        let filmovi = JSON.parse(podaci);
        let rez = [filmovi[kodovi.dajNasumceBroj(0,filmovi.length-1)],
        filmovi[kodovi.dajNasumceBroj(0,filmovi.length-1)]];
        return rez;
    }

    async dohvatiFilmoveBaza(stranica, brojFilmova, zanr = "", datum = "", sortiraj = "") {
        let token = jwt.kreirajToken();
        let parametri = { method: 'GET', headers: {'Authorization': `Bearer ${token}`}};
        if (zanr != "") {
            let putanja ="http://localhost:" + konf.dajKonf()["rest.port"] + "/api/zanr"
            let odgovor = await fetch(putanja,parametri);
            let podaci = await odgovor.text();
            let zanrovi = JSON.parse(podaci);
            for(let z of zanrovi){
                if(z.naziv == zanr){
                    zanr = z.id;
                }
            }
        }
        let putanja = "http://localhost:" + konf.dajKonf()["rest.port"] + "/api/filmovi?stranica=" + stranica + "&brojFilmova=" + brojFilmova + "&zanr=" + zanr + "&datum=" + datum + "&sortiraj=" + sortiraj
        let odgovor = await fetch(putanja,parametri);
        let podaci = await odgovor.text();
        let filmovi = JSON.parse(podaci);
        return filmovi;
    }
    
    async dohvatiFilmBaza(id) {
        let token = jwt.kreirajToken();
        let parametri = { method: 'GET', headers: {'Authorization': `Bearer ${token}`}};
        let putanja = "http://localhost:" + konf.dajKonf()["rest.port"] + "/api/filmovi/" + id;
        let odgovor = await fetch(putanja,parametri);
        let podaci = await odgovor.text();
        let filmovi = JSON.parse(podaci);
        return filmovi;
    }

}



module.exports = FilmoviZanroviPretrazivanje;