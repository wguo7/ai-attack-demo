export interface AttackResult {
  result: string;
  metrics: {
    evasionScore: number; // 0-100 how likely to bypass detection
    humanReadability: number; // 0-100 how readable to humans
    changesMade: number;
    processingTime: number;
    charactersChanged: number;
    wordsChanged: number;
    similarityScore: number;
    changeDensity?: number; // Percentage of text changed (0-100)
  };
  techniquesUsed: string[];
  detectionDifficulty: 'low' | 'medium' | 'high' | 'extreme';
  explanation: {
    description: string;
    detectionTips: string[];
    examples: string[];
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
  };
}

export interface AttackDefinition {
  id: string;
  name: string;
  category: 'character' | 'word' | 'sentence' | 'semantic' | 'multi-vector';
  description: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  icon: string;
  intensity?: 'low' | 'medium' | 'high' | 'evasion';
}

export type AttackIntensity = 'low' | 'medium' | 'high' | 'evasion';

