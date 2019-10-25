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
    palabraDeBusqueda = null

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

    buscar():void {
        let vm = this
        if (vm.palabraDeBusqueda !== "" && vm.palabraDeBusqueda!== null)
        {
            vm.listaDeIdiomas = this.idiomaService.listaDeIdiomasReducidos().filter(function(idioma) {
                console.log("");
                console.log(" ===== idioma =====");
                console.log(idioma);
                console.log(" ===== idioma =====");
                console.log("");
                return idioma.Autoglotonimo.toLowerCase().includes(vm.palabraDeBusqueda.toLowerCase()) ||  idioma.Autoglotonimo.includes(vm.palabraDeBusqueda) 
            });
        }
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
