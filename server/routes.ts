import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertRideSchema, insertFeedbackSchema } from "@shared/schema";
import { z } from "zod";

const authDriverSchema = z.object({
  driverId: z.string(),
  password: z.string(),
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all drivers with their locations
  app.get("/api/drivers", async (req, res) => {
    try {
      const drivers = await storage.getAllDrivers();
      res.json(drivers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch drivers" });
    }
  });

  // Update driver status
  app.patch("/api/drivers/:id/status", async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const driver = await storage.updateDriverStatus(id, status);
      if (!driver) {
        return res.status(404).json({ message: "Driver not found" });
      }
      res.json(driver);
    } catch (error) {
      res.status(500).json({ message: "Failed to update driver status" });
    }
  });

  // Update driver location
  app.patch("/api/drivers/:id/location", async (req, res) => {
    try {
      const { id } = req.params;
      const { lat, lng } = req.body;
      const driver = await storage.updateDriverLocation(id, lat, lng);
      if (!driver) {
        return res.status(404).json({ message: "Driver not found" });
      }
      res.json(driver);
    } catch (error) {
      res.status(500).json({ message: "Failed to update driver location" });
    }
  });

  // Driver authentication
  app.post("/api/auth/driver", async (req, res) => {
    try {
      const { driverId, password } = authDriverSchema.parse(req.body);
      
      // For demo purposes, accept DEMO123 with password "password"
      if (driverId === "DEMO123" && password === "password") {
        const driver = await storage.getDriverByDriverId("A101"); // Use existing driver
        if (driver) {
          res.json({ success: true, driver });
        } else {
          res.status(401).json({ success: false, message: "Authentication failed" });
        }
      } else {
        res.status(401).json({ success: false, message: "Invalid credentials" });
      }
    } catch (error) {
      res.status(400).json({ message: "Invalid request data" });
    }
  });

  // Book a ride
  app.post("/api/rides", async (req, res) => {
    try {
      const rideData = insertRideSchema.parse(req.body);
      const ride = await storage.createRide(rideData);
      res.json(ride);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid ride data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create ride" });
      }
    }
  });

  // Get all rides
  app.get("/api/rides", async (req, res) => {
    try {
      const rides = await storage.getAllRides();
      res.json(rides);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch rides" });
    }
  });

  // Update ride status
  app.patch("/api/rides/:id/status", async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const ride = await storage.updateRideStatus(id, status);
      if (!ride) {
        return res.status(404).json({ message: "Ride not found" });
      }
      res.json(ride);
    } catch (error) {
      res.status(500).json({ message: "Failed to update ride status" });
    }
  });

  // Submit feedback
  app.post("/api/feedback", async (req, res) => {
    try {
      const feedbackData = insertFeedbackSchema.parse(req.body);
      const feedback = await storage.createFeedback(feedbackData);
      res.json(feedback);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid feedback data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to submit feedback" });
      }
    }
  });

  // Get analytics data
  app.get("/api/analytics", async (req, res) => {
    try {
      const drivers = await storage.getAllDrivers();
      const rides = await storage.getAllRides();
      const feedback = await storage.getAllFeedback();

      const analytics = {
        activeStudents: 2547,
        activeDrivers: drivers.filter(d => d.status !== "offline").length,
        dailyRides: rides.filter(r => {
          const today = new Date();
          const rideDate = new Date(r.createdAt || "");
          return rideDate.toDateString() === today.toDateString();
        }).length,
        totalRevenue: rides.reduce((sum, ride) => sum + parseFloat(ride.fare), 0),
        drivers: drivers.length,
        rides: rides.length,
        avgRating: drivers.length > 0 
          ? (drivers.reduce((sum, d) => sum + parseFloat(d.rating || "0"), 0) / drivers.length).toFixed(1)
          : "0.0"
      };

      res.json(analytics);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch analytics" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
