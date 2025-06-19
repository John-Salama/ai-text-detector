/**
 * AI Text Detector - Main entry point
 * Refactored for better maintainability and modularity
 */
import { DetectionResult } from './types';
import { AITextDetector } from './detector';
export { AITextDetector } from './detector';
export { DetectionResult, AnalysisMetrics } from './types';
/**
 * Convenience function to detect AI-generated text
 * @param text - The text to analyze
 * @returns Detection result
 */
export declare function detectAIText(text: string): DetectionResult;
/**
 * Legacy function to check if text is AI-generated
 * @param text - The text to analyze
 * @returns boolean indicating if text is likely AI-generated
 */
export declare function isAIGenerated(text: string): boolean;
/**
 * Legacy function to get confidence score
 * @param text - The text to analyze
 * @returns confidence score between 0 and 1
 */
export declare function getConfidenceScore(text: string): number;
/**
 * Legacy function to get perplexity score
 * @param text - The text to analyze
 * @returns perplexity score
 */
export declare function getPerplexityScore(text: string): number;
/**
 * Legacy function to get burstiness score
 * @param text - The text to analyze
 * @returns burstiness score
 */
export declare function getBurstinessScore(text: string): number;
declare const _default: {
    AITextDetector: typeof AITextDetector;
    detectAIText: typeof detectAIText;
    isAIGenerated: typeof isAIGenerated;
    getConfidenceScore: typeof getConfidenceScore;
    getPerplexityScore: typeof getPerplexityScore;
    getBurstinessScore: typeof getBurstinessScore;
};
export default _default;
