import { PermisoComercial } from '../../shared/models/permiso-comercial.model';

export class PermisosRepository {
  private permisos: PermisoComercial[] = [
    {
      id: 'PC-101',
      comerciante: 'Ana Martínez',
      rubro: 'Artesanías',
      ubicacion: 'Plaza Central',
      fechaEmision: new Date().toISOString(),
      vigente: true
    },
    {
      id: 'PC-102',
      comerciante: 'Luis Soto',
      rubro: 'Comida rápida',
      ubicacion: 'Plaza Norte',
      fechaEmision: new Date().toISOString(),
      vigente: true
    }
  ];

  getAll(): PermisoComercial[] {
    return [...this.permisos];
  }

  add(permiso: PermisoComercial): void {
    this.permisos = [permiso, ...this.permisos];
  }

  toggleState(id: string): void {
    this.permisos = this.permisos.map((permiso) =>
      permiso.id === id ? { ...permiso, vigente: !permiso.vigente } : permiso
    );
  }
}
