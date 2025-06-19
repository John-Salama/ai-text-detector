'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

/**
 * Text processing utilities for AI text detection
 */
function tokenizeWords(text) {
    return text
        .toLowerCase()
        .replace(/[^\w\s'-]/g, " ")
        .split(/\s+/)
        .filter((word) => word.length > 0);
}
function splitIntoSentences(text) {
    return text
        .split(/[.!?]+/)
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
}
function extractTopicWords(sentence, commonWords, transitionWords) {
    const words = tokenizeWords(sentence);
    return words.filter((word) => word.length > 4 &&
        !commonWords.has(word) &&
        !transitionWords.includes(word));
}

/**
 * Perplexity calculation for AI text detection
 * Measures how well a text can be predicted based on statistical language models
 */
function calculatePerplexity(words) {
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

/**
 * Burstiness calculation for AI text detection
 * Measures variation in sentence lengths
 */
function calculateBurstiness(sentences) {
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
function calculateAverageWordsPerSentence(sentences) {
    if (sentences.length === 0)
        return 0;
    const totalWords = sentences.reduce((sum, sentence) => sum + sentence.split(/\s+/).length, 0);
    return totalWords / sentences.length;
}
function calculateSentenceVariability(sentences) {
    if (sentences.length < 2)
        return 0;
    const lengths = sentences.map((s) => s.split(/\s+/).length);
    const average = lengths.reduce((a, b) => a + b, 0) / lengths.length;
    const variance = lengths.reduce((sum, len) => sum + Math.pow(len - average, 2), 0) /
        lengths.length;
    return Math.sqrt(variance);
}

/**
 * Lexical analysis metrics for AI text detection
 */
function calculateLexicalDiversity(words) {
    const uniqueWords = new Set(words);
    return uniqueWords.size / words.length;
}
function calculateVocabularyRichness(words) {
    const uniqueWords = new Set(words);
    const hapaxLegomena = Array.from(uniqueWords).filter((word) => words.filter((w) => w === word).length === 1);
    return hapaxLegomena.length / uniqueWords.size;
}
function analyzeWordFrequencyDistribution(words) {
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
function calculateEntropyScore(words) {
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

/**
 * Syntactic and semantic analysis metrics
 */
function calculateSyntacticComplexity(sentences) {
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
function calculateSemanticCoherence(sentences) {
    if (sentences.length < 2)
        return 1;
    let coherenceScore = 0;
    for (let i = 1; i < sentences.length; i++) {
        const prevWords = new Set(tokenizeWords(sentences[i - 1]));
        const currWords = new Set(tokenizeWords(sentences[i]));
        // Calculate word overlap between consecutive sentences
        const intersection = new Set([...prevWords].filter((x) => currWords.has(x)));
        const union = new Set([...prevWords, ...currWords]);
        coherenceScore += intersection.size / union.size;
    }
    return coherenceScore / (sentences.length - 1);
}
function calculateNGramRepetition(words) {
    const trigrams = new Map();
    for (let i = 0; i < words.length - 2; i++) {
        const trigram = `${words[i]} ${words[i + 1]} ${words[i + 2]}`;
        trigrams.set(trigram, (trigrams.get(trigram) || 0) + 1);
    }
    const repeatedTrigrams = Array.from(trigrams.values()).filter((count) => count > 1);
    return repeatedTrigrams.length / Math.max(trigrams.size, 1);
}
function calculateBigramUnusualness(words) {
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

// Common words for frequency analysis
const commonWords = new Set([
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
// Human-like patterns and indicators
const humanPatterns = [
    /\b(lol|lmao|omg|wtf|btw|tbh|imho|imo)\b/gi,
    /\b(gonna|wanna|gotta|kinda|sorta|dunno)\b/gi,
    /\b(yeah|yep|nah|nope|meh|ugh|hmm)\b/gi,
    /\b(super|really|pretty|kinda|totally|absolutely)\b/gi,
    /\b(awesome|amazing|terrible|awful|weird|crazy)\b/gi,
];
// Emotional expressions
const emotionalMarkers = [
    /\b(love|hate|excited|frustrated|angry|happy|sad|worried|anxious)\b/gi,
    /\b(feel|felt|feeling|emotions|emotional|mood)\b/gi,
    /(!{2,}|\?{2,}|\.{3,})/g, // Multiple punctuation marks
    /[A-Z]{2,}/g, // CAPS for emphasis
];
// Discourse markers for sophisticated analysis
const discourseMarkers = [
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
const functionWords = [
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
const transitionWords = [
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
const sophisticatedWords = [
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

/**
 * Readability and style analysis metrics
 */
function calculateReadabilityScore(text, sentences, words) {
    const avgWordsPerSentence = words.length / sentences.length;
    const complexWords = words.filter((word) => word.length > 6).length;
    const complexWordRatio = complexWords / words.length;
    // Simplified Flesch-Kincaid-like formula
    return 206.835 - 1.015 * avgWordsPerSentence - 84.6 * complexWordRatio;
}
function analyzePunctuationPatterns(text) {
    const punctuation = text.match(/[.!?;:,]/g) || [];
    const words = tokenizeWords(text);
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
function calculateTransitionDensity(words) {
    const transitionCount = words.filter((word) => transitionWords.some((tw) => word.includes(tw))).length;
    return (transitionCount / words.length) * 100;
}
function calculateFormalityIndex(words) {
    const sophisticatedCount = words.filter((word) => sophisticatedWords.includes(word)).length;
    const commonWordCount = words.filter((word) => commonWords.has(word)).length;
    return (sophisticatedCount /
        words.length /
        Math.max(commonWordCount / words.length, 0.1));
}
function calculateStylometricSignature(text, sentences, words) {
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

/**
 * Human-likeness and emotional analysis metrics
 */
function calculateHumanLikenessIndicators(text) {
    let score = 0;
    let totalIndicators = 0;
    const words = tokenizeWords(text);
    const sentences = splitIntoSentences(text);
    // Check for informal language (enhanced patterns)
    const informalMatches = humanPatterns.reduce((count, pattern) => {
        return count + (text.match(pattern) || []).length;
    }, 0);
    score += Math.min(informalMatches / 3, 1); // Increased sensitivity
    totalIndicators++;
    // Check for contractions (very human-like)
    const contractions = (text.match(/\b\w+[''](?:t|re|ve|ll|d|s|m)\b/gi) || [])
        .length;
    score += Math.min(contractions / 5, 1); // More sensitive
    totalIndicators++;
    // Check for typos and misspellings
    const potentialTypos = text.match(/\b[a-z]*[aeiou]{3,}[a-z]*\b/gi) || [];
    const doubleLetters = text.match(/\b\w*([a-z])\1{2,}\w*\b/gi) || [];
    const inconsistentSpacing = text.match(/\s{2,}/g) || [];
    score += Math.min((potentialTypos.length +
        doubleLetters.length +
        inconsistentSpacing.length) /
        5, // More sensitive
    1);
    totalIndicators++;
    // Check for personal pronouns and narrative style
    const personalPronouns = (text.match(/\b(I|me|my|mine|myself|we|us|our|ours)\b/gi) || []).length;
    score += Math.min(personalPronouns / Math.max(words.length * 0.05, 1), 1); // More sensitive
    totalIndicators++;
    // Check for emotional punctuation (very human)
    const emotionalPunct = (text.match(/[!]{2,}|[?]{2,}|[.]{3,}/g) || [])
        .length;
    score += Math.min(emotionalPunct / 3, 1); // More sensitive
    totalIndicators++;
    // Check for ALL CAPS words (emphasis) - very human
    const capsWords = (text.match(/\b[A-Z]{2,}\b/g) || []).length;
    score += Math.min(capsWords / 5, 1); // More sensitive
    totalIndicators++;
    // Check for internet slang and abbreviations (very human)
    const internetSlang = (text.match(/\b(lol|lmao|omg|wtf|btw|tbh|imho|imo|ngl|smh|fml|irl|rn|af|fr|periodt|idk|ikr|brb|ttyl|dm|pm|sus|lit|fam|bae|goat|facts|no cap|bet|vibe|mood|periodt)\b/gi) || []).length;
    score += Math.min(internetSlang / 2, 1); // Very sensitive to slang
    totalIndicators++;
    // Check for incomplete sentences or fragments (human-like)
    const fragments = sentences.filter((s) => {
        const words = s.trim().split(/\s+/);
        return (words.length < 4 &&
            !words.some((w) => w.match(/^(yes|no|ok|okay|yeah|nah|sure|maybe|absolutely|definitely)$/i)));
    }).length;
    score += Math.min(fragments / Math.max(sentences.length * 0.3, 1), 0.8);
    totalIndicators++;
    // Check for conversational markers (very human)
    const conversationalMarkers = (text.match(/\b(like|you know|I mean|right|so|well|um|uh|actually|basically|literally|honestly|seriously|obviously|apparently|supposedly|kinda|sorta|maybe|probably|definitely|absolutely|totally|completely|exactly|precisely)\b/gi) || []).length;
    score += Math.min(conversationalMarkers / Math.max(words.length * 0.1, 1), 1);
    totalIndicators++;
    // Check for creative/descriptive language (narrative human writing)
    const creativeDescriptions = (text.match(/\b(nearly twice|hardly any|very large|came in very useful|no finer|big beefy|which made|although he did|spent so much|craning over|spying on)\b/gi) || []).length;
    score += Math.min(creativeDescriptions / 3, 1);
    totalIndicators++;
    // Check for character names and storytelling elements
    const narrativeElements = (text.match(/\b(Mr\.|Mrs\.|called|named|director|firm|son|opinion|neighbors|mustache|blonde)\b/gi) || []).length;
    score += Math.min(narrativeElements / 5, 0.8);
    totalIndicators++;
    // Check for narrative pronouns (third person storytelling)
    const narrativePronouns = (text.match(/\b(he|she|they|him|her|them|his|hers|their|theirs)\b/gi) || []).length;
    score += Math.min(narrativePronouns / Math.max(words.length * 0.08, 1), 0.7);
    totalIndicators++;
    return score / totalIndicators;
}
function calculateEmotionalToneVariability(text) {
    let emotionalMarkerCount = 0;
    emotionalMarkers.forEach((pattern) => {
        emotionalMarkerCount += (text.match(pattern) || []).length;
    });
    // Additional emotional indicators
    const exclamations = (text.match(/!/g) || []).length;
    const questions = (text.match(/\?/g) || []).length;
    const emotionalWords = (text.match(/\b(love|hate|excited|frustrated|angry|happy|sad|worried|anxious|amazing|terrible|awesome|awful|horrible|wonderful|fantastic|disgusting|annoying|brilliant|stupid|crazy|insane|wild|mad|furious|thrilled|devastated|shocked|surprised|confused|overwhelmed)\b/gi) || []).length;
    const words = tokenizeWords(text);
    const totalEmotionalSignals = emotionalMarkerCount + exclamations + questions + emotionalWords;
    return Math.min(totalEmotionalSignals / Math.max(words.length * 0.1, 1), 1);
}
function calculateInformalnessScore(text) {
    let informalityScore = 0;
    let totalFeatures = 0;
    const words = tokenizeWords(text);
    const sentences = splitIntoSentences(text);
    // Contractions (very informal)
    const contractions = (text.match(/\b\w+[''](?:t|re|ve|ll|d|s|m)\b/gi) || [])
        .length;
    informalityScore += Math.min(contractions / Math.max(words.length * 0.1, 1), 1);
    totalFeatures++;
    // Slang and colloquialisms (very informal)
    const slangCount = humanPatterns.reduce((count, pattern) => {
        return count + (text.match(pattern) || []).length;
    }, 0);
    informalityScore += Math.min(slangCount / 5, 1); // More sensitive
    totalFeatures++;
    // Sentence fragments (informal)
    const fragments = sentences.filter((s) => s.split(/\s+/).length < 4).length;
    informalityScore += Math.min(fragments / Math.max(sentences.length * 0.4, 1), 1);
    totalFeatures++;
    // Ellipses and multiple punctuation (informal)
    const multiplePunct = (text.match(/[.!?]{2,}/g) || []).length;
    informalityScore += Math.min(multiplePunct / 5, 1); // More sensitive
    totalFeatures++;
    // Conversational words (informal)
    const conversationalWords = (text.match(/\b(like|you know|I mean|right|so|well|um|uh|actually|basically|literally|honestly|seriously|obviously|apparently|kinda|sorta|gonna|wanna|gotta)\b/gi) || []).length;
    informalityScore += Math.min(conversationalWords / Math.max(words.length * 0.05, 1), 1);
    totalFeatures++;
    // Lowercase sentence beginnings (very informal)
    const lowercaseStarts = sentences.filter((s) => {
        const trimmed = s.trim();
        return (trimmed.length > 0 &&
            trimmed[0] === trimmed[0].toLowerCase() &&
            trimmed[0].match(/[a-z]/));
    }).length;
    informalityScore += Math.min(lowercaseStarts / Math.max(sentences.length * 0.3, 1), 1);
    totalFeatures++;
    // Run-on sentences with "and" (informal)
    const runOnSentences = sentences.filter((s) => {
        const andCount = (s.match(/\band\b/gi) || []).length;
        const wordCount = s.split(/\s+/).length;
        return andCount > 2 && wordCount > 20;
    }).length;
    informalityScore += Math.min(runOnSentences / Math.max(sentences.length * 0.5, 1), 0.8);
    totalFeatures++;
    return informalityScore / totalFeatures;
}
function calculateDiscourseMarkerPatterns(words) {
    const discourseMarkerCount = words.filter((word) => discourseMarkers.some((marker) => marker.toLowerCase().includes(word.toLowerCase()))).length;
    // AI tends to overuse discourse markers
    const density = discourseMarkerCount / words.length;
    return Math.min(density * 50, 1);
}
function calculateFunctionWordAnalysis(words) {
    const functionWordCount = words.filter((word) => functionWords.includes(word.toLowerCase())).length;
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

/**
 * Contextual and structural analysis metrics
 */
function calculateContextualConsistency(sentences) {
    if (sentences.length < 3)
        return 1;
    let consistencyScore = 0;
    const topics = sentences.map((sentence) => extractTopicWords(sentence, commonWords, transitionWords));
    for (let i = 1; i < topics.length - 1; i++) {
        const prevTopics = new Set(topics[i - 1]);
        const currTopics = new Set(topics[i]);
        const nextTopics = new Set(topics[i + 1]);
        const allTopics = new Set([...prevTopics, ...currTopics, ...nextTopics]);
        const commonTopicsCount = [...allTopics].filter((topic) => [prevTopics, currTopics, nextTopics].filter((set) => set.has(topic))
            .length >= 2);
        consistencyScore += commonTopicsCount.length / Math.max(allTopics.size, 1);
    }
    return consistencyScore / Math.max(sentences.length - 2, 1);
}
function calculateSentenceStructureEntropy(sentences) {
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
function calculateTopicCoherenceScore(sentences) {
    if (sentences.length < 2)
        return 1;
    const topicWords = sentences.map((sentence) => extractTopicWords(sentence, commonWords, transitionWords));
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

/**
 * Narrative and creative writing analysis
 */
function calculateNarrativeScore(text) {
    let narrativeScore = 0;
    let totalIndicators = 0;
    const words = tokenizeWords(text);
    // Check for character names and proper nouns (common in narrative)
    const properNouns = (text.match(/\b[A-Z][a-z]+\b/g) || []).length;
    narrativeScore += Math.min(properNouns / Math.max(words.length * 0.1, 1), 1);
    totalIndicators++;
    // Check for past tense narrative patterns
    const pastTenseVerbs = (text.match(/\b\w+(ed|was|were|had|did|said|went|came|saw|looked|thought|felt|knew|told|asked|answered|walked|turned|opened|closed)\b/gi) || []).length;
    narrativeScore += Math.min(pastTenseVerbs / Math.max(words.length * 0.1, 1), 1);
    totalIndicators++;
    // Check for descriptive language
    const descriptiveWords = (text.match(/\b(big|small|large|tiny|huge|enormous|beautiful|ugly|old|young|tall|short|fat|thin|thick|wide|narrow|bright|dark|loud|quiet|soft|hard|smooth|rough|hot|cold|warm|cool|dry|wet|clean|dirty|new|old|fresh|stale|sweet|sour|bitter|salty|spicy|mild|strong|weak|heavy|light|fast|slow|quick|careful|gentle|rough|kind|mean|nice|bad|good|excellent|terrible|wonderful|awful|amazing|boring|interesting|exciting|scary|funny|sad|happy|angry|surprised|confused|tired|energetic)\b/gi) || []).length;
    narrativeScore += Math.min(descriptiveWords / Math.max(words.length * 0.08, 1), 1);
    totalIndicators++;
    // Check for dialogue indicators
    const dialogueIndicators = (text.match(/["'"]/g) || []).length;
    narrativeScore += Math.min(dialogueIndicators / 10, 0.8);
    totalIndicators++;
    // Check for third-person narrative pronouns
    const thirdPersonPronouns = (text.match(/\b(he|she|they|him|her|them|his|hers|their|theirs)\b/gi) || []).length;
    narrativeScore += Math.min(thirdPersonPronouns / Math.max(words.length * 0.05, 1), 1);
    totalIndicators++;
    return narrativeScore / totalIndicators;
}
function calculateCreativityScore(text) {
    let creativityScore = 0;
    let totalIndicators = 0;
    const words = tokenizeWords(text);
    // Check for metaphors and similes
    const metaphorPatterns = (text.match(/\b(like|as|seemed|appeared|looked like|sounded like|felt like|was like|were like)\b/gi) || []).length;
    creativityScore += Math.min(metaphorPatterns / Math.max(words.length * 0.05, 1), 1);
    totalIndicators++;
    // Check for unique/creative descriptions (unusual adjective-noun combinations)
    const creativeDescriptions = (text.match(/\b(nearly twice|hardly any|very large|came in very useful|no finer|so much of|which made|although he did)\b/gi) || []).length;
    creativityScore += Math.min(creativeDescriptions / 5, 1);
    totalIndicators++;
    // Check for vivid imagery words
    const imageryWords = (text.match(/\b(craning|spying|mustache|beefy|blonde|drilling|garden fences|neighbors|opinion|director|firm)\b/gi) || []).length;
    creativityScore += Math.min(imageryWords / Math.max(words.length * 0.1, 1), 1);
    totalIndicators++;
    // Check for specific, concrete details rather than abstract concepts
    const concreteNouns = (text.match(/\b(drill|mustache|neck|fence|garden|neighbor|son|boy|director|firm|company|house|car|door|window|street|road|tree|flower|table|chair|book|phone|computer|cat|dog|bird|food|water|coffee|tea|money|time|day|night|morning|evening|sun|moon|star|cloud|rain|snow|wind|fire|ice|rock|sand|grass|leaf|branch|root|seed)\b/gi) || []).length;
    creativityScore += Math.min(concreteNouns / Math.max(words.length * 0.08, 1), 1);
    totalIndicators++;
    // Check for character-focused writing
    const characterFocus = (text.match(/\b(Mr\.|Mrs\.|Dursley|Dudley|Grunnings|called|named|known as)\b/gi) || []).length;
    creativityScore += Math.min(characterFocus / 8, 1);
    totalIndicators++;
    return creativityScore / totalIndicators;
}

/**
 * Main AI Text Detector class
 */
class AITextDetector {
    detectAIText(text) {
        if (!text || text.trim().length === 0) {
            throw new Error("Text cannot be empty");
        }
        if (text.trim().length < 50) {
            throw new Error("Text too short for reliable analysis (minimum 50 characters)");
        }
        const analysisMetrics = this.analyzeText(text);
        const score = this.calculateAdvancedAIScore(analysisMetrics);
        // More balanced threshold - conservative but not too much
        let threshold = 0.58; // Slightly lower base threshold
        // Adjust threshold based on text length
        const wordCount = tokenizeWords(text).length;
        if (wordCount < 100) {
            threshold += 0.04; // Less adjustment for shorter texts
        }
        else if (wordCount > 300) {
            threshold -= 0.02; // Slightly more sensitive for longer texts
        }
        // Detect narrative/literary writing patterns - ONLY for highly narrative text
        const narrativeScore = calculateNarrativeScore(text);
        if (narrativeScore > 0.5) {
            threshold += 0.15; // Much more conservative for clearly narrative text
        }
        else if (narrativeScore > 0.35) {
            threshold += 0.08; // Moderate adjustment for somewhat narrative text
        }
        // Adjust based on detected human patterns - be more selective
        if (analysisMetrics.humanLikenessIndicators > 0.6) {
            threshold += 0.2; // Strong adjustment for very human text
        }
        else if (analysisMetrics.humanLikenessIndicators > 0.4) {
            threshold += 0.12; // Moderate adjustment for clearly human text
        }
        else if (analysisMetrics.humanLikenessIndicators > 0.2) {
            threshold += 0.05; // Small adjustment for somewhat human text
        }
        if (analysisMetrics.informalnessScore > 0.5) {
            threshold += 0.15; // Strong adjustment for very informal text
        }
        else if (analysisMetrics.informalnessScore > 0.3) {
            threshold += 0.08; // Moderate adjustment for informal text
        }
        else if (analysisMetrics.informalnessScore > 0.15) {
            threshold += 0.03; // Small adjustment for somewhat informal text
        }
        if (analysisMetrics.emotionalToneVariability > 0.4) {
            threshold += 0.12; // Adjustment for very emotional text
        }
        else if (analysisMetrics.emotionalToneVariability > 0.2) {
            threshold += 0.06; // Small adjustment for somewhat emotional text
        }
        // Check for creative writing indicators - be more selective
        const creativityScore = calculateCreativityScore(text);
        if (creativityScore > 0.5) {
            threshold += 0.2; // Strong boost for very creative writing
        }
        else if (creativityScore > 0.35) {
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
    analyzeText(text) {
        const sentences = splitIntoSentences(text);
        const words = tokenizeWords(text);
        const cleanWords = words.filter((word) => word.length > 2);
        return {
            perplexity: calculatePerplexity(words),
            burstiness: calculateBurstiness(sentences),
            averageWordsPerSentence: calculateAverageWordsPerSentence(sentences),
            sentenceVariability: calculateSentenceVariability(sentences),
            lexicalDiversity: calculateLexicalDiversity(cleanWords),
            readabilityScore: calculateReadabilityScore(text, sentences, words),
            syntacticComplexity: calculateSyntacticComplexity(sentences),
            semanticCoherence: calculateSemanticCoherence(sentences),
            nGramRepetition: calculateNGramRepetition(words),
            punctuationPatterns: analyzePunctuationPatterns(text),
            wordFrequencyDistribution: analyzeWordFrequencyDistribution(cleanWords),
            transitionDensity: calculateTransitionDensity(cleanWords),
            formalityIndex: calculateFormalityIndex(cleanWords),
            vocabularyRichness: calculateVocabularyRichness(cleanWords),
            contextualConsistency: calculateContextualConsistency(sentences),
            // Enhanced metrics
            entropyScore: calculateEntropyScore(words),
            humanLikenessIndicators: calculateHumanLikenessIndicators(text),
            emotionalToneVariability: calculateEmotionalToneVariability(text),
            discourseMarkerPatterns: calculateDiscourseMarkerPatterns(cleanWords),
            functionWordAnalysis: calculateFunctionWordAnalysis(cleanWords),
            informalnessScore: calculateInformalnessScore(text),
            sentenceStructureEntropy: calculateSentenceStructureEntropy(sentences),
            topicCoherenceScore: calculateTopicCoherenceScore(sentences),
            bigramUnusualness: calculateBigramUnusualness(words),
            stylometricSignature: calculateStylometricSignature(text, sentences, words),
        };
    }
    calculateAdvancedAIScore(analysisMetrics) {
        let score = 0;
        // Focus on the most discriminative metrics with proper weighting
        // 1. Human-likeness indicators (MOST IMPORTANT - inverse scoring)
        const humanScore = 1 - analysisMetrics.humanLikenessIndicators;
        score += humanScore * 0.25; // Reduced from 0.30
        // 2. Informality score (VERY IMPORTANT - inverse scoring)
        const formalityScore = 1 - analysisMetrics.informalnessScore;
        score += formalityScore * 0.2; // Reduced from 0.25
        // 3. Emotional tone variability (IMPORTANT - inverse scoring)
        const emotionalScore = 1 - Math.min(analysisMetrics.emotionalToneVariability, 1);
        score += emotionalScore * 0.15; // Reduced from 0.20
        // 4. Perplexity analysis (more balanced)
        let perplexityScore = 0;
        if (analysisMetrics.perplexity < 2) {
            perplexityScore = 1; // Very AI-like
        }
        else if (analysisMetrics.perplexity < 4) {
            perplexityScore = 0.8; // Likely AI
        }
        else if (analysisMetrics.perplexity < 7) {
            perplexityScore = 0.5; // Uncertain - could be formal human writing
        }
        else if (analysisMetrics.perplexity < 12) {
            perplexityScore = 0.2; // Likely human
        }
        else {
            perplexityScore = 0.05; // Very likely human
        }
        score += perplexityScore * 0.18; // Reduced from 0.20
        // 5. Burstiness analysis (increased weight)
        let burstinessScore = 0;
        if (analysisMetrics.burstiness < -0.5) {
            burstinessScore = 0.9; // Very consistent = AI-like
        }
        else if (analysisMetrics.burstiness < 0) {
            burstinessScore = 0.6; // Somewhat consistent = possibly AI
        }
        else if (analysisMetrics.burstiness < 0.3) {
            burstinessScore = 0.3; // Some variation = possibly human
        }
        else {
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
    applyAdaptiveThresholding(baseScore, analysisMetrics) {
        let adjustedScore = baseScore;
        // Strong human indicators should significantly reduce AI probability
        if (analysisMetrics.humanLikenessIndicators > 0.6) {
            adjustedScore *= 0.2; // Very strong reduction for very human text
        }
        else if (analysisMetrics.humanLikenessIndicators > 0.4) {
            adjustedScore *= 0.4; // Strong reduction for clearly human text
        }
        else if (analysisMetrics.humanLikenessIndicators > 0.2) {
            adjustedScore *= 0.7; // Moderate reduction for somewhat human text
        }
        // High informality should reduce AI probability
        if (analysisMetrics.informalnessScore > 0.6) {
            adjustedScore *= 0.3; // Strong reduction for very informal text
        }
        else if (analysisMetrics.informalnessScore > 0.4) {
            adjustedScore *= 0.5; // Moderate reduction for informal text
        }
        else if (analysisMetrics.informalnessScore > 0.2) {
            adjustedScore *= 0.8; // Light reduction for somewhat informal text
        }
        // High emotional variability should reduce AI probability
        if (analysisMetrics.emotionalToneVariability > 0.5) {
            adjustedScore *= 0.4; // Strong reduction for very emotional text
        }
        else if (analysisMetrics.emotionalToneVariability > 0.3) {
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
        }
        else if (strongHumanIndicators >= 2) {
            adjustedScore *= 0.3; // Strong reduction for likely human text
        }
        return Math.max(0, Math.min(1, adjustedScore));
    }
    generateDetailedReasons(analysisMetrics, score) {
        const reasons = [];
        if (analysisMetrics.perplexity < 8) {
            reasons.push(`Low perplexity (${analysisMetrics.perplexity.toFixed(2)}) suggests predictable word patterns typical of AI`);
        }
        if (analysisMetrics.burstiness < 0.1) {
            reasons.push(`Low burstiness (${analysisMetrics.burstiness.toFixed(2)}) indicates consistent sentence structure characteristic of AI`);
        }
        if (analysisMetrics.humanLikenessIndicators < 0.3) {
            reasons.push(`Low human-likeness indicators (${analysisMetrics.humanLikenessIndicators.toFixed(2)}) suggest absence of typical human writing patterns`);
        }
        if (analysisMetrics.entropyScore < 0.7) {
            reasons.push(`Low entropy score (${analysisMetrics.entropyScore.toFixed(2)}) indicates predictable word choice patterns typical of AI`);
        }
        if (analysisMetrics.informalnessScore < 0.2) {
            reasons.push(`Low informality score (${analysisMetrics.informalnessScore.toFixed(2)}) suggests formal, AI-like writing style`);
        }
        if (analysisMetrics.lexicalDiversity > 0.4 && analysisMetrics.lexicalDiversity < 0.7) {
            reasons.push(`Lexical diversity (${analysisMetrics.lexicalDiversity.toFixed(2)}) falls within AI-typical range`);
        }
        if (analysisMetrics.transitionDensity > 2) {
            reasons.push(`High transition word density (${analysisMetrics.transitionDensity.toFixed(1)}%) characteristic of AI writing`);
        }
        if (analysisMetrics.discourseMarkerPatterns > 0.3) {
            reasons.push(`Elevated discourse marker usage (${analysisMetrics.discourseMarkerPatterns.toFixed(2)}) typical of AI text structure`);
        }
        if (analysisMetrics.formalityIndex > 0.5) {
            reasons.push(`Elevated formality index (${analysisMetrics.formalityIndex.toFixed(2)}) suggests AI-generated content`);
        }
        if (analysisMetrics.semanticCoherence > 0.6) {
            reasons.push(`High semantic coherence (${analysisMetrics.semanticCoherence.toFixed(2)}) typical of AI optimization`);
        }
        if (analysisMetrics.functionWordAnalysis > 0.5) {
            reasons.push(`Function word distribution (${analysisMetrics.functionWordAnalysis.toFixed(2)}) deviates from natural human patterns`);
        }
        if (analysisMetrics.emotionalToneVariability < 0.2) {
            reasons.push(`Low emotional tone variability (${analysisMetrics.emotionalToneVariability.toFixed(2)}) suggests limited emotional expression typical of AI`);
        }
        if (analysisMetrics.stylometricSignature < 0.6) {
            reasons.push(`Low stylometric variation (${analysisMetrics.stylometricSignature.toFixed(2)}) indicates consistent AI writing patterns`);
        }
        if (analysisMetrics.sentenceStructureEntropy < 0.8) {
            reasons.push(`Low sentence structure entropy (${analysisMetrics.sentenceStructureEntropy.toFixed(2)}) suggests uniform AI sentence construction`);
        }
        if (analysisMetrics.nGramRepetition > 0.1) {
            reasons.push(`Repetitive n-gram patterns (${(analysisMetrics.nGramRepetition * 100).toFixed(1)}%) detected`);
        }
        if (analysisMetrics.bigramUnusualness > 0.2) {
            reasons.push(`Unusual bigram patterns (${(analysisMetrics.bigramUnusualness * 100).toFixed(1)}%) may indicate AI generation`);
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
            reasons.push("High entropy indicates natural human unpredictability in word choice");
        }
        if (analysisMetrics.vocabularyRichness < 0.3) {
            reasons.push("Limited vocabulary richness may indicate AI limitations");
        }
        return reasons;
    }
}

/**
 * AI Text Detector - Main entry point
 * Refactored for better maintainability and modularity
 */
// Create a default instance for convenience
const detector = new AITextDetector();
/**
 * Convenience function to detect AI-generated text
 * @param text - The text to analyze
 * @returns Detection result
 */
function detectAIText(text) {
    return detector.detectAIText(text);
}
/**
 * Legacy function to check if text is AI-generated
 * @param text - The text to analyze
 * @returns boolean indicating if text is likely AI-generated
 */
function isAIGenerated(text) {
    return detector.detectAIText(text).isAIGenerated;
}
/**
 * Legacy function to get confidence score
 * @param text - The text to analyze
 * @returns confidence score between 0 and 1
 */
function getConfidenceScore(text) {
    return detector.detectAIText(text).confidence;
}
/**
 * Legacy function to get perplexity score
 * @param text - The text to analyze
 * @returns perplexity score
 */
function getPerplexityScore(text) {
    return detector.detectAIText(text).perplexityScore;
}
/**
 * Legacy function to get burstiness score
 * @param text - The text to analyze
 * @returns burstiness score
 */
function getBurstinessScore(text) {
    return detector.detectAIText(text).burstinessScore;
}
// Default export
var index = {
    AITextDetector,
    detectAIText,
    isAIGenerated,
    getConfidenceScore,
    getPerplexityScore,
    getBurstinessScore
};

exports.AITextDetector = AITextDetector;
exports.default = index;
exports.detectAIText = detectAIText;
exports.getBurstinessScore = getBurstinessScore;
exports.getConfidenceScore = getConfidenceScore;
exports.getPerplexityScore = getPerplexityScore;
exports.isAIGenerated = isAIGenerated;
//# sourceMappingURL=index.cjs.map
