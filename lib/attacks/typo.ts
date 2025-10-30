// Advanced Typo Attack using typo-js and keyboard distance algorithms

export class TypoAttack {
  private static keyboardLayouts = {
    qwerty: {
      rows: [
        ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '='],
        ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\'],
        ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'"],
        ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/']
      ]
    }
  };

  static execute(text: string, intensity: string = 'medium'): { result: string; changes: number; techniques: string[] } {
    let result = text;
    let changes = 0;
    const techniques: string[] = [];

    const intensityMap: { [key: string]: number } = {
      'low': 0.1,
      'medium': 0.2,
      'high': 0.4,
      'evasion': 0.7
    };

    const threshold = intensityMap[intensity] || 0.2;

    // Keyboard distance-based substitutions
    result = result.split('').map((char) => {
      if (Math.random() < threshold && /[a-z]/.test(char.toLowerCase())) {
        const typo = this.getKeyboardTypo(char);
        if (typo && typo !== char) {
          changes++;
          if (!techniques.includes('Keyboard Distance')) {
            techniques.push('Keyboard Distance');
          }
          return this.preserveCase(char, typo);
        }
      }
      return char;
    }).join('');

    // Phonetic misspellings (soundex-based)
    if (intensity === 'high' || intensity === 'evasion') {
      const words = result.split(/(\s+)/);
      result = words.map(word => {
        const cleanWord = word.toLowerCase().trim();
        if (cleanWord.length > 3 && Math.random() < threshold) {
          const phoneticTypo = this.getPhoneticTypo(cleanWord);
          if (phoneticTypo && phoneticTypo !== cleanWord) {
            changes++;
            if (!techniques.includes('Phonetic Errors')) {
              techniques.push('Phonetic Errors');
            }
            return this.preserveCase(word, phoneticTypo);
          }
        }
        return word;
      }).join('');
    }

    // Common autocorrect errors
    if (intensity === 'evasion') {
      const autocorrectMap: { [key: string]: string } = {
        'the': 'teh', 'and': 'adn', 'are': 'aer',
        'you': 'yuo', 'your': 'yoru', 'their': 'thier',
        'there': 'ther', 'where': 'wher', 'what': 'waht'
      };

      const words = result.split(/(\s+)/);
      result = words.map(word => {
        const lowerWord = word.toLowerCase().trim();
        if (autocorrectMap[lowerWord] && Math.random() < 0.3) {
          changes++;
          if (!techniques.includes('Autocorrect Errors')) {
            techniques.push('Autocorrect Errors');
          }
          return this.preserveCase(word, autocorrectMap[lowerWord]);
        }
        return word;
      }).join('');
    }

    return { result, changes, techniques };
  }

  private static getKeyboardTypo(char: string): string | null {
    const lower = char.toLowerCase();
    const layout = this.keyboardLayouts.qwerty;
    
    // Find position
    for (let rowIdx = 0; rowIdx < layout.rows.length; rowIdx++) {
      const row = layout.rows[rowIdx];
      const colIdx = row.indexOf(lower);
      if (colIdx !== -1) {
        // Try adjacent keys
        const candidates: string[] = [];
        if (colIdx > 0) candidates.push(row[colIdx - 1]);
        if (colIdx < row.length - 1) candidates.push(row[colIdx + 1]);
        if (rowIdx > 0 && layout.rows[rowIdx - 1][colIdx]) {
          candidates.push(layout.rows[rowIdx - 1][colIdx]);
        }
        if (rowIdx < layout.rows.length - 1 && layout.rows[rowIdx + 1][colIdx]) {
          candidates.push(layout.rows[rowIdx + 1][colIdx]);
        }
        if (candidates.length > 0) {
          return candidates[Math.floor(Math.random() * candidates.length)];
        }
      }
    }
    return null;
  }

  private static getPhoneticTypo(word: string): string | null {
    // Simple phonetic replacements
    const phoneticMap: { [key: string]: string } = {
      'ph': 'f', 'f': 'ph',
      'c': 'k', 'k': 'c',
      'x': 'ks', 'qu': 'kw',
      'tion': 'shun', 'sion': 'shun'
    };

    for (const [pattern, replacement] of Object.entries(phoneticMap)) {
      if (word.includes(pattern)) {
        return word.replace(pattern, replacement);
      }
    }
    return null;
  }

  private static preserveCase(original: string, replacement: string): string {
    if (original === original.toUpperCase()) {
      return replacement.toUpperCase();
    }
    if (original[0] === original[0].toUpperCase()) {
      return replacement.charAt(0).toUpperCase() + replacement.slice(1);
    }
    return replacement;
  }
}

