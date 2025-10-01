import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/hooks/use-toast";

interface Props {
  children: React.ReactElement;
  role?: "admin" | "customer"; // optional role check
}

const ProtectedRoute: React.FC<Props> = ({ children, role }) => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    let mounted = true;

    const checkAuth = async () => {
      try {
        const { data: userData, error: userError } =
          await supabase.auth.getUser();
        if (!mounted) return;

        if (userError || !userData?.user) {
          setAuthenticated(false);
          return;
        }

        setAuthenticated(true);

        // Fetch role from "users" table
        const { data: roleData, error: roleError } = await supabase
          .from("users")
          .select("role")
          .eq("id", userData.user.id)
          .single();

        if (roleError) {
          console.error("Error fetching role:", roleError);
          setUserRole("customer"); // fallback role
        } else {
          setUserRole(roleData?.role || "customer");
        }
      } catch (err) {
        console.error("ProtectedRoute error:", err);
        setAuthenticated(false);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    checkAuth();

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Checking authentication...</p>
      </div>
    );
  }

  if (!authenticated) {
    // Redirect to login page and preserve the original location
    return <Navigate to="/auth" replace state={{ from: location.pathname }} />;
  }

  if (role && userRole !== role) {
    // Only show toast once
    toast({
      title: "Access denied",
      description: "You do not have permission to access this page.",
      variant: "destructive",
    });
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
