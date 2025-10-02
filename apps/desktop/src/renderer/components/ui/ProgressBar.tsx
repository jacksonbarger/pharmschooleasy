interface ProgressBarProps {
  percentage: number;
  height?: 'sm' | 'md' | 'lg';
  colorClass: string;
  showTransition?: boolean;
}

export function ProgressBar({
  percentage,
  height = 'md',
  colorClass,
  showTransition = true,
}: ProgressBarProps) {
  const heightClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
  };

  // Convert percentage to nearest Tailwind width class
  const getWidthClass = (percent: number) => {
    const clampedPercent = Math.min(100, Math.max(0, percent));
    const roundedPercent = Math.round(clampedPercent / 5) * 5; // Round to nearest 5%

    if (roundedPercent === 0) return 'w-0';
    if (roundedPercent >= 100) return 'w-full';
    if (roundedPercent >= 95) return 'w-11/12';
    if (roundedPercent >= 90) return 'w-5/6';
    if (roundedPercent >= 85) return 'w-4/5';
    if (roundedPercent >= 75) return 'w-3/4';
    if (roundedPercent >= 65) return 'w-2/3';
    if (roundedPercent >= 60) return 'w-3/5';
    if (roundedPercent >= 50) return 'w-1/2';
    if (roundedPercent >= 40) return 'w-2/5';
    if (roundedPercent >= 35) return 'w-1/3';
    if (roundedPercent >= 25) return 'w-1/4';
    if (roundedPercent >= 20) return 'w-1/5';
    if (roundedPercent >= 15) return 'w-1/6';
    if (roundedPercent >= 10) return 'w-1/12';
    return 'w-1/12';
  };

  return (
    <div className={`w-full bg-gray-200 dark:bg-gray-700 rounded-full ${heightClasses[height]}`}>
      <div
        className={`${heightClasses[height]} rounded-full bg-gradient-to-r ${colorClass} ${
          showTransition ? 'transition-all duration-500' : ''
        } ${getWidthClass(percentage)}`}
      />
    </div>
  );
}
