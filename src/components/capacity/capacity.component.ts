
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common'; // Usually not needed in v19 if full standalone but helpful for explicit pipe access sometimes
import { DataService, Square } from '../../services/data.service';
import { AiService } from '../../services/ai.service';

@Component({
  selector: 'app-capacity',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-gray-800">Control de Aforo (Plazas)</h2>
      <button class="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium">
        <i class="fas fa-plus mr-2"></i> Nueva Plaza
      </button>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      @for (square of dataService.squares(); track square.id) {
        <div class="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
          <div class="p-6">
            <div class="flex justify-between items-start mb-4">
              <div>
                <h3 class="text-xl font-bold text-gray-800">{{ square.name }}</h3>
                <p class="text-sm text-gray-500">ID: {{ square.id }}</p>
              </div>
              <span [class]="getStatusClass(square.status) + ' px-3 py-1 rounded-full text-xs font-semibold'">
                {{ square.status | uppercase }}
              </span>
            </div>

            <!-- Progress Bar -->
            <div class="mb-4">
              <div class="flex justify-between text-sm mb-1">
                <span class="text-gray-600">Ocupación</span>
                <span class="font-bold">{{ square.currentOccupancy }} / {{ square.capacity }}</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2.5">
                <div class="h-2.5 rounded-full transition-all duration-500"
                     [style.width.%]="(square.currentOccupancy / square.capacity) * 100"
                     [class]="getBarClass(square.status)">
                </div>
              </div>
            </div>

            <!-- Controls -->
            <div class="flex gap-2 mb-4">
               <button (click)="adjustOccupancy(square, -10)" class="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-lg text-sm transition-colors">
                 <i class="fas fa-minus"></i> 10
               </button>
               <button (click)="adjustOccupancy(square, 10)" class="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-lg text-sm transition-colors">
                 <i class="fas fa-plus"></i> 10
               </button>
            </div>

            <!-- AI Action Plan -->
            @if (square.status === 'Critical' || square.status === 'Warning') {
              <div class="bg-orange-50 border border-orange-100 rounded-lg p-4 mt-4">
                <div class="flex items-center gap-2 text-orange-700 font-semibold mb-2">
                   <i class="fas fa-robot"></i> Recomendación AI
                </div>
                @if (aiPlans()[square.id]) {
                   <p class="text-sm text-gray-700 whitespace-pre-wrap">{{ aiPlans()[square.id] }}</p>
                } @else {
                   <button (click)="generatePlan(square)" class="text-xs bg-white border border-orange-200 text-orange-600 px-3 py-1 rounded shadow-sm hover:bg-orange-100">
                     Generar Plan de Contingencia
                   </button>
                }
              </div>
            }
          </div>
        </div>
      }
    </div>
  `
})
export class CapacityComponent {
  dataService = inject(DataService);
  aiService = inject(AiService);
  aiPlans = signal<Record<string, string>>({});

  getStatusClass(status: string): string {
    switch (status) {
      case 'Normal': return 'bg-green-100 text-green-700';
      case 'Warning': return 'bg-yellow-100 text-yellow-700';
      case 'Critical': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  }

  getBarClass(status: string): string {
    switch (status) {
      case 'Normal': return 'bg-green-500';
      case 'Warning': return 'bg-yellow-500';
      case 'Critical': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  }

  adjustOccupancy(square: Square, amount: number) {
    const newVal = Math.max(0, square.currentOccupancy + amount);
    this.dataService.updateOccupancy(square.id, newVal);
    // Reset plan if status changes to normal (handled by user logic mentally, but code just keeps existing plan until refresh)
  }

  async generatePlan(square: Square) {
    this.aiPlans.update(current => ({ ...current, [square.id]: 'Generando plan con Gemini...' }));
    const plan = await this.aiService.generateCrowdActionPlan(square.name, square.currentOccupancy, square.capacity);
    this.aiPlans.update(current => ({ ...current, [square.id]: plan }));
  }
}
