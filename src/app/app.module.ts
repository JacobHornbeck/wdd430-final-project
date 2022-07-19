import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from "@angular/common/http";

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { FilterSolvesPipe } from './filter-solves.pipe';

import { TimerComponent } from './timer/timer.component';
import { SolveListComponent } from './solve-list/solve-list.component';

@NgModule({
    declarations: [
        AppComponent,
        FilterSolvesPipe,
        TimerComponent,
        SolveListComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        AppRoutingModule,
        HttpClientModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
