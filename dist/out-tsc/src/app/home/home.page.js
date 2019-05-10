import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import * as moment from 'moment';
import { AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Entrada } from '../Entrada';
var HomePage = /** @class */ (function () {
    function HomePage(alertController, storage) {
        this.alertController = alertController;
        this.storage = storage;
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
        this.fechaDeEntrada = '';
        this.horaDeEntrada = '';
        this.tituloDeEntrada = 'Fecha esperada';
        this.mostrarFormulario = false;
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
    HomePage.prototype.intentarEliminar = function (id) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var alert;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.alertController.create({
                            header: 'Advertencia',
                            message: 'Esta acción no puede ser revertida. <strong>¿Esta seguro de eliminar?</strong>',
                            buttons: [
                                {
                                    text: 'Cancelar',
                                    role: 'cancel',
                                    cssClass: 'secondary',
                                    handler: function (blah) {
                                        console.log('Confirm Cancel: blah');
                                    }
                                }, {
                                    text: 'Eliminar',
                                    handler: function () {
                                        console.log('Confirm Okay');
                                        for (var i = 0; i < _this.listaDeFechas.length; i++) {
                                            if (_this.listaDeFechas[i].id === id) {
                                                _this.listaDeFechas.splice(i, 1);
                                                _this.storage.set('listaDeFechas', _this.listaDeFechas);
                                                break;
                                            }
                                        }
                                    }
                                }
                            ]
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
        var _this = this;
        this.storage.get('listaDeFechas').then(function (val) {
            _this.listaDeFechas = val;
            if (val === null) {
                _this.listaDeFechas = [];
            }
            console.log(_this.listaDeFechas);
            _this.listaDeFechas.sort(function (a, b) {
                var fechaA = new Date(a.fecha);
                var fechaB = new Date(b.fecha);
                return fechaA.getTime() - fechaB.getTime();
            });
        });
    };
    HomePage.prototype.guardar = function () {
        if (this.horaDeEntrada === '' || this.fechaDeEntrada === '' || this.tituloDeEntrada === '') {
            this.errorAlGuardar();
        }
        else {
            var nuevaFecha = new Entrada();
            /*
            nuevaFecha.fecha = moment(
                this.fechaDeEntrada.substring(0,10) + ' ' + this.horaDeEntrada.substring(11, 16),
                'YYYY-MM-DD HH:mm:ss'
            ).toDate();
            */
            nuevaFecha.fecha = this.fechaDeEntrada.substring(0, 10) + ' ' + this.horaDeEntrada.substring(11, 16);
            //nuevaFecha.fecha = new Date(this.fechaDeEntrada + ' ' + this.horaDeEntrada);
            nuevaFecha.titulo = this.tituloDeEntrada;
            nuevaFecha.id = Math.random().toString(36).substring(7);
            this.listaDeFechas.push(nuevaFecha);
            this.storage.set('listaDeFechas', this.listaDeFechas);
            this.exitoAlguardar();
        }
    };
    HomePage = tslib_1.__decorate([
        Component({
            selector: 'app-home',
            templateUrl: 'home.page.html',
            styleUrls: ['home.page.scss'],
        }),
        tslib_1.__metadata("design:paramtypes", [AlertController, Storage])
    ], HomePage);
    return HomePage;
}());
export { HomePage };
//# sourceMappingURL=home.page.js.map