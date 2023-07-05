const FilmoviPretrazivanje = require("./filmoviPretrazivanje.js");
const jwt = require("./moduli/jwt.js")
const Autentifikacija = require("./autentifikacija.js")
let auth = new Autentifikacija();
let fp = new FilmoviPretrazivanje();
const konstante = require("../konstante.js");
const Konfiguracija = require("../konfiguracija");
let konf = new Konfiguracija();
konf.ucitajKonfiguraciju();
let konfiguracija
let portRest;

exports.aktvacijaRacuna = async function (zahtjev, odgovor) {
    console.log(zahtjev.query);
    let korime = zahtjev.query.korime;
    let kod = zahtjev.query.kod;

    let poruka = await auth.aktivirajKorisnickiRacun(korime, kod, konf.dajKonf());
    console.log(poruka)

    if (poruka.status == 200) {
        odgovor.send(await poruka.text());
    } else {
        odgovor.send(await poruka.text());
    }
}

exports.dajSveZanrove = async function (zahtjev, odgovor) {
    odgovor.json(await fp.dohvatiSveZanrove());
}
exports.dajDvaFilma = async function (zahtjev, odgovor) {
    odgovor.json(await fp.dohvatiNasumceFilm(zahtjev.query.zanr))
}

exports.getJWT = async function (zahtjev, odgovor) {
    odgovor.type('json')
    if (zahtjev.session.jwt != null) {
        let k = { korime: jwt.dajTijelo(zahtjev.session.jwt).korime };
        let noviToken = jwt.kreirajToken(k)
        odgovor.send({ ok: noviToken });
        return
    } 
    odgovor.status(401);
    odgovor.send({ greska: "nemam token!" });
}

exports.getKorime = async function (zahtjev, odgovor) {
    odgovor.type('json')
    if (zahtjev.session.jwt != null) {
        odgovor.send(jwt.dajTijelo(zahtjev.session.jwt).korime);
        return
    } 
    odgovor.status(401);
    odgovor.send({ greska: "nemam token!" });
}

exports.filmoviPretrazivanje = async function (zahtjev, odgovor) {
        if (!zahtjev.session.korime) {
            odgovor.status(401);
            odgovor.json({ greska: "Ne autorizirani pristup! Prijavi se!" });
        } else {
            let str = zahtjev.query.str;
            let filter = zahtjev.query.filter;
            console.log(zahtjev.query)
            odgovor.send(JSON.stringify(await fp.dohvatiFilmove(str,filter)))
        }
}

exports.filmoviPregled = async function (zahtjev, odgovor) {
    if (!zahtjev.session.korime) {
        odgovor.status(401);
        odgovor.json({ greska: "Ne autorizirani pristup! Prijavi se!" });
    } else {
        let str = zahtjev.query.str;
        let brojFilmova = konf.dajKonf()["app.broj.stranica"];
        let zanr = zahtjev.query.zanr;
        let datum = zahtjev.query.datum;
        let sortiraj = zahtjev.query.sortiraj;
        console.log(zahtjev.query)
        odgovor.json(await fp.dohvatiFilmoveBaza(str,brojFilmova,zanr,datum,sortiraj))
    }
}

exports.film = async function (zahtjev, odgovor) {
    if (!zahtjev.session.korime) {
        odgovor.status(401);
        odgovor.json({ greska: "Ne autorizirani pristup! Prijavi se!" });
    } else {
        let id = zahtjev.query.id;
        console.log(zahtjev.query)
        odgovor.json(await fp.dohvatiFilmBaza(id))
    }
}

exports.dajKorisnike = async function (zahtjev, odgovor) {
    if (!zahtjev.session.korime) {
        odgovor.status(401);
        odgovor.json({ greska: "Ne autorizirani pristup! Prijavi se!" });
    } else {
        let token = jwt.kreirajToken();
        let parametri = { method: 'GET', headers: {'Authorization': `Bearer ${token}`}};
        let kor = await fetch("http://localhost:" + konf.dajKonf()["rest.port"] + "/api/korisnici",parametri);
        let podaci = await kor.text();
        console.log(podaci);
        let korisnici = JSON.parse(podaci);
        odgovor.json(korisnici);
    }
}

exports.dodajFilm = async function (zahtjev, odgovor) {
    konfiguracija = konf.dajKonf();
    portRest = konfiguracija["rest.port"];
    if (!zahtjev.session.korID) {
        odgovor.status(401);
        odgovor.json({ greska: "Ne autorizirani pristup! Prijavi se!" });
     } else {
        let korID = zahtjev.session.korID;
        zahtjev.body.korID = korID;
        let zaglavlje = new Headers();
        zaglavlje.set("Content-Type", "application/json");
        let token = jwt.kreirajToken();
        zaglavlje.set('Authorization', `Bearer ${token}`);
        let parametri = { method: 'POST', body: JSON.stringify(zahtjev.body), headers: zaglavlje }
        let greska = await fetch("http://localhost:" + portRest + "/api/filmovi?stranica=1&brojFilmova=1", parametri)
        greska = await greska.json();
        odgovor.json(greska);
     }
}

exports.profil = async function (zahtjev, odgovor) {
    konfiguracija = konf.dajKonf();
    portRest = konfiguracija["rest.port"];
    if (!zahtjev.session.korime) {
        odgovor.status(401);
        odgovor.json({ greska: "Ne autorizirani pristup! Prijavi se!" });
    } else {
        let korime = zahtjev.session.korime;
        let putanja = "http://localhost:" + portRest + "/api/korisnici/" + korime
        console.log(putanja)
        let token = jwt.kreirajToken();
        let parametri = { method: 'GET', headers: {'Authorization': `Bearer ${token}`}};
        let korisnikk = await fetch(putanja,parametri);
        let podaci = await korisnikk.text();
        let korisnik = JSON.parse(podaci);
        odgovor.send(JSON.stringify(korisnik))
    }
}

exports.profilAzuriraj = async function (zahtjev, odgovor) {

    var token = zahtjev.body.tokenCAPTCHA;
    console.log(token)
    const recaptchaOdgovor = await fetch('https://www.google.com/recaptcha/api/siteverify?secret='+ konstante.tajniKljucReCaptcha +'&response='+ token, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
    const recaptcha = await recaptchaOdgovor.json();
    if(!recaptcha.success){
        console.log(recaptcha)
        odgovor.json({ greska: 'Ti si robot!!!' });
    }else{
        konfiguracija = konf.dajKonf();
        portRest = konfiguracija["rest.port"];
        if (!zahtjev.session.korime) {
            odgovor.status(401);
            odgovor.json({ greska: "Ne autorizirani pristup! Prijavi se!" });
        } else {
            let korime = zahtjev.session.korime;
            let token = jwt.kreirajToken();
            let zaglavlje = new Headers();
            zaglavlje.set("Content-Type", "application/json");
            zaglavlje.set('Authorization', `Bearer ${token}`);
            let parametri = { method: 'PUT', body: JSON.stringify(zahtjev.body), headers: zaglavlje }
            let greska = await fetch("http://localhost:" + portRest + "/api/korisnici/" + korime, parametri)
            greska = await greska.json();
            odgovor.json(greska);
        }
    }
}
