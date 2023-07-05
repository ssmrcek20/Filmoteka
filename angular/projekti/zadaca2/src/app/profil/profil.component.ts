import { Component } from '@angular/core';
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { environment } from '../../environments/environment';
import { ParametriI } from '../servisi/ParametriI';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.scss']
})
export class ProfilComponent {
  uspjeh = "";
  greska = "";
  url = environment.appServer;
  ime = "";
  prezime = "";
  
  korime = "";
  email = "";

  constructor(private recaptchaV3Service: ReCaptchaV3Service){}

  ngOnInit(): void {
    this.dohvatiKorisnika();
  }

  async dohvatiKorisnika() {
    let zaglavlje = new Headers();
    zaglavlje.set("Content-Type", "application/json");
    let parametri: ParametriI = {
      method: 'POST',
      headers: zaglavlje
    };
    window.fetch(this.url + 'profil', parametri)
    .then(response => response.json())
  .then(data => {
    console.log(data);
    if(data.greska){
      this.porukaGreske(data.greska);
    }
    else {
      this.korime = data.korime;
      this.email = data.email;
      this.ime = data.ime;
      this.prezime = data.prezime;
    }
  });

  }

  azuriranje(){
    this.recaptchaV3Service.execute('azuriranje')
    .subscribe((token: string) => {

      let zaglavlje = new Headers();
      zaglavlje.set("Content-Type", "application/json");
      let tijelo = JSON.stringify({ ime: this.ime, prezime: this.prezime, tokenCAPTCHA: token })
      let parametri: ParametriI = {
        method: 'POST',
        body: tijelo,
        headers: zaglavlje
      };
      window.fetch(this.url + 'profilAzuriraj', parametri)
      .then(response => response.json())
    .then(data => {
      console.log(data);
      if(data.greska){
        this.porukaGreske(data.greska);
      }
      else {
        this.porukaUspjeha();
      }
    });
  });
  }

  porukaUspjeha() {
    this.uspjeh = "Uspješna promjena podataka!";
    this.greska = "";
  }

  porukaGreske(poruka: string) {
    this.greska = poruka;
    this.uspjeh = "";
  }
}
