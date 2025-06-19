/**
 * Main AI Text Detector class
 */

import { DetectionResult, AnalysisMetrics } from "./types";
import { tokenizeWords, splitIntoSentences } from "./utils";
import * as metrics from "./metrics";

export class AITextDetector {
  public detectAIText(text: string): DetectionResult {
    if (!text || text.trim().length === 0) {
      throw new Error("Text cannot be empty");
    }

    if (text.trim().length < 50) {
      throw new Error(
        "Text too short for reliable analysis (minimum 50 characters)"
      );
    }

    const analysisMetrics = this.analyzeText(text);
    const score = this.calculateAdvancedAIScore(analysisMetrics);

    // More balanced threshold - conservative but not too much
    let threshold = 0.58; // Slightly lower base threshold

    // Adjust threshold based on text length
    const wordCount = tokenizeWords(text).length;
    if (wordCount < 100) {
      threshold += 0.04; // Less adjustment for shorter texts
    } else if (wordCount > 300) {
      threshold -= 0.02; // Slightly more sensitive for longer texts
    }

    // Detect narrative/literary writing patterns - ONLY for highly narrative text
    const narrativeScore = metrics.calculateNarrativeScore(text);
    if (narrativeScore > 0.5) {
      threshold += 0.15; // Much more conservative for clearly narrative text
    } else if (narrativeScore > 0.35) {
      threshold += 0.08; // Moderate adjustment for somewhat narrative text
    }

    // Adjust based on detected human patterns - be more selective
    if (analysisMetrics.humanLikenessIndicators > 0.6) {
      threshold += 0.2; // Strong adjustment for very human text
    } else if (analysisMetrics.humanLikenessIndicators > 0.4) {
      threshold += 0.12; // Moderate adjustment for clearly human text
    } else if (analysisMetrics.humanLikenessIndicators > 0.2) {
      threshold += 0.05; // Small adjustment for somewhat human text
    }

    if (analysisMetrics.informalnessScore > 0.5) {
      threshold += 0.15; // Strong adjustment for very informal text
    } else if (analysisMetrics.informalnessScore > 0.3) {
      threshold += 0.08; // Moderate adjustment for informal text
    } else if (analysisMetrics.informalnessScore > 0.15) {
      threshold += 0.03; // Small adjustment for somewhat informal text
    }

    if (analysisMetrics.emotionalToneVariability > 0.4) {
      threshold += 0.12; // Adjustment for very emotional text
    } else if (analysisMetrics.emotionalToneVariability > 0.2) {
      threshold += 0.06; // Small adjustment for somewhat emotional text
    }

    // Check for creative writing indicators - be more selective
    const creativityScore = metrics.calculateCreativityScore(text);
    if (creativityScore > 0.5) {
      threshold += 0.2; // Strong boost for very creative writing
    } else if (creativityScore > 0.35) {
      threshold += 0.1; // Moderate boost for creative writing
    }

    const isAIGenerated = score > threshold;
    const confidence = Math.round(score * 100) / 100;
    const reasons = this.generateDetailedReasons(analysisMetrics, score);

    return {
      isAIGenerated,
      confidence,
      reasons,
      score,
      perplexityScore: analysisMetrics.perplexity,
      burstinessScore: analysisMetrics.burstiness,
    };
  }

  private analyzeText(text: string): AnalysisMetrics {
    const sentences = splitIntoSentences(text);
    const words = tokenizeWords(text);
    const cleanWords = words.filter((word) => word.length > 2);

    return {
      perplexity: metrics.calculatePerplexity(words),
      burstiness: metrics.calculateBurstiness(sentences),
      averageWordsPerSentence:
        metrics.calculateAverageWordsPerSentence(sentences),
      sentenceVariability: metrics.calculateSentenceVariability(sentences),
      lexicalDiversity: metrics.calculateLexicalDiversity(cleanWords),
      readabilityScore: metrics.calculateReadabilityScore(
        text,
        sentences,
        words
      ),
      syntacticComplexity: metrics.calculateSyntacticComplexity(sentences),
      semanticCoherence: metrics.calculateSemanticCoherence(sentences),
      nGramRepetition: metrics.calculateNGramRepetition(words),
      punctuationPatterns: metrics.analyzePunctuationPatterns(text),
      wordFrequencyDistribution:
        metrics.analyzeWordFrequencyDistribution(cleanWords),
      transitionDensity: metrics.calculateTransitionDensity(cleanWords),
      formalityIndex: metrics.calculateFormalityIndex(cleanWords),
      vocabularyRichness: metrics.calculateVocabularyRichness(cleanWords),
      contextualConsistency: metrics.calculateContextualConsistency(sentences),
      // Enhanced metrics
      entropyScore: metrics.calculateEntropyScore(words),
      humanLikenessIndicators: metrics.calculateHumanLikenessIndicators(text),
      emotionalToneVariability: metrics.calculateEmotionalToneVariability(text),
      discourseMarkerPatterns:
        metrics.calculateDiscourseMarkerPatterns(cleanWords),
      functionWordAnalysis: metrics.calculateFunctionWordAnalysis(cleanWords),
      informalnessScore: metrics.calculateInformalnessScore(text),
      sentenceStructureEntropy:
        metrics.calculateSentenceStructureEntropy(sentences),
      topicCoherenceScore: metrics.calculateTopicCoherenceScore(sentences),
      bigramUnusualness: metrics.calculateBigramUnusualness(words),
      stylometricSignature: metrics.calculateStylometricSignature(
        text,
        sentences,
        words
      ),
    };
  }

