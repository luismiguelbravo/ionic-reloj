import { Component } from '@angular/core';
import * as moment from 'moment';
import { AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Entrada } from '../Entrada';
import { ContadorService } from '../commons/contador.service'

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
    tituloDeEntrada = 'Fecha esperada';

    mostrarFormulario = false;

    constructor(public alertController: AlertController, private storage: Storage,
        public contadorService: ContadorService) {}

    async exitoAlguardar() {

        const alert = await this.alertController.create({
            header: 'Éxito',
            subHeader: '',
            message: 'Fecha guardada correctamente.',
            buttons: ['OK']
        });
        await alert.present();
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

        await alert.present();
    }


    ngOnInit() {
        this.storage.get('listaDeFechas').then((val) => {
            this.listaDeFechas = val;
            if (val === null) {
                this.listaDeFechas = [];
            }
            console.log(this.listaDeFechas)
            this.listaDeFechas = this.listaDeFechas.sort(
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
            this.contadorService.iniciarMovimiento();
        });
    }

    usarSemilla():void {
        console.log("usarSemilla");
        this.listaDeFechas.push({fecha: "2016-10-19 00:00", titulo: "Llegada a Chile", id: "donb95"});
        this.listaDeFechas.push({fecha: "2019-05-11 02:41", titulo: "Ultima vez que fume", id: "dopb95"});
        this.listaDeFechas.push({fecha: "2021-01-01 00:00", titulo: "Fecha esperada", id: "donby5"});
        this.storage.set('listaDeFechas', this.listaDeFechas);
        this.exitoAlguardar();
    }

    guardar():void {

        if (this.horaDeEntrada === '' || this.fechaDeEntrada === '' || this.tituloDeEntrada === '')
        {
            this.errorAlGuardar();
        }
        else
        {
            let nuevaFecha = new Entrada();
            nuevaFecha.fecha = this.fechaDeEntrada.substring(0,10) + ' ' + this.horaDeEntrada.substring(11, 16);
            nuevaFecha.titulo = this.tituloDeEntrada;
            nuevaFecha.id = Math.random().toString(36).substring(7);
            this.listaDeFechas.push(nuevaFecha);
            this.storage.set('listaDeFechas', this.listaDeFechas);
            this.exitoAlguardar();
        }
    }

}
