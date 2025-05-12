import { Course } from '../models';
import mongoose from 'mongoose';
import { CreateCourse, UpdateCourse } from '../../shared/validators';

/**
 * Get all courses for a specific user
 */
export async function getCoursesByUserId(userId: string) {
  return await Course.find({ userId }).sort({ createdAt: -1 }).lean();
}

/**
 * Get a specific course by ID
 */
export async function getCourseById(id: string) {
  return await Course.findById(id).lean();
}

/**
 * Create a new course
 */
export async function createCourse(userId: string, courseData: CreateCourse) {
  const newCourse = new Course({
    userId,
    name: courseData.name,
    attendedClasses: courseData.attendedClasses,
    missedClasses: courseData.missedClasses,
    totalClasses: courseData.totalClasses
  });
  
  await newCourse.save();
  return newCourse.toObject();
}

/**
 * Update an existing course
 */
export async function updateCourse(id: string, updateData: UpdateCourse) {
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
    const currentCourse = await Course.findById(id);
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
  
  const updatedCourse = await Course.findByIdAndUpdate(
    id,
    updateData,
    { new: true, runValidators: true }
  );
  
  if (!updatedCourse) {
    throw new Error('Course not found');
  }
  
  return updatedCourse.toObject();
}

/**
 * Delete a course
 */
export async function deleteCourse(id: string) {
  const result = await Course.findByIdAndDelete(id);
  
  if (!result) {
    throw new Error('Course not found');
  }
}