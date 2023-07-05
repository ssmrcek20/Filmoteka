import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-registracija',
  templateUrl: './registracija.component.html',
  styleUrls: ['./registracija.component.scss'],
})
export class RegistracijaComponent {
  constructor(private router: Router,private recaptchaV3Service: ReCaptchaV3Service) {}
  uspjeh = '';
  greska = '';
  url = environment.appServer;
  lozinka = '';
  korime = '';
  ime = '';
  prezime = '';
  email = '';

  registracija() {

    if(!this.korime || !this.lozinka){
      this.porukaGreske("Upiši Korisničko ime i Lozinku!");
      return;
    }

    this.recaptchaV3Service.execute('registracija')
    .subscribe((token: string) => {

      const parametri = {
        method: 'POST',
        body: JSON.stringify({
          korime: this.korime,
          lozinka: this.lozinka,
          email: this.email,
          prezime: this.prezime,
          ime: this.ime,
          tokenCAPTCHA: token
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      };

      window
        .fetch(this.url + 'registracija', parametri)
        .then((response) => response.json())
        .then((data) => {
          if (data.greska) {
            this.porukaGreske("Registracija nije uspjela!");
          } else {
            this.porukaUspjeha();
            this.router.navigate(['/prijava']);
          }
        });
    });
  }

  porukaUspjeha() {
    this.uspjeh = 'Uspješna prijava';
    this.greska = '';
  }

  porukaGreske(poruka: string) {
    this.greska = poruka;
    this.uspjeh = '';
  }
}
