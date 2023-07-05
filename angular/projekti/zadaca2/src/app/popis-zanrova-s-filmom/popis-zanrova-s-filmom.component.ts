import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';
import { ZanroviI } from '../servisi/ZanroviI';

@Component({
  selector: 'app-popis-zanrova-s-filmom',
  templateUrl: './popis-zanrova-s-filmom.component.html',
  styleUrls: ['./popis-zanrova-s-filmom.component.scss']
})
export class PopisZanrovaSFilmomComponent implements OnInit {

  url = environment.appServer;
  zanrovi = new Array<ZanroviI>();

  ngOnInit(): void {
    this.dohvatiZanrove();
  }

  async dohvatiZanrove() {
    let odgovor = await fetch(this.url + 'dajSveZanrove');
    let podaci = await odgovor.text();
    this.zanrovi = JSON.parse(podaci);
    this.dohvatiFilmove();
  }

  async dohvatiFilmove(){
    for (let z of this.zanrovi) {
      let odgovor = await fetch(this.url + 'dajDvaFilma?zanr=' + z.id);
      let podaci = await odgovor.text();
      console.log(JSON.parse(podaci));
      z.filmovi = JSON.parse(podaci);
    }
  }

}
