
import { Component, inject, signal } from '@angular/core';
import { DataService, Permit } from '../../services/data.service';
import { AiService } from '../../services/ai.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-permits',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-gray-800">Permisos Comerciales</h2>
      <button (click)="showForm.set(true)" class="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium">
        <i class="fas fa-plus mr-2"></i> Nuevo Permiso
      </button>
    </div>

    @if (showForm()) {
      <div class="bg-white rounded-xl shadow-lg p-6 mb-8 border border-indigo-100">
        <h3 class="font-bold text-lg mb-4 text-gray-800">Solicitud de Permiso</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <input [(ngModel)]="newPermit.applicant" placeholder="Solicitante" class="p-2 border rounded bg-gray-50">
          <input [(ngModel)]="newPermit.businessType" placeholder="Tipo Negocio (ej. Comida)" class="p-2 border rounded bg-gray-50">
          <select [(ngModel)]="newPermit.locationId" class="p-2 border rounded bg-gray-50">
             @for (sq of dataService.squares(); track sq.id) {
               <option [value]="sq.id">{{ sq.name }}</option>
             }
          </select>
          <input [(ngModel)]="newPermit.description" placeholder="Descripción detallada" class="p-2 border rounded bg-gray-50">
        </div>
        <div class="flex justify-end gap-3">
          <button (click)="showForm.set(false)" class="text-gray-500 hover:text-gray-700">Cancelar</button>
          <button (click)="submitPermit()" class="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">Guardar</button>
        </div>
      </div>
    }

    <!-- Kanban-ish Board -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Pending -->
      <div class="space-y-4">
        <h3 class="font-bold text-gray-600 flex items-center gap-2">
          <div class="w-3 h-3 bg-yellow-400 rounded-full"></div> Pendientes
        </h3>
        @for (p of getPermitsByStatus('Pending'); track p.id) {
          <div class="bg-white p-4 rounded-lg shadow-sm border border-l-4 border-l-yellow-400 border-gray-100">
            <div class="flex justify-between mb-2">
              <span class="font-bold text-gray-800">{{ p.applicant }}</span>
              <span class="text-xs text-gray-400">{{ p.id }}</span>
            </div>
            <p class="text-sm text-gray-600 mb-2">{{ p.businessType }}</p>
            <p class="text-xs text-gray-500 italic mb-3">"{{ p.description }}"</p>
            
            @if (p.riskAnalysis) {
               <div class="bg-gray-50 p-2 rounded text-xs text-gray-600 mb-3 border border-gray-200">
                 <strong>Análisis AI:</strong> {{ p.riskAnalysis }}
               </div>
            } @else {
               <button (click)="analyzeRisk(p)" class="text-xs text-indigo-600 hover:underline mb-3 block">
                 <i class="fas fa-magic"></i> Analizar Riesgo con AI
               </button>
            }

            <div class="flex gap-2">
              <button (click)="approve(p.id)" class="flex-1 bg-green-50 text-green-700 text-xs py-1.5 rounded hover:bg-green-100">Aprobar</button>
              <button (click)="reject(p.id)" class="flex-1 bg-red-50 text-red-700 text-xs py-1.5 rounded hover:bg-red-100">Rechazar</button>
            </div>
          </div>
        }
      </div>

      <!-- Approved -->
      <div class="space-y-4">
        <h3 class="font-bold text-gray-600 flex items-center gap-2">
          <div class="w-3 h-3 bg-green-500 rounded-full"></div> Aprobados
        </h3>
        @for (p of getPermitsByStatus('Approved'); track p.id) {
          <div class="bg-white p-4 rounded-lg shadow-sm border border-l-4 border-l-green-500 border-gray-100 opacity-90">
             <div class="flex justify-between">
              <span class="font-bold text-gray-800">{{ p.applicant }}</span>
              <i class="fas fa-check-circle text-green-500"></i>
            </div>
            <p class="text-sm text-gray-600">{{ p.businessType }}</p>
          </div>
        }
      </div>

      <!-- Rejected -->
      <div class="space-y-4">
        <h3 class="font-bold text-gray-600 flex items-center gap-2">
          <div class="w-3 h-3 bg-red-500 rounded-full"></div> Rechazados
        </h3>
        @for (p of getPermitsByStatus('Rejected'); track p.id) {
          <div class="bg-white p-4 rounded-lg shadow-sm border border-l-4 border-l-red-500 border-gray-100 opacity-75">
             <div class="flex justify-between">
              <span class="font-bold text-gray-800">{{ p.applicant }}</span>
              <i class="fas fa-ban text-red-500"></i>
            </div>
            <p class="text-sm text-gray-600">{{ p.businessType }}</p>
          </div>
        }
      </div>

    </div>
  `
})
export class PermitsComponent {
  dataService = inject(DataService);
  aiService = inject(AiService);
  showForm = signal(false);
  
  newPermit = {
    applicant: '',
    businessType: '',
    locationId: '1',
    description: ''
  };

  getPermitsByStatus(status: string) {
    return this.dataService.permits().filter(p => p.status === status);
  }

  submitPermit() {
    this.dataService.addPermit({
      id: `P-${Math.floor(Math.random() * 1000)}`,
      applicant: this.newPermit.applicant,
      businessType: this.newPermit.businessType,
      locationId: this.newPermit.locationId,
      description: this.newPermit.description,
      status: 'Pending'
    });
    this.showForm.set(false);
    this.newPermit = { applicant: '', businessType: '', locationId: '1', description: '' };
  }

  approve(id: string) {
    this.dataService.updatePermitStatus(id, 'Approved');
  }

  reject(id: string) {
    this.dataService.updatePermitStatus(id, 'Rejected');
  }

  async analyzeRisk(p: Permit) {
    // Optimistic update with loading state could be better, but simple is fine
    this.dataService.updatePermitStatus(p.id, 'Pending', 'Analizando...'); 
    const analysis = await this.aiService.analyzePermitRisk(p.description, p.businessType);
    this.dataService.updatePermitStatus(p.id, 'Pending', analysis);
  }
}
