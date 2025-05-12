import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { ZodError } from "zod";
import { insertCourseSchema, updateCourseSchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Courses CRUD
  // Get all courses for the authenticated user
  app.get('/api/courses', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const courses = await storage.getCoursesByUserId(userId);
      res.json(courses);
    } catch (error) {
      console.error("Error fetching courses:", error);
      res.status(500).json({ message: "Failed to fetch courses" });
    }
  });

  // Get single course
  app.get('/api/courses/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const courseId = parseInt(req.params.id);
      
      if (isNaN(courseId)) {
        return res.status(400).json({ message: "Invalid course ID" });
      }

      const course = await storage.getCourseById(courseId);
      
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      
      if (course.userId !== userId) {
        return res.status(403).json({ message: "Unauthorized access to course" });
      }
      
      res.json(course);
    } catch (error) {
      console.error("Error fetching course:", error);
      res.status(500).json({ message: "Failed to fetch course" });
    }
  });

  // Create new course
  app.post('/api/courses', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const courseData = insertCourseSchema.parse({
        ...req.body,
        userId
      });

      // Validation for logical consistency
      if (courseData.attendedClasses + courseData.missedClasses > courseData.totalClasses) {
        return res.status(400).json({ 
          message: "The sum of attended and missed classes cannot exceed the total number of classes" 
        });
      }

      const newCourse = await storage.createCourse(courseData);
      res.status(201).json(newCourse);
    } catch (error) {
      console.error("Error creating course:", error);
      
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      
      res.status(500).json({ message: "Failed to create course" });
    }
  });

  // Update course
  app.patch('/api/courses/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const courseId = parseInt(req.params.id);
      
      if (isNaN(courseId)) {
        return res.status(400).json({ message: "Invalid course ID" });
      }

      // Check if course exists and belongs to the user
      const existingCourse = await storage.getCourseById(courseId);
      
      if (!existingCourse) {
        return res.status(404).json({ message: "Course not found" });
      }
      
      if (existingCourse.userId !== userId) {
        return res.status(403).json({ message: "Unauthorized access to course" });
      }
      
      // Validate update data
      const updateData = updateCourseSchema.parse(req.body);
      
      // Validation for logical consistency if updating relevant fields
      if (
        updateData.attendedClasses !== undefined ||
        updateData.missedClasses !== undefined ||
        updateData.totalClasses !== undefined
      ) {
        const attendedClasses = updateData.attendedClasses ?? existingCourse.attendedClasses;
        const missedClasses = updateData.missedClasses ?? existingCourse.missedClasses;
        const totalClasses = updateData.totalClasses ?? existingCourse.totalClasses;
        
        if (attendedClasses + missedClasses > totalClasses) {
          return res.status(400).json({
            message: "The sum of attended and missed classes cannot exceed the total number of classes"
          });
        }
      }
      
      const updatedCourse = await storage.updateCourse(courseId, updateData);
      res.json(updatedCourse);
    } catch (error) {
      console.error("Error updating course:", error);
      
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      
      res.status(500).json({ message: "Failed to update course" });
    }
  });

  // Delete course
  app.delete('/api/courses/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const courseId = parseInt(req.params.id);
      
      if (isNaN(courseId)) {
        return res.status(400).json({ message: "Invalid course ID" });
      }

      // Check if course exists and belongs to the user
      const existingCourse = await storage.getCourseById(courseId);
      
      if (!existingCourse) {
        return res.status(404).json({ message: "Course not found" });
      }
      
      if (existingCourse.userId !== userId) {
        return res.status(403).json({ message: "Unauthorized access to course" });
      }
      
      await storage.deleteCourse(courseId);
      res.status(200).json({ message: "Course deleted successfully" });
    } catch (error) {
      console.error("Error deleting course:", error);
      res.status(500).json({ message: "Failed to delete course" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
