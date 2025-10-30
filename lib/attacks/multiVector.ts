// Multi-Vector Combined Attacks - EXTREME VERSION
import { AttackConfig, AttackResult } from './config';
import { HomoglyphAdvancedAttack } from './homoglyph-advanced';
import { InvisibleCharacterAdvancedAttack } from './invisible-advanced';
import { SemanticAdvancedAttack } from './semantic-advanced';
import { TypoAdvancedAttack } from './typo-advanced';

export class MultiVectorAttack {
  static async execute(text: string, config: AttackConfig): Promise<AttackResult> {
    let result = text;
    let totalChanges = 0;
    const allTechniques: string[] = [];
    const startTime = performance.now();

    // Execute attacks sequentially based on intensity
    if (config.intensity === 'low') {
      // Semantic only
      const semantic = await SemanticAdvancedAttack.execute(result, {
        ...config,
        intensity: 'low'
      });
      result = semantic.result;
      totalChanges += semantic.metrics.changesMade;
      allTechniques.push(...semantic.techniquesUsed);
    } else if (config.intensity === 'medium') {
      // Semantic + Typo
      const semantic = await SemanticAdvancedAttack.execute(result, {
        ...config,
        intensity: 'medium'
      });
      result = semantic.result;
      totalChanges += semantic.metrics.changesMade;
      allTechniques.push(...semantic.techniquesUsed);

      const typo = await TypoAdvancedAttack.execute(result, {
        ...config,
        intensity: 'medium'
      });
      result = typo.result;
      totalChanges += typo.metrics.changesMade;
      allTechniques.push(...typo.techniquesUsed);
    } else if (config.intensity === 'high') {
      // All attacks at high intensity
      const semantic = await SemanticAdvancedAttack.execute(result, {
        ...config,
        intensity: 'high'
      });
      result = semantic.result;
      totalChanges += semantic.metrics.changesMade;
      allTechniques.push(...semantic.techniquesUsed);

      const typo = await TypoAdvancedAttack.execute(result, {
        ...config,
        intensity: 'high'
      });
      result = typo.result;
      totalChanges += typo.metrics.changesMade;
      allTechniques.push(...typo.techniquesUsed);

      const homoglyph = await HomoglyphAdvancedAttack.execute(result, {
        ...config,
        intensity: 'high'
      });
      result = homoglyph.result;
      totalChanges += homoglyph.metrics.changesMade;
      allTechniques.push(...homoglyph.techniquesUsed);

      const invisible = await InvisibleCharacterAdvancedAttack.execute(result, {
        ...config,
        intensity: 'high'
      });
      result = invisible.result;
      totalChanges += invisible.metrics.changesMade;
      allTechniques.push(...invisible.techniquesUsed);
    } else if (config.intensity === 'evasion') {
      // MAXIMUM EVASION - all attacks at extreme intensity
      const semantic = await SemanticAdvancedAttack.execute(result, {
        ...config,
        intensity: 'evasion'
      });
      result = semantic.result;
      totalChanges += semantic.metrics.changesMade;
      allTechniques.push(...semantic.techniquesUsed);

      const typo = await TypoAdvancedAttack.execute(result, {
        ...config,
        intensity: 'evasion'
      });
      result = typo.result;
      totalChanges += typo.metrics.changesMade;
      allTechniques.push(...typo.techniquesUsed);

      const homoglyph = await HomoglyphAdvancedAttack.execute(result, {
        ...config,
        intensity: 'evasion'
      });
      result = homoglyph.result;
      totalChanges += homoglyph.metrics.changesMade;
      allTechniques.push(...homoglyph.techniquesUsed);

      const invisible = await InvisibleCharacterAdvancedAttack.execute(result, {
        ...config,
        intensity: 'evasion'
      });
      result = invisible.result;
      totalChanges += invisible.metrics.changesMade;
      allTechniques.push(...invisible.techniquesUsed);
    }

    const processingTime = performance.now() - startTime;

    // Remove duplicate techniques
    const uniqueTechniques = Array.from(new Set(allTechniques));

    return {
      result,
      metrics: {
        evasionScore: Math.min(100, Math.round(totalChanges / Math.max(1, text.length) * 150)),
        humanReadability: this.calculateReadability(result),
        changesMade: totalChanges,
        processingTime
      },
      techniquesUsed: uniqueTechniques,
      detectionDifficulty: 'extreme',
      explanation: this.generateExplanation(result, text, totalChanges, uniqueTechniques)
    };
  }

  private static calculateReadability(text: string): number {
    const visibleChars = text.replace(/[\u200B-\u200D\uFEFF]/g, '').length;
    const totalLength = text.length;
    const visibilityRatio = totalLength > 0 ? visibleChars / totalLength : 1;
    return Math.max(50, Math.round(visibilityRatio * 70)); // Lower readability for combined attacks
  }

  private static generateExplanation(
    result: string,
    original: string,
    changes: number,
    techniques: string[]
  ) {
    const examples: string[] = [
      `"hello world" → "${this.transformExample('hello world')}" (combined attacks)`,
      `"the quick fox" → "${this.transformExample('the quick fox')}" (multi-vector)`,
      `Original text transformed using: ${techniques.slice(0, 3).join(', ')}${techniques.length > 3 ? '...' : ''}`
    ];

    return {
      description: `Applied ${changes} modifications using multiple attack vectors: ${techniques.join(', ')}. This combined attack chains semantic, typo, homoglyph, and invisible character attacks for maximum evasion.`,
      detectionTips: [
        'Combine ALL detection strategies (script detection, normalization, spell-checking, semantic analysis)',
        'Use multi-stage detection pipelines',
        'Implement ensemble detection models',
        'Apply comprehensive Unicode normalization',
        'Strip all zero-width and bidirectional characters',
        'Use fuzzy matching with multiple techniques'
      ],
      examples,
      riskLevel: 'critical' as const
    };
  }

  private static transformExample(text: string): string {
    // Apply multiple transformations to show combined effect
    const homoglyphs: { [key: string]: string } = {
      'a': 'а', 'e': 'е', 'o': 'о', 'c': 'с'
    };
    let result = text.split('').map(c => homoglyphs[c] || c).join('');
    
    // Add invisible chars
    result = result.split('').map((c, i) => {
      if (i % 3 === 0 && c !== ' ') return c + '\u200B';
      return c;
    }).join('');
    
    // Add typos
    const typos: { [key: string]: string } = { 'the': 'teh', 'quick': 'kwik' };
    return result.split(' ').map(w => typos[w.toLowerCase()] || w).join(' ');
  }
}
