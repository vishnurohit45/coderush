import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, MapPin, ShieldCheck, Coins, Clock, Users, Car, TrendingUp, DollarSign } from "lucide-react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import type { AnalyticsData } from "@shared/schema";

export default function Home() {
  const { data: analytics } = useQuery<AnalyticsData>({
    queryKey: ["/api/analytics"],
  });

  return (
    <div className="fade-in">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl lg:text-6xl font-bold text-foreground leading-tight">
                  Smart Transport for
                  <span className="text-primary block">MBU Students</span>
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Smart, Fair, and Reliable Transport System designed specifically for Mbarara University students. Book rides, track autos, and travel safely across campus.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/booking">
                  <Button 
                    size="lg" 
                    className="px-8 py-4 text-lg transform hover:scale-105 transition-all"
                    data-testid="button-book-ride-hero"
                  >
                    <Calendar className="w-5 h-5 mr-2" />
                    Book a Ride
                  </Button>
                </Link>
                <Link href="/tracking">
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="px-8 py-4 text-lg transition-all"
                    data-testid="button-track-autos-hero"
                  >
                    <MapPin className="w-5 h-5 mr-2" />
                    Track Autos
                  </Button>
                </Link>
              </div>

              {/* Live Banner */}
              <Card className="shadow-sm" data-testid="card-live-availability">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full pulse-dot"></div>
                      <span className="font-semibold text-foreground">Live Auto Availability</span>
                    </div>
                    <span className="text-sm text-muted-foreground">Updated 2 min ago</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600" data-testid="text-available-count">
                        {analytics?.activeDrivers || 12}
                      </div>
                      <div className="text-sm text-muted-foreground">Available</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-600" data-testid="text-onride-count">8</div>
                      <div className="text-sm text-muted-foreground">On Ride</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-400" data-testid="text-offline-count">3</div>
                      <div className="text-sm text-muted-foreground">Offline</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600" 
                alt="University campus with transport" 
                className="rounded-2xl shadow-2xl w-full h-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent rounded-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Why Choose Smart MBU Transport?</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">Built by students, for students. Our transport system prioritizes your safety, convenience, and budget.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="hover:shadow-md transition-shadow" data-testid="card-safety-feature">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <ShieldCheck className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Safety First</h3>
                <p className="text-muted-foreground">Verified drivers, real-time tracking, and emergency SOS features keep you safe throughout your journey.</p>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-md transition-shadow" data-testid="card-pricing-feature">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                  <Coins className="w-6 h-6 text-secondary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Student-Friendly Pricing</h3>
                <p className="text-muted-foreground">Transparent fare calculation with shared ride options to split costs and save money.</p>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-md transition-shadow" data-testid="card-realtime-feature">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Real-Time Updates</h3>
                <p className="text-muted-foreground">Live auto tracking, accurate arrival times, and instant booking confirmations.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary" data-testid="text-happy-students">
                {analytics?.activeStudents?.toLocaleString() || "2,500+"}
              </div>
              <div className="text-sm text-muted-foreground mt-1">Happy Students</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary" data-testid="text-verified-drivers">
                {analytics?.drivers || "50+"}
              </div>
              <div className="text-sm text-muted-foreground mt-1">Verified Drivers</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary" data-testid="text-rides-completed">
                {analytics?.rides ? `${analytics.rides * 100}+` : "15,000+"}
              </div>
              <div className="text-sm text-muted-foreground mt-1">Rides Completed</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary" data-testid="text-safety-rating">
                {analytics?.avgRating ? `${(parseFloat(analytics.avgRating) * 20).toFixed(0)}%` : "98%"}
              </div>
              <div className="text-sm text-muted-foreground mt-1">Safety Rating</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
