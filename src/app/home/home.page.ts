import { Component } from '@angular/core';
import * as moment from 'moment';
import { AlertController, ActionSheetController, ModalController} from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Entrada } from '../Entrada';
import { ContadorService } from '../commons/contador.service'
import { OrderPipe } from 'ngx-order-pipe';

import { AgregarPage } from '../entrada/agregar/agregar.page';

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage {
    fechaDeHoy = moment() //.format('YYYY-MM-DD HH:mm:ss');
    finalDeLaEspera = moment("2021-01-01")
    diferencia = null;
    diferenciaString = "";

    diferenciaEnSegundos = null;
    diferenciaEnMinutos = null;
    diferenciaEnHoras = null;
    diferenciaEnDias = null;
    diferenciaEnMeses = null;
    diferenciaEnYears = null;
    listaDeFechas : Entrada[];

    fechaDeEntrada = '';
    horaDeEntrada = '';
    tituloDeEntrada = '';
    listaFiltrada = null
    palabraDeBusqueda = ""

    mostrarFormulario = false;

    constructor(
        public alertController: AlertController,
        private storage: Storage,
        public contadorService: ContadorService,
        private orderPipe: OrderPipe,
        public actionSheetController: ActionSheetController,
        public modalController: ModalController
    ) { }

    async mostrarFomulario() {
        const modal = await this.modalController.create({
            component: AgregarPage
        });
        return await modal.present();
    }

    async presentActionSheet() {
        let vm = this
        const actionSheet = await this.actionSheetController.create({
          header: 'Ordenar',
          buttons: [{
            text: 'Orden Ascendente',
            icon: 'arrow-up',
            handler: () => {
                vm.listaDeFechas = vm.listaDeFechas.sort(function(a,b){
                    if( a.fecha < b.fecha) {return -1;}
                    if( a.fecha > b.fecha) {return 1;}
                    return 0;
                })
                vm.listaFiltrada = vm.listaDeFechas
                vm.storage.set('listaDeFechas', vm.listaDeFechas);
            }
          }, {
            text: 'Orden descendente',
            icon: 'arrow-down',
            handler: () => {
                vm.listaDeFechas = vm.listaDeFechas.sort(function(a,b){
                    if( a.fecha < b.fecha) {return 1;}
                    if( a.fecha > b.fecha) {return -1;}
                    return 0;
                })
                vm.listaFiltrada = vm.listaDeFechas
                vm.storage.set('listaDeFechas', vm.listaDeFechas);
            }
          }]
        });
        await actionSheet.present();
    }

    async exitoAlguardar() {
        let vm = this
        const alert = await this.alertController.create({
            header: 'Éxito',
            subHeader: '',
            message: 'Fecha guardada correctamente.',
            buttons: ['OK']
        });
        await alert.present()
        vm.fechaDeEntrada = ''
        vm.horaDeEntrada = ''
        vm.tituloDeEntrada = ''
        vm.mostrarFormulario = false
    }

    async errorAlGuardar() {
        const alert = await this.alertController.create({
            header: 'Error',
            subHeader: '',
            message: 'Titulo o fecha invalida.',
            buttons: ['OK']
        });
        await alert.present();
    }

    async intentarEliminar(id) {

        const alert = await this.alertController.create({
          header: 'Advertencia',
          message: 'Esta acción no puede ser revertida. <strong>¿Esta seguro de eliminar?</strong>',
          buttons: [
            {
              text: 'Cancelar',
              role: 'cancel',
              cssClass: 'secondary',
              handler: (blah) => {
                console.log('Confirm Cancel: blah');
              }
            }, {
              text: 'Eliminar',
              handler: () => {
                console.log('Confirm Okay');
                for( var i = 0; i < this.listaDeFechas.length; i++){ 
                   if ( this.listaDeFechas[i].id === id) {
                     this.listaDeFechas.splice(i, 1);
                     this.storage.set('listaDeFechas', this.listaDeFechas);
                     break;
                   }
                }
              }
            }
          ]
        });

        this.listaFiltrada = this.listaDeFechas 

        await alert.present();
    }


    ngOnInit() {
        let vm = this;
        vm.storage.get('listaDeFechas').then((val) => {
            vm.listaDeFechas = val
            if (val === null) {
                vm.listaDeFechas = []
                vm.usarSemilla()
            }
            console.log(this.listaDeFechas)
            vm.listaDeFechas = this.listaDeFechas.sort(
                function(a,b) 
                {
                    const fechaA = new Date(a.fecha)
                    const fechaB = new Date(b.fecha)
                    return fechaB.getTime() - fechaA.getTime()
                }
            );
            /*
                se crea un reloj unico que activa a todos los detalles
                esto lo hice para evitar terner un hilo con reloj contador para cada proceso
                debido a que cuando tenga mas de 3000 fechas tendria mas de 3000 segunderos activados independientes
                de esta manera, al tener 3000 fechas, tengo solo un segundero que las mueve todas
            */
            vm.listaFiltrada = vm.listaDeFechas
            vm.contadorService.iniciarMovimiento()
        });
    }

    usarSemilla():void {
        console.log("usarSemilla");
        this.listaDeFechas.push({fecha: "2016-10-19 00:00", titulo: "Llegada a Chile", id: "donb95"});
        this.listaDeFechas.push({fecha: "2019-05-11 02:41", titulo: "Ultima vez que fume", id: "dxpb95"});
        this.listaDeFechas.push({fecha: "2021-01-01 00:00", titulo: "Fecha esperada", id: "zonbz5"});
        this.listaDeFechas.push({fecha: "2019-07-01 20:55", titulo: "t", id: "cualquf4"});
        this.storage.set('listaDeFechas', this.listaDeFechas);
        this.exitoAlguardar();
    }

    guardar():void {
        let vm = this

        if (vm.horaDeEntrada === '' || vm.fechaDeEntrada === '' || vm.tituloDeEntrada === '')
        {
            vm.errorAlGuardar();
        }
        else
        {
            let nuevaFecha = new Entrada();
            nuevaFecha.fecha = vm.fechaDeEntrada.substring(0,10) + ' ' + vm.horaDeEntrada.substring(11, 16);
            nuevaFecha.titulo = vm.tituloDeEntrada;
            nuevaFecha.id = Math.random().toString(36).substring(7);
            vm.listaDeFechas.push(nuevaFecha);

            vm.listaDeFechas = vm.listaDeFechas.sort(function(a,b){
                if( a.fecha < b.fecha) {return 1;}
                if( a.fecha > b.fecha) {return -1;}
                return 0;
            })

            this.listaFiltrada = this.listaDeFechas 
            vm.storage.set('listaDeFechas', vm.listaDeFechas);

            vm.exitoAlguardar();
        }
    }

    debug():void {
        console.log(this.listaDeFechas);
    }

    buscar():void {
        let vm = this
        console.log("buscando")
        vm.listaFiltrada = vm.listaDeFechas.filter(function(element) {
            return element.titulo.toLowerCase().includes(vm.palabraDeBusqueda.toLowerCase())
        });
    }

}
