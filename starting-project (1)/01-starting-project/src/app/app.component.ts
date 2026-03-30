import { Component, computed, inject } from '@angular/core';

import { AuthComponent } from './auth/auth.component';
import { LearningResourcesComponent } from './learning-resources/learning-resources.component';
import { AuthService } from './auth/auth.service';
import { AuthDirectiveDirective } from "./auth-directive.directive";

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [AuthComponent, LearningResourcesComponent, AuthDirectiveDirective],
})
export class AppComponent {
  private authSerice = inject(AuthService);

  isAdmin = computed(() => this.authSerice.activePermission() === 'admin');

}
