
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function randomSelect<T>(array: T[], count: number): T[] {
  if (count >= array.length) {
    return [...array];
  }
  
  const shuffled = shuffleArray(array);
  return shuffled.slice(0, count);
}

export function isEmpty<T>(array: T[] | null | undefined): boolean {
  return !array || array.length === 0;
} 