import { KeycloakService, KeycloakOptions } from 'keycloak-angular';
import { environment } from '../../../../public/environments/environments';

let isInitializing = false;
let initPromise: Promise<boolean> | null = null;

function getKeycloakConfig(): KeycloakOptions {
    return {
        config: {
            url: environment.keycloak.url,
            realm: environment.keycloak.realm,
            clientId: environment.keycloak.clientId,
        },
        initOptions: {
            onLoad: undefined,
            checkLoginIframe: false,
            enableLogging: true,
            useNonce: false,
            responseMode: 'query',
            flow: 'standard'
        },
        enableBearerInterceptor: true,
        bearerPrefix: 'Bearer',
        loadUserProfileAtStartUp: false,
        bearerExcludedUrls: ['/assets', '/public'],
    };
};


export function initializeKeycloak(keycloak: KeycloakService) {
    console.log('🟡 Keycloak inicializado.');
    console.log('🟡 Current URL:', window.location.href);
    console.log('🟡 Current pathname:', window.location.pathname);
    
    return () => {
        if (isInitializing && initPromise) {
            console.log('🟡 Keycloak ya se está inicializando, reutilizando promesa');
            return initPromise;
        }

        isInitializing = true;

        initPromise = keycloak.init(getKeycloakConfig())
            .then((authenticated) => {
                console.log('🟡 Keycloak init completado');
                logKeycloakDebugInfo(authenticated, keycloak);
                isInitializing = false;
                return authenticated;
            })
            .catch(error => {
                console.error('🔴 Error inicializando Keycloak:', error);
                
                // Manejo más detallado del error
                if (error) {
                    console.error('🔴 Error type:', typeof error);
                    console.error('🔴 Error constructor:', error.constructor?.name);
                    console.error('🔴 Error toString:', error.toString());
                }
                
                const errorDetails = {
                    message: error?.message || error?.toString() || 'Error desconocido',
                    stack: error?.stack || 'No stack trace',
                    name: error?.name || 'Unknown error',
                    error: error,
                    config: getKeycloakConfig().config
                };
                
                console.error('🔴 Error details:', errorDetails);
                isInitializing = false;
                return false;
            });
            
        return initPromise;
    };
}

function logKeycloakDebugInfo(authenticated: boolean, keycloak: KeycloakService): void {
    console.log('🟡 Keycloak inicializado. Authenticated:', authenticated);
    console.log('🟡 URL después de init:', window.location.href);
    
    const instance = keycloak.getKeycloakInstance();
    console.log('🟡 Keycloak instance:', instance);
    console.log('🟡 Token:', instance.token ? 'Presente' : 'Ausente');
    console.log('🟡 Refresh Token:', instance.refreshToken ? 'Presente' : 'Ausente');
    
    if (window.location.pathname === '/signed-in-redirect') {
        console.log('🟡 Estamos en signed-in-redirect');
        console.log('🟡 URL params:', window.location.search);
        console.log('🟡 URL hash:', window.location.hash);
        
        // Verificar parámetros manualmente
        const urlParams = new URLSearchParams(window.location.search);
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        console.log('🟡 Code en query:', urlParams.get('code'));
        console.log('🟡 Code en hash:', hashParams.get('code'));
        console.log('🟡 State en query:', urlParams.get('state'));
        console.log('🟡 State en hash:', hashParams.get('state'));
        console.log('🟡 Error en query:', urlParams.get('error'));
        console.log('🟡 Error en hash:', hashParams.get('error'));
        
        // AÑADIR: Verificar si hay error de acceso denegado
        if (urlParams.get('error') === 'access_denied') {
            console.log('🔴 Acceso denegado por el usuario');
        }
        
        if (authenticated) {
            console.log('🟡 Procesando callback automáticamente');
        } else {
            console.log('🔴 En callback pero no autenticado');
            
            // AÑADIR: Intentar procesar manualmente si hay código
            const code = urlParams.get('code') || hashParams.get('code');
            if (code) {
                console.log('🟡 Hay código, pero Keycloak no procesó. Código:', code);
            } else {
                console.log('🔴 No hay código en la URL - problema en la redirección');
            }
        }
    }
}