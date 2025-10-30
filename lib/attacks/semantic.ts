// Semantic Attacks using natural and compromise
// Libraries are loaded dynamically to handle missing dependencies gracefully
let nlp: any = null;

try {
  nlp = require('compromise');
} catch (e) {
  // Library not available, will use fallback
}

export class SemanticAttack {
  static execute(text: string, intensity: string = 'medium'): { result: string; changes: number; techniques: string[] } {
    let result = text;
    let changes = 0;
    const techniques: string[] = [];

    const intensityMap: { [key: string]: number } = {
      'low': 0.1,
      'medium': 0.3,
      'high': 0.5,
      'evasion': 0.7
    };

    const threshold = intensityMap[intensity] || 0.3;

    try {
      // Synonym replacement using compromise
      if (!nlp) {
        throw new Error('compromise library not available');
      }
      const doc = nlp(result);
      
      // Replace adjectives with synonyms
      if (intensity !== 'low') {
        doc.match('#Adjective').forEach((match: any) => {
          if (Math.random() < threshold) {
            const synonym = this.getSynonym(match.text());
            if (synonym && synonym !== match.text()) {
              match.replaceWith(synonym);
              changes++;
              if (!techniques.includes('Synonym Replacement')) {
                techniques.push('Synonym Replacement');
              }
            }
          }
        });
      }

      // Sentence structure paraphrasing
      if (intensity === 'high' || intensity === 'evasion') {
        doc.sentences().forEach((sent: any) => {
          if (Math.random() < threshold * 0.5) {
            const paraphrased = this.paraphraseSentence(sent.text());
            if (paraphrased && paraphrased !== sent.text()) {
              sent.replaceWith(paraphrased);
              changes++;
              if (!techniques.includes('Sentence Paraphrasing')) {
                techniques.push('Sentence Paraphrasing');
              }
            }
          }
        });
      }

      // Style transfer
      if (intensity === 'evasion') {
        doc.contract();
        changes++;
        if (!techniques.includes('Style Transfer')) {
          techniques.push('Style Transfer');
        }
      }

      result = doc.text();
    } catch (e) {
      // Fallback if NLP fails
      result = text;
    }

    return { result, changes, techniques };
  }

  private static getSynonym(word: string): string | null {
    const synonymMap: { [key: string]: string[] } = {
      'good': ['great', 'excellent', 'fine', 'superb', 'outstanding'],
      'bad': ['poor', 'terrible', 'awful', 'horrible', 'dreadful'],
      'big': ['large', 'huge', 'massive', 'enormous', 'gigantic'],
      'small': ['tiny', 'little', 'mini', 'miniature', 'compact'],
      'fast': ['quick', 'rapid', 'swift', 'speedy', 'brisk'],
      'slow': ['sluggish', 'leisurely', 'unhurried', 'gradual'],
      'happy': ['joyful', 'cheerful', 'pleased', 'delighted', 'content'],
      'sad': ['unhappy', 'melancholy', 'depressed', 'gloomy', 'dejected'],
      'important': ['significant', 'crucial', 'vital', 'essential', 'key'],
      'easy': ['simple', 'straightforward', 'effortless', 'uncomplicated']
    };

    const lower = word.toLowerCase().trim();
    if (synonymMap[lower]) {
      const synonyms = synonymMap[lower];
      return synonyms[Math.floor(Math.random() * synonyms.length)] || null;
    }
    return null;
  }

  private static paraphraseSentence(sentence: string): string | null {
    // Simple paraphrasing patterns
    const patterns = [
      { from: /^(.+) is (.+)\.$/i, to: '$1 appears to be $2.' },
      { from: /^(.+) are (.+)\.$/i, to: '$1 seem to be $2.' },
      { from: /^(.+) can (.+)\.$/i, to: '$1 are able to $2.' },
      { from: /^(.+) will (.+)\.$/i, to: '$1 are going to $2.' }
    ];

    for (const pattern of patterns) {
      if (pattern.from.test(sentence)) {
        const result = sentence.replace(pattern.from, pattern.to);
        return result || null;
      }
    }
    return null;
  }
}

