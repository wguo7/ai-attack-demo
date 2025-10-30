// Configuration-Driven Attack System
export interface AttackConfig {
  intensity: 'low' | 'medium' | 'high' | 'evasion';
  techniques: string[];
  maxModifications?: number;
  preserveReadability: boolean;
  targetModel?: string;
}

export interface AttackResult {
  result: string;
  metrics: {
    evasionScore: number;
    humanReadability: number;
    changesMade: number;
    processingTime: number;
  };
  techniquesUsed: string[];
  detectionDifficulty: 'low' | 'medium' | 'high' | 'extreme';
  explanation?: {
    description: string;
    detectionTips: string[];
    examples: string[];
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
  };
}

export const DEFAULT_CONFIG: AttackConfig = {
  intensity: 'medium',
  techniques: [],
  preserveReadability: true,
  maxModifications: undefined,
};

