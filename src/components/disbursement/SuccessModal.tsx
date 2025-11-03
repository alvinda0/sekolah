import React from "react";
import { CheckCircle } from "lucide-react";

interface SuccessModalProps {
  isOpen: boolean;
  message?: string;
  title?: string;
  onClose?: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ 
  isOpen, 
  message = "Your request has been processed successfully!",
  title = "Success!",
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-sm">
      <div className="backdrop-blur-xl bg-white/90 border border-white/20 shadow-2xl rounded-2xl p-8 max-w-md w-full mx-4">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <div className="absolute inset-0 rounded-full border-4 border-green-500/20 animate-ping"></div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-gray-800">{title}</h3>
            <p className="text-sm text-gray-600">{message}</p>
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-500 mt-4">
            <div className="w-2 h-2 bg-[#007BFF] rounded-full animate-pulse"></div>
            <span>Redirecting...</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;