import { Component, OnInit } from '@angular/core';
import { IdiomaService } from '../commons/idioma.service'

@Component({
    selector: 'app-bienvenida',
    templateUrl: './bienvenida.page.html',
    styleUrls: ['./bienvenida.page.scss'],
})
export class BienvenidaPage implements OnInit {

    listaDeIdiomas : any;
    ididomaSeleccionado: number;

    constructor(
        public idiomaService: IdiomaService
    ) { }

    ngOnInit() {
        let vm = this;
        vm.listaDeIdiomas = this.idiomaService.listaDeIdiomas();
        vm.listaDeIdiomas = vm.listaDeIdiomas.sort(function(a,b){
            if( a.idiomaOroginal < b.idiomaOroginal) {return -1;}
            if( a.idiomaOroginal > b.idiomaOroginal) {return 1;}
            return 0;
        })
    }

    seleccionarEsteIdioma(entrada)
    {
        let vm = this;
        vm.ididomaSeleccionado = entrada;
    }

}
