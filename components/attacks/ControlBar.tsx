'use client';

import { Download, Play, RotateCcw } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { AttackResult } from '@/lib/attacks/types';
import { calculateAllMetrics } from '@/lib/metrics/calculator';


interface ControlBarProps {
  inputText: string;
  selectedAttack: string;
  onOutputChange: (output: string) => void;
  outputText: string;
}

// Helper to convert percentage (0-100) to intensity enum
function percentageToIntensity(percentage: number): 'low' | 'medium' | 'high' | 'evasion' {
  if (percentage >= 90) return 'evasion';
  if (percentage >= 70) return 'high';
  if (percentage >= 40) return 'medium';
  return 'low';
}

// Helper to convert intensity enum to percentage
function _intensityToPercentage(intensity: 'low' | 'medium' | 'high' | 'evasion'): number {
  switch (intensity) {
    case 'low': return 25;
    case 'medium': return 50;
    case 'high': return 75;
    case 'evasion': return 95;
    default: return 50;
  }
}

export default function ControlBar({
  inputText,
  selectedAttack,
  onOutputChange,
  outputText,
}: ControlBarProps) {
  const [intensity, setIntensity] = useState<number>(50); // Default to 50% (Medium)
  const [intensityInput, setIntensityInput] = useState<string>('50');
  const [isExecuting, setIsExecuting] = useState(false);
  const [lastResult, setLastResult] = useState<AttackResult | null>(null);
  const [calculatedMetrics, setCalculatedMetrics] = useState<{
    levenshteinDistance: number;
    evasionScore: number;
    detectionDifficulty: 'low' | 'medium' | 'high' | 'extreme';
    detectionDifficultyScore: number;
  } | null>(null);

  // Calculate metrics in real-time when outputText changes
  useEffect(() => {
    if (outputText && inputText) {
      try {
        const metrics = calculateAllMetrics(inputText, outputText);
        setCalculatedMetrics({
          levenshteinDistance: metrics.levenshteinDistance,
          evasionScore: metrics.evasionScore,
          detectionDifficulty: metrics.detectionDifficulty.category,
          detectionDifficultyScore: metrics.detectionDifficulty.score,
        });
      } catch (error) {
        console.error('Error calculating metrics:', error);
      }
    } else {
      setCalculatedMetrics(null);
    }
  }, [outputText, inputText]);

  const handleIntensityChange = (value: number[]) => {
  const newIntensity = value[0] ?? 50; // Default to 50 if undefined
  setIntensity(newIntensity);
  setIntensityInput(newIntensity.toString());
};

  const handleIntensityInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setIntensityInput(value);
    
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue) && numValue >= 0 && numValue <= 100) {
      setIntensity(numValue);
    }
  };

  const handleIntensityInputBlur = () => {
    const numValue = parseInt(intensityInput, 10);
    if (isNaN(numValue) || numValue < 0) {
      setIntensityInput('0');
      setIntensity(0);
    } else if (numValue > 100) {
      setIntensityInput('100');
      setIntensity(100);
    } else {
      setIntensityInput(numValue.toString());
      setIntensity(numValue);
    }
  };

  const handleExecute = async () => {
  if (!selectedAttack || !inputText.trim()) {
    alert('Please select an attack type and enter some text.');
    return;
  }

  setIsExecuting(true);
  try {
    const intensityEnum = percentageToIntensity(intensity);
    
    const response = await fetch('/api/attack', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: inputText,
        attackType: selectedAttack,
        intensity: intensityEnum,
        preserveReadability: false,
      }),
    });

    if (!response.ok) {
      const error = await response.json() as { error?: string };
      throw new Error(error.error || 'Failed to execute attack');
    }

    const result = await response.json() as AttackResult;
    setLastResult(result);
    onOutputChange(result.result);
  } catch (error) {
    console.error('Error executing attack:', error);
    alert(error instanceof Error ? error.message : 'Failed to execute attack. Please try again.');
  } finally {
    setIsExecuting(false);
  }
};

  const handleReset = () => {
    onOutputChange('');
    setLastResult(null);
    setCalculatedMetrics(null);
  };

  const handleExport = () => {
    if (!lastResult) return;

    const exportData = {
      attackType: selectedAttack,
      intensity: percentageToIntensity(intensity),
      originalText: inputText,
      attackedText: lastResult.result,
      metrics: lastResult.metrics,
      detectionDifficulty: lastResult.detectionDifficulty,
      techniquesUsed: lastResult.techniquesUsed,
      timestamp: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attack-result-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Controls Row */}
      <div className="flex items-center gap-4 flex-wrap">
        {/* Intensity Slider */}
        <div className="flex items-center gap-3 flex-1 min-w-[200px]">
          <label className="text-sm font-medium text-slate-300 whitespace-nowrap">
            Intensity:
          </label>
          <Slider
            value={[intensity]}
            onValueChange={handleIntensityChange}
            min={0}
            max={100}
            step={1}
            className="flex-1"
          />
          <input
            type="number"
            min="0"
            max="100"
            value={intensityInput}
            onChange={handleIntensityInputChange}
            onBlur={handleIntensityInputBlur}
            className="w-16 px-2 py-1 text-sm font-mono bg-slate-800/50 border border-slate-700 rounded-md text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500"
          />
          <span className="text-xs text-slate-400 whitespace-nowrap">%</span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Button
            onClick={handleExecute}
            disabled={!selectedAttack || !inputText.trim() || isExecuting}
            className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Play className="w-4 h-4 mr-2" />
            {isExecuting ? 'Executing...' : 'Execute Attack'}
          </Button>
          
          <Button
            onClick={handleReset}
            variant="outline"
            disabled={!outputText}
            className="border-slate-700 text-slate-300 hover:bg-slate-800/50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="flex items-center justify-end gap-8 flex-wrap">
        {calculatedMetrics && (
          <TooltipProvider>
            <div className="flex items-center gap-8">
              {/* Levenshtein Distance Metric */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-2 cursor-help">
                    <span className="text-xs text-slate-400 font-medium">Levenshtein Distance:</span>
                    <span className="text-xs font-mono text-emerald-400 font-semibold">{calculatedMetrics.levenshteinDistance}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent className="bg-slate-800 text-slate-200 border-slate-700 max-w-xs z-50">
                  <p className="text-sm">Absolute number of character edits (insertions, deletions, substitutions) needed to transform the original text into the attacked text. Higher values indicate more changes.</p>
                </TooltipContent>
              </Tooltip>

              {/* Evasion Score Metric */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex flex-col gap-1.5 min-w-[140px] cursor-help">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs text-slate-400 font-medium">Evasion</span>
                      <span className="text-xs font-mono text-slate-300 font-semibold">{calculatedMetrics.evasionScore.toFixed(0)}%</span>
                    </div>
                    <Progress 
                      value={calculatedMetrics.evasionScore} 
                      className="h-2.5 bg-slate-700 rounded-full shadow-sm"
                    />
                  </div>
                </TooltipTrigger>
                <TooltipContent className="bg-slate-800 text-slate-200 border-slate-700 max-w-xs z-50">
                  <p className="text-sm">How much the attacked text differs from the original. Higher scores indicate more changes and greater potential to evade detection. Calculated using string similarity algorithms.</p>
                </TooltipContent>
              </Tooltip>

              {/* Detection Difficulty Score Metric */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex flex-col gap-1.5 min-w-[140px] cursor-help">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs text-slate-400 font-medium">Difficulty</span>
                      <span className="text-xs font-mono text-slate-300 font-semibold">{calculatedMetrics.detectionDifficultyScore.toFixed(0)}%</span>
                    </div>
                    <Progress 
                      value={calculatedMetrics.detectionDifficultyScore} 
                      className={`h-2.5 rounded-full shadow-sm ${
                        calculatedMetrics.detectionDifficulty === 'extreme' 
                          ? 'bg-red-600/20'
                          : calculatedMetrics.detectionDifficulty === 'high'
                          ? 'bg-red-500/20'
                          : calculatedMetrics.detectionDifficulty === 'medium'
                          ? 'bg-amber-500/20'
                          : 'bg-emerald-500/20'
                      }`}
                      style={{
                        '--progress-indicator': calculatedMetrics.detectionDifficulty === 'extreme'
                          ? 'linear-gradient(to right, #dc2626, #ef4444)'
                          : calculatedMetrics.detectionDifficulty === 'high'
                          ? 'linear-gradient(to right, #ef4444, #f59e0b)'
                          : calculatedMetrics.detectionDifficulty === 'medium'
                          ? 'linear-gradient(to right, #f59e0b, #10b981)'
                          : 'linear-gradient(to right, #10b981, #14b8a6)'
                      } as React.CSSProperties}
                    />
                  </div>
                </TooltipTrigger>
                <TooltipContent className="bg-slate-800 text-slate-200 border-slate-700 max-w-xs z-50">
                  <p className="text-sm">Heuristic combining evasion score (70%) and readability impact (30%) to estimate how difficult it would be to detect this attack. Higher difficulty = better evasion potential.</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
        )}
        
        {lastResult && (
          <Button
            variant="outline"
            onClick={handleExport}
            className="border-slate-700 text-slate-300 hover:bg-slate-800/50"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        )}
      </div>
    </div>
  );
}

