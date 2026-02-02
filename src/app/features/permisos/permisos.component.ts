import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PermisoComercial } from '../../shared/models/permiso-comercial.model';
import { PermisosRepository } from './permisos.repository';
import { PermisosService } from './permisos.service';

@Component({
  selector: 'app-permisos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './permisos.component.html',
  styleUrl: './permisos.component.scss',
  providers: [PermisosRepository, PermisosService]
})
export class PermisosComponent {
  permisos: PermisoComercial[] = [];
  nuevo = {
    id: '',
    comerciante: '',
    rubro: '',
    ubicacion: '',
    vigente: true
  };

  constructor(private service: PermisosService) {
    this.loadPermisos();
  }

  loadPermisos(): void {
    this.permisos = this.service.getPermisos();
  }

  get totalPermisos(): number {
    return this.permisos.length;
  }

  get permisosVigentes(): number {
    return this.permisos.filter((permiso) => permiso.vigente).length;
  }

  get permisosSuspendidos(): number {
    return this.permisos.filter((permiso) => !permiso.vigente).length;
  }

  addPermiso(): void {
    if (!this.nuevo.id || !this.nuevo.comerciante || !this.nuevo.rubro) {
      return;
    }

    this.service.createPermiso({
      id: this.nuevo.id.trim(),
      comerciante: this.nuevo.comerciante.trim(),
      rubro: this.nuevo.rubro.trim(),
      ubicacion: this.nuevo.ubicacion.trim(),
      vigente: this.nuevo.vigente
    });

    this.nuevo = {
      id: '',
      comerciante: '',
      rubro: '',
      ubicacion: '',
      vigente: true
    };

    this.loadPermisos();
  }

  togglePermiso(permiso: PermisoComercial): void {
    this.service.togglePermiso(permiso.id);
    this.loadPermisos();
  }
}
