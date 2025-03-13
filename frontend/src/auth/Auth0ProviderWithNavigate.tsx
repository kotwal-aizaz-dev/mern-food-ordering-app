import React from "react";
import { AppState, Auth0Provider, User } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";

type Props = {
  children: React.ReactNode;
};

// auth params from the env 
const domain = import.meta.env.VITE_AUTH0_DOMAIN;
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;
const redirectURI = import.meta.env.VITE_AUTH0_CALLBACK_URL;

const Auth0ProviderWithNavigation = ({ children }: Props) => {
  // access the create user method from custom react-query hook 
  const navigate = useNavigate()

  // check if we have the access to auth 
  if (!domain || !clientId || !redirectURI) {
    throw new Error("Unable to initialize auth!");
  }

  // handle login/sign up redirect 
  function handleRedirectCallback(appState?: AppState, user?: User) {
    console.log("USER", user);
    console.log("App State", appState);
    navigate("/auth-callback")

  }
  // Auth Wrapper JSX
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
