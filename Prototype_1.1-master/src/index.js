/*  Components: App(container that is rendered in index to hold all visual app)

    Functions:ReactDOM.render
    
    Author: Skylar Riopel

    description: React Dom to render to screen

    Notes:
     */
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { Auth0Provider } from '@auth0/auth0-react'

ReactDOM.render(
    <Auth0Provider
      domain='dev-mj9n0oe0.us.auth0.com'
      clientId='793amqon0JTmn7TrMNb4NKLls9t598B5'
      redirectUri={window.location.origin}
    >
      <App />
    </Auth0Provider>,
  document.getElementById('root')
);

