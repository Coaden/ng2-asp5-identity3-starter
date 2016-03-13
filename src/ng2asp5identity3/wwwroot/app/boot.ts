import {provide} from 'angular2/core';
import {bootstrap} from 'angular2/platform/browser';
import {    ROUTER_PROVIDERS,
            HashLocationStrategy,
            LocationStrategy    } from 'angular2/router';
import {Http, HTTP_PROVIDERS, Response} from 'angular2/http';

import {SERVICES_INJECTABLES} from './services/services';
import {AppComponent} from './app.component';


bootstrap(AppComponent, [
    ROUTER_PROVIDERS,
    provide(LocationStrategy, {useClass: HashLocationStrategy}),
    HTTP_PROVIDERS,
    SERVICES_INJECTABLES
]);
