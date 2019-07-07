import { Component, OnInit } from '@angular/core';
import { ModalController} from '@ionic/angular';

@Component({
  selector: 'app-agregar',
  templateUrl: './agregar.page.html',
  styleUrls: ['./agregar.page.scss'],
})
export class AgregarPage implements OnInit {

  horaDeEntrada = '';
  fechaDeEntrada = ''; 
  tituloDeEntrada = "";

  constructor(public modalController: ModalController) {
      console.log(" ---------- constructor del agregar ---------- ")
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
