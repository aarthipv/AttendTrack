import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth();
  const [, navigate] = useLocation();

  // If authenticated, redirect to dashboard
  if (!isLoading && isAuthenticated) {
    navigate("/dashboard");
    return null;
  }

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
              Track your attendance <span className="text-primary">effortlessly</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-lg text-gray-500 sm:text-xl md:mt-5 md:max-w-3xl">
              Stay on top of your academic attendance requirements. Calculate missed classes, track attendance percentages, and ensure you meet the minimum requirements.
            </p>
            <div className="mt-10 sm:flex">
              <Button 
                size="lg" 
                asChild
                className="w-full sm:w-auto flex items-center justify-center px-8 py-3 text-base font-medium rounded-md md:py-4 md:text-lg md:px-10"
              >
                <a href="/api/login">Get started</a>
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                asChild
                className="mt-3 sm:mt-0 sm:ml-3 w-full sm:w-auto flex items-center justify-center px-8 py-3 text-base font-medium rounded-md text-primary md:py-4 md:text-lg md:px-10"
              >
                <Link href="#features">Learn more</Link>
              </Button>
            </div>
          </div>
          <div className="mt-12 lg:mt-0">
            <img className="w-full rounded-lg shadow-lg" src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600" alt="Students in classroom" />
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Simplify Your Attendance Tracking
            </h2>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
              Everything you need to manage your class attendance requirements.
            </p>
          </div>

          <div className="mt-10">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="p-6 bg-white rounded-lg shadow-md">
                <div className="text-primary text-3xl mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
                    <rect x="2" y="12" width="4" height="8" rx="1"></rect>
                    <rect x="10" y="8" width="4" height="12" rx="1"></rect>
                    <rect x="18" y="4" width="4" height="16" rx="1"></rect>
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900">Automatic Calculations</h3>
                <p className="mt-2 text-base text-gray-500">
                  Instantly calculate attendance percentages and track your progress toward attendance goals.
                </p>
              </div>

              <div className="p-6 bg-white rounded-lg shadow-md">
                <div className="text-primary text-3xl mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
                    <path d="M22 12L18 8M22 12L18 16M22 12H9M3 12C3 16.9706 7.02944 21 12 21C13.4253 21 14.7697 20.6681 15.9754 20.0766"></path>
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900">Attendance Forecasting</h3>
                <p className="mt-2 text-base text-gray-500">
                  Know exactly how many more classes you can miss while maintaining required attendance thresholds.
                </p>
              </div>

              <div className="p-6 bg-white rounded-lg shadow-md">
                <div className="text-primary text-3xl mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
                    <rect x="3" y="5" width="18" height="14" rx="2"></rect>
                    <path d="M3 10h18"></path>
                    <path d="M10 5v14"></path>
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900">Course Tracking</h3>
                <p className="mt-2 text-base text-gray-500">
                  Track multiple courses in a clean tabular format. Edit or delete records as needed.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Trusted by Students
            </h2>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {/* Student testimonial 1 */}
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <img className="h-12 w-12 rounded-full object-cover mr-4" src="https://images.unsplash.com/photo-1557862921-37829c790f19?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=150&h=150" alt="Student portrait" />
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Jamie Chen</h3>
                  <p className="text-gray-500 text-sm">Computer Science Major</p>
                </div>
              </div>
              <p className="text-gray-600 italic">"This app saved me from failing a course due to low attendance. Now I can easily see how many more classes I can miss."</p>
            </div>

            {/* Student testimonial 2 */}
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <img className="h-12 w-12 rounded-full object-cover mr-4" src="https://images.unsplash.com/photo-1544717305-2782549b5136?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=150&h=150" alt="Student portrait" />
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Taylor Morgan</h3>
                  <p className="text-gray-500 text-sm">Engineering Student</p>
                </div>
              </div>
              <p className="text-gray-600 italic">"The calculated predictions for maintaining 75% and 80% attendance are incredibly helpful for planning my semester."</p>
            </div>

            {/* Student testimonial 3 */}
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <img className="h-12 w-12 rounded-full object-cover mr-4" src="https://images.unsplash.com/photo-1529470839332-78ad660a6a82?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=150&h=150" alt="Student portrait" />
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Alex Rivera</h3>
                  <p className="text-gray-500 text-sm">Business Administration</p>
                </div>
              </div>
              <p className="text-gray-600 italic">"With this app, I can manage my attendance across multiple courses efficiently. Easy to use and very helpful!"</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
