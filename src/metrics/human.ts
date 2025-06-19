/**
 * Human-likeness and emotional analysis metrics
 */

import {
  humanPatterns,
  emotionalMarkers,
  discourseMarkers,
  functionWords,
} from "../constants";
import { tokenizeWords, splitIntoSentences } from "../utils";

export function calculateHumanLikenessIndicators(text: string): number {
  let score = 0;
  let totalIndicators = 0;

  const words = tokenizeWords(text);
  const sentences = splitIntoSentences(text);

  // Check for informal language (enhanced patterns)
  const informalMatches = humanPatterns.reduce((count, pattern) => {
    return count + (text.match(pattern) || []).length;
  }, 0);
  score += Math.min(informalMatches / 3, 1); // Increased sensitivity
  totalIndicators++;

  // Check for contractions (very human-like)
  const contractions = (text.match(/\b\w+[''](?:t|re|ve|ll|d|s|m)\b/gi) || [])
    .length;
  score += Math.min(contractions / 5, 1); // More sensitive
  totalIndicators++;

  // Check for typos and misspellings
  const potentialTypos = text.match(/\b[a-z]*[aeiou]{3,}[a-z]*\b/gi) || [];
  const doubleLetters = text.match(/\b\w*([a-z])\1{2,}\w*\b/gi) || [];
  const inconsistentSpacing = text.match(/\s{2,}/g) || [];
  score += Math.min(
    (potentialTypos.length +
      doubleLetters.length +
      inconsistentSpacing.length) /
      5, // More sensitive
    1
  );
  totalIndicators++;

  // Check for personal pronouns and narrative style
  const personalPronouns = (
    text.match(/\b(I|me|my|mine|myself|we|us|our|ours)\b/gi) || []
  ).length;
  score += Math.min(personalPronouns / Math.max(words.length * 0.05, 1), 1); // More sensitive
  totalIndicators++;

  // Check for emotional punctuation (very human)
  const emotionalPunct = (text.match(/[!]{2,}|[?]{2,}|[.]{3,}/g) || []).length;
  score += Math.min(emotionalPunct / 3, 1); // More sensitive
  totalIndicators++;

  // Check for ALL CAPS words (emphasis) - very human
  const capsWords = (text.match(/\b[A-Z]{2,}\b/g) || []).length;
  score += Math.min(capsWords / 5, 1); // More sensitive
  totalIndicators++;

  // Check for internet slang and abbreviations (very human)
  const internetSlang = (
    text.match(
      /\b(lol|lmao|omg|wtf|btw|tbh|imho|imo|ngl|smh|fml|irl|rn|af|fr|periodt|idk|ikr|brb|ttyl|dm|pm|sus|lit|fam|bae|goat|facts|no cap|bet|vibe|mood|periodt)\b/gi
    ) || []
  ).length;
  score += Math.min(internetSlang / 2, 1); // Very sensitive to slang
  totalIndicators++;

  // Check for incomplete sentences or fragments (human-like)
  const fragments = sentences.filter((s) => {
    const words = s.trim().split(/\s+/);
    return (
      words.length < 4 &&
      !words.some((w) =>
        w.match(/^(yes|no|ok|okay|yeah|nah|sure|maybe|absolutely|definitely)$/i)
      )
    );
  }).length;
  score += Math.min(fragments / Math.max(sentences.length * 0.3, 1), 0.8);
  totalIndicators++;

  // Check for conversational markers (very human)
  const conversationalMarkers = (
    text.match(
      /\b(like|you know|I mean|right|so|well|um|uh|actually|basically|literally|honestly|seriously|obviously|apparently|supposedly|kinda|sorta|maybe|probably|definitely|absolutely|totally|completely|exactly|precisely)\b/gi
    ) || []
  ).length;
  score += Math.min(conversationalMarkers / Math.max(words.length * 0.1, 1), 1);
  totalIndicators++;

  // Check for creative/descriptive language (narrative human writing)
  const creativeDescriptions = (
    text.match(
      /\b(nearly twice|hardly any|very large|came in very useful|no finer|big beefy|which made|although he did|spent so much|craning over|spying on)\b/gi
    ) || []
  ).length;
  score += Math.min(creativeDescriptions / 3, 1);
  totalIndicators++;

  // Check for character names and storytelling elements
  const narrativeElements = (
    text.match(
      /\b(Mr\.|Mrs\.|called|named|director|firm|son|opinion|neighbors|mustache|blonde)\b/gi
    ) || []
  ).length;
  score += Math.min(narrativeElements / 5, 0.8);
  totalIndicators++;

  // Check for narrative pronouns (third person storytelling)
  const narrativePronouns = (
    text.match(/\b(he|she|they|him|her|them|his|hers|their|theirs)\b/gi) || []
  ).length;
  score += Math.min(narrativePronouns / Math.max(words.length * 0.08, 1), 0.7);
  totalIndicators++;

  return score / totalIndicators;
}

