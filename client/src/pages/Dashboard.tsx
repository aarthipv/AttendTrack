import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { Course } from "@shared/schema";
import AttendanceTable from "@/components/AttendanceTable";
import AttendanceCards from "@/components/AttendanceCards";
import SummaryCards from "@/components/SummaryCards";
import AddCourseModal from "@/components/AddCourseModal";
import EditCourseModal from "@/components/EditCourseModal";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function Dashboard() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [courseIdToDelete, setCourseIdToDelete] = useState<number | null>(null);

  // Get courses
  const { 
    data: courses = [], 
    isLoading: isCoursesLoading,
    error: coursesError 
  } = useQuery<Course[]>({
    queryKey: ["/api/courses"],
    enabled: isAuthenticated
  });

  // Add course mutation
  const { mutate: addCourse, isPending: isAddingCourse } = useMutation({
    mutationFn: async (newCourse: Omit<Course, "id" | "userId">) => {
      const res = await apiRequest("POST", "/api/courses", newCourse);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Course added",
        description: "Your course has been added successfully.",
      });
      setIsAddModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["/api/courses"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to add course: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  // Update course mutation
  const { mutate: updateCourse, isPending: isUpdatingCourse } = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<Course> }) => {
      const res = await apiRequest("PATCH", `/api/courses/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Course updated",
        description: "Your course has been updated successfully.",
      });
      setIsEditModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["/api/courses"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update course: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  // Delete course mutation
  const { mutate: deleteCourse, isPending: isDeletingCourse } = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("DELETE", `/api/courses/${id}`);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Course deleted",
        description: "Your course has been deleted successfully.",
      });
      setIsDeleteDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["/api/courses"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete course: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/");
    }
  }, [authLoading, isAuthenticated, navigate]);

  // Handle add course
  const handleAddCourse = (courseData: Omit<Course, "id" | "userId">) => {
    addCourse(courseData);
  };

  // Handle edit course
  const handleEditCourse = (course: Course) => {
    setSelectedCourse(course);
    setIsEditModalOpen(true);
  };

  // Handle update course
  const handleUpdateCourse = (id: number, data: Partial<Course>) => {
    updateCourse({ id, data });
  };

  // Handle delete confirmation
  const handleDeleteConfirmation = (courseId: number) => {
    setCourseIdToDelete(courseId);
    setIsDeleteDialogOpen(true);
  };

  // Handle delete course
  const handleDeleteCourse = () => {
    if (courseIdToDelete) {
      deleteCourse(courseIdToDelete);
    }
  };

  // If loading or redirect in progress
  if (authLoading || (!authLoading && !isAuthenticated)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="py-10">
      <header>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Your Attendance Dashboard</h1>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Summary Cards */}
          {!isCoursesLoading && courses.length > 0 && (
            <SummaryCards courses={courses} />
          )}

          {/* Add Course Button */}
          <div className="mt-8 flex justify-end">
            <Button 
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center px-4 py-2 rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              <Plus className="-ml-1 mr-2 h-4 w-4" />
              Add Course
            </Button>
          </div>

          {/* Course List Heading */}
          <div className="mt-8 sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h2 className="text-xl font-semibold text-gray-900">Your Courses</h2>
              <p className="mt-2 text-sm text-gray-700">
                A list of all your courses and their attendance statistics.
              </p>
            </div>
          </div>

          {/* Loading State */}
          {isCoursesLoading && (
            <div className="mt-6 flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          )}

          {/* Error State */}
          {coursesError && (
            <div className="mt-6 bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error loading courses</h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{coursesError instanceof Error ? coursesError.message : "Unknown error"}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!isCoursesLoading && !coursesError && courses.length === 0 && (
            <div className="mt-6 text-center py-12 bg-gray-50 rounded-lg">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No courses</h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by adding a new course.
              </p>
              <div className="mt-6">
                <Button 
                  onClick={() => setIsAddModalOpen(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90"
                >
                  <Plus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                  Add Course
                </Button>
              </div>
            </div>
          )}

          {/* Courses Table (Desktop) and Cards (Mobile) */}
          {!isCoursesLoading && !coursesError && courses.length > 0 && (
            <>
              <AttendanceTable 
                courses={courses} 
                onEdit={handleEditCourse} 
                onDelete={handleDeleteConfirmation} 
              />
              <AttendanceCards 
                courses={courses} 
                onEdit={handleEditCourse} 
                onDelete={handleDeleteConfirmation} 
              />
            </>
          )}

          {/* Add Course Modal */}
          <AddCourseModal 
            isOpen={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
            onAddCourse={handleAddCourse}
            isSubmitting={isAddingCourse}
          />

          {/* Edit Course Modal */}
          <EditCourseModal 
            isOpen={isEditModalOpen}
            onClose={() => {
              setIsEditModalOpen(false);
              setSelectedCourse(null);
            }}
            course={selectedCourse}
            onUpdateCourse={handleUpdateCourse}
            isSubmitting={isUpdatingCourse}
          />

          {/* Delete Confirmation Dialog */}
          <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the course and all its data.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isDeletingCourse}>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleDeleteCourse}
                  disabled={isDeletingCourse}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {isDeletingCourse ? "Deleting..." : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </main>
    </div>
  );
}
