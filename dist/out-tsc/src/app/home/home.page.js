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
import { Platform } from '@ionic/angular';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { Router, ActivatedRoute } from '@angular/router';
var HomePage = /** @class */ (function () {
    function HomePage(alertController, storage, contadorService, orderPipe, actionSheetController, modalController, idiomaService, platform, localNotifications, router, activatedRoute) {
        var _this = this;
        this.alertController = alertController;
        this.storage = storage;
        this.contadorService = contadorService;
        this.orderPipe = orderPipe;
        this.actionSheetController = actionSheetController;
        this.modalController = modalController;
        this.idiomaService = idiomaService;
        this.platform = platform;
        this.localNotifications = localNotifications;
        this.router = router;
        this.activatedRoute = activatedRoute;
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
        this.listaDeFechas = [];
        this.fechaDeEntrada = '';
        this.horaDeEntrada = '';
        this.tituloDeEntrada = '';
        this.listaFiltrada = null;
        this.palabraDeBusqueda = "";
        this.mostrarFormulario = false;
        this.miIdioma = null;
        this.notificacionClickeada = null;
        this.plataforma_desktop = null;
        activatedRoute.queryParams.subscribe(function (val) {
            console.log("");
            console.log(" ==== val ==== ");
            console.log(val);
            console.log(" ==== val ==== ");
            console.log("");
            console.log("");
            console.log(">>----> typeof val.titulo === 'undefined' <----<< ");
            console.log(typeof val.titulo === 'undefined');
            console.log(">>----> typeof val.titulo === 'undefined' <----<< ");
            console.log("");
            if (typeof val.titulo === "undefined") {
                // preguntar por el idioma seleccionado
                _this.storage.get('miIdioma').then(function (miIdioma) {
                    if (miIdioma === null) {
                        // establezco por defecto el idioma ingles
                        _this.miIdioma = _this.idiomaService.get_idioma_por_defecto();
                        _this.idiomaService.seleccionar_idioma(_this.miIdioma);
                        _this.seleccionarIdioma();
                    }
                    else {
                        _this.idiomaService.seleccionar_idioma(miIdioma);
                        _this.miIdioma = miIdioma;
                    }
                });
            }
            else {
                // seleccionar el idioma por defecto
                _this.miIdioma = _this.idiomaService.get_idioma_by_indice(Number(val.idioma));
                console.log("");
                console.log(">>----> this.miIdioma <----<< ");
                console.log(_this.miIdioma);
                console.log(">>----> this.miIdioma <----<< ");
                console.log("");
                _this.storage.set('miIdioma', _this.miIdioma);
                _this.idiomaService.seleccionar_idioma(_this.miIdioma);
                // crear una entrada
                // higlight hasta la entrada que tal
            }
        });
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
                        if (typeof data !== 'undefined') {
                            if (data.guardar) {
                                vm.guardar(data);
                            }
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    /*
        mostrar el modal,
        pasarle como parametro la vaina que estoy editando
    */
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
                                vm.listaDeFechas[index].titulo = data.titulo;
                                vm.listaDeFechas[index].fecha = data.fecha_string;
                                vm.listaDeFechas[index].year = data.year;
                                vm.listaDeFechas[index].mes = data.mes;
                                vm.listaDeFechas[index].dia = data.dia;
                                vm.listaDeFechas[index].hora = data.hora;
                                vm.listaDeFechas[index].minuto = data.minuto;
                                vm.listaDeFechas[index].segundo = data.segundo;
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
                                // **** actualizar notificacion
                                console.log("");
                                console.log(" ============ editando la notificacion ============ ");
                                console.log("");
                                this.editarNotificacion(vm.listaDeFechas[index]);
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
                                header: vm.miIdioma.Success,
                                subHeader: '',
                                message: vm.miIdioma.Event_saved_successfully,
                                buttons: [vm.miIdioma.Accept]
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
                                message: vm.miIdioma['This action cannot be reversed'],
                                buttons: [
                                    {
                                        text: vm.miIdioma['Cancel'],
                                        role: 'cancel',
                                        cssClass: 'secondary',
                                        handler: function (blah) {
                                            // console.log('Confirm Cancel: blah');
                                        }
                                    }, {
                                        text: vm.miIdioma['Delete'],
                                        handler: function () {
                                            // console.log('Confirm Okay');
                                            for (var i = 0; i < _this.listaDeFechas.length; i++) {
                                                if (_this.listaDeFechas[i].id === id) {
                                                    var right_now = moment();
                                                    var fecha_auxiliar = moment({
                                                        years: _this.listaDeFechas[i].year,
                                                        months: _this.listaDeFechas[i].mes,
                                                        days: _this.listaDeFechas[i].dia,
                                                        hours: _this.listaDeFechas[i].hora,
                                                        minutes: _this.listaDeFechas[i].minuto,
                                                        seconds: _this.listaDeFechas[i].segundo
                                                    });
                                                    if (right_now < fecha_auxiliar) {
                                                        console.log("");
                                                        console.log(" ============ eliminando la notificacion ============ ");
                                                        console.log("");
                                                        _this.eliminarNotificacion(id);
                                                    }
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
    /*
        el croll ha resultado ser muy inconveniente,
        lo dejo comentado para no repetirlo */
    HomePage.prototype.bajalo_para_aca = function (id) {
        var vm = this;
        vm.contadorService.setIdSeleccionado(id);
        var elemento = document.getElementById(id);
        elemento.style.border = "4px solid white";
        elemento.scrollIntoView();
        setTimeout(function () {
            elemento.style.border = "none";
        }, 2000);
    };
    HomePage.prototype.seleccionar_reloj = function (id) {
        var vm = this;
        vm.contadorService.setIdSeleccionado(id);
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
            // Hacer el scroll es muy inconveniente
            // se deja comentado para evitar repetir
            vm.bajalo_para_aca('55')
        }, 1000);*/
        vm.storage.get('listaDeFechas').then(function (val) {
            vm.listaDeFechas = val;
            if (val === null) {
                vm.listaDeFechas = [];
                // vm.usarSemilla()
            }
            // console.log(this.listaDeFechas)
            vm.listaDeFechas = _this.listaDeFechas.sort(function (a, b) {
                var fechaA = new Date(a.fecha);
                var fechaB = new Date(b.fecha);
                return fechaB.getTime() - fechaA.getTime();
            });
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
                // recorrer toda esta vaina para ver que esta en el pasado
                // verifico el caso de que exista alguna fecha que esta en el paso y la marco
                if (right_now > fecha_auxiliar && entrada.pasado === false) {
                    entrada.pasado = true;
                    alguna_modificacion = true;
                }
            });
            if (alguna_modificacion) {
                _this.storage.set('listaDeFechas', _this.listaDeFechas);
            }
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
            if (miIdioma === null) {
                // establezco por defecto el idioma ingles
                vm.miIdioma = vm.idiomaService.get_idioma_por_defecto();
                vm.idiomaService.seleccionar_idioma(vm.miIdioma);
                vm.seleccionarIdioma();
            }
            else {
                vm.idiomaService.seleccionar_idioma(miIdioma);
                vm.miIdioma = miIdioma;
            }
        });
        this.notificacionClickeada = 'ngOnInit()';
        // me suscribo al evento click en la notificacion
        this.localNotifications.on('click').subscribe(function (res) {
            _this.notificacionClickeada = res.data.id;
            _this.bajalo_para_aca(res.data.id);
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
        var vm = this;
        var ahora = moment();
        // console.log("usarSemilla");
        this.listaDeFechas.push({
            fecha: "2020-10-19 00:00:00", titulo: "Cumpleaño 2020", id: 1,
            year: 2020,
            mes: 9,
            dia: 19,
            hora: 0,
            minuto: 0,
            segundo: 0,
            pasado: false,
            year_de_creacion: ahora.year(),
            mes_de_creacion: ahora.month(),
            dia_de_creacion: ahora.date(),
            hora_de_creacion: ahora.hour(),
            minuto_de_creacion: ahora.minute(),
            segundo_de_creacion: ahora.second()
        });
        this.listaDeFechas.push({
            fecha: "2020-10-01 00:00:00", titulo: "Regreso de Camila Daniela Garcia Valle a Chile", id: 2,
            year: 2020,
            mes: 9,
            dia: 1,
            hora: 0,
            minuto: 0,
            segundo: 0,
            pasado: false,
            year_de_creacion: 2018,
            mes_de_creacion: 11,
            dia_de_creacion: 27,
            hora_de_creacion: 20,
            minuto_de_creacion: 0,
            segundo_de_creacion: 0
        });
        this.listaDeFechas.push({
            fecha: "2019-10-19 00:00:00", titulo: "Cumpleaño 2019", id: 3,
            year: 2019,
            mes: 9,
            dia: 19,
            hora: 0,
            minuto: 0,
            segundo: 0,
            pasado: false,
            year_de_creacion: 2018,
            mes_de_creacion: 9,
            dia_de_creacion: 19,
            hora_de_creacion: 0,
            minuto_de_creacion: 0,
            segundo_de_creacion: 0
        });
        this.listaDeFechas.push({ fecha: "2019-05-27 09:00:00", titulo: "Empleo en 3it", id: 4,
            year: 2019,
            mes: 4,
            dia: 27,
            hora: 9,
            minuto: 0,
            segundo: 0,
            pasado: false,
            year_de_creacion: ahora.year(),
            mes_de_creacion: ahora.month(),
            dia_de_creacion: ahora.date(),
            hora_de_creacion: ahora.hour(),
            minuto_de_creacion: ahora.minute(),
            segundo_de_creacion: ahora.second()
        });
        this.listaDeFechas.push({ fecha: "2016-10-19 00:00:00", titulo: "Llegada a Chile", id: 5,
            year: 2016,
            mes: 9,
            dia: 19,
            hora: 0,
            minuto: 0,
            segundo: 0,
            pasado: false,
            year_de_creacion: ahora.year(),
            mes_de_creacion: ahora.month(),
            dia_de_creacion: ahora.date(),
            hora_de_creacion: ahora.hour(),
            minuto_de_creacion: ahora.minute(),
            segundo_de_creacion: ahora.second()
        });
        this.listaDeFechas.push({ fecha: "2019-09-12 22:30:00", titulo: "Deje de fumar y beber", id: 6,
            year: 2019,
            mes: 8,
            dia: 12,
            hora: 20,
            minuto: 0,
            segundo: 0,
            pasado: false,
            year_de_creacion: ahora.year(),
            mes_de_creacion: ahora.month(),
            dia_de_creacion: ahora.date(),
            hora_de_creacion: ahora.hour(),
            minuto_de_creacion: ahora.minute(),
            segundo_de_creacion: ahora.second()
        });
        this.storage.set('listaDeFechas', this.listaDeFechas);
        this.exitoAlguardar();
    };
    HomePage.prototype.guardar = function (datos_para_guardar) {
        var vm = this;
        var ahora = moment();
        var nuevaFecha = new Entrada();
        nuevaFecha.fecha = datos_para_guardar.fecha_string;
        nuevaFecha.titulo = datos_para_guardar.titulo;
        nuevaFecha.year = datos_para_guardar.year;
        nuevaFecha.mes = datos_para_guardar.mes;
        nuevaFecha.dia = datos_para_guardar.dia;
        nuevaFecha.hora = datos_para_guardar.hora;
        nuevaFecha.minuto = datos_para_guardar.minuto;
        nuevaFecha.segundo = datos_para_guardar.segundo;
        nuevaFecha.year_de_creacion = ahora.year();
        nuevaFecha.mes_de_creacion = ahora.month();
        nuevaFecha.dia_de_creacion = ahora.date();
        nuevaFecha.hora_de_creacion = ahora.hour();
        nuevaFecha.minuto_de_creacion = ahora.minute();
        nuevaFecha.segundo_de_creacion = ahora.second();
        nuevaFecha.id = Math.round(Math.random() * 10000000000000000);
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
        // **** crear notificacion
        console.log("");
        console.log(" ============ crear la notificacion ============ ");
        console.log("");
        this.crearNotificacion(nuevaFecha);
        vm.exitoAlguardar();
    };
    HomePage.prototype.buscar = function () {
        var vm = this;
        if (vm.palabraDeBusqueda === "usar semilla lmb") {
            vm.usarSemilla();
            vm.palabraDeBusqueda = "";
        }
        vm.listaFiltrada = vm.listaDeFechas.filter(function (element) {
            return element.titulo.toLowerCase().includes(vm.palabraDeBusqueda.toLowerCase()) || element.fecha.includes(vm.palabraDeBusqueda);
        });
    };
    HomePage.prototype.crearNotificacion = function (entrada) {
        var fecha_de_notificacion = moment({
            years: entrada.year,
            months: entrada.mes,
            date: entrada.dia,
            hours: entrada.hora,
            minutes: entrada.minuto,
            seconds: entrada.segundo
        });
        this.localNotifications.schedule({
            id: entrada.id,
            title: entrada.titulo,
            text: '',
            data: { id: entrada.id },
            trigger: { at: fecha_de_notificacion.toDate() }
        });
    };
    HomePage.prototype.editarNotificacion = function (entrada) {
        // eliminar notificacion anterior
        // this.eliminarNotificacion(entrada.id)
        // crear notificacion nueva
        this.crearNotificacion(entrada);
    };
    HomePage.prototype.eliminarNotificacion = function (id) {
        // como no puedo eliminar, voy a enviar la notificacion al pasado, asi no sonara
        this.localNotifications.schedule({
            id: id,
            title: '',
            text: '',
            trigger: { at: this.fechaDeHoy.toDate() }
        });
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
            IdiomaService,
            Platform,
            LocalNotifications,
            Router,
            ActivatedRoute])
    ], HomePage);
    return HomePage;
}());
export { HomePage };
//# sourceMappingURL=home.page.js.map