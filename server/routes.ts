import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { authController, courseController } from "./controllers";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, authController.getUser);

  // Courses CRUD
  // Get all courses for the authenticated user
  app.get('/api/courses', isAuthenticated, courseController.getCourses);

  // Get single course
  app.get('/api/courses/:id', isAuthenticated, courseController.getCourse);

  // Create new course
  app.post('/api/courses', isAuthenticated, courseController.createCourse);

  // Update course
  app.patch('/api/courses/:id', isAuthenticated, courseController.updateCourse);

  // Delete course
  app.delete('/api/courses/:id', isAuthenticated, courseController.deleteCourse);

  const httpServer = createServer(app);
  return httpServer;
}
