import { Course } from "@shared/schema";
import { calculateAttendanceStats } from "@shared/calculations";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, CheckCircle, AlertTriangle } from "lucide-react";

interface SummaryCardsProps {
  courses: Course[];
}

export default function SummaryCards({ courses }: SummaryCardsProps) {
  // Calculate summary statistics
  const totalCourses = courses.length;
  
  const coursesAboveThreshold = courses.filter(course => {
    const { currentPercentage } = calculateAttendanceStats(
      course.attendedClasses, 
      course.missedClasses, 
      course.totalClasses
    );
    return currentPercentage >= 75;
  }).length;
  
  const coursesBelowThreshold = totalCourses - coursesAboveThreshold;

  return (
    <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardContent className="px-4 py-5 sm:p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-primary/10 rounded-md p-3">
              <BookOpen className="text-primary w-5 h-5" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Total Courses</dt>
                <dd className="flex items-baseline">
                  <div className="text-2xl font-semibold text-gray-900">{totalCourses}</div>
                </dd>
              </dl>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="px-4 py-5 sm:p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-green-50 rounded-md p-3">
              <CheckCircle className="text-green-600 w-5 h-5" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Courses Above 75%</dt>
                <dd className="flex items-baseline">
                  <div className="text-2xl font-semibold text-gray-900">{coursesAboveThreshold}</div>
                </dd>
              </dl>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="px-4 py-5 sm:p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-yellow-50 rounded-md p-3">
              <AlertTriangle className="text-yellow-600 w-5 h-5" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Courses Below 75%</dt>
                <dd className="flex items-baseline">
                  <div className="text-2xl font-semibold text-gray-900">{coursesBelowThreshold}</div>
                </dd>
              </dl>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
