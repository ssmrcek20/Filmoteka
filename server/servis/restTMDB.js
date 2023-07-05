const TMDBklijent = require("./klijentTMDB.js");
const jwt = require("jsonwebtoken")
const konst= require("../konstante.js");

class RestTMDB {

    constructor(api_kljuc) {
        this.tmdbKlijent = new TMDBklijent(api_kljuc);
        console.log(api_kljuc);
    }


    getZanr(zahtjev, odgovor) {
        console.log(this);
        if(!provjeriToken(zahtjev)){
            odgovor.status(401);
            odgovor.send({ greska: "Neautoriziran pristup" });
            return;
        }

        this.tmdbKlijent.dohvatiZanrove().then((zanrovi) => {
            //console.log(zanrovi);
            odgovor.type("application/json")
            odgovor.send(zanrovi);
        }).catch((greska) => {
            odgovor.json(greska);
        });
    }
    postZanr(zahtjev, odgovor) {
        odgovor.type("application/json")
        odgovor.status(501);
        let poruka = { greska: "metoda nije implementirana" }
        odgovor.send(JSON.stringify(poruka));
    }
    putZanr(zahtjev, odgovor) {
        odgovor.type("application/json")
        odgovor.status(501);
        let poruka = { greska: "metoda nije implementirana" }
        odgovor.send(JSON.stringify(poruka));
    }
    deleteZanr(zahtjev, odgovor) {
        odgovor.type("application/json")
        odgovor.status(501);
        let poruka = { greska: "metoda nije implementirana" }
        odgovor.send(JSON.stringify(poruka));
    }



    getFilmovi(zahtjev, odgovor) {
        console.log(this);
        odgovor.type("application/json")
        let stranica = zahtjev.query.stranica;
        let rijeci = zahtjev.query.kljucnaRijec;

        if(!provjeriToken(zahtjev)){
            odgovor.status(401);
            odgovor.send({ greska: "Neautoriziran pristup" });
            return;
        }
        
        if(stranica == null || rijeci==null){
            odgovor.status("417");
            odgovor.send({greska: "neocekivani podaci"});
            return;
        } 

        this.tmdbKlijent.pretraziFilmove(rijeci,stranica).then((filmovi) => {
            //console.log(filmovi);
            odgovor.send(filmovi);
        }).catch((greska) => {
            odgovor.json(greska);
        });
    }
    postFilmovi(zahtjev, odgovor) {
        odgovor.type("application/json")
        odgovor.status(501);
        let poruka = { greska: "metoda nije implementirana" }
        odgovor.send(JSON.stringify(poruka));
    }
    putFilmovi(zahtjev, odgovor) {
        odgovor.type("application/json")
        odgovor.status(501);
        let poruka = { greska: "metoda nije implementirana" }
        odgovor.send(JSON.stringify(poruka));
    }
    deleteFilmovi(zahtjev, odgovor) {
        odgovor.type("application/json")
        odgovor.status(501);
        let poruka = { greska: "metoda nije implementirana" }
        odgovor.send(JSON.stringify(poruka));
    }
}

module.exports = RestTMDB;

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