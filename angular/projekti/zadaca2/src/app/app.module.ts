import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { PopisZanrovaSFilmomComponent } from './popis-zanrova-s-filmom/popis-zanrova-s-filmom.component';
import { RouterModule, Routes } from '@angular/router'
import { DokumentacijaComponent } from './dokumentacija/dokumentacija.component';
import { PrijavaComponent } from './prijava/prijava.component';
import { FormsModule } from '@angular/forms';
import { RegistracijaComponent } from './registracija/registracija.component';
import { OdjavaComponent } from './odjava/odjava.component';
import { ProfilComponent } from './profil/profil.component';
import { FilmoviPretrazivanjeComponent } from './filmovi-pretrazivanje/filmovi-pretrazivanje.component';
import { FilmoviPregledComponent } from './filmovi-pregled/filmovi-pregled.component';
import { FilmComponent } from './film/film.component';
import { RecaptchaV3Module, RECAPTCHA_V3_SITE_KEY } from 'ng-recaptcha';
import { environment } from '../environments/environment';

const routes:Routes = [
  {path:"", component:PopisZanrovaSFilmomComponent},
  {path:"dokumentacija",component:DokumentacijaComponent},
  {path:"prijava",component:PrijavaComponent},
  {path:"registracija",component:RegistracijaComponent},
  {path:"odjava",component:OdjavaComponent},
  {path:"profil",component:ProfilComponent},
  {path:"filmovi-pretrazivanje",component:FilmoviPretrazivanjeComponent},
  {path:"filmovi-pregled",component:FilmoviPregledComponent},
  {path:"film/:id",component:FilmComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    PopisZanrovaSFilmomComponent,
    DokumentacijaComponent,
    PrijavaComponent,
    RegistracijaComponent,
    OdjavaComponent,
    ProfilComponent,
    FilmoviPretrazivanjeComponent,
    FilmoviPregledComponent,
    FilmComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    RouterModule.forRoot(routes),
    FormsModule,
    RecaptchaV3Module
  ],
  providers: [
    {
      provide: RECAPTCHA_V3_SITE_KEY,
      useValue: environment.siteKey
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
