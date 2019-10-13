import { Component, OnInit } from '@angular/core';
import { ModalController} from '@ionic/angular';
import { IdiomaService } from '../commons/idioma.service'

@Component({
    selector: 'app-bienvenida',
    templateUrl: './bienvenida.page.html',
    styleUrls: ['./bienvenida.page.scss'],
})
export class BienvenidaPage implements OnInit {

    listaDeIdiomas : any;
    ididomaSeleccionado: any;

    constructor(
        public idiomaService: IdiomaService,
        public modalController: ModalController
    ) { 
        this.ididomaSeleccionado = {
             indice : null
        }

    }

    ngOnInit() {
        let vm = this;
        vm.listaDeIdiomas = this.idiomaService.listaDeIdiomas();


        vm.listaDeIdiomas = vm.listaDeIdiomas.sort(function(a,b){
            if( a.Autoglotonimo < b.Autoglotonimo) {return -1;}
            if( a.Autoglotonimo > b.Autoglotonimo) {return 1;}
            return 0;
        });

    }

    seleccionarEsteIdioma(idioma)
    {
        let vm = this;
        vm.ididomaSeleccionado = idioma;
    }

    dismiss() {
        // using the injected ModalController this page
        // can "dismiss" itself and optionally pass back data
        this.modalController.dismiss({
            "guardar" : false
        });
    }

    guardar(){
        this.modalController.dismiss({
            "ididomaSeleccionado" : this.ididomaSeleccionado
        });
    }

}
