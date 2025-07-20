import { NgIf } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { FuseFullscreenComponent } from '@fuse/components/fullscreen';
import { FuseLoadingBarComponent } from '@fuse/components/loading-bar';
import { FuseNavigationService, FuseVerticalNavigationComponent } from '@fuse/components/navigation';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { NavigationService } from 'app/core/navigation/navigation.service';
import { Navigation } from 'app/core/navigation/navigation.types';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/core/user/user.types';
import { KeycloakAuthService } from 'app/shared/service/keycloak-auth.service'; // Importar tu servicio
import { LanguagesComponent } from 'app/layout/common/languages/languages.component';
import { MessagesComponent } from 'app/layout/common/messages/messages.component';
import { NotificationsComponent } from 'app/layout/common/notifications/notifications.component';
import { QuickChatComponent } from 'app/layout/common/quick-chat/quick-chat.component';
import { SearchComponent } from 'app/layout/common/search/search.component';
import { ShortcutsComponent } from 'app/layout/common/shortcuts/shortcuts.component';
import { UserComponent } from 'app/layout/common/user/user.component';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector     : 'classy-layout',
    templateUrl  : './classy.component.html',
    encapsulation: ViewEncapsulation.None,
    standalone   : true,
    imports      : [FuseLoadingBarComponent, FuseVerticalNavigationComponent, NotificationsComponent, UserComponent, NgIf, MatIconModule, MatButtonModule, LanguagesComponent, FuseFullscreenComponent, SearchComponent, ShortcutsComponent, MessagesComponent, RouterOutlet, QuickChatComponent],
})
export class ClassyLayoutComponent implements OnInit, OnDestroy {
    isScreenSmall: boolean;
    navigation: Navigation;
    user: User | null = null; // CAMBIO: Inicializar como null
    isLoadingUser = true; // CAMBIO: Añadir estado de carga
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private _activatedRoute: ActivatedRoute,
        private _router: Router,
        private _navigationService: NavigationService,
        private _userService: UserService,
        private _keycloakAuthService: KeycloakAuthService, // CAMBIO: Inyectar KeycloakAuthService
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _fuseNavigationService: FuseNavigationService,
    ) {}

    get currentYear(): number {
        return new Date().getFullYear();
    }

    ngOnInit(): void {
        // Subscribe to navigation data
        this._navigationService.navigation$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((navigation: Navigation) => {
                this.navigation = navigation;
            });

        // CAMBIO: Suscribirse al UserService con manejo de undefined
        this._userService.user$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((user: User) => {
                console.log('👤 Usuario desde UserService:', user);
                this.user = user || null;
                
                // Si no hay usuario en UserService, intentar cargar desde Keycloak
                if (!user && this._keycloakAuthService.isAuthenticated) {
                    console.log('🔄 Usuario no encontrado en UserService, cargando desde Keycloak...');
                    this.loadUserFromKeycloak();
                } else if (!user) {
                    this.isLoadingUser = false;
                }
            });

        // Subscribe to media changes
        this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({matchingAliases}) => {
                this.isScreenSmall = !matchingAliases.includes('md');
            });

        // CAMBIO: Inicializar usuario si está autenticado
        this.initializeUser();
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    toggleNavigation(name: string): void {
        const navigation = this._fuseNavigationService.getComponent<FuseVerticalNavigationComponent>(name);
        if (navigation) {
            navigation.toggle();
        }
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    private initializeUser(): void {
        console.log('🔄 Inicializando usuario en ClassyLayout...');
        
        // Si ya tenemos usuario, no hacer nada
        if (this.user) {
            this.isLoadingUser = false;
            return;
        }

        // Si está autenticado pero no tenemos usuario, cargar desde Keycloak
        if (this._keycloakAuthService.isAuthenticated) {
            this.loadUserFromKeycloak();
        } else {
            this.isLoadingUser = false;
        }
    }

    private loadUserFromKeycloak(): void {
        this.isLoadingUser = true;
        
        this._keycloakAuthService.getUserProfile()
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe({
                next: (user: User) => {
                    console.log('✅ Usuario cargado desde Keycloak:', user);
                    
                    // Actualizar UserService para sincronizar
                    this._userService.user = user;
                    
                    this.user = user;
                    this.isLoadingUser = false;
                },
                error: (error) => {
                    console.error('🔴 Error cargando usuario desde Keycloak:', error);
                    this.user = null;
                    this.isLoadingUser = false;
                }
            });
    }
}
