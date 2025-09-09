import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { LeafletMap } from "@/components/leaflet-map";
import { Link } from "wouter";
import type { Driver } from "@shared/schema";

export default function Tracking() {
  const { data: drivers = [], isLoading } = useQuery<Driver[]>({
    queryKey: ["/api/drivers"],
    refetchInterval: 5000, // Refresh every 5 seconds
  });

  const availableCount = drivers.filter(d => d.status === 'available').length;
  const onRideCount = drivers.filter(d => d.status === 'on-ride').length;
  const offlineCount = drivers.filter(d => d.status === 'offline').length;

  const nearbyAutos = drivers
    .filter(d => d.status === 'available' && d.lat && d.lng)
    .slice(0, 3)
    .map((driver, index) => ({
      ...driver,
      distance: `${(0.3 + index * 0.4).toFixed(1)} km away`
    }));

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-64"></div>
          <div className="h-96 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Track Autos</h1>
        <p className="text-muted-foreground">Real-time location of all autos around MBU campus</p>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <Card className="overflow-hidden shadow-sm" data-testid="card-tracking-map">
            <LeafletMap drivers={drivers} />
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="shadow-sm" data-testid="card-auto-status">
            <CardContent className="p-6">
              <h3 className="font-semibold text-foreground mb-4">Auto Status</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-foreground">Available</span>
                  </div>
                  <span className="text-sm font-semibold text-foreground" data-testid="text-available-count">
                    {availableCount}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm text-foreground">On Ride</span>
                  </div>
                  <span className="text-sm font-semibold text-foreground" data-testid="text-onride-count">
                    {onRideCount}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                    <span className="text-sm text-foreground">Offline</span>
                  </div>
                  <span className="text-sm font-semibold text-foreground" data-testid="text-offline-count">
                    {offlineCount}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm" data-testid="card-nearest-autos">
            <CardContent className="p-6">
              <h3 className="font-semibold text-foreground mb-4">Nearest Autos</h3>
              <div className="space-y-3">
                {nearbyAutos.map((auto) => (
                  <div key={auto.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <div className="font-medium text-foreground" data-testid={`text-auto-${auto.autoNumber}`}>
                        Auto #{auto.autoNumber}
                      </div>
                      <div className="text-xs text-muted-foreground">Driver: {auto.name}</div>
                      <div className="text-xs text-muted-foreground">{auto.distance}</div>
                    </div>
                    <div className="text-right">
                      <div className={`w-2 h-2 rounded-full ${
                        auto.status === 'available' ? 'bg-green-500' :
                        auto.status === 'on-ride' ? 'bg-yellow-500' : 'bg-gray-400'
                      }`}></div>
                      <div className="text-xs text-muted-foreground mt-1 capitalize">
                        {auto.status.replace('-', ' ')}
                      </div>
                    </div>
                  </div>
                ))}
                {nearbyAutos.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No autos available nearby
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm" data-testid="card-quick-actions">
            <CardContent className="p-6">
              <h3 className="font-semibold text-foreground mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link href="/booking" className="block">
                  <Button className="w-full" data-testid="button-book-nearest">
                    Book Nearest Auto
                  </Button>
                </Link>
                <Button variant="outline" className="w-full" data-testid="button-pickup-alert">
                  Set Pickup Alert
                </Button>
                <Button variant="outline" className="w-full" data-testid="button-call-direct">
                  Call Auto Direct
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
