import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Course } from "@shared/schema";
import CourseForm from "./CourseForm";

interface AddCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCourse: (course: Omit<Course, "id" | "userId">) => void;
  isSubmitting: boolean;
}

export default function AddCourseModal({ 
  isOpen, 
  onClose, 
  onAddCourse, 
  isSubmitting 
}: AddCourseModalProps) {
  const [course, setCourse] = useState<Partial<Course>>({
    name: "",
    attendedClasses: 0,
    missedClasses: 0,
    totalClasses: 0
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddCourse(course as Omit<Course, "id" | "userId">);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add New Course</DialogTitle>
          <DialogDescription>
            Fill in the details below to add a new course to your attendance tracker.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <CourseForm 
            course={course} 
            setCourse={setCourse}
          />
          
          <DialogFooter className="mt-5 sm:mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="mt-3 w-full sm:mt-0 sm:w-auto"
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              className="w-full sm:w-auto"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Adding..." : "Add Course"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
