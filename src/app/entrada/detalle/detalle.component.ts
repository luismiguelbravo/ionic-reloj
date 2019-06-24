import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import * as moment from 'moment';
import { Entrada } from '../../Entrada';
import { Subscription } from "rxjs";
import { ContadorService } from '../../commons/contador.service'
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { Clipboard } from '@ionic-native/clipboard/ngx';
import { AlertController } from '@ionic/angular';

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
    pasado = false

    @Input() entrada: Entrada;

    constructor(
        public contadorService: ContadorService,
        private socialSharing: SocialSharing,
        private clipboard: Clipboard,
        public alertController: AlertController
    ) { }

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
        let vm = this

        if ( vm.finalDeLaEspera > vm.fechaDeHoy )
        {
            vm.pasado = false
        }
        else
        {
            vm.pasado = true
        }


        vm.fechaDeHoy = moment()
        
        
        vm.diferenciaEnYears = vm.finalDeLaEspera.diff(vm.fechaDeHoy, 'years')


        vm.fechaDeHoy.add(vm.diferenciaEnYears, 'years')

        vm.diferenciaEnMeses = vm.finalDeLaEspera.diff(vm.fechaDeHoy, 'months')
        vm.fechaDeHoy.add(vm.diferenciaEnMeses, 'months')

        vm.diferenciaEnDias = vm.finalDeLaEspera.diff(vm.fechaDeHoy, 'days')
        vm.fechaDeHoy.add(vm.diferenciaEnDias, 'days')

        vm.diferenciaEnHoras = vm.finalDeLaEspera.diff(vm.fechaDeHoy, 'hours')
        vm.fechaDeHoy.add(vm.diferenciaEnHoras, 'hours')

        vm.diferenciaEnMinutos = vm.finalDeLaEspera.diff(vm.fechaDeHoy, 'minutes')
        vm.fechaDeHoy.add(vm.diferenciaEnMinutos, 'minutes')

        vm.diferenciaEnSegundos = vm.finalDeLaEspera.diff(vm.fechaDeHoy, 'seconds')
    }

    construirMensaje(): string{
         let mensaje = this.entrada.titulo + ' ' + this.finalDeLaEspera.format("DD/MM/YYYY HH:mm") + '\n';

        if (this.diferenciaEnYears !== 0) {
            mensaje += '\n' + this.diferenciaEnYears + ' año'
            if (this.diferenciaEnYears * this.diferenciaEnYears !== 1 )
            {
                mensaje += 's'
            }
        }

        if (!(this.diferenciaEnYears === 0 && this.diferenciaEnMeses === 0)) {
            mensaje += '\n' + this.diferenciaEnMeses + ' mese';
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
            mensaje += '\n' + this.diferenciaEnDias + ' dia';
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
            mensaje += '\n' + this.diferenciaEnHoras + ' hora';
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
            mensaje += '\n' + this.diferenciaEnMinutos + ' minuto';
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
            mensaje += '\n' + this.diferenciaEnSegundos + 'segundo';
            if (this.diferenciaEnSegundos * this.diferenciaEnSegundos !== 1 )
            {
                mensaje += 's'
            }

        }
        return mensaje;
    }

    async copyToClipBoard() {

        console.log('copyToClipBoard()')
        let vm = this
        vm.clipboard.copy(vm.construirMensaje());
        const alert = await this.alertController.create({
            header: 'Éxito',
            subHeader: '',
            message: 'Copiado al porta papeles.',
            buttons: ['OK']
        });
        await alert.present()


    }

    async shareWhatsApp() {
        console.log('shareWhatsApp')
        // Text + Image or URL works
        // voy a poner una imagen en mi pagina
        // voy a poner una url que reciva el parametro de la fecha y le muestre el contador
        let vm = this

        vm.socialSharing.shareViaWhatsApp(vm.construirMensaje(), null, null).then(() => {
          // Success
          console.log("exito al compartir por whatsapp")
        }).catch((e) => {
          // Error!
          console.log("error al compartir por whatsapp")
        });
    }

}
