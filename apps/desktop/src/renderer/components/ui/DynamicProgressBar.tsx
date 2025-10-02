import React from 'react';

interface DynamicProgressBarProps {
  progress: number;
  className?: string;
  colorClassName?: string;
}

const DynamicProgressBar: React.FC<DynamicProgressBarProps> = ({
  progress,
  className = 'h-2',
  colorClassName = 'bg-gradient-to-r from-green-400 to-emerald-500',
}) => {
  return (
    <div className={`w-full bg-white/20 rounded-full overflow-hidden ${className}`}>
      <div
        className={`h-full rounded-full ${colorClassName}`}
        style={{ '--progress-width': `${progress}%`, width: 'var(--progress-width)' } as React.CSSProperties}
      />
    </div>
  );
};

export default DynamicProgressBar;

