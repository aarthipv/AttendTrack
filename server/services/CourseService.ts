import { storage } from '../storage';
import { CreateCourse, UpdateCourse } from '../../shared/validators';

/**
 * Get all courses for a specific user
 */
export async function getCoursesByUserId(userId: string) {
  return await storage.getCoursesByUserId(userId);
}

/**
 * Get a specific course by ID
 */
export async function getCourseById(id: string) {
  // Convert string ID to number for PostgreSQL storage
  const numericId = parseInt(id, 10);
  if (isNaN(numericId)) {
    throw new Error('Invalid course ID');
  }
  return await storage.getCourseById(numericId);
}

/**
 * Create a new course
 */
export async function createCourse(userId: string, courseData: CreateCourse) {
  // Prepare course data for storage layer
  const courseToCreate = {
    userId,
    name: courseData.name,
    attendedClasses: courseData.attendedClasses,
    missedClasses: courseData.missedClasses,
    totalClasses: courseData.totalClasses
  };
  
  return await storage.createCourse(courseToCreate);
}

/**
 * Update an existing course
 */
export async function updateCourse(id: string, updateData: UpdateCourse) {
  // Convert string ID to number for PostgreSQL storage
  const numericId = parseInt(id, 10);
  if (isNaN(numericId)) {
    throw new Error('Invalid course ID');
  }
  
  // First, check if the update would violate our rule
  if (updateData.attendedClasses !== undefined && 
      updateData.missedClasses !== undefined && 
      updateData.totalClasses !== undefined) {
    if (updateData.attendedClasses + updateData.missedClasses > updateData.totalClasses) {
      throw new Error('The sum of attended and missed classes cannot exceed the total number of classes');
    }
  } else if (updateData.attendedClasses !== undefined || 
             updateData.missedClasses !== undefined || 
             updateData.totalClasses !== undefined) {
    // If only some fields are updated, we need to get the current data
    const currentCourse = await storage.getCourseById(numericId);
    if (!currentCourse) {
      throw new Error('Course not found');
    }
    
    const newAttended = updateData.attendedClasses ?? currentCourse.attendedClasses;
    const newMissed = updateData.missedClasses ?? currentCourse.missedClasses;
    const newTotal = updateData.totalClasses ?? currentCourse.totalClasses;
    
    if (newAttended + newMissed > newTotal) {
      throw new Error('The sum of attended and missed classes cannot exceed the total number of classes');
    }
  }
  
  return await storage.updateCourse(numericId, updateData);
}

/**
 * Delete a course
 */
export async function deleteCourse(id: string) {
  // Convert string ID to number for PostgreSQL storage
  const numericId = parseInt(id, 10);
  if (isNaN(numericId)) {
    throw new Error('Invalid course ID');
  }
  
  await storage.deleteCourse(numericId);
}