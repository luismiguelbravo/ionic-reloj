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
        vm.listaDeIdiomas = this.idiomaService.listaDeIdiomasReducidos();
    }

    seleccionarEsteIdioma(idioma)
    {
        let vm = this;
        vm.ididomaSeleccionado = this.idiomaService.get_idioma_by_indice(idioma.indice)
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
