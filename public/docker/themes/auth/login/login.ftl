<#import "template.ftl" as layout>
<@layout.registrationLayout displayMessage=!messagesPerField.existsError('username','password') displayInfo=realm.password && realm.registrationAllowed && !registrationDisabled??; section>
    <#if section = "header">
        ${msg("doLogIn")}
    <#elseif section = "form">
    <div class="container">
        <div class="login-section">
            <div class="login-form">
                <div class="logo">
                    <img src="${url.resourcesPath}/img/logo.svg"  alt="Logo" class="logo-img"/>
                </div>
                
                <h1 class="title">Inicia sesión</h1>
                <p class="subtitle">
                    ¿No tienes una cuenta? 
                    <#if realm.registrationAllowed && !registrationDisabled??>
                        <a href="${url.registrationUrl}" id="register-link">Regístrate</a>
                    </#if>
                </p>
                
                <!-- Alert Messages -->
                <#if message?has_content && (message.type != 'warning' || !isAppInitiatedAction??)>
                    <div class="alert alert-${message.type}">
                        <span class="kc-feedback-text">${kcSanitize(message.summary)?no_esc}</span>
                    </div>
                </#if>
                
                <form id="kc-form-login" onsubmit="login.disabled = true; return true;" action="${url.loginAction}" method="post">
                    <div class="form-group">
                        <label for="username" class="form-label">
                            <#if !realm.loginWithEmailAllowed>${msg("username")}<#elseif !realm.registrationEmailAsUsername>${msg("usernameOrEmail")}<#else>Dirección de correo</#if>*
                        </label>
                        <input 
                            tabindex="1" 
                            id="username" 
                            class="form-input" 
                            name="username" 
                            value="${(login.username!'')}" 
                            type="text" 
                            autofocus 
                            autocomplete="off"
                            aria-invalid="<#if messagesPerField.existsError('username','password')>true</#if>"
                            required
                        />
                        <#if messagesPerField.existsError('username','password')>
                            <div class="error-message">
                                ${kcSanitize(messagesPerField.getFirstError('username','password'))?no_esc}
                            </div>
                        </#if>
                    </div>

                    <div class="form-group">
                        <label for="password" class="form-label">Contraseña*</label>
                        <div class="password-container">
                            <input 
                                tabindex="2" 
                                id="password" 
                                class="form-input" 
                                name="password" 
                                type="password" 
                                autocomplete="off"
                                aria-invalid="<#if messagesPerField.existsError('username','password')>true</#if>"
                                required
                            />
                            <button type="button" class="password-toggle" id="password-toggle">
                                👁️
                            </button>
                        </div>
                    </div>

                    <div class="form-options">
                        <#if realm.rememberMe && !usernameEditDisabled??>
                            <div class="checkbox-container">
                                <input tabindex="3" id="rememberMe" name="rememberMe" type="checkbox" <#if login.rememberMe??>checked</#if>>
                                <label for="rememberMe">Recordarme</label>
                            </div>
                        <#else>
                            <div></div>
                        </#if>
                        <#if realm.resetPasswordAllowed>
                            <a tabindex="5" href="${url.loginResetCredentialsUrl}" class="forgot-password">¿Perdiste tu contraseña?</a>
                        </#if>
                    </div>

                    <input type="hidden" id="id-hidden-input" name="credentialId" <#if auth.selectedCredential?has_content>value="${auth.selectedCredential}"</#if>/>
                    <button tabindex="4" class="login-button" name="login" id="kc-login" type="submit">
                        Iniciar Sesión
                    </button>
                </form>
            </div>
        </div>
        
        <div class="background-section"></div>
    </div>
    </#if>
</@layout.registrationLayout>