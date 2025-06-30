// ValidationWorkType.ts
// TypeScript interface for validation work as used in sampleValidationWork

export interface ValidationWork {
  id: number;
  taskOverview: string;
  dataType: string;
  originalLabeler: string;
  preview: string;
  deadline: string;
  reward: string;
  totalItems: number;
  difficulty: string;
  estimatedTime: string;
}
