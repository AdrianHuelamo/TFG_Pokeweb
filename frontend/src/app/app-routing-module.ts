import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Home } from './components/home/home';
import { Login } from './components/login/login';
import { PokeDetail } from './components/details/poke-detail/poke-detail';
import { About } from './components/details/tabs/about/about';
import { Stats } from './components/details/tabs/stats/stats';
import { Evolutions } from './components/details/tabs/evolutions/evolutions';
import { Moves } from './components/details/tabs/moves/moves';
import { Comunidad } from './components/comunidad/comunidad';
import { NoticiaDetails } from './components/noticia-details/noticia-details';
import { Register } from './components/register/register';
import { Profile } from './components/profile/profile';

const routes: Routes = [
  { 
    path: '', redirectTo: 'home', pathMatch: 'full' 
  },
  { 
    path: 'home', component: Home 
  },
  { 
    path: 'login', component: Login 
  },
  { 
    path: 'comunidad', component: Comunidad 
  },
  { 
    path: 'noticia/:id', component: NoticiaDetails 
  },
  { 
    path: 'register', component: Register 
  },
  { 
    path: 'profile', component: Profile 
  },
  {
    path: 'pokemon/:id',
    component: PokeDetail,
    children: [
      { path: '', redirectTo: 'about', pathMatch: 'full' }, 
      { path: 'about', component: About },
      { path: 'stats', component: Stats },
      { path: 'evolutions', component: Evolutions },
      { path: 'moves', component: Moves }
    ]
  },

  { path: '**', redirectTo: 'home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }