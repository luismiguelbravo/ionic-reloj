import { Component, OnInit } from '@angular/core';
import { IdiomaService } from '../commons/idioma.service'

@Component({
    selector: 'app-bienvenida',
    templateUrl: './bienvenida.page.html',
    styleUrls: ['./bienvenida.page.scss'],
})
export class BienvenidaPage implements OnInit {

    listaDeIdiomas : any

    constructor(
        public idiomaService: IdiomaService
    ) { }

    ngOnInit() {
        let vm = this
        vm.listaDeIdiomas = this.idiomaService.listaDeIdiomas()
    }

}
