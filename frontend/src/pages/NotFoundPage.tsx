import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowLeft, Home } from "lucide-react";
import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="min-h-screen cosmic-bg flex items-center justify-center p-6">
      <div className="text-center max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="text-8xl font-bold cosmic-text mb-4">404</div>
          <h1 className="text-3xl font-bold text-white mb-4">Page Not Found</h1>
          <p className="text-space-300 text-lg mb-8">
            The page you're looking for seems to have drifted into the cosmic
            void. Let's get you back to familiar territory.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="space-y-4"
        >
          <Link to="/app/dashboard">
            <Button className="cosmic text-lg px-8 py-4">
              <Home className="w-5 h-5 mr-2" />
              Go Home
            </Button>
          </Link>

          <div>
            <Button
              variant="outline"
              className="glass-card text-white border-white/20"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mt-12"
        >
          <p className="text-space-500 text-sm">
            If you believe this is an error, please contact support.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFoundPage;
