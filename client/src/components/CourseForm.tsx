import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";
import { Course } from "@shared/schema";
import { calculateAttendanceStats } from "@shared/calculations";

interface CourseFormProps {
  course: Partial<Course>;
  setCourse: React.Dispatch<React.SetStateAction<Partial<Course>>>;
}

export default function CourseForm({ course, setCourse }: CourseFormProps) {
  const [showAttendanceInfo, setShowAttendanceInfo] = useState(false);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Parse number inputs
    if (name === "attendedClasses" || name === "missedClasses" || name === "totalClasses") {
      setCourse(prev => ({
        ...prev,
        [name]: parseInt(value) || 0
      }));
    } else {
      setCourse(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Show attendance calculations when we have sufficient data
  useEffect(() => {
    const { attendedClasses, missedClasses, totalClasses } = course;
    
    if (
      typeof attendedClasses === 'number' &&
      typeof missedClasses === 'number' &&
      typeof totalClasses === 'number' &&
      totalClasses > 0 &&
      (attendedClasses > 0 || missedClasses > 0)
    ) {
      // Validate the input values
      if (attendedClasses + missedClasses > totalClasses) {
        // Don't show the info if the values are invalid
        setShowAttendanceInfo(false);
      } else {
        setShowAttendanceInfo(true);
      }
    } else {
      setShowAttendanceInfo(false);
    }
  }, [course]);

  // Calculate the attendance statistics
  const stats = course.attendedClasses !== undefined && 
                course.missedClasses !== undefined && 
                course.totalClasses !== undefined
    ? calculateAttendanceStats(
        course.attendedClasses,
        course.missedClasses,
        course.totalClasses
      )
    : { currentPercentage: 0, canMissFor75: 0, canMissFor80: 0 };

  return (
    <div className="mt-5 sm:mt-6">
      <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
        <div className="sm:col-span-6">
          <Label htmlFor="course-name">Course Name</Label>
          <Input
            id="course-name"
            name="name"
            value={course.name || ''}
            onChange={handleInputChange}
            placeholder="e.g. Data Structures"
            className="mt-1"
            required
          />
        </div>

        <div className="sm:col-span-2">
          <Label htmlFor="classes-attended">Classes Attended</Label>
          <Input
            type="number"
            id="classes-attended"
            name="attendedClasses"
            value={course.attendedClasses || ''}
            onChange={handleInputChange}
            min={0}
            className="mt-1"
            required
          />
        </div>

        <div className="sm:col-span-2">
          <Label htmlFor="classes-missed">Classes Missed</Label>
          <Input
            type="number"
            id="classes-missed"
            name="missedClasses"
            value={course.missedClasses || ''}
            onChange={handleInputChange}
            min={0}
            className="mt-1"
            required
          />
        </div>

        <div className="sm:col-span-2">
          <Label htmlFor="total-classes">Total Classes</Label>
          <Input
            type="number"
            id="total-classes"
            name="totalClasses"
            value={course.totalClasses || ''}
            onChange={handleInputChange}
            min={1}
            className="mt-1"
            required
          />
        </div>
      </div>

      {showAttendanceInfo && (
        <div className="mt-6">
          <Alert className="bg-blue-50 border-blue-200">
            <InfoIcon className="h-4 w-4 text-blue-500" />
            <AlertDescription className="text-blue-800">
              <h3 className="font-medium">Attendance Summary</h3>
              <p className="mt-1">Current attendance: <span className="font-medium">{stats.currentPercentage.toFixed(1)}%</span></p>
              <p className="mt-1">For 75% attendance: <span className="font-medium">
                {stats.canMissFor75 >= 0 
                  ? `Can miss ${stats.canMissFor75} more classes` 
                  : `Must attend next ${Math.abs(stats.canMissFor75)} classes`}
              </span></p>
              <p className="mt-1">For 80% attendance: <span className="font-medium">
                {stats.canMissFor80 >= 0 
                  ? `Can miss ${stats.canMissFor80} more classes` 
                  : `Must attend next ${Math.abs(stats.canMissFor80)} classes`}
              </span></p>
            </AlertDescription>
          </Alert>
        </div>
      )}
    </div>
  );
}
