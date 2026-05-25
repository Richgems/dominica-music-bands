import React, { useEffect, useState } from "react";
import { Outlet, Link } from "react-router-dom";
import { Lock } from "lucide-react";
import { base44 } from "@/api/base44Client";

export default function AdminRoute() {
  const [authorized, setAuthorized] = useState(null);

  useEffect(() => {
    base44.auth.me().then(user => {
      if (!user) {
        base44.auth.redirectToLogin(window.location.pathname);
        return;
      }
      setAuthorized(user.role === "admin");
    }).catch(() => {
      base44.auth.redirectToLogin(window.location.pathname);
    });
  }, []);

  if (authorized === null) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!authorized) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-background gap-4">
        <Lock className="w-12 h-12 text-muted-foreground" />
        <h1 className="font-heading text-2xl font-bold">Access Restricted</h1>
        <p className="text-muted-foreground text-sm">This area is for administrators only.</p>
        <Link to="/" className="text-primary underline text-sm">Return to site</Link>
      </div>
    );
  }

  return <Outlet />;
}