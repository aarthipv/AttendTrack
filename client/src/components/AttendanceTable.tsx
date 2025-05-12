import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Course } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { calculateAttendanceStats } from "@shared/calculations";

interface AttendanceTableProps {
  courses: Course[];
  onEdit: (course: Course) => void;
  onDelete: (courseId: number) => void;
}

export default function AttendanceTable({ courses, onEdit, onDelete }: AttendanceTableProps) {
  return (
    <div className="mt-4 hidden md:block">
      <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Course Name</TableHead>
              <TableHead className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Classes Attended</TableHead>
              <TableHead className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Classes Missed</TableHead>
              <TableHead className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Total Classes</TableHead>
              <TableHead className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Current %</TableHead>
              <TableHead className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">75% Threshold</TableHead>
              <TableHead className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">80% Threshold</TableHead>
              <TableHead className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-200 bg-white">
            {courses.map((course) => {
              const { 
                currentPercentage, 
                canMissFor75, 
                canMissFor80
              } = calculateAttendanceStats(course.attendedClasses, course.missedClasses, course.totalClasses);
              
              return (
                <TableRow key={course.id}>
                  <TableCell className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                    {course.name}
                  </TableCell>
                  <TableCell className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {course.attendedClasses}
                  </TableCell>
                  <TableCell className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {course.missedClasses}
                  </TableCell>
                  <TableCell className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {course.totalClasses}
                  </TableCell>
                  <TableCell className="whitespace-nowrap px-3 py-4 text-sm font-medium">
                    <Badge className={`${
                      currentPercentage >= 80 
                        ? 'bg-green-100 text-green-800' 
                        : currentPercentage >= 75 
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {currentPercentage.toFixed(1)}%
                    </Badge>
                  </TableCell>
                  <TableCell className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {canMissFor75 >= 0 
                      ? `Can miss ${canMissFor75} more` 
                      : `Must attend next ${Math.abs(canMissFor75)}`}
                  </TableCell>
                  <TableCell className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {canMissFor80 >= 0 
                      ? `Can miss ${canMissFor80} more` 
                      : `Must attend next ${Math.abs(canMissFor80)}`}
                  </TableCell>
                  <TableCell className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-primary hover:text-primary/80 mr-4"
                      onClick={() => onEdit(course)}
                    >
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-destructive hover:text-destructive/80"
                      onClick={() => onDelete(course.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
