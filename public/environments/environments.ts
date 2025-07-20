export const environment = {
    production: false,
    keycloak: {
      url: 'http://localhost:8080',           // URL del servidor Keycloak
      realm: 'hr-system',              // Nombre del realm configurado
      clientId: 'reportehr-angular-app',     // ID del cliente Angular en Keycloak
      sslrequired: 'external',
      publicclient: true,
      confidentialport: 0
    }
};