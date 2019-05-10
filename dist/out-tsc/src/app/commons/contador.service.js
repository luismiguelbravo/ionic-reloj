import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
var ContadorService = /** @class */ (function () {
    function ContadorService() {
        this.movientoSource = new Subject();
        this.moviemientoEnd$ = this.movientoSource.asObservable();
        this.moverse = false;
    }
    ContadorService.prototype.ticTac = function () {
        var _this = this;
        var vm = this;
        setTimeout(function () {
            if (vm.moverse === true) {
                _this.ticTac();
            }
        }, 900);
    };
    ContadorService.prototype.iniciarMovimiento = function () {
        var vm = this;
        vm.moverse = true;
        vm.ticTac();
    };
    /*
    esta funcion detiene el movimiento del contador
    */
    ContadorService.prototype.detenerMovimiento = function () {
        var vm = this;
        vm.moverse = false;
    };
    ContadorService = tslib_1.__decorate([
        Injectable({
            providedIn: 'root'
        }),
        tslib_1.__metadata("design:paramtypes", [])
    ], ContadorService);
    return ContadorService;
}());
export { ContadorService };
//# sourceMappingURL=contador.service.js.map