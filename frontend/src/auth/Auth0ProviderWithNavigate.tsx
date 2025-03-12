import React from "react";
import { AppState, Auth0Provider, User } from "@auth0/auth0-react";
type Props = {
  children: React.ReactNode;
};
const Auth0ProviderWithNavigation = ({ children }: Props) => {
  const domain = import.meta.env.VITE_AUTH0_DOMAIN;
  const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;
  const redirectURI = import.meta.env.VITE_AUTH0_CALLBACK_URL;
  if (!domain || !clientId || !redirectURI) {
    throw new Error("Unable to initialize auth!");
  }
  function handleRedirectCallback(appState?:AppState, user?:User) {
    console.log("USER", user)
  }
  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: redirectURI,
      }}
      onRedirectCallback={handleRedirectCallback}
    >
      {children}
    </Auth0Provider>
  );
};

export default Auth0ProviderWithNavigation;
