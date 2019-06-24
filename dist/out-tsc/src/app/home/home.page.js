import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import * as moment from 'moment';
import { AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Entrada } from '../Entrada';
import { ContadorService } from '../commons/contador.service';
var HomePage = /** @class */ (function () {
    function HomePage(alertController, storage, contadorService) {
        this.alertController = alertController;
        this.storage = storage;
        this.contadorService = contadorService;
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
        this.tituloDeEntrada = '';
        this.mostrarFormulario = false;
    }
    HomePage.prototype.exitoAlguardar = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var vm, alert;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        vm = this;
                        return [4 /*yield*/, this.alertController.create({
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
                        vm.fechaDeEntrada = '';
                        vm.horaDeEntrada = '';
                        vm.tituloDeEntrada = '';
                        vm.mostrarFormulario = false;
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
            _this.listaDeFechas = _this.listaDeFechas.sort(function (a, b) {
                var fechaA = new Date(a.fecha);
                var fechaB = new Date(b.fecha);
                return fechaB.getTime() - fechaA.getTime();
            });
            /*
                se crea un reloj unico que activa a todos los detalles
                esto lo hice para evitar terner un hilo con reloj contador para cada proceso
                debido a que cuando tenga mas de 3000 fechas tendria mas de 3000 segunderos activados independientes
                de esta manera, al tener 3000 fechas, tengo solo un segundero que las mueve todas
            */
            _this.contadorService.iniciarMovimiento();
        });
    };
    HomePage.prototype.usarSemilla = function () {
        console.log("usarSemilla");
        this.listaDeFechas.push({ fecha: "2016-10-19 00:00", titulo: "Llegada a Chile", id: "donb95" });
        this.listaDeFechas.push({ fecha: "2019-05-11 02:41", titulo: "Ultima vez que fume", id: "dopb95" });
        this.listaDeFechas.push({ fecha: "2021-01-01 00:00", titulo: "Fecha esperada", id: "donby5" });
        this.storage.set('listaDeFechas', this.listaDeFechas);
        this.exitoAlguardar();
    };
    HomePage.prototype.guardar = function () {
        var vm = this;
        if (vm.horaDeEntrada === '' || vm.fechaDeEntrada === '' || vm.tituloDeEntrada === '') {
            vm.errorAlGuardar();
        }
        else {
            var nuevaFecha = new Entrada();
            nuevaFecha.fecha = vm.fechaDeEntrada.substring(0, 10) + ' ' + vm.horaDeEntrada.substring(11, 16);
            nuevaFecha.titulo = vm.tituloDeEntrada;
            nuevaFecha.id = Math.random().toString(36).substring(7);
            vm.listaDeFechas.push(nuevaFecha);
            vm.storage.set('listaDeFechas', vm.listaDeFechas);
            vm.exitoAlguardar();
        }
    };
    HomePage.prototype.debug = function () {
        console.log(this.listaDeFechas);
    };
    HomePage = tslib_1.__decorate([
        Component({
            selector: 'app-home',
            templateUrl: 'home.page.html',
            styleUrls: ['home.page.scss'],
        }),
        tslib_1.__metadata("design:paramtypes", [AlertController,
            Storage,
            ContadorService])
    ], HomePage);
    return HomePage;
}());
export { HomePage };
//# sourceMappingURL=home.page.js.map