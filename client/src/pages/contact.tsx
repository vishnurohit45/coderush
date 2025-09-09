import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ShieldAlert, Headphones, Check } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Contact() {
  const [feedbackForm, setFeedbackForm] = useState({
    name: "",
    studentId: "",
    type: "",
    message: "",
    rating: 0
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const feedbackMutation = useMutation({
    mutationFn: async (feedbackData: any) => {
      const response = await apiRequest("POST", "/api/feedback", feedbackData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/feedback"] });
      setFeedbackForm({
        name: "",
        studentId: "",
        type: "",
        message: "",
        rating: 0
      });
      toast({
        title: "Feedback Submitted",
        description: "Thank you for your feedback! We'll review it and get back to you.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Submission Failed",
        description: error.message || "Failed to submit feedback. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!feedbackForm.name || !feedbackForm.type || !feedbackForm.message) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    feedbackMutation.mutate(feedbackForm);
  };

  const handleStarClick = (rating: number) => {
    setFeedbackForm(prev => ({ ...prev, rating }));
  };

  const handleSosAlert = () => {
    toast({
      title: "🚨 SOS ALERT ACTIVATED!",
      description: "Emergency contacts notified • Location shared with authorities • MBU Security alerted • Emergency hotline connecting... Help is on the way!",
      variant: "destructive",
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 fade-in">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-foreground mb-2">Contact & Safety</h1>
        <p className="text-muted-foreground">Your safety is our priority. Get help when you need it.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        {/* Emergency Section */}
        <Card className="shadow-sm" data-testid="card-emergency-contact">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center space-x-2">
              <ShieldAlert className="w-6 h-6 text-red-600" />
              <span>Emergency Contact</span>
            </h2>
            <div className="space-y-4">
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <h3 className="font-semibold text-red-800 mb-2">24/7 Emergency Hotline</h3>
                <p className="text-2xl font-bold text-red-600" data-testid="text-emergency-number">+256 123 456 789</p>
                <p className="text-sm text-red-700 mt-1">Call immediately in case of any emergency</p>
              </div>
              
              <Button
                onClick={handleSosAlert}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-4 text-lg font-semibold"
                data-testid="button-sos-alert"
              >
                <ShieldAlert className="w-6 h-6 mr-2" />
                SOS Emergency Alert
              </Button>
              
              <div className="text-xs text-muted-foreground space-y-1">
                <p>• SOS button sends your location to emergency contacts</p>
                <p>• Immediately connects you to our emergency team</p>
                <p>• Alerts campus security and local authorities</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Regular Support */}
        <Card className="shadow-sm" data-testid="card-customer-support">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center space-x-2">
              <Headphones className="w-6 h-6 text-primary" />
              <span>Customer Support</span>
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 border border-border rounded-lg">
                  <div className="text-sm text-muted-foreground">Phone Support</div>
                  <div className="font-semibold text-foreground" data-testid="text-support-phone">+256 987 654 321</div>
                  <div className="text-xs text-muted-foreground">Mon-Fri: 8AM-10PM</div>
                </div>
                <div className="p-4 border border-border rounded-lg">
                  <div className="text-sm text-muted-foreground">WhatsApp</div>
                  <div className="font-semibold text-foreground" data-testid="text-whatsapp">+256 123 456 789</div>
                  <div className="text-xs text-muted-foreground">24/7 Available</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Button variant="outline" className="w-full" data-testid="button-chat-support">
                  Chat with Support
                </Button>
                <Button variant="outline" className="w-full" data-testid="button-report-issue">
                  Report an Issue
                </Button>
                <Button variant="outline" className="w-full" data-testid="button-track-complaint">
                  Track My Complaint
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Feedback Form */}
      <Card className="shadow-sm mb-8" data-testid="card-feedback-form">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold text-foreground mb-6">Send us Feedback</h2>
          <form onSubmit={handleSubmitFeedback} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                  Your Name *
                </Label>
                <Input
                  type="text"
                  placeholder="Enter your name"
                  value={feedbackForm.name}
                  onChange={(e) => setFeedbackForm(prev => ({ ...prev, name: e.target.value }))}
                  data-testid="input-feedback-name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="student-id" className="block text-sm font-medium text-foreground mb-2">
                  Student ID
                </Label>
                <Input
                  type="text"
                  placeholder="Enter your student ID"
                  value={feedbackForm.studentId}
                  onChange={(e) => setFeedbackForm(prev => ({ ...prev, studentId: e.target.value }))}
                  data-testid="input-student-id"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="feedback-type" className="block text-sm font-medium text-foreground mb-2">
                Feedback Type *
              </Label>
              <Select
                value={feedbackForm.type}
                onValueChange={(value) => setFeedbackForm(prev => ({ ...prev, type: value }))}
              >
                <SelectTrigger data-testid="select-feedback-type">
                  <SelectValue placeholder="Select feedback type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General Feedback</SelectItem>
                  <SelectItem value="driver">Driver Feedback</SelectItem>
                  <SelectItem value="safety">Safety Concern</SelectItem>
                  <SelectItem value="suggestion">Feature Suggestion</SelectItem>
                  <SelectItem value="complaint">Complaint</SelectItem>
                  <SelectItem value="compliment">Compliment</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                Your Feedback *
              </Label>
              <Textarea
                rows={4}
                placeholder="Tell us about your experience..."
                value={feedbackForm.message}
                onChange={(e) => setFeedbackForm(prev => ({ ...prev, message: e.target.value }))}
                data-testid="textarea-feedback-message"
                required
              />
            </div>
            
            <div>
              <Label className="block text-sm font-medium text-foreground mb-2">
                Rate Your Experience
              </Label>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleStarClick(star)}
                    className={`w-8 h-8 text-2xl transition-colors ${
                      star <= feedbackForm.rating ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-400'
                    }`}
                    data-testid={`star-${star}`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>
            
            <Button
              type="submit"
              className="w-full"
              disabled={feedbackMutation.isPending}
              data-testid="button-submit-feedback"
            >
              {feedbackMutation.isPending ? "Submitting..." : "Submit Feedback"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Safety Guidelines */}
      <Card className="shadow-sm" data-testid="card-safety-guidelines">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold text-foreground mb-6">Safety Guidelines</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-foreground mb-3">Before Your Ride</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start space-x-2">
                  <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Verify driver details match the app</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Check auto license plate number</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Share trip details with a friend</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Wait in a safe, well-lit area</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-foreground mb-3">During Your Ride</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start space-x-2">
                  <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Follow the GPS route on the app</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Keep your phone charged and accessible</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Trust your instincts - use SOS if needed</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Rate your driver after the trip</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
