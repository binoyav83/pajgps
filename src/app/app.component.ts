import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from './services/auth.service';
import { MenuService } from './services/menu.service'; // Import the service

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})

export class AppComponent {

  // For menu
  public appPages: any = [];

  public isLoggedIn: boolean = false;

  public currentUrl: string = '';

  constructor(private authService: AuthService, private router: Router, private menuService: MenuService) { }

  ngOnInit(): void {

    this.appPages = this.menuService.getMenuItems();

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentUrl = event.url;
        this.checkLoginStatus();
      }
    });
  }

  checkLoginStatus() {
    this.isLoggedIn = this.authService.isAuthenticated();
  }

  onLogout() {
    this.authService.logout();
    this.checkLoginStatus();
  }
}
