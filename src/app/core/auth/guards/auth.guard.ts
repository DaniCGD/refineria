import { inject } from '@angular/core';
import { CanActivateChildFn, CanActivateFn, Router } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';
import { KeycloakAuthService } from '../../../shared/service/keycloak-auth.service';

export const AuthGuard: CanActivateFn | CanActivateChildFn = (route, state) => {
    const keycloakService = inject(KeycloakService);
    const keycloakAuthService = inject(KeycloakAuthService);
    const router = inject(Router);

    if(state.url === '/signed-in-redirect'){
        return true
    }

    try {
        const keycloakInstance = keycloakService.getKeycloakInstance();
        
        if (keycloakInstance.authenticated) {
            // Verificar roles si están definidos
            const requiredRoles = route.data?.['roles'] as string[];
            if (requiredRoles && requiredRoles.length > 0) {
                const hasRequiredRole = requiredRoles.some((role) =>
                    keycloakService.isUserInRole(role)
                );
                if (!hasRequiredRole) {
                    router.navigate(['/unauthorized']);
                    return false;
                }
            }
            return true;
        }

        // Verificar si se prefiere login manual
        const preferManualLogin = localStorage.getItem('preferManualLogin') === 'true';
        
        if (preferManualLogin) {
            // Redirigir a página de login manual
            router.navigate(['/sign-in'], {
                queryParams: { 
                    redirectURL: state.url,
                    manual: 'true' 
                },
            });
            return false;
        } else {
            // Redirigir directo a Keycloak (comportamiento por defecto)
            const returnUrl = state.url !== '/sign-in' ? state.url : '/dashboards/project';
            localStorage.setItem('returnUrl', returnUrl);
            keycloakAuthService.redirectToKeycloakLogin();
            return false;
        }

    } catch (error) {
        console.error('Error en auth guard:', error);
        return false;
    }
};
