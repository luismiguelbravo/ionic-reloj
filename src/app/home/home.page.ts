import { Component } from '@angular/core';
import * as moment from 'moment';
import { AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Entrada } from '../Entrada';

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

    constructor(public alertController: AlertController, private storage: Storage) {}

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
            this.listaDeFechas.sort(
                function(a,b) 
                {
                    const fechaA = new Date(a.fecha)
                    const fechaB = new Date(b.fecha)
                    return fechaA.getTime() - fechaB.getTime()
                }
            );

        });

        this.ticTac();
    }

    ticTac(): void {
        setTimeout(() => 
        {
            this.calcularDiferencias();
            this.ticTac();
        }, 900);
    }

    guardar():void {

        if (this.horaDeEntrada === '' || this.fechaDeEntrada === '' || this.tituloDeEntrada === '')
        {
            this.errorAlGuardar();
        }
        else
        {

            let nuevaFecha = new Entrada();
            nuevaFecha.fecha = moment(
                this.fechaDeEntrada.substring(0,10) + ' ' + this.horaDeEntrada.substring(11, 16),
                'YYYY-MM-DD HH:mm:ss'
            ).toDate();
            //nuevaFecha.fecha = new Date(this.fechaDeEntrada + ' ' + this.horaDeEntrada);
            nuevaFecha.titulo = this.tituloDeEntrada;
            nuevaFecha.id = Math.random().toString(36).substring(7);

            this.listaDeFechas.push(nuevaFecha);
            this.storage.set('listaDeFechas', this.listaDeFechas);
            this.exitoAlguardar();
        }
    }

    calcularDiferencias(): void {
        this.fechaDeHoy = moment()
        this.diferenciaEnYears = this.finalDeLaEspera.diff(this.fechaDeHoy, 'years')
        this.fechaDeHoy.add(this.diferenciaEnYears, 'years')

        this.diferenciaEnMeses = this.finalDeLaEspera.diff(this.fechaDeHoy, 'months')
        this.fechaDeHoy.add(this.diferenciaEnMeses, 'months')

        this.diferenciaEnDias = this.finalDeLaEspera.diff(this.fechaDeHoy, 'days')
        this.fechaDeHoy.add(this.diferenciaEnDias, 'days')

        this.diferenciaEnHoras = this.finalDeLaEspera.diff(this.fechaDeHoy, 'hours')
        this.fechaDeHoy.add(this.diferenciaEnHoras, 'hours')

        this.diferenciaEnMinutos = this.finalDeLaEspera.diff(this.fechaDeHoy, 'minutes')
        this.fechaDeHoy.add(this.diferenciaEnMinutos, 'minutes')

        this.diferenciaEnSegundos = this.finalDeLaEspera.diff(this.fechaDeHoy, 'seconds')
    }

}
