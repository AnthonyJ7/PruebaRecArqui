
import { Component, signal } from '@angular/core';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CapacityComponent } from './components/capacity/capacity.component';
import { PermitsComponent } from './components/permits/permits.component';
import { ArchitectureComponent } from './components/architecture/architecture.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [DashboardComponent, CapacityComponent, PermitsComponent, ArchitectureComponent],
  templateUrl: './app.component.html'
})
export class AppComponent {
  activeTab = signal<'dashboard' | 'capacity' | 'permits' | 'architecture'>('dashboard');

  getTabClass(tabName: string): string {
    const base = "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ";
    if (this.activeTab() === tabName) {
      return base + "bg-indigo-50 text-indigo-700";
    }
    return base + "text-gray-600 hover:bg-gray-50 hover:text-gray-900";
  }
}
