import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { Link } from "wouter";

interface BookingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bookingDetails: {
    id: string;
    driver: string;
    autoNumber: string;
    pickupTime: string;
    fare: number;
  } | null;
}

export function BookingModal({ open, onOpenChange, bookingDetails }: BookingModalProps) {
  if (!bookingDetails) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md" data-testid="modal-booking-confirmation">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-foreground mb-2">
              Booking Confirmed!
            </DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground">Your ride has been successfully booked</p>
        </div>
        
        <div className="space-y-4 mb-6">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Booking ID:</span>
            <span className="font-medium text-foreground" data-testid="text-booking-id">
              {bookingDetails.id}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Driver:</span>
            <span className="font-medium text-foreground" data-testid="text-driver-info">
              {bookingDetails.driver} ({bookingDetails.autoNumber})
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Pickup:</span>
            <span className="font-medium text-foreground" data-testid="text-pickup-time">
              {bookingDetails.pickupTime}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Total Fare:</span>
            <span className="font-medium text-primary" data-testid="text-total-fare">
₹{bookingDetails.fare.toLocaleString()}
            </span>
          </div>
        </div>
        
        <div className="flex space-x-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => onOpenChange(false)}
            data-testid="button-close-modal"
          >
            Close
          </Button>
          <Link href="/tracking" className="flex-1">
            <Button
              className="w-full"
              onClick={() => onOpenChange(false)}
              data-testid="button-track-ride"
            >
              Track Ride
            </Button>
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
}
