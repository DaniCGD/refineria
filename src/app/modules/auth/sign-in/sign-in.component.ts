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
import { AuthService } from 'app/core/auth/service/auth.service';
import { KeycloakAuthService } from 'app/core/auth/service/keycloak-auth.service';

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
export class AuthSignInComponent implements OnInit
{
    @ViewChild('signInNgForm') signInNgForm: NgForm;
    public backgroundImage = 'assets/images/pages/sign-in/login-background.jpg';
    alert: { type: FuseAlertType; message: string } = {
        type   : 'success',
        message: '',
    };
    signInForm: UntypedFormGroup;
    showAlert: boolean = false;
    isLoading: boolean = false;

    constructor(
        private _activatedRoute: ActivatedRoute,
        //private _authService: AuthService,
        private _authService: KeycloakAuthService,
        private _formBuilder: UntypedFormBuilder,
        private _router: Router,
        private _keycloakService: KeycloakService
    )
    {
    }

    ngOnInit(): void
    {
        // CAMBIO 9: Solo verificar si ya está autenticado, sin disparar verificaciones
        try {
            const keycloakInstance = this._keycloakService.getKeycloakInstance();
            if (keycloakInstance.authenticated) {
                const redirectURL = this._activatedRoute.snapshot.queryParamMap.get('redirectURL') || '/dashboard';
                this._router.navigateByUrl(redirectURL);
                return;
            }
        } catch (error) {
            // Keycloak no inicializado, continuar con el formulario
        }

        // Create the form
        this.signInForm = this._formBuilder.group({
            email     : ['', [Validators.required, Validators.email]],
            password  : ['', Validators.required],
            rememberMe: [''],
        });
    }

    /**
     * CAMBIO 10: Sign in que solo redirige
     */
    signIn(): void
    {
        this.isLoading = true;
        this._authService.redirectToKeycloakLogin();
    }

    /**
     * Login directo con Keycloak
     */
    loginWithKeycloak(): void
    {
        this.isLoading = true;
        this._authService.redirectToKeycloakLogin();
    }
}
