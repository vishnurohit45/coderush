import { type User, type InsertUser, type Driver, type InsertDriver, type Ride, type InsertRide, type Feedback, type InsertFeedback } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Driver methods
  getAllDrivers(): Promise<Driver[]>;
  getDriver(id: string): Promise<Driver | undefined>;
  getDriverByDriverId(driverId: string): Promise<Driver | undefined>;
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
        driverId: "A101",
        name: "John Kamau",
        phone: "+256 123 456 789",
        autoNumber: "A101",
        status: "available",
        lat: "0.6103",
        lng: "30.6463",
        rating: "4.8"
      },
      {
        driverId: "A205",
        name: "Sarah Mugisha",
        phone: "+256 123 456 790",
        autoNumber: "A205",
        status: "available",
        lat: "0.6123",
        lng: "30.6453",
        rating: "4.9"
      },
      {
        driverId: "A089",
        name: "Mike Rwomushana",
        phone: "+256 123 456 791",
        autoNumber: "A089",
        status: "on-ride",
        lat: "0.6143",
        lng: "30.6483",
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

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
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

  async createDriver(insertDriver: InsertDriver): Promise<Driver> {
    const id = randomUUID();
    const driver: Driver = { 
      status: "offline",
      rating: "0.00",
      lat: null,
      lng: null,
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

export const storage = new MemStorage();
