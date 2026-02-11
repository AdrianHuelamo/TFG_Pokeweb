import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Home } from './components/home/home';
import { Login } from './components/login/login';
import { TestConexion } from './components/test-conexion/test-conexion';
import { PokeDetail } from './components/details/poke-detail/poke-detail';
import { About } from './components/details/tabs/about/about';
import { Stats } from './components/details/tabs/stats/stats';
import { Evolutions } from './components/details/tabs/evolutions/evolutions';
import { Moves } from './components/details/tabs/moves/moves';

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
  { path: 'test', component: TestConexion },

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