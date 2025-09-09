import { Card, CardContent } from "@/components/ui/card";
import { popularRoutes } from "@/lib/mock-data";

export default function Pricing() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 fade-in">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-foreground mb-2">Transparent Pricing</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">Student-friendly rates with no hidden fees. Know exactly what you'll pay before you ride.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 mb-12">
        <Card className="shadow-sm" data-testid="card-base-fare">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-foreground mb-6">Base Fare Structure</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-border">
                <span className="text-foreground">Base Fare (First 2km)</span>
                <span className="font-semibold text-foreground" data-testid="text-base-fare-amount">₹20</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-border">
                <span className="text-foreground">Per Additional Kilometer</span>
                <span className="font-semibold text-foreground" data-testid="text-per-km-rate">₹8</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-border">
                <span className="text-foreground">Per Minute (Waiting/Traffic)</span>
                <span className="font-semibold text-foreground" data-testid="text-per-minute-rate">₹2</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-border">
                <span className="text-foreground">Night Surcharge (10PM-6AM)</span>
                <span className="font-semibold text-foreground" data-testid="text-night-surcharge">+25%</span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-foreground">Student Discount</span>
                <span className="font-semibold text-green-600" data-testid="text-student-discount">-10%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm" data-testid="card-shared-benefits">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-foreground mb-6">Shared Ride Benefits</h2>
            <div className="space-y-6">
              <div className="p-4 bg-primary/10 rounded-lg">
                <h3 className="font-semibold text-foreground mb-2">Split the Cost</h3>
                <p className="text-sm text-muted-foreground">Share your ride with other students going in the same direction and split the fare equally.</p>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-foreground">2 Passengers</span>
                  <span className="text-sm font-semibold text-primary" data-testid="text-2-passenger-savings">50% savings each</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-foreground">3 Passengers</span>
                  <span className="text-sm font-semibold text-primary" data-testid="text-3-passenger-savings">67% savings each</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-foreground">4 Passengers</span>
                  <span className="text-sm font-semibold text-primary" data-testid="text-4-passenger-savings">75% savings each</span>
                </div>
              </div>

              <div className="p-4 bg-secondary/10 rounded-lg">
                <h3 className="font-semibold text-foreground mb-2">Example: Library to Hostels</h3>
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Single Ride:</span>
                    <span className="text-foreground" data-testid="text-example-single">₹65</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shared (4 people):</span>
                    <span className="text-primary font-semibold" data-testid="text-example-shared">₹16 each</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Popular Routes */}
      <Card className="shadow-sm mb-8" data-testid="card-popular-routes">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold text-foreground mb-6">Popular Campus Routes</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 text-foreground font-medium">Route</th>
                  <th className="text-left py-3 text-foreground font-medium">Distance</th>
                  <th className="text-left py-3 text-foreground font-medium">Single Ride</th>
                  <th className="text-left py-3 text-foreground font-medium">Shared (Per Person)</th>
                  <th className="text-left py-3 text-foreground font-medium">Est. Time</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {popularRoutes.map((route, index) => (
                  <tr key={index} className="border-b border-border" data-testid={`row-route-${index}`}>
                    <td className="py-3 text-foreground">{route.from} → {route.to}</td>
                    <td className="py-3 text-muted-foreground">{route.distance}</td>
                    <td className="py-3 text-foreground">₹{route.singleFare.toLocaleString()}</td>
                    <td className="py-3 text-primary font-semibold">₹{route.sharedFare.toLocaleString()}</td>
                    <td className="py-3 text-muted-foreground">{route.estimatedTime}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* FAQ Section */}
      <Card className="shadow-sm" data-testid="card-pricing-faq">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold text-foreground mb-6">Pricing FAQ</h2>
          <div className="space-y-4">
            <div className="border-b border-border pb-4">
              <h3 className="font-medium text-foreground mb-2">How is the fare calculated?</h3>
              <p className="text-sm text-muted-foreground">Base fare covers the first 2km, then ₹8 per additional kilometer plus ₹2 per minute for waiting or traffic delays.</p>
            </div>
            <div className="border-b border-border pb-4">
              <h3 className="font-medium text-foreground mb-2">Do I get a student discount?</h3>
              <p className="text-sm text-muted-foreground">Yes! All MBU students with valid ID get a 10% discount on all rides automatically applied at booking.</p>
            </div>
            <div className="border-b border-border pb-4">
              <h3 className="font-medium text-foreground mb-2">How does shared ride pricing work?</h3>
              <p className="text-sm text-muted-foreground">The total fare is split equally among all passengers. You're only matched with students going to nearby destinations.</p>
            </div>
            <div>
              <h3 className="font-medium text-foreground mb-2">Are there any hidden fees?</h3>
              <p className="text-sm text-muted-foreground">No hidden fees! The price you see at booking is exactly what you pay. Night surcharge (25%) applies between 10PM-6AM.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
