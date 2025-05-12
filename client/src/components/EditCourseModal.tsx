import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Course } from "@shared/schema";
import CourseForm from "./CourseForm";

interface EditCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: Course | null;
  onUpdateCourse: (courseId: number, course: Partial<Course>) => void;
  isSubmitting: boolean;
}

export default function EditCourseModal({ 
  isOpen, 
  onClose, 
  course, 
  onUpdateCourse, 
  isSubmitting 
}: EditCourseModalProps) {
  const [formData, setFormData] = useState<Partial<Course>>({
    name: "",
    attendedClasses: 0,
    missedClasses: 0,
    totalClasses: 0
  });

  useEffect(() => {
    if (course) {
      setFormData({
        name: course.name,
        attendedClasses: course.attendedClasses,
        missedClasses: course.missedClasses,
        totalClasses: course.totalClasses
      });
    }
  }, [course]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (course) {
      onUpdateCourse(course.id, formData);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Course</DialogTitle>
          <DialogDescription>
            Update the course details below.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <CourseForm 
            course={formData} 
            setCourse={setFormData}
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
              {isSubmitting ? "Updating..." : "Update Course"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
