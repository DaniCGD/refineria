import { Injectable } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { Observable, from, of, throwError } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { User } from '../interface/user.interface';
import { SignInCredentials } from '../interface/sign-in-credentials.interface';

@Injectable({
    providedIn: 'root',
})
export class KeycloakAuthService {
    private _authenticated: boolean = false;
    private _user: User | null = null;

    constructor(private _keycloakService: KeycloakService) {
        // CAMBIO 2: Solo verificar estado sin inicializar
        this.checkAuthenticationStatus();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    set accessToken(token: string) {
        // Keycloak maneja tokens automáticamente
    }

    get accessToken(): string {
        try {
            return this._keycloakService.getKeycloakInstance().token || '';
        } catch (error) {
            return '';
        }
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * CAMBIO 3: Sign in que redirige sin verificaciones previas
     */
    signIn(credentials: SignInCredentials): Observable<any> {
        // Redirigir inmediatamente sin verificaciones
        this.redirectToKeycloakLogin();
        return of({ redirecting: true });
    }

    /**
     * CAMBIO 4: Redirección limpia a Keycloak
     */
    redirectToKeycloakLogin(): void {
        const baseUrl = window.location.origin;
        const redirectPath = '/signed-in-redirect';
        
        const keycloakInstance = this._keycloakService.getKeycloakInstance();
        keycloakInstance
            .login({
                redirectUri: baseUrl + redirectPath,
                locale: 'es',
            })
            .catch((error) => {
                console.error('Error en redirección a Keycloak:', error);
            });
    }      

    /**
     * CAMBIO 5: Verificación manual después de redirección
     */
    signInUsingToken(): Observable<boolean> {
        try {
            const keycloakInstance =
                this._keycloakService.getKeycloakInstance();

            if (!keycloakInstance.authenticated) {
                return of(false);
            }

            return this.loadUserProfile().pipe(
                map(() => {
                    this._authenticated = true;
                    return true;
                }),
                catchError(() => of(false))
            );
        } catch (error) {
            return of(false);
        }
    }

    signOut(): Observable<any> {
        return from(this._keycloakService.logout(window.location.origin)).pipe(
            map(() => {
                this._authenticated = false;
                this._user = null;
                return true;
            })
        );
    }

    /**
     * CAMBIO 6: Check que no dispara verificaciones automáticas
     */
    check(): Observable<boolean> {
        if (this._authenticated) {
            return of(true);
        }

        // Solo verificar si ya está autenticado, no disparar login
        try {
            const keycloakInstance =
                this._keycloakService.getKeycloakInstance();
            if (keycloakInstance.authenticated) {
                return this.signInUsingToken();
            }
        } catch (error) {
            console.log('Keycloak no inicializado aún');
        }

        return of(false);
    }

    getUserProfile(): Observable<User> {
        if (this._user) {
            return of(this._user);
        }
        return this.loadUserProfile();
    }

    getUserRoles(): string[] {
        try {
            return this._keycloakService.getUserRoles() || [];
        } catch (error) {
            return [];
        }
    }

    hasRole(role: string): boolean {
        try {
            return this._keycloakService.isUserInRole(role);
        } catch (error) {
            return false;
        }
    }

    get user(): User | null {
        return this._user;
    }

    get isAuthenticated(): boolean {
        return this._authenticated;
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * CAMBIO 7: Verificación de estado sin disparar acciones
     */
    private checkAuthenticationStatus(): void {
        try {
            const keycloakInstance =
                this._keycloakService.getKeycloakInstance();
            this._authenticated = keycloakInstance.authenticated || false;
        } catch (error) {
            this._authenticated = false;
        }
    }

    private loadUserProfile(): Observable<User> {
        return from(this._keycloakService.loadUserProfile()).pipe(
            map((profile) => {
                this._user = {
                    id: profile.id || '',
                    name:
                        `${profile.firstName || ''} ${
                            profile.lastName || ''
                        }`.trim() ||
                        profile.username ||
                        '',
                    email: profile.email || '',
                    avatar: 'assets/images/avatars/brian-hughes.jpg',
                    status: 'online',
                    roles: this.getUserRoles(),
                };
                return this._user;
            }),
            catchError((error) => {
                console.error('Error cargando perfil de usuario:', error);
                return throwError(() => error);
            })
        );
    }
}
