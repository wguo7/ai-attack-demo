// Advanced Homoglyph Attack using confusables library
// Libraries are loaded dynamically to handle missing dependencies gracefully
let confusables: any = null;

try {
  confusables = require('confusables');
} catch (e) {
  // Library not available, will use fallback
}

export class HomoglyphAttack {
  private static getIntensityThreshold(intensity: string): number {
    switch (intensity) {
      case 'low': return 0.2;
      case 'medium': return 0.5;
      case 'high': return 0.8;
      case 'evasion': return 0.95;
      default: return 0.5;
    }
  }

  static execute(text: string, intensity: string = 'medium'): { result: string; changes: number; techniques: string[] } {
    const threshold = this.getIntensityThreshold(intensity);
    let result = text;
    let changes = 0;
    const techniques: string[] = [];

    // Method 1: Use confusables library for official Unicode TR39 confusables
    try {
      if (confusables && confusables.get) {
        result = result.split('').map((char, index) => {
          if (Math.random() < threshold && /[a-zA-Z0-9]/.test(char)) {
            const confusable = confusables.get(char);
            if (confusable && confusable.length > 0) {
              // Select a confusable from a different script when possible
              const bestConfusable = confusable.find((c: string) => {
                const originalScript = this.getScript(char);
                const confusableScript = this.getScript(c);
                return originalScript !== confusableScript;
              }) || confusable[0];

              if (bestConfusable !== char) {
                changes++;
                if (!techniques.includes('TR39 Confusables')) {
                  techniques.push('TR39 Confusables');
                }
                return bestConfusable;
              }
            }
          }
          return char;
        }).join('');
      }
    } catch (e) {
      // Fallback if confusables library fails
    }

    // Method 2: Zero-width joiner for complex glyph combinations
    if (intensity === 'high' || intensity === 'evasion') {
      const words = result.split(/(\s+)/);
      result = words.map((word, index) => {
        if (word.trim().length > 3 && Math.random() < 0.1) {
          // Insert zero-width joiner in the middle
          const mid = Math.floor(word.length / 2);
          const before = word.slice(0, mid);
          const after = word.slice(mid);
          if (before && after) {
            changes++;
            if (!techniques.includes('Zero-Width Joiner')) {
              techniques.push('Zero-Width Joiner');
            }
            return before + '\u200D' + after;
          }
        }
        return word;
      }).join('');
    }

    // Method 3: Mixed script attack (Latin + Cyrillic + Greek)
    if (intensity === 'evasion') {
      const mixedScriptMap: { [key: string]: string } = {
        'a': 'а', 'e': 'е', 'o': 'о', 'c': 'с', 'p': 'р', 'x': 'х', 'y': 'у',
        'A': 'А', 'B': 'В', 'C': 'С', 'E': 'Е', 'H': 'Н', 'K': 'К', 'M': 'М',
        'O': 'О', 'P': 'Р', 'T': 'Т', 'X': 'Х', 'Y': 'У',
      };
      
      result = result.split('').map(char => {
        if (Math.random() < 0.3 && mixedScriptMap[char]) {
          changes++;
          if (!techniques.includes('Mixed Script')) {
            techniques.push('Mixed Script');
          }
          return mixedScriptMap[char];
        }
        return char;
      }).join('');
    }

    return { result, changes, techniques };
  }

  private static getScript(char: string): string {
    const code = char.charCodeAt(0);
    if (code >= 0x0400 && code <= 0x04FF) return 'Cyrillic';
    if (code >= 0x0370 && code <= 0x03FF) return 'Greek';
    if (code >= 0x0020 && code <= 0x007F) return 'Latin';
    if (code >= 0x1D400 && code <= 0x1D7FF) return 'Mathematical';
    return 'Unknown';
  }
}
