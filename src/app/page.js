"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { 
  CheckCircleIcon, 
  ChartBarIcon, 
  ClockIcon, 
  StarIcon,
  ArrowRightIcon,
  UserGroupIcon
} from "@heroicons/react/24/outline";

export default function Home() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            
            
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Master Your{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Productivity
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Transform chaos into clarity with our intelligent task management system. 
              Organize, prioritize, and accomplish your goals with ease.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              {session ? (
                <Link
                  href="/dashboard"
                  className="group inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
                >
                  Go to Dashboard
                  <ArrowRightIcon className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              ) : (
                <>
                  <Link
                    href="/signup"
                    className="group inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
                  >
                    Get Started Free
                    <ArrowRightIcon className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    href="/login"
                    className="inline-flex items-center justify-center px-8 py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200"
                  >
                    Sign In
                  </Link>
                </>
              )}
            </div>

          
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Everything you need to stay organized
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Powerful features designed to boost your productivity and help you achieve more.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
            <div className="group p-8 bg-gray-50 dark:bg-gray-700 rounded-2xl hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50 dark:hover:from-gray-600 dark:hover:to-gray-600 transition-all duration-300">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <CheckCircleIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Smart Task Management</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Organize tasks with categories, priorities, and due dates. Never miss a deadline again.
              </p>
            </div>

            <div className="group p-8 bg-gray-50 dark:bg-gray-700 rounded-2xl hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50 dark:hover:from-gray-600 dark:hover:to-gray-600 transition-all duration-300">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <ChartBarIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Progress Tracking</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Visualize your productivity with detailed analytics and completion statistics.
              </p>
            </div>

          

            
            <div className="group p-8 bg-gray-50 dark:bg-gray-700 rounded-2xl hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50 dark:hover:from-gray-600 dark:hover:to-gray-600 transition-all duration-300">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <StarIcon className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Priority Management</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Focus on what matters most with advanced priority filtering and sorting.
              </p>
            </div>

            <div className="group p-8 bg-gray-50 dark:bg-gray-700 rounded-2xl hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50 dark:hover:from-gray-600 dark:hover:to-gray-600 transition-all duration-300">
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <CheckCircleIcon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Cross-Platform Sync</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Access your tasks anywhere, anytime with seamless synchronization across devices.
              </p>
            </div>
          </div>
        </div>
      </section>



     
    </div>
  );
}
