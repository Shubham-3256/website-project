import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="text-center space-y-6 max-w-md">
        <h1 className="text-7xl font-extrabold text-primary">404</h1>
        <p className="text-xl text-muted-foreground">
          Oops! The page{" "}
          <span className="font-mono text-red-500">{location.pathname}</span>
          doesn’t exist.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
          <Button asChild>
            <Link to="/">🏠 Go Home</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/menu">🍴 View Menu</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
