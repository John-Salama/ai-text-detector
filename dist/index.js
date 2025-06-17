'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

class AITextDetector {
    constructor() {
        // Common words for frequency analysis
        this.commonWords = new Set([
            "the",
            "be",
            "to",
            "of",
            "and",
            "a",
            "in",
            "that",
            "have",
            "i",
            "it",
            "for",
            "not",
            "on",
            "with",
            "he",
            "as",
            "you",
            "do",
            "at",
            "this",
            "but",
            "his",
            "by",
            "from",
            "they",
            "she",
            "or",
            "an",
            "will",
            "my",
            "one",
            "all",
            "would",
            "there",
            "their",
        ]);
        // AI-typical phrases and patterns
        this.aiPatterns = [
            /\b(it is important to note|it should be noted|it is worth mentioning|it is crucial to understand)\b/gi,
            /\b(furthermore|moreover|additionally|consequently|therefore|thus|hence|nonetheless|nevertheless)\b/gi,
            /\b(in conclusion|to summarize|in summary|overall|ultimately|essentially)\b/gi,
            /\b(various|numerous|several|multiple|different|diverse|wide range of)\b/gi,
            /\b(enhance|optimize|facilitate|utilize|implement|establish|maintain|ensure)\b/gi,
            /\b(significant|substantial|considerable|notable|remarkable|extensive)\b/gi,
            /\b(comprehensive|thorough|detailed|in-depth|multifaceted)\b/gi,
            /\b(approach|strategy|methodology|framework|process|procedure)\b/gi,
        ];
        // Transition words for density analysis
        this.transitionWords = [
            "however",
            "furthermore",
            "moreover",
            "additionally",
            "consequently",
            "therefore",
            "thus",
            "hence",
            "nevertheless",
            "nonetheless",
            "meanwhile",
            "subsequently",
            "ultimately",
            "essentially",
            "specifically",
            "particularly",
            "notably",
            "importantly",
            "significantly",
            "interestingly",
            "surprisingly",
            "accordingly",
            "alternatively",
            "comparatively",
            "conversely",
            "similarly",
            "likewise",
            "meanwhile",
            "simultaneously",
        ];
        // Sophisticated vocabulary often used by AI
        this.sophisticatedWords = [
            "utilize",
            "facilitate",
            "demonstrate",
            "implement",
            "establish",
            "maintain",
            "require",
            "appropriate",
            "significant",
            "considerable",
            "substantial",
            "comprehensive",
            "extensive",
            "innovative",
            "strategic",
            "optimize",
            "enhance",
            "leverage",
            "paradigm",
            "methodology",
            "framework",
            "initiative",
            "synergy",
        ];
    }
    detectAIText(text) {
        if (!text || text.trim().length === 0) {
            throw new Error("Text cannot be empty");
        }
        if (text.trim().length < 50) {
            throw new Error("Text too short for reliable analysis (minimum 50 characters)");
        }
        const metrics = this.analyzeText(text);
        const score = this.calculateAdvancedAIScore(metrics);
        const isAIGenerated = score > 0.65; // Adjusted threshold
        const confidence = Math.round(score * 100) / 100;
        const reasons = this.generateDetailedReasons(metrics, score);
        return {
            isAIGenerated,
            confidence,
            reasons,
            score,
            perplexityScore: metrics.perplexity,
            burstinessScore: metrics.burstiness,
        };
    }
    analyzeText(text) {
        const sentences = this.splitIntoSentences(text);
        const words = this.tokenizeWords(text);
        const cleanWords = words.filter((word) => word.length > 2);
        return {
            perplexity: this.calculatePerplexity(words),
            burstiness: this.calculateBurstiness(sentences),
            averageWordsPerSentence: this.calculateAverageWordsPerSentence(sentences),
            sentenceVariability: this.calculateSentenceVariability(sentences),
            lexicalDiversity: this.calculateLexicalDiversity(cleanWords),
            readabilityScore: this.calculateReadabilityScore(text, sentences, words),
            syntacticComplexity: this.calculateSyntacticComplexity(sentences),
            semanticCoherence: this.calculateSemanticCoherence(sentences),
            nGramRepetition: this.calculateNGramRepetition(words),
            punctuationPatterns: this.analyzePunctuationPatterns(text),
            wordFrequencyDistribution: this.analyzeWordFrequencyDistribution(cleanWords),
            transitionDensity: this.calculateTransitionDensity(cleanWords),
            formalityIndex: this.calculateFormalityIndex(cleanWords),
            vocabularyRichness: this.calculateVocabularyRichness(cleanWords),
            contextualConsistency: this.calculateContextualConsistency(sentences),
        };
    }
    tokenizeWords(text) {
        return text
            .toLowerCase()
            .replace(/[^\w\s'-]/g, " ")
            .split(/\s+/)
            .filter((word) => word.length > 0);
    }
    splitIntoSentences(text) {
        return text
            .split(/[.!?]+/)
            .map((s) => s.trim())
            .filter((s) => s.length > 0);
    }
    // Advanced perplexity calculation (simplified statistical model)
    calculatePerplexity(words) {
        const wordCounts = new Map();
        const bigramCounts = new Map();
        // Count unigrams
        words.forEach((word) => {
            wordCounts.set(word, (wordCounts.get(word) || 0) + 1);
        });
        // Count bigrams
        for (let i = 0; i < words.length - 1; i++) {
            const bigram = `${words[i]} ${words[i + 1]}`;
            bigramCounts.set(bigram, (bigramCounts.get(bigram) || 0) + 1);
        }
        // Calculate simplified perplexity based on word predictability
        let totalSurprise = 0;
        for (let i = 1; i < words.length; i++) {
            const currentWord = words[i];
            const prevWord = words[i - 1];
            const bigram = `${prevWord} ${currentWord}`;
            wordCounts.get(currentWord) || 1;
            const bigramFreq = bigramCounts.get(bigram) || 1;
            const prevWordFreq = wordCounts.get(prevWord) || 1;
            // Higher frequency = lower surprise = lower perplexity
            const conditionalProb = bigramFreq / prevWordFreq;
            const surprise = -Math.log2(Math.max(conditionalProb, 0.001));
            totalSurprise += surprise;
        }
        return totalSurprise / Math.max(words.length - 1, 1);
    }
    // Burstiness measures variation in sentence lengths
    calculateBurstiness(sentences) {
        if (sentences.length < 2)
            return 0;
        const lengths = sentences.map((s) => s.split(/\s+/).length);
        const mean = lengths.reduce((a, b) => a + b, 0) / lengths.length;
        const variance = lengths.reduce((sum, len) => sum + Math.pow(len - mean, 2), 0) /
            lengths.length;
        const stdDev = Math.sqrt(variance);
        // Burstiness formula: (σ - μ) / (σ + μ)
        return (stdDev - mean) / (stdDev + mean);
    }
    calculateLexicalDiversity(words) {
        const uniqueWords = new Set(words);
        return uniqueWords.size / words.length;
    }
    calculateReadabilityScore(text, sentences, words) {
        const avgWordsPerSentence = words.length / sentences.length;
        const complexWords = words.filter((word) => word.length > 6).length;
        const complexWordRatio = complexWords / words.length;
        // Simplified Flesch-Kincaid-like formula
        return 206.835 - 1.015 * avgWordsPerSentence - 84.6 * complexWordRatio;
    }
    calculateSyntacticComplexity(sentences) {
        let totalComplexity = 0;
        sentences.forEach((sentence) => {
            const words = sentence.split(/\s+/);
            let complexity = 0;
            // Count subordinate clauses (simplified)
            complexity += (sentence.match(/\b(that|which|who|whom|whose|when|where|while|although|because|since|if|unless|until)\b/gi) || []).length;
            // Count conjunctions
            complexity += (sentence.match(/\b(and|but|or|yet|so|for|nor)\b/gi) || [])
                .length;
            // Penalize very long sentences
            if (words.length > 30)
                complexity += 2;
            if (words.length > 40)
                complexity += 3;
            totalComplexity += complexity / Math.max(words.length, 1);
        });
        return totalComplexity / sentences.length;
    }
    calculateSemanticCoherence(sentences) {
        if (sentences.length < 2)
            return 1;
        let coherenceScore = 0;
        for (let i = 1; i < sentences.length; i++) {
            const prevWords = new Set(this.tokenizeWords(sentences[i - 1]));
            const currWords = new Set(this.tokenizeWords(sentences[i]));
            // Calculate word overlap between consecutive sentences
            const intersection = new Set([...prevWords].filter((x) => currWords.has(x)));
            const union = new Set([...prevWords, ...currWords]);
            coherenceScore += intersection.size / union.size;
        }
        return coherenceScore / (sentences.length - 1);
    }
    calculateNGramRepetition(words) {
        const trigrams = new Map();
        for (let i = 0; i < words.length - 2; i++) {
            const trigram = `${words[i]} ${words[i + 1]} ${words[i + 2]}`;
            trigrams.set(trigram, (trigrams.get(trigram) || 0) + 1);
        }
        const repeatedTrigrams = Array.from(trigrams.values()).filter((count) => count > 1);
        return repeatedTrigrams.length / Math.max(trigrams.size, 1);
    }
    analyzePunctuationPatterns(text) {
        const punctuation = text.match(/[.!?;:,]/g) || [];
        const words = this.tokenizeWords(text);
        if (words.length === 0)
            return 0;
        // AI often has consistent punctuation patterns
        const punctuationRatio = punctuation.length / words.length;
        const commaRatio = (text.match(/,/g) || []).length / words.length;
        const semicolonRatio = (text.match(/;/g) || []).length / words.length;
        // AI tends to use moderate punctuation
        let score = 0;
        if (punctuationRatio > 0.05 && punctuationRatio < 0.15)
            score += 0.3;
        if (commaRatio > 0.02 && commaRatio < 0.08)
            score += 0.3;
        if (semicolonRatio > 0.001 && semicolonRatio < 0.01)
            score += 0.2;
        return score;
    }
    analyzeWordFrequencyDistribution(words) {
        const wordCounts = new Map();
        words.forEach((word) => {
            wordCounts.set(word, (wordCounts.get(word) || 0) + 1);
        });
        const frequencies = Array.from(wordCounts.values()).sort((a, b) => b - a);
        // Zipf's law analysis - natural text follows specific distribution
        let zipfScore = 0;
        for (let i = 1; i < Math.min(frequencies.length, 10); i++) {
            const expected = frequencies[0] / (i + 1);
            const actual = frequencies[i];
            const ratio = Math.min(actual, expected) / Math.max(actual, expected);
            zipfScore += ratio;
        }
        return zipfScore / Math.min(frequencies.length - 1, 9);
    }
    calculateTransitionDensity(words) {
        const transitionCount = words.filter((word) => this.transitionWords.some((tw) => word.includes(tw))).length;
        return (transitionCount / words.length) * 100;
    }
    calculateFormalityIndex(words) {
        const sophisticatedCount = words.filter((word) => this.sophisticatedWords.includes(word)).length;
        const commonWordCount = words.filter((word) => this.commonWords.has(word)).length;
        return (sophisticatedCount /
            words.length /
            Math.max(commonWordCount / words.length, 0.1));
    }
    calculateVocabularyRichness(words) {
        const uniqueWords = new Set(words);
        const hapaxLegomena = Array.from(uniqueWords).filter((word) => words.filter((w) => w === word).length === 1);
        return hapaxLegomena.length / uniqueWords.size;
    }
    calculateContextualConsistency(sentences) {
        if (sentences.length < 3)
            return 1;
        let consistencyScore = 0;
        const topics = sentences.map((sentence) => this.extractTopicWords(sentence));
        for (let i = 1; i < topics.length - 1; i++) {
            const prevTopics = new Set(topics[i - 1]);
            const currTopics = new Set(topics[i]);
            const nextTopics = new Set(topics[i + 1]);
            const allTopics = new Set([...prevTopics, ...currTopics, ...nextTopics]);
            const commonTopics = [...allTopics].filter((topic) => [prevTopics, currTopics, nextTopics].filter((set) => set.has(topic))
                .length >= 2);
            consistencyScore += commonTopics.length / Math.max(allTopics.size, 1);
        }
        return consistencyScore / Math.max(sentences.length - 2, 1);
    }
    extractTopicWords(sentence) {
        const words = this.tokenizeWords(sentence);
        return words.filter((word) => word.length > 4 &&
            !this.commonWords.has(word) &&
            !this.transitionWords.includes(word));
    }
    calculateAverageWordsPerSentence(sentences) {
        if (sentences.length === 0)
            return 0;
        const totalWords = sentences.reduce((sum, sentence) => sum + sentence.split(/\s+/).length, 0);
        return totalWords / sentences.length;
    }
    calculateSentenceVariability(sentences) {
        if (sentences.length < 2)
            return 0;
        const lengths = sentences.map((s) => s.split(/\s+/).length);
        const average = lengths.reduce((a, b) => a + b, 0) / lengths.length;
        const variance = lengths.reduce((sum, len) => sum + Math.pow(len - average, 2), 0) /
            lengths.length;
        return Math.sqrt(variance);
    }
    calculateAdvancedAIScore(metrics) {
        let score = 0;
        let totalWeight = 0;
        // Perplexity analysis (most important)
        const perplexityWeight = 0.25;
        if (metrics.perplexity < 8) {
            // AI text typically has lower perplexity
            score += ((8 - metrics.perplexity) / 8) * perplexityWeight;
        }
        totalWeight += perplexityWeight;
        // Burstiness analysis
        const burstinessWeight = 0.2;
        if (metrics.burstiness < 0.1) {
            // AI has low burstiness (consistent sentence lengths)
            score += ((0.1 - metrics.burstiness) / 0.1) * burstinessWeight;
        }
        totalWeight += burstinessWeight;
        // Lexical diversity
        const lexicalWeight = 0.15;
        if (metrics.lexicalDiversity > 0.4 && metrics.lexicalDiversity < 0.7) {
            // AI sweet spot
            score += lexicalWeight;
        }
        totalWeight += lexicalWeight;
        // Semantic coherence
        const coherenceWeight = 0.12;
        if (metrics.semanticCoherence > 0.3 && metrics.semanticCoherence < 0.8) {
            // AI maintains good coherence
            score += coherenceWeight;
        }
        totalWeight += coherenceWeight;
        // Transition density
        const transitionWeight = 0.1;
        if (metrics.transitionDensity > 2) {
            // High transition word usage
            score += Math.min(metrics.transitionDensity / 5, 1) * transitionWeight;
        }
        totalWeight += transitionWeight;
        // Formality index
        const formalityWeight = 0.08;
        if (metrics.formalityIndex > 0.5) {
            // AI tends to be more formal
            score += Math.min(metrics.formalityIndex, 1) * formalityWeight;
        }
        totalWeight += formalityWeight;
        // N-gram repetition
        const ngramWeight = 0.05;
        if (metrics.nGramRepetition > 0.1) {
            // AI sometimes repeats patterns
            score += Math.min(metrics.nGramRepetition * 2, 1) * ngramWeight;
        }
        totalWeight += ngramWeight;
        // Punctuation patterns
        const punctuationWeight = 0.05;
        score += metrics.punctuationPatterns * punctuationWeight;
        totalWeight += punctuationWeight;
        // Normalize score
        return Math.max(0, Math.min(1, score / totalWeight));
    }
    generateDetailedReasons(metrics, score) {
        const reasons = [];
        if (metrics.perplexity < 8) {
            reasons.push(`Low perplexity (${metrics.perplexity.toFixed(2)}) suggests predictable word patterns typical of AI`);
        }
        if (metrics.burstiness < 0.1) {
            reasons.push(`Low burstiness (${metrics.burstiness.toFixed(2)}) indicates consistent sentence structure characteristic of AI`);
        }
        if (metrics.lexicalDiversity > 0.4 && metrics.lexicalDiversity < 0.7) {
            reasons.push(`Lexical diversity (${metrics.lexicalDiversity.toFixed(2)}) falls within AI-typical range`);
        }
        if (metrics.transitionDensity > 2) {
            reasons.push(`High transition word density (${metrics.transitionDensity.toFixed(1)}%) characteristic of AI writing`);
        }
        if (metrics.formalityIndex > 0.5) {
            reasons.push(`Elevated formality index (${metrics.formalityIndex.toFixed(2)}) suggests AI-generated content`);
        }
        if (metrics.semanticCoherence > 0.6) {
            reasons.push(`High semantic coherence (${metrics.semanticCoherence.toFixed(2)}) typical of AI optimization`);
        }
        if (metrics.nGramRepetition > 0.1) {
            reasons.push(`Repetitive n-gram patterns (${(metrics.nGramRepetition * 100).toFixed(1)}%) detected`);
        }
        if (score <= 0.4) {
            reasons.push("Natural linguistic variation suggests human authorship");
            reasons.push("Irregular patterns inconsistent with AI generation");
        }
        if (metrics.vocabularyRichness < 0.3) {
            reasons.push("Limited vocabulary richness may indicate AI limitations");
        }
        return reasons;
    }
}
// Export for different environments
const detector = new AITextDetector();
function detectAIText(text) {
    return detector.detectAIText(text);
}
function isAIGenerated(text) {
    return detector.detectAIText(text).isAIGenerated;
}
function getConfidenceScore(text) {
    return detector.detectAIText(text).confidence;
}
function getPerplexityScore(text) {
    return detector.detectAIText(text).perplexityScore;
}
function getBurstinessScore(text) {
    return detector.detectAIText(text).burstinessScore;
}
var index = {
    detectAIText,
    isAIGenerated,
    getConfidenceScore,
    getPerplexityScore,
    getBurstinessScore,
};

exports.default = index;
exports.detectAIText = detectAIText;
exports.getBurstinessScore = getBurstinessScore;
exports.getConfidenceScore = getConfidenceScore;
exports.getPerplexityScore = getPerplexityScore;
exports.isAIGenerated = isAIGenerated;
//# sourceMappingURL=index.js.map
