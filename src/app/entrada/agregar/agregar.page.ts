import { Component, OnInit, Input } from '@angular/core';
import { ModalController} from '@ionic/angular';
import { NavController, NavParams } from '@ionic/angular';
import { Entrada } from '../../Entrada';
import { IdiomaService } from '../../commons/idioma.service';
import { DIAS } from '../../commons/constantes/dias'
import { HORAS } from '../../commons/constantes/horas'
import { CINCUENTA_Y_NUEVE } from '../../commons/constantes/cincuenta_y_nueve'



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


  lista_de_dias = DIAS;
  lista_de_horas = HORAS;
  lista_CINCUENTA_Y_NUEVE = CINCUENTA_Y_NUEVE;

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

    guardar(){
        let vm = this
        console.log("validar la fecha");

        let fecha_para_guardar = {
            fecha: "2019-09-09 22:30",
            titulo: "Reunión Postulantes",
            id: "Reunión Postulantes",
            year: this.year_de_entrada,
            mes: this.mes_de_la_entrada,
            dia: this.dia_de_la_entrada,
            hora: this.hora_de_la_entrada,
            minuto: this.minuto_de_la_entrada,
            segundo: this.segundo_de_la_entrada,
            pasado: false
        };
        console.log("")
        console.log(" ------------ fecha_para_guardar ------------ ")
        console.log(fecha_para_guardar)
        console.log(" ------------ fecha_para_guardar ------------ ")
        console.log("")

      /*
      vm.modalController.dismiss({
          "guardar" : true,
          "horaDeEntrada" : vm.horaDeEntrada,
          "fechaDeEntrada" : vm.fechaDeEntrada,
          "tituloDeEntrada" : vm.tituloDeEntrada
      });
      */
  }

}
