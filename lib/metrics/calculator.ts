/**
 * Real-time metric calculation using external libraries
 * Provides fallbacks if libraries are not available
 */

// Type definitions for optional libraries
type StringSimilarityLib = {
  compareTwoStrings: (str1: string, str2: string) => number;
};

type LevenshteinLib = (str1: string, str2: string) => number;

// Dynamic imports with fallbacks
let stringSimilarityLib: StringSimilarityLib | null = null;
let levenshteinLib: LevenshteinLib | null = null;

// Try to load libraries using dynamic imports
function loadStringSimilarity() {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const similarityModule = require('string-similarity');
    stringSimilarityLib = similarityModule as StringSimilarityLib;
  } catch {
    // Library not available, will use fallback
  }
}

function loadLevenshtein() {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const levenshteinModule = require('levenshtein-edit-distance');
    levenshteinLib = levenshteinModule as LevenshteinLib;
  } catch {
    // Library not available, will use fallback
  }
}

// Load libraries (called at module load time)
loadStringSimilarity();
loadLevenshtein();

/**
 * Calculate similarity score (0-100%) between two strings
 * Lower similarity = more effective attack
 */
export function calculateSimilarityScore(
  original: string,
  attacked: string
): number {
  if (!original || !attacked) return 0;
  if (original === attacked) return 100;

  try {
    if (stringSimilarityLib?.compareTwoStrings) {
      const similarity = stringSimilarityLib.compareTwoStrings(original, attacked);
      return Math.round(similarity * 100);
    }
  } catch {
    console.warn('Error calculating similarity with library');
  }

  // Fallback: simple character-based comparison
  const maxLen = Math.max(original.length, attacked.length);
  if (maxLen === 0) return 100;
  
  let matches = 0;
  const minLen = Math.min(original.length, attacked.length);
  for (let i = 0; i < minLen; i++) {
    if (original[i] === attacked[i]) matches++;
  }
  
  return Math.round((matches / maxLen) * 100);
}

/**
 * Calculate Levenshtein edit distance (absolute number of edits)
 */
/**
 * Calculate Levenshtein edit distance (absolute number of edits)
 */
export function calculateLevenshteinDistance(
  original: string,
  attacked: string
): number {
  if (!original || original.length === 0) return attacked ? attacked.length : 0;
  if (!attacked || attacked.length === 0) return original.length;

  if (levenshteinLib && typeof levenshteinLib === 'function') {
    try {
      return levenshteinLib(original, attacked);
    } catch {
      // Fall through to manual implementation
    }
  }

  // Manual Levenshtein distance calculation
  const m = original.length;
  const n = attacked.length;
  const dp: number[][] = Array(m + 1).fill(0).map(() => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) {
    dp[i]![0] = i;
  }
  for (let j = 0; j <= n; j++) {
    dp[0]![j] = j;
  }

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (original[i - 1] === attacked[j - 1]) {
        dp[i]![j] = dp[i - 1]![j - 1]!;
      } else {
        dp[i]![j] = Math.min(
          dp[i - 1]![j]! + 1,    // deletion
          dp[i]![j - 1]! + 1,    // insertion
          dp[i - 1]![j - 1]! + 1 // substitution
        );
      }
    }
  }

  return dp[m]![n]!;
}

/**
 * Calculate change density (percentage of text changed)
 * Uses Levenshtein edit distance
 */
export function calculateChangeDensity(
  original: string,
  attacked: string
): number {
  if (!original || original.length === 0) return attacked ? 100 : 0;
  if (!attacked || attacked.length === 0) return 100;

  const distance = calculateLevenshteinDistance(original, attacked);
  const maxLen = Math.max(original.length, attacked.length);
  return maxLen > 0 ? Math.round((distance / maxLen) * 100) : 0;
}

/**
 * Calculate evasion score (0-100)
 * Higher score = more changes = better evasion potential
 * Based on similarity: lower similarity = higher evasion
 */
export function calculateEvasionScore(
  original: string,
  attacked: string
): number {
  const similarity = calculateSimilarityScore(original, attacked);
  return 100 - similarity;
}

/**
 * Calculate detection difficulty (low/medium/high/extreme + score 0-100)
 * Based on evasion score alone
 */
export function calculateDetectionDifficulty(
  original: string,
  attacked: string
): { category: 'low' | 'medium' | 'high' | 'extreme', score: number } {
  const evasionScore = calculateEvasionScore(original, attacked);
  
  // Use evasion score directly as difficulty score
  const difficultyScore = evasionScore;
  
  // Categorize
  let category: 'low' | 'medium' | 'high' | 'extreme';
  if (difficultyScore >= 75) category = 'extreme';
  else if (difficultyScore >= 50) category = 'high';
  else if (difficultyScore >= 25) category = 'medium';
  else category = 'low';

  return { category, score: Math.min(100, Math.round(difficultyScore)) };
}

/**
 * Calculate all metrics at once
 */
export function calculateAllMetrics(original: string, attacked: string) {
  const similarityScore = calculateSimilarityScore(original, attacked);
  const levenshteinDistance = calculateLevenshteinDistance(original, attacked);
  const changeDensity = calculateChangeDensity(original, attacked);
  const evasionScore = calculateEvasionScore(original, attacked);
  const detectionDifficulty = calculateDetectionDifficulty(original, attacked);

  return {
    similarityScore,
    levenshteinDistance,
    changeDensity,
    evasionScore,
    detectionDifficulty,
  };
}

