import { Component, OnInit, Input } from '@angular/core';
import { ModalController} from '@ionic/angular';
import { NavController, NavParams } from '@ionic/angular';
import { Entrada } from '../../Entrada';
import { IdiomaService } from '../../commons/idioma.service';
import { DIAS } from '../../commons/constantes/dias'
import { HORAS } from '../../commons/constantes/horas'
import { CINCUENTA_Y_NUEVE } from '../../commons/constantes/cincuenta_y_nueve'
import * as moment from 'moment';



@Component({
  selector: 'app-agregar',
  templateUrl: './agregar.page.html',
  styleUrls: ['./agregar.page.scss'],
})
export class AgregarPage implements OnInit {

    horaDeEntrada = '';
    fechaDeEntrada = ''; 
    titulo_de_entrada = "";
    year_de_entrada:number 
    mes_de_la_entrada:number
    dia_de_la_entrada:number
    hora_de_la_entrada:number
    minuto_de_la_entrada:number
    segundo_de_la_entrada:number
    intento_guardar = false;


    lista_de_dias = DIAS;
    lista_de_horas = HORAS;
    lista_CINCUENTA_Y_NUEVE = CINCUENTA_Y_NUEVE;
    fecha_invalida = false

    datosParaGuardar = new Entrada();

    pageTitle = "Agregar"

    entradaDeEdicion : any;

    constructor(
        public modalController: ModalController,
        public navParams: NavParams,
        public idiomaService: IdiomaService
    ) {
        let vm = this
        vm.entradaDeEdicion = navParams.get('entrada')
        idiomaService.idioma_seleccionado

        let fecha_actual = moment()
        this.year_de_entrada = fecha_actual.year()
        this.mes_de_la_entrada = fecha_actual.month()
        this.dia_de_la_entrada = fecha_actual.date()
        this.hora_de_la_entrada = fecha_actual.hour()
        this.minuto_de_la_entrada = fecha_actual.minute()
        this.segundo_de_la_entrada = fecha_actual.second()
        

        console.log("")
        console.log(" ---------- vm.idiomaService ---------- ")
        console.log(vm.idiomaService.idioma_seleccionado);
        console.log(" ---------- vm.idiomaService ---------- ")
        console.log("")  
        vm.pageTitle = vm.idiomaService.idioma_seleccionado["Add"];
        console.log(" ---------- constructor del agregar ---------- ")  

        console.log("")
        console.log(" ---------- this.entrada ---------- ")
        console.log(vm.entradaDeEdicion);
        console.log(" ---------- this.entrada ---------- ")
        console.log("")  

        if (typeof vm.entradaDeEdicion === "undefined"){
            console.log("Estoy agregando")
        }
        else 
        {
            console.log("estoy editando")
            let output = [vm.entradaDeEdicion.fecha.slice(0, 10), "T", vm.entradaDeEdicion.fecha.slice(11)].join('');
            
            console.log("")
            console.log(" ---------- output---------- ")
            console.log(output)
            console.log(" ---------- output---------- ")
            console.log("")  
            /*
            vm.horaDeEntrada = output;
            vm.fechaDeEntrada = output; 
            vm.tituloDeEntrada = vm.entradaDeEdicion.titulo;
            vm.pageTitle = "Editar"
            */


        }
    }

    ngOnInit() {

    }

    dismiss() {
        // using the injected ModalController this page
        // can "dismiss" itself and optionally pass back data

        let vm = this

        console.log("")
        console.log("cerrando la vaina")
        console.log("")

        vm.modalController.dismiss({
            "guardar" : false
        });
    }

    tituloValido(){
        if (this.intento_guardar === false)
        {
            return true;
        }
        if (this.titulo_de_entrada === null || this.titulo_de_entrada === "")
        {
            return false;
        }
        else
        {
            return true;
        }
    }

    yearValido(){
       if (this.intento_guardar === false)
        {
            return true;
        }
        if (this.year_de_entrada === null )
        {
            return false;
        }
        else
        {
            return true;
        }
    }

    agregarCero(numero): string{
        if (numero < 10) {
            return "0" + numero;
        }
        return "" + numero;
    }

    guardar()
    {
        let vm = this
        this.fecha_invalida = false
        this.intento_guardar = true;
        let fecha_auxiliar = moment({
            years: this.year_de_entrada,
            months: this.mes_de_la_entrada,
            date: this.dia_de_la_entrada,
            hours: this.hora_de_la_entrada,
            minutes: this.minuto_de_la_entrada,
            seconds: this.segundo_de_la_entrada
        });
        this.fecha_invalida = fecha_auxiliar.isValid() === false
        let string_fecha = this.year_de_entrada + "-"
            + this.agregarCero(this.mes_de_la_entrada+1) + "-"
            + this.agregarCero(this.dia_de_la_entrada) + " "
            + this.agregarCero(this.hora_de_la_entrada) + ":"
            + this.agregarCero(this.minuto_de_la_entrada) + ":"
            + this.agregarCero(this.segundo_de_la_entrada)

        if (fecha_auxiliar.isValid() && this.titulo_de_entrada !== null && this.titulo_de_entrada !== "" )
        {
          vm.modalController.dismiss({
                guardar : true,
                fecha_string: string_fecha,
                titulo: this.titulo_de_entrada,
                year: this.year_de_entrada,
                mes: this.mes_de_la_entrada,
                dia: this.dia_de_la_entrada,
                hora: this.hora_de_la_entrada,
                minuto: this.minuto_de_la_entrada,
                segundo: this.segundo_de_la_entrada,
                pasado: false
          });
        }

    }

}
