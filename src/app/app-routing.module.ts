import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: './home/home.module#HomePageModule'
  },
  {
    path: 'list',
    loadChildren: './list/list.module#ListPageModule'
  },  { path: 'bienvenida', loadChildren: './bienvenida/bienvenida.module#BienvenidaPageModule' },
  { path: 'privacidad', loadChildren: './privacidad/privacidad.module#PrivacidadPageModule' }

  /*{ path: 'agregar', loadChildren: './entrada/agregar/agregar.module#AgregarPageModule' }*/
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  providers: [SocialSharing],
  exports: [RouterModule]
})
export class AppRoutingModule {}
