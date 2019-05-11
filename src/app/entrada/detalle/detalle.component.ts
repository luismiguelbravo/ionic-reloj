import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import * as moment from 'moment';
import { Entrada } from '../../Entrada';
import { Subscription } from "rxjs";
import { ContadorService } from '../../commons/contador.service'
import { SocialSharing } from '@ionic-native/social-sharing/ngx';


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
    fechaEsperadaDate = null;
    diferencia = null;
    diferenciaString = "";

    diferenciaEnSegundos = null;
    diferenciaEnMinutos = null;
    diferenciaEnHoras = null;
    diferenciaEnDias = null;
    diferenciaEnMeses = null;
    diferenciaEnYears = null;

    @Input() entrada: Entrada;

    constructor(public contadorService: ContadorService, private socialSharing: SocialSharing) { }

    ngOnInit() {

        this.finalDeLaEspera = moment(
            this.entrada.fecha,
            'YYYY-MM-DD HH:mm'
        );

        this.fechaEsperadaDate = this.finalDeLaEspera.toDate()

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

    async shareWhatsApp() {
        // Text + Image or URL works
        // voy a poner una imagen en mi pagina
        // voy a poner una url que reciva el parametro de la fecha y le muestre el contador
        let mensaje = this.entrada.titulo + ' ' + this.finalDeLaEspera.format("DD/MM/YYYY HH:mm") + ' \n\r \n\r' + 
            'Tiempo de diferencia:';

        if (this.diferenciaEnYears !== 0) {
            mensaje += '\n\r' + this.diferenciaEnYears + ' año'
            if (this.diferenciaEnYears * this.diferenciaEnYears !== 1 )
            {
                mensaje += 's'
            }
        }

        if (!(this.diferenciaEnYears === 0 && this.diferenciaEnMeses === 0)) {
            mensaje += '\n\r' + this.diferenciaEnMeses + ' mese';
            if (this.diferenciaEnMeses * this.diferenciaEnMeses !== 1 )
            {
                mensaje += 's'
            }
        }

        if (!(
                this.diferenciaEnYears === 0 &&
                this.diferenciaEnMeses === 0 &&
                this.diferenciaEnDias === 0
            ))
        {
            mensaje += '\n\r' + this.diferenciaEnDias + ' dia';
            if (this.diferenciaEnDias * this.diferenciaEnDias !== 1 )
            {
                mensaje += 's'
            }
        }

        if (!(
                this.diferenciaEnYears === 0 &&
                this.diferenciaEnMeses === 0 &&
                this.diferenciaEnDias === 0 &&
                this.diferenciaEnHoras === 0
            ))
        {
            mensaje += '\n\r' + this.diferenciaEnHoras + ' hora';
            if (this.diferenciaEnHoras * this.diferenciaEnHoras !== 1 )
            {
                mensaje += 's'
            }
        }

        if (!(
                this.diferenciaEnYears === 0 && 
                this.diferenciaEnMeses === 0 && 
                this.diferenciaEnDias === 0 && 
                this.diferenciaEnHoras === 0 &&
                this.diferenciaEnMinutos === 0
            )

            ) {
            mensaje += '\n\r' + this.diferenciaEnMinutos + ' minuto';
            if (this.diferenciaEnMinutos * this.diferenciaEnMinutos !== 1 )
            {
                mensaje += 's'
            }
        }

        if (!(
                this.diferenciaEnYears === 0 && 
                this.diferenciaEnMeses === 0 && 
                this.diferenciaEnDias === 0 && 
                this.diferenciaEnHoras === 0 &&
                this.diferenciaEnMinutos === 0 &&
                this.diferenciaEnSegundos === 0                    
            ))
        {
            mensaje += '\n\r' + this.diferenciaEnSegundos + 'segundo';
            if (this.diferenciaEnSegundos * this.diferenciaEnSegundos !== 1 )
            {
                mensaje += 's'
            }

        }

        this.socialSharing.shareViaWhatsApp(mensaje, null, null).then(() => {
          // Success
        }).catch((e) => {
          // Error!
        });
    }

}
