import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { KeycloakAuthService } from 'app/core/auth/service/keycloak-auth.service';

@Component({
    selector: 'signed-in-redirect',
    template: `
        <div class="flex flex-col items-center justify-center min-h-screen">
            <div class="text-center">
                <h2 class="text-2xl font-semibold mb-4">Iniciando sesión...</h2>
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            </div>
        </div>
    `,
    standalone: true
})
export class SignedInRedirectComponent implements OnInit {
    
    constructor(
        private _authService: KeycloakAuthService,
        private _router: Router
    ) {}

    ngOnInit(): void {
        // Verificar autenticación y redirigir
        this._authService.signInUsingToken().subscribe({
            next: (authenticated) => {
                if (authenticated) {
                    this._router.navigate(['/dashboard']);
                } else {
                    this._router.navigate(['/sign-in'], { queryParams: { manual: 'true' } });
                }
            },
            error: () => {
                this._router.navigate(['/sign-in'], { queryParams: { manual: 'true' } });
            }
        });
    }
}
