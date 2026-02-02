
import { Component, inject, signal } from '@angular/core';
import { AiService } from '../../services/ai.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-architecture',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="max-w-4xl mx-auto">
      <h2 class="text-3xl font-bold text-gray-800 mb-6">Especificaciones Técnicas</h2>

      <!-- Architecture Section -->
      <div class="bg-white rounded-xl shadow-sm p-8 mb-8">
        <h3 class="text-xl font-bold text-indigo-700 mb-4 border-b pb-2">1. Diseño Arquitectónico (Capas)</h3>
        
        <div class="mb-6">
          <p class="text-gray-700 mb-4">
            Para garantizar la independencia entre los módulos de <strong>Aforo</strong> y <strong>Permisos</strong>, se propone una arquitectura Clean/Hexagonal simplificada o de N-Capas estricta.
          </p>
          <p class="text-gray-700 mb-4">
            <strong>Justificación (Mantenibilidad):</strong> Separar los módulos permite que cambios en la lógica de permisos (ej. nuevas leyes) no rompan el monitoreo de aforo en tiempo real. Cada módulo tiene su propio ciclo de vida y modelo de datos.
          </p>
        </div>

        <!-- Visual Block Diagram Representation -->
        <div class="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6 overflow-x-auto">
          <h4 class="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 text-center">Diagrama de Componentes</h4>
          
          <div class="flex flex-col gap-4 text-center text-sm font-mono">
            <!-- Presentation Layer -->
            <div class="bg-blue-100 p-3 rounded border border-blue-300">
              <span class="font-bold text-blue-800">Capa de Presentación (Frontend Angular)</span>
              <div class="flex justify-center gap-4 mt-2">
                <div class="bg-white p-2 rounded shadow-sm">Componentes Aforo</div>
                <div class="bg-white p-2 rounded shadow-sm">Componentes Permisos</div>
              </div>
            </div>

            <!-- Arrow Down -->
            <div class="text-gray-400"><i class="fas fa-arrow-down"></i> HTTP / REST API</div>

            <!-- Business Logic Layer (Backend) -->
            <div class="grid grid-cols-2 gap-4">
              <div class="bg-green-100 p-4 rounded border border-green-300">
                <span class="font-bold text-green-800">Servicio Aforo (Microservicio A)</span>
                <ul class="text-xs text-left mt-2 list-disc list-inside text-green-900">
                  <li>Ingesta IoT</li>
                  <li>Cálculo %</li>
                  <li>Alertas</li>
                </ul>
              </div>
              <div class="bg-purple-100 p-4 rounded border border-purple-300">
                <span class="font-bold text-purple-800">Servicio Permisos (Microservicio B)</span>
                 <ul class="text-xs text-left mt-2 list-disc list-inside text-purple-900">
                  <li>Workflow aprob.</li>
                  <li>Gestión doc</li>
                  <li>Pagos</li>
                </ul>
              </div>
            </div>

             <!-- Arrow Down -->
            <div class="text-gray-400"><i class="fas fa-arrow-down"></i></div>

             <!-- Data Layer -->
             <div class="grid grid-cols-2 gap-4">
              <div class="bg-gray-200 p-3 rounded border border-gray-400">
                <i class="fas fa-database mr-2"></i> Time-Series DB (InfluxDB)
                <div class="text-xs text-gray-600 mt-1">Alta velocidad escritura</div>
              </div>
              <div class="bg-gray-200 p-3 rounded border border-gray-400">
                <i class="fas fa-database mr-2"></i> Relational DB (PostgreSQL)
                <div class="text-xs text-gray-600 mt-1">ACID, Relaciones complejas</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- CI/CD Section -->
      <div class="bg-white rounded-xl shadow-sm p-8 mb-8">
        <h3 class="text-xl font-bold text-indigo-700 mb-4 border-b pb-2">2. Pipeline CI/CD (GitHub Actions)</h3>
        <p class="text-gray-700 mb-4">
          Este pipeline automatiza el linting, las pruebas unitarias y el despliegue a un entorno de staging cuando se hace push a la rama principal.
        </p>

        <div class="bg-gray-800 rounded-lg p-4 overflow-x-auto text-sm">
          <pre class="text-green-400"><code>name: CarnavalLogistics CI/CD

on:
  push:
    branches: [ "main" ]
  pull_request:
    branches: [ "main" ]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v4
    
    - name: Set up Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '20'
        cache: 'npm'
        
    - name: Install Dependencies
      run: npm ci
      
    - name: Lint Code
      run: npm run lint
      
    - name: Run Unit Tests
      run: npm run test -- --no-watch --no-progress --browsers=ChromeHeadless
      
    - name: Build Application
      run: npm run build -- --configuration production

    - name: Deploy to Staging (Simulation)
      if: github.ref == 'refs/heads/main'
      run: echo "Deploying artifacts to AWS S3 / Firebase..."
</code></pre>
        </div>
      </div>

      <!-- Interactive Architect Chat -->
      <div class="bg-indigo-50 rounded-xl p-6 border border-indigo-200">
        <h3 class="font-bold text-indigo-800 mb-2"><i class="fas fa-comment-dots mr-2"></i>Consulta al Arquitecto AI</h3>
        <p class="text-sm text-indigo-600 mb-4">¿Tienes dudas sobre la implementación de CI/CD o la arquitectura?</p>
        
        <div class="flex gap-2">
          <input [(ngModel)]="question" (keyup.enter)="ask()" placeholder="Ej: ¿Por qué usar PostgreSQL para permisos?" 
                 class="flex-1 p-3 rounded-lg border border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500">
          <button (click)="ask()" [disabled]="loading()" 
                  class="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-indigo-700 disabled:opacity-50">
            {{ loading() ? '...' : 'Preguntar' }}
          </button>
        </div>

        @if (answer()) {
          <div class="mt-4 bg-white p-4 rounded-lg border border-indigo-100 animate-fade-in">
            <p class="text-gray-800 whitespace-pre-wrap">{{ answer() }}</p>
          </div>
        }
      </div>

    </div>
  `
})
export class ArchitectureComponent {
  aiService = inject(AiService);
  question = signal('');
  answer = signal('');
  loading = signal(false);

  async ask() {
    if (!this.question().trim()) return;
    this.loading.set(true);
    const response = await this.aiService.askArchitect(this.question());
    this.answer.set(response);
    this.loading.set(false);
  }
}
