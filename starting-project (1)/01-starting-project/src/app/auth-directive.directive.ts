import { Directive, effect, inject, input } from '@angular/core';
import { Permission } from './auth/auth.model';
import { AuthService } from './auth/auth.service';

@Directive({
  selector: '[appAuth]',
  standalone: true
})
export class AuthDirectiveDirective {
  userType = input.required<Permission>();
  private authService = inject(AuthService);

  constructor() {
    effect( () => {
      if(this.authService.activePermission() === this.userType()) {
        console.log('Show Element');
      } else {
        console.log('Not show');
      }
      });
    }

   }


