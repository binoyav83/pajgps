import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  email = 'testkunde@paj-gps.de';
  password = 'app123#.';

  constructor(private authService: AuthService, private router: Router) { }

  login() {
    this.authService.login(this.email, this.password).subscribe((success: any) => {
      if (success) {
        this.router.navigate(['/map']); // Navigate to map after login
      } else {
        console.error('Login failed, cannot navigate to map.');
      }
    });
  }
}
