import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { ReCaptchaV3Service } from 'ng-recaptcha';

@Component({
  selector: 'app-prijava',
  templateUrl: './prijava.component.html',
  styleUrls: ['./prijava.component.scss']
})
export class PrijavaComponent {
  constructor(private router: Router,private recaptchaV3Service: ReCaptchaV3Service) {}
  uspjeh = "";
  greska = "";
  url = environment.appServer;
  lozinka = "";
  korime = "";

  async prijava(){

    this.recaptchaV3Service.execute('prijava')
    .subscribe((token: string) => {
          
      const parametri = {
        method: 'POST',
        body: JSON.stringify({ korime: this.korime, lozinka: this.lozinka, tokenCAPTCHA: token }),
        headers: {
          'Content-Type': 'application/json',
        },
      };

      window.fetch(this.url + 'prijava', parametri)
      .then(response => response.json())
    .then(data => {
      console.log(data);
      if(data.greska){
        this.porukaGreske(data.greska);
      }
      else {
        this.porukaUspjeha();
        this.router.navigate(['']);
      }
    });
  });
  }

  porukaUspjeha() {
    this.uspjeh = "Uspješna prijava";
    this.greska = "";
  }

  porukaGreske(poruka: string) {
    this.greska = poruka;
    this.uspjeh = "";
  }
}
