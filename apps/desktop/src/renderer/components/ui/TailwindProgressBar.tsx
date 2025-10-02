import React from 'react';

interface TailwindProgressBarProps {
  progress: number;
  className?: string;
  colorClassName?: string;
}

const TailwindProgressBar: React.FC<TailwindProgressBarProps> = ({
  progress,
  className = 'h-2',
  colorClassName = 'bg-gradient-to-r from-green-400 to-emerald-500',
}) => {
  const widthClass = `w-[${progress}%]`;

  return (
    <div className={`w-full bg-white/20 rounded-full overflow-hidden ${className}`}>
      <div className={`h-full rounded-full ${colorClassName} ${widthClass}`} />
    </div>
  );
};

export default TailwindProgressBar;
