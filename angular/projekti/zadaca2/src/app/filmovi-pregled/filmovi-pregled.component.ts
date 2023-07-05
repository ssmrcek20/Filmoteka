import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { FilmI } from '../servisi/FilmoviI';
import { ParametriI } from '../servisi/ParametriI';

@Component({
  selector: 'app-filmovi-pregled',
  templateUrl: './filmovi-pregled.component.html',
  styleUrls: ['./filmovi-pregled.component.scss']
})
export class FilmoviPregledComponent implements OnInit {
  uspjeh = "";
  greska = "";
  filmovi = new Array<FilmI>();
  url = environment.appServer;
  sort = "";
  datum = "";
  zanr = "";
  brojStranica = 0;
  stranica = 0;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.dajFilmove(1);
  }

  async dajFilmove(str: number){
    let zaglavlje = new Headers();
    zaglavlje.set("Content-Type", "application/json");
    let parametri: ParametriI = {
      method: 'POST',
      headers: zaglavlje
    };
    window.fetch(this.url + 'filmoviPregled?str=' + str + "&zanr=" + this.zanr + "&datum=" + this.datum + "&sortiraj=" + this.sort, parametri)
    .then(response => response.json())
  .then(data => {
    console.log(data);
    if(data.greska){
      this.porukaGreske(data.greska);
    }
    else {
      this.brojStranica = data[data.length - 1].brojStranica;
      this.filmovi = data.slice(0, -1);
      this.stranica = str;
    }
  });
  }


  porukaUspjeha() {
    this.uspjeh = "Film dodan u bazu!";
    this.greska = "";
  }

  porukaGreske(poruka: string) {
    this.greska = poruka;
    this.uspjeh = "";
  }

  prikaziFilm(film: FilmI) {
    this.router.navigate(['/film',film.id]);
  }
}
