import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import * as moment from 'moment';
import { AlertController } from '@ionic/angular';
var HomePage = /** @class */ (function () {
    function HomePage(alertController) {
        this.alertController = alertController;
        this.fechaDeHoy = moment(); //.format('YYYY-MM-DD HH:mm:ss');
        this.finalDeLaEspera = moment("2021-01-01");
        this.diferencia = null;
        this.diferenciaString = "";
        this.diferenciaEnSegundos = null;
        this.diferenciaEnMinutos = null;
        this.diferenciaEnHoras = null;
        this.diferenciaEnDias = null;
        this.diferenciaEnMeses = null;
        this.diferenciaEnYears = null;
        this.fechaDeEntrada = "2021-01-01";
        this.horaDeEntrada = "00:00";
    }
    HomePage.prototype.exitoAlguardar = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var alert;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.alertController.create({
                            header: 'Éxito',
                            subHeader: '',
                            message: 'Fecha guardada correctamente.',
                            buttons: ['OK']
                        })];
                    case 1:
                        alert = _a.sent();
                        return [4 /*yield*/, alert.present()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    HomePage.prototype.errorAlGuardar = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var alert;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.alertController.create({
                            header: 'Error',
                            subHeader: '',
                            message: 'Titulo o fecha invalida.',
                            buttons: ['OK']
                        })];
                    case 1:
                        alert = _a.sent();
                        return [4 /*yield*/, alert.present()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    HomePage.prototype.ngOnInit = function () {
        this.ticTac();
    };
    HomePage.prototype.ticTac = function () {
        var _this = this;
        setTimeout(function () {
            _this.calcularDiferencias();
            _this.ticTac();
        }, 900);
    };
    HomePage.prototype.guardar = function () {
        console.log("GUARDANDO");
        console.log("");
        console.log(" =============== fechaDeEntrada =============== ");
        console.log(this.fechaDeEntrada === '');
        console.log(" =============== fechaDeEntrada =============== ");
        console.log("");
        console.log(this.horaDeEntrada === '');
        console.log(" =============== horaDeEntrada =============== ");
        console.log("");
        // this.errorAlGuardar();
    };
    HomePage.prototype.calcularDiferencias = function () {
        this.fechaDeHoy = moment();
        this.diferenciaEnYears = this.finalDeLaEspera.diff(this.fechaDeHoy, 'years');
        this.fechaDeHoy.add(this.diferenciaEnYears, 'years');
        this.diferenciaEnMeses = this.finalDeLaEspera.diff(this.fechaDeHoy, 'months');
        this.fechaDeHoy.add(this.diferenciaEnMeses, 'months');
        this.diferenciaEnDias = this.finalDeLaEspera.diff(this.fechaDeHoy, 'days');
        this.fechaDeHoy.add(this.diferenciaEnDias, 'days');
        this.diferenciaEnHoras = this.finalDeLaEspera.diff(this.fechaDeHoy, 'hours');
        this.fechaDeHoy.add(this.diferenciaEnHoras, 'hours');
        this.diferenciaEnMinutos = this.finalDeLaEspera.diff(this.fechaDeHoy, 'minutes');
        this.fechaDeHoy.add(this.diferenciaEnMinutos, 'minutes');
        this.diferenciaEnSegundos = this.finalDeLaEspera.diff(this.fechaDeHoy, 'seconds');
    };
    HomePage = tslib_1.__decorate([
        Component({
            selector: 'app-home',
            templateUrl: 'home.page.html',
            styleUrls: ['home.page.scss'],
        }),
        tslib_1.__metadata("design:paramtypes", [AlertController])
    ], HomePage);
    return HomePage;
}());
export { HomePage };
//# sourceMappingURL=home.page.js.map