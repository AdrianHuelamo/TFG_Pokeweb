import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { Login } from './components/login/login';
import { Home } from './components/home/home';
import { Navbar } from './components/navbar/navbar';
import { PokeDetail } from './components/details/poke-detail/poke-detail';
import { About } from './components/details/tabs/about/about';
import { Stats } from './components/details/tabs/stats/stats';
import { Evolutions } from './components/details/tabs/evolutions/evolutions';
import { Moves } from './components/details/tabs/moves/moves';
import { Comunidad } from './components/comunidad/comunidad';
import { NoticiaDetails } from './components/noticia-details/noticia-details';
import { Register } from './components/register/register';

@NgModule({
  declarations: [
    App,
    Login,
    Home,
    Navbar,
    PokeDetail,
    About,
    Stats,
    Evolutions,
    Moves,
    Comunidad,
    NoticiaDetails,
    Register
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule, 
    FormsModule
  ],
  providers: [],
  bootstrap: [App]
})
export class AppModule { }