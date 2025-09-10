import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertRideSchema, insertFeedbackSchema, loginSchema, registerSchema } from "@shared/schema";
import { z } from "zod";
import session from "express-session";

// Session configuration
declare module 'express-session' {
  interface SessionData {
    userId?: string;
    userType?: string;
  }
}


export async function registerRoutes(app: Express): Promise<Server> {
  // Session middleware
  app.use(session({
    secret: process.env.SESSION_SECRET || 'mbu-transport-secret',
    resave: false,
    saveUninitialized: false,
    cookie: { 
      secure: false, // Set to true in production with HTTPS
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  }));

  // Authentication middleware
  const requireAuth = (req: any, res: any, next: any) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Authentication required" });
    }
    next();
  };

  // Register endpoint
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = registerSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByUsername(userData.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }

      const existingEmail = await storage.getUserByEmail(userData.email);
      if (existingEmail) {
        return res.status(400).json({ message: "Email already exists" });
      }

      const user = await storage.createUser(userData);
      
      // If registering as driver, create driver profile
      if (userData.userType === "driver") {
        await storage.createDriver({
          userId: user.id,
          driverId: `D${Date.now()}`, // Generate unique driver ID
          name: userData.fullName,
          phone: userData.phone || "",
          autoNumber: `AUTO${Math.floor(Math.random() * 1000)}`,
          status: "offline"
        });
      }

      // Set session
      req.session.userId = user.id;
      req.session.userType = user.userType;

      res.json({ 
        success: true, 
        user: { 
          id: user.id, 
          username: user.username, 
          email: user.email,
          fullName: user.fullName,
          userType: user.userType 
        } 
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Registration failed" });
      }
    }
  });

  // Login endpoint
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = loginSchema.parse(req.body);
      
      const user = await storage.authenticateUser(username, password);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Set session
      req.session.userId = user.id;
      req.session.userType = user.userType;

      let driverProfile = null;
      if (user.userType === "driver") {
        driverProfile = await storage.getDriverByUserId(user.id);
      }

      res.json({ 
        success: true, 
        user: { 
          id: user.id, 
          username: user.username, 
          email: user.email,
          fullName: user.fullName,
          userType: user.userType 
        },
        driver: driverProfile
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Login failed" });
      }
    }
  });

  // Logout endpoint
  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Logout failed" });
      }
      res.json({ success: true });
    });
  });

  // Get current user
  app.get("/api/auth/me", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    try {
      const user = await storage.getUser(req.session.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      let driverProfile = null;
      if (user.userType === "driver") {
        driverProfile = await storage.getDriverByUserId(user.id);
      }

      res.json({ 
        user: { 
          id: user.id, 
          username: user.username, 
          email: user.email,
          fullName: user.fullName,
          userType: user.userType 
        },
        driver: driverProfile
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to get user" });
    }
  });

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

  // Book a ride
  app.post("/api/rides", requireAuth, async (req, res) => {
    try {
      const rideData = {
        ...req.body,
        userId: req.session.userId // Set the user ID from session
      };
      const validatedRideData = insertRideSchema.parse(rideData);
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
  app.get("/api/rides", requireAuth, async (req, res) => {
    try {
      // Get rides for the current user
      const rides = await storage.getRidesByUser(req.session.userId!);
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
