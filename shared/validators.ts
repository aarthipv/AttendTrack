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
}).refine(
  (data) => data.attendedClasses + data.missedClasses <= data.totalClasses,
  {
    message: "The sum of attended and missed classes cannot exceed the total number of classes",
    path: ["attendedClasses"]
  }
);

// For updates, we create a new schema instead of using .partial() on the refined schema
export const updateCourseSchema = z.object({
  name: z.string().min(1, "Course name is required").optional(),
  attendedClasses: z.number().int().min(0, "Attended classes must be a non-negative number").optional(),
  missedClasses: z.number().int().min(0, "Missed classes must be a non-negative number").optional(),
  totalClasses: z.number().int().min(1, "Total classes must be at least 1").optional()
});

// TypeScript types based on zod schemas
export type UpsertUser = z.infer<typeof upsertUserSchema>;
export type CreateCourse = z.infer<typeof createCourseSchema>;
export type UpdateCourse = z.infer<typeof updateCourseSchema>;