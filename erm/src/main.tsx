import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import RootLayout from "./modules/dashboard/RootLayout.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RootLayout>
      <App />
    </RootLayout>
  </StrictMode>
);
