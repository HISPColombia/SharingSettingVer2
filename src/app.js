const dhisDevConfig = DHIS_CONFIG; // eslint-disable-line
if (process.env.NODE_ENV !== 'production') {
    //jQuery.ajaxSetup({ headers: { Authorization: dhisDevConfig.authorization } }); // eslint-disable-line
}

import React from 'react';
import { render } from 'react-dom';
import log from 'loglevel';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import LoadingMask from 'd2-ui/lib/loading-mask/LoadingMask.component';

//style app
 import './scss/app.scss'

//DHIS
import d2 from 'd2/lib/d2';
//import dhis2 from 'd2-ui/lib/header-bar/dhis2';
import appTheme from './theme';

//Components
import Front from './Front'

/*
if (process.env.NODE_ENV !== 'production') {
    jQuery.ajaxSetup({ // eslint-disable-line no-undef
        headers: {
            Authorization: `Basic ${btoa('admin:district')}`,
        },
    });
}
*/

// Render the a LoadingMask to show the user the app is in loading
// The consecutive render after we did our setup will replace this loading mask
// with the rendered version of the application.
render( <MuiThemeProvider muiTheme={appTheme}><LoadingMask /></MuiThemeProvider>,
    document.getElementById('app'));

function configI18n(userSettings) {
    const uiLocale = userSettings.keyUiLocale;
    if (uiLocale && uiLocale !== 'en') {
        // Add the language sources for the preferred locale
        d2.config.i18n.sources.add(`./i18n/i18n_module_${uiLocale}.properties`);
    }
    // Add english as locale for all cases (either as primary or fallback)
    d2.config.i18n.sources.add('./i18n/i18n_module_en.properties');
}

/**
 * Renders the application into the page.
 *
 * @param d2 Instance of the d2 library that is returned by the `init` function.
 */

function startApp(d2) {
    render(<Front d2={d2} />, document.querySelector('#app'));
}

// Load the application manifest to be able to determine the location of the Api
// After we have the location of the api, we can set it onto the d2.config object
// and initialise the library. We use the initialised library to pass it into the app
// to make it known on the context of the app, so the sub-components (primarily the d2-ui components)
// can use it to access the api, translations etc.

d2.getManifest('./manifest.webapp')
    .then(manifest => {
        const baseUrl = process.env.NODE_ENV === 'production' ? manifest.getBaseUrl() : dhisDevConfig.baseUrl;
        d2.config.baseUrl = `${baseUrl}/api`;
        // Set the baseUrl to localhost if we are in dev mode
        if (process.env.NODE_ENV !== 'production') {
            //dhis2.settings.baseUrl = baseUrl;
        }    })
    .then(d2.getUserSettings)
    .then(configI18n)
    .then(d2.init)
    .then(startApp)
    .catch(log.error.bind(log));







