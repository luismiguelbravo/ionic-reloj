import { Component } from '@angular/core';
import * as moment from 'moment';


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

  ngOnInit() {
    this.ticTac();
  }

  ticTac(): void {
    setTimeout(() => {
        this.calcularDiferencias();
        this.ticTac();
    }, 900);
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
