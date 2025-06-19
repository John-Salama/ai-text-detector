/**
 * AI Text Detector - Main entry point
 * Refactored for better maintainability and modularity
 */

import { DetectionResult } from "./types";
import { AITextDetector } from "./detector";

// Export the main detector class
export { AITextDetector } from "./detector";

// Export types for consumers
export { DetectionResult, AnalysisMetrics } from "./types";

// Create a default instance for convenience
const detector = new AITextDetector();

/**
 * Convenience function to detect AI-generated text
 * @param text - The text to analyze
 * @returns Detection result
 */
export function detectAIText(text: string): DetectionResult {
  return detector.detectAIText(text);
}

/**
 * Legacy function to check if text is AI-generated
 * @param text - The text to analyze
 * @returns boolean indicating if text is likely AI-generated
 */
export function isAIGenerated(text: string): boolean {
  return detector.detectAIText(text).isAIGenerated;
}

/**
 * Legacy function to get confidence score
 * @param text - The text to analyze
 * @returns confidence score between 0 and 1
 */
export function getConfidenceScore(text: string): number {
  return detector.detectAIText(text).confidence;
}

/**
 * Legacy function to get perplexity score
 * @param text - The text to analyze
 * @returns perplexity score
 */
export function getPerplexityScore(text: string): number {
  return detector.detectAIText(text).perplexityScore;
}

/**
 * Legacy function to get burstiness score
 * @param text - The text to analyze
 * @returns burstiness score
 */
export function getBurstinessScore(text: string): number {
  return detector.detectAIText(text).burstinessScore;
}

// Default export
export default {
  AITextDetector,
  detectAIText,
  isAIGenerated,
  getConfidenceScore,
  getPerplexityScore,
  getBurstinessScore,
};
