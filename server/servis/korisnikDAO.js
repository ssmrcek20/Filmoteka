const Baza = require("./baza.js");

class KorisnikDAO {

	constructor() {
		this.baza = new Baza();
	}

	dajSve = async function () {
		this.baza.spojiSeNaBazu();
		let sql = "SELECT * FROM korisnik;"
		var podaci = await this.baza.izvrsiSelect(sql, []);
		this.baza.zatvoriVezu();
		return podaci;
	}

	daj = async function (korime) {
		this.baza.spojiSeNaBazu();
		let sql = "SELECT * FROM korisnik WHERE korime=?;"
		var podaci = await this.baza.izvrsiSelect(sql, [korime]);
		this.baza.zatvoriVezu();
		if(podaci.length == 1)
			return podaci[0];
		else 
			return null;
	}

	dodaj = async function (korisnik) {
		this.baza.spojiSeNaBazu();
		console.log(korisnik)
		let sql = `INSERT INTO korisnik (korime,lozinka,email,ime,prezime,TOTP_kljuc,aktivacijski_kljuc,tip_korisnika_id) VALUES (?,?,?,?,?,?,?,?)`;
        let podaci = [korisnik.korime,korisnik.lozinka,
                      korisnik.email,korisnik.ime,korisnik.prezime,korisnik.TOTP_kljuc,korisnik.aktivacijski_kljuc,2];
		await this.baza.izvrsiUpit(sql,podaci);
		this.baza.zatvoriVezu();
		return true;
	}

	obrisi = async function (korime) {
		this.baza.spojiSeNaBazu();
		let sql = "DELETE FROM korisnik WHERE korime=?";
		await this.baza.izvrsiUpit(sql,[korime]);
		this.baza.zatvoriVezu();
		return true;
	}

	azuriraj = async function (korime, korisnik) {
		this.baza.spojiSeNaBazu();
		let sql = `UPDATE korisnik SET ime=?, prezime=? WHERE korime=?`;
        let podaci = [korisnik.ime,korisnik.prezime,korime];
		await this.baza.izvrsiUpit(sql,podaci);
		this.baza.zatvoriVezu();
		return true;
	}
	aktiviraj = async function (korime) {
		this.baza.spojiSeNaBazu();
		let sql = `UPDATE korisnik SET tip_korisnika_id=2 WHERE korime=\'${korime}\'`;
		await this.baza.izvrsiUpit(sql, []);
		this.baza.zatvoriVezu();
		return true;
	}
}

module.exports = KorisnikDAO;