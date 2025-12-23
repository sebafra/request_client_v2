import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  public darkMode = signal<boolean>(false);

  constructor() {
    this.initializeTheme();
  }

  private initializeTheme() {
    // Check localStorage first
    const savedTheme = localStorage.getItem('REQUEST_DARK_MODE');
    if (savedTheme !== null) {
      // User has explicitly set a preference
      this.setTheme(savedTheme === 'true');
    } else {
      // Default to dark mode (not system preference)
      this.setTheme(true);
    }
  }

  toggleTheme(isDark: boolean) {
    this.setTheme(isDark);
  }

  private setTheme(isDark: boolean) {
    this.darkMode.set(isDark);
    document.body.classList.toggle('dark', isDark);
    localStorage.setItem('REQUEST_DARK_MODE', String(isDark));
  }
}
