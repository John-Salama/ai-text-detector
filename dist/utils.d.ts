/**
 * Text processing utilities for AI text detection
 */
export declare function tokenizeWords(text: string): string[];
export declare function splitIntoSentences(text: string): string[];
export declare function extractTopicWords(sentence: string, commonWords: Set<string>, transitionWords: string[]): string[];
