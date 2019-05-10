import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs'

@Injectable({
    providedIn: 'root'
})
export class ContadorService {
    
    private movientoSubject = new Subject<void>()
    public movimientoObservable = this.movientoSubject.asObservable()

    moverse = false

    constructor() { }

    ticTac(): void {
        let vm = this
        setTimeout(() =>
        {
            if (vm.moverse === true){
                this.ticTac()
                this.movientoSubject.next();
            }
        }, 900);
    }

    iniciarMovimiento(): void {
        let vm = this
        vm.moverse = true
        vm.ticTac();
    }

    /*
    esta funcion detiene el movimiento del contador
    */
    detenerMovimiento(): void {
        let vm = this
        vm.moverse = false
    }
}
