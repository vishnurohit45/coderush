import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Wallet, Car, Star, Users } from "lucide-react";
import { weeklyEarnings } from "@/lib/mock-data";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Driver() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [driverId, setDriverId] = useState("DEMO123");
  const [password, setPassword] = useState("password");
  const [driverData, setDriverData] = useState<any>(null);

  const { toast } = useToast();

  const loginMutation = useMutation({
    mutationFn: async (credentials: { driverId: string; password: string }) => {
      const response = await apiRequest("POST", "/api/auth/driver", credentials);
      return response.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        setIsLoggedIn(true);
        setDriverData(data.driver);
        toast({
          title: "Login Successful",
          description: "Welcome back to your dashboard!",
        });
      } else {
        toast({
          title: "Login Failed",
          description: data.message || "Invalid credentials",
          variant: "destructive",
        });
      }
    },
    onError: (error: any) => {
      toast({
        title: "Login Error",
        description: error.message || "Failed to login",
        variant: "destructive",
      });
    },
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate({ driverId, password });
  };

  if (!isLoggedIn) {
    return (
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-16 fade-in">
        <Card className="shadow-sm" data-testid="card-driver-login">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-foreground mb-6 text-center">Driver Sign In</h2>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="driver-id" className="block text-sm font-medium text-foreground mb-2">
                  Driver ID
                </Label>
                <Input
                  type="text"
                  placeholder="Enter your driver ID"
                  value={driverId}
                  onChange={(e) => setDriverId(e.target.value)}
                  data-testid="input-driver-id"
                />
              </div>
              <div>
                <Label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                  Password
                </Label>
                <Input
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  data-testid="input-password"
                />
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={loginMutation.isPending}
                data-testid="button-driver-signin"
              >
                {loginMutation.isPending ? "Signing In..." : "Sign In"}
              </Button>
            </form>
            <p className="text-xs text-muted-foreground mt-4 text-center">
              Demo credentials: ID: DEMO123, Password: password
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Driver Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {driverData?.name || "Driver"}! Manage your rides and track earnings</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        <Card className="shadow-sm" data-testid="card-daily-earnings">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Wallet className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Today's Earnings</p>
                <p className="text-2xl font-bold text-foreground" data-testid="text-daily-earnings">₹2,250</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm" data-testid="card-rides-completed">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
                <Car className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Rides Completed</p>
                <p className="text-2xl font-bold text-foreground" data-testid="text-rides-completed">8</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm" data-testid="card-driver-rating">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Star className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Rating</p>
                <p className="text-2xl font-bold text-foreground" data-testid="text-driver-rating">
                  {driverData?.rating || "4.8"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="shadow-sm" data-testid="card-ride-requests">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Upcoming Ride Requests</h3>
            <div className="space-y-4">
              <div className="p-4 border border-border rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium text-foreground">Student #S2501</p>
                    <p className="text-sm text-muted-foreground">Requested 5 min ago</p>
                  </div>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">New</span>
                </div>
                <div className="space-y-1 text-sm">
                  <p><span className="text-muted-foreground">From:</span> <span className="text-foreground">Library</span></p>
                  <p><span className="text-muted-foreground">To:</span> <span className="text-foreground">Student Hostels</span></p>
                  <p><span className="text-muted-foreground">Passengers:</span> <span className="text-foreground">2</span></p>
                  <p><span className="text-muted-foreground">Fare:</span> <span className="text-primary font-semibold">₹65</span></p>
                </div>
                <div className="flex space-x-2 mt-3">
                  <Button size="sm" data-testid="button-accept-ride-1">Accept</Button>
                  <Button variant="outline" size="sm" data-testid="button-decline-ride-1">Decline</Button>
                </div>
              </div>

              <div className="p-4 border border-border rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium text-foreground">Student #S1847</p>
                    <p className="text-sm text-muted-foreground">Requested 8 min ago</p>
                  </div>
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">Shared</span>
                </div>
                <div className="space-y-1 text-sm">
                  <p><span className="text-muted-foreground">From:</span> <span className="text-foreground">Main Gate</span></p>
                  <p><span className="text-muted-foreground">To:</span> <span className="text-foreground">Mbarara Town</span></p>
                  <p><span className="text-muted-foreground">Passengers:</span> <span className="text-foreground">1 (3 more slots)</span></p>
                  <p><span className="text-muted-foreground">Fare:</span> <span className="text-primary font-semibold">₹80</span></p>
                </div>
                <div className="flex space-x-2 mt-3">
                  <Button size="sm" data-testid="button-accept-ride-2">Accept</Button>
                  <Button variant="outline" size="sm" data-testid="button-decline-ride-2">Decline</Button>
                </div>
              </div>

              <div className="text-center text-sm text-muted-foreground py-4">
                No more pending requests
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="shadow-sm" data-testid="card-weekly-earnings">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Weekly Earnings</h3>
              <div className="space-y-3">
                {weeklyEarnings.map((day) => (
                  <div key={day.day} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{day.day}</span>
                    <span className="text-foreground font-medium" data-testid={`text-${day.day.toLowerCase()}-earnings`}>
                      ₹{day.amount.toLocaleString()}
                    </span>
                  </div>
                ))}
                <div className="flex justify-between text-sm font-semibold border-t border-border pt-2">
                  <span className="text-foreground">This Week Total</span>
                  <span className="text-primary" data-testid="text-weekly-total">
                    ₹{weeklyEarnings.reduce((sum, day) => sum + day.amount, 0).toLocaleString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm" data-testid="card-driver-controls">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Status & Controls</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-foreground">Status</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium text-foreground" data-testid="text-driver-status">Online</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-foreground">Auto Location</span>
                  <span className="text-sm text-muted-foreground" data-testid="text-auto-location">Near Library</span>
                </div>
                <div className="space-y-2">
                  <Button variant="destructive" className="w-full" data-testid="button-go-offline">
                    Go Offline
                  </Button>
                  <Button variant="outline" className="w-full" data-testid="button-emergency-alert">
                    Emergency Alert
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
