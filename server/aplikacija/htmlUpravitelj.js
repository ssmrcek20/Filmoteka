const ds = require("fs/promises");
const jwt = require("./moduli/jwt.js")
const totp = require("./moduli/totp.js")
const Autentifikacija = require("./autentifikacija.js")
let auth = new Autentifikacija();

const Konfiguracija = require("../konfiguracija");
const konstante = require("../konstante.js");
let konf = new Konfiguracija();
konf.ucitajKonfiguraciju();

exports.pocetna = async function (zahtjev, odgovor) {
    let pocetna = await ucitajStranicu("pocetna")
    odgovor.send(pocetna);
}

exports.registracija = async function (zahtjev, odgovor) {
    /*
    console.log(zahtjev.body)
    let greska = "";
    if (zahtjev.method == "POST") {
        let uspjeh = await auth.dodajKorisnika(zahtjev.body,konf.dajKonf());
        if (uspjeh) {
            odgovor.redirect("/prijava");
            return;
        } else {
            greska = "Dodavanje nije uspjelo provjerite podatke!";
        }
    }

    let stranica = await ucitajStranicu("registracija", greska);
    odgovor.send(stranica);*/
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
        let greska = await auth.dodajKorisnika(zahtjev.body,konf.dajKonf());
        odgovor.json(greska);
    }
}

exports.odjava = async function (zahtjev, odgovor) {
    zahtjev.session.korime = null;
    zahtjev.session.id = null;
    zahtjev.session.jwt = null;
    zahtjev.session.destroy();
    odgovor.json({greska: ''});
};

exports.prijava = async function (zahtjev, odgovor) {
    /*let greska = ""
    if (zahtjev.method == "POST") {
        var korime = zahtjev.body.korime;
        var lozinka = zahtjev.body.lozinka;
        var korisnik = await auth.prijaviKorisnika(korime, lozinka, konf.dajKonf());

        if (korisnik) {
            korisnik = JSON.parse(korisnik);
            console.log(korisnik);
            console.log(korisnik.TOTP_kljuc);
            if(korisnik.tip_korisnika_id != 3){
            //let totpKljuc = "AIBRAAADAMARTBIBARDAACAJAACREAAJBACRCBADA5ARTAAABAAACAAFAREAGCAIAAAATBAIAMAAIAACARBRKAAABEAAAAAIBEAAOBR";
            let totpKljuc = korisnik.TOTP_kljuc;
            let totpKod = zahtjev.body.totp;
            console.log(totpKod + "\n" + totpKljuc + "\n");
            if (!totp.provjeriTOTP(totpKod, totpKljuc)) {
                greska = "TOTP nije dobar!"
            } else {
                zahtjev.session.jwt = jwt.kreirajToken(korisnik)
                zahtjev.session.korisnik = korisnik.ime + " " + korisnik.prezime;
                zahtjev.session.korime = korisnik.korime;
                odgovor.redirect("/");
                return;
            }
            }
            else greska = "Korisnik nije aktiviran!";
        } else {
            greska = "Netocni podaci!";
        }
    }

    let stranica = await ucitajStranicu("prijava", greska);
    odgovor.send(stranica);*/
    
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
        var korime = zahtjev.body.korime;
        var lozinka = zahtjev.body.lozinka;
        var korisnik = await auth.prijaviKorisnika(korime, lozinka, konf.dajKonf());
        if (korisnik) {
            korisnik = JSON.parse(korisnik);
            zahtjev.session.korime = korisnik.korime;
            zahtjev.session.korID = korisnik.id;
            zahtjev.session.jwt = jwt.kreirajToken(korisnik)
            odgovor.json({greska: ''});
        } else {
            odgovor.json({ greska: 'Netočni podaci!' });
        }
    }

}


exports.filmoviPretrazivanje = async function (zahtjev, odgovor) {
    let stranica = await ucitajStranicu("filmovi_pretrazivanje");
    odgovor.send(stranica);
}

exports.dokumentacija = async function (zahtjev, odgovor) {
    let dokumentacija = await ucitajStranicu("dokumentacija")
    odgovor.send(dokumentacija);
}
exports.filmoviPregled = async function (zahtjev, odgovor) {
    let stranica = await ucitajStranicu("filmovi_pregled")
    odgovor.send(stranica);
}
exports.film = async function (zahtjev, odgovor) {
    let stranica = await ucitajStranicu("film")
    odgovor.send(stranica);
}

exports.profil = async function (zahtjev, odgovor) {
    let profil = await ucitajStranicu("profil")
    odgovor.send(profil);
}

async function ucitajStranicu(nazivStranice, poruka = "") {
    let stranice = [ucitajHTML(nazivStranice),
    ucitajHTML("navigacija")];
    let [stranica, nav] = await Promise.all(stranice);
    stranica = stranica.replace("#navigacija#", nav);
    stranica = stranica.replace("#poruka#", poruka)
    return stranica;
}

function ucitajHTML(htmlStranica) {
    if(htmlStranica == "dokumentacija"){
        return ds.readFile(__dirname + "/../dokumentacija/" + htmlStranica + ".html", "UTF-8")
    }
    else{
        return ds.readFile(__dirname + "/html/" + htmlStranica + ".html", "UTF-8");
    }
    
}