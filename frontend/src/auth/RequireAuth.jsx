import { useAuth } from './AuthContextUtils';
import { motion } from 'framer-motion';
import { LockClosedIcon, UserIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

const RequireAuth = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full"
        >
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
              <LockClosedIcon className="h-8 w-8 text-red-600" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Authentication Required
            </h2>
            
            <p className="text-gray-600 mb-6">
              You need to be logged in to access this page. Please sign in or create an account to continue.
            </p>

            <div className="space-y-4">
              <button
                onClick={() => window.location.href = '/login'}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <UserIcon className="h-5 w-5" />
                Sign In
                <ArrowRightIcon className="h-5 w-5" />
              </button>
              
              <button
                onClick={() => window.location.href = '/register'}
                className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Create Account
              </button>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <button
                onClick={() => window.history.back()}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                ← Go Back
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return children;
};

export default RequireAuth;