import { Request, Response } from 'express';
import { CourseService } from '../services';
import { createCourseSchema, updateCourseSchema } from '../../shared/validators';
import { ZodError } from 'zod';
import mongoose from 'mongoose';

// Get all courses for the authenticated user
export const getCourses = async (req: Request, res: Response) => {
  try {
    const userId = (req.user as any)?.claims?.sub;
    
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const courses = await CourseService.getCoursesByUserId(userId);
    res.json(courses);
  } catch (error) {
    console.error('Error in getCourses controller:', error);
    res.status(500).json({ message: 'Failed to fetch courses' });
  }
};

// Get a single course
export const getCourse = async (req: Request, res: Response) => {
  try {
    const userId = (req.user as any)?.claims?.sub;
    const courseId = req.params.id;
    
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ message: 'Invalid course ID' });
    }
    
    const course = await CourseService.getCourseById(courseId);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    if (course.userId !== userId) {
      return res.status(403).json({ message: 'Unauthorized access to course' });
    }
    
    res.json(course);
  } catch (error) {
    console.error('Error in getCourse controller:', error);
    res.status(500).json({ message: 'Failed to fetch course' });
  }
};

// Create a new course
export const createCourse = async (req: Request, res: Response) => {
  try {
    const userId = (req.user as any)?.claims?.sub;
    
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const courseData = createCourseSchema.parse(req.body);
    
    // Validation for logical consistency
    if (courseData.attendedClasses + courseData.missedClasses > courseData.totalClasses) {
      return res.status(400).json({ 
        message: "The sum of attended and missed classes cannot exceed the total number of classes" 
      });
    }
    
    const newCourse = await CourseService.createCourse(userId, courseData);
    res.status(201).json(newCourse);
  } catch (error) {
    console.error('Error in createCourse controller:', error);
    
    if (error instanceof ZodError) {
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: error.errors 
      });
    }
    
    res.status(500).json({ message: 'Failed to create course' });
  }
};

// Update a course
export const updateCourse = async (req: Request, res: Response) => {
  try {
    const userId = (req.user as any)?.claims?.sub;
    const courseId = req.params.id;
    
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ message: 'Invalid course ID' });
    }
    
    // Get existing course to check ownership
    const existingCourse = await CourseService.getCourseById(courseId);
    
    if (!existingCourse) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    if (existingCourse.userId !== userId) {
      return res.status(403).json({ message: 'Unauthorized access to course' });
    }
    
    // Validate update data
    const updateData = updateCourseSchema.parse(req.body);
    
    try {
      const updatedCourse = await CourseService.updateCourse(courseId, updateData);
      res.json(updatedCourse);
    } catch (error: any) {
      // Check if this is a validation error
      if (error.message.includes('sum of attended and missed classes')) {
        return res.status(400).json({ message: error.message });
      }
      throw error;
    }
  } catch (error) {
    console.error('Error in updateCourse controller:', error);
    
    if (error instanceof ZodError) {
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: error.errors 
      });
    }
    
    res.status(500).json({ message: 'Failed to update course' });
  }
};

// Delete a course
export const deleteCourse = async (req: Request, res: Response) => {
  try {
    const userId = (req.user as any)?.claims?.sub;
    const courseId = req.params.id;
    
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ message: 'Invalid course ID' });
    }
    
    // Get existing course to check ownership
    const existingCourse = await CourseService.getCourseById(courseId);
    
    if (!existingCourse) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    if (existingCourse.userId !== userId) {
      return res.status(403).json({ message: 'Unauthorized access to course' });
    }
    
    await CourseService.deleteCourse(courseId);
    res.status(200).json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error('Error in deleteCourse controller:', error);
    res.status(500).json({ message: 'Failed to delete course' });
  }
};