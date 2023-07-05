const ZanrDAO = require("./zanrDAO.js");
const jwt = require("jsonwebtoken")
const konst= require("../konstante.js");




exports.getZanrovi = function (zahtjev, odgovor) {
    odgovor.type("application/json")
    let zdao = new ZanrDAO();
    if(!provjeriToken(zahtjev)){
        odgovor.status(401);
        odgovor.send({ greska: "Neautoriziran pristup" });
        return;
    }

    zdao.dajSve().then((zanr) => {
        console.log(zanr);
        odgovor.send(JSON.stringify(zanr));
    }).catch((greska) => {
        odgovor.send(JSON.stringify(greska))});
}

exports.postZanrovi = function (zahtjev, odgovor) {
    odgovor.type("application/json")
    let zdao = new ZanrDAO();
    if(!provjeriToken(zahtjev)){
        odgovor.status(401);
        odgovor.send({ greska: "Neautoriziran pristup" });
        return;
    }

    let podaci = zahtjev.body;
    zdao.dodaj(podaci).then((poruka) => {
        odgovor.send(JSON.stringify(poruka));
    }).catch((greska) => {
        odgovor.send(JSON.stringify(greska))});
}

exports.deleteZanrovi = function (zahtjev, odgovor) {
    odgovor.type("application/json")
    let zdao = new ZanrDAO();
    if(!provjeriToken(zahtjev)){
        odgovor.status(401);
        odgovor.send({ greska: "Neautoriziran pristup" });
        return;
    }

    zdao.obrisi().then((zanr) => {
        console.log(zanr);
        odgovor.send(JSON.stringify(zanr));
    }).catch((greska) => {
        odgovor.send(JSON.stringify(greska))});
}

exports.putZanrovi = function (zahtjev, odgovor) {
    odgovor.type("application/json")
    odgovor.status(501);
    let poruka = { greska: "metoda nije implementirana" }
    odgovor.send(JSON.stringify(poruka));
}

exports.getZanr = function (zahtjev, odgovor) {
    odgovor.type("application/json")
    let zdao = new ZanrDAO();
    let id = zahtjev.params.id;
    if(!provjeriToken(zahtjev)){
        odgovor.status(401);
        odgovor.send({ greska: "Neautoriziran pristup" });
        return;
    }

    zdao.daj(id).then((zanr) => {
        console.log(zanr);
        odgovor.send(JSON.stringify(zanr));
    }).catch((greska) => {
        odgovor.send(JSON.stringify(greska))});
}

exports.postZanr = function (zahtjev, odgovor) {
    odgovor.type("application/json")
    odgovor.status(405);
    let poruka = { greska: "metoda nije dopuštena" }
    odgovor.send(JSON.stringify(poruka));
}

exports.deleteZanr = function (zahtjev, odgovor) {
    odgovor.type("application/json")
    let zdao = new ZanrDAO();
    let id = zahtjev.params.id;
    if(!provjeriToken(zahtjev)){
        odgovor.status(401);
        odgovor.send({ greska: "Neautoriziran pristup" });
        return;
    }

    zdao.obrisi(id).then((zanr) => {
        console.log(zanr);
        odgovor.send(JSON.stringify(zanr));
    }).catch((greska) => {
        odgovor.send(JSON.stringify(greska))});
}

exports.putZanr = function (zahtjev, odgovor) {
    odgovor.type("application/json")
    if(!provjeriToken(zahtjev)){
        odgovor.status(401);
        odgovor.send({ greska: "Neautoriziran pristup" });
        return;
    }

    let id = zahtjev.params.id;
    let podaci = zahtjev.body;
    let zdao = new ZanrDAO();
    zdao.azuriraj(id, podaci).then((poruka) => {
        odgovor.send(JSON.stringify(poruka));
    }).catch((greska) => {
        odgovor.send(JSON.stringify(greska))});
}

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