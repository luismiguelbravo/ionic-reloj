import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import * as moment from 'moment';
import { Entrada } from '../../Entrada';
import { Subscription } from "rxjs";
import { ContadorService } from '../../commons/contador.service'
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { Clipboard } from '@ionic-native/clipboard/ngx';
import { AlertController } from '@ionic/angular';
import { ViewChild, ElementRef } from '@angular/core';

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
    pasado = false

    @ViewChild('myCanvas') myCanvas: ElementRef;
    public ctx: CanvasRenderingContext2D;

    mostrarReloj = false

    @Input() entrada: Entrada;

    constructor(
        public contadorService: ContadorService,
        private socialSharing: SocialSharing,
        private clipboard: Clipboard,
        public alertController: AlertController
    ) { }

    draw(r, p, c) {
        let vm = this;
        var start = 1.5 * Math.PI; // Start circle from top
        var end = (2 * Math.PI) / 100; // One percent of circle
        p = p || 100; // When time is '00' we show full circle
        vm.ctx.strokeStyle = c;
        vm.ctx.beginPath();
        vm.ctx.arc(130, 130, r, start, p * end + start, false);
        vm.ctx.stroke();
    }

    clock () {
        let vm = this;
        // requestAnimationFrame(this.clock);

        var date = new Date;
        let h = date.getHours();
        let m = date.getMinutes();
        let s = date.getSeconds();
        // Calculate percentage to be drawn
        var hp = 100 / 12 * (h % 12);
        var mp = 100 / 60 * m;
        var sp = 100 / 60 * s;
        // Ensure double digits
        
        /*
        h = h < 10 ? '0' + h : h;
        m = m < 10 ? '0' + m : m;
        s = s < 10 ? '0' + s : s;
        */
        this.ctx.clearRect(0, 0, 260, 260);
        this.ctx.fillText(h + ':' + m + ':' + s, 175, 175);
        this.draw(25, hp, 'palevioletred');
        this.draw(50, mp, 'limegreen');
        this.draw(75, sp, 'steelblue');
    };


    ngAfterViewInit(){
        let vm = this;
    }

    ngOnInit() {

        this.finalDeLaEspera = moment(
            this.entrada.fecha,
            'YYYY-MM-DD HH:mm'
        );

        this.movientoCompletoSuscripcion = this.contadorService.movimientoObservable.subscribe(()=>{
            this.calcularDiferencias();
        });

    }

    seleccionar_reloj(id) {
      let vm = this;
      vm.contadorService.setIdSeleccionado(id);
      // console.log(`scrolling to ${id}`);
      // let el = document.getElementById(id);
      // el.scrollIntoView();

        console.log("");
        console.log(" -------------- seleccionar_reloj -------------- ");
        console.log("");

        this.ctx = (<HTMLCanvasElement>this.myCanvas.nativeElement).getContext('2d');

        console.log("");
        console.log(" -------------- this.ctx -------------- ");
        console.log(this.ctx)
        console.log(" -------------- this.ctx -------------- ");
        console.log("");

        //if (vm.cvs !== null ){
            vm.ctx.lineWidth = 23;
            vm.ctx.textAlign = 'center';
            vm.ctx.textBaseline = 'middle';
            vm.ctx.font = '25px Trebuchet MS';
            vm.ctx.fillStyle = 'white';
            console.log("Iniciando el reloj");

            console.log("");
            console.log(" -------------- vm -------------- ");
            console.log(vm);
            console.log(" -------------- vm -------------- ");
            console.log("");

            
        // }


    }

    get_id_Seleccionado()
    {
        return this.contadorService.getIdSeleccionado()
    }

    nombreDeMes(indice)
    {
        let arregloNombreDeMes = [
            "Enero", "Febrero", "Marzo",
            "Abril", "Mayo", "Junio",
            "Julio", "Agosto", "Septiembre",
            "Octubre", "Noviembre", "Diciembre"
        ]
        return arregloNombreDeMes[indice-1]
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

        if(this.entrada.id === this.get_id_Seleccionado())
        {
            this.clock();
        }

    }

    construirMensaje(): string{
        //let mensaje = this.entrada.titulo + ' ' + this.finalDeLaEspera.format("DD/MM/YYYY HH:mm") + '\n';
        let vm = this
        let mensaje ="Día " + vm.entrada.fecha.substring(8,10) + " de " +  vm.nombreDeMes(vm.entrada.fecha.substring(5,7)) +
        " del año " + vm.entrada.fecha.substring(0,4) + '\n' +
        "Hora: " + vm.entrada.fecha.substring(11, vm.entrada.fecha.length)  + '\n' + vm.entrada.titulo + '\n'

        let sumarioDeTiempo = "";


        if (this.diferenciaEnYears !== 0) {
            sumarioDeTiempo += '\n' + Math.abs(this.diferenciaEnYears) + ' año'
            if (Math.abs(this.diferenciaEnYears) !== 1 )
            {
                sumarioDeTiempo += 's'
            }
        }

        if (!(this.diferenciaEnYears === 0 && this.diferenciaEnMeses === 0)) {
            sumarioDeTiempo += '\n' + Math.abs(this.diferenciaEnMeses) + ' mes';
            if (Math.abs(this.diferenciaEnMeses) !== 1 )
            {
                sumarioDeTiempo += 'es'
            }
        }

        if (!(
                this.diferenciaEnYears === 0 &&
                this.diferenciaEnMeses === 0 &&
                this.diferenciaEnDias === 0
            ))
        {
            sumarioDeTiempo += '\n' + Math.abs(this.diferenciaEnDias) + ' día';
            if (Math.abs(this.diferenciaEnDias) !== 1 )
            {
                sumarioDeTiempo += 's'
            }
        }

        if (!(
                this.diferenciaEnYears === 0 &&
                this.diferenciaEnMeses === 0 &&
                this.diferenciaEnDias === 0 &&
                this.diferenciaEnHoras === 0
            ))
        {
            sumarioDeTiempo += '\n' + Math.abs(this.diferenciaEnHoras) + ' hora';
            if (Math.abs(this.diferenciaEnHoras) !== 1 )
            {
                sumarioDeTiempo += 's'
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
            sumarioDeTiempo += '\n' + Math.abs(this.diferenciaEnMinutos) + ' minuto';
            if (Math.abs(this.diferenciaEnMinutos) !== 1 )
            {
                sumarioDeTiempo += 's'
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
            sumarioDeTiempo += '\n' + Math.abs(this.diferenciaEnSegundos) + ' segundo';
            if (this.diferenciaEnSegundos * this.diferenciaEnSegundos !== 1 )
            {
                sumarioDeTiempo += 's'
            }

        }

        if (    this.diferenciaEnYears < 0 || 
                this.diferenciaEnMeses < 0 || 
                this.diferenciaEnDias < 0 ||
                this.diferenciaEnHoras < 0 ||
                this.diferenciaEnMinutos < 0 ||
                this.diferenciaEnSegundos < 0   
            )
        {
            mensaje = mensaje + '\n' + "Ocurrió hace:" + sumarioDeTiempo
        }
        else
        {
            mensaje = mensaje + '\n' + "Aún falta " + sumarioDeTiempo
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
        let mensajeParaEnviar = vm.construirMensaje();

        console.log("")
        console.log(" --------- mensajeParaEnviar --------- ")
        console.log(mensajeParaEnviar)
        console.log(" --------- mensajeParaEnviar --------- ")
        console.log("")

        vm.socialSharing.shareViaWhatsApp(mensajeParaEnviar, null, null).then(() => {
          // Success
          console.log("exito al compartir por whatsapp")
        }).catch((e) => {
          // Error!
          console.log("error al compartir por whatsapp")
        });
    }

}
