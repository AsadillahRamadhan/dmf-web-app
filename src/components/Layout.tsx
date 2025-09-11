// src/components/Layout.tsx
import React from "react";
import { BottomNavigation } from "./BottomNavigation";

interface LayoutProps {
  children: React.ReactNode;
  activeTab: "home" | "history" | "user";
  onTabChange: (tab: "home" | "history" | "user") => void;
}

export function Layout({ children, activeTab, onTabChange }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="p-4 pb-20">
        <div className="max-w-md mx-auto">{children}</div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation activeTab={activeTab} onTabChange={onTabChange} />
    </div>
  );
}
