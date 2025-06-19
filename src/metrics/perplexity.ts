/**
 * Perplexity calculation for AI text detection
 * Measures how well a text can be predicted based on statistical language models
 */

export function calculatePerplexity(words: string[]): number {
  if (words.length < 3) return 10; // Default high perplexity for very short texts

  const wordCounts = new Map<string, number>();
  const bigramCounts = new Map<string, number>();
  const trigramCounts = new Map<string, number>();

  // Count unigrams
  words.forEach((word) => {
    wordCounts.set(word, (wordCounts.get(word) || 0) + 1);
  });

  // Count bigrams
  for (let i = 0; i < words.length - 1; i++) {
    const bigram = `${words[i]} ${words[i + 1]}`;
    bigramCounts.set(bigram, (bigramCounts.get(bigram) || 0) + 1);
  }

  // Count trigrams
  for (let i = 0; i < words.length - 2; i++) {
    const trigram = `${words[i]} ${words[i + 1]} ${words[i + 2]}`;
    trigramCounts.set(trigram, (trigramCounts.get(trigram) || 0) + 1);
  }

  let totalLogProb = 0;
  let totalPredictions = 0;

  // Calculate log probability using interpolated n-gram model
  for (let i = 2; i < words.length; i++) {
    const currentWord = words[i];
    const prevWord = words[i - 1];
    const prevPrevWord = words[i - 2];

    const trigram = `${prevPrevWord} ${prevWord} ${currentWord}`;
    const bigram = `${prevWord} ${currentWord}`;
    const prevBigram = `${prevPrevWord} ${prevWord}`;

    const trigramFreq = trigramCounts.get(trigram) || 0;
    const bigramFreq = bigramCounts.get(bigram) || 0;
    const prevBigramFreq = bigramCounts.get(prevBigram) || 0;
    const wordFreq = wordCounts.get(currentWord) || 0;

    // Interpolated probability with smoothing
    let probability = 0;

    // Trigram probability
    if (prevBigramFreq > 0) {
      probability +=
        (0.6 * (trigramFreq + 0.1)) /
        (prevBigramFreq + 0.1 * trigramCounts.size);
    }

    // Bigram probability
    const prevWordFreq = wordCounts.get(prevWord) || 0;
    if (prevWordFreq > 0) {
      probability +=
        (0.3 * (bigramFreq + 0.1)) / (prevWordFreq + 0.1 * bigramCounts.size);
    }

    // Unigram probability
    probability +=
      (0.1 * (wordFreq + 0.1)) / (words.length + 0.1 * wordCounts.size);

    // Ensure minimum probability
    probability = Math.max(probability, 0.0001);

    totalLogProb += Math.log2(probability);
    totalPredictions++;
  }

  // Calculate perplexity
  const averageLogProb = totalLogProb / Math.max(totalPredictions, 1);
  return Math.pow(2, -averageLogProb);
}
