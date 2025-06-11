import { 
  CheckCircleIcon, 
  ChartBarIcon, 
  ClockIcon, 
  StarIcon,
  ArrowRightIcon,
  UserGroupIcon
} from "@heroicons/react/24/outline";
import Link from "next/link";
export default function Footer() {
  return (
    <div className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <CheckCircleIcon className="h-8 w-8 text-blue-400 mr-2" />
            <span className="text-xl font-bold">TaskMaster</span>
          </div>
          <p className="text-gray-400 mb-6">
            Empowering productivity, one task at a time.
          </p>
          <div className="flex justify-center space-x-6">
            <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
              Terms
            </Link>
            <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
