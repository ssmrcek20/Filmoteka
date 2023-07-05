const Baza = require("./baza.js");

class ZanrDAO {

	constructor() {
		this.baza = new Baza();
	}

	dajSve = async function () {
		this.baza.spojiSeNaBazu();
		let sql = "SELECT * FROM žanr;"
		var podaci = await this.baza.izvrsiSelect(sql, []);
		this.baza.zatvoriVezu();
		return podaci;
	}

	daj = async function (id) {
		this.baza.spojiSeNaBazu();
		let sql = "SELECT * FROM žanr WHERE id=?;"
		var podaci = await this.baza.izvrsiSelect(sql, [id]);
		this.baza.zatvoriVezu();
		if(podaci.length == 1)
			return podaci[0];
		else 
			return null;
	}

	dodaj = async function (zanr) {
		this.baza.spojiSeNaBazu();
		let sql = `INSERT INTO žanr (id, naziv) 
             VALUES (?, ?)`;
        let podaci = [zanr.id,zanr.name];
		await this.baza.izvrsiUpit(sql,podaci);
		this.baza.zatvoriVezu();
		return true;
	}

	obrisi = async function(){
		this.baza.spojiSeNaBazu();
		let sql = "DELETE FROM žanr WHERE NOT EXISTS(SELECT NULL FROM žanr_filma f WHERE f.žanr_id = id);";
		await this.baza.izvrsiUpit(sql);
		this.baza.zatvoriVezu();
		return true;
	}

	azuriraj = async function (id, zanr) {
		this.baza.spojiSeNaBazu();
		let sql = `UPDATE žanr SET naziv=? WHERE id=?`;
        let podaci = [zanr.naziv,id];
		await this.baza.izvrsiUpit(sql,podaci);
		this.baza.zatvoriVezu();
		return true;
	}
}

module.exports = ZanrDAO;