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

// Default export
export default {
  AITextDetector,
  detectAIText,
};