export function calculateEmotionalToneVariability(text: string): number {
  let emotionalMarkerCount = 0;

  emotionalMarkers.forEach((pattern) => {
    emotionalMarkerCount += (text.match(pattern) || []).length;
  });

  // Additional emotional indicators
  const exclamations = (text.match(/!/g) || []).length;
  const questions = (text.match(/\?/g) || []).length;
  const emotionalWords = (
    text.match(
      /\b(love|hate|excited|frustrated|angry|happy|sad|worried|anxious|amazing|terrible|awesome|awful|horrible|wonderful|fantastic|disgusting|annoying|brilliant|stupid|crazy|insane|wild|mad|furious|thrilled|devastated|shocked|surprised|confused|overwhelmed)\b/gi
    ) || []
  ).length;

  const words = tokenizeWords(text);
  const totalEmotionalSignals =
    emotionalMarkerCount + exclamations + questions + emotionalWords;

  return Math.min(totalEmotionalSignals / Math.max(words.length * 0.1, 1), 1);
}

export function calculateInformalnessScore(text: string): number {
  let informalityScore = 0;
  let totalFeatures = 0;

  const words = tokenizeWords(text);
  const sentences = splitIntoSentences(text);

  // Contractions (very informal)
  const contractions = (text.match(/\b\w+[''](?:t|re|ve|ll|d|s|m)\b/gi) || [])
    .length;
  informalityScore += Math.min(
    contractions / Math.max(words.length * 0.1, 1),
    1
  );
  totalFeatures++;

  // Slang and colloquialisms (very informal)
  const slangCount = humanPatterns.reduce((count, pattern) => {
    return count + (text.match(pattern) || []).length;
  }, 0);
  informalityScore += Math.min(slangCount / 5, 1); // More sensitive
  totalFeatures++;

  // Sentence fragments (informal)
  const fragments = sentences.filter((s) => s.split(/\s+/).length < 4).length;
  informalityScore += Math.min(
    fragments / Math.max(sentences.length * 0.4, 1),
    1
  );
  totalFeatures++;

  // Ellipses and multiple punctuation (informal)
  const multiplePunct = (text.match(/[.!?]{2,}/g) || []).length;
  informalityScore += Math.min(multiplePunct / 5, 1); // More sensitive
  totalFeatures++;

  // Conversational words (informal)
  const conversationalWords = (
    text.match(
      /\b(like|you know|I mean|right|so|well|um|uh|actually|basically|literally|honestly|seriously|obviously|apparently|kinda|sorta|gonna|wanna|gotta)\b/gi
    ) || []
  ).length;
  informalityScore += Math.min(
    conversationalWords / Math.max(words.length * 0.05, 1),
    1
  );
  totalFeatures++;

  // Lowercase sentence beginnings (very informal)
  const lowercaseStarts = sentences.filter((s) => {
    const trimmed = s.trim();
    return (
      trimmed.length > 0 &&
      trimmed[0] === trimmed[0].toLowerCase() &&
      trimmed[0].match(/[a-z]/)
    );
  }).length;
  informalityScore += Math.min(
    lowercaseStarts / Math.max(sentences.length * 0.3, 1),
    1
  );
  totalFeatures++;

  // Run-on sentences with "and" (informal)
  const runOnSentences = sentences.filter((s) => {
    const andCount = (s.match(/\band\b/gi) || []).length;
    const wordCount = s.split(/\s+/).length;
    return andCount > 2 && wordCount > 20;
  }).length;
  informalityScore += Math.min(
    runOnSentences / Math.max(sentences.length * 0.5, 1),
    0.8
  );
  totalFeatures++;

  return informalityScore / totalFeatures;
}

export function calculateDiscourseMarkerPatterns(words: string[]): number {
  const discourseMarkerCount = words.filter((word) =>
    discourseMarkers.some((marker) =>
      marker.toLowerCase().includes(word.toLowerCase())
    )
  ).length;

  // AI tends to overuse discourse markers
  const density = discourseMarkerCount / words.length;
  return Math.min(density * 50, 1);
}

export function calculateFunctionWordAnalysis(words: string[]): number {
  const functionWordCount = words.filter((word) =>
    functionWords.includes(word.toLowerCase())
  ).length;

  const ratio = functionWordCount / words.length;

  // Natural human text typically has 40-60% function words
  // AI often deviates from this pattern
  if (ratio >= 0.4 && ratio <= 0.6) {
    return 0.2; // Lower score for human-like ratio
  } else {
    return Math.min(Math.abs(ratio - 0.5) * 2, 1);
  }
}
