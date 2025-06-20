"use client";

export function SpaceBackground() {
  return (
    <div className="absolute inset-0 h-full w-full">
      {/* Deep space gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-blue-950/30 to-purple-950/40" />
      
      {/* Stars effect */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-1 h-1 bg-white rounded-full animate-pulse" />
        <div className="absolute top-40 right-32 w-1 h-1 bg-blue-300 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-60 left-1/3 w-1 h-1 bg-purple-300 rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-80 right-1/4 w-1 h-1 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
        <div className="absolute top-96 left-1/2 w-1 h-1 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-1/2 left-20 w-1 h-1 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0.8s' }} />
        <div className="absolute top-1/2 right-20 w-1 h-1 bg-white rounded-full animate-pulse" style={{ animationDelay: '2.2s' }} />
        <div className="absolute bottom-40 left-1/3 w-1 h-1 bg-blue-300 rounded-full animate-pulse" style={{ animationDelay: '1.2s' }} />
        <div className="absolute bottom-60 right-1/3 w-1 h-1 bg-purple-300 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }} />
        <div className="absolute bottom-80 left-1/4 w-1 h-1 bg-white rounded-full animate-pulse" style={{ animationDelay: '1.8s' }} />
      </div>

      {/* Grid overlay */}
      <div className="absolute inset-0 opacity-20">
        {/* Vertical lines */}
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px),
            linear-gradient(0deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }} />
        
        {/* Larger grid lines */}
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(90deg, rgba(59, 130, 246, 0.2) 1px, transparent 1px),
            linear-gradient(0deg, rgba(59, 130, 246, 0.2) 1px, transparent 1px)
          `,
          backgroundSize: '200px 200px'
        }} />
      </div>

      {/* Nebula effect */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-purple-500/10 to-blue-500/10 rounded-full blur-3xl" />
    </div>
  );
} 