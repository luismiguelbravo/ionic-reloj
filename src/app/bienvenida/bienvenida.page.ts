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
    palabraDeBusquedaIdioma = null

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
        if (vm.palabraDeBusquedaIdioma !== "" && vm.palabraDeBusquedaIdioma!== null)
        {
            vm.listaDeIdiomas = this.idiomaService.listaDeIdiomasReducidos().filter(function(idioma) {
                return idioma.Autoglotonimo.toLowerCase().includes(vm.palabraDeBusquedaIdioma.toLowerCase()) ||  idioma.Autoglotonimo.includes(vm.palabraDeBusquedaIdioma) 
            });
        }
        else
        {
            vm.listaDeIdiomas = this.idiomaService.listaDeIdiomasReducidos();
        }
    }

    cancelarBusqueda():void{
        this.palabraDeBusquedaIdioma = ""
        this.listaDeIdiomas = this.idiomaService.listaDeIdiomasReducidos()
        this.focusOnBuscar()
    }

    focusOnBuscar():void {
        let elemento = document.getElementById("palabraDeBusquedaIdioma").focus()
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
