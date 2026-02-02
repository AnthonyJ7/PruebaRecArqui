import { Routes } from '@angular/router';

export const routes: Routes = [
	{
		path: '',
		pathMatch: 'full',
		redirectTo: 'aforo'
	},
	{
		path: 'aforo',
		loadComponent: () =>
			import('./features/aforo/aforo.component').then((m) => m.AforoComponent)
	},
	{
		path: 'permisos',
		loadComponent: () =>
			import('./features/permisos/permisos.component').then((m) => m.PermisosComponent)
	},
	{
		path: '**',
		redirectTo: 'aforo'
	}
];
