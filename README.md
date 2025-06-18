# AI Text Detector

[![npm version](https://badge.fury.io/js/ai-text-detector.svg)](https://www.npmjs.com/package/ai-text-detector)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)

A lightweight, fast JavaScript/TypeScript library for detecting AI-generated text using advanced linguistic analysis. Features enhanced human text recognition, modern AI pattern detection, and adaptive thresholding. Works in both Node.js and browser environments with zero dependencies.

## Features

- 🚀 **Lightweight** - Zero external dependencies, small bundle size
- 🔍 **Accurate** - Uses 25+ linguistic analysis techniques including advanced perplexity and burstiness
- 🌐 **Universal** - Works in Node.js, React, Vue, Angular, and browser environments
- 📝 **TypeScript** - Full TypeScript support with comprehensive type definitions
- ⚡ **Fast** - Efficient pattern matching and analysis algorithms
- 🧠 **Smart** - Advanced analysis of sentence structure, vocabulary patterns, and writing style
- 📊 **Detailed** - Provides confidence scores, reasoning, and detailed metrics
- 🎯 **Enhanced Human Detection** - Improved recognition of informal, casual, and emotional human writing
- 🔬 **Advanced AI Pattern Recognition** - Detects modern AI writing patterns and phrases
- 🏷️ **Adaptive Analysis** - Dynamic thresholding based on text characteristics

## Installation

```bash
npm install ai-text-detector
```

```bash
yarn add ai-text-detector
```

## Usage

### Basic Usage

```javascript
import {
  detectAIText,
  isAIGenerated,
  getConfidenceScore,
} from "ai-text-detector";

const longText =
  "Furthermore, it is important to note that artificial intelligence has significantly enhanced various operational processes across multiple industries.";

const shortText = "Hello world!";

// Get detailed analysis for longer text
const result = detectAIText(longText);
console.log(result);
// {
//   isAIGenerated: true,
//   confidence: 0.75,
//   reasons: [
//     "High frequency of transition words typical of AI writing",
//     "Elevated formality level characteristic of AI text"
//   ],
//   score: 0.75
// }

// Handle short text (less than 50 characters)
try {
  const shortResult = detectAIText(shortText);
  console.log(shortResult);
} catch (error) {
  console.log("Error:", error.message);
  // Output: "Error: Text too short for reliable analysis (minimum 50 characters)"
}

// Alternative: Check text length before analysis
function safeDetectAI(text) {
  if (text.trim().length < 50) {
    return {
      isAIGenerated: false,
      confidence: 0,
      reasons: ["Text too short for reliable analysis"],
      score: 0,
      error: "Minimum 50 characters required",
    };
  }
  return detectAIText(text);
}

const safeResult = safeDetectAI(shortText);
console.log(safeResult);
// {
//   isAIGenerated: false,
//   confidence: 0,
//   reasons: ["Text too short for reliable analysis"],
//   score: 0,
//   error: "Minimum 50 characters required"
// }

// Quick boolean check (also throws error for short text)
try {
  const isAI = isAIGenerated(longText);
  console.log(isAI); // true
} catch (error) {
  console.log("Error:", error.message);
}

// Get confidence score with error handling
try {
  const confidence = getConfidenceScore(longText);
  console.log(confidence); // 0.75
} catch (error) {
  console.log("Error:", error.message);
}
```

### Node.js Usage

```javascript
const { detectAIText } = require("ai-text-detector");

const text = "Your text here...";
const result = detectAIText(text);
console.log(result);
```

### React Usage

```jsx
import React, { useState } from "react";
import { detectAIText } from "ai-text-detector";

function AIDetector() {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);

  const analyzeText = () => {
    if (text.trim()) {
      const detection = detectAIText(text);
      setResult(detection);
    }
  };

  return (
    <div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter text to analyze..."
      />
      <button onClick={analyzeText}>Analyze Text</button>

      {result && (
        <div>
          <p>AI Generated: {result.isAIGenerated ? "Yes" : "No"}</p>
          <p>Confidence: {(result.confidence * 100).toFixed(1)}%</p>
          <ul>
            {result.reasons.map((reason, index) => (
              <li key={index}>{reason}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
```

## API Reference

### `detectAIText(text: string): DetectionResult`

Analyzes the provided text and returns a detailed detection result.

**Parameters:**

- `text` (string): The text to analyze (minimum 50 characters required)

**Returns:**

- `DetectionResult` object with the following properties:
  - `isAIGenerated` (boolean): Whether the text is likely AI-generated
  - `confidence` (number): Confidence score between 0 and 1
  - `reasons` (string[]): Array of reasons explaining the detection
  - `score` (number): Raw detection score

**Throws:**

- `Error`: When text is empty or less than 50 characters

### `isAIGenerated(text: string): boolean`

Quick check to determine if text is likely AI-generated.

**Parameters:**

- `text` (string): The text to analyze (minimum 50 characters required)

**Returns:**

- `boolean`: True if likely AI-generated, false otherwise

**Throws:**

- `Error`: When text is empty or less than 50 characters

### `getConfidenceScore(text: string): number`

Returns just the confidence score for the detection.

**Parameters:**

- `text` (string): The text to analyze (minimum 50 characters required)

**Returns:**

- `number`: Confidence score between 0 and 1

**Throws:**

- `Error`: When text is empty or less than 50 characters

## How It Works

This library uses multiple advanced linguistic analysis techniques to detect AI-generated text:

### Core Analysis Methods

- **Advanced Perplexity Analysis**: Enhanced trigram-based model with interpolation to measure text predictability
- **Burstiness Analysis**: Analyzes sentence-to-sentence variation and consistency patterns
- **Entropy Scoring**: Measures word choice predictability (AI tends to be more predictable)
- **Human-likeness Indicators**: Detects informal language, typos, contractions, and emotional expressions
- **Stylometric Analysis**: Examines writing style consistency and variation patterns

### Enhanced Pattern Recognition

- **Modern AI Pattern Detection**: Recognizes phrases like "it's worth noting", "as we delve into", "in today's digital age"
- **Informal Language Recognition**: Detects slang, internet abbreviations, contractions, and casual expressions
- **Emotional Tone Analysis**: Measures emotional expression variability and personal narrative styles
- **Discourse Marker Analysis**: Identifies overuse of transition words typical in AI-generated text
- **Function Word Distribution**: Analyzes patterns in common word usage that differ between AI and human writing

### Traditional Linguistic Analysis

- **Vocabulary Richness**: Examines word diversity and complexity patterns
- **Syntactic Complexity**: Analyzes sentence structure and grammatical patterns
- **Semantic Coherence**: Measures logical flow and contextual consistency
- **N-gram Repetition**: Detects repetitive patterns common in AI text
- **Contextual Consistency**: Advanced checking for semantic and thematic coherence
- **Sentence Structure Entropy**: Evaluates variety in sentence construction
- **Topic Coherence Scoring**: Measures semantic consistency across text segments

### Adaptive Intelligence

- **Dynamic Thresholding**: Adjusts detection sensitivity based on text characteristics
- **Multi-dimensional Scoring**: Combines multiple indicators with optimized weights
- **Compound Effect Analysis**: Multiple human indicators work together for better accuracy
- **Contextual Awareness**: Understands different writing contexts and styles

## Performance

- **Bundle Size**: ~15KB minified
- **Zero Dependencies**: No external libraries required
- **Fast Processing**: Analyzes typical documents in <10ms
- **Memory Efficient**: Minimal memory footprint

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+
- Node.js 14+

The library analyzes various linguistic patterns commonly found in AI-generated text:

1. **Sentence Structure**: AI text often has consistent sentence lengths and patterns
2. **Transition Words**: Heavy use of formal transition words (furthermore, moreover, etc.)
3. **Formality Level**: AI tends to use more formal vocabulary
4. **Repetitive Patterns**: Common phrases and structures used by AI models
5. **Passive Voice**: Balanced usage patterns typical of AI optimization
6. **Complexity Analysis**: Word length and complexity patterns

## Accuracy Notes

- **Enhanced Accuracy**: Version 1.0.3+ includes significant improvements in detecting both AI and human text
- **Improved Informal Text Detection**: Better recognition of casual, emotional, and conversational human writing
- **Reduced False Positives**: Significantly fewer false positives on informal human content
- **Modern AI Recognition**: Enhanced detection of contemporary AI writing patterns and phrases
- **Adaptive Analysis**: Dynamic thresholding adjusts based on text characteristics for better accuracy
- **Contextual Awareness**: Better understanding of different writing contexts and styles
- This library uses advanced heuristic analysis and pattern matching techniques
- Results should be used as a guide rather than definitive proof
- Accuracy continues to improve with each version as new AI patterns are identified
- Human-written formal text may occasionally trigger detection, but this has been significantly reduced

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see LICENSE file for details.

## Changelog

### 1.0.3 (2025-06-18)

- **Enhanced Detection**: Significantly improved accuracy for both AI and human text
- **Better Human Recognition**: Advanced detection of informal, casual, and emotional writing
- **Modern AI Patterns**: Enhanced recognition of contemporary AI writing styles
- **Advanced Metrics**: Added entropy analysis, human-likeness indicators, and stylometric analysis
- **Adaptive Thresholding**: Dynamic detection sensitivity based on text characteristics
- **Improved Algorithms**: Enhanced perplexity calculation with trigram models
- **Reduced False Positives**: Better handling of informal human content
- **Backward Compatible**: All existing APIs unchanged

### 1.0.0

- Initial release
- Basic AI text detection functionality
- Support for Node.js and browser environments
- TypeScript support
