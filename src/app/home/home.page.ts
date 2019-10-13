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

import { Platform } from '@ionic/angular';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';

import { AdMobFree, AdMobFreeBannerConfig } from '@ionic-native/admob-free/ngx';

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

    notificacionClickeada = null;
    plataforma_desktop = null;

    constructor(
        public alertController: AlertController,
        private storage: Storage,
        public contadorService: ContadorService,
        private orderPipe: OrderPipe,
        public actionSheetController: ActionSheetController,
        public modalController: ModalController,
        public idiomaService: IdiomaService,
        private platform: Platform,
        private localNotifications: LocalNotifications,
        private admobFree: AdMobFree

    ) {
        console.log("")
        console.log("")
        console.log("")
        console.log(" ============ CONSTRUCTOR ============ ")
        console.log(" ============ CONSTRUCTOR ============ ")
        console.log(" ============ CONSTRUCTOR ============ ")
        console.log("")
        console.log("")
        console.log("")

        const bannerConfig: AdMobFreeBannerConfig = {
            // add your config here
            // for the sake of this example we will just use the test config
            isTesting: true,
            autoShow: true,
            id: "ca-app-pub-7351123315567146/3855383714"
        };
        admobFree.banner.config(bannerConfig);

        platform.ready().then(() => {
            admobFree.banner.prepare()
                .then(() => {
                // banner Ad is ready
                // if we set autoShow to false, then we will need to call the show method here
                    console.log("")
                    console.log("")
                    console.log("")
                    console.log(" ============ DISPARANDO BANNER ============ ")
                    console.log(" ============ DISPARANDO BANNER ============ ")
                    console.log(" ============ DISPARANDO BANNER ============ ")
                    console.log("")
                    console.log("")
                    console.log("")    

                })
                .catch(error => {
                    console.log("")
                    console.log(" ============ error al soltar el banner ============ ")
                    console.log(JSON.stringify(error))
                    console.log(" ============ error al soltar el banner ============ ")
                    console.log("")
            });                
        })

    }

    async mostrarFomulario() {
        const vm = this;
        const modal = await this.modalController.create({ component: AgregarPage });
        modal.present();
        // Get returned data
        const { data } = await modal.onWillDismiss();

        if (typeof data !== 'undefined') {
            if (data.guardar ) {
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

                // **** actualizar notificacion
                console.log("")
                console.log(" ============ editando la notificacion ============ ")
                console.log("")
                this.editarNotificacion(vm.listaDeFechas[index])
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
            message: vm.miIdioma['This action cannot be reversed'],
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
                            let right_now = moment();
                            let fecha_auxiliar = moment(
                                {
                                    years: this.listaDeFechas[i].year,
                                    months: this.listaDeFechas[i].mes,
                                    days: this.listaDeFechas[i].dia,
                                    hours: this.listaDeFechas[i].hora,
                                    minutes: this.listaDeFechas[i].minuto,
                                    seconds: this.listaDeFechas[i].segundo 
                                });

                            if ( right_now < fecha_auxiliar ) {
                                console.log("")
                                console.log(" ============ eliminando la notificacion ============ ")
                                console.log("")                                
                                this.eliminarNotificacion(id)
                            }
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
        let elemento = document.getElementById(id);
        elemento.style.border = "4px solid white"
        elemento.scrollIntoView();
        setTimeout(() => {
            elemento.style.border = "none"
        }, 2000);
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
                // vm.usarSemilla()
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

        this.notificacionClickeada = 'ngOnInit()'
        // me suscribo al evento click en la notificacion
        this.localNotifications.on('click').subscribe(res => {
            this.notificacionClickeada = res.data.id
            this.bajalo_para_aca(res.data.id)
        })
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

        // console.log("usarSemilla");
        this.listaDeFechas.push({
            fecha: "2020-10-19 00:00:00", titulo: "Cumpleaño 2020", id: 1,
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
            fecha: "2020-10-01 00:00:00", titulo: "Regreso de Camila Daniela Garcia Valle a Chile", id: 2,
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
            fecha: "2019-10-19 00:00:00", titulo: "Cumpleaño 2019", id: 3,
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
        this.listaDeFechas.push({fecha: "2019-05-27 09:00:00", titulo: "Empleo en 3it", id: 4,
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
        this.listaDeFechas.push({fecha: "2016-10-19 00:00:00", titulo: "Llegada a Chile", id: 5,
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

        this.listaDeFechas.push({fecha: "2019-09-12 22:30:00", titulo: "Deje de fumar y beber", id: 6,
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


        nuevaFecha.id = Math.round(Math.random()  * 10000000000000000)

        vm.listaDeFechas.push(nuevaFecha);
        vm.listaDeFechas = vm.listaDeFechas.sort(function(a,b){
            if( a.fecha < b.fecha) {return 1;}
            if( a.fecha > b.fecha) {return -1;}
            return 0;
        })
        this.listaFiltrada = this.listaDeFechas 
        vm.storage.set('listaDeFechas', vm.listaDeFechas);



        // **** crear notificacion
        console.log("")
        console.log(" ============ crear la notificacion ============ ")
        console.log("")
        this.crearNotificacion(nuevaFecha)

        vm.exitoAlguardar();
    }

    buscar():void {
        let vm = this
        if (vm.palabraDeBusqueda === "usar semilla lmb")
        {
            vm.usarSemilla();
            vm.palabraDeBusqueda = "";
        }
        vm.listaFiltrada = vm.listaDeFechas.filter(function(element) {
            return element.titulo.toLowerCase().includes(vm.palabraDeBusqueda.toLowerCase()) ||  element.fecha.includes(vm.palabraDeBusqueda) 
        });
    }

    crearNotificacion(entrada: Entrada):void{
        let fecha_de_notificacion = moment({
            years:   entrada.year,
            months:  entrada.mes,
            date:    entrada.dia,
            hours:   entrada.hora,
            minutes: entrada.minuto,
            seconds: entrada.segundo
        })

        this.localNotifications.schedule({
            id: entrada.id,
            title: entrada.titulo,
            text: '',
            data: {id: entrada.id},
            trigger: {at: fecha_de_notificacion.toDate()}
        })
    }

    editarNotificacion(entrada:Entrada):void{
        // eliminar notificacion anterior
        // this.eliminarNotificacion(entrada.id)
        // crear notificacion nueva
        this.crearNotificacion(entrada);
    }

    eliminarNotificacion(id:number):void {
        // como no puedo eliminar, voy a enviar la notificacion al pasado, asi no sonara
        this.localNotifications.schedule({
            id: id,
            title: '',
            text: '',
            trigger: {at: this.fechaDeHoy.toDate()}
        })
    }

}
