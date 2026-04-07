import { Routes } from '@angular/router';
import { MainLayout } from '@shared/index';

export const routes: Routes = [
  {
    path: '',
    component: MainLayout,
    children: [
      { path: '', redirectTo: 'cheques', pathMatch: 'full' },
      {
        path: 'cheques',
        loadComponent: () =>
          import('@features/cheques/index').then(m => m.ChequesPage)
      },
      {
        path: 'jobs',
        loadComponent: () =>
          import('@features/jobs/index').then(m => m.JobsPage)
      },
      {
  path: 'jobs/:id',
  loadComponent: () =>
    import('@features/jobs/index')
      .then(m => m.JobDetailsPage)
}
      
    ]
  }
];