import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, decimal, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const drivers = pgTable("drivers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  driverId: text("driver_id").notNull().unique(),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  autoNumber: text("auto_number").notNull(),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0.00"),
  status: text("status").notNull().default("offline"), // available, on-ride, offline
  lat: decimal("lat", { precision: 10, scale: 8 }),
  lng: decimal("lng", { precision: 11, scale: 8 }),
  createdAt: timestamp("created_at").defaultNow(),
});

export const rides = pgTable("rides", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  driverId: varchar("driver_id").references(() => drivers.id),
  pickupLocation: text("pickup_location").notNull(),
  dropLocation: text("drop_location").notNull(),
  passengers: integer("passengers").notNull(),
  rideType: text("ride_type").notNull(), // single, shared
  fare: decimal("fare", { precision: 10, scale: 2 }).notNull(),
  status: text("status").notNull().default("requested"), // requested, accepted, in-progress, completed, cancelled
  scheduledAt: timestamp("scheduled_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const feedback = pgTable("feedback", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  studentId: text("student_id"),
  type: text("type").notNull(),
  message: text("message").notNull(),
  rating: integer("rating"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertDriverSchema = createInsertSchema(drivers).omit({
  id: true,
  createdAt: true,
});

export const insertRideSchema = createInsertSchema(rides).omit({
  id: true,
  createdAt: true,
});

export const insertFeedbackSchema = createInsertSchema(feedback).omit({
  id: true,
  createdAt: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertDriver = z.infer<typeof insertDriverSchema>;
export type Driver = typeof drivers.$inferSelect;

export type InsertRide = z.infer<typeof insertRideSchema>;
export type Ride = typeof rides.$inferSelect;

export type InsertFeedback = z.infer<typeof insertFeedbackSchema>;
export type Feedback = typeof feedback.$inferSelect;
