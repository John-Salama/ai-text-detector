/**
 * Text processing utilities for AI text detection
 */

export function tokenizeWords(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s'-]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 0);
}

export function splitIntoSentences(text: string): string[] {
  return text
    .split(/[.!?]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

export function extractTopicWords(
  sentence: string,
  commonWords: Set<string>,
  transitionWords: string[]
): string[] {
  const words = tokenizeWords(sentence);
  return words.filter(
    (word) =>
      word.length > 4 &&
      !commonWords.has(word) &&
      !transitionWords.includes(word)
  );
}
