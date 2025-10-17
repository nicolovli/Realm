import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { Auth0Provider } from "@auth0/auth0-react";
import { ApolloProvider } from "@apollo/client/react";
import { client } from "./lib/apolloClient.ts";

interface AppState {
  returnTo?: string;
}

const onRedirectCallback = (appState?: AppState) => {
  window.history.replaceState(
    {},
    document.title,
    appState?.returnTo || window.location.pathname,
  );
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Auth0Provider
      domain="dev-bv5d6fo2ydfwxau0.us.auth0.com"
      clientId="eLRnXNYnJauca8ahS7Xjio55qndd6jJw"
      authorizationParams={{
        redirect_uri: window.location.origin + "/project2",
      }}
      onRedirectCallback={onRedirectCallback}
    >
      <ApolloProvider client={client}>
        <BrowserRouter basename="/project2">
          <App />
        </BrowserRouter>
      </ApolloProvider>
    </Auth0Provider>
  </StrictMode>,
);
