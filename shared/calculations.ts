/**
 * Calculate attendance statistics for a course
 * 
 * @param attendedClasses - Number of classes attended
 * @param missedClasses - Number of classes missed
 * @param totalClasses - Total number of classes in the course
 * @returns Object containing attendance calculations
 */
export function calculateAttendanceStats(
  attendedClasses: number,
  missedClasses: number,
  totalClasses: number
) {
  // Calculate current attendance percentage
  const currentPercentage = attendedClasses + missedClasses > 0
    ? (attendedClasses / (attendedClasses + missedClasses)) * 100
    : 0;

  // Classes remaining to be attended
  const remainingClasses = totalClasses - (attendedClasses + missedClasses);
  
  // Calculate how many classes can be missed while maintaining 75% attendance
  const maxMissableFor75 = Math.floor(totalClasses * 0.25);
  const canMissFor75 = maxMissableFor75 - missedClasses;
  
  // Calculate how many classes can be missed while maintaining 80% attendance
  const maxMissableFor80 = Math.floor(totalClasses * 0.2);
  const canMissFor80 = maxMissableFor80 - missedClasses;
  
  return {
    currentPercentage,
    remainingClasses,
    canMissFor75,
    canMissFor80
  };
}
