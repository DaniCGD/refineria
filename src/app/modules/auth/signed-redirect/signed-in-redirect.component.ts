import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';

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
        private _keycloakService: KeycloakService,
        private _router: Router
    ) {}

    ngOnInit(): void {
        console.log('SignedInRedirectComponent: Iniciando');
        this.processKeycloakCallback();
    }

    private async processKeycloakCallback(): Promise<void> {
        try {
            // Esperar un poco más para que Keycloak procese completamente
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            const keycloakInstance = this._keycloakService.getKeycloakInstance();
            console.log('Keycloak authenticated:', keycloakInstance.authenticated);
            
            if (keycloakInstance.authenticated) {
                try {
                    // Obtener información del usuario
                    const userProfile = await this._keycloakService.loadUserProfile();
                    console.log('User profile:', userProfile);
                    
                    // Redirigir al dashboard
                    const returnUrl = localStorage.getItem('returnUrl') || '/dashboards/project';
                    localStorage.removeItem('returnUrl');
                    
                    console.log('Redirigiendo a:', returnUrl);
                    await this._router.navigate([returnUrl]);
                } catch (profileError) {
                    console.error('Error cargando perfil:', profileError);
                    // Aún así redirigir si está autenticado
                    const returnUrl = localStorage.getItem('returnUrl') || '/dashboards/project';
                    localStorage.removeItem('returnUrl');
                    await this._router.navigate([returnUrl]);
                }
            } else {
                console.log('No autenticado, redirigiendo a sign-in');
                await this._router.navigate(['/sign-in'], { 
                    queryParams: { manual: 'false' } 
                });
            }
            
        } catch (error) {
            console.error('Error procesando callback de Keycloak:', error);
            await this._router.navigate(['/sign-in'], { 
                queryParams: { manual: 'true', error: 'callback_error' } 
            });
        }
    }
}
