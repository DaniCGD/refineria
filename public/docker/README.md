### Estructura final del proyecto
```html
auth/
├── docker-compose.yml
├── imports/
│   └── realm-config.json
└── themes/
    └── custom-theme/
        ├── theme.properties
        └── login/
            ├── login.ftl
            ├── template.ftl
            ├── messages/
            │   └── messages_es.properties
            └── resources/
                ├── css/
                │   └── custom.css
                ├── js/
                │   └── custom.js
                └── img/
                    └── favicon.ico
```

### Configurar el tema en Keycloak
- Accede a Keycloak Admin Console: http://localhost:8080
- Login: admin / admin123
- Ve a Realm Settings → Themes
- Selecciona custom-theme en Login Theme
- Guarda los cambios