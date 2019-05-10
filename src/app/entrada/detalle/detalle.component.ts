import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import * as moment from 'moment';
import { Entrada } from '../../Entrada';
import { Subscription } from "rxjs";
import { ContadorService } from '../../commons/contador.service'

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.scss'],
})
export class DetalleComponent implements OnInit {

    @Output() movimientoCompletoEventEmitter = new EventEmitter<void>()
    private movientoCompletoSuscripcion: Subscription = null

    fechaDeHoy = moment()
    finalDeLaEspera = null;
    diferencia = null;
    diferenciaString = "";

    diferenciaEnSegundos = null;
    diferenciaEnMinutos = null;
    diferenciaEnHoras = null;
    diferenciaEnDias = null;
    diferenciaEnMeses = null;
    diferenciaEnYears = null;

    @Input() entrada: Entrada;

    constructor(public contadorService: ContadorService) { }

    ngOnInit() {

        this.finalDeLaEspera = moment(
            this.entrada.fecha,
            'YYYY-MM-DD HH:mm'
        );

        this.movientoCompletoSuscripcion = this.contadorService.movimientoObservable.subscribe(()=>{
            this.calcularDiferencias();
        });
    }

    calcularDiferencias(): void {
        this.fechaDeHoy = moment()
        this.diferenciaEnYears = this.finalDeLaEspera.diff(this.fechaDeHoy, 'years')


        this.fechaDeHoy.add(this.diferenciaEnYears, 'years')

        this.diferenciaEnMeses = this.finalDeLaEspera.diff(this.fechaDeHoy, 'months')
        this.fechaDeHoy.add(this.diferenciaEnMeses, 'months')

        this.diferenciaEnDias = this.finalDeLaEspera.diff(this.fechaDeHoy, 'days')
        this.fechaDeHoy.add(this.diferenciaEnDias, 'days')

        this.diferenciaEnHoras = this.finalDeLaEspera.diff(this.fechaDeHoy, 'hours')
        this.fechaDeHoy.add(this.diferenciaEnHoras, 'hours')

        this.diferenciaEnMinutos = this.finalDeLaEspera.diff(this.fechaDeHoy, 'minutes')
        this.fechaDeHoy.add(this.diferenciaEnMinutos, 'minutes')

        this.diferenciaEnSegundos = this.finalDeLaEspera.diff(this.fechaDeHoy, 'seconds')
    }

}
