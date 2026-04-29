import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./features/dashboard/dashboard').then(m => m.Dashboard)
  },
  {
    path: 'token-management',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/token-management/token-list/token-list')
            .then(m => m.TokenListComponent),
      },
      {
        path: 'create',
        loadComponent: () =>
          import('./features/token-management/create-token/create-token')
            .then(m => m.CreateToken),
      },
      {
        path: ':id',
        loadComponent: () =>
          import('./features/token-management/token-detail/token-detail')
            .then(m => m.TokenDetailComponent),
      },
    ],
  },
  {
    path: 'settings',
    loadComponent: () =>
      import('./features/settings/settings').then(m => m.Settings)
  },
  {
    path: 'search-strategies',
    loadComponent: () =>
      import('./features/search-strategies/search-strategies').then(m => m.SearchStrategies)
  },
  {
    path: 'google-requests',
    loadComponent: () =>
      import('./features/google-requests/google-requests').then(m => m.GoogleRequests)
  },
  { path: '**', redirectTo: 'dashboard' }
];