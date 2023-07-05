const mail = require("./moduli/mail.js")
const kodovi = require("./moduli/kodovi.js")
const totp = require("./moduli/totp.js")
const jwt = require("./moduli/jwt.js")

class Autentifikacija {
    async dodajKorisnika(korisnik, konf) {
        let tijelo = {
            ime: korisnik.ime,
            prezime: korisnik.prezime,
            lozinka: kodovi.kreirajSHA256(korisnik.lozinka, korisnik.korime),
            email: korisnik.email,
            korime: korisnik.korime
        };
        let aktivacijskiKod = kodovi.dajNasumceBroj(10000, 99999);
        tijelo["aktivacijski_kljuc"] = aktivacijskiKod;
        let tajniTOTPkljuc = totp.kreirajTajniKljuc(korisnik.korime);
        tijelo["TOTP_kljuc"] = tajniTOTPkljuc;

        let token = jwt.kreirajToken();

        let zaglavlje = new Headers();
        zaglavlje.set("Content-Type", "application/json");
        zaglavlje.set('Authorization', `Bearer ${token}`);
        let parametri = {
            method: 'POST',
            body: JSON.stringify(tijelo),
            headers: zaglavlje
        }
        let odgovor = await fetch("http://localhost:" + konf["rest.port"] + "/api/korisnici", parametri)
        let data = await odgovor.json();
        return data;
        /*
        if (odgovor.status == 200) {
            console.log("Korisnik ubačen na servisu");
            let mailPoruka = "aktivacijski kod:" + aktivacijskiKod
                + " http://localhost:"+ konf["app.port"] +"/aktivacijaRacuna?korime=" + korisnik.korime + "&kod=" + aktivacijskiKod
            mailPoruka += " TOTP Kljuc: " + tajniTOTPkljuc;
            let poruka = await mail.posaljiMail("ssmrcek20@foi.hr", korisnik.email,
                "Aktivacijski kod", mailPoruka);
            return true;
        } else {
            console.log(odgovor.status);
            console.log(await odgovor.text());
            return false;
        }*/
    }

    async aktivirajKorisnickiRacun(korime, kod, konf) {
        let token = jwt.kreirajToken();
        let zaglavlje = new Headers();
        zaglavlje.set("Content-Type", "application/json");
        zaglavlje.set('Authorization', `Bearer ${token}`);
        let parametri = {
            method: 'PUT',
            body: JSON.stringify({ aktivacijskiKod: kod }),
            headers: zaglavlje
        }

        return await fetch("http://localhost:" + konf["rest.port"] + "/api/korisnici/" + korime + "/aktivacija", parametri)
    }

    async prijaviKorisnika(korime, lozinka, konf) {
        lozinka = kodovi.kreirajSHA256(lozinka, korime);
        let tijelo = {
            lozinka: lozinka,
        };
        let token = jwt.kreirajToken();
        let zaglavlje = new Headers();
        zaglavlje.set("Content-Type", "application/json");
        zaglavlje.set('Authorization', `Bearer ${token}`);
        let parametri = {
            method: 'POST',
            body: JSON.stringify(tijelo),
            headers: zaglavlje
        }
        let odgovor = await fetch("http://localhost:" + konf["rest.port"] + "/api/korisnici/" + korime + "/prijava", parametri);
        if (odgovor.status == 200) {
            return await odgovor.text();
        } else {
            return false;
        }
    }

}

module.exports = Autentifikacija;