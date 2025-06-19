export interface DetectionResult {
  isAIGenerated: boolean;
  confidence: number;
  reasons: string[];
  score: number;
  perplexityScore: number;
  burstinessScore: number;
}

export interface AnalysisMetrics {
  perplexity: number;
  burstiness: number;
  averageWordsPerSentence: number;
  sentenceVariability: number;
  lexicalDiversity: number;
  readabilityScore: number;
  syntacticComplexity: number;
  semanticCoherence: number;
  nGramRepetition: number;
  punctuationPatterns: number;
  wordFrequencyDistribution: number;
  transitionDensity: number;
  formalityIndex: number;
  vocabularyRichness: number;
  contextualConsistency: number;
  // Enhanced metrics
  entropyScore: number;
  humanLikenessIndicators: number;
  emotionalToneVariability: number;
  discourseMarkerPatterns: number;
  functionWordAnalysis: number;
  informalnessScore: number;
  sentenceStructureEntropy: number;
  topicCoherenceScore: number;
  bigramUnusualness: number;
  stylometricSignature: number;
}
