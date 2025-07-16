import { inject } from '@angular/core';
import { CanActivateChildFn, CanActivateFn, Router } from '@angular/router';
import { AuthService } from 'app/core/auth/service/auth.service';
import { of, switchMap } from 'rxjs';
import { KeycloakAuthGuard, KeycloakService } from 'keycloak-angular';

export const AuthGuard: CanActivateFn | CanActivateChildFn = (route, state) => {
    const keycloakService = inject(KeycloakService);
    const router = inject(Router);

    try {
        const keycloakInstance = keycloakService.getKeycloakInstance();

        // CAMBIO 8: Solo verificar estado, no disparar login automático
        if (!keycloakInstance.authenticated) {
            // Redirigir a página de login manual
            router.navigate(['/sign-in'], {
                queryParams: { redirectURL: state.url },
            });
            return false;
        }

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
    } catch (error) {
        console.error('Error en auth guard:', error);
        // Si hay error, redirigir a login manual
        router.navigate(['/sign-in']);
        return false;
    }
};
