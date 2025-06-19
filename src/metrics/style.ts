/**
 * Readability and style analysis metrics
 */

import {
  transitionWords,
  sophisticatedWords,
  functionWords,
  commonWords,
} from "../constants";
import { tokenizeWords } from "../utils";

export function calculateReadabilityScore(
  text: string,
  sentences: string[],
  words: string[]
): number {
  const avgWordsPerSentence = words.length / sentences.length;
  const complexWords = words.filter((word) => word.length > 6).length;
  const complexWordRatio = complexWords / words.length;

  // Simplified Flesch-Kincaid-like formula
  return 206.835 - 1.015 * avgWordsPerSentence - 84.6 * complexWordRatio;
}

export function analyzePunctuationPatterns(text: string): number {
  const punctuation = text.match(/[.!?;:,]/g) || [];
  const words = tokenizeWords(text);

  if (words.length === 0) return 0;

  // AI often has consistent punctuation patterns
  const punctuationRatio = punctuation.length / words.length;
  const commaRatio = (text.match(/,/g) || []).length / words.length;
  const semicolonRatio = (text.match(/;/g) || []).length / words.length;

  // AI tends to use moderate punctuation
  let score = 0;
  if (punctuationRatio > 0.05 && punctuationRatio < 0.15) score += 0.3;
  if (commaRatio > 0.02 && commaRatio < 0.08) score += 0.3;
  if (semicolonRatio > 0.001 && semicolonRatio < 0.01) score += 0.2;

  return score;
}

export function calculateTransitionDensity(words: string[]): number {
  const transitionCount = words.filter((word) =>
    transitionWords.some((tw) => word.includes(tw))
  ).length;

  return (transitionCount / words.length) * 100;
}

export function calculateFormalityIndex(words: string[]): number {
  const sophisticatedCount = words.filter((word) =>
    sophisticatedWords.includes(word)
  ).length;

  const commonWordCount = words.filter((word) => commonWords.has(word)).length;

  return (
    sophisticatedCount /
    words.length /
    Math.max(commonWordCount / words.length, 0.1)
  );
}

export function calculateStylometricSignature(
  text: string,
  sentences: string[],
  words: string[]
): number {
  let signature = 0;
  let components = 0;

  // Average sentence length variability
  const sentenceLengths = sentences.map((s) => s.split(/\s+/).length);
  const avgLength =
    sentenceLengths.reduce((a, b) => a + b, 0) / sentenceLengths.length;
  const lengthVariance =
    sentenceLengths.reduce(
      (sum, len) => sum + Math.pow(len - avgLength, 2),
      0
    ) / sentenceLengths.length;
  signature += Math.min(Math.sqrt(lengthVariance) / avgLength, 1);
  components++;

  // Word length distribution
  const wordLengths = words.map((w) => w.length);
  const avgWordLength =
    wordLengths.reduce((a, b) => a + b, 0) / wordLengths.length;
  const wordLengthVariance =
    wordLengths.reduce(
      (sum, len) => sum + Math.pow(len - avgWordLength, 2),
      0
    ) / wordLengths.length;
  signature += Math.min(Math.sqrt(wordLengthVariance) / avgWordLength, 1);
  components++;

  // Punctuation variety
  const punctuationTypes = new Set(text.match(/[.!?;:,\-()]/g) || []);
  signature += Math.min(punctuationTypes.size / 8, 1);
  components++;

  // Sentence beginning variety
  const sentenceBeginnings = sentences
    .map((s) => {
      const firstWord = s.trim().split(/\s+/)[0];
      return firstWord ? firstWord.toLowerCase() : "";
    })
    .filter((w) => w.length > 0);

  const uniqueBeginnings = new Set(sentenceBeginnings);
  signature += Math.min(uniqueBeginnings.size / sentenceBeginnings.length, 1);
  components++;

  return signature / components;
}
