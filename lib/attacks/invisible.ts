// Advanced Invisible Character Attack
export class InvisibleCharacterAttack {
  static execute(text: string, intensity: string = 'medium'): { result: string; changes: number; techniques: string[] } {
    let result = text;
    let changes = 0;
    const techniques: string[] = [];

    const intensityMap: { [key: string]: number } = {
      'low': 0.1,
      'medium': 0.3,
      'high': 0.6,
      'evasion': 0.9
    };

    const threshold = intensityMap[intensity] || 0.3;

    // Zero-width characters
    const zeroWidthChars = ['\u200B', '\u200C', '\u200D', '\uFEFF'];
    
    // Bidirectional override characters
    const bidiChars = [
      '\u202E', // RLO - Right-to-Left Override
      '\u202D', // LRO - Left-to-Right Override\overline
      '\u202A', // LRE - Left-to-Right Embedding
      '\u202B', // RLE - Right-to-Left Embedding
      '\u202C', // PDF - Pop Directional Formatting
      '\u200F', // RLM - Right-to-Left Mark
      '\u200E', // LRM - Left-to-Right Mark
    ];

    // Combining diacritical marks (invisible modifications)
    const combiningMarks = [
      '\u0300', '\u0301', '\u0302', '\u0303', '\u0304', '\u0305',
      '\u0306', '\u0307', '\u0308', '\u0309', '\u030A', '\u030B',
      '\u030C', '\u030D', '\u030E', '\u030F', '\u0310', '\u0311',
    ];

    // Zero-width space insertion
    if (intensity !== 'low') {
      result = result.split('').map((char, index) => {
        if ((char === ' ' || /\ W/.test(char)) && Math.random() < threshold * 0.5) {
          changes++;
          if (!techniques.includes('Zero-Width Spaces')) {
            techniques.push('Zero-Width Spaces');
          }
          return char + zeroWidthChars[Math.floor(Math.random() * zeroWidthChars.length)];
        }
        if (char !== ' ' && Math.random() < threshold * 0.3) {
          changes++;
          if (!techniques.includes('Zero-Width Insertions')) {
            techniques.push('Zero-Width Insertions');
          }
          return char + zeroWidthChars[Math.floor(Math.random() * zeroWidthChars.length)];
        }
        return char;
      }).join('');
    }

    // Bidirectional override (high intensity only)
    if (intensity === 'high' || intensity === 'evasion') {
      const words = result.split(/(\s+)/);
      result = words.map((word, index) => {
        if (word.trim().length > 2 && Math.random() < threshold * 0.2) {
          changes++;
          if (!techniques.includes('Bidirectional Override')) {
            techniques.push('Bidirectional Override');
          }
          // Insert RLO and PDF to reverse text flow
          return bidiChars[0] + word + bidiChars[4];
        }
        return word;
      }).join('');
    }

    // Combining marks for invisible modifications
    if (intensity === 'evasion') {
      result = result.split('').map(char => {
        if (/[a-zA-Z]/.test(char) && Math.random() < 0.1) {
          changes++;
          if (!techniques.includes('Combining Diacritics')) {
            techniques.push('Combining Diacritics');
          }
          return char + combiningMarks[Math.floor(Math.random() * combiningMarks.length)];
        }
        return char;
      }).join('');
    }

    // Unicode normalization breaking sequences
    if (intensity === 'evasion') {
      // Add sequences that break normalization
      const breakingSequences = ['\u200B\u200C', '\u200C\u200D democratic', '\uFEFF\u200B'];
      const words = result.split(' ');
      result = words.map((word, index) => {
        if (word.length > 4 && Math.random() < 0.05) {
          changes++;
          if (!techniques.includes('Normalization Breaking')) {
            techniques.push('Normalization Breaking');
          }
          return word + breakingSequences[Math.floor(Math.random() * breakingSequences.length)];
        }
        return word;
      }).join(' ');
    }

    return { result, changes, techniques };
  }
}

