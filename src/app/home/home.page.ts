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
    ) { 
        console.log("constructor del home")
    }


    async mostrarFomulario() {
        let vm = this;
        const modal = await this.modalController.create({ component: AgregarPage });
        modal.present();
        // Get returned data
        const { data } = await modal.onWillDismiss();
        
        if (typeof data !== "undefined")
        {
            if (data.guardar )
            {
                vm.guardar(data.horaDeEntrada, data.fechaDeEntrada, data.tituloDeEntrada )
            }
        }

    }

    async editar(entrada){
        // mostrar el modal, 
        // pasarle como parametro la vaina que estoy editando

        let vm = this;
        const modal = await this.modalController.create({
            component: AgregarPage,
            componentProps: {
                entrada: entrada
            }
        });

        modal.present();
        // Get returned data
        const { data } = await modal.onWillDismiss();
        
        if (typeof data !== "undefined")
        {
            if (data.guardar )
            {
                // vm.guardar(data.horaDeEntrada, data.fechaDeEntrada, data.tituloDeEntrada )
                let index = 0;
                while(index < vm.listaDeFechas.length) {
                    if (vm.listaDeFechas[index].id === entrada.id){
                        break;
                    }
                    index++
                }

                vm.listaDeFechas[index].fecha = data.fechaDeEntrada.substring(0,10) + ' ' + data.horaDeEntrada.substring(11, 19);
                vm.listaDeFechas[index].titulo = data.tituloDeEntrada

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

    }

    async mostrarMenuDeOrdenamiento() {
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
                    for( var i = 0; i < this.listaDeFechas.length; i++)
                    { 
                        if ( this.listaDeFechas[i].id === id) {
                            this.listaDeFechas.splice(i, 1);
                            this.listaFiltrada = this.listaDeFechas                      
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
        this.listaDeFechas.push({fecha: "2019-05-27 09:00", titulo: "Empleo en 3it", id: "donb95"});
        this.listaDeFechas.push({fecha: "2016-10-19 00:00", titulo: "Llegada a Chile", id: "donb956"});
        this.listaDeFechas.push({fecha: "2019-06-07 15:16", titulo: "Ultima vez que fume y bebi alcohol", id: "dxpb95"});
        this.listaDeFechas.push({fecha: "2021-01-01 00:00", titulo: "Fecha esperada", id: "zonbz5"});
        this.listaDeFechas.push({fecha: "2019-07-01 20:55", titulo: "Aplicacion para vender mariposas digitales", id: "cualquf4"});
        this.listaDeFechas.push({fecha: "2019-09-13 23:43", titulo: "Viaje a Perú", id: "inb95"});

        this.storage.set('listaDeFechas', this.listaDeFechas);
        this.exitoAlguardar();
    }

    guardar(horaDeEntrada, fechaDeEntrada, tituloDeEntrada):void {
        let vm = this

        if (horaDeEntrada === '' || fechaDeEntrada === '' || tituloDeEntrada === '')
        {
            vm.errorAlGuardar();
        }
        else
        {
            let nuevaFecha = new Entrada();
            nuevaFecha.fecha = fechaDeEntrada.substring(0,10) + ' ' + horaDeEntrada.substring(11, 19);
            nuevaFecha.titulo = tituloDeEntrada;
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
        vm.listaFiltrada = vm.listaDeFechas.filter(function(element) {
            return element.titulo.toLowerCase().includes(vm.palabraDeBusqueda.toLowerCase())
        });
    }


}
