import { Component, inject, computed } from '@angular/core';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  template: `
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <!-- Card 1: Total Capacity -->
      <div class="bg-white p-6 rounded-xl shadow-sm border-l-4 border-indigo-500">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-sm font-medium text-gray-500">Ocupación Global</p>
            <h3 class="text-3xl font-bold text-gray-800 mt-2">{{ dataService.occupancyPercentage() }}%</h3>
          </div>
          <div class="p-2 bg-indigo-50 rounded-lg text-indigo-600">
            <i class="fas fa-users fa-lg"></i>
          </div>
        </div>
        <p class="text-xs text-gray-400 mt-4">{{ dataService.totalOccupancy() }} / {{ dataService.totalCapacity() }} personas</p>
      </div>

      <!-- Card 2: Active Alerts -->
      <div class="bg-white p-6 rounded-xl shadow-sm border-l-4 border-red-500">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-sm font-medium text-gray-500">Plazas Críticas</p>
            <h3 class="text-3xl font-bold text-gray-800 mt-2">
              {{ criticalCount() }}
            </h3>
          </div>
          <div class="p-2 bg-red-50 rounded-lg text-red-600">
            <i class="fas fa-exclamation-triangle fa-lg"></i>
          </div>
        </div>
         <p class="text-xs text-gray-400 mt-4">Requieren atención inmediata</p>
      </div>

      <!-- Card 3: Permits -->
      <div class="bg-white p-6 rounded-xl shadow-sm border-l-4 border-emerald-500">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-sm font-medium text-gray-500">Permisos Pendientes</p>
            <h3 class="text-3xl font-bold text-gray-800 mt-2">{{ dataService.pendingPermitsCount() }}</h3>
          </div>
          <div class="p-2 bg-emerald-50 rounded-lg text-emerald-600">
            <i class="fas fa-file-signature fa-lg"></i>
          </div>
        </div>
        <p class="text-xs text-gray-400 mt-4">Solicitudes por revisar</p>
      </div>
    </div>

    <!-- Quick Activity Feed simulation -->
    <div class="bg-white rounded-xl shadow-sm p-6">
      <h3 class="text-lg font-bold text-gray-800 mb-4">Actividad Reciente</h3>
      <div class="space-y-4">
        <div class="flex items-center gap-4 pb-4 border-b border-gray-100">
          <div class="w-2 h-2 rounded-full bg-blue-500"></div>
          <p class="text-sm text-gray-600">Actualización de aforo: <span class="font-medium">Plaza de Armas</span> subió a 25%.</p>
          <span class="ml-auto text-xs text-gray-400">Hace 5 min</span>
        </div>
        <div class="flex items-center gap-4 pb-4 border-b border-gray-100">
           <div class="w-2 h-2 rounded-full bg-emerald-500"></div>
          <p class="text-sm text-gray-600">Nuevo permiso solicitado por <span class="font-medium">Roberto Díaz</span>.</p>
          <span class="ml-auto text-xs text-gray-400">Hace 12 min</span>
        </div>
         <div class="flex items-center gap-4">
           <div class="w-2 h-2 rounded-full bg-red-500"></div>
          <p class="text-sm text-gray-600">Alerta: <span class="font-medium">Parque de las Artes</span> alcanzó nivel crítico.</p>
          <span class="ml-auto text-xs text-gray-400">Hace 30 min</span>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent {
  dataService = inject(DataService);
  
  criticalCount = computed(() => this.dataService.squares().filter(s => s.status === 'Critical').length);
}