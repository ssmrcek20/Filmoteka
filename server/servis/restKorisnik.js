const KorisnikDAO = require("./korisnikDAO.js");
const jwt = require("jsonwebtoken")
const konst= require("../konstante.js");

class RestKorinik {



    getKorisnici(zahtjev, odgovor) {
        odgovor.type("application/json")
        if(!provjeriToken(zahtjev)){
            odgovor.status(401);
            odgovor.send({ greska: "Neautoriziran pristup" });
            return;
        }
        let kdao = new KorisnikDAO();
        kdao.dajSve().then((korisnici) => {
            console.log(korisnici);
            odgovor.send(JSON.stringify(korisnici));
        }).catch((greska) => {
            odgovor.send(JSON.stringify(greska))});
    }

    postKorisnici(zahtjev, odgovor) {
        odgovor.type("application/json")
        if(!provjeriToken(zahtjev)){
            odgovor.status(401);
            odgovor.send({ greska: "Neautoriziran pristup" });
            return;
        }
        let podaci = zahtjev.body;
        let kdao = new KorisnikDAO();
        kdao.dodaj(podaci).then((poruka) => {
            odgovor.send(JSON.stringify(poruka));
        }).catch((greska) => {
            odgovor.send(JSON.stringify(greska))});
    }

    deleteKorisnici(zahtjev, odgovor) {
        odgovor.type("application/json")
        odgovor.status(501);
        let poruka = { greska: "metoda nije implementirana" }
        odgovor.send(JSON.stringify(poruka));
    }

    putKorisnici(zahtjev, odgovor) {
        odgovor.type("application/json")
        odgovor.status(501);
        let poruka = { greska: "metoda nije implementirana" }
        odgovor.send(JSON.stringify(poruka));
    }


    getKorisnik(zahtjev, odgovor) {
        odgovor.type("application/json")
        if(!provjeriToken(zahtjev)){
            odgovor.status(401);
            odgovor.send({ greska: "Neautoriziran pristup" });
            return;
        }
        let kdao = new KorisnikDAO();
        let korime2 = zahtjev.params.korime;
        kdao.daj(korime2).then((korisnik) => {
            console.log(korisnik);
            odgovor.send(JSON.stringify(korisnik));
        }).catch((greska) => {
            odgovor.send(JSON.stringify(greska))});
    }

    postKorisnik(zahtjev, odgovor) {
        odgovor.type("application/json")
        odgovor.status(405);
        let poruka = { greska: "metoda nije dopuštena" }
        odgovor.send(JSON.stringify(poruka));
    }

    deleteKorisnik(zahtjev, odgovor) {
        odgovor.type("application/json")
        odgovor.status(501);
        let poruka = { greska: "metoda nije implementirana" }
        odgovor.send(JSON.stringify(poruka));
    }

    putKorisnik(zahtjev, odgovor) {
        odgovor.type("application/json")
        if(!provjeriToken(zahtjev)){
            odgovor.status(401);
            odgovor.send({ greska: "Neautoriziran pristup" });
            return;
        }
        let korime2 = zahtjev.params.korime;
        let podaci = zahtjev.body;
        let kdao = new KorisnikDAO();
        kdao.azuriraj(korime2, podaci).then((poruka) => {
            odgovor.send(JSON.stringify(poruka));
        }).catch((greska) => {
          odgovor.send(JSON.stringify(greska))});
    }



    postKorisnikPrijava(zahtjev, odgovor) {
        odgovor.type("application/json")
        if(!provjeriToken(zahtjev)){
            odgovor.status(401);
            odgovor.send({ greska: "Neautoriziran pristup" });
            return;
        }
        let kdao = new KorisnikDAO();
        let korime2 = zahtjev.params.korime;
        kdao.daj(korime2).then((korisnik) => {
            if (korisnik != null && korisnik.lozinka == zahtjev.body.lozinka)
                odgovor.send(JSON.stringify(korisnik));
            else {
                odgovor.status(401)
                odgovor.send(JSON.stringify({ greska: "Krivi podaci!" }))
            }
        }).catch((greska) => {
            odgovor.send(JSON.stringify(greska))});
    }

    getKorisnikPrijava(zahtjev, odgovor) {
        odgovor.type("application/json")
        odgovor.status(501);
        let poruka = { greska: "metoda nije implementirana" }
        odgovor.send(JSON.stringify(poruka));
    }

    putKorisnikPrijava(zahtjev, odgovor) {
        odgovor.type("application/json")
        odgovor.status(501);
        let poruka = { greska: "metoda nije implementirana" }
        odgovor.send(JSON.stringify(poruka));
    }

    deleteKorisnikPrijava(zahtjev, odgovor) {
        odgovor.type("application/json")
        odgovor.status(501);
        let poruka = { greska: "metoda nije implementirana" }
        odgovor.send(JSON.stringify(poruka));
    }



    postKorisnikAktivacija(zahtjev, odgovor) {
        odgovor.type("application/json")
        odgovor.status(405);
        let poruka = { greska: "metoda nije dopuštena" }
        odgovor.send(JSON.stringify(poruka));
    }

    getKorisnikAktivacija(zahtjev, odgovor) {
        odgovor.type("application/json")
        odgovor.status(501);
        let poruka = { greska: "metoda nije implementirana" }
        odgovor.send(JSON.stringify(poruka));
    }

    putKorisnikAktivacija(zahtjev, odgovor) {
        odgovor.type("application/json")
        if(!provjeriToken(zahtjev)){
            odgovor.status(401);
            odgovor.send({ greska: "Neautoriziran pristup" });
            return;
        }
        let korime2 = zahtjev.params.korime;
        let kod = zahtjev.body.aktivacijskiKod;
        let kdao = new KorisnikDAO();

        kdao.daj(korime2).then((korisnik) => {
            console.log(korisnik.aktivacijski_kljuc);
            console.log(kod);
            if(korisnik != null && korisnik.aktivacijski_kljuc == kod){
                kdao.aktiviraj(korime2).then((poruka) => {
                    odgovor.send(JSON.stringify(poruka));
                }).catch((greska) => {
                    odgovor.send(JSON.stringify(greska))});  
            }
            else {
                odgovor.status(401)
                odgovor.send(JSON.stringify({ greska: "Krivi podaci!" }))
            }
        }).catch((greska) => {
            odgovor.send(JSON.stringify(greska))});


    }

    deleteKorisnikAktivacija(zahtjev, odgovor) {
        odgovor.type("application/json")
        odgovor.status(501);
        let poruka = { greska: "metoda nije implementirana" }
        odgovor.send(JSON.stringify(poruka));
    }

}

module.exports = RestKorinik;

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