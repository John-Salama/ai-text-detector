/**
 * Burstiness calculation for AI text detection
 * Measures variation in sentence lengths
 */

export function calculateBurstiness(sentences: string[]): number {
  if (sentences.length < 2) return 0;

  const lengths = sentences.map((s) => s.split(/\s+/).length);
  const mean = lengths.reduce((a, b) => a + b, 0) / lengths.length;
  const variance =
    lengths.reduce((sum, len) => sum + Math.pow(len - mean, 2), 0) /
    lengths.length;
  const stdDev = Math.sqrt(variance);

  // Burstiness formula: (σ - μ) / (σ + μ)
  return (stdDev - mean) / (stdDev + mean);
}

export function calculateAverageWordsPerSentence(sentences: string[]): number {
  if (sentences.length === 0) return 0;
  const totalWords = sentences.reduce(
    (sum, sentence) => sum + sentence.split(/\s+/).length,
    0
  );
  return totalWords / sentences.length;
}

export function calculateSentenceVariability(sentences: string[]): number {
  if (sentences.length < 2) return 0;

  const lengths = sentences.map((s) => s.split(/\s+/).length);
  const average = lengths.reduce((a, b) => a + b, 0) / lengths.length;
  const variance =
    lengths.reduce((sum, len) => sum + Math.pow(len - average, 2), 0) /
    lengths.length;
  return Math.sqrt(variance);
}
