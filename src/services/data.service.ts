
import { Injectable, signal, computed } from '@angular/core';

export interface Square {
  id: string;
  name: string;
  capacity: number;
  currentOccupancy: number;
  status: 'Normal' | 'Warning' | 'Critical';
}

export interface Permit {
  id: string;
  applicant: string;
  businessType: string;
  locationId: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  description: string;
  riskAnalysis?: string;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  // State for Capacity Module (Aforo)
  readonly squares = signal<Square[]>([
    { id: '1', name: 'Plaza de Armas', capacity: 500, currentOccupancy: 120, status: 'Normal' },
    { id: '2', name: 'Parque de las Artes', capacity: 300, currentOccupancy: 280, status: 'Critical' },
    { id: '3', name: 'Mercado Central (Exterior)', capacity: 150, currentOccupancy: 100, status: 'Warning' }
  ]);

  // State for Permits Module (Permisos)
  readonly permits = signal<Permit[]>([
    { id: 'P-101', applicant: 'Juan Pérez', businessType: 'Comida Rápida', locationId: '1', status: 'Approved', description: 'Venta de choripanes y bebidas.' },
    { id: 'P-102', applicant: 'Maria Garcia', businessType: 'Artesanía', locationId: '2', status: 'Pending', description: 'Puesto de joyería hecha a mano.' },
    { id: 'P-103', applicant: 'Pedro López', businessType: 'Juegos Pirotécnicos', locationId: '1', status: 'Rejected', description: 'Venta de fuegos artificiales pequeños.' }
  ]);

  // Computed metrics
  readonly totalCapacity = computed(() => this.squares().reduce((acc, s) => acc + s.capacity, 0));
  readonly totalOccupancy = computed(() => this.squares().reduce((acc, s) => acc + s.currentOccupancy, 0));
  readonly occupancyPercentage = computed(() => {
    return this.totalCapacity() > 0 ? Math.round((this.totalOccupancy() / this.totalCapacity()) * 100) : 0;
  });

  readonly pendingPermitsCount = computed(() => this.permits().filter(p => p.status === 'Pending').length);

  updateOccupancy(id: string, newOccupancy: number) {
    this.squares.update(squares => squares.map(s => {
      if (s.id === id) {
        const ratio = newOccupancy / s.capacity;
        let status: 'Normal' | 'Warning' | 'Critical' = 'Normal';
        if (ratio >= 0.9) status = 'Critical';
        else if (ratio >= 0.75) status = 'Warning';
        
        return { ...s, currentOccupancy: newOccupancy, status };
      }
      return s;
    }));
  }

  addPermit(permit: Permit) {
    this.permits.update(prev => [...prev, permit]);
  }

  updatePermitStatus(id: string, status: 'Approved' | 'Rejected', analysis?: string) {
    this.permits.update(prev => prev.map(p => 
      p.id === id ? { ...p, status, riskAnalysis: analysis ? analysis : p.riskAnalysis } : p
    ));
  }
}
