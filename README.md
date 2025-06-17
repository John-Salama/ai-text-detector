# AI Text Detector

[![npm version](https://badge.fury.io/js/ai-text-detector.svg)](https://www.npmjs.com/package/ai-text-detector)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)

A lightweight, fast JavaScript/TypeScript library for detecting AI-generated text using advanced linguistic analysis. Works in both Node.js and browser environments with zero dependencies.

## Features

- 🚀 **Lightweight** - Zero external dependencies, small bundle size
- 🔍 **Accurate** - Uses 15+ linguistic analysis techniques including perplexity and burstiness
- 🌐 **Universal** - Works in Node.js, React, Vue, Angular, and browser environments
- 📝 **TypeScript** - Full TypeScript support with comprehensive type definitions
- ⚡ **Fast** - Efficient pattern matching and analysis algorithms
- 🧠 **Smart** - Advanced analysis of sentence structure, vocabulary patterns, and writing style
- 📊 **Detailed** - Provides confidence scores, reasoning, and detailed metrics

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

const text =
  "Furthermore, it is important to note that artificial intelligence has significantly enhanced various operational processes across multiple industries.";

// Get detailed analysis
const result = detectAIText(text);
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

// Quick boolean check
const isAI = isAIGenerated(text);
console.log(isAI); // true

// Get just the confidence score
const confidence = getConfidenceScore(text);
console.log(confidence); // 0.75
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

- `text` (string): The text to analyze

**Returns:**

- `DetectionResult` object with the following properties:
  - `isAIGenerated` (boolean): Whether the text is likely AI-generated
  - `confidence` (number): Confidence score between 0 and 1
  - `reasons` (string[]): Array of reasons explaining the detection
  - `score` (number): Raw detection score

### `isAIGenerated(text: string): boolean`

Quick check to determine if text is likely AI-generated.

**Parameters:**

- `text` (string): The text to analyze

**Returns:**

- `boolean`: True if likely AI-generated, false otherwise

### `getConfidenceScore(text: string): number`

Returns just the confidence score for the detection.

**Parameters:**

- `text` (string): The text to analyze

**Returns:**

- `number`: Confidence score between 0 and 1

## API Reference

### `detectAIText(text: string): DetectionResult`

Analyzes the provided text and returns a comprehensive detection result.

**Parameters:**

- `text` (string): The text to analyze

**Returns:** `DetectionResult` object with the following properties:

- `isAIGenerated` (boolean): Whether the text is likely AI-generated
- `confidence` (number): Confidence score between 0 and 1
- `reasons` (string[]): Array of reasons for the detection result
- `score` (number): Overall AI detection score
- `perplexityScore` (number): Perplexity analysis score
- `burstinessScore` (number): Burstiness analysis score

### `isAIGenerated(text: string): boolean`

Quick check to determine if text is AI-generated.

**Parameters:**

- `text` (string): The text to analyze

**Returns:** Boolean indicating if the text is likely AI-generated

### `getConfidenceScore(text: string): number`

Returns the confidence score for AI detection.

**Parameters:**

- `text` (string): The text to analyze

**Returns:** Number between 0 and 1 representing confidence

### `getPerplexityScore(text: string): number`

Returns the perplexity score of the text.

**Parameters:**

- `text` (string): The text to analyze

**Returns:** Number representing perplexity (lower = more AI-like)

### `getBurstinessScore(text: string): number`

Returns the burstiness score of the text.

**Parameters:**

- `text` (string): The text to analyze

**Returns:** Number representing burstiness (lower = more AI-like)

## How It Works

This library uses multiple linguistic analysis techniques to detect AI-generated text:

- **Perplexity Analysis**: Measures how predictable the text is
- **Burstiness Analysis**: Analyzes sentence-to-sentence variation
- **Vocabulary Richness**: Examines word diversity and complexity
- **Syntactic Complexity**: Analyzes sentence structure patterns
- **Semantic Coherence**: Measures logical flow and consistency
- **N-gram Repetition**: Detects repetitive patterns common in AI text
- **Transition Word Usage**: Analyzes overuse of connecting words
- **Formality Index**: Measures writing formality level
- **Contextual Consistency**: Checks for contextual coherence

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

- This library uses heuristic analysis and pattern matching
- It's designed to catch common AI writing patterns but may not detect all AI-generated content
- Results should be used as a guide rather than definitive proof
- Accuracy may vary depending on the AI model that generated the text
- Human-written text with formal writing styles might sometimes trigger false positives

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see LICENSE file for details.

## Changelog

### 1.0.0

- Initial release
- Basic AI text detection functionality
- Support for Node.js and browser environments
- TypeScript support
