import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  integer
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table (required for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table (required for Replit Auth)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Course table for attendance tracking
export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  attendedClasses: integer("attended_classes").notNull().default(0),
  missedClasses: integer("missed_classes").notNull().default(0),
  totalClasses: integer("total_classes").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Schema for user operations
export const upsertUserSchema = createInsertSchema(users, {
  id: z.string(),
  email: z.string().email().nullable(),
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
  profileImageUrl: z.string().url().nullable(),
});

// Schema for course operations
export const insertCourseSchema = createInsertSchema(courses, {
  name: z.string().min(1, "Course name is required"),
  attendedClasses: z.number().int().min(0, "Attended classes must be a non-negative number"),
  missedClasses: z.number().int().min(0, "Missed classes must be a non-negative number"),
  totalClasses: z.number().int().min(1, "Total classes must be at least 1"),
}).omit({ id: true, createdAt: true, updatedAt: true });

export const updateCourseSchema = createSelectSchema(courses, {
  name: z.string().min(1, "Course name is required"),
  attendedClasses: z.number().int().min(0, "Attended classes must be a non-negative number"),
  missedClasses: z.number().int().min(0, "Missed classes must be a non-negative number"),
  totalClasses: z.number().int().min(1, "Total classes must be at least 1"),
}).partial().omit({ id: true, userId: true, createdAt: true, updatedAt: true });

// Types
export type UpsertUser = z.infer<typeof upsertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertCourse = z.infer<typeof insertCourseSchema>;
export type UpdateCourse = z.infer<typeof updateCourseSchema>;
export type Course = typeof courses.$inferSelect;