  private calculateAdvancedAIScore(analysisMetrics: AnalysisMetrics): number {
    let score = 0;

    // Focus on the most discriminative metrics with proper weighting

    // 1. Human-likeness indicators (MOST IMPORTANT - inverse scoring)
    const humanScore = 1 - analysisMetrics.humanLikenessIndicators;
    score += humanScore * 0.25; // Reduced from 0.30

    // 2. Informality score (VERY IMPORTANT - inverse scoring)
    const formalityScore = 1 - analysisMetrics.informalnessScore;
    score += formalityScore * 0.2; // Reduced from 0.25

    // 3. Emotional tone variability (IMPORTANT - inverse scoring)
    const emotionalScore =
      1 - Math.min(analysisMetrics.emotionalToneVariability, 1);
    score += emotionalScore * 0.15; // Reduced from 0.20

    // 4. Perplexity analysis (more balanced)
    let perplexityScore = 0;
    if (analysisMetrics.perplexity < 2) {
      perplexityScore = 1; // Very AI-like
    } else if (analysisMetrics.perplexity < 4) {
      perplexityScore = 0.8; // Likely AI
    } else if (analysisMetrics.perplexity < 7) {
      perplexityScore = 0.5; // Uncertain - could be formal human writing
    } else if (analysisMetrics.perplexity < 12) {
      perplexityScore = 0.2; // Likely human
    } else {
      perplexityScore = 0.05; // Very likely human
    }
    score += perplexityScore * 0.18; // Reduced from 0.20

    // 5. Burstiness analysis (increased weight)
    let burstinessScore = 0;
    if (analysisMetrics.burstiness < -0.5) {
      burstinessScore = 0.9; // Very consistent = AI-like
    } else if (analysisMetrics.burstiness < 0) {
      burstinessScore = 0.6; // Somewhat consistent = possibly AI
    } else if (analysisMetrics.burstiness < 0.3) {
      burstinessScore = 0.3; // Some variation = possibly human
    } else {
      burstinessScore = 0.1; // High variation = likely human
    }
    score += burstinessScore * 0.15; // Increased from 0.10

    // 6. Add some additional AI indicators with smaller weights
    // Transition density (AI overuses transitions)
    if (analysisMetrics.transitionDensity > 2) {
      score += Math.min(analysisMetrics.transitionDensity / 10, 0.1) * 0.05;
    }

    // Apply adaptive adjustments based on strong human indicators
    score = this.applyAdaptiveThresholding(score, analysisMetrics);

    // Ensure score is between 0 and 1
    return Math.max(0, Math.min(1, score));
  }

  private applyAdaptiveThresholding(
    baseScore: number,
    analysisMetrics: AnalysisMetrics
  ): number {
    let adjustedScore = baseScore;

    // Strong human indicators should significantly reduce AI probability
    if (analysisMetrics.humanLikenessIndicators > 0.6) {
      adjustedScore *= 0.2; // Very strong reduction for very human text
    } else if (analysisMetrics.humanLikenessIndicators > 0.4) {
      adjustedScore *= 0.4; // Strong reduction for clearly human text
    } else if (analysisMetrics.humanLikenessIndicators > 0.2) {
      adjustedScore *= 0.7; // Moderate reduction for somewhat human text
    }

    // High informality should reduce AI probability
    if (analysisMetrics.informalnessScore > 0.6) {
      adjustedScore *= 0.3; // Strong reduction for very informal text
    } else if (analysisMetrics.informalnessScore > 0.4) {
      adjustedScore *= 0.5; // Moderate reduction for informal text
    } else if (analysisMetrics.informalnessScore > 0.2) {
      adjustedScore *= 0.8; // Light reduction for somewhat informal text
    }

    // High emotional variability should reduce AI probability
    if (analysisMetrics.emotionalToneVariability > 0.5) {
      adjustedScore *= 0.4; // Strong reduction for very emotional text
    } else if (analysisMetrics.emotionalToneVariability > 0.3) {
      adjustedScore *= 0.6; // Moderate reduction for emotional text
    }

    // Multiple strong human indicators compound the effect
    const strongHumanIndicators = [
      analysisMetrics.humanLikenessIndicators > 0.3,
      analysisMetrics.informalnessScore > 0.3,
      analysisMetrics.emotionalToneVariability > 0.2,
      analysisMetrics.entropyScore > 0.8,
    ].filter(Boolean).length;

    if (strongHumanIndicators >= 3) {
      adjustedScore *= 0.1; // Very strong reduction for clearly human text
    } else if (strongHumanIndicators >= 2) {
      adjustedScore *= 0.3; // Strong reduction for likely human text
    }

    return Math.max(0, Math.min(1, adjustedScore));
  }

