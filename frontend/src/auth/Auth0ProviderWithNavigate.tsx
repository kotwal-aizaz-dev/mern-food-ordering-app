import React from "react";
import { Auth0Provider} from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";


// auth params from the env 
const domain = import.meta.env.VITE_AUTH0_DOMAIN;
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;
const redirectURI = import.meta.env.VITE_AUTH0_CALLBACK_URL;
// adding audience to make sure that all the requests are coming from the same Auth0 api server
const audience = import.meta.env.VITE_AUTH0_AUDIENCE
// Prop types 
type Props = {
  children: React.ReactNode;
};

// Component 
const Auth0ProviderWithNavigation = ({ children }: Props) => {
  // access the create user method from custom react-query hook 
  const navigate = useNavigate()

  // check if we have the access to auth 
  if (!domain || !clientId || !redirectURI || !audience) {
    throw new Error("Unable to initialize auth!");
  }

  // handle login/sign up redirect 
  function handleRedirectCallback() {
    // navigate to auth callback to handle the token
    navigate("/auth-callback")

  }
  // Auth Wrapper JSX
  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: redirectURI,
        audience
      }}
      onRedirectCallback={handleRedirectCallback}
    >
      {children}
    </Auth0Provider>
  );
};

export default Auth0ProviderWithNavigation;
