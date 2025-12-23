import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  // Por ahora, validamos si existe un waiter en Constants o LocalStorage
  // Como no hemos persistido el login realmente, verificaremos si hay algo en localStorage 'REQUEST_WAITER'
  // o si el usuario quiere acceder a rutas que no son login.
  
  // TODO: Mejorar lógica de auth real
  // Permite el acceso a la configuración sin estar logueado (necesario para configurar IP del servidor)
  if (state.url.includes('settings')) {
    return true;
  }

  const waiter = localStorage.getItem('REQUEST_WAITER');
  
  if (waiter) {
    return true;
  } else {
    // Redirigir a login
    return router.parseUrl('/login');
  }
};
