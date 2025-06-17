interface DetectionResult {
    isAIGenerated: boolean;
    confidence: number;
    reasons: string[];
    score: number;
    perplexityScore: number;
    burstinessScore: number;
}
export declare function detectAIText(text: string): DetectionResult;
export declare function isAIGenerated(text: string): boolean;
export declare function getConfidenceScore(text: string): number;
export declare function getPerplexityScore(text: string): number;
export declare function getBurstinessScore(text: string): number;
declare const _default: {
    detectAIText: typeof detectAIText;
    isAIGenerated: typeof isAIGenerated;
    getConfidenceScore: typeof getConfidenceScore;
    getPerplexityScore: typeof getPerplexityScore;
    getBurstinessScore: typeof getBurstinessScore;
};
export default _default;
export type { DetectionResult };
