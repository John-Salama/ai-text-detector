/**
 * Centralized exports for all metrics
 */

// Perplexity and language modeling
export { calculatePerplexity } from "./perplexity";

// Burstiness and sentence analysis
export {
  calculateBurstiness,
  calculateAverageWordsPerSentence,
  calculateSentenceVariability,
} from "./burstiness";

// Lexical analysis
export {
  calculateLexicalDiversity,
  calculateVocabularyRichness,
  analyzeWordFrequencyDistribution,
  calculateEntropyScore,
} from "./lexical";

// Syntactic and semantic analysis
export {
  calculateSyntacticComplexity,
  calculateSemanticCoherence,
  calculateNGramRepetition,
  calculateBigramUnusualness,
} from "./syntactic";

// Style and readability
export {
  calculateReadabilityScore,
  analyzePunctuationPatterns,
  calculateTransitionDensity,
  calculateFormalityIndex,
  calculateStylometricSignature,
} from "./style";

// Human-likeness and emotional analysis
export {
  calculateHumanLikenessIndicators,
  calculateEmotionalToneVariability,
  calculateInformalnessScore,
  calculateDiscourseMarkerPatterns,
  calculateFunctionWordAnalysis,
} from "./human";

// Contextual and structural analysis
export {
  calculateContextualConsistency,
  calculateSentenceStructureEntropy,
  calculateTopicCoherenceScore,
} from "./contextual";

// Narrative and creative writing
export { calculateNarrativeScore, calculateCreativityScore } from "./narrative";
