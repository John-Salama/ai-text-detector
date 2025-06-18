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
        // AI-typical phrases and patterns (expanded)
        this.aiPatterns = [
            /\b(it is important to note|it should be noted|it is worth mentioning|it is crucial to understand)\b/gi,
            /\b(furthermore|moreover|additionally|consequently|therefore|thus|hence|nonetheless|nevertheless)\b/gi,
            /\b(in conclusion|to summarize|in summary|overall|ultimately|essentially)\b/gi,
            /\b(various|numerous|several|multiple|different|diverse|wide range of)\b/gi,
            /\b(enhance|optimize|facilitate|utilize|implement|establish|maintain|ensure)\b/gi,
            /\b(significant|substantial|considerable|notable|remarkable|extensive)\b/gi,
            /\b(comprehensive|thorough|detailed|in-depth|multifaceted)\b/gi,
            /\b(approach|strategy|methodology|framework|process|procedure)\b/gi,
            // New AI patterns based on recent models
            /\b(it's worth noting|it's important to understand|it's crucial to consider)\b/gi,
            /\b(as we delve into|let's explore|let's examine|it's clear that)\b/gi,
            /\b(in today's|in our modern|in the current|in this digital age)\b/gi,
            /\b(revolutionize|transform|streamline|cutting-edge|state-of-the-art)\b/gi,
            /\b(stakeholders|end-users|best practices|value proposition|synergistic)\b/gi,
            /\b(leverage the power of|harness the potential|unlock the benefits)\b/gi,
        ];
        // Human-like patterns and indicators
        this.humanPatterns = [
            /\b(lol|lmao|omg|wtf|btw|tbh|imho|imo)\b/gi,
            /\b(gonna|wanna|gotta|kinda|sorta|dunno)\b/gi,
            /\b(yeah|yep|nah|nope|meh|ugh|hmm)\b/gi,
            /\b(super|really|pretty|kinda|totally|absolutely)\b/gi,
            /\b(awesome|amazing|terrible|awful|weird|crazy)\b/gi,
        ];
        // Emotional expressions
        this.emotionalMarkers = [
            /\b(love|hate|excited|frustrated|angry|happy|sad|worried|anxious)\b/gi,
            /\b(feel|felt|feeling|emotions|emotional|mood)\b/gi,
            /(!{2,}|\?{2,}|\.{3,})/g, // Multiple punctuation marks
            /[A-Z]{2,}/g, // CAPS for emphasis
        ];
        // Discourse markers for sophisticated analysis
        this.discourseMarkers = [
            "first",
            "second",
            "third",
            "finally",
            "lastly",
            "initially",
            "subsequently",
            "meanwhile",
            "simultaneously",
            "on the other hand",
            "in contrast",
            "however",
            "nevertheless",
            "for instance",
            "for example",
            "such as",
            "namely",
            "in fact",
            "indeed",
            "actually",
            "certainly",
            "admittedly",
            "granted",
            "of course",
            "naturally",
        ];
        // Function words for stylometric analysis
        this.functionWords = [
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
            "what",
            "so",
            "up",
            "out",
            "if",
            "about",
            "who",
            "get",
            "which",
            "go",
            "me",
            "when",
            "make",
            "can",
            "like",
            "time",
            "no",
            "just",
            "him",
            "know",
            "take",
            "people",
            "into",
            "year",
            "your",
            "good",
            "some",
            "could",
            "them",
            "see",
            "other",
            "than",
            "then",
            "now",
            "look",
            "only",
            "come",
            "its",
            "over",
            "think",
            "also",
            "back",
            "after",
            "use",
            "two",
            "how",
            "our",
            "work",
            "first",
            "well",
            "way",
            "even",
            "new",
            "want",
            "because",
            "any",
            "these",
            "give",
            "day",
            "most",
            "us",
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
        // Dynamic threshold based on text characteristics
        let threshold = 0.6; // Base threshold, lowered from 0.65
        // Adjust threshold based on text length
        const wordCount = this.tokenizeWords(text).length;
        if (wordCount < 100) {
            threshold += 0.05; // More conservative for shorter texts
        }
        else if (wordCount > 300) {
            threshold -= 0.05; // More sensitive for longer texts
        }
        // Adjust based on detected human patterns
        if (metrics.humanLikenessIndicators > 0.4) {
            threshold += 0.1;
        }
        if (metrics.informalnessScore > 0.3) {
            threshold += 0.08;
        }
        const isAIGenerated = score > threshold;
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
            // Enhanced metrics
            entropyScore: this.calculateEntropyScore(words),
            humanLikenessIndicators: this.calculateHumanLikenessIndicators(text),
            emotionalToneVariability: this.calculateEmotionalToneVariability(text),
            discourseMarkerPatterns: this.calculateDiscourseMarkerPatterns(cleanWords),
            functionWordAnalysis: this.calculateFunctionWordAnalysis(cleanWords),
            informalnessScore: this.calculateInformalnessScore(text),
            sentenceStructureEntropy: this.calculateSentenceStructureEntropy(sentences),
            topicCoherenceScore: this.calculateTopicCoherenceScore(sentences),
            bigramUnusualness: this.calculateBigramUnusualness(words),
            stylometricSignature: this.calculateStylometricSignature(text, sentences, words),
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
    // Enhanced perplexity calculation with improved statistical modeling
    calculatePerplexity(words) {
        if (words.length < 3)
            return 10; // Default high perplexity for very short texts
        const wordCounts = new Map();
        const bigramCounts = new Map();
        const trigramCounts = new Map();
        // Count unigrams
        words.forEach((word) => {
            wordCounts.set(word, (wordCounts.get(word) || 0) + 1);
        });
        // Count bigrams
        for (let i = 0; i < words.length - 1; i++) {
            const bigram = `${words[i]} ${words[i + 1]}`;
            bigramCounts.set(bigram, (bigramCounts.get(bigram) || 0) + 1);
        }
        // Count trigrams
        for (let i = 0; i < words.length - 2; i++) {
            const trigram = `${words[i]} ${words[i + 1]} ${words[i + 2]}`;
            trigramCounts.set(trigram, (trigramCounts.get(trigram) || 0) + 1);
        }
        let totalLogProb = 0;
        let totalPredictions = 0;
        // Calculate log probability using interpolated n-gram model
        for (let i = 2; i < words.length; i++) {
            const currentWord = words[i];
            const prevWord = words[i - 1];
            const prevPrevWord = words[i - 2];
            const trigram = `${prevPrevWord} ${prevWord} ${currentWord}`;
            const bigram = `${prevWord} ${currentWord}`;
            const prevBigram = `${prevPrevWord} ${prevWord}`;
            const trigramFreq = trigramCounts.get(trigram) || 0;
            const bigramFreq = bigramCounts.get(bigram) || 0;
            const prevBigramFreq = bigramCounts.get(prevBigram) || 0;
            const wordFreq = wordCounts.get(currentWord) || 0;
            // Interpolated probability with smoothing
            let probability = 0;
            // Trigram probability
            if (prevBigramFreq > 0) {
                probability +=
                    (0.6 * (trigramFreq + 0.1)) /
                        (prevBigramFreq + 0.1 * trigramCounts.size);
            }
            // Bigram probability
            const prevWordFreq = wordCounts.get(prevWord) || 0;
            if (prevWordFreq > 0) {
                probability +=
                    (0.3 * (bigramFreq + 0.1)) / (prevWordFreq + 0.1 * bigramCounts.size);
            }
            // Unigram probability
            probability +=
                (0.1 * (wordFreq + 0.1)) / (words.length + 0.1 * wordCounts.size);
            // Ensure minimum probability
            probability = Math.max(probability, 0.0001);
            totalLogProb += Math.log2(probability);
            totalPredictions++;
        }
        // Calculate perplexity
        const averageLogProb = totalLogProb / Math.max(totalPredictions, 1);
        return Math.pow(2, -averageLogProb);
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
    // Enhanced calculation methods for improved detection
    calculateEntropyScore(words) {
        const wordCounts = new Map();
        words.forEach((word) => {
            wordCounts.set(word, (wordCounts.get(word) || 0) + 1);
        });
        const totalWords = words.length;
        let entropy = 0;
        for (const count of wordCounts.values()) {
            const probability = count / totalWords;
            entropy -= probability * Math.log2(probability);
        }
        // Normalize entropy (higher entropy = more human-like)
        return entropy / Math.log2(Math.min(wordCounts.size, totalWords));
    }
    calculateHumanLikenessIndicators(text) {
        let score = 0;
        let totalIndicators = 0;
        // Check for informal language (enhanced patterns)
        const informalMatches = this.humanPatterns.reduce((count, pattern) => {
            return count + (text.match(pattern) || []).length;
        }, 0);
        score += Math.min(informalMatches / 5, 1); // Increased sensitivity
        totalIndicators++;
        // Check for contractions
        const contractions = (text.match(/\b\w+[''](?:t|re|ve|ll|d|s|m)\b/gi) || [])
            .length;
        score += Math.min(contractions / 8, 1);
        totalIndicators++;
        // Check for typos and misspellings (enhanced)
        const potentialTypos = text.match(/\b[a-z]*[aeiou]{3,}[a-z]*\b/gi) || [];
        const doubleLetters = text.match(/\b\w*([a-z])\1{2,}\w*\b/gi) || [];
        const inconsistentSpacing = text.match(/\s{2,}/g) || [];
        score += Math.min((potentialTypos.length +
            doubleLetters.length +
            inconsistentSpacing.length) /
            10, 0.8);
        totalIndicators++;
        // Check for inconsistent capitalization (enhanced)
        const sentences = this.splitIntoSentences(text);
        let inconsistentCaps = 0;
        sentences.forEach((sentence) => {
            const words = sentence.split(/\s+/);
            for (let i = 1; i < words.length; i++) {
                if (words[i].match(/^[A-Z][a-z]/)) {
                    inconsistentCaps++;
                }
            }
        });
        score += Math.min(inconsistentCaps / Math.max(sentences.length * 0.5, 1), 0.5);
        totalIndicators++;
        // Check for personal pronouns and narrative style (enhanced)
        const personalPronouns = (text.match(/\b(I|me|my|mine|myself|we|us|our|ours)\b/gi) || []).length;
        const words = this.tokenizeWords(text);
        score += Math.min(personalPronouns / Math.max(words.length * 0.1, 1), 1);
        totalIndicators++;
        // Check for emotional punctuation
        const emotionalPunct = (text.match(/[!]{2,}|[?]{2,}|[.]{3,}/g) || [])
            .length;
        score += Math.min(emotionalPunct / 5, 0.8);
        totalIndicators++;
        // Check for ALL CAPS words (emphasis)
        const capsWords = (text.match(/\b[A-Z]{2,}\b/g) || []).length;
        score += Math.min(capsWords / 10, 0.6);
        totalIndicators++; // Check for internet slang and abbreviations
        const internetSlang = (text.match(/\b(lol|lmao|omg|wtf|btw|tbh|imho|imo|ngl|smh|fml|irl|rn|af|fr|periodt)\b/gi) || []).length;
        score += Math.min(internetSlang / 3, 1);
        totalIndicators++;
        return score / totalIndicators;
    }
    calculateEmotionalToneVariability(text) {
        let emotionalMarkers = 0;
        this.emotionalMarkers.forEach((pattern) => {
            emotionalMarkers += (text.match(pattern) || []).length;
        });
        // Additional emotional indicators
        const exclamations = (text.match(/!/g) || []).length;
        const questions = (text.match(/\?/g) || []).length;
        const emotionalWords = (text.match(/\b(love|hate|excited|frustrated|angry|happy|sad|worried|anxious|amazing|terrible|awesome|awful|horrible|wonderful|fantastic|disgusting|annoying|brilliant|stupid|crazy|insane|wild|mad|furious|thrilled|devastated|shocked|surprised|confused|overwhelmed)\b/gi) || []).length;
        const words = this.tokenizeWords(text);
        const totalEmotionalSignals = emotionalMarkers + exclamations + questions + emotionalWords;
        return Math.min(totalEmotionalSignals / Math.max(words.length * 0.1, 1), 1);
    }
    calculateDiscourseMarkerPatterns(words) {
        const discourseMarkerCount = words.filter((word) => this.discourseMarkers.some((marker) => marker.toLowerCase().includes(word.toLowerCase()))).length;
        // AI tends to overuse discourse markers
        const density = discourseMarkerCount / words.length;
        return Math.min(density * 50, 1);
    }
    calculateFunctionWordAnalysis(words) {
        const functionWordCount = words.filter((word) => this.functionWords.includes(word.toLowerCase())).length;
        const ratio = functionWordCount / words.length;
        // Natural human text typically has 40-60% function words
        // AI often deviates from this pattern
        if (ratio >= 0.4 && ratio <= 0.6) {
            return 0.2; // Lower score for human-like ratio
        }
        else {
            return Math.min(Math.abs(ratio - 0.5) * 2, 1);
        }
    }
    calculateInformalnessScore(text) {
        let informalityScore = 0;
        let totalFeatures = 0;
        // Contractions
        const contractions = (text.match(/\b\w+[''](?:t|re|ve|ll|d|s|m)\b/gi) || [])
            .length;
        informalityScore += Math.min(contractions / 20, 1);
        totalFeatures++;
        // Slang and colloquialisms
        const slangCount = this.humanPatterns.reduce((count, pattern) => {
            return count + (text.match(pattern) || []).length;
        }, 0);
        informalityScore += Math.min(slangCount / 10, 1);
        totalFeatures++;
        // Sentence fragments
        const sentences = this.splitIntoSentences(text);
        const fragments = sentences.filter((s) => s.split(/\s+/).length < 4).length;
        informalityScore += Math.min(fragments / sentences.length, 0.5);
        totalFeatures++;
        // Ellipses and multiple punctuation
        const multiplePunct = (text.match(/[.!?]{2,}/g) || []).length;
        informalityScore += Math.min(multiplePunct / 10, 0.5);
        totalFeatures++;
        return informalityScore / totalFeatures;
    }
    calculateSentenceStructureEntropy(sentences) {
        const structures = sentences.map((sentence) => {
            const words = sentence.split(/\s+/);
            const length = words.length;
            // Classify sentence structure
            if (length <= 5)
                return "short";
            if (length <= 15)
                return "medium";
            if (length <= 25)
                return "long";
            return "very_long";
        });
        const structureCounts = new Map();
        structures.forEach((structure) => {
            structureCounts.set(structure, (structureCounts.get(structure) || 0) + 1);
        });
        let entropy = 0;
        const totalSentences = sentences.length;
        for (const count of structureCounts.values()) {
            const probability = count / totalSentences;
            entropy -= probability * Math.log2(probability);
        }
        return entropy / Math.log2(Math.min(structureCounts.size, totalSentences));
    }
    calculateTopicCoherenceScore(sentences) {
        if (sentences.length < 2)
            return 1;
        const topicWords = sentences.map((sentence) => this.extractTopicWords(sentence));
        let coherenceSum = 0;
        let comparisons = 0;
        for (let i = 0; i < topicWords.length - 1; i++) {
            for (let j = i + 1; j < Math.min(i + 4, topicWords.length); j++) {
                const words1 = new Set(topicWords[i]);
                const words2 = new Set(topicWords[j]);
                const intersection = new Set([...words1].filter((x) => words2.has(x)));
                const union = new Set([...words1, ...words2]);
                const similarity = intersection.size / Math.max(union.size, 1);
                coherenceSum += similarity;
                comparisons++;
            }
        }
        return comparisons > 0 ? coherenceSum / comparisons : 0;
    }
    calculateBigramUnusualness(words) {
        const bigramCounts = new Map();
        const totalBigrams = words.length - 1;
        // Count bigrams
        for (let i = 0; i < words.length - 1; i++) {
            const bigram = `${words[i]} ${words[i + 1]}`;
            bigramCounts.set(bigram, (bigramCounts.get(bigram) || 0) + 1);
        }
        // Calculate unusualness based on expected frequency
        let unusualness = 0;
        bigramCounts.forEach((count, bigram) => {
            const [word1, word2] = bigram.split(" ");
            const word1Count = words.filter((w) => w === word1).length;
            const word2Count = words.filter((w) => w === word2).length;
            // Expected frequency based on individual word frequencies
            const expectedFreq = (word1Count * word2Count) / words.length;
            const actualFreq = count;
            if (actualFreq > expectedFreq * 2) {
                unusualness += actualFreq / totalBigrams;
            }
        });
        return Math.min(unusualness, 1);
    }
    calculateStylometricSignature(text, sentences, words) {
        let signature = 0;
        let components = 0;
        // Average sentence length variability
        const sentenceLengths = sentences.map((s) => s.split(/\s+/).length);
        const avgLength = sentenceLengths.reduce((a, b) => a + b, 0) / sentenceLengths.length;
        const lengthVariance = sentenceLengths.reduce((sum, len) => sum + Math.pow(len - avgLength, 2), 0) / sentenceLengths.length;
        signature += Math.min(Math.sqrt(lengthVariance) / avgLength, 1);
        components++;
        // Word length distribution
        const wordLengths = words.map((w) => w.length);
        const avgWordLength = wordLengths.reduce((a, b) => a + b, 0) / wordLengths.length;
        const wordLengthVariance = wordLengths.reduce((sum, len) => sum + Math.pow(len - avgWordLength, 2), 0) / wordLengths.length;
        signature += Math.min(Math.sqrt(wordLengthVariance) / avgWordLength, 1);
        components++;
        // Punctuation variety
        const punctuationTypes = new Set(text.match(/[.!?;:,\-()]/g) || []);
        signature += Math.min(punctuationTypes.size / 8, 1);
        components++;
        // Sentence beginning variety
        const sentenceBeginnings = sentences
            .map((s) => {
            const firstWord = s.trim().split(/\s+/)[0];
            return firstWord ? firstWord.toLowerCase() : "";
        })
            .filter((w) => w.length > 0);
        const uniqueBeginnings = new Set(sentenceBeginnings);
        signature += Math.min(uniqueBeginnings.size / sentenceBeginnings.length, 1);
        components++;
        return signature / components;
    }
    calculateAdvancedAIScore(metrics) {
        let score = 0;
        let totalWeight = 0;
        // Perplexity analysis (most important)
        const perplexityWeight = 0.18;
        if (metrics.perplexity < 8) {
            // AI text typically has lower perplexity
            score += ((8 - metrics.perplexity) / 8) * perplexityWeight;
        }
        totalWeight += perplexityWeight;
        // Burstiness analysis
        const burstinessWeight = 0.15;
        if (metrics.burstiness < 0.1) {
            // AI has low burstiness (consistent sentence lengths)
            score += ((0.1 - metrics.burstiness) / 0.1) * burstinessWeight;
        }
        totalWeight += burstinessWeight; // Human-likeness indicators (inverse scoring) - increased weight
        const humanLikenessWeight = 0.18;
        score += (1 - metrics.humanLikenessIndicators) * humanLikenessWeight;
        totalWeight += humanLikenessWeight;
        // Entropy analysis
        const entropyWeight = 0.1;
        if (metrics.entropyScore < 0.7) {
            // Lower entropy suggests AI (more predictable)
            score += ((0.7 - metrics.entropyScore) / 0.7) * entropyWeight;
        }
        totalWeight += entropyWeight;
        // Lexical diversity
        const lexicalWeight = 0.08;
        if (metrics.lexicalDiversity > 0.4 && metrics.lexicalDiversity < 0.7) {
            // AI sweet spot
            score += lexicalWeight;
        }
        totalWeight += lexicalWeight;
        // Semantic coherence
        const coherenceWeight = 0.08;
        if (metrics.semanticCoherence > 0.3 && metrics.semanticCoherence < 0.8) {
            // AI maintains good coherence
            score += coherenceWeight;
        }
        totalWeight += coherenceWeight; // Informality score (inverse) - increased weight
        const informalityWeight = 0.12;
        score += (1 - metrics.informalnessScore) * informalityWeight;
        totalWeight += informalityWeight;
        // Function word analysis
        const functionWordWeight = 0.06;
        score += metrics.functionWordAnalysis * functionWordWeight;
        totalWeight += functionWordWeight;
        // Transition density
        const transitionWeight = 0.06;
        if (metrics.transitionDensity > 2) {
            // High transition word usage
            score += Math.min(metrics.transitionDensity / 5, 1) * transitionWeight;
        }
        totalWeight += transitionWeight;
        // Discourse marker patterns
        const discourseWeight = 0.05;
        score += Math.min(metrics.discourseMarkerPatterns, 1) * discourseWeight;
        totalWeight += discourseWeight; // Emotional tone variability (inverse) - increased weight
        const emotionalWeight = 0.08;
        score +=
            (1 - Math.min(metrics.emotionalToneVariability, 1)) * emotionalWeight;
        totalWeight += emotionalWeight;
        // Stylometric signature
        const stylometricWeight = 0.04;
        if (metrics.stylometricSignature < 0.6) {
            // AI tends to have less stylometric variation
            score += ((0.6 - metrics.stylometricSignature) / 0.6) * stylometricWeight;
        }
        totalWeight += stylometricWeight;
        // Sentence structure entropy
        const structureEntropyWeight = 0.03;
        if (metrics.sentenceStructureEntropy < 0.8) {
            score +=
                ((0.8 - metrics.sentenceStructureEntropy) / 0.8) *
                    structureEntropyWeight;
        }
        totalWeight += structureEntropyWeight;
        // Topic coherence
        const topicCoherenceWeight = 0.03;
        if (metrics.topicCoherenceScore > 0.5) {
            score +=
                Math.min(metrics.topicCoherenceScore - 0.5, 0.5) *
                    2 *
                    topicCoherenceWeight;
        }
        totalWeight += topicCoherenceWeight;
        // Formality index
        const formalityWeight = 0.03;
        if (metrics.formalityIndex > 0.5) {
            // AI tends to be more formal
            score += Math.min(metrics.formalityIndex, 1) * formalityWeight;
        }
        totalWeight += formalityWeight;
        // N-gram repetition
        const ngramWeight = 0.03;
        if (metrics.nGramRepetition > 0.1) {
            // AI sometimes repeats patterns
            score += Math.min(metrics.nGramRepetition * 2, 1) * ngramWeight;
        }
        totalWeight += ngramWeight;
        // Bigram unusualness
        const bigramWeight = 0.02;
        score += metrics.bigramUnusualness * bigramWeight;
        totalWeight += bigramWeight;
        // Punctuation patterns
        const punctuationWeight = 0.02;
        score += metrics.punctuationPatterns * punctuationWeight;
        totalWeight += punctuationWeight;
        // Normalize score
        const normalizedScore = Math.max(0, Math.min(1, score / totalWeight));
        // Apply adaptive thresholding based on text characteristics
        return this.applyAdaptiveThresholding(normalizedScore, metrics);
    }
    applyAdaptiveThresholding(baseScore, metrics) {
        let adjustedScore = baseScore;
        // If text shows strong human indicators, reduce AI probability significantly
        if (metrics.humanLikenessIndicators > 0.4) {
            adjustedScore *= 0.7;
        }
        if (metrics.humanLikenessIndicators > 0.6) {
            adjustedScore *= 0.6;
        }
        // If text is very informal, reduce AI probability
        if (metrics.informalnessScore > 0.5) {
            adjustedScore *= 0.8;
        }
        if (metrics.informalnessScore > 0.7) {
            adjustedScore *= 0.6;
        }
        // If text has high emotional variability, reduce AI probability
        if (metrics.emotionalToneVariability > 0.3) {
            adjustedScore *= 0.85;
        }
        if (metrics.emotionalToneVariability > 0.5) {
            adjustedScore *= 0.7;
        }
        // If entropy is very high (human-like unpredictability), reduce AI probability
        if (metrics.entropyScore > 0.8) {
            adjustedScore *= 0.8;
        }
        // If multiple human indicators are present, compound the effect
        const humanIndicatorCount = [
            metrics.humanLikenessIndicators > 0.4,
            metrics.informalnessScore > 0.4,
            metrics.emotionalToneVariability > 0.3,
        ].filter(Boolean).length;
        if (humanIndicatorCount >= 2) {
            adjustedScore *= 0.75;
        }
        return Math.max(0, Math.min(1, adjustedScore));
    }
    generateDetailedReasons(metrics, score) {
        const reasons = [];
        if (metrics.perplexity < 8) {
            reasons.push(`Low perplexity (${metrics.perplexity.toFixed(2)}) suggests predictable word patterns typical of AI`);
        }
        if (metrics.burstiness < 0.1) {
            reasons.push(`Low burstiness (${metrics.burstiness.toFixed(2)}) indicates consistent sentence structure characteristic of AI`);
        }
        if (metrics.humanLikenessIndicators < 0.3) {
            reasons.push(`Low human-likeness indicators (${metrics.humanLikenessIndicators.toFixed(2)}) suggest absence of typical human writing patterns`);
        }
        if (metrics.entropyScore < 0.7) {
            reasons.push(`Low entropy score (${metrics.entropyScore.toFixed(2)}) indicates predictable word choice patterns typical of AI`);
        }
        if (metrics.informalnessScore < 0.2) {
            reasons.push(`Low informality score (${metrics.informalnessScore.toFixed(2)}) suggests formal, AI-like writing style`);
        }
        if (metrics.lexicalDiversity > 0.4 && metrics.lexicalDiversity < 0.7) {
            reasons.push(`Lexical diversity (${metrics.lexicalDiversity.toFixed(2)}) falls within AI-typical range`);
        }
        if (metrics.transitionDensity > 2) {
            reasons.push(`High transition word density (${metrics.transitionDensity.toFixed(1)}%) characteristic of AI writing`);
        }
        if (metrics.discourseMarkerPatterns > 0.3) {
            reasons.push(`Elevated discourse marker usage (${metrics.discourseMarkerPatterns.toFixed(2)}) typical of AI text structure`);
        }
        if (metrics.formalityIndex > 0.5) {
            reasons.push(`Elevated formality index (${metrics.formalityIndex.toFixed(2)}) suggests AI-generated content`);
        }
        if (metrics.semanticCoherence > 0.6) {
            reasons.push(`High semantic coherence (${metrics.semanticCoherence.toFixed(2)}) typical of AI optimization`);
        }
        if (metrics.functionWordAnalysis > 0.5) {
            reasons.push(`Function word distribution (${metrics.functionWordAnalysis.toFixed(2)}) deviates from natural human patterns`);
        }
        if (metrics.emotionalToneVariability < 0.2) {
            reasons.push(`Low emotional tone variability (${metrics.emotionalToneVariability.toFixed(2)}) suggests limited emotional expression typical of AI`);
        }
        if (metrics.stylometricSignature < 0.6) {
            reasons.push(`Low stylometric variation (${metrics.stylometricSignature.toFixed(2)}) indicates consistent AI writing patterns`);
        }
        if (metrics.sentenceStructureEntropy < 0.8) {
            reasons.push(`Low sentence structure entropy (${metrics.sentenceStructureEntropy.toFixed(2)}) suggests uniform AI sentence construction`);
        }
        if (metrics.nGramRepetition > 0.1) {
            reasons.push(`Repetitive n-gram patterns (${(metrics.nGramRepetition * 100).toFixed(1)}%) detected`);
        }
        if (metrics.bigramUnusualness > 0.2) {
            reasons.push(`Unusual bigram patterns (${(metrics.bigramUnusualness * 100).toFixed(1)}%) may indicate AI generation`);
        }
        // Positive indicators for human text
        if (score <= 0.4) {
            reasons.push("Natural linguistic variation suggests human authorship");
            reasons.push("Irregular patterns inconsistent with AI generation");
            if (metrics.humanLikenessIndicators > 0.5) {
                reasons.push("Strong human-like writing patterns detected");
            }
            if (metrics.informalnessScore > 0.4) {
                reasons.push("Informal language patterns suggest human authorship");
            }
            if (metrics.emotionalToneVariability > 0.3) {
                reasons.push("Varied emotional expression typical of human writing");
            }
        }
        if (metrics.entropyScore > 0.8) {
            reasons.push("High entropy indicates natural human unpredictability in word choice");
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
//# sourceMappingURL=index.cjs.map
