import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule, } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HttpClientModule, HttpClient } from '@angular/common/http';

import { SlideToggleModule } from 'ngx-slide-toggle';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FanComponent } from './components/fan/fan.component';
import { BomComponent } from './components/bom/bom.component';
import { BeltComponent } from './components/fan/belt/belt.component';
import {MatTabsModule} from '@angular/material/tabs';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatDividerModule} from '@angular/material/divider';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatSelectModule} from '@angular/material/select';
import {MatIconModule} from '@angular/material/icon';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatStepperModule} from '@angular/material/stepper';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import {MatTableModule} from '@angular/material/table';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { EstimateComponent } from './components/coil/estimate/estimate.component';
import { CoilComponent } from './components/coil/coil.component';
import { ItemGroupFilterPipe } from './shared/pipes/itemGroup.pipe';


@NgModule({
  declarations: [
    AppComponent,
    FanComponent,
    BomComponent,
    BeltComponent,
    EstimateComponent,
    CoilComponent,
    ItemGroupFilterPipe
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatTabsModule,
    MatButtonModule,
    MatToolbarModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatDividerModule,
    MatGridListModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatAutocompleteModule,
    NgxMatSelectSearchModule,
    MatTableModule,
    MatButtonToggleModule,
    HttpClientModule,
    MatStepperModule,
    SlideToggleModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
