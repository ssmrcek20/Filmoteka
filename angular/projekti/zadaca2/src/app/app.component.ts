import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Filmoteka';
  putanja = "";
  

  ngOnInit(): void {
    const dijelovi = window.location.href.split('/');
    const zadnji = dijelovi[dijelovi.length - 1];
    this.putanja = zadnji;
  }
}
