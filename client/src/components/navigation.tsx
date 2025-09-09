import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Bus, Menu, X } from "lucide-react";

export function Navigation() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/booking", label: "Book Ride" },
    { path: "/tracking", label: "Track Autos" },
    { path: "/pricing", label: "Pricing" },
    { path: "/driver", label: "Driver" },
    { path: "/admin", label: "Admin" },
    { path: "/contact", label: "Contact" },
  ];

  const isActive = (path: string) => {
    if (path === "/" && location === "/") return true;
    return path !== "/" && location.startsWith(path);
  };

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-3" data-testid="link-home">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Bus className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Smart MBU</h1>
              <p className="text-xs text-muted-foreground">Transport System</p>
            </div>
          </Link>
          
          <div className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => (
              <Link key={item.path} href={item.path}>
                <Button
                  variant="ghost"
                  className={`px-4 py-2 text-sm font-medium transition-colors ${
                    isActive(item.path)
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  data-testid={`link-nav-${item.label.toLowerCase().replace(" ", "-")}`}
                >
                  {item.label}
                </Button>
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-3">
            <Link href="/booking">
              <Button data-testid="button-book-ride-header">
                Book Ride
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-testid="button-mobile-menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </Button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-background">
            <div className="px-4 py-3 space-y-3">
              {navItems.map((item) => (
                <Link key={item.path} href={item.path}>
                  <Button
                    variant="ghost"
                    className={`block w-full text-left px-3 py-2 text-sm font-medium ${
                      isActive(item.path)
                        ? "text-primary"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                    data-testid={`link-mobile-${item.label.toLowerCase().replace(" ", "-")}`}
                  >
                    {item.label}
                  </Button>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
