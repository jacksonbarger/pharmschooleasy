import React from 'react';

interface CleanProgressBarProps {
  progress: number;
  className?: string;
  colorClassName?: string;
}

const CleanProgressBar: React.FC<CleanProgressBarProps> = ({
  progress,
  className = 'h-2',
  colorClassName = 'bg-gradient-to-r from-green-400 to-emerald-500',
}) => {
  return (
    <div className={`w-full bg-white/20 rounded-full overflow-hidden ${className}`}>
      {/* eslint-disable-next-line react/forbid-dom-props */}
      <div
        className={`h-full rounded-full ${colorClassName}`}
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

export default CleanProgressBar;
