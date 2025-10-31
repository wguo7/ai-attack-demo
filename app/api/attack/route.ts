import { NextRequest, NextResponse } from 'next/server';
import type { AttackConfig } from '@/lib/attacks/config';
import { AttackEngineV2 } from '@/lib/attacks/engine-v2';
import { calculateAllMetrics } from '@/lib/metrics/calculator';

interface AttackRequestBody {
  text: string;
  attackType: string;
  intensity?: 'low' | 'medium' | 'high' | 'evasion';
  techniques?: string[];
  preserveReadability?: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as AttackRequestBody;
    const { text, attackType, intensity = 'medium', techniques = [], preserveReadability = true } = body;

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Invalid input: text is required' },
        { status: 400 }
      );
    }

    if (!attackType || typeof attackType !== 'string') {
      return NextResponse.json(
        { error: 'Invalid input: attackType is required' },
        { status: 400 }
      );
    }

    const validIntensities = ['low', 'medium', 'high', 'evasion'];
    // Default to 'high' for more visible attacks
    const attackIntensity = validIntensities.includes(intensity) ? intensity : 'high';

    const config: Partial<AttackConfig> = {
      intensity: attackIntensity as 'low' | 'medium' | 'high' | 'evasion',
      techniques: Array.isArray(techniques) ? techniques : [],
      preserveReadability: preserveReadability !== false,
    };

    const result = await AttackEngineV2.executeAttack(text, attackType, config);

    // Calculate REAL metrics using actual libraries
    const realMetrics = calculateAllMetrics(text, result.result);

    // Create updated result with real calculated metrics
    const updatedResult = {
      ...result,
      metrics: {
        ...result.metrics,
        similarityScore: realMetrics.similarityScore,
        changeDensity: realMetrics.changeDensity,
      },
      detectionDifficulty: realMetrics.detectionDifficulty.category,
    };

    return NextResponse.json(updatedResult);
  } catch (error) {
    console.error('Error executing attack:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}