  private generateDetailedReasons(
    analysisMetrics: AnalysisMetrics,
    score: number
  ): string[] {
    const reasons: string[] = [];

    if (analysisMetrics.perplexity < 8) {
      reasons.push(
        `Low perplexity (${analysisMetrics.perplexity.toFixed(
          2
        )}) suggests predictable word patterns typical of AI`
      );
    }

    if (analysisMetrics.burstiness < 0.1) {
      reasons.push(
        `Low burstiness (${analysisMetrics.burstiness.toFixed(
          2
        )}) indicates consistent sentence structure characteristic of AI`
      );
    }

    if (analysisMetrics.humanLikenessIndicators < 0.3) {
      reasons.push(
        `Low human-likeness indicators (${analysisMetrics.humanLikenessIndicators.toFixed(
          2
        )}) suggest absence of typical human writing patterns`
      );
    }

    if (analysisMetrics.entropyScore < 0.7) {
      reasons.push(
        `Low entropy score (${analysisMetrics.entropyScore.toFixed(
          2
        )}) indicates predictable word choice patterns typical of AI`
      );
    }

    if (analysisMetrics.informalnessScore < 0.2) {
      reasons.push(
        `Low informality score (${analysisMetrics.informalnessScore.toFixed(
          2
        )}) suggests formal, AI-like writing style`
      );
    }

    if (
      analysisMetrics.lexicalDiversity > 0.4 &&
      analysisMetrics.lexicalDiversity < 0.7
    ) {
      reasons.push(
        `Lexical diversity (${analysisMetrics.lexicalDiversity.toFixed(
          2
        )}) falls within AI-typical range`
      );
    }

    if (analysisMetrics.transitionDensity > 2) {
      reasons.push(
        `High transition word density (${analysisMetrics.transitionDensity.toFixed(
          1
        )}%) characteristic of AI writing`
      );
    }

    if (analysisMetrics.discourseMarkerPatterns > 0.3) {
      reasons.push(
        `Elevated discourse marker usage (${analysisMetrics.discourseMarkerPatterns.toFixed(
          2
        )}) typical of AI text structure`
      );
    }

    if (analysisMetrics.formalityIndex > 0.5) {
      reasons.push(
        `Elevated formality index (${analysisMetrics.formalityIndex.toFixed(
          2
        )}) suggests AI-generated content`
      );
    }

    if (analysisMetrics.semanticCoherence > 0.6) {
      reasons.push(
        `High semantic coherence (${analysisMetrics.semanticCoherence.toFixed(
          2
        )}) typical of AI optimization`
      );
    }

    if (analysisMetrics.functionWordAnalysis > 0.5) {
      reasons.push(
        `Function word distribution (${analysisMetrics.functionWordAnalysis.toFixed(
          2
        )}) deviates from natural human patterns`
      );
    }

    if (analysisMetrics.emotionalToneVariability < 0.2) {
      reasons.push(
        `Low emotional tone variability (${analysisMetrics.emotionalToneVariability.toFixed(
          2
        )}) suggests limited emotional expression typical of AI`
      );
    }

    if (analysisMetrics.stylometricSignature < 0.6) {
      reasons.push(
        `Low stylometric variation (${analysisMetrics.stylometricSignature.toFixed(
          2
        )}) indicates consistent AI writing patterns`
      );
    }

    if (analysisMetrics.sentenceStructureEntropy < 0.8) {
      reasons.push(
        `Low sentence structure entropy (${analysisMetrics.sentenceStructureEntropy.toFixed(
          2
        )}) suggests uniform AI sentence construction`
      );
    }

    if (analysisMetrics.nGramRepetition > 0.1) {
      reasons.push(
        `Repetitive n-gram patterns (${(
          analysisMetrics.nGramRepetition * 100
        ).toFixed(1)}%) detected`
      );
    }

    if (analysisMetrics.bigramUnusualness > 0.2) {
      reasons.push(
        `Unusual bigram patterns (${(
          analysisMetrics.bigramUnusualness * 100
        ).toFixed(1)}%) may indicate AI generation`
      );
    }

    // Positive indicators for human text
    if (score <= 0.4) {
      reasons.push("Natural linguistic variation suggests human authorship");
      reasons.push("Irregular patterns inconsistent with AI generation");

      if (analysisMetrics.humanLikenessIndicators > 0.5) {
        reasons.push("Strong human-like writing patterns detected");
      }

      if (analysisMetrics.informalnessScore > 0.4) {
        reasons.push("Informal language patterns suggest human authorship");
      }

      if (analysisMetrics.emotionalToneVariability > 0.3) {
        reasons.push("Varied emotional expression typical of human writing");
      }
    }

    if (analysisMetrics.entropyScore > 0.8) {
      reasons.push(
        "High entropy indicates natural human unpredictability in word choice"
      );
    }

    if (analysisMetrics.vocabularyRichness < 0.3) {
      reasons.push("Limited vocabulary richness may indicate AI limitations");
    }

    return reasons;
  }
}
