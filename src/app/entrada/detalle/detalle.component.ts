import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import * as moment from 'moment';
import { Entrada } from '../../Entrada';
import { Subscription } from "rxjs";
import { ContadorService } from '../../commons/contador.service'
import { ViewChild, ElementRef } from '@angular/core';
import { IdiomaService } from '../../commons/idioma.service'
import { Platform } from '@ionic/angular';
import {HttpParams} from  "@angular/common/http";

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

    mostrar_boton_compartir = true;

    @ViewChild('myCanvas') myCanvas: ElementRef;
    public ctx: CanvasRenderingContext2D;

    mostrarReloj = false

    @Input() entrada: Entrada;

    constructor(
        public contadorService: ContadorService,
        public idiomaService: IdiomaService,
        private platform: Platform,
    ) { 
        
        this.platform.ready().then(() => {
            if ( this.platform.is("desktop")){
                this.mostrar_boton_compartir = false;
            }
        });
    }

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
        let color_de_relleno = 'steelblue';
        if (vm.pasado ) {
            color_de_relleno = "#4682b4b0"
        }
        this.ctx.clearRect(0, 0, 170, 170);
        this.ctx.fillText(vm.porcentaje.toFixed(1) + "%", 85, 85);
        this.draw(60, vm.porcentaje, color_de_relleno);
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
        return this.idiomaService.idioma_seleccionado.Months[indice].name;
    }

    calcularDiferencias(): void {
        let vm = this

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

        vm.diferenciaEnSegundos  = Math.abs(vm.diferenciaEnSegundos)
        vm.diferenciaEnMinutos = Math.abs(vm.diferenciaEnMinutos)
        vm.diferenciaEnHoras = Math.abs(vm.diferenciaEnHoras)
        vm.diferenciaEnDias = Math.abs(vm.diferenciaEnDias)
        vm.diferenciaEnMeses = Math.abs(vm.diferenciaEnMeses)
        vm.diferenciaEnYears = Math.abs(vm.diferenciaEnYears)

        this.clock();
    }

    construirMensaje(): string{
        //let mensaje = this.entrada.titulo + ' ' + this.finalDeLaEspera.format("DD/MM/YYYY HH:mm") + '\n';
        let mensaje = this.entrada.titulo + '\n\n';

        if (
                this.diferenciaEnYears < 0 ||
                this.diferenciaEnMeses < 0 ||
                this.diferenciaEnDias < 0 ||
                this.diferenciaEnHoras < 0 ||
                this.diferenciaEnMinutos < 0 ||
                this.diferenciaEnSegundos < 0
            )
        {
            mensaje += "::::::::: " + this.idiomaService.idioma_seleccionado.Past + " :::::::::\n"
        }
        else
        {
            mensaje += "::::::::: " + this.idiomaService.idioma_seleccionado.Future + " :::::::::\n"
        }

        if (this.diferenciaEnYears !== 0) {
            mensaje += this.idiomaService.idioma_seleccionado.Year + " " + Math.abs(this.diferenciaEnYears) + '\n'
        }

        if (!(this.diferenciaEnYears === 0 && this.diferenciaEnMeses === 0)) {
            mensaje += this.idiomaService.idioma_seleccionado.Month + " " +  Math.abs(this.diferenciaEnMeses) + '\n'
        }

        if (!(
            this.diferenciaEnYears === 0 &&
            this.diferenciaEnMeses === 0 &&
            this.diferenciaEnDias === 0
        ))
        {
            mensaje += this.idiomaService.idioma_seleccionado.Day + " " + Math.abs(this.diferenciaEnDias) + '\n'
        }
        if (!(
                this.diferenciaEnYears === 0 &&
                this.diferenciaEnMeses === 0 &&
                this.diferenciaEnDias === 0 &&
                this.diferenciaEnHoras === 0
            ))
        {
            mensaje += this.idiomaService.idioma_seleccionado.Hour + " " + Math.abs(this.diferenciaEnHoras) + '\n'
        }
        if (!(
                this.diferenciaEnYears === 0 && 
                this.diferenciaEnMeses === 0 && 
                this.diferenciaEnDias === 0 && 
                this.diferenciaEnHoras === 0 &&
                this.diferenciaEnMinutos === 0
            )
        )
        {
            mensaje += this.idiomaService.idioma_seleccionado.Minute + " " + Math.abs(this.diferenciaEnMinutos) + '\n'
        }
        mensaje += this.idiomaService.idioma_seleccionado.Second + " " + Math.abs(this.diferenciaEnSegundos) + '\n\n'
        return mensaje;
    }

    async compartirConCapacitor() {
        let params = new HttpParams();
        params = params.set('titulo',  this.entrada.titulo)
        params = params.set('fecha',  this.entrada.fecha)
        params = params.set('year',  this.entrada.year + '')
        params = params.set('mes',  this.entrada.mes + '')
        params = params.set('dia',  this.entrada.dia + '')
        params = params.set('hora',  this.entrada.hora + '')
        params = params.set('minuto',  this.entrada.minuto + '')
        params = params.set('segundo',  this.entrada.segundo + '')
        params = params.set('pasado',  this.entrada.pasado + '')
        params = params.set('year_de_creacion',  this.entrada.year_de_creacion + '')
        params = params.set('mes_de_creacion',  this.entrada.mes_de_creacion + '')
        params = params.set('dia_de_creacion',  this.entrada.dia_de_creacion + '')
        params = params.set('hora_de_creacion',  this.entrada.hora_de_creacion + '')
        params = params.set('minuto_de_creacion',  this.entrada.minuto_de_creacion + '')
        params = params.set('segundo_de_creacion',  this.entrada.segundo_de_creacion + '')
        params = params.set('idioma',  this.idiomaService.idioma_seleccionado.indice + '')

        let urlParaCompartir = 'https://mimuqui.com/home?' + params.toString()

        console.log("")
        console.log(" ============ urlParaCompartir ============ ");
        console.log(urlParaCompartir);
        console.log(" ============ urlParaCompartir ============ ");
        console.log("")

        let shareRet = await Share.share({
          title: this.entrada.titulo,
          text: this.construirMensaje(),
          url: urlParaCompartir,
          dialogTitle: 'Share with buddies'
        });
    }

}
