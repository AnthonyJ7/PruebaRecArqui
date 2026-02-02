import { AforoRecord } from '../../shared/models/aforo-record.model';

export class AforoRepository {
  private records: AforoRecord[] = [
    {
      id: 'AF-001',
      plaza: 'Plaza Central',
      capacidad: 800,
      ocupacionActual: 250,
      actualizadoEn: new Date().toISOString()
    },
    
    {
      id: 'AF-002',
      plaza: 'Plaza Norte',
      capacidad: 500,
      ocupacionActual: 420,
      actualizadoEn: new Date().toISOString()
    }
  ];

  getAll(): AforoRecord[] {
    return [...this.records];
  }

  add(record: AforoRecord): void {
    this.records = [record, ...this.records];
  }

  update(record: AforoRecord): void {
    this.records = this.records.map((item) => (item.id === record.id ? record : item));
  }
}
