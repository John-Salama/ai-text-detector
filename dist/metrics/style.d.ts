/**
 * Readability and style analysis metrics
 */
export declare function calculateReadabilityScore(text: string, sentences: string[], words: string[]): number;
export declare function analyzePunctuationPatterns(text: string): number;
export declare function calculateTransitionDensity(words: string[]): number;
export declare function calculateFormalityIndex(words: string[]): number;
export declare function calculateStylometricSignature(text: string, sentences: string[], words: string[]): number;
