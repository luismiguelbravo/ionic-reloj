import { Component, OnInit, Input } from '@angular/core';
import { ModalController} from '@ionic/angular';
import { NavController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-agregar',
  templateUrl: './agregar.page.html',
  styleUrls: ['./agregar.page.scss'],
})
export class AgregarPage implements OnInit {

  horaDeEntrada = '';
  fechaDeEntrada = ''; 
  tituloDeEntrada = "";

  pageTitle = "Agregra"

  entradaDeEdicion : any;  

    constructor(public modalController: ModalController,  public navParams: NavParams) {
        let vm = this
        vm.entradaDeEdicion = navParams.get('entrada')
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
            vm.horaDeEntrada = vm.entradaDeEdicion.fecha;
            vm.fechaDeEntrada = vm.entradaDeEdicion.fecha; 
            vm.tituloDeEntrada = vm.entradaDeEdicion.titulo;
            vm.pageTitle = "Editar"


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
      vm.modalController.dismiss({
          "guardar" : true,
          "horaDeEntrada" : vm.horaDeEntrada,
          "fechaDeEntrada" : vm.fechaDeEntrada,
          "tituloDeEntrada" : vm.tituloDeEntrada
      });
  }

}
