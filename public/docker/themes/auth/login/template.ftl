<#macro registrationLayout bodyClass="" displayInfo=false displayMessage=true displayRequiredFields=false displayWide=false showAnotherWayIfPresent=true>
<!DOCTYPE html>
<html lang="es" class="${properties.kcHtmlClass!}">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="robots" content="noindex, nofollow">

    <link href="${url.resourcesPath}/css/custom.css" rel="stylesheet" type="text/css" />
    
    <title>Iniciar Sesión - Sistema de Reportes</title>
    <link rel="icon" href="${url.resourcesPath}/img/logo.svg" />
    
    <!-- Cargar estilos de Keycloak base -->
    <#if properties.stylesCommon?has_content>
        <#list properties.stylesCommon?split(' ') as style>
            <link href="${url.resourcesCommonPath}/${style}" rel="stylesheet" />
        </#list>
    </#if>
    
    <!-- Cargar nuestros estilos personalizados -->
    <#if properties.styles?has_content>
        <#list properties.styles?split(' ') as style>
            <link href="${url.resourcesPath}/${style}" rel="stylesheet" />
        </#list>
    </#if>
    
    <!-- Cargar scripts -->
    <#if properties.scripts?has_content>
        <#list properties.scripts?split(' ') as script>
            <script src="${url.resourcesPath}/${script}" type="text/javascript"></script>
        </#list>
    </#if>
    <#if scripts??>
        <#list scripts as script>
            <script src="${script}" type="text/javascript"></script>
        </#list>
    </#if>
</head>

<body class="${properties.kcBodyClass!}">
    <div class="${properties.kcLoginClass!}">
        <div id="kc-container" class="${properties.kcContainerClass!}">
            <div id="kc-container-wrapper" class="${properties.kcContainerWrapperClass!}">
                <div id="kc-content">
                    <div id="kc-content-wrapper">
                        <#nested "form">
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <script>
        // Password toggle functionality
        document.addEventListener('DOMContentLoaded', function() {
            const passwordInput = document.getElementById('password');
            const passwordToggle = document.getElementById('password-toggle');
            
            if (passwordToggle && passwordInput) {
                passwordToggle.addEventListener('click', function() {
                    if (passwordInput.type === 'password') {
                        passwordInput.type = 'text';
                        passwordToggle.textContent = '🙈';
                    } else {
                        passwordInput.type = 'password';
                        passwordToggle.textContent = '👁️';
                    }
                });
            }
        });
    </script>
</body>
</html>
</#macro>