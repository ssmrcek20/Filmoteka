import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';
import { FilmoviTMDBI, FilmTMDBI } from '../servisi/FilmoviI';
import { ParametriI } from '../servisi/ParametriI';

@Component({
  selector: 'app-filmovi-pretrazivanje',
  templateUrl: './filmovi-pretrazivanje.component.html',
  styleUrls: ['./filmovi-pretrazivanje.component.scss']
})
export class FilmoviPretrazivanjeComponent implements OnInit {
  uspjeh = "";
  greska = "";
  tmdb: FilmoviTMDBI = {
    page: 0,
    results: [],
    total_pages: 0,
    total_results: 0
  };
  url = environment.appServer;
  rijeci = "";


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
    window.fetch(this.url + 'filmoviPretrazivanje?str=' + str + "&filter=" + this.rijeci, parametri)
    .then(response => response.json())
  .then(data => {
    console.log(data);
    if(data.greska){
      this.porukaGreske(data.greska);
    }
    else {
      this.tmdb = data;
    }
  });
  }

  async dodajUBazu(film:FilmTMDBI){
    let zaglavlje = new Headers();
    zaglavlje.set("Content-Type", "application/json");
    let parametri: ParametriI = {
      method: 'POST',
      body: JSON.stringify(film),
      headers: zaglavlje
    };
    window.fetch(this.url + 'dodajFilm', parametri)
    .then(response => response.json())
  .then(data => {
    console.log(data);
    if(data.greska){
      if(data.greska == "Greska"){
        this.porukaGreske("Film već postoji u bazi!");
      }
      else this.porukaGreske(data.greska);
    }
    else {
      this.porukaUspjeha();
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
}
