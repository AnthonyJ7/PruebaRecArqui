import { Injectable } from '@angular/core';
import { AforoRecord } from '../../shared/models/aforo-record.model';
import { AforoRepository } from './aforo.repository';

@Injectable()
export class AforoService {
  constructor(private repository: AforoRepository) {}

  getRecords(): AforoRecord[] {
    return this.repository.getAll();
  }

  createRecord(input: Omit<AforoRecord, 'actualizadoEn'>): void {
    this.repository.add({
      ...input,
      actualizadoEn: new Date().toISOString()
    });
  }

  updateOccupancy(id: string, ocupacionActual: number): void {
    const existing = this.repository.getAll().find((item) => item.id === id);
    if (!existing) {
      return;
    }

    this.repository.update({
      ...existing,
      ocupacionActual,
      actualizadoEn: new Date().toISOString()
    });
  }
}
