import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';
import { FilmI } from '../servisi/FilmoviI';
import { KorisnikI } from '../servisi/KorisnikI';
import { ParametriI } from '../servisi/ParametriI';

@Component({
  selector: 'app-film',
  templateUrl: './film.component.html',
  styleUrls: ['./film.component.scss']
})
export class FilmComponent implements OnInit {
  uspjeh = "";
  greska = "";
  film: FilmI = {};
  korisnici = new Array<KorisnikI>();
  url = environment.appServer;
  KorisnikIme = "";

  ngOnInit(): void {
    const dijelovi = window.location.href.split('/');
    const filmID = Number(dijelovi[dijelovi.length - 1]);
    this.dajFilm(filmID);
  }

  dajFilm(filmID:number): void {
    let zaglavlje = new Headers();
    zaglavlje.set("Content-Type", "application/json");
    let parametri: ParametriI = {
      method: 'POST',
      headers: zaglavlje
    };
    window.fetch(this.url + 'film?id=' + filmID, parametri)
    .then(response => response.json())
  .then(data => {
    console.log(data);
    if(data.greska){
      this.porukaGreske(data.greska);
    }
    else {
      this.film = data;
      this.dajKorisnika(this.film.korisnik_id);
    }
  });
  }
  
  dajKorisnika(idKorisnika: number | undefined): void {
    let zaglavlje = new Headers();
    zaglavlje.set("Content-Type", "application/json");
    let parametri: ParametriI = {
      method: 'POST',
      headers: zaglavlje
    };
    window.fetch(this.url + 'korisnici', parametri)
    .then(response => response.json())
  .then(data => {
    console.log(data);
    if(data.greska){
      this.porukaGreske(data.greska);
    }
    else {
      this.korisnici = data;
      for(let korisnik of this.korisnici){
        if(korisnik.id == idKorisnika){
          this.KorisnikIme = korisnik.korime;
        }
      }
    }
  });
  }
  porukaGreske(poruka: string) {
    this.greska = poruka;
    this.uspjeh = "";
  }
}
