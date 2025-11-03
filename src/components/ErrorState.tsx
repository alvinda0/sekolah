// components/ErrorState.tsx
import { AlertCircle, Lock, ServerCrash, ShieldAlert, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

type ErrorCode = 400 | 401 | 403 | 404 | 500;

interface ErrorStateProps {
  code: ErrorCode;
  title?: string;
  description?: string;
  onAction?: () => void;
  actionLabel?: string;
}

const ERROR_CONFIG = {
  400: {
    icon: XCircle,
    title: "Bad Request",
    description: "The request could not be understood by the server. Please check your input and try again.",
    color: "text-orange-600",
  },
  401: {
    icon: Lock,
    title: "Unauthorized",
    description: "You need to be authenticated to access this resource. Please login to continue.",
    color: "text-yellow-600",
  },
  403: {
    icon: ShieldAlert,
    title: "Access Forbidden",
    description: "You don't have permission to access this resource. Contact administrator if you believe this is an error.",
    color: "text-red-600",
  },
  404: {
    icon: AlertCircle,
    title: "Page Not Found",
    description: "The page you're looking for doesn't exist or has been moved.",
    color: "text-[#007BFF]",
  },
  500: {
    icon: ServerCrash,
    title: "Server Error",
    description: "Something went wrong on our end. We're working to fix it. Please try again later.",
    color: "text-purple-600",
  },
};

export function ErrorState({
  code,
  title,
  description,
  onAction,
  actionLabel = "Go Back",
}: ErrorStateProps) {
  const config = ERROR_CONFIG[code];
  const Icon = config.icon;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
      {/* Glassmorphism Card */}
      <div className="relative max-w-md w-full">
        {/* Background Blur Elements */}
        <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ backgroundColor: '#007BFF' }}></div>
        <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000" style={{ backgroundColor: '#A0F000' }}></div>
        
        {/* Main Card with Gradient Background */}
        <div className="relative backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl" style={{ 
          background: 'linear-gradient(135deg, rgba(0, 123, 255, 0.15) 0%, rgba(160, 240, 0, 0.08) 50%, rgba(0, 123, 255, 0.15) 100%)'
        }}>
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className={`absolute inset-0 ${config.color} opacity-20 blur-2xl rounded-full`}></div>
              <div className="relative backdrop-blur-sm bg-white/50 border border-white/30 rounded-full p-6">
                <Icon className={`w-12 h-12 ${config.color}`} strokeWidth={1.5} />
              </div>
            </div>
          </div>

          {/* Error Code */}
          <div className="text-center mb-4">
            <span className="inline-block backdrop-blur-sm bg-white/30 border border-white/40 rounded-full px-4 py-1 text-sm font-mono text-gray-700 font-semibold">
              Error {code}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-800 text-center mb-3">
            {title || config.title}
          </h1>

          {/* Description */}
          <p className="text-gray-600 text-center mb-8 leading-relaxed">
            {description || config.description}
          </p>

          {/* Action Button */}
          {onAction && (
            <Button
              onClick={onAction}
              className="w-full backdrop-blur-sm bg-white/40 hover:bg-white/60 border border-white/50 text-gray-800 font-medium py-6 rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
            >
              {actionLabel}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}