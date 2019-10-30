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

import { LocalNotifications } from '@ionic-native/local-notifications/ngx';

import { Router, ActivatedRoute } from '@angular/router';

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
    listaDeFechas : Entrada[] = [];

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
        private localNotifications: LocalNotifications,
        private router: Router,
        private activatedRoute: ActivatedRoute

    ) { 
        activatedRoute.queryParams.subscribe((val) => {
            if (typeof val.titulo === "undefined")
            {
                this.storage.get('listaDeFechas').then((val) => {
                    this.listaDeFechas = val
                    if (val === null) {
                        this.listaDeFechas = []
                        // vm.usarSemilla()
                    }
                    // console.log(this.listaDeFechas)
                    this.listaDeFechas = this.listaDeFechas.sort(
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

                    this.listaDeFechas.forEach(function(entrada) {
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
                    this.listaFiltrada = this.listaDeFechas
                    this.contadorService.iniciarMovimiento()

                });
                // preguntar por el idioma seleccionado
                this.storage.get('miIdioma').then((miIdioma) => {
                    if (miIdioma === null){
                        // establezco por defecto el idioma ingles
                        this.miIdioma = this.idiomaService.get_idioma_por_defecto()
                        this.idiomaService.seleccionar_idioma(this.miIdioma)
                        this.seleccionarIdioma()
                    }
                    else{
                        this.idiomaService.seleccionar_idioma(miIdioma);
                        this.miIdioma = miIdioma;
                    }
                });
            }
            else
            {
                // seleccionar el idioma indicado por el copartidor
                this.miIdioma = this.idiomaService.get_idioma_by_indice(Number(val.idioma));
                console.log("")
                console.log(">>----> this.miIdioma <----<< ")
                console.log(this.miIdioma)
                console.log(">>----> this.miIdioma <----<< ")
                console.log("")
                this.storage.set('miIdioma', this.miIdioma);
                this.idiomaService.seleccionar_idioma(this.miIdioma);
                // crear una entrada
                let nuevaFecha = new Entrada();
                nuevaFecha.fecha = val.fecha
                nuevaFecha.titulo = val.titulo
                nuevaFecha.year = Number(val.year)
                nuevaFecha.mes = Number(val.mes)
                nuevaFecha.dia = Number(val.dia)
                nuevaFecha.hora = Number(val.hora)
                nuevaFecha.minuto = Number(val.minuto)
                nuevaFecha.segundo = Number(val.segundo)

                nuevaFecha.year_de_creacion = Number(val.year_de_creacion)
                nuevaFecha.mes_de_creacion = Number(val.mes_de_creacion)
                nuevaFecha.dia_de_creacion = Number(val.dia_de_creacion)
                nuevaFecha.hora_de_creacion = Number(val.hora_de_creacion)
                nuevaFecha.minuto_de_creacion = Number(val.minuto_de_creacion)
                nuevaFecha.segundo_de_creacion = Number(val.segundo_de_creacion)
                nuevaFecha.pasado = val.pasado == "true"
                nuevaFecha.id = Math.round(Math.random()  * 10000000000000000)

                // this.listaDeFechas.push(nuevaFecha);
                // this.listaDeFechas = this.listaDeFechas.sort(function(a,b){
                //     if( a.fecha < b.fecha) {return 1;}
                //     if( a.fecha > b.fecha) {return -1;}
                //     return 0;
                // })
                // this.listaFiltrada = this.listaDeFechas 
                // this.storage.set('listaDeFechas', this.listaDeFechas);
                // console.log(" === this.listaDeFechas ===");
                // console.log(this.listaDeFechas)
                // this.contadorService.iniciarMovimiento()
                let fecha_duplicada = false;
                this.storage.get('listaDeFechas').then(val => {
                    this.listaDeFechas = val
                    
                    if (val === null) {
                        this.listaDeFechas = []
                        this.listaDeFechas.push(nuevaFecha);
                    }
                    else
                    {
                        let indice = 0;
                        while(indice < this.listaDeFechas.length) {
                            if (
                                nuevaFecha.fecha === this.listaDeFechas[indice].fecha &&
                                nuevaFecha.titulo === this.listaDeFechas[indice].titulo &&
                                nuevaFecha.year === this.listaDeFechas[indice].year &&
                                nuevaFecha.mes === this.listaDeFechas[indice].mes &&
                                nuevaFecha.dia === this.listaDeFechas[indice].dia &&
                                nuevaFecha.hora === this.listaDeFechas[indice].hora &&
                                nuevaFecha.minuto === this.listaDeFechas[indice].minuto &&
                                nuevaFecha.segundo === this.listaDeFechas[indice].segundo &&
                                nuevaFecha.year_de_creacion === this.listaDeFechas[indice].year_de_creacion &&
                                nuevaFecha.mes_de_creacion === this.listaDeFechas[indice].mes_de_creacion &&
                                nuevaFecha.dia_de_creacion === this.listaDeFechas[indice].dia_de_creacion &&
                                nuevaFecha.hora_de_creacion === this.listaDeFechas[indice].hora_de_creacion &&
                                nuevaFecha.minuto_de_creacion === this.listaDeFechas[indice].minuto_de_creacion &&
                                nuevaFecha.segundo_de_creacion === this.listaDeFechas[indice].segundo_de_creacion
                            ) {
                                nuevaFecha.id = this.listaDeFechas[indice].id
                                fecha_duplicada = true
                                break
                            }
                            indice++
                        }
                        if (fecha_duplicada === false) {
                            this.listaDeFechas.push(nuevaFecha);
                        }

                        this.listaDeFechas = this.listaDeFechas.sort(
                            function(a,b) 
                            {
                                const fechaA = new Date(a.fecha)
                                const fechaB = new Date(b.fecha)
                                return fechaB.getTime() - fechaA.getTime()
                            }
                        );
                    }
                    this.storage.set('listaDeFechas', this.listaDeFechas);
                    /*
                        se crea un reloj unico que activa a todos los detalles
                        esto lo hice para evitar terner un hilo con reloj contador para cada proceso
                        debido a que cuando tenga mas de 3000 fechas tendria mas de 3000 segunderos activados independientes
                        de esta manera, al tener 3000 fechas, tengo solo un segundero que las mueve todas

                        // ahora voy a activar un hilo del reloj, solo cuando se abre el detalle de una fecha, 
                        esto para proteger el consumo del procesador.
                    */
                    this.listaFiltrada = this.listaDeFechas
                    this.contadorService.iniciarMovimiento()
                    
                    setTimeout(() => {
                        // Hacer el scroll es muy inconveniente
                        // se deja comentado para evitar repetir
                        this.bajalo_para_aca(nuevaFecha.id)
                    }, 1000);

                });
            }
        });


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
          header: vm.miIdioma['order'],
          buttons: [{
            text: vm.miIdioma['ascending order'],
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
            text: vm.miIdioma['descending order'],
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
            header: vm.miIdioma.success,
            subHeader: '',
            message: vm.miIdioma["event saved successfully"],
            buttons: [vm.miIdioma.accept]
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
            buttons: [{ text: this.miIdioma['accept'] }]
        });
        await alert.present();
    }

    async exitoAlCambiarDeIdioma() {

        const alert = await this.alertController.create({
            header: this.miIdioma['success'],
            subHeader: '',
            message: this.miIdioma['welcome'],
            buttons: [{ text: this.miIdioma['accept'] }]
        });
        await alert.present();
    }

    async intentarEliminar(id) {
        let vm = this;
        const alert = await this.alertController.create({
            header: vm.miIdioma['warning'],
            message: vm.miIdioma['this action cannot be reversed'],
            buttons: [
            {
                text: vm.miIdioma['cancel'],
                role: 'cancel',
                cssClass: 'secondary',
                handler: (blah) => {
                    // console.log('Confirm Cancel: blah');
                }
            }, {
                text: vm.miIdioma['delete'],
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
        vm.contadorService.setIdSeleccionado(id + "");
        let elemento = document.getElementById(id + "");
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
        this.notificacionClickeada = 'ngOnInit()'
        // me suscribo al evento click en la notificacion
        this.localNotifications.on('click').subscribe(res => {
            this.notificacionClickeada = res.data.id
            setTimeout(() => {
                // Hacer el scroll es muy inconveniente
                // se deja comentado para evitar repetir
                this.bajalo_para_aca(this.notificacionClickeada)
            }, 1000);
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
               // mostrar alerta con mensaje de bienvenida
               this.exitoAlCambiarDeIdioma()

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

        vm.palabraDeBusqueda = "";
        setTimeout(() => {
            // Hacer el scroll es muy inconveniente
            // se deja comentado para evitar repetir
            this.bajalo_para_aca(nuevaFecha.id)
        }, 1000);
    }

    buscar():void {
        let vm = this
        if (vm.palabraDeBusqueda === "usar semilla lmb")
        {
            vm.usarSemilla();
            vm.palabraDeBusqueda = "";
        }
        if (vm.palabraDeBusqueda === "borrar todo e2e"){
            vm.palabraDeBusqueda = "";
            vm.listaFiltrada = vm.listaDeFechas = []
            this.storage.set('listaDeFechas', this.listaDeFechas);
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

    cancelarBusqueda():void{
        this.palabraDeBusqueda = ""
        this.buscar()
        this.focusOnBuscar()
    }

    focusOnBuscar():void {
        let elemento = document.getElementById("palabraDeBusqueda").focus()
    }

}
