import React from "react";
import { Loader2 } from "lucide-react";

interface LoadingModalProps {
  isOpen: boolean;
  message?: string;
}

const LoadingModal: React.FC<LoadingModalProps> = ({ 
  isOpen, 
  message = "Processing your request..." 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-sm">
      <div className="backdrop-blur-xl bg-white/90 border border-white/20 shadow-2xl rounded-2xl p-8 max-w-md w-full mx-4">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#007BFF]/20 to-[#0066DD]/20 flex items-center justify-center">
              <Loader2 className="w-10 h-10 text-[#007BFF] animate-spin" />
            </div>
            <div className="absolute inset-0 rounded-full border-4 border-[#007BFF]/20 animate-pulse"></div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-gray-800">Please Wait</h3>
            <p className="text-sm text-gray-600">{message}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingModal;