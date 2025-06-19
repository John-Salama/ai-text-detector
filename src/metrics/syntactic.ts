/**
 * Syntactic and semantic analysis metrics
 */

import { tokenizeWords } from "../utils";

export function calculateSyntacticComplexity(sentences: string[]): number {
  let totalComplexity = 0;

  sentences.forEach((sentence) => {
    const words = sentence.split(/\s+/);
    let complexity = 0;

    // Count subordinate clauses (simplified)
    complexity += (
      sentence.match(
        /\b(that|which|who|whom|whose|when|where|while|although|because|since|if|unless|until)\b/gi
      ) || []
    ).length;

    // Count conjunctions
    complexity += (sentence.match(/\b(and|but|or|yet|so|for|nor)\b/gi) || [])
      .length;

    // Penalize very long sentences
    if (words.length > 30) complexity += 2;
    if (words.length > 40) complexity += 3;

    totalComplexity += complexity / Math.max(words.length, 1);
  });

  return totalComplexity / sentences.length;
}

export function calculateSemanticCoherence(sentences: string[]): number {
  if (sentences.length < 2) return 1;

  let coherenceScore = 0;

  for (let i = 1; i < sentences.length; i++) {
    const prevWords = new Set(tokenizeWords(sentences[i - 1]));
    const currWords = new Set(tokenizeWords(sentences[i]));

    // Calculate word overlap between consecutive sentences
    const intersection = new Set(
      [...prevWords].filter((x) => currWords.has(x))
    );
    const union = new Set([...prevWords, ...currWords]);

    coherenceScore += intersection.size / union.size;
  }

  return coherenceScore / (sentences.length - 1);
}

export function calculateNGramRepetition(words: string[]): number {
  const trigrams = new Map<string, number>();

  for (let i = 0; i < words.length - 2; i++) {
    const trigram = `${words[i]} ${words[i + 1]} ${words[i + 2]}`;
    trigrams.set(trigram, (trigrams.get(trigram) || 0) + 1);
  }

  const repeatedTrigrams = Array.from(trigrams.values()).filter(
    (count) => count > 1
  );
  return repeatedTrigrams.length / Math.max(trigrams.size, 1);
}

export function calculateBigramUnusualness(words: string[]): number {
  const bigramCounts = new Map<string, number>();
  const totalBigrams = words.length - 1;

  // Count bigrams
  for (let i = 0; i < words.length - 1; i++) {
    const bigram = `${words[i]} ${words[i + 1]}`;
    bigramCounts.set(bigram, (bigramCounts.get(bigram) || 0) + 1);
  }

  // Calculate unusualness based on expected frequency
  let unusualness = 0;
  bigramCounts.forEach((count, bigram) => {
    const [word1, word2] = bigram.split(" ");
    const word1Count = words.filter((w) => w === word1).length;
    const word2Count = words.filter((w) => w === word2).length;

    // Expected frequency based on individual word frequencies
    const expectedFreq = (word1Count * word2Count) / words.length;
    const actualFreq = count;

    if (actualFreq > expectedFreq * 2) {
      unusualness += actualFreq / totalBigrams;
    }
  });

  return Math.min(unusualness, 1);
}
