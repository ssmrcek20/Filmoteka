const Konfiguracija = require("../konfiguracija");
const FilmDAO = require("./filmDAO.js");
const TMDBklijent = require("./klijentTMDB.js");
const jwt = require("jsonwebtoken")
const konst= require("../konstante.js");

let konf = new Konfiguracija();
konf.ucitajKonfiguraciju();


exports.getFilmovi = function (zahtjev, odgovor) {
    odgovor.type("application/json")
    let fdao = new FilmDAO();

    let stranica = zahtjev.query.stranica;
    let brojFilmova = zahtjev.query.brojFilmova;

    if(!provjeriToken(zahtjev)){
        odgovor.status(401);
        odgovor.send({ greska: "Neautoriziran pristup" });
        return;
    }

    if(stranica == null || brojFilmova==null){
        odgovor.status("417");
        odgovor.send({greska: "neocekivani podaci"});
        return;
    }

    fdao.dajSve(zahtjev.query).then((film) => {
        odgovor.send(JSON.stringify(film));
    }).catch((greska) => {
        odgovor.send(JSON.stringify(greska))});
}//FDFD

exports.postFilmovi = function (zahtjev, odgovor) {
    odgovor.type("application/json")
    let fdao = new FilmDAO();

    if(!provjeriToken(zahtjev)){
        odgovor.status(401);
        odgovor.send({ greska: "Neautoriziran pristup" });
        return;
    }
    tmdbKlijent = new TMDBklijent(konf.dajKonf()["tmdb.apikey.v3"]);
    tmdbKlijent.dohvatiFilm(zahtjev.body.id).then((film) =>{
            film = JSON.parse(film);
            let zanr = film.genres[0].name;
            console.log(zanr);
            fdao.dodaj(film,zanr,zahtjev.body.korID).then((film) =>{
                let zanrovi = zahtjev.body.genre_ids;
                for(let i = 0; i < zanrovi.length; i++){
                    fdao.dodajZanr(zanrovi[i],zahtjev.body.id).catch((greska) =>{
                        console.log("Nije dodan žanr filma jer ne postoji u bazi!");
                    });
                }
                odgovor.send(true);
            }).catch((greska) => {
                odgovor.send(JSON.stringify(greska))
            });
            
        }).catch((greska) => {
            odgovor.json(greska);
        });
}//FDF

exports.deleteFilmovi = function (zahtjev, odgovor) {
    odgovor.type("application/json")
    odgovor.status(501);
    let poruka = { greska: "metoda nije implementirana" }
    odgovor.send(JSON.stringify(poruka));
}

exports.putFilmovi = function (zahtjev, odgovor) {
    odgovor.type("application/json")
    odgovor.status(501);
    let poruka = { greska: "metoda nije implementirana" }
    odgovor.send(JSON.stringify(poruka));
}

exports.getFilm = function (zahtjev, odgovor) {
    odgovor.type("application/json")
    let fdao = new FilmDAO();
    let id = zahtjev.params.id;

    if(!provjeriToken(zahtjev)){
        odgovor.status(401);
        odgovor.send({ greska: "Neautoriziran pristup" });
        return;
    }

    fdao.daj(id).then((film) => {
        odgovor.send(JSON.stringify(film));
    }).catch((greska) => {
        odgovor.send(JSON.stringify(greska))});
}

exports.postFilm = function (zahtjev, odgovor) {
    odgovor.type("application/json")
    odgovor.status(405);
    let poruka = { greska: "metoda nije dopuštena" }
    odgovor.send(JSON.stringify(poruka));
}

exports.deleteFilm = function (zahtjev, odgovor) {
    odgovor.type("application/json")
    let fdao = new FilmDAO();
    let id = zahtjev.params.id;

    if(!provjeriToken(zahtjev)){
        odgovor.status(401);
        odgovor.send({ greska: "Neautoriziran pristup" });
        return;
    }

    fdao.obrisi(id).then((film) => {
        odgovor.send(JSON.stringify(film));
    }).catch((greska) => {
        odgovor.send(JSON.stringify(greska))});
}//dads

exports.putFilm = function (zahtjev, odgovor) {
    odgovor.type("application/json")
    let fdao = new FilmDAO();
    let id = zahtjev.params.id;

    if(!provjeriToken(zahtjev)){
        odgovor.status(401);
        odgovor.send({ greska: "Neautoriziran pristup" });
        return;
    }
    let podaci = zahtjev.body;
    fdao.azuriraj(id,podaci).then((film) => {
        odgovor.send(JSON.stringify(film));
    }).catch((greska) => {
        odgovor.send(JSON.stringify(greska))});
}//fdsfs

function provjeriToken(zahtjev) {
    if (zahtjev.headers.authorization != null) {
        let token = zahtjev.headers.authorization;
        token = token.substring(7);
        try {
            let podaci = jwt.verify(token, konst.tajniKljucJWT);
            console.log("JWT podaci: "+podaci);
            return true;
        } catch (e) {
            console.log(e)
            return false;
        }
    }
    return false;
};