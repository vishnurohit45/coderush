import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Clock, Route, Car, Shield, MapPin, PhoneCall, User, Users } from "lucide-react";
import { BookingModal } from "@/components/booking-modal";
import { locations } from "@/lib/mock-data";
import { calculateFare, type FareCalculation } from "@/lib/fare-calculator";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Ride } from "@shared/schema";

export default function Booking() {
  const [pickupLocation, setPickupLocation] = useState("");
  const [dropLocation, setDropLocation] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState("");
  const [passengers, setPassengers] = useState("1");
  const [rideType, setRideType] = useState("single");
  const [fareEstimate, setFareEstimate] = useState<FareCalculation | null>(null);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [bookingDetails, setBookingDetails] = useState<any>(null);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch user's bookings
  const { data: userRides = [], isLoading: ridesLoading } = useQuery<Ride[]>({
    queryKey: ["/api/rides"],
    refetchInterval: 10000, // Refresh every 10 seconds
  });
  const bookRideMutation = useMutation({
    mutationFn: async (rideData: any) => {
      const response = await apiRequest("POST", "/api/rides", rideData);
      return response.json();
    },
    onSuccess: (ride) => {
      queryClient.invalidateQueries({ queryKey: ["/api/rides"] });
      
      // Create booking details for modal
      const details = {
        id: `#BK${ride.id.slice(-6).toUpperCase()}`,
        driver: "John Kamau",
        autoNumber: "Auto #A101",
        pickupTime: "5 minutes",
        fare: parseFloat(ride.fare)
      };
      
      setBookingDetails(details);
      setBookingModalOpen(true);
      
      toast({
        title: "Ride Booked Successfully!",
        description: "Your ride has been confirmed. Check your notifications for updates.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Booking Failed",
        description: error.message || "Failed to book ride. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleCalculateFare = () => {
    if (!pickupLocation || !dropLocation) {
      toast({
        title: "Missing Information",
        description: "Please select both pickup and drop locations.",
        variant: "destructive",
      });
      return;
    }

    const scheduledTime = date && time ? new Date(`${date}T${time}`) : undefined;
    const estimate = calculateFare(pickupLocation, dropLocation, parseInt(passengers), scheduledTime);
    setFareEstimate(estimate);
  };

  const handleBookRide = () => {
    if (!pickupLocation || !dropLocation) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const scheduledAt = date && time ? `${date}T${time}:00.000Z` : null;
    const estimate = fareEstimate || calculateFare(pickupLocation, dropLocation, parseInt(passengers));

    const rideData = {
      pickupLocation,
      dropLocation,
      passengers: parseInt(passengers),
      rideType,
      fare: estimate.total.toString(),
      scheduledAt,
      userId: null, // Would be set from auth context
      driverId: null, // Would be assigned by system
    };

    bookRideMutation.mutate(rideData);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'requested': return 'bg-blue-100 text-blue-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Book Your Ride</h1>
        <p className="text-muted-foreground">Plan your journey across Tirupathi with ease</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2">
          <Card className="shadow-sm" data-testid="card-booking-form">
            <CardContent className="p-6">
              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="pickup-location" className="block text-sm font-medium text-foreground mb-2">
                      Pickup Location
                    </Label>
                    <Select value={pickupLocation} onValueChange={setPickupLocation}>
                      <SelectTrigger data-testid="select-pickup-location">
                        <SelectValue placeholder="Select pickup point" />
                      </SelectTrigger>
                      <SelectContent>
                        {locations.map((location) => (
                          <SelectItem key={location.value} value={location.value}>
                            {location.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="drop-location" className="block text-sm font-medium text-foreground mb-2">
                      Drop Location
                    </Label>
                    <Select value={dropLocation} onValueChange={setDropLocation}>
                      <SelectTrigger data-testid="select-drop-location">
                        <SelectValue placeholder="Select destination" />
                      </SelectTrigger>
                      <SelectContent>
                        {locations.map((location) => (
                          <SelectItem key={location.value} value={location.value}>
                            {location.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="date" className="block text-sm font-medium text-foreground mb-2">
                      Date
                    </Label>
                    <Input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      data-testid="input-date"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="time" className="block text-sm font-medium text-foreground mb-2">
                      Time
                    </Label>
                    <Input
                      type="time"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      data-testid="input-time"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="passengers" className="block text-sm font-medium text-foreground mb-2">
                    Number of Passengers
                  </Label>
                  <Select value={passengers} onValueChange={setPassengers}>
                    <SelectTrigger data-testid="select-passengers">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 Passenger</SelectItem>
                      <SelectItem value="2">2 Passengers</SelectItem>
                      <SelectItem value="3">3 Passengers</SelectItem>
                      <SelectItem value="4">4 Passengers</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="block text-sm font-medium text-foreground mb-3">Ride Type</Label>
                  <RadioGroup value={rideType} onValueChange={setRideType} className="grid md:grid-cols-2 gap-4">
                    <div className="relative">
                      <RadioGroupItem
                        value="single"
                        id="single"
                        className="peer sr-only"
                        data-testid="radio-single-ride"
                      />
                      <Label
                        htmlFor="single"
                        className="peer-checked:border-primary peer-checked:bg-primary/5 cursor-pointer p-4 border-2 border-border rounded-lg transition-all flex items-center space-x-3"
                      >
                        <User className="w-5 h-5 text-primary" />
                        <div>
                          <div className="font-semibold text-foreground">Single Ride</div>
                          <div className="text-sm text-muted-foreground">Private journey, just for you</div>
                        </div>
                      </Label>
                    </div>
                    
                    <div className="relative">
                      <RadioGroupItem
                        value="shared"
                        id="shared"
                        className="peer sr-only"
                        data-testid="radio-shared-ride"
                      />
                      <Label
                        htmlFor="shared"
                        className="peer-checked:border-primary peer-checked:bg-primary/5 cursor-pointer p-4 border-2 border-border rounded-lg transition-all flex items-center space-x-3"
                      >
                        <Users className="w-5 h-5 text-primary" />
                        <div>
                          <div className="font-semibold text-foreground">Shared Ride</div>
                          <div className="text-sm text-muted-foreground">Split costs with other students</div>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="flex space-x-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={handleCalculateFare}
                    data-testid="button-calculate-fare"
                  >
                    Calculate Fare
                  </Button>
                  <Button
                    type="button"
                    onClick={handleBookRide}
                    disabled={bookRideMutation.isPending}
                    className="flex-1"
                    data-testid="button-book-ride"
                  >
                    {bookRideMutation.isPending ? "Booking..." : "Book Ride"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="shadow-sm" data-testid="card-fare-estimate">
            <CardContent className="p-6">
              <h3 className="font-semibold text-foreground mb-4">Fare Estimate</h3>
              {fareEstimate ? (
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Base Fare</span>
                    <span className="text-foreground" data-testid="text-base-fare">
                      ₹{fareEstimate.baseFare.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Distance ({fareEstimate.distance} km)</span>
                    <span className="text-foreground" data-testid="text-distance-fare">
                      ₹{fareEstimate.distanceFare.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Time ({fareEstimate.estimatedTime} min)</span>
                    <span className="text-foreground" data-testid="text-time-fare">
                      ₹{fareEstimate.timeFare.toLocaleString()}
                    </span>
                  </div>
                  <hr className="border-border" />
                  <div className="flex justify-between font-semibold">
                    <span className="text-foreground">Total</span>
                    <span className="text-primary" data-testid="text-total-fare">
                      ₹{fareEstimate.total.toLocaleString()}
                    </span>
                  </div>
                  {rideType === "shared" && (
                    <div className="text-xs text-muted-foreground">
                      <span data-testid="text-shared-fare">
                        Shared ride: ₹{fareEstimate.sharedTotal.toLocaleString()} per person
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Select locations and calculate to see fare estimate</p>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-sm" data-testid="card-journey-details">
            <CardContent className="p-6">
              <h3 className="font-semibold text-foreground mb-4">Journey Details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Estimated Time:</span>
                  <span className="text-foreground" data-testid="text-estimated-time">
                    {fareEstimate ? `${fareEstimate.estimatedTime} minutes` : "--"}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Route className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Distance:</span>
                  <span className="text-foreground" data-testid="text-distance">
                    {fareEstimate ? `${fareEstimate.distance} km` : "--"}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Car className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Available Autos:</span>
                  <span className="text-foreground" data-testid="text-available-autos">5 nearby</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm" data-testid="card-safety-features">
            <CardContent className="p-6">
              <h3 className="font-semibold text-foreground mb-4">Safety Features</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-green-600" />
                  <span className="text-muted-foreground">Verified Driver</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  <span className="text-muted-foreground">Live Tracking</span>
                </div>
                <div className="flex items-center space-x-2">
                  <PhoneCall className="w-4 h-4 text-red-600" />
                  <span className="text-muted-foreground">Emergency SOS</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* My Bookings Section */}
      <Card className="shadow-sm" data-testid="card-my-bookings">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">My Recent Bookings</h3>
          {ridesLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse p-4 border border-border rounded-lg">
                  <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : userRides.length > 0 ? (
            <div className="space-y-4">
              {userRides.slice(0, 5).map((ride) => (
                <div key={ride.id} className="p-4 border border-border rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium text-foreground">
                        {locations.find(l => l.value === ride.pickupLocation)?.label || ride.pickupLocation} → {locations.find(l => l.value === ride.dropLocation)?.label || ride.dropLocation}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {ride.createdAt ? new Date(ride.createdAt).toLocaleDateString() : 'Recently'} • {ride.passengers} passenger{ride.passengers > 1 ? 's' : ''} • {ride.rideType}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(ride.status)}`}>
                        {ride.status.charAt(0).toUpperCase() + ride.status.slice(1).replace('-', ' ')}
                      </span>
                      <p className="text-sm font-semibold text-foreground mt-1">₹{parseFloat(ride.fare).toLocaleString()}</p>
                    </div>
                  </div>
                  {ride.scheduledAt && (
                    <p className="text-xs text-muted-foreground">
                      Scheduled: {new Date(ride.scheduledAt).toLocaleString()}
                    </p>
                  )}
                </div>
              ))}
              {userRides.length > 5 && (
                <p className="text-sm text-muted-foreground text-center">
                  Showing 5 most recent bookings
                </p>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <Car className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No bookings yet</p>
              <p className="text-sm text-muted-foreground">Your ride history will appear here</p>
            </div>
          )}
        </CardContent>
      </Card>
      <BookingModal
        open={bookingModalOpen}
        onOpenChange={setBookingModalOpen}
        bookingDetails={bookingDetails}
      />
    </div>
  );
}
