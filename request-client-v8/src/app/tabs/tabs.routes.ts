import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

export const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'home',
        children: [
          {
            path: '',
            loadComponent: () => import('../home/home.page').then(m => m.HomePage),
          },
          {
            path: 'articles/:categoryId',
            loadComponent: () => import('../articles/articles.page').then(m => m.ArticlesPage),
          }
        ]
      },
      {
        path: 'order',
        loadComponent: () => import('../order/order.page').then(m => m.OrderPage),
      },
      {
        path: 'tables',
        loadComponent: () => import('../tables/tables.page').then(m => m.TablesPage),
      },
      {
        path: '',
        redirectTo: '/tabs/home',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/home',
    pathMatch: 'full',
  },
];
