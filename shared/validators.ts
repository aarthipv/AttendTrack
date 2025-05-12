import { z } from 'zod';

// User validation schema
export const upsertUserSchema = z.object({
  _id: z.string(),
  email: z.string().email().nullable(),
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
  profileImageUrl: z.string().url().nullable()
});

// Course validation schemas
export const createCourseSchema = z.object({
  name: z.string().min(1, "Course name is required"),
  attendedClasses: z.number().int().min(0, "Attended classes must be a non-negative number"),
  missedClasses: z.number().int().min(0, "Missed classes must be a non-negative number"),
  totalClasses: z.number().int().min(1, "Total classes must be at least 1")
});

export const updateCourseSchema = createCourseSchema.partial();

// TypeScript types based on zod schemas
export type UpsertUser = z.infer<typeof upsertUserSchema>;
export type CreateCourse = z.infer<typeof createCourseSchema>;
export type UpdateCourse = z.infer<typeof updateCourseSchema>;