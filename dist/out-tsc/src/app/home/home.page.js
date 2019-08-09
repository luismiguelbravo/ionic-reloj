import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import * as moment from 'moment';
import { AlertController, ActionSheetController, ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Entrada } from '../Entrada';
import { ContadorService } from '../commons/contador.service';
import { OrderPipe } from 'ngx-order-pipe';
import { AgregarPage } from '../entrada/agregar/agregar.page';
var HomePage = /** @class */ (function () {
    function HomePage(alertController, storage, contadorService, orderPipe, actionSheetController, modalController) {
        this.alertController = alertController;
        this.storage = storage;
        this.contadorService = contadorService;
        this.orderPipe = orderPipe;
        this.actionSheetController = actionSheetController;
        this.modalController = modalController;
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
        this.listaFiltrada = null;
        this.palabraDeBusqueda = "";
        this.mostrarFormulario = false;
        console.log("constructor del home");
    }
    HomePage.prototype.mostrarFomulario = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var vm, modal, data;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        vm = this;
                        return [4 /*yield*/, this.modalController.create({ component: AgregarPage })];
                    case 1:
                        modal = _a.sent();
                        modal.present();
                        return [4 /*yield*/, modal.onWillDismiss()];
                    case 2:
                        data = (_a.sent()).data;
                        if (typeof data !== "undefined") {
                            if (data.guardar) {
                                vm.guardar(data.horaDeEntrada, data.fechaDeEntrada, data.tituloDeEntrada);
                            }
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    HomePage.prototype.editar = function (entrada) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var vm, modal, data, index;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        vm = this;
                        return [4 /*yield*/, this.modalController.create({
                                component: AgregarPage,
                                componentProps: {
                                    entrada: entrada
                                }
                            })];
                    case 1:
                        modal = _a.sent();
                        modal.present();
                        return [4 /*yield*/, modal.onWillDismiss()];
                    case 2:
                        data = (_a.sent()).data;
                        if (typeof data !== "undefined") {
                            if (data.guardar) {
                                index = 0;
                                while (index < vm.listaDeFechas.length) {
                                    if (vm.listaDeFechas[index].id === entrada.id) {
                                        break;
                                    }
                                    index++;
                                }
                                vm.listaDeFechas[index].fecha = data.fechaDeEntrada.substring(0, 10) + ' ' + data.horaDeEntrada.substring(11, 19);
                                vm.listaDeFechas[index].titulo = data.tituloDeEntrada;
                                vm.listaDeFechas = vm.listaDeFechas.sort(function (a, b) {
                                    if (a.fecha < b.fecha) {
                                        return 1;
                                    }
                                    if (a.fecha > b.fecha) {
                                        return -1;
                                    }
                                    return 0;
                                });
                                this.listaFiltrada = this.listaDeFechas;
                                vm.storage.set('listaDeFechas', vm.listaDeFechas);
                                vm.exitoAlguardar();
                            }
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    HomePage.prototype.mostrarMenuDeOrdenamiento = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var vm, actionSheet;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        vm = this;
                        return [4 /*yield*/, this.actionSheetController.create({
                                header: 'Ordenar',
                                buttons: [{
                                        text: 'Orden Ascendente',
                                        icon: 'arrow-up',
                                        handler: function () {
                                            // verficiar que el cuadro de busqueda este lleno o no
                                            if (vm.palabraDeBusqueda === '') {
                                                vm.listaDeFechas = vm.listaDeFechas.sort(function (a, b) {
                                                    if (a.fecha < b.fecha) {
                                                        return -1;
                                                    }
                                                    if (a.fecha > b.fecha) {
                                                        return 1;
                                                    }
                                                    return 0;
                                                });
                                                vm.listaFiltrada = vm.listaDeFechas;
                                                vm.storage.set('listaDeFechas', vm.listaDeFechas);
                                            }
                                            else {
                                                vm.listaFiltrada = vm.listaFiltrada.sort(function (a, b) {
                                                    if (a.fecha < b.fecha) {
                                                        return -1;
                                                    }
                                                    if (a.fecha > b.fecha) {
                                                        return 1;
                                                    }
                                                    return 0;
                                                });
                                            }
                                        }
                                    }, {
                                        text: 'Orden descendente',
                                        icon: 'arrow-down',
                                        handler: function () {
                                            if (vm.palabraDeBusqueda === '') {
                                                vm.listaDeFechas = vm.listaDeFechas.sort(function (a, b) {
                                                    if (a.fecha < b.fecha) {
                                                        return 1;
                                                    }
                                                    if (a.fecha > b.fecha) {
                                                        return -1;
                                                    }
                                                    return 0;
                                                });
                                                vm.listaFiltrada = vm.listaDeFechas;
                                                vm.storage.set('listaDeFechas', vm.listaDeFechas);
                                            }
                                            else {
                                                vm.listaFiltrada = vm.listaFiltrada.sort(function (a, b) {
                                                    if (a.fecha < b.fecha) {
                                                        return 1;
                                                    }
                                                    if (a.fecha > b.fecha) {
                                                        return -1;
                                                    }
                                                    return 0;
                                                });
                                            }
                                        }
                                    }]
                            })];
                    case 1:
                        actionSheet = _a.sent();
                        return [4 /*yield*/, actionSheet.present()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
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
                                                _this.listaFiltrada = _this.listaDeFechas;
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
                        this.listaFiltrada = this.listaDeFechas;
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
        var vm = this;
        vm.storage.get('listaDeFechas').then(function (val) {
            vm.listaDeFechas = val;
            if (val === null) {
                vm.listaDeFechas = [];
                vm.usarSemilla();
            }
            console.log(_this.listaDeFechas);
            vm.listaDeFechas = _this.listaDeFechas.sort(function (a, b) {
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
            vm.listaFiltrada = vm.listaDeFechas;
            vm.contadorService.iniciarMovimiento();
        });
    };
    HomePage.prototype.usarSemilla = function () {
        console.log("usarSemilla");
        this.listaDeFechas.push({ fecha: "2019-05-27 09:00", titulo: "Empleo en 3it", id: "donb95" });
        this.listaDeFechas.push({ fecha: "2016-10-19 00:00", titulo: "Llegada a Chile", id: "donb956" });
        this.listaDeFechas.push({ fecha: "2019-06-07 15:16", titulo: "Ultima vez que fume y bebi alcohol", id: "dxpb95" });
        this.listaDeFechas.push({ fecha: "2021-01-01 00:00", titulo: "Fecha esperada", id: "zonbz5" });
        this.listaDeFechas.push({ fecha: "2019-07-01 20:55", titulo: "Aplicacion para vender mariposas digitales", id: "cualquf4" });
        this.listaDeFechas.push({ fecha: "2019-09-13 23:43", titulo: "Viaje a Perú", id: "inb95" });
        this.storage.set('listaDeFechas', this.listaDeFechas);
        this.exitoAlguardar();
    };
    HomePage.prototype.guardar = function (horaDeEntrada, fechaDeEntrada, tituloDeEntrada) {
        var vm = this;
        if (horaDeEntrada === '' || fechaDeEntrada === '' || tituloDeEntrada === '') {
            vm.errorAlGuardar();
        }
        else {
            var nuevaFecha = new Entrada();
            nuevaFecha.fecha = fechaDeEntrada.substring(0, 10) + ' ' + horaDeEntrada.substring(11, 19);
            nuevaFecha.titulo = tituloDeEntrada;
            nuevaFecha.id = Math.random().toString(36).substring(7);
            vm.listaDeFechas.push(nuevaFecha);
            vm.listaDeFechas = vm.listaDeFechas.sort(function (a, b) {
                if (a.fecha < b.fecha) {
                    return 1;
                }
                if (a.fecha > b.fecha) {
                    return -1;
                }
                return 0;
            });
            this.listaFiltrada = this.listaDeFechas;
            vm.storage.set('listaDeFechas', vm.listaDeFechas);
            vm.exitoAlguardar();
        }
    };
    HomePage.prototype.debug = function () {
        console.log(this.listaDeFechas);
    };
    HomePage.prototype.buscar = function () {
        var vm = this;
        vm.listaFiltrada = vm.listaDeFechas.filter(function (element) {
            return element.titulo.toLowerCase().includes(vm.palabraDeBusqueda.toLowerCase()) || element.fecha.includes(vm.palabraDeBusqueda);
        });
    };
    HomePage = tslib_1.__decorate([
        Component({
            selector: 'app-home',
            templateUrl: 'home.page.html',
            styleUrls: ['home.page.scss'],
        }),
        tslib_1.__metadata("design:paramtypes", [AlertController,
            Storage,
            ContadorService,
            OrderPipe,
            ActionSheetController,
            ModalController])
    ], HomePage);
    return HomePage;
}());
export { HomePage };
//# sourceMappingURL=home.page.js.map