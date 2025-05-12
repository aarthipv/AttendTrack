import { Course } from "@shared/schema";
import { calculateAttendanceStats } from "@shared/calculations";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface AttendanceCardsProps {
  courses: Course[];
  onEdit: (course: Course) => void;
  onDelete: (courseId: number) => void;
}

export default function AttendanceCards({ courses, onEdit, onDelete }: AttendanceCardsProps) {
  return (
    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:hidden">
      {courses.map((course) => {
        const { 
          currentPercentage, 
          canMissFor75, 
          canMissFor80 
        } = calculateAttendanceStats(course.attendedClasses, course.missedClasses, course.totalClasses);
        
        return (
          <Card key={course.id} className="attendance-card">
            <CardHeader className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">{course.name}</h3>
              <div className="mt-1 flex flex-wrap items-center">
                <Badge 
                  className={`mr-2 ${
                    currentPercentage >= 80 
                      ? 'bg-green-100 text-green-800' 
                      : currentPercentage >= 75 
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {currentPercentage.toFixed(1)}%
                </Badge>
                <span className="text-sm text-gray-500">Current attendance</span>
              </div>
            </CardHeader>
            <CardContent className="px-4 py-4 sm:px-6">
              <dl className="grid grid-cols-2 gap-x-4 gap-y-3">
                <div className="col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Classes Attended</dt>
                  <dd className="mt-1 text-sm text-gray-900">{course.attendedClasses}</dd>
                </div>
                <div className="col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Classes Missed</dt>
                  <dd className="mt-1 text-sm text-gray-900">{course.missedClasses}</dd>
                </div>
                <div className="col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Total Classes</dt>
                  <dd className="mt-1 text-sm text-gray-900">{course.totalClasses}</dd>
                </div>
                <div className="col-span-1">
                  <dt className="text-sm font-medium text-gray-500">75% Threshold</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {canMissFor75 >= 0 
                      ? `Can miss ${canMissFor75} more` 
                      : `Must attend next ${Math.abs(canMissFor75)}`}
                  </dd>
                </div>
                <div className="col-span-2">
                  <dt className="text-sm font-medium text-gray-500">80% Threshold</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {canMissFor80 >= 0 
                      ? `Can miss ${canMissFor80} more` 
                      : `Must attend next ${Math.abs(canMissFor80)}`}
                  </dd>
                </div>
              </dl>
            </CardContent>
            <CardFooter className="px-4 py-3 bg-gray-50 text-right sm:px-6">
              <Button 
                variant="ghost" 
                size="sm"
                className="text-primary hover:text-primary/80 text-sm font-medium mr-4"
                onClick={() => onEdit(course)}
              >
                <Edit className="h-4 w-4 mr-1" /> Edit
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                className="text-destructive hover:text-destructive/80 text-sm font-medium"
                onClick={() => onDelete(course.id)}
              >
                <Trash2 className="h-4 w-4 mr-1" /> Delete
              </Button>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
