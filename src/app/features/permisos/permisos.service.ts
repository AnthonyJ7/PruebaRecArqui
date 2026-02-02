import { Injectable } from '@angular/core';
import { PermisoComercial } from '../../shared/models/permiso-comercial.model';
import { PermisosRepository } from './permisos.repository';

@Injectable()
export class PermisosService {
  constructor(private repository: PermisosRepository) {}

  getPermisos(): PermisoComercial[] {
    return this.repository.getAll();
  }

  createPermiso(input: Omit<PermisoComercial, 'fechaEmision'>): void {
    this.repository.add({
      ...input,
      fechaEmision: new Date().toISOString()
    });
  }

  togglePermiso(id: string): void {
    this.repository.toggleState(id);
  }
}
