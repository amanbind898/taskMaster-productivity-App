"use client";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import DarkModeToggle from "./DarkModeToggle";

export default function Navbar() {
  const { data: session, status } = useSession();
  const isLoading = status === "loading";
  const isLoggedIn = !!session;

  if (isLoading) {
    return (
      <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="text-gray-900 dark:text-white text-lg font-bold">
            TaskMaster
          </Link>
          <div className="animate-pulse">
            <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-4 transition-colors">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-gray-900 dark:text-white text-lg font-bold hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
          TaskMaster
        </Link>
        
        <div className="flex items-center space-x-4">
          {/* Dark Mode Toggle */}
          <DarkModeToggle />
          
          {isLoggedIn ? (
            <>
              <span className="text-gray-600 dark:text-gray-300 text-sm">
                Hi, {session.user?.name || session.user?.email}
              </span>
              <Link 
                href="/dashboard" 
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded transition-colors"
              >
                Dashboard
              </Link>
          
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 px-3 py-2 rounded transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link 
                href="/login" 
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded transition-colors"
              >
                Login
              </Link>
              <Link 
                href="/signup" 
                className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
