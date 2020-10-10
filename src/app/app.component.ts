import { Component, enableProdMode } from '@angular/core';
import { DatePipe } from '@angular/common';

enableProdMode();

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ahu';
  constructor( ){}
}
