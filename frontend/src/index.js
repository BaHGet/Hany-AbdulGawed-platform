import React from 'react';
import ReactDOM from 'react-dom/client';
import {HashRouter} from "react-router-dom";
import { Auth0Provider } from '@auth0/auth0-react';
import App from './App';



const root = ReactDOM.createRoot(document.getElementById('root'));
const redirect_url= 'https://hany-abdulgawed-platform.web.app/'
root.render(
    <HashRouter >
        <Auth0Provider
        domain="dev-ygrskzanm044w3be.us.auth0.com"
        clientId="vpwQ42rBahM2eVuTCkNFscsYWfnf1Wzo"
        authorizationParams={{
          redirect_uri:  redirect_url
        }}
        >
          <App redirect_url={redirect_url} />
        </Auth0Provider>
    </HashRouter>
);