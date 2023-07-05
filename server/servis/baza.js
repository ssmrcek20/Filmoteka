const sqlite = require('sqlite3');

class Baza {

    constructor() {}

    spojiSeNaBazu(){
        this.db = new sqlite.Database('../baza.sqlite');
        this.db.exec('PRAGMA foreign_keys = ON;');
    }

    izvrsiUpit(sql, podaciZaSQL){
        return new Promise((uspjeh,neuspjeh) => {
            this.db.run(sql, podaciZaSQL, (greska) => {
                if(greska){
                    console.log(greska.message);
                    neuspjeh({ greska: 'Greska' });}
                else{
                    uspjeh({ greska: ''});}
            });
        });
    }

    izvrsiSelect(sql, podaciZaSQL){
        return new Promise((uspjeh,neuspjeh) => {
            this.db.all(sql, podaciZaSQL, (greska, rezultat) => {
                if(greska){
                    neuspjeh(greska);}
                else{
                    uspjeh(rezultat);}
            });
        });
    }

    zatvoriVezu() {
        this.db.close();
    }
}

module.exports = Baza;