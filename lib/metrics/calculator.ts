/**
 * Real-time metric calculation using external libraries
 * Provides fallbacks if libraries are not available
 */

// Dynamic imports with fallbacks
let stringSimilarityLib: any = null;
let fleschLib: any = null;
let levenshteinLib: any = null;
let textStatisticsLib: any = null;

// Try to load libraries
try {
  stringSimilarityLib = require('string-similarity');
} catch (e) {
  console.warn('string-similarity not available, using fallback');
}

try {
  const fleschModule = require('flesch');
  // flesch library exports a named export 'flesch', check for both default and named
  fleschLib = fleschModule.flesch || fleschModule.default || fleschModule;
  if (typeof fleschLib !== 'function') {
    fleschLib = null;
  }
} catch (e) {
  console.warn('flesch not available, using fallback');
}

try {
  levenshteinLib = require('levenshtein-edit-distance');
} catch (e) {
  console.warn('levenshtein-edit-distance not available, using fallback');
}

try {
  textStatisticsLib = require('text-statistics');
} catch (e) {
  console.warn('text-statistics not available, using fallback');
}

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
  } catch (e) {
    console.warn('Error calculating similarity with library:', e);
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
 * Count syllables in a word using a simple heuristic algorithm
 * This is an approximation - for accurate results, use a dedicated syllable library
 */
function countSyllables(word: string): number {
  if (!word || word.length === 0) return 1;
  
  // Clean word - remove punctuation and convert to lowercase
  const cleanWord = word.toLowerCase().replace(/[^\w]/g, '');
  if (cleanWord.length === 0) return 1;
  
  // Count vowel groups
  let syllableCount = 0;
  const vowels = /[aeiouy]+/g;
  const vowelMatches = cleanWord.match(vowels);
  
  if (vowelMatches) {
    syllableCount = vowelMatches.length;
  } else {
    // No vowels found, treat as 1 syllable
    return 1;
  }
  
  // Adjust for silent 'e' at the end
  if (cleanWord.endsWith('e') && cleanWord.length > 1 && syllableCount > 1) {
    syllableCount--;
  }
  
  // Adjust for diphthongs and triphthongs (multiple vowels together)
  // Count consecutive vowels as single syllable if appropriate
  let consecutiveVowels = 0;
  for (let i = 0; i < cleanWord.length - 1; i++) {
    if (/[aeiouy]/.test(cleanWord[i]) && /[aeiouy]/.test(cleanWord[i + 1])) {
      consecutiveVowels++;
    }
  }
  if (consecutiveVowels > 0) {
    syllableCount -= Math.floor(consecutiveVowels / 2);
  }
  
  // Ensure at least 1 syllable
  return Math.max(1, syllableCount);
}

/**
 * Count total syllables in text
 */
function countTotalSyllables(text: string): number {
  const words = text.split(/\s+/).filter(w => w.trim().length > 0);
  let totalSyllables = 0;
  
  for (const word of words) {
    totalSyllables += countSyllables(word);
  }
  
  return totalSyllables;
}

/**
 * Dale–Chall word list - common English words known by 80% of 4th graders
 * This is a simplified subset of the full 3000-word list
 */
const DALE_CHALL_WORDS = new Set([
  'a', 'able', 'about', 'above', 'across', 'act', 'active', 'actual', 'add', 'afraid',
  'after', 'again', 'age', 'ago', 'agree', 'air', 'all', 'allow', 'alone', 'along',
  'already', 'also', 'although', 'always', 'am', 'among', 'amount', 'an', 'and', 'angle',
  'angry', 'animal', 'answer', 'any', 'appear', 'apple', 'are', 'area', 'arm', 'arrange',
  'arrive', 'art', 'as', 'ask', 'at', 'ate', 'attack', 'attempt', 'attend', 'attention',
  'attract', 'aunt', 'autumn', 'away', 'baby', 'back', 'bad', 'bag', 'ball', 'band',
  'bank', 'bar', 'base', 'basic', 'bat', 'bath', 'be', 'bear', 'beat', 'beauty',
  'became', 'because', 'become', 'bed', 'been', 'before', 'began', 'begin', 'behind',
  'believe', 'bell', 'best', 'bet', 'better', 'between', 'big', 'bill', 'bird', 'bit',
  'bite', 'black', 'block', 'blood', 'blow', 'blue', 'board', 'boat', 'body', 'bone',
  'book', 'border', 'born', 'both', 'bottom', 'box', 'boy', 'branch', 'bread', 'break',
  'bright', 'bring', 'broad', 'broke', 'brother', 'brought', 'brown', 'brush', 'build',
  'burn', 'burst', 'bus', 'bush', 'business', 'busy', 'but', 'buy', 'by', 'cake',
  'call', 'calm', 'came', 'camp', 'can', 'capital', 'captain', 'car', 'card', 'care',
  'carry', 'case', 'cat', 'catch', 'caught', 'cause', 'cell', 'center', 'century',
  'certain', 'chair', 'chance', 'change', 'character', 'charge', 'chart', 'check',
  'chicken', 'child', 'children', 'choose', 'chose', 'church', 'circle', 'city', 'class',
  'clean', 'clear', 'climb', 'clock', 'close', 'cloth', 'cloud', 'coast', 'coat',
  'cold', 'collect', 'college', 'color', 'column', 'come', 'common', 'company', 'compare',
  'complete', 'condition', 'consider', 'contain', 'content', 'continue', 'control', 'cook',
  'cool', 'copy', 'corn', 'corner', 'correct', 'cost', 'cotton', 'could', 'count',
  'country', 'couple', 'course', 'cover', 'cow', 'create', 'crop', 'cross', 'crowd',
  'cry', 'current', 'cut', 'dad', 'dance', 'danger', 'dark', 'date', 'daughter', 'day',
  'dead', 'deal', 'dear', 'death', 'decide', 'decimal', 'deep', 'deer', 'degree',
  'depend', 'describe', 'desert', 'design', 'determine', 'develop', 'did', 'die', 'differ',
  'different', 'difficult', 'direct', 'discuss', 'distant', 'divide', 'division', 'do',
  'doctor', 'does', 'dog', 'dollar', 'done', 'door', 'double', 'down', 'draw', 'dream',
  'dress', 'drink', 'drive', 'drop', 'drove', 'dry', 'during', 'each', 'ear', 'early',
  'earn', 'earth', 'east', 'easy', 'eat', 'edge', 'effect', 'egg', 'eight', 'either',
  'element', 'else', 'end', 'enemy', 'energy', 'engine', 'engineer', 'enjoy', 'enough',
  'enter', 'entire', 'equal', 'equate', 'especially', 'even', 'evening', 'event', 'ever',
  'every', 'exact', 'example', 'except', 'exercise', 'expect', 'experience', 'experiment',
  'explain', 'express', 'eye', 'face', 'fact', 'fair', 'fall', 'family', 'famous', 'far',
  'farm', 'farmer', 'fast', 'fat', 'father', 'favor', 'fear', 'feed', 'feel', 'feet',
  'fell', 'felt', 'few', 'field', 'fig', 'fight', 'figure', 'fill', 'film', 'final',
  'find', 'fine', 'finger', 'finish', 'fire', 'firm', 'first', 'fish', 'fit', 'five',
  'fix', 'flag', 'flat', 'floor', 'flow', 'flower', 'fly', 'follow', 'food', 'foot',
  'for', 'force', 'forest', 'form', 'former', 'forward', 'found', 'four', 'fraction',
  'free', 'fresh', 'friend', 'from', 'front', 'fruit', 'full', 'fun', 'game', 'garden',
  'gas', 'gather', 'gave', 'general', 'gentle', 'get', 'girl', 'give', 'glad', 'glass',
  'go', 'goes', 'gold', 'gone', 'good', 'got', 'govern', 'grand', 'grass', 'gray',
  'great', 'green', 'grew', 'ground', 'group', 'grow', 'guess', 'guide', 'gun', 'had',
  'hair', 'half', 'hall', 'hand', 'hang', 'happen', 'happy', 'hard', 'has', 'hat',
  'have', 'he', 'head', 'hear', 'heard', 'heart', 'heat', 'heavy', 'held', 'help',
  'her', 'here', 'hero', 'hers', 'high', 'hill', 'him', 'himself', 'his', 'history',
  'hit', 'hold', 'hole', 'home', 'honor', 'hope', 'horse', 'hot', 'hour', 'house',
  'how', 'however', 'huge', 'human', 'hundred', 'hung', 'hunt', 'hurry', 'hurt', 'I',
  'ice', 'idea', 'if', 'imagine', 'important', 'in', 'inch', 'include', 'indicate',
  'industry', 'insect', 'instant', 'instrument', 'interest', 'into', 'iron', 'is', 'island',
  'it', 'its', 'itself', 'job', 'join', 'joy', 'judge', 'jump', 'just', 'keep', 'kept',
  'key', 'kill', 'kind', 'king', 'knew', 'know', 'lady', 'laid', 'lake', 'land', ' language',
  'large', 'last', 'late', 'later', 'laugh', 'law', 'lay', 'lead', 'learn', 'least',
  'leave', 'led', 'left', 'leg', 'length', 'less', 'let', 'letter', 'level', 'lie',
  'life', 'lift', 'light', 'like', 'line', 'list', 'listen', 'little', 'live', 'locate',
  'long', 'look', 'lose', 'loss', 'lot', 'loud', 'love', 'low', 'machine', 'made',
  'main', 'major', 'make', 'man', 'many', 'map', 'march', 'mark', 'market', 'mass',
  'master', 'match', 'material', 'matter', 'may', 'maybe', 'me', 'mean', 'measure', 'meat',
  'meet', 'melody', 'member', 'men', 'metal', 'method', 'middle', 'might', 'mile', 'milk',
  'million', 'mind', 'mine', 'minute', 'miss', 'mix', 'modern', 'molecule', 'moment',
  'money', 'month', 'moon', 'more', 'morning', 'most', 'mother', 'motion', 'mount', 'move',
  'much', 'music', 'must', 'my', 'name', 'nation', 'natural', 'nature', 'near', 'necessary',
  'neck', 'need', 'neighbor', 'never', 'new', 'next', 'nice', 'night', 'nine', 'no',
  'none', 'nor', 'north', 'nose', 'not', 'note', 'nothing', 'notice', 'now', 'number',
  'numeral', 'object', 'observe', 'occur', 'ocean', 'of', 'off', 'offer', 'office', 'often',
  'oh', 'oil', 'old', 'on', 'once', 'one', 'only', 'open', 'operate', 'opposite',
  'or', 'order', 'organ', 'original', 'other', 'our', 'out', 'over', 'own', 'oxygen',
  'page', 'paint', 'pair', 'paper', 'paragraph', 'parent', 'park', 'part', 'particular',
  'party', 'pass', 'past', 'path', 'pattern', 'pay', 'peace', 'people', 'per', 'percent',
  'perhaps', 'period', 'person', 'phrase', 'pick', 'picture', 'piece', 'pitch', 'place',
  'plain', 'plan', 'plane', 'planet', 'plant', 'play', 'please', 'plural', 'plus', 'point',
  'pole', 'poor', 'pop', 'populate', 'port', 'pose', 'position', 'possible', 'post', 'pot',
  'pound', 'power', 'practice', 'prepare', 'present', 'press', 'pretty', 'print', 'probably',
  'problem', 'process', 'produce', 'product', 'program', 'property', 'protect', 'prove', 'provide',
  'pull', 'push', 'put', 'quarter', 'question', 'quick', 'quiet', 'quite', 'quotient',
  'race', 'radio', 'rail', 'rain', 'raise', 'ran', 'range', 'rapid', 'rate', 'rather',
  'reach', 'read', 'ready', 'real', 'reason', 'receive', 'record', 'red', 'region', 'relate',
  'remain', 'remember', 'repeat', 'reply', 'represent', 'require', 'rest', 'result', 'return',
  'reveal', 'rich', 'ride', 'right', 'ring', 'rise', 'river', 'road', 'rock', 'roll',
  'room', 'root', 'rope', 'rose', 'round', 'row', 'rule', 'run', 'safe', 'said',
  'sail', 'salt', 'same', 'sand', 'sat', 'save', 'saw', 'say', 'scale', 'school',
  'science', 'score', 'sea', 'search', 'season', 'seat', 'second', 'section', 'see', 'seed',
  'seem', 'segment', 'select', 'self', 'sell', 'send', 'sense', 'sent', 'sentence', 'separate',
  'serve', 'set', 'settle', 'seven', 'several', 'shall', 'shape', 'share', 'sharp', 'she',
  'sheet', 'shell', 'ship', 'shirt', 'shoe', 'shop', 'short', 'should', 'shoulder', 'show',
  'showed', 'shown', 'side', 'sight', 'sign', 'signal', 'silent', 'similar', 'simple', 'since',
  'sing', 'single', 'sink', 'sir', 'sister', 'sit', 'six', 'size', 'skill', 'skin',
  'sky', 'sleep', 'slide', 'slow', 'small', 'smell', 'smile', 'snow', 'so', 'soap',
  'social', 'soft', 'soil', 'sold', 'soldier', 'solution', 'solve', 'some', 'son', 'song',
  'soon', 'sound', 'south', 'space', 'speak', 'special', 'speech', 'speed', 'spell', 'spend',
  'spoke', 'spot', 'spread', 'spring', 'square', 'stand', 'star', 'start', 'state', 'station',
  'stay', 'steam', 'steel', 'step', 'stick', 'still', 'stone', 'stood', 'stop', 'store',
  'story', 'straight', 'strange', 'stream', 'street', 'stretch', 'string', 'strong', 'student',
  'study', 'subject', 'substance', 'subtract', 'success', 'such', 'sudden', 'suffix', 'sugar',
  'suggest', 'suit', 'sum', 'summer', 'sun', 'supply', 'support', 'suppose', 'sure', 'surface',
  'surprise', 'swim', 'syllable', 'symbol', 'system', 'table', 'tail', 'take', 'talk', 'tall',
  'taste', 'tax', 'tea', 'teach', 'team', 'teeth', 'tell', 'temperature', 'ten', 'term',
  'test', 'than', 'thank', 'that', 'the', 'their', 'them', 'then', 'there', 'these',
  'they', 'thick', 'thin', 'thing', 'think', 'third', 'this', 'those', 'though', 'thought',
  'thousand', 'three', 'through', 'throw', 'thus', 'tie', 'time', 'tiny', 'tire', 'to',
  'together', 'told', 'tone', 'too', 'took', 'tool', 'top', 'total', 'touch', 'toward',
  'town', 'track', 'trade', 'train', 'travel', 'treat', 'tree', 'triangle', 'trip', 'trouble',
  'truck', 'true', 'try', 'tube', 'turn', 'twenty', 'two', 'type', 'under', 'understand',
  'unit', 'until', 'up', 'upon', 'use', 'usual', 'valley', 'value', 'vary', 'verb',
  'very', 'view', 'village', 'visit', 'voice', 'vowel', 'wait', 'walk', 'wall', 'want',
  'war', 'warm', 'was', 'wash', 'watch', 'water', 'wave', 'way', 'we', 'weak',
  'wear', 'weather', 'week', 'weight', 'well', 'went', 'were', 'west', 'what', 'wheel',
  'when', 'where', 'whether', 'which', 'while', 'white', 'who', 'whole', 'whose', 'why',
  'wide', 'wife', 'wild', 'will', 'win', 'wind', 'window', 'wing', 'winter', 'wire',
  'wise', 'wish', 'with', 'within', 'without', 'woman', 'women', 'wonder', 'won\'t', 'wood',
  'word', 'wore', 'work', 'world', 'would', 'write', 'written', 'wrong', 'wrote', 'yard',
  'year', 'yellow', 'yes', 'yet', 'you', 'young', 'your', 'yourself'
]);

/**
 * Check if a word is in the Dale–Chall list (common word)
 */
function isDaleChallWord(word: string): boolean {
  const clean = word.toLowerCase().replace(/[^a-z]/g, '');
  return DALE_CHALL_WORDS.has(clean);
}

/**
 * Calculate Dale–Chall Readability Score (0-100)
 * Higher score = easier to read
 * Formula: 0.1579 × (percentage of difficult words) + 0.0496 × (average sentence length) + 3.6365
 * Score is then converted to 0-100 scale where lower raw score = higher readability
 */
export function calculateReadabilityScore(text: string): number {
  if (!text || text.trim().length === 0) return 0;

  // Remove invisible characters for counting
  const cleanText = text.replace(/[\u200B-\u200D\uFEFF]/g, '');
  if (!cleanText || cleanText.trim().length === 0) return 0;

  // Count sentences
  const sentences = cleanText.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const sentenceCount = Math.max(1, sentences.length);
  
  // Count words
  const words = cleanText.split(/\s+/).filter(w => w.trim().length > 0);
  const wordCount = words.length;
  
  if (wordCount === 0) return 0;
  
  // Count difficult words (not in Dale–Chall list)
  let difficultWords = 0;
  for (const word of words) {
    if (!isDaleChallWord(word)) {
      difficultWords++;
    }
  }
  
  const percentageDifficult = (difficultWords / wordCount) * 100;
  const avgSentenceLength = wordCount / sentenceCount;
  
  // Dale–Chall formula: 0.1579 × (% difficult) + 0.0496 × (avg sentence length) + 3.6365
  const rawScore = (0.1579 * percentageDifficult) + (0.0496 * avgSentenceLength) + 3.6365;
  
  // Convert to 0-100 scale (invert: lower raw score = higher readability)
  // Raw scores typically range from 4-10 (4 = easy, 10 = difficult)
  // Map: 4 -> 100, 10 -> 0
  const readability = 100 - ((rawScore - 4) / 6) * 100;
  
  // Clamp to 0-100 range
  return Math.max(0, Math.min(100, Math.round(readability)));
}

/**
 * Calculate Levenshtein edit distance (absolute number of edits)
 */
export function calculateLevenshteinDistance(
  original: string,
  attacked: string
): number {
  if (!original || original.length === 0) return attacked ? attacked.length : 0;
  if (!attacked || attacked.length === 0) return original.length;

  try {
    if (levenshteinLib && typeof levenshteinLib === 'function') {
      return levenshteinLib(original, attacked);
    }
  } catch (e) {
    console.warn('Error calculating Levenshtein distance with library:', e);
  }

  // Fallback: Dynamic programming implementation
  const m = original.length;
  const n = attacked.length;
  const dp: number[][] = [];
  
  for (let i = 0; i <= m; i++) {
    dp[i] = [i];
  }
  for (let j = 0; j <= n; j++) {
    dp[0][j] = j;
  }
  
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (original[i - 1] === attacked[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = Math.min(
          dp[i - 1][j] + 1,     // deletion
          dp[i][j - 1] + 1,     // insertion
          dp[i - 1][j - 1] + 1  // substitution
        );
      }
    }
  }
  
  return dp[m][n];
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
 * Heuristic: (evasionScore * 0.7) + (readabilityImpact * 0.3)
 */
export function calculateDetectionDifficulty(
  original: string,
  attacked: string
): { category: 'low' | 'medium' | 'high' | 'extreme', score: number } {
  const evasionScore = calculateEvasionScore(original, attacked);
  const readability = calculateReadabilityScore(attacked);
  const readabilityImpact = 100 - readability; // Lower readability = harder to detect
  
  // Heuristic: (evasionScore * 0.7) + (readabilityImpact * 0.3)
  const difficultyScore = (evasionScore * 0.7) + (readabilityImpact * 0.3);
  
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
  const readabilityScore = calculateReadabilityScore(attacked);
  const levenshteinDistance = calculateLevenshteinDistance(original, attacked);
  const changeDensity = calculateChangeDensity(original, attacked);
  const evasionScore = calculateEvasionScore(original, attacked);
  const detectionDifficulty = calculateDetectionDifficulty(original, attacked);

  return {
    similarityScore,
    readabilityScore,
    levenshteinDistance,
    changeDensity,
    evasionScore,
    detectionDifficulty,
  };
}

