// AvailableWorkType.ts
// TypeScript interface for available work as used in sampleAvailableWork

export interface AvailableWork {
  id: number;
  projectBrief: string;
  dataType: string;
  deadline: string;
  reward: string;
  totalImages: number;
  difficulty: string;
  estimatedTime: string;
}
