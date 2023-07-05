const Baza = require("./baza.js");

class FilmDAO {

	constructor() {
		this.baza = new Baza();
	}

	dajSve = async function (filmovi) {
        let stranica = filmovi.stranica;
        let brojFilmova = filmovi.brojFilmova;
        let datum = filmovi.datum;
        let zanr = filmovi.zanr;
        let naziv = filmovi.naziv;
        let sortiraj = filmovi.sortiraj;
		this.baza.spojiSeNaBazu();
		let sql = "SELECT * FROM film";
		let where = false;
		if(datum!= undefined && datum!= ''){
			if(where==false){
				sql += " WHERE datum_unosa >= \'" + datum + "\'";
				where = true;
			}
			else{
				sql += " AND datum_unosa >= \'" + datum + "\'";
			}
		}
		if(naziv!= undefined){
			if(where==false){
				sql += " WHERE naziv = \'" + naziv + "\'";
				where = true;
			}
			else{
				sql += " AND naziv = \'" + naziv + "\'";
			}
		}
		if(zanr!= undefined && zanr!= ''){
			if(where==false){
				sql += " WHERE EXISTS (SELECT 1 FROM žanr_filma f WHERE f.film_id = film.id AND f.žanr_id = \'" + zanr + "\')";
				where = true;
			}
			else{
				sql += " AND EXISTS (SELECT 1 FROM žanr_filma f WHERE f.film_id = film.id AND f.žanr_id = \'" + zanr + "\')";
			}
		}
		
		if(sortiraj=="d"){
			sql +=" ORDER BY datum_unosa";
		}
		else if(sortiraj=="n"){
			sql +=" ORDER BY naziv";
		}
		else if(sortiraj=="z"){
			sql +=" ORDER BY zanr";
		}
		sql += " LIMIT ";
		let limit=0;
		for(let i=1; i<parseInt(stranica);i++){
			limit += parseInt(brojFilmova);
		}
		sql += limit + ", " + parseInt(brojFilmova)+ ";";
		var podaci = await this.baza.izvrsiSelect(sql);

		sql = "SELECT COUNT(*) FROM film"
		where = false;
		if(datum!= undefined && datum!= ''){
			if(where==false){
				sql += " WHERE datum_unosa >= \'" + datum + "\'";
				where = true;
			}
			else{
				sql += " AND datum_unosa >= \'" + datum + "\'";
			}
		}
		if(zanr!= undefined && zanr!= ''){
			if(where==false){
				sql += " WHERE EXISTS (SELECT 1 FROM žanr_filma f WHERE f.film_id = film.id AND f.žanr_id = \'" + zanr + "\')";
				where = true;
			}
			else{
				sql += " AND EXISTS (SELECT 1 FROM žanr_filma f WHERE f.film_id = film.id AND f.žanr_id = \'" + zanr + "\')";
			}
		}
		var podaci2 = await this.baza.izvrsiSelect(sql);
		this.baza.zatvoriVezu();
		let brojSvihFilmova
		for (let broj of podaci2){
			brojSvihFilmova = broj["COUNT(*)"];
		}
		let brojStranica = Math.ceil(brojSvihFilmova/parseInt(brojFilmova));
		
		podaci.push(JSON.parse('{"brojStranica":"' + brojStranica + '"}'));
		return podaci;
	}

	daj = async function (id) {
		this.baza.spojiSeNaBazu();
		let sql = "SELECT * FROM film WHERE id=?;"
		var podaci = await this.baza.izvrsiSelect(sql, [id]);
		this.baza.zatvoriVezu();
		if(podaci.length == 1)
			return podaci[0];
		else 
			return null;
	}

	dodaj = async function (film,zanr,korID) {
		console.log(film)
		this.baza.spojiSeNaBazu();
		let sada = new Date();
		const datum_izdanja = new Date(film.release_date);
		let datum_izdanja_tekst = datum_izdanja.toLocaleString("sh-SH", {
			day: "2-digit",
			month: "2-digit",
			year: "numeric",
			hour: "2-digit",
			minute: "2-digit",
			second: "2-digit"
		  });
		  let datum_unosa = sada.toLocaleString("sh-SH", {
			day: "2-digit",
			month: "2-digit",
			year: "numeric",
			hour: "2-digit",
			minute: "2-digit",
			second: "2-digit"
		  });
		let sql = `INSERT INTO film (id, naziv, orginalni_naziv, opis, datum_unosa, popularnost,
             datum_izdanja, prihod, budžet, trajanje, status, za_odrasle, poster, početna_stranica, 
             pozadinska_slika, imdb_id, prosječna_ocjena, broj_ocjena, orginalni_jezik, video, 
             slogan, odobren, korisnik_id,zanr) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)`;
        let podaci = [film.id, film.title, film.original_title, film.overview, datum_unosa, film.popularity,
            datum_izdanja_tekst, film.revenue, film.budget, film.runtime, film.status, film.adult, film.poster_path,
            film.homepage, film.backdrop_path, film.imdb_id, film.vote_average, film.vote_count, 
            film.original_language, film.video, film.tagline, 0, korID, zanr];
		await this.baza.izvrsiUpit(sql,podaci);
		this.baza.zatvoriVezu();
		return true;
	}

	dodajZanr = async function (zanr,film){
		this.baza.spojiSeNaBazu();
		let sql = `INSERT INTO žanr_filma (žanr_id, film_id) 
             VALUES (?, ?)`;
        let podaci = [zanr,film];
		await this.baza.izvrsiUpit(sql,podaci);
		return true;
	}

	obrisi = async function (id) {
		this.baza.spojiSeNaBazu();
		let sql = "DELETE FROM film WHERE id=?";
		await this.baza.izvrsiUpit(sql,[id]);
		this.baza.zatvoriVezu();
		return true;
	}

	azuriraj = async function (id, film) {
		this.baza.spojiSeNaBazu();
		let sql = `UPDATE film SET id=?, naziv=?, orginalni_naziv=?, opis=?, popularnost=?,
            datum_izdanja=?, prihod=?, budžet=?, trajanje=?, status=?, za_odrasle=?, poster=?, početna_stranica=?, 
            pozadinska_slika=?, imdb_id=?, prosječna_ocjena=?, broj_ocjena=?, orginalni_jezik=?, video=?, 
            slogan=?, odobren=?, korisnik_id=?, zanr=? 
            WHERE id=?`;
       let podaci = [film.id, film.naziv, film.orginalni_naziv, film.opis, film.popularnost,
           film.datum_izdanja, film.prihod, film.budžet, film.trajanje, film.status, film.za_odrasle, film.poster,
           film.početna_stranica, film.pozadinska_slika, film.imdb_id, film.prosječna_ocjena, film.broj_ocjena, 
           film.orginalni_jezik, film.video, film.slogan, film.odobren, film.korisnik_id, film.zanr, id];
		await this.baza.izvrsiUpit(sql,podaci);
		this.baza.zatvoriVezu();
		return true;
	}
}

module.exports = FilmDAO;