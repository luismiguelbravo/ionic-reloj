import { __awaiter, __decorate, __generator, __metadata } from "tslib";
import { Component } from '@angular/core';
import * as moment from 'moment';
import { AlertController, ActionSheetController, ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Entrada } from '../Entrada';
import { ContadorService } from '../commons/contador.service';
import { OrderPipe } from 'ngx-order-pipe';
import { AgregarPage } from '../entrada/agregar/agregar.page';
import { BienvenidaPage } from '../bienvenida/bienvenida.page';
import { IdiomaService } from '../commons/idioma.service';
var HomePage = /** @class */ (function () {
    function HomePage(alertController, storage, contadorService, orderPipe, actionSheetController, modalController, idiomaService) {
        this.alertController = alertController;
        this.storage = storage;
        this.contadorService = contadorService;
        this.orderPipe = orderPipe;
        this.actionSheetController = actionSheetController;
        this.modalController = modalController;
        this.idiomaService = idiomaService;
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
        this.miIdioma = {
            "indice": 47, "Heteroglotonimo": "Inglés", "Autoglotonimo": "English",
            "Welcome": "Welcome",
            "Search": "Search",
            "Ascending order": "Ascending order",
            "Descending order": "Descending order",
            "Save": "Save",
            "Cancel": "Cancel",
            "Success": "Success",
            "Event saved successfully.": "Event saved successfully.",
            "Warning": "Warning",
            "This action cannot be reversed.": "This action cannot be reversed.",
            "Remove": "Remove",
            "Title": "Title",
            "Event": "Event",
            "Year": "Year",
            "Month": "Month",
            "Day": "Day",
            "Hour": "Hour",
            "Minute": "Minute",
            "Second": "Second",
            "Months": [
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December"
            ]
        };
        console.log("constructor del home");
    }
    HomePage.prototype.mostrarFomulario = function () {
        return __awaiter(this, void 0, void 0, function () {
            var vm, modal, data;
            return __generator(this, function (_a) {
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
                                console.log("");
                                console.log("----------- datos recividos del modal -----------");
                                console.log(data);
                                console.log("----------- datos recividos del modal -----------");
                                console.log("");
                                //vm.guardar(data.horaDeEntrada, data.fechaDeEntrada, data.tituloDeEntrada )
                                vm.guardar(data);
                            }
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    HomePage.prototype.editar = function (entrada) {
        return __awaiter(this, void 0, void 0, function () {
            var vm, modal, data, index;
            return __generator(this, function (_a) {
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
        return __awaiter(this, void 0, void 0, function () {
            var vm, actionSheet;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        vm = this;
                        return [4 /*yield*/, this.actionSheetController.create({
                                header: vm.miIdioma['Order'],
                                buttons: [{
                                        text: vm.miIdioma['Ascending order'],
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
                                        text: vm.miIdioma['Descending order'],
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
        return __awaiter(this, void 0, void 0, function () {
            var vm, alert;
            return __generator(this, function (_a) {
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
        return __awaiter(this, void 0, void 0, function () {
            var alert;
            return __generator(this, function (_a) {
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
        return __awaiter(this, void 0, void 0, function () {
            var vm, alert;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        vm = this;
                        return [4 /*yield*/, this.alertController.create({
                                header: vm.miIdioma['Warning'],
                                message: vm.miIdioma['This action cannot be reversed.'],
                                buttons: [
                                    {
                                        text: vm.miIdioma['Cancel'],
                                        role: 'cancel',
                                        cssClass: 'secondary',
                                        handler: function (blah) {
                                            console.log('Confirm Cancel: blah');
                                        }
                                    }, {
                                        text: vm.miIdioma['Delete'],
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
    HomePage.prototype.bajalo_para_aca = function (id) {
        var vm = this;
        vm.contadorService.setIdSeleccionado(id);
        console.log("scrolling to " + id);
        var el = document.getElementById(id);
        el.scrollIntoView();
    };
    HomePage.prototype.seleccionar_reloj = function (id) {
        var vm = this;
        vm.contadorService.setIdSeleccionado(id);
        console.log("scrolling to " + id);
        var el = document.getElementById(id);
        el.scrollIntoView();
    };
    HomePage.prototype.get_id_Seleccionado = function () {
        return this.contadorService.getIdSeleccionado();
    };
    HomePage.prototype.ngOnInit = function () {
        var _this = this;
        var vm = this;
        /*
        setTimeout(() => {
            vm.bajalo_para_aca('55')
        }, 1000);*/
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
            console.log("recorriendo las fechas");
            var right_now = moment();
            var fecha_auxiliar = null;
            var alguna_modificacion = false;
            vm.listaDeFechas.forEach(function (entrada) {
                fecha_auxiliar = moment({
                    years: entrada.year,
                    months: entrada.mes,
                    days: entrada.dia,
                    hours: entrada.hora,
                    minutes: entrada.minuto,
                    seconds: entrada.segundo
                });
                // actualizar el idioma de los nombres de los meses por si cambio de fecha ???
                // solo actualizar el nombre del mes al guardar o editar el evento
                if (right_now > fecha_auxiliar && entrada.pasado === false) {
                    // date is past
                    console.log(entrada);
                    entrada.pasado = true;
                    alguna_modificacion = true;
                }
            });
            if (alguna_modificacion) {
                console.log("------------- ocurrio alguna modificacion ------------- ");
                _this.storage.set('listaDeFechas', _this.listaDeFechas);
            }
            // recorrer toda esta vaina para ver que esta en el pasado
            /*
                se crea un reloj unico que activa a todos los detalles
                esto lo hice para evitar terner un hilo con reloj contador para cada proceso
                debido a que cuando tenga mas de 3000 fechas tendria mas de 3000 segunderos activados independientes
                de esta manera, al tener 3000 fechas, tengo solo un segundero que las mueve todas

                // ahora voy a activar un hilo del reloj, solo cuando se abre el detalle de una fecha,
                esto para proteger el consumo del procesador.
            */
            vm.listaFiltrada = vm.listaDeFechas;
            vm.contadorService.iniciarMovimiento();
        });
        // preguntar por el idioma seleccionado
        vm.storage.get('miIdioma').then(function (miIdioma) {
            console.log("Idioma seleccionado");
            console.log("");
            console.log(" --------- miIdioma --------- ");
            console.log(miIdioma);
            console.log(" --------- miIdioma --------- ");
            console.log("");
            if (miIdioma === null) {
                vm.seleccionarIdioma();
            }
            else {
                vm.idiomaService.seleccionar_idioma(miIdioma);
                vm.miIdioma = miIdioma;
            }
        });
    };
    HomePage.prototype.seleccionarIdioma = function () {
        return __awaiter(this, void 0, void 0, function () {
            var vm, modal, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        vm = this;
                        return [4 /*yield*/, this.modalController.create({
                                component: BienvenidaPage
                            })];
                    case 1:
                        modal = _a.sent();
                        modal.present();
                        return [4 /*yield*/, modal.onWillDismiss()];
                    case 2:
                        data = (_a.sent()).data;
                        if (typeof data !== "undefined") {
                            console.log("");
                            console.log(" ------------ data.guardar ------------");
                            console.log(data.guardar);
                            console.log(" ------------ data.guardar ------------");
                            console.log("");
                            // si puedo guardar
                            if (typeof data.guardar === "undefined" || data.guardar !== false) {
                                this.storage.set('miIdioma', data.ididomaSeleccionado);
                                this.idiomaService.seleccionar_idioma(data.ididomaSeleccionado);
                                vm.miIdioma = data.ididomaSeleccionado;
                            }
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    HomePage.prototype.usarSemilla = function () {
        console.log("usarSemilla");
        this.listaDeFechas.push({
            fecha: "2020-10-19 00:00", titulo: "Cumpleaño 2020", id: "cumple2020",
            year: 2020,
            mes: 10,
            dia: 19,
            hora: 0,
            minuto: 0,
            segundo: 0,
            pasado: false
        });
        this.listaDeFechas.push({
            fecha: "2020-10-01 00:00", titulo: "Regreso de Camila Daniela Garcia Valle a Chile", id: "danica202",
            year: 2020,
            mes: 10,
            dia: 1,
            hora: 0,
            minuto: 0,
            segundo: 0,
            pasado: false
        });
        this.listaDeFechas.push({
            fecha: "2019-10-19 00:00", titulo: "Cumpleaño 2019", id: "cumple2019",
            year: 2019,
            mes: 10,
            dia: 19,
            hora: 0,
            minuto: 0,
            segundo: 0,
            pasado: false
        });
        this.listaDeFechas.push({ fecha: "2019-05-27 09:00", titulo: "Empleo en 3it", id: "donb95",
            year: 2019,
            mes: 5,
            dia: 27,
            hora: 9,
            minuto: 0,
            segundo: 0,
            pasado: false
        });
        this.listaDeFechas.push({ fecha: "2016-10-19 00:00", titulo: "Llegada a Chile", id: "donb956",
            year: 2016,
            mes: 10,
            dia: 19,
            hora: 0,
            minuto: 0,
            segundo: 0,
            pasado: false
        });
        this.listaDeFechas.push({ fecha: "2019-09-29 00:00", titulo: "Cumpleaños Javiera Anais", id: "19",
            year: 2019,
            mes: 9,
            dia: 29,
            hora: 0,
            minuto: 0,
            segundo: 0,
            pasado: false
        });
        this.listaDeFechas.push({ fecha: "2019-09-12 22:30", titulo: "Deje de fumar y beber", id: "Reunión Postulantes",
            year: 2022,
            mes: 9,
            dia: 12,
            hora: 20,
            minuto: 0,
            segundo: 0,
            pasado: false
        });
        this.storage.set('listaDeFechas', this.listaDeFechas);
        this.exitoAlguardar();
    };
    HomePage.prototype.guardar = function (datos_para_guardar) {
        var vm = this;
        var nuevaFecha = new Entrada();
        nuevaFecha.fecha = datos_para_guardar.fecha_string;
        nuevaFecha.titulo = datos_para_guardar.titulo;
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
    HomePage.prototype.mostarDetalle = function (entrada) {
        console.log("");
        console.log(" ----------- mostarDetalle ----------- ");
        console.log(entrada);
        console.log(" ----------- mostarDetalle ----------- ");
        console.log("");
    };
    HomePage = __decorate([
        Component({
            selector: 'app-home',
            templateUrl: 'home.page.html',
            styleUrls: ['home.page.scss'],
        }),
        __metadata("design:paramtypes", [AlertController,
            Storage,
            ContadorService,
            OrderPipe,
            ActionSheetController,
            ModalController,
            IdiomaService])
    ], HomePage);
    return HomePage;
}());
export { HomePage };
//# sourceMappingURL=home.page.js.map