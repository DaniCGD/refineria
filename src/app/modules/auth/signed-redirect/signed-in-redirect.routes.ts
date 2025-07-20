import { Routes } from '@angular/router';
import { SignedInRedirectComponent } from 'app/modules/auth/signed-redirect/signed-in-redirect.component'

export default [
    {
        path     : '',
        component: SignedInRedirectComponent,
    },
] as Routes;
