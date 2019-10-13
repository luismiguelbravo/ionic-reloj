import { __decorate, __metadata } from "tslib";
import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { IdiomaService } from './commons/idioma.service';
var AppComponent = /** @class */ (function () {
    function AppComponent(platform, splashScreen, statusBar, idiomaService) {
        this.platform = platform;
        this.splashScreen = splashScreen;
        this.statusBar = statusBar;
        this.idiomaService = idiomaService;
        this.appPages = [
            {
                title: 'Inicio',
                url: '/home',
                icon: 'home'
            },
            {
                title: 'List',
                url: '/list',
                icon: 'list'
            }
        ];
        this.initializeApp();
    }
    AppComponent.prototype.initializeApp = function () {
        var _this = this;
        this.platform.ready().then(function () {
            _this.statusBar.styleDefault();
            _this.splashScreen.hide();
        });
    };
    AppComponent = __decorate([
        Component({
            selector: 'app-root',
            templateUrl: 'app.component.html'
        }),
        __metadata("design:paramtypes", [Platform,
            SplashScreen,
            StatusBar,
            IdiomaService])
    ], AppComponent);
    return AppComponent;
}());
export { AppComponent };
//# sourceMappingURL=app.component.js.map