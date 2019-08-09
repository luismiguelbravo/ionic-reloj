import * as tslib_1 from "tslib";
import { Component, Input, Output, EventEmitter } from '@angular/core';
import * as moment from 'moment';
import { Entrada } from '../../Entrada';
import { ContadorService } from '../../commons/contador.service';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { Clipboard } from '@ionic-native/clipboard/ngx';
import { AlertController } from '@ionic/angular';
var DetalleComponent = /** @class */ (function () {
    function DetalleComponent(contadorService, socialSharing, clipboard, alertController) {
        this.contadorService = contadorService;
        this.socialSharing = socialSharing;
        this.clipboard = clipboard;
        this.alertController = alertController;
        this.movimientoCompletoEventEmitter = new EventEmitter();
        this.movientoCompletoSuscripcion = null;
        this.fechaDeHoy = moment();
        this.finalDeLaEspera = null;
        this.diferencia = null;
        this.diferenciaString = "";
        this.diferenciaEnSegundos = null;
        this.diferenciaEnMinutos = null;
        this.diferenciaEnHoras = null;
        this.diferenciaEnDias = null;
        this.diferenciaEnMeses = null;
        this.diferenciaEnYears = null;
        this.pasado = false;
    }
    DetalleComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.finalDeLaEspera = moment(this.entrada.fecha, 'YYYY-MM-DD HH:mm');
        this.movientoCompletoSuscripcion = this.contadorService.movimientoObservable.subscribe(function () {
            _this.calcularDiferencias();
        });
    };
    DetalleComponent.prototype.nombreDeMes = function (indice) {
        var arregloNombreDeMes = [
            "Enero", "Febrero", "Marzo",
            "Abril", "Mayo", "Junio",
            "Julio", "Agosto", "Septiembre",
            "Octubre", "Noviembre", "Diciembre"
        ];
        return arregloNombreDeMes[indice - 1];
    };
    DetalleComponent.prototype.calcularDiferencias = function () {
        var vm = this;
        if (vm.finalDeLaEspera > vm.fechaDeHoy) {
            vm.pasado = false;
        }
        else {
            vm.pasado = true;
        }
        vm.fechaDeHoy = moment();
        vm.diferenciaEnYears = vm.finalDeLaEspera.diff(vm.fechaDeHoy, 'years');
        vm.fechaDeHoy.add(vm.diferenciaEnYears, 'years');
        vm.diferenciaEnMeses = vm.finalDeLaEspera.diff(vm.fechaDeHoy, 'months');
        vm.fechaDeHoy.add(vm.diferenciaEnMeses, 'months');
        vm.diferenciaEnDias = vm.finalDeLaEspera.diff(vm.fechaDeHoy, 'days');
        vm.fechaDeHoy.add(vm.diferenciaEnDias, 'days');
        vm.diferenciaEnHoras = vm.finalDeLaEspera.diff(vm.fechaDeHoy, 'hours');
        vm.fechaDeHoy.add(vm.diferenciaEnHoras, 'hours');
        vm.diferenciaEnMinutos = vm.finalDeLaEspera.diff(vm.fechaDeHoy, 'minutes');
        vm.fechaDeHoy.add(vm.diferenciaEnMinutos, 'minutes');
        vm.diferenciaEnSegundos = vm.finalDeLaEspera.diff(vm.fechaDeHoy, 'seconds');
    };
    DetalleComponent.prototype.construirMensaje = function () {
        //let mensaje = this.entrada.titulo + ' ' + this.finalDeLaEspera.format("DD/MM/YYYY HH:mm") + '\n';
        var vm = this;
        var mensaje = "Día " + vm.entrada.fecha.substring(8, 10) + " de " + vm.nombreDeMes(vm.entrada.fecha.substring(5, 7)) +
            " del año " + vm.entrada.fecha.substring(0, 4) + '\n' +
            "Hora: " + vm.entrada.fecha.substring(11, vm.entrada.fecha.length) + '\n' + vm.entrada.titulo + '\n';
        var sumarioDeTiempo = "";
        if (this.diferenciaEnYears !== 0) {
            sumarioDeTiempo += '\n' + Math.abs(this.diferenciaEnYears) + ' año';
            if (Math.abs(this.diferenciaEnYears) !== 1) {
                sumarioDeTiempo += 's';
            }
        }
        if (!(this.diferenciaEnYears === 0 && this.diferenciaEnMeses === 0)) {
            sumarioDeTiempo += '\n' + Math.abs(this.diferenciaEnMeses) + ' mes';
            if (Math.abs(this.diferenciaEnMeses) !== 1) {
                sumarioDeTiempo += 'es';
            }
        }
        if (!(this.diferenciaEnYears === 0 &&
            this.diferenciaEnMeses === 0 &&
            this.diferenciaEnDias === 0)) {
            sumarioDeTiempo += '\n' + Math.abs(this.diferenciaEnDias) + ' día';
            if (Math.abs(this.diferenciaEnDias) !== 1) {
                sumarioDeTiempo += 's';
            }
        }
        if (!(this.diferenciaEnYears === 0 &&
            this.diferenciaEnMeses === 0 &&
            this.diferenciaEnDias === 0 &&
            this.diferenciaEnHoras === 0)) {
            sumarioDeTiempo += '\n' + Math.abs(this.diferenciaEnHoras) + ' hora';
            if (Math.abs(this.diferenciaEnHoras) !== 1) {
                sumarioDeTiempo += 's';
            }
        }
        if (!(this.diferenciaEnYears === 0 &&
            this.diferenciaEnMeses === 0 &&
            this.diferenciaEnDias === 0 &&
            this.diferenciaEnHoras === 0 &&
            this.diferenciaEnMinutos === 0)) {
            sumarioDeTiempo += '\n' + Math.abs(this.diferenciaEnMinutos) + ' minuto';
            if (Math.abs(this.diferenciaEnMinutos) !== 1) {
                sumarioDeTiempo += 's';
            }
        }
        if (!(this.diferenciaEnYears === 0 &&
            this.diferenciaEnMeses === 0 &&
            this.diferenciaEnDias === 0 &&
            this.diferenciaEnHoras === 0 &&
            this.diferenciaEnMinutos === 0 &&
            this.diferenciaEnSegundos === 0)) {
            sumarioDeTiempo += '\n' + Math.abs(this.diferenciaEnSegundos) + ' segundo';
            if (this.diferenciaEnSegundos * this.diferenciaEnSegundos !== 1) {
                sumarioDeTiempo += 's';
            }
        }
        if (this.diferenciaEnYears < 0 ||
            this.diferenciaEnMeses < 0 ||
            this.diferenciaEnDias < 0 ||
            this.diferenciaEnHoras < 0 ||
            this.diferenciaEnMinutos < 0 ||
            this.diferenciaEnSegundos < 0) {
            mensaje = mensaje + '\n' + "Ocurrió hace:" + sumarioDeTiempo;
        }
        else {
            mensaje = mensaje + '\n' + "Aún falta " + sumarioDeTiempo;
        }
        return mensaje;
    };
    DetalleComponent.prototype.copyToClipBoard = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var vm, alert;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('copyToClipBoard()');
                        vm = this;
                        vm.clipboard.copy(vm.construirMensaje());
                        return [4 /*yield*/, this.alertController.create({
                                header: 'Éxito',
                                subHeader: '',
                                message: 'Copiado al porta papeles.',
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
    DetalleComponent.prototype.shareWhatsApp = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var vm, mensajeParaEnviar;
            return tslib_1.__generator(this, function (_a) {
                console.log('shareWhatsApp');
                vm = this;
                mensajeParaEnviar = vm.construirMensaje();
                console.log("");
                console.log(" --------- mensajeParaEnviar --------- ");
                console.log(mensajeParaEnviar);
                console.log(" --------- mensajeParaEnviar --------- ");
                console.log("");
                vm.socialSharing.shareViaWhatsApp(mensajeParaEnviar, null, null).then(function () {
                    // Success
                    console.log("exito al compartir por whatsapp");
                }).catch(function (e) {
                    // Error!
                    console.log("error al compartir por whatsapp");
                });
                return [2 /*return*/];
            });
        });
    };
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", Object)
    ], DetalleComponent.prototype, "movimientoCompletoEventEmitter", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Entrada)
    ], DetalleComponent.prototype, "entrada", void 0);
    DetalleComponent = tslib_1.__decorate([
        Component({
            selector: 'app-detalle',
            templateUrl: './detalle.component.html',
            styleUrls: ['./detalle.component.scss'],
        }),
        tslib_1.__metadata("design:paramtypes", [ContadorService,
            SocialSharing,
            Clipboard,
            AlertController])
    ], DetalleComponent);
    return DetalleComponent;
}());
export { DetalleComponent };
//# sourceMappingURL=detalle.component.js.map