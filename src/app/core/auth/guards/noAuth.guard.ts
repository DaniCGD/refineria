import { inject } from '@angular/core';
import { CanActivateChildFn, CanActivateFn, Router } from '@angular/router';
import { AuthService } from 'app/shared/service/auth.service';
import { of, switchMap } from 'rxjs';

export const NoAuthGuard: CanActivateFn | CanActivateChildFn = (route, state) =>
{
    const router: Router = inject(Router);
    
    if (state.url.includes('/signed-in-redirect')) {
        return of(true);
    }

    // Check the authentication status
    return inject(AuthService).check().pipe(
        switchMap((authenticated) =>
        {
            // If the user is authenticated...
            if ( authenticated )
            {
                return of(router.parseUrl(''));
            }

            // Allow the access
            return of(true);
        }),
    );
};
