/**
 * Contextual and structural analysis metrics
 */

import { extractTopicWords } from "../utils";
import { commonWords, transitionWords } from "../constants";

export function calculateContextualConsistency(sentences: string[]): number {
  if (sentences.length < 3) return 1;

  let consistencyScore = 0;
  const topics = sentences.map((sentence) =>
    extractTopicWords(sentence, commonWords, transitionWords)
  );

  for (let i = 1; i < topics.length - 1; i++) {
    const prevTopics = new Set(topics[i - 1]);
    const currTopics = new Set(topics[i]);
    const nextTopics = new Set(topics[i + 1]);

    const allTopics = new Set([...prevTopics, ...currTopics, ...nextTopics]);
    const commonTopicsCount = [...allTopics].filter(
      (topic) =>
        [prevTopics, currTopics, nextTopics].filter((set) => set.has(topic))
          .length >= 2
    );

    consistencyScore += commonTopicsCount.length / Math.max(allTopics.size, 1);
  }

  return consistencyScore / Math.max(sentences.length - 2, 1);
}

export function calculateSentenceStructureEntropy(sentences: string[]): number {
  const structures = sentences.map((sentence) => {
    const words = sentence.split(/\s+/);
    const length = words.length;

    // Classify sentence structure
    if (length <= 5) return "short";
    if (length <= 15) return "medium";
    if (length <= 25) return "long";
    return "very_long";
  });

  const structureCounts = new Map<string, number>();
  structures.forEach((structure) => {
    structureCounts.set(structure, (structureCounts.get(structure) || 0) + 1);
  });

  let entropy = 0;
  const totalSentences = sentences.length;

  for (const count of structureCounts.values()) {
    const probability = count / totalSentences;
    entropy -= probability * Math.log2(probability);
  }

  return entropy / Math.log2(Math.min(structureCounts.size, totalSentences));
}

export function calculateTopicCoherenceScore(sentences: string[]): number {
  if (sentences.length < 2) return 1;

  const topicWords = sentences.map((sentence) =>
    extractTopicWords(sentence, commonWords, transitionWords)
  );

  let coherenceSum = 0;
  let comparisons = 0;

  for (let i = 0; i < topicWords.length - 1; i++) {
    for (let j = i + 1; j < Math.min(i + 4, topicWords.length); j++) {
      const words1 = new Set(topicWords[i]);
      const words2 = new Set(topicWords[j]);

      const intersection = new Set([...words1].filter((x) => words2.has(x)));
      const union = new Set([...words1, ...words2]);

      const similarity = intersection.size / Math.max(union.size, 1);
      coherenceSum += similarity;
      comparisons++;
    }
  }

  return comparisons > 0 ? coherenceSum / comparisons : 0;
}
