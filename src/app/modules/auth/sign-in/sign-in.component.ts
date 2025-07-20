import { NgIf } from '@angular/common';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormsModule, NgForm, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertComponent, FuseAlertType } from '@fuse/components/alert';
import { KeycloakAuthService } from 'app/shared/service/keycloak-auth.service';
import { KeycloakService } from 'keycloak-angular';

@Component({
    selector     : 'auth-sign-in',
    templateUrl  : './sign-in.component.html',
    styleUrls    : ['./sign-in.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations,
    standalone   : true,
    imports      : [RouterLink, FuseAlertComponent, NgIf, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatCheckboxModule, MatProgressSpinnerModule],
})
export class AuthSignInComponent implements OnInit {
    @ViewChild('signInNgForm') signInNgForm: NgForm;
    
    public backgroundImage = 'assets/images/pages/sign-in/login-background.jpg';
    alert: { type: FuseAlertType; message: string } = {
        type   : 'success',
        message: '',
    };
    signInForm: UntypedFormGroup;
    showAlert: boolean = false;
    isLoading: boolean = true; // Cambiar a true por defecto
    showManualLogin: boolean = false; // Nueva propiedad

    constructor(
        private _activatedRoute: ActivatedRoute,
        private _authService: KeycloakAuthService,
        private _formBuilder: UntypedFormBuilder,
        private _router: Router,
        private _keycloakService: KeycloakService
    ) {}

    ngOnInit(): void {
        // Verificar si el usuario quiere login manual
        const manualLogin = this._activatedRoute.snapshot.queryParamMap.get('manual');
        
        if (manualLogin === 'true') {
            // Mostrar formulario manual solo si se solicita explícitamente
            this.showManualLogin = true;
            this.isLoading = false;
            this.initializeForm();
            return;
        }

        // Verificar si ya está autenticado
        try {
            const keycloakInstance = this._keycloakService.getKeycloakInstance();
            if (keycloakInstance.authenticated) {
                const redirectURL = this._activatedRoute.snapshot.queryParamMap.get('redirectURL') || '/dashboards/project';
                this._router.navigateByUrl(redirectURL);
                return;
            }
        } catch (error) {
            console.log('Keycloak no inicializado, redirigiendo a login');
        }

        // Redirigir automáticamente a Keycloak
        this.redirectToKeycloak();
    }

    private initializeForm(): void {
        this.signInForm = this._formBuilder.group({
            email     : ['', [Validators.required, Validators.email]],
            password  : ['', Validators.required],
            rememberMe: [''],
        });
    }

    private redirectToKeycloak(): void {
        // Pequeño delay para mostrar el loading
        setTimeout(() => {
            this._authService.redirectToKeycloakLogin();
        }, 500);
    }

    /**
     * Sign in manual (solo si showManualLogin es true)
     */
    signIn(): void {
        if (!this.showManualLogin) {
            this.redirectToKeycloak();
            return;
        }

        this.isLoading = true;
        // Aquí puedes implementar login manual si lo necesitas
        // Por ahora, redirigir a Keycloak
        this._authService.redirectToKeycloakLogin();
    }

    /**
     * Login directo con Keycloak
     */
    loginWithKeycloak(): void {
        this.isLoading = true;
        this._authService.redirectToKeycloakLogin();
    }
}
 