import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs'

@Injectable({
    providedIn: 'root'
})
export class ContadorService {
    
    private movientoSubject = new Subject<void>()
    public movimientoObservable = this.movientoSubject.asObservable()

    moverse = false
    id_seleccionado :string

    constructor() { }

    ticTac(): void {
        let vm = this
        setTimeout(() =>
        {
            if (vm.moverse === true){
                this.ticTac()
                this.movientoSubject.next();
            }
        }, 1000);
    }

    iniciarMovimiento(): void {
        let vm = this
        vm.moverse = true
        vm.ticTac();
    }

    getIdSeleccionado(): string{
        return this.id_seleccionado
    }

    setIdSeleccionado(id): string{
        this.id_seleccionado = id
        return this.id_seleccionado
    }

    /*
    esta funcion detiene el movimiento del contador
    */
    detenerMovimiento(): void {
        let vm = this
        vm.moverse = false
    }
}
