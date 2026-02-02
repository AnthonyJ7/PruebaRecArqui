import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AforoRecord } from '../../shared/models/aforo-record.model';
import { AforoRepository } from './aforo.repository';
import { AforoService } from './aforo.service';

@Component({
  selector: 'app-aforo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './aforo.component.html',
  styleUrl: './aforo.component.scss',
  providers: [AforoRepository, AforoService]
})
export class AforoComponent {
  records: AforoRecord[] = [];
  nuevo = {
    id: '',
    plaza: '',
    capacidad: 0,
    ocupacionActual: 0
  };

  constructor(private service: AforoService) {
    this.loadRecords();
  }

  loadRecords(): void {
    this.records = this.service.getRecords();
  }

  get totalPlazas(): number {
    return this.records.length;
  }

  get totalCapacidad(): number {
    return this.records.reduce((acc, record) => acc + record.capacidad, 0);
  }

  get totalOcupacion(): number {
    return this.records.reduce((acc, record) => acc + record.ocupacionActual, 0);
  }

  get porcentajeGlobal(): number {
    return this.totalCapacidad === 0
      ? 0
      : Math.round((this.totalOcupacion / this.totalCapacidad) * 100);
  }

  addRecord(): void {
    if (!this.nuevo.id || !this.nuevo.plaza || this.nuevo.capacidad <= 0) {
      return;
    }

    this.service.createRecord({
      id: this.nuevo.id.trim(),
      plaza: this.nuevo.plaza.trim(),
      capacidad: this.nuevo.capacidad,
      ocupacionActual: this.nuevo.ocupacionActual
    });

    this.nuevo = {
      id: '',
      plaza: '',
      capacidad: 0,
      ocupacionActual: 0
    };

    this.loadRecords();
  }

  increase(record: AforoRecord): void {
    const updated = Math.min(record.capacidad, record.ocupacionActual + 1);
    this.service.updateOccupancy(record.id, updated);
    this.loadRecords();
  }

  decrease(record: AforoRecord): void {
    const updated = Math.max(0, record.ocupacionActual - 1);
    this.service.updateOccupancy(record.id, updated);
    this.loadRecords();
  }

  occupancyStatus(record: AforoRecord): string {
    const ratio = record.ocupacionActual / record.capacidad;
    if (ratio >= 0.9) {
      return 'Crítico';
    }
    if (ratio >= 0.7) {
      return 'Alerta';
    }
    return 'Normal';
  }
}
