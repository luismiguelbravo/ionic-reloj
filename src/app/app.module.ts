import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { IonicStorageModule } from '@ionic/storage';

import { Clipboard } from '@ionic-native/clipboard/ngx';

import { OrderModule } from 'ngx-order-pipe'

import { AgregarPageModule } from './entrada/agregar/agregar.module';

@NgModule({
    declarations: [AppComponent],
    entryComponents: [],
    imports: [
        OrderModule,
        BrowserModule,
        IonicModule.forRoot(),
        AppRoutingModule,
        IonicStorageModule.forRoot({
            name: '__mydb',
            driverOrder: ['sqlite', 'indexeddb', 'websql', 'localstorage']
        }),
        AgregarPageModule,
    ],
    providers: [
        Clipboard,
        StatusBar,
        SplashScreen,
            { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
    ],
    bootstrap: [AppComponent],
    schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AppModule {}
