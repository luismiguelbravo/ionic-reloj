import { __decorate, __metadata } from "tslib";
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
var ContadorService = /** @class */ (function () {
    function ContadorService() {
        this.movientoSubject = new Subject();
        this.movimientoObservable = this.movientoSubject.asObservable();
        this.moverse = false;
    }
    ContadorService.prototype.ticTac = function () {
        var _this = this;
        var vm = this;
        setTimeout(function () {
            if (vm.moverse === true) {
                _this.ticTac();
                _this.movientoSubject.next();
            }
        }, 1000);
    };
    ContadorService.prototype.iniciarMovimiento = function () {
        var vm = this;
        vm.moverse = true;
        vm.ticTac();
    };
    ContadorService.prototype.getIdSeleccionado = function () {
        return this.id_seleccionado;
    };
    ContadorService.prototype.setIdSeleccionado = function (id) {
        this.id_seleccionado = id;
        return this.id_seleccionado;
    };
    /*
    esta funcion detiene el movimiento del contador
    */
    ContadorService.prototype.detenerMovimiento = function () {
        var vm = this;
        vm.moverse = false;
    };
    ContadorService = __decorate([
        Injectable({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [])
    ], ContadorService);
    return ContadorService;
}());
export { ContadorService };
//# sourceMappingURL=contador.service.js.map