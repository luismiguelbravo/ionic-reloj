import { Component } from '@angular/core';
import * as moment from 'moment-timezone';
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
    miIdioma = null

    constructor(
        public alertController: AlertController,
        private storage: Storage,
        public contadorService: ContadorService,
        private orderPipe: OrderPipe,
        public actionSheetController: ActionSheetController,
        public modalController: ModalController,
        public idiomaService: IdiomaService
    ) { }


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
                vm.guardar(data)
            }
        }
    }

    /*
        mostrar el modal, 
        pasarle como parametro la vaina que estoy editando
    */
    async editar(entrada){
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
                let index = 0;
                while(index < vm.listaDeFechas.length) {
                    if (vm.listaDeFechas[index].id === entrada.id){
                        break;
                    }
                    index++
                }
                vm.listaDeFechas[index].titulo = data.titulo
                vm.listaDeFechas[index].fecha = data.fecha_string
                vm.listaDeFechas[index].year = data.year
                vm.listaDeFechas[index].mes = data.mes
                vm.listaDeFechas[index].dia = data.dia
                vm.listaDeFechas[index].hora = data.hora
                vm.listaDeFechas[index].minuto = data.minuto
                vm.listaDeFechas[index].segundo = data.segundo
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
            header: vm.miIdioma.Success,
            subHeader: '',
            message: vm.miIdioma.Event_saved_successfully,
            buttons: [vm.miIdioma.Accept]
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
                    // console.log('Confirm Cancel: blah');
                }
            }, {
                text: vm.miIdioma['Delete'],
                handler: () => {
                // console.log('Confirm Okay');
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

    /*
        el croll ha resultado ser muy inconveniente, 
        lo dejo comentado para no repetirlo */
    bajalo_para_aca(id) {
      let vm = this;
      vm.contadorService.setIdSeleccionado(id);
      let el = document.getElementById(id);
      el.scrollIntoView();
    }    

    seleccionar_reloj(id) {
      let vm = this;
      vm.contadorService.setIdSeleccionado(id);
      let el = document.getElementById(id);
      el.scrollIntoView();
    }

    get_id_Seleccionado()
    {
        return this.contadorService.getIdSeleccionado()
    }

    debug()
    {
        console.log("")
        console.log(" -------------- TMZ -------------- ")
        console.log("moment.tz.guess() " + moment.tz.guess())
        console.log(" -------------- TMZ -------------- ")
        console.log("")
    }

    ngOnInit() {

        let vm = this;
        /*
        setTimeout(() => {
            // Hacer el scroll es muy inconveniente
            // se deja comentado para evitar repetir
            vm.bajalo_para_aca('55')
        }, 1000);*/
        
        vm.storage.get('listaDeFechas').then((val) => {
            vm.listaDeFechas = val
            if (val === null) {
                vm.listaDeFechas = []
                vm.usarSemilla()
            }
            // console.log(this.listaDeFechas)
            vm.listaDeFechas = this.listaDeFechas.sort(
                function(a,b) 
                {
                    const fechaA = new Date(a.fecha)
                    const fechaB = new Date(b.fecha)
                    return fechaB.getTime() - fechaA.getTime()
                }
            );
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

                // recorrer toda esta vaina para ver que esta en el pasado
                // verifico el caso de que exista alguna fecha que esta en el paso y la marco
                if ( right_now > fecha_auxiliar && entrada.pasado === false ) {
                   entrada.pasado = true;
                   alguna_modificacion = true;
                }
                
            });

            if (alguna_modificacion) {
                this.storage.set('listaDeFechas', this.listaDeFechas);
            }

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
            if (miIdioma === null){
                // establezco por defecto el idioma ingles
                vm.miIdioma = vm.idiomaService.get_idioma_por_defecto()
                vm.idiomaService.seleccionar_idioma(vm.miIdioma)
                vm.seleccionarIdioma()
            }
            else{
                vm.idiomaService.seleccionar_idioma(miIdioma);
                vm.miIdioma = miIdioma;
            }
        });
    }

    async seleccionarIdioma(){
        // mostrar el modal, 
        let vm = this;
        const modal = await this.modalController.create({
            component: BienvenidaPage
        });

        modal.present();
        // Get returned data
        const { data } = await modal.onWillDismiss();
        
        if (typeof data !== "undefined")
        {
            if (typeof data.guardar === "undefined" || data.guardar !== false)
            {
               this.storage.set('miIdioma', data.ididomaSeleccionado);
               this.idiomaService.seleccionar_idioma(data.ididomaSeleccionado);
               vm.miIdioma = data.ididomaSeleccionado;
            }
        }
    }

    usarSemilla():void {

        let vm = this;
        let ahora = moment();

        vm.miIdioma = vm.idiomaService.get_idioma_por_defecto()
        vm.idiomaService.seleccionar_idioma(vm.miIdioma)

        // console.log("usarSemilla");
        this.listaDeFechas.push({
            fecha: "2020-10-19 00:00:00", titulo: "Cumpleaño 2020", id: "cumple2020",
            year: 2020,
            mes: 9,
            dia: 19,
            hora: 0,
            minuto: 0,
            segundo: 0,
            pasado: false,
            year_de_creacion: ahora.year(),
            mes_de_creacion: ahora.month(),
            dia_de_creacion: ahora.date(),
            hora_de_creacion: ahora.hour(),
            minuto_de_creacion: ahora.minute(),
            segundo_de_creacion: ahora.second()
        });
        this.listaDeFechas.push({
            fecha: "2020-10-01 00:00:00", titulo: "Regreso de Camila Daniela Garcia Valle a Chile", id: "danica202",
            year: 2020,
            mes: 9,
            dia: 1,
            hora: 0,
            minuto: 0,
            segundo: 0,
            pasado: false,
            year_de_creacion: 2018,
            mes_de_creacion: 11,
            dia_de_creacion: 27,
            hora_de_creacion: 20,
            minuto_de_creacion: 0,
            segundo_de_creacion: 0
        });
        this.listaDeFechas.push({
            fecha: "2019-10-19 00:00:00", titulo: "Cumpleaño 2019", id: "cumple2019",
            year: 2019,
            mes: 9,
            dia: 19,
            hora: 0,
            minuto: 0,
            segundo: 0,
            pasado: false,
            year_de_creacion: 2018,
            mes_de_creacion: 9,
            dia_de_creacion: 19,
            hora_de_creacion: 0,
            minuto_de_creacion: 0,
            segundo_de_creacion: 0
        });
        this.listaDeFechas.push({fecha: "2019-05-27 09:00:00", titulo: "Empleo en 3it", id: "donb95",
            year: 2019,
            mes: 4,
            dia: 27,
            hora: 9,
            minuto: 0,
            segundo: 0,
            pasado: false,
            year_de_creacion: ahora.year(),
            mes_de_creacion: ahora.month(),
            dia_de_creacion: ahora.date(),
            hora_de_creacion: ahora.hour(),
            minuto_de_creacion: ahora.minute(),
            segundo_de_creacion: ahora.second()
        });
        this.listaDeFechas.push({fecha: "2016-10-19 00:00:00", titulo: "Llegada a Chile", id: "donb956",
            year: 2016,
            mes: 9,
            dia: 19,
            hora: 0,
            minuto: 0,
            segundo: 0,
            pasado: false,
            year_de_creacion: ahora.year(),
            mes_de_creacion: ahora.month(),
            dia_de_creacion: ahora.date(),
            hora_de_creacion: ahora.hour(),
            minuto_de_creacion: ahora.minute(),
            segundo_de_creacion: ahora.second()
        });
        /*
        this.listaDeFechas.push({fecha: "2019-09-29 00:00:00", titulo: "Cumpleaños Javiera Anais", id: "19",
            year: 2019,
            mes: 9,
            dia: 29,
            hora: 0,
            minuto: 0,
            segundo: 0,
            pasado: false
        });*/

        this.listaDeFechas.push({fecha: "2019-09-12 22:30:00", titulo: "Deje de fumar y beber", id: "Reunión Postulantes",
            year: 2019,
            mes: 8,
            dia: 12,
            hora: 20,
            minuto: 0,
            segundo: 0,
            pasado: false,
            year_de_creacion: ahora.year(),
            mes_de_creacion: ahora.month(),
            dia_de_creacion: ahora.date(),
            hora_de_creacion: ahora.hour(),
            minuto_de_creacion: ahora.minute(),
            segundo_de_creacion: ahora.second()
        });



        this.storage.set('listaDeFechas', this.listaDeFechas);
        this.exitoAlguardar();
    }

    guardar(datos_para_guardar):void {
        let vm = this
        let ahora = moment()

        let nuevaFecha = new Entrada();
        nuevaFecha.fecha = datos_para_guardar.fecha_string;
        nuevaFecha.titulo = datos_para_guardar.titulo;
        nuevaFecha.year = datos_para_guardar.year        
        nuevaFecha.mes = datos_para_guardar.mes        
        nuevaFecha.dia = datos_para_guardar.dia
        nuevaFecha.hora = datos_para_guardar.hora;
        nuevaFecha.minuto = datos_para_guardar.minuto
        nuevaFecha.segundo = datos_para_guardar.segundo

        nuevaFecha.year_de_creacion = ahora.year()
        nuevaFecha.mes_de_creacion = ahora.month()
        nuevaFecha.dia_de_creacion = ahora.date()
        nuevaFecha.hora_de_creacion = ahora.hour()
        nuevaFecha.minuto_de_creacion = ahora.minute()
        nuevaFecha.segundo_de_creacion = ahora.second()


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

    buscar():void {
        let vm = this
        vm.listaFiltrada = vm.listaDeFechas.filter(function(element) {
            return element.titulo.toLowerCase().includes(vm.palabraDeBusqueda.toLowerCase()) ||  element.fecha.includes(vm.palabraDeBusqueda) 
        });
    }

}
