import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-odjava',
  templateUrl: './odjava.component.html',
  styleUrls: ['./odjava.component.scss']
})
export class OdjavaComponent implements OnInit {

  url = environment.appServer;
  constructor(private router: Router) {}

  ngOnInit(): void {
    this.odjava();
  }

  async odjava() {
    let odgovor = await fetch(this.url + 'odjava');

    this.router.navigate(['']);
  }
}
