import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const keycloakService = inject(KeycloakService);

    // URLs que no necesitan autenticación
    const excludedUrls = ['/assets', '/public'];
    const shouldExclude = excludedUrls.some((url) => req.url.includes(url));

    if (shouldExclude || !keycloakService.isLoggedIn()) {
        return next(req);
    }

    try {
        const token = keycloakService.getKeycloakInstance().token;
        if (token) {
            const authReq = req.clone({
                headers: req.headers.set('Authorization', `Bearer ${token}`),
            });
            return next(authReq);
        }
    } catch (error) {
        console.error('Error obteniendo token:', error);
    }

    return next(req);
};
