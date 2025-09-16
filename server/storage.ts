import { type User, type InsertUser, type Driver, type InsertDriver, type Ride, type InsertRide, type Feedback, type InsertFeedback } from "@shared/schema";
import { randomUUID } from "crypto";
import bcrypt from "bcrypt";
import { db } from "./db";
import { eq } from "drizzle-orm";
import * as schema from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  authenticateUser(username: string, password: string): Promise<User | null>;

  // Driver methods
  getAllDrivers(): Promise<Driver[]>;
  getDriver(id: string): Promise<Driver | undefined>;
  getDriverByDriverId(driverId: string): Promise<Driver | undefined>;
  getDriverByUserId(userId: string): Promise<Driver | undefined>;
  createDriver(driver: InsertDriver): Promise<Driver>;
  updateDriverStatus(id: string, status: string): Promise<Driver | undefined>;
  updateDriverLocation(id: string, lat: number, lng: number): Promise<Driver | undefined>;

  // Ride methods
  getAllRides(): Promise<Ride[]>;
  getRide(id: string): Promise<Ride | undefined>;
  createRide(ride: InsertRide): Promise<Ride>;
  updateRideStatus(id: string, status: string): Promise<Ride | undefined>;
  getRidesByDriver(driverId: string): Promise<Ride[]>;
  getRidesByUser(userId: string): Promise<Ride[]>;

  // Feedback methods
  getAllFeedback(): Promise<Feedback[]>;
  createFeedback(feedback: InsertFeedback): Promise<Feedback>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: string): Promise<User | undefined> {
    if (!db) return undefined;
    const result = await db.select().from(schema.users).where(eq(schema.users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    if (!db) return undefined;
    const result = await db.select().from(schema.users).where(eq(schema.users.username, username));
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    if (!db) return undefined;
    const result = await db.select().from(schema.users).where(eq(schema.users.email, email));
    return result[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    if (!db) throw new Error("Database not available");
    // Hash password before storing
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const userWithHashedPassword = { ...user, password: hashedPassword };
    const result = await db.insert(schema.users).values(userWithHashedPassword).returning();
    return result[0];
  }

  async authenticateUser(username: string, password: string): Promise<User | null> {
    if (!db) return null;
    const user = await this.getUserByUsername(username);
    if (!user) return null;
    
    const isValid = await bcrypt.compare(password, user.password);
    return isValid ? user : null;
  }

  // Driver methods
  async getAllDrivers(): Promise<Driver[]> {
    if (!db) {
      // Fallback to mock data
      return [
        {
          id: "1",
          userId: null,
          driverId: "A101",
          name: "Ravi Kumar",
          phone: "+91 98765 43210",
          autoNumber: "A101",
          status: "available",
          lat: "13.6288",
          lng: "79.4192",
          rating: "4.8",
          createdAt: new Date()
        },
        {
          id: "2",
          userId: null,
          driverId: "A205",
          name: "Lakshmi Devi",
          phone: "+91 98765 43211",
          autoNumber: "A205",
          status: "available",
          lat: "13.6308",
          lng: "79.4172",
          rating: "4.9",
          createdAt: new Date()
        },
        {
          id: "3",
          userId: null,
          driverId: "A089",
          name: "Suresh Babu",
          phone: "+91 98765 43212",
          autoNumber: "A089",
          status: "on-ride",
          lat: "13.6268",
          lng: "79.4212",
          rating: "4.7",
          createdAt: new Date()
        }
      ];
    }
    return await db.select().from(schema.drivers);
  }

  async getDriverByUserId(userId: string): Promise<Driver | undefined> {
    if (!db) return undefined;
    const result = await db.select().from(schema.drivers).where(eq(schema.drivers.userId, userId));
    return result[0];
  }
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private drivers: Map<string, Driver>;
  private rides: Map<string, Ride>;
  private feedback: Map<string, Feedback>;

  constructor() {
    this.users = new Map();
    this.drivers = new Map();
    this.rides = new Map();
    this.feedback = new Map();
    this.seedData();
  }

  private seedData() {
    // Create some mock drivers
    const mockDrivers: InsertDriver[] = [
      {
        userId: null,
        driverId: "A101",
        name: "Ravi Kumar",
        phone: "+91 98765 43210",
        autoNumber: "A101",
        status: "available",
        lat: "13.6288",
        lng: "79.4192",
        rating: "4.8"
      },
      {
        userId: null,
        driverId: "A205",
        name: "Lakshmi Devi",
        phone: "+91 98765 43211",
        autoNumber: "A205",
        status: "available",
        lat: "13.6308",
        lng: "79.4172",
        rating: "4.9"
      },
      {
        userId: null,
        driverId: "A089",
        name: "Suresh Babu",
        phone: "+91 98765 43212",
        autoNumber: "A089",
        status: "on-ride",
        lat: "13.6268",
        lng: "79.4212",
        rating: "4.7"
      }
    ];

    mockDrivers.forEach(driver => {
      this.createDriver(driver);
    });
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    // Hash password before storing
    const hashedPassword = await bcrypt.hash(insertUser.password, 10);
    const user: User = { 
      ...insertUser, 
      id, 
      password: hashedPassword,
      createdAt: new Date() 
    };
    this.users.set(id, user);
    return user;
  }

  async authenticateUser(username: string, password: string): Promise<User | null> {
    const user = await this.getUserByUsername(username);
    if (!user) return null;
    
    const isValid = await bcrypt.compare(password, user.password);
    return isValid ? user : null;
  }

  // Driver methods
  async getAllDrivers(): Promise<Driver[]> {
    return Array.from(this.drivers.values());
  }

  async getDriver(id: string): Promise<Driver | undefined> {
    return this.drivers.get(id);
  }

  async getDriverByDriverId(driverId: string): Promise<Driver | undefined> {
    return Array.from(this.drivers.values()).find(
      (driver) => driver.driverId === driverId
    );
  }

  async getDriverByUserId(userId: string): Promise<Driver | undefined> {
    return Array.from(this.drivers.values()).find(
      (driver) => driver.userId === userId
    );
  }

  async createDriver(insertDriver: InsertDriver): Promise<Driver> {
    const id = randomUUID();
    const driver: Driver = { 
      status: "offline",
      rating: "0.00",
      lat: null,
      lng: null,
      userId: null,
      ...insertDriver, 
      id, 
      createdAt: new Date() 
    };
    this.drivers.set(id, driver);
    return driver;
  }

  async updateDriverStatus(id: string, status: string): Promise<Driver | undefined> {
    const driver = this.drivers.get(id);
    if (driver) {
      driver.status = status;
      this.drivers.set(id, driver);
      return driver;
    }
    return undefined;
  }

  async updateDriverLocation(id: string, lat: number, lng: number): Promise<Driver | undefined> {
    const driver = this.drivers.get(id);
    if (driver) {
      driver.lat = lat.toString();
      driver.lng = lng.toString();
      this.drivers.set(id, driver);
      return driver;
    }
    return undefined;
  }

  // Ride methods
  async getAllRides(): Promise<Ride[]> {
    return Array.from(this.rides.values());
  }

  async getRide(id: string): Promise<Ride | undefined> {
    return this.rides.get(id);
  }

  async createRide(insertRide: InsertRide): Promise<Ride> {
    const id = randomUUID();
    const ride: Ride = { 
      status: "requested",
      userId: null,
      driverId: null,
      scheduledAt: null,
      ...insertRide, 
      id, 
      createdAt: new Date() 
    };
    this.rides.set(id, ride);
    return ride;
  }

  async updateRideStatus(id: string, status: string): Promise<Ride | undefined> {
    const ride = this.rides.get(id);
    if (ride) {
      ride.status = status;
      this.rides.set(id, ride);
      return ride;
    }
    return undefined;
  }

  async getRidesByDriver(driverId: string): Promise<Ride[]> {
    return Array.from(this.rides.values()).filter(
      (ride) => ride.driverId === driverId
    );
  }

  async getRidesByUser(userId: string): Promise<Ride[]> {
    return Array.from(this.rides.values()).filter(
      (ride) => ride.userId === userId
    );
  }

  // Feedback methods
  async getAllFeedback(): Promise<Feedback[]> {
    return Array.from(this.feedback.values());
  }

  async createFeedback(insertFeedback: InsertFeedback): Promise<Feedback> {
    const id = randomUUID();
    const feedback: Feedback = { 
      rating: null,
      studentId: null,
      ...insertFeedback, 
      id, 
      createdAt: new Date() 
    };
    this.feedback.set(id, feedback);
    return feedback;
  }
}

export const storage = process.env.DATABASE_URL ? new DatabaseStorage() : new MemStorage();
