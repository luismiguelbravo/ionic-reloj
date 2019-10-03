import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import * as moment from 'moment';
import { Entrada } from '../../Entrada';
import { Subscription } from "rxjs";
import { ContadorService } from '../../commons/contador.service'
import { ViewChild, ElementRef } from '@angular/core';
import { IdiomaService } from '../../commons/idioma.service'

// plugin para compartir
import { Plugins } from '@capacitor/core';
const { Share } = Plugins;
//     plugin para compartir

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

    porcentaje = 0;
    tiempo_total = 0;
    tiempo_transcurrido = 0;
    fecha_de_creacion = null;

    now = null;
    fechaDate = null;
    moment_from_date = null;

    @ViewChild('myCanvas') myCanvas: ElementRef;
    public ctx: CanvasRenderingContext2D;

    mostrarReloj = false

    @Input() entrada: Entrada;

    constructor(
        public contadorService: ContadorService,
        public idiomaService: IdiomaService
    ) { }

    ngOnInit() {
        let vm = this
        this.ctx = (<HTMLCanvasElement>this.myCanvas.nativeElement).getContext('2d');
        vm.ctx.lineWidth = 30;
        vm.ctx.textAlign = 'center';
        vm.ctx.textBaseline = 'middle';
        vm.ctx.font = '25px Trebuchet MS';
        vm.ctx.fillStyle = 'white';
        this.movientoCompletoSuscripcion = this.contadorService.movimientoObservable.subscribe(()=>{
            this.calcularDiferencias();
        });

        this.fecha_de_creacion = moment({
            years:   vm.entrada.year_de_creacion,
            months:  vm.entrada.mes_de_creacion,
            date:    vm.entrada.dia_de_creacion,
            hours:   vm.entrada.hora_de_creacion,
            minutes: vm.entrada.minuto_de_creacion,
            seconds: vm.entrada.segundo_de_creacion
        })
    }

    draw(r, p, c) {
        let vm = this;
        var start = 1.5 * Math.PI; // Start circle from top
        var end = (2 * Math.PI) / 100; // One percent of circle
        p = p || 100; // When time is '00' we show full circle
        vm.ctx.strokeStyle = c;
        vm.ctx.beginPath();
        vm.ctx.arc(85, 85, r, start, p * end + start, false);
        vm.ctx.stroke();
    }

    clock () {
        let vm = this;
        // requestAnimationFrame(this.clock);
        var date = new Date;
        let s = date.getSeconds();
        // Calculate percentage to be drawn
        var sp = 100 / 60 * s;
        // Ensure double digits
        this.ctx.clearRect(0, 0, 170, 170);
        // this.ctx.fillText(s + "%", 85, 85);
        // this.draw(60, sp, 'steelblue');

        this.ctx.fillText(vm.porcentaje.toFixed(1) + "%", 85, 85);
        this.draw(60, vm.porcentaje, 'steelblue');
    };

    seleccionar_reloj(id) {
        let vm = this;
        vm.contadorService.setIdSeleccionado(id);
        /*
            console.log(`scrolling to ${id}`);
            let el = document.getElementById(id);
            el.scrollIntoView();
        */
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
        return arregloNombreDeMes[indice]
    }

    calcularDiferencias(): void {
        let vm = this

        vm.now = moment().utc()
        vm.fechaDate = new Date()
        vm.moment_from_date = moment(new Date())


        this.finalDeLaEspera = moment({
            years:   vm.entrada.year,
            months:  vm.entrada.mes,
            date:    vm.entrada.dia,
            hours:   vm.entrada.hora,
            minutes: vm.entrada.minuto,
            seconds: vm.entrada.segundo
        })

        vm.fechaDeHoy = moment()

        if ( vm.finalDeLaEspera > vm.fechaDeHoy )
        {
            vm.pasado = false
            vm.tiempo_total = vm.finalDeLaEspera.diff(vm.fecha_de_creacion, 'seconds')
            vm.tiempo_transcurrido = vm.fechaDeHoy.diff(vm.fecha_de_creacion, 'seconds')
            vm.porcentaje = vm.tiempo_transcurrido * 100 / vm.tiempo_total;
        }
        else
        {
            vm.pasado = true
            vm.porcentaje = 100;
        }
       
        
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

        this.clock();
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

        mensaje = mensaje + '\n'
        mensaje = mensaje + '\n'

        return mensaje;
    }

    async compartirConCapacitor() {
        let vm = this

        let urlParaCompartir =  "https://mimuqui.com/onlineTimer"
            + "?year=" + vm.entrada.year
            + "?mes=" + vm.entrada.mes
            + "?dia=" + vm.entrada.dia
            + "?hora=" +  vm.entrada.hora
            + "?minuto=" + vm.entrada.minuto
            + "?segundo=" + vm.entrada.segundo

        console.log("")
        console.log(" ----------- urlParaCompartir ----------- ")
        console.log(urlParaCompartir);
        console.log(" ----------- urlParaCompartir ----------- ")
        console.log("")

        let shareRet = await Share.share({
          title: vm.entrada.titulo,
          text: vm.construirMensaje(),
          url: urlParaCompartir,
          dialogTitle: 'Share with buddies'
        });
    }

}
