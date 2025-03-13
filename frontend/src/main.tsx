import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import "./index.css";

import AppRoutes from "./AppRoutes.tsx";
import Auth0ProviderWithNavigation from "./auth/Auth0ProviderWithNavigate.tsx";
import { Toaster } from "./components/ui/sonner.tsx";
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Router>
      <QueryClientProvider client={queryClient}>
        <Auth0ProviderWithNavigation>
          <AppRoutes />
          <Toaster visibleToasts={1} position="top-right" richColors />
        </Auth0ProviderWithNavigation>
      </QueryClientProvider>
    </Router>
  </StrictMode>
);
