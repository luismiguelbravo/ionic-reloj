import { Injectable } from '@angular/core';
import * as vocabulario from './vocabulario.json';


@Injectable({
  providedIn: 'root'
})
export class IdiomaService {

    get_idioma_by_indice(indice) {
        return this.listaDeIdiomas().filter(idioma => {
            return idioma.indice === indice;
        })[0]
    }

    idioma_seleccionado = this.get_idioma_by_indice(47)[0]

    seleccionar_idioma(idioma): void
    {
        let vm = this;
        vm.idioma_seleccionado = idioma;
    }
    
    idioma_actual(idioma) : any 
    {
        let vm = this;
        return vm.idioma_seleccionado;
    }

    get_idioma_por_defecto() : any
    {
        let lista_de_idiomas = this.listaDeIdiomas();
        let idiomaPorDefecto = lista_de_idiomas.find(function(element) {
            return element.indice === 47;
        });
        return idiomaPorDefecto;
    }

    listaDeIdiomas(): any[]{
        return vocabulario.lista;
    } 
    // idiomas que faltan: chichewa
    // probar el idioma YIDIS  en la aplicacion a ver sino da algun error
    constructor() { }
}
