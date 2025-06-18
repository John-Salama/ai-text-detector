# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.3] - 2025-06-18

### Enhanced Detection Capabilities

- **Improved Human Text Recognition**: Significantly enhanced detection of informal, casual, and emotional human writing
- **Advanced Pattern Recognition**: Added detection for modern AI writing patterns including phrases like "it's worth noting", "as we delve into", "in today's digital age"
- **Enhanced Informal Language Detection**: Better recognition of contractions, slang, internet abbreviations, and colloquial expressions
- **Emotional Expression Analysis**: Improved detection of emotional tone variability, exclamations, and personal narrative styles

### New Metrics and Analysis Features

- **Entropy-based Analysis**: Added entropy scoring to measure word choice predictability (AI tends to be more predictable)
- **Human-likeness Indicators**: Comprehensive detection of human writing characteristics including typos, inconsistent formatting, and casual language
- **Stylometric Analysis**: Enhanced analysis of writing style consistency and variation patterns
- **Discourse Marker Detection**: Improved identification of overused transition words typical in AI-generated text
- **Function Word Distribution**: Analysis of common word usage patterns that differ between AI and human writing
- **Sentence Structure Entropy**: Evaluation of variety in sentence construction and complexity
- **Topic Coherence Scoring**: Enhanced measurement of semantic consistency across text segments

### Algorithm Improvements

- **Enhanced Perplexity Calculation**: Upgraded to trigram-based model with interpolation and Laplace smoothing for more accurate predictions
- **Adaptive Thresholding**: Dynamic threshold adjustment based on text characteristics, length, and detected human indicators
- **Multi-dimensional Scoring**: Rebalanced scoring weights to prioritize human-likeness indicators and reduce false positives
- **Compound Effect Analysis**: Multiple human indicators now work together to provide more accurate detection

### Performance Enhancements

- **Reduced False Positives**: Significantly improved accuracy on informal human text (casual conversations, social media style writing)
- **Better AI Pattern Detection**: Enhanced recognition of modern AI writing styles and patterns
- **Improved Mixed Content Handling**: Better analysis of text that combines formal and informal elements
- **Contextual Awareness**: Enhanced understanding of different writing contexts and styles

### Technical Improvements

- **Expanded Pattern Libraries**: Added comprehensive collections of human speech patterns, internet slang, and AI-typical phrases
- **Enhanced Statistical Models**: Improved n-gram analysis with better smoothing and interpolation techniques
- **Robust Error Handling**: Better handling of edge cases and unusual text patterns
- **Comprehensive Test Coverage**: Added extensive test suite covering informal text, emotional content, and mixed writing styles

### API and Compatibility

- **Backward Compatibility**: All existing APIs remain unchanged - existing code will continue to work without modifications
- **Enhanced Results**: More detailed analysis and reasoning without breaking existing integrations
- **Improved Accuracy**: Better detection rates while maintaining the same simple API interface
- **Richer Insights**: More comprehensive explanations for detection decisions

## [1.0.0] - 2025-06-17

### Added

- Initial release of AI Text Detector
- Advanced linguistic analysis with 15+ detection techniques
- Support for perplexity and burstiness analysis
- Zero dependencies implementation
- Full TypeScript support with comprehensive type definitions
- Browser and Node.js compatibility
- ES Module and CommonJS builds
- Comprehensive test suite
- Detailed confidence scoring and reasoning
- Multiple API methods for different use cases:
  - `detectAIText()` - Complete analysis
  - `isAIGenerated()` - Quick boolean check
  - `getConfidenceScore()` - Confidence value only
  - `getPerplexityScore()` - Perplexity analysis
  - `getBurstinessScore()` - Burstiness analysis

### Features

- Vocabulary richness analysis
- Syntactic complexity detection
- Semantic coherence measurement
- N-gram repetition analysis
- Transition word usage patterns
- Formality index calculation
- Contextual consistency checking
- Sentence structure variability
- Lexical diversity measurement
- Readability scoring
- Punctuation pattern analysis
- Word frequency distribution
- Support for text analysis from 50+ characters

### Technical

- Bundle size: ~15KB minified
- Zero external dependencies
- Memory efficient algorithms
- Fast processing (<10ms for typical documents)
- Cross-platform compatibility (Windows, macOS, Linux)
- Browser support: Chrome 60+, Firefox 55+, Safari 12+, Edge 79+
- Node.js support: 14.0.0+
