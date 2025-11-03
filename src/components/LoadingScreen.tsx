// components/LoadingScreen.tsx
import React from "react";

interface LoadingScreenProps {
  message?: string;
  submessage?: string;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({
  message = "Loading...",
  submessage = "Please wait a moment",
}) => {
  return (
    <div className="h-screen w-full flex items-center justify-center">
      {/* Decorative background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#007BFF]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#A0F000]/5 rounded-full blur-3xl"></div>
      </div>

      {/* Loading Card */}
      <div className="text-center backdrop-blur-xl bg-white/60 p-10 rounded-3xl shadow-2xl border border-white/40 relative z-10">
        {/* Spinner */}
        <div className="relative w-20 h-20 mx-auto mb-6">
          <div className="absolute inset-0 border-4 border-[#007BFF]/20 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-[#007BFF] rounded-full border-t-transparent animate-spin"></div>
          <div
            className="absolute inset-2 border-4 border-[#A0F000]/30 rounded-full border-b-transparent animate-spin"
            style={{
              animationDirection: "reverse",
              animationDuration: "1s",
            }}
          ></div>
        </div>

        {/* Text */}
        <p className="text-gray-800 text-xl font-bold mb-2">{message}</p>
        <p className="text-gray-500 text-sm font-medium">{submessage}</p>
      </div>
    </div>
  );
};

export default LoadingScreen;
