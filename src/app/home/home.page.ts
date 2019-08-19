import { Component } from '@angular/core';
import * as moment from 'moment';
import { AlertController, ActionSheetController, ModalController} from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Entrada } from '../Entrada';
import { ContadorService } from '../commons/contador.service'
import { OrderPipe } from 'ngx-order-pipe';

import { AgregarPage } from '../entrada/agregar/agregar.page';

import { BienvenidaPage } from '../bienvenida/bienvenida.page';
import { IdiomaService } from '../commons/idioma.service'

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
    miIdioma = {
                "indice": 47, "Heteroglotonimo": "Inglés", "Autoglotonimo": "English",
                "Welcome": "Welcome",
                "Search": "Search",
                "Ascending order": "Ascending order",
                "Descending order": "Descending order",
                "Save": "Save",
                "Cancel": "Cancel",
                "Success": "Success",
                "Event saved successfully.": "Event saved successfully.",
                "Warning": "Warning",
                "This action cannot be reversed.": "This action cannot be reversed.",
                "Remove": "Remove",
                "Title": "Title",
                "Event": "Event",
                "Year": "Year",
                "Month": "Month",
                "Day": "Day",
                "Hour": "Hour",
                "Minute": "Minute",
                "Second": "Second",
                "Months":[
                    "January",
                    "February",
                    "March",
                    "April",
                    "May",
                    "June",
                    "July",
                    "August",
                    "September",
                    "October",
                    "November",
                    "December"
                ]
            };


    constructor(
        public alertController: AlertController,
        private storage: Storage,
        public contadorService: ContadorService,
        private orderPipe: OrderPipe,
        public actionSheetController: ActionSheetController,
        public modalController: ModalController,
        public idiomaService: IdiomaService
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
          header: vm.miIdioma['Order'],
          buttons: [{
            text: vm.miIdioma['Ascending order'],
            icon: 'arrow-up',
            handler: () => {

                // verficiar que el cuadro de busqueda este lleno o no
                if (vm.palabraDeBusqueda === '') {
                    vm.listaDeFechas = vm.listaDeFechas.sort(function(a,b){
                        if( a.fecha < b.fecha) {return -1;}
                        if( a.fecha > b.fecha) {return 1;}
                        return 0;
                    })
                    vm.listaFiltrada = vm.listaDeFechas
                    vm.storage.set('listaDeFechas', vm.listaDeFechas);
                }
                else {
                    vm.listaFiltrada = vm.listaFiltrada.sort(function(a,b){
                        if( a.fecha < b.fecha) {return -1;}
                        if( a.fecha > b.fecha) {return 1;}
                        return 0;
                    })
                }

            }
          }, {
            text: vm.miIdioma['Descending order'],
            icon: 'arrow-down',
            handler: () => {
                if (vm.palabraDeBusqueda === '') {
                    vm.listaDeFechas = vm.listaDeFechas.sort(function(a,b){
                        if( a.fecha < b.fecha) {return 1;}
                        if( a.fecha > b.fecha) {return -1;}
                        return 0;
                    })
                    vm.listaFiltrada = vm.listaDeFechas
                    vm.storage.set('listaDeFechas', vm.listaDeFechas);
                }
                else
                {
                    vm.listaFiltrada = vm.listaFiltrada.sort(function(a,b){
                        if( a.fecha < b.fecha) {return 1;}
                        if( a.fecha > b.fecha) {return -1;}
                        return 0;
                    })
                }
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
        let vm = this;
        const alert = await this.alertController.create({
            header: vm.miIdioma['Warning'],
            message: vm.miIdioma['This action cannot be reversed.'],
            buttons: [
            {
                text: vm.miIdioma['Cancel'],
                role: 'cancel',
                cssClass: 'secondary',
                handler: (blah) => {
                    console.log('Confirm Cancel: blah');
                }
            }, {
                text: vm.miIdioma['Delete'],
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

            console.log("recorriendo las fechas");
            
            let right_now = moment();
            let fecha_auxiliar = null;
            let alguna_modificacion = false;

            vm.listaDeFechas.forEach(function(entrada) {
                fecha_auxiliar = moment(
                {
                    years: entrada.year,
                    months: entrada.mes,
                    days: entrada.dia,
                    hours: entrada.hora,
                    minutes: entrada.minuto,
                    seconds: entrada.segundo 
                });

                // actualizar el idioma de los nombres de los meses por si cambio de fecha ???
                // solo actualizar el nombre del mes al guardar o editar el evento


                if ( right_now > fecha_auxiliar && entrada.pasado === false ) {
                   // date is past
                   console.log(entrada);
                   entrada.pasado = true;
                   alguna_modificacion = true;

                }
                
            });

            if (alguna_modificacion) {
                console.log("------------- ocurrio alguna modificacion ------------- ");
                this.storage.set('listaDeFechas', this.listaDeFechas);
            }

            // recorrer toda esta vaina para ver que esta en el pasado


            /*
                se crea un reloj unico que activa a todos los detalles
                esto lo hice para evitar terner un hilo con reloj contador para cada proceso
                debido a que cuando tenga mas de 3000 fechas tendria mas de 3000 segunderos activados independientes
                de esta manera, al tener 3000 fechas, tengo solo un segundero que las mueve todas

                // ahora voy a activar un hilo del reloj, solo cuando se abre el detalle de una fecha, 
                esto para proteger el consumo del procesador.
            */
            vm.listaFiltrada = vm.listaDeFechas
            vm.contadorService.iniciarMovimiento()

        });

        // preguntar por el idioma seleccionado
        vm.storage.get('miIdioma').then((miIdioma) => {
            console.log("Idioma seleccionado");

            console.log("");
            console.log(" --------- miIdioma --------- ");
            console.log(miIdioma);
            console.log(" --------- miIdioma --------- ");
            console.log("");
            if (miIdioma === null){
                vm.seleccionarIdioma();
            }
            else{
                vm.idiomaService.seleccionar_idioma(miIdioma);
                vm.miIdioma = miIdioma;
            }
            

        });
    }

    async seleccionarIdioma(){
        // mostrar el modal, 
        // pasarle como parametro la vaina que estoy editando

        let vm = this;
        const modal = await this.modalController.create({
            component: BienvenidaPage
        });

        modal.present();
        // Get returned data
        const { data } = await modal.onWillDismiss();
        
        if (typeof data !== "undefined")
        {
            console.log("")
            console.log(" ------------ data.guardar ------------")
            console.log(data.guardar)
            console.log(" ------------ data.guardar ------------")
            console.log("")
            // si puedo guardar
            if (typeof data.guardar === "undefined" || data.guardar !== false)
            {
               this.storage.set('miIdioma', data.ididomaSeleccionado);
               this.idiomaService.seleccionar_idioma(data.ididomaSeleccionado);
               vm.miIdioma = data.ididomaSeleccionado;
            }
        }

    }



    usarSemilla():void {
        console.log("usarSemilla");


        this.listaDeFechas.push({
            fecha: "2019-08-19 24:00", titulo: "Gotas en los ojos", year: 2019, mes: 8, hora: 24, minuto: 0, segundo: 0, pasado: false,
            dia: 20,
            id: "24",
        });

        this.listaDeFechas.push({
            fecha: "2019-08-25 20:00", titulo: "CLOXACILINA y Gotas en los ojos", year: 2019, mes: 8, hora: 20, minuto: 0, segundo: 0, pasado: false,
            dia: 25,
            id: "23",
        });


        this.listaDeFechas.push({
            fecha: "2019-08-25 16:00", titulo: "Gotas en los ojos", year: 2019, mes: 8, hora: 16, minuto: 0, segundo: 0, pasado: false,
            dia: 25,           
            id: "22",
        });

        this.listaDeFechas.push({
            fecha: "2019-08-25 14:00",titulo: "CLOXACILINA",year: 2019,mes: 8,hora: 14,minuto: 0,segundo: 0,pasado: false,
            dia: 25,
            id: "21",
        });

        this.listaDeFechas.push({
            fecha: "2019-08-25 12:00", titulo: "Gotas en los ojos", year: 2019, mes: 8, hora: 12, minuto: 0, segundo: 0, pasado: false,
            dia: 25,
            id: "20",
        });

        this.listaDeFechas.push({
            fecha: "2019-08-25 08:00", titulo: "CLOXACILINA y Gotas en los ojos", year: 2019, mes: 8, hora: 8, minuto: 0, segundo: 0, pasado: false,
            dia: 25,
            id: "19",
        });

        this.listaDeFechas.push({
            fecha: "2019-08-25 04:00", titulo: "Gotas en los ojos", year: 2019, mes: 8, hora: 4, minuto: 0, segundo: 0, pasado: false,
            dia: 25,
            id: "18",
        });


        this.listaDeFechas.push({
            fecha: "2019-08-25 02:00", titulo: "CLOXACILINA", year: 2019, mes: 8, hora: 2, minuto: 0, segundo: 0, pasado: false,
            dia: 25,
            id: "17",
        });

        // > dia 7; *//

        this.listaDeFechas.push({
            fecha: "2019-08-24 24:00", titulo: "Gotas en los ojos", year: 2019, mes: 8, hora: 24, minuto: 0, segundo: 0, pasado: false,
            dia: 24,
            id: "56",
        });

        this.listaDeFechas.push({
            fecha: "2019-08-24 20:00", titulo: "CLOXACILINA y Gotas en los ojos", year: 2019, mes: 8, hora: 20, minuto: 0, segundo: 0, pasado: false,
            dia: 24,
            id: "55",
        });


        this.listaDeFechas.push({
            fecha: "2019-08-24 16:00", titulo: "Gotas en los ojos", year: 2019, mes: 8, hora: 16, minuto: 0, segundo: 0, pasado: false,
            dia: 24,           
            id: "54",
        });

        this.listaDeFechas.push({
            fecha: "2019-08-24 14:00",titulo: "CLOXACILINA",year: 2019,mes: 8,hora: 14,minuto: 0,segundo: 0,pasado: false,
            dia: 24,
            id: "53",
        });

        this.listaDeFechas.push({
            fecha: "2019-08-24 12:00", titulo: "Gotas en los ojos", year: 2019, mes: 8, hora: 12, minuto: 0, segundo: 0, pasado: false,
            dia: 24,
            id: "52",
        });

        this.listaDeFechas.push({
            fecha: "2019-08-24 08:00", titulo: "CLOXACILINA y Gotas en los ojos", year: 2019, mes: 8, hora: 8, minuto: 0, segundo: 0, pasado: false,
            dia: 24,
            id: "51",
        });

        this.listaDeFechas.push({
            fecha: "2019-08-24 04:00", titulo: "Gotas en los ojos", year: 2019, mes: 8, hora: 4, minuto: 0, segundo: 0, pasado: false,
            dia: 24,
            id: "50",
        });


        this.listaDeFechas.push({
            fecha: "2019-08-24 02:00", titulo: "CLOXACILINA", year: 2019, mes: 8, hora: 2, minuto: 0, segundo: 0, pasado: false,
            dia: 24,
            id: "49",
        });        


        // > dia 6; *//

        this.listaDeFechas.push({
            fecha: "2019-08-23 24:00", titulo: "Gotas en los ojos", year: 2019, mes: 8, hora: 24, minuto: 0, segundo: 0, pasado: false,
            dia: 23,
            id: "48",
        });

        this.listaDeFechas.push({
            fecha: "2019-08-23 20:00", titulo: "CLOXACILINA y Gotas en los ojos", year: 2019, mes: 8, hora: 20, minuto: 0, segundo: 0, pasado: false,
            dia: 23,
            id: "47",
        });


        this.listaDeFechas.push({
            fecha: "2019-08-23 16:00", titulo: "Gotas en los ojos", year: 2019, mes: 8, hora: 16, minuto: 0, segundo: 0, pasado: false,
            dia: 23,           
            id: "46",
        });

        this.listaDeFechas.push({
            fecha: "2019-08-23 14:00",titulo: "CLOXACILINA",year: 2019,mes: 8,hora: 14,minuto: 0,segundo: 0,pasado: false,
            dia: 23,
            id: "45",
        });

        this.listaDeFechas.push({
            fecha: "2019-08-23 12:00", titulo: "Gotas en los ojos", year: 2019, mes: 8, hora: 12, minuto: 0, segundo: 0, pasado: false,
            dia: 23,
            id: "44",
        });

        this.listaDeFechas.push({
            fecha: "2019-08-23 08:00", titulo: "CLOXACILINA y Gotas en los ojos", year: 2019, mes: 8, hora: 8, minuto: 0, segundo: 0, pasado: false,
            dia: 23,
            id: "43",
        });

        this.listaDeFechas.push({
            fecha: "2019-08-23 04:00", titulo: "Gotas en los ojos", year: 2019, mes: 8, hora: 4, minuto: 0, segundo: 0, pasado: false,
            dia: 23,
            id: "42",
        });


        this.listaDeFechas.push({
            fecha: "2019-08-23 02:00", titulo: "CLOXACILINA", year: 2019, mes: 8, hora: 2, minuto: 0, segundo: 0, pasado: false,
            dia: 23,
            id: "41",
        });        

        // > dia 5; *//

        this.listaDeFechas.push({
            fecha: "2019-08-22 24:00", titulo: "Gotas en los ojos", year: 2019, mes: 8, hora: 24, minuto: 0, segundo: 0, pasado: false,
            dia: 22,
            id: "40",
        });

        this.listaDeFechas.push({
            fecha: "2019-08-22 20:00", titulo: "CLOXACILINA y Gotas en los ojos", year: 2019, mes: 8, hora: 20, minuto: 0, segundo: 0, pasado: false,
            dia: 22,
            id: "39",
        });


        this.listaDeFechas.push({
            fecha: "2019-08-22 16:00", titulo: "Gotas en los ojos", year: 2019, mes: 8, hora: 16, minuto: 0, segundo: 0, pasado: false,
            dia: 22,           
            id: "38",
        });

        this.listaDeFechas.push({
            fecha: "2019-08-22 14:00",titulo: "CLOXACILINA",year: 2019,mes: 8,hora: 14,minuto: 0,segundo: 0,pasado: false,
            dia: 22,
            id: "37",
        });

        this.listaDeFechas.push({
            fecha: "2019-08-22 12:00", titulo: "Gotas en los ojos", year: 2019, mes: 8, hora: 12, minuto: 0, segundo: 0, pasado: false,
            dia: 22,
            id: "36",
        });

        this.listaDeFechas.push({
            fecha: "2019-08-22 08:00", titulo: "CLOXACILINA y Gotas en los ojos", year: 2019, mes: 8, hora: 8, minuto: 0, segundo: 0, pasado: false,
            dia: 22,
            id: "35",
        });

        this.listaDeFechas.push({
            fecha: "2019-08-22 04:00", titulo: "Gotas en los ojos", year: 2019, mes: 8, hora: 4, minuto: 0, segundo: 0, pasado: false,
            dia: 22,
            id: "34",
        });


        this.listaDeFechas.push({
            fecha: "2019-08-22 02:00", titulo: "CLOXACILINA", year: 2019, mes: 8, hora: 2, minuto: 0, segundo: 0, pasado: false,
            dia: 22,
            id: "33",
        });        
        // > dia 4; *//

        this.listaDeFechas.push({
            fecha: "2019-08-21 24:00", titulo: "Gotas en los ojos", year: 2019, mes: 8, hora: 24, minuto: 0, segundo: 0, pasado: false,
            dia: 21,
            id: "32",
        });

        this.listaDeFechas.push({
            fecha: "2019-08-21 20:00", titulo: "CLOXACILINA y Gotas en los ojos", year: 2019, mes: 8, hora: 20, minuto: 0, segundo: 0, pasado: false,
            dia: 21,
            id: "31",
        });


        this.listaDeFechas.push({
            fecha: "2019-08-21 16:00", titulo: "Gotas en los ojos", year: 2019, mes: 8, hora: 16, minuto: 0, segundo: 0, pasado: false,
            dia: 21,           
            id: "30",
        });

        this.listaDeFechas.push({
            fecha: "2019-08-21 14:00",titulo: "CLOXACILINA",year: 2019,mes: 8,hora: 14,minuto: 0,segundo: 0,pasado: false,
            dia: 21,
            id: "29",
        });

        this.listaDeFechas.push({
            fecha: "2019-08-21 12:00", titulo: "Gotas en los ojos", year: 2019, mes: 8, hora: 12, minuto: 0, segundo: 0, pasado: false,
            dia: 21,
            id: "28",
        });

        this.listaDeFechas.push({
            fecha: "2019-08-21 08:00", titulo: "CLOXACILINA y Gotas en los ojos", year: 2019, mes: 8, hora: 8, minuto: 0, segundo: 0, pasado: false,
            dia: 21,
            id: "27",
        });

        this.listaDeFechas.push({
            fecha: "2019-08-21 04:00", titulo: "Gotas en los ojos", year: 2019, mes: 8, hora: 4, minuto: 0, segundo: 0, pasado: false,
            dia: 21,
            id: "26",
        });


        this.listaDeFechas.push({
            fecha: "2019-08-21 02:00", titulo: "CLOXACILINA", year: 2019, mes: 8, hora: 2, minuto: 0, segundo: 0, pasado: false,
            dia: 21,
            id: "25",
        });        

        // > dia 3; *//


        // > dia 2; *//

        this.listaDeFechas.push({
            fecha: "2019-08-21 24:00", titulo: "Gotas en los ojos", year: 2019, mes: 8, hora: 24, minuto: 0, segundo: 0, pasado: false,
            dia: 20,
            id: "16",
        });

        this.listaDeFechas.push({
            fecha: "2019-08-20 20:00", titulo: "CLOXACILINA y Gotas en los ojos", year: 2019, mes: 8, hora: 20, minuto: 0, segundo: 0, pasado: false,
            dia: 20,
            id: "15",
        });


        this.listaDeFechas.push({
            fecha: "2019-08-20 16:00", titulo: "Gotas en los ojos", year: 2019, mes: 8, hora: 16, minuto: 0, segundo: 0, pasado: false,
            dia: 20,           
            id: "14",
        });

        this.listaDeFechas.push({
            fecha: "2019-08-20 14:00",titulo: "CLOXACILINA",year: 2019,mes: 8,hora: 14,minuto: 0,segundo: 0,pasado: false,
            dia: 20,
            id: "13",
        });

        this.listaDeFechas.push({
            fecha: "2019-08-20 12:00", titulo: "Gotas en los ojos", year: 2019, mes: 8, hora: 12, minuto: 0, segundo: 0, pasado: false,
            dia: 20,
            id: "12",
        });

        this.listaDeFechas.push({
            fecha: "2019-08-20 08:00", titulo: "CLOXACILINA y Gotas en los ojos", year: 2019, mes: 8, hora: 8, minuto: 0, segundo: 0, pasado: false,
            dia: 20,
            id: "11",
        });

        this.listaDeFechas.push({
            fecha: "2019-08-20 04:00", titulo: "Gotas en los ojos", year: 2019, mes: 8, hora: 4, minuto: 0, segundo: 0, pasado: false,
            dia: 20,
            id: "10",
        });


        this.listaDeFechas.push({
            fecha: "2019-08-20 02:00", titulo: "CLOXACILINA", year: 2019, mes: 8, hora: 2, minuto: 0, segundo: 0, pasado: false,
            dia: 20,
            id: "9",
        });

        // > dia 1; *//

        this.listaDeFechas.push({
            fecha: "2019-08-19 24:00", titulo: "Gotas en los ojos", year: 2019, mes: 8, hora: 24, minuto: 0, segundo: 0, pasado: false,
            dia: 19,
            id: "8",
        });

        this.listaDeFechas.push({
            fecha: "2019-08-19 20:00", titulo: "CLOXACILINA y Gotas en los ojos", year: 2019, mes: 8, hora: 20, minuto: 0, segundo: 0, pasado: false,
            dia: 19,
            id: "7",
        });


        this.listaDeFechas.push({
            fecha: "2019-08-19 16:00", titulo: "Gotas en los ojos", year: 2019, mes: 8, hora: 16, minuto: 0, segundo: 0, pasado: false,
            dia: 19,           
            id: "6",
        });

        this.listaDeFechas.push({
            fecha: "2019-08-19 14:00",titulo: "CLOXACILINA",year: 2019,mes: 8,hora: 14,minuto: 0,segundo: 0,pasado: false,
            dia: 19,
            id: "5",
        });

        this.listaDeFechas.push({
            fecha: "2019-08-19 12:00", titulo: "Gotas en los ojos", year: 2019, mes: 8, hora: 12, minuto: 0, segundo: 0, pasado: false,
            dia: 19,
            id: "4",
        });

        this.listaDeFechas.push({
            fecha: "2019-08-19 08:00", titulo: "CLOXACILINA y Gotas en los ojos", year: 2019, mes: 8, hora: 8, minuto: 0, segundo: 0, pasado: false,
            dia: 19,
            id: "3",
        });

        this.listaDeFechas.push({
            fecha: "2019-08-19 04:00", titulo: "Gotas en los ojos", year: 2019, mes: 8, hora: 4, minuto: 0, segundo: 0, pasado: false,
            dia: 19,
            id: "2",
        });


        this.listaDeFechas.push({
            fecha: "2019-08-19 02:00", titulo: "CLOXACILINA", year: 2019, mes: 8, hora: 2, minuto: 0, segundo: 0, pasado: false,
            dia: 19,
            id: "1",
        });

/*
1 * 02:00 CLOXACILINA
2 * 04:00 Gotas en los ojos
3 * 08:00 CLOXACILINA y Gotas en los ojos
4 * 12:00 Gotas en los ojos
5 * 14:00 CLOXACILINA
6 * 16:00 Gotas en los ojos
7 * 20:00 CLOXACILINA y Gotas en los ojos
8 * 24:00 Gotas en los ojos
*/

        this.listaDeFechas.push({
            fecha: "2019-09-22 02:10", titulo: "Viaje a Chile", id: "viajeachile",
            year: 2019,
            mes: 9,
            dia: 22,
            hora: 23,
            minuto: 43,
            segundo: 0,
            pasado: false
        });
        this.listaDeFechas.push({
            fecha: "2019-09-13 23:43", titulo: "Viaje a Perú", id: "viajeaperu",
            year: 2019,
            mes: 9,
            dia: 13,
            hora: 23,
            minuto: 43,
            segundo: 0,
            pasado: false
        });
        this.listaDeFechas.push({
            fecha: "2019-08-24 09:00", titulo: "Reny ya puede buscar empleo", id: "ijtg845",
            year: 2019,
            mes: 8,
            dia: 24,
            hora: 9,
            minuto: 0,
            segundo: 0,
            pasado: false
        });
        this.listaDeFechas.push({fecha: "2019-05-27 09:00", titulo: "Empleo en 3it", id: "donb95",
            year: 2019,
            mes: 5,
            dia: 27,
            hora: 9,
            minuto: 0,
            segundo: 0,
            pasado: false
        });
        this.listaDeFechas.push({fecha: "2016-10-19 00:00", titulo: "Llegada a Chile", id: "donb956",
            year: 2016,
            mes: 10,
            dia: 19,
            hora: 0,
            minuto: 0,
            segundo: 0,
            pasado: false
        });
        this.listaDeFechas.push({fecha: "2021-01-01 00:00", titulo: "Fecha esperada", id: "zonbz5",
            year: 2021,
            mes: 1,
            dia: 1,
            hora: 0,
            minuto: 0,
            segundo: 0,
            pasado: false
        });
        this.listaDeFechas.push({fecha: "2022-07-01 20:55", titulo: "Aplicacion para vender mariposas digitales", id: "cualquf4",
            year: 2022,
            mes: 7,
            dia: 1,
            hora: 20,
            minuto: 55,
            segundo: 0,
            pasado: false
        });

        this.listaDeFechas.push({fecha: "2019-09-13 23:43", titulo: "Viaje a Perú", id: "inb95",
            year: 2019,
            mes: 9,
            dia: 13,
            hora: 23,
            minuto: 43,
            segundo: 0,
            pasado: false
        });

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
            return element.titulo.toLowerCase().includes(vm.palabraDeBusqueda.toLowerCase()) ||  element.fecha.includes(vm.palabraDeBusqueda) 
        });
    }

    mostarDetalle(entrada): void
    {
        console.log("");
        console.log(" ----------- mostarDetalle ----------- ");
        console.log(entrada);
        console.log(" ----------- mostarDetalle ----------- ");
        console.log("");
    }


}
