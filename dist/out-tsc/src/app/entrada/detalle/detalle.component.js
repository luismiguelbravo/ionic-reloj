import * as tslib_1 from "tslib";
import { Component, Input, Output, EventEmitter } from '@angular/core';
import * as moment from 'moment';
import { Entrada } from '../../Entrada';
var DetalleComponent = /** @class */ (function () {
    function DetalleComponent() {
        this.movimientoCompletoEventEmitter = new EventEmitter();
        this.movientoCompletoSuscripcion = null;
        this.fechaDeHoy = moment(); //.format('YYYY-MM-DD HH:mm:ss');
        // finalDeLaEspera = moment("2021-01-01")
        this.finalDeLaEspera = null;
        this.diferencia = null;
        this.diferenciaString = "";
        this.diferenciaEnSegundos = null;
        this.diferenciaEnMinutos = null;
        this.diferenciaEnHoras = null;
        this.diferenciaEnDias = null;
        this.diferenciaEnMeses = null;
        this.diferenciaEnYears = null;
    }
    DetalleComponent.prototype.ngOnInit = function () {
        this.ticTac();
        // this.finalDeLaEspera = moment(this.entrada.fecha);
        this.finalDeLaEspera = moment(this.entrada.fecha, 'YYYY-MM-DD HH:mm');
    };
    DetalleComponent.prototype.ticTac = function () {
        var _this = this;
        setTimeout(function () {
            _this.calcularDiferencias();
            _this.ticTac();
        }, 900);
    };
    DetalleComponent.prototype.calcularDiferencias = function () {
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
        tslib_1.__metadata("design:paramtypes", [])
    ], DetalleComponent);
    return DetalleComponent;
}());
export { DetalleComponent };
//# sourceMappingURL=detalle.component.js.map