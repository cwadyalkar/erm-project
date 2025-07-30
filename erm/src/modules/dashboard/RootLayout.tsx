import { AuthProvider } from "../auth/hooks/useAuth";
import { DataProvider } from "../auth/hooks/useData";
import { Toaster } from "@/components/ui/sonner";
import type { ReactNode } from "react";

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <div className="">
      <AuthProvider>
        <DataProvider>
          {children}
          <Toaster />
        </DataProvider>
      </AuthProvider>
    </div>
  );
}
