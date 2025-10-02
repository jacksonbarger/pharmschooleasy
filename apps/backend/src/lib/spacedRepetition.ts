// SM-2–lite implementation adapted for MVP
export type Rating = 1 | 2 | 3 | 4; // Again, Hard, Good, Easy

export function review({ ease, interval, repetitions }: { ease: number; interval: number; repetitions: number; }, rating: Rating) {
  let q = 0; // quality 0..5
  if (rating === 1) q = 1; // Again
  if (rating === 2) q = 3; // Hard ~3
  if (rating === 3) q = 4; // Good
  if (rating === 4) q = 5; // Easy

  let newEase = Math.max(1.3, ease + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)));
  let newReps = q < 3 ? 0 : repetitions + 1;
  let newInterval = 1;

  if (newReps <= 1) newInterval = 1;
  else if (newReps === 2) newInterval = 6;
  else newInterval = Math.round(interval * newEase);

  if (q < 3) newInterval = 1; // reset on fail

  const dueAt = new Date();
  dueAt.setDate(dueAt.getDate() + newInterval);

  return { ease: newEase, repetitions: newReps, interval: newInterval, dueAt };
}