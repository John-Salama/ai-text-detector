/**
 * Lexical analysis metrics for AI text detection
 */

export function calculateLexicalDiversity(words: string[]): number {
  const uniqueWords = new Set(words);
  return uniqueWords.size / words.length;
}

export function calculateVocabularyRichness(words: string[]): number {
  const uniqueWords = new Set(words);
  const hapaxLegomena = Array.from(uniqueWords).filter(
    (word) => words.filter((w) => w === word).length === 1
  );

  return hapaxLegomena.length / uniqueWords.size;
}

export function analyzeWordFrequencyDistribution(words: string[]): number {
  const wordCounts = new Map<string, number>();
  words.forEach((word) => {
    wordCounts.set(word, (wordCounts.get(word) || 0) + 1);
  });

  const frequencies = Array.from(wordCounts.values()).sort((a, b) => b - a);

  // Zipf's law analysis - natural text follows specific distribution
  let zipfScore = 0;
  for (let i = 1; i < Math.min(frequencies.length, 10); i++) {
    const expected = frequencies[0] / (i + 1);
    const actual = frequencies[i];
    const ratio = Math.min(actual, expected) / Math.max(actual, expected);
    zipfScore += ratio;
  }

  return zipfScore / Math.min(frequencies.length - 1, 9);
}

export function calculateEntropyScore(words: string[]): number {
  const wordCounts = new Map<string, number>();
  words.forEach((word) => {
    wordCounts.set(word, (wordCounts.get(word) || 0) + 1);
  });

  const totalWords = words.length;
  let entropy = 0;

  for (const count of wordCounts.values()) {
    const probability = count / totalWords;
    entropy -= probability * Math.log2(probability);
  }

  // Normalize entropy (higher entropy = more human-like)
  return entropy / Math.log2(Math.min(wordCounts.size, totalWords));
}
