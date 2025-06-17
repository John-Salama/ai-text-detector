import {
  detectAIText,
  isAIGenerated,
  getConfidenceScore,
} from "ai-text-detector";

// Test with some sample texts
const humanText = `
Mr. and Mrs. Dursley, of number four, Privet Drive, were proud to say that they were perfectly normal, thank you very much. They were the last people you’d expect to be involved in anything strange or mysterious, because they just didn’t hold with such nonsense.

Mr. Dursley was the director of a ﬁrm called Grunnings, which made drills. He was a big, beefy man with hardly any neck, although he did have a very large mustache. Mrs. Dursley was thin and blonde and had nearly twice the usual amount of neck, which came in very useful as she spent so much of her time craning over garden fences, spying on the neighbors. The Dursleys had a small son called Dudley and in their opinion there was no ﬁner boy anywhere.`;

const aiLikeText = `
Artificial intelligence represents a transformative paradigm in modern computational frameworks. 
The integration of machine learning algorithms facilitates enhanced data processing capabilities. 
These systems demonstrate remarkable efficiency in pattern recognition tasks across diverse domains. 
Furthermore, the implementation of neural networks enables sophisticated analytical functionalities.
`;

console.log("Testing AI Text Detector\n");
console.log("=".repeat(50));

// Test 1: Human-like text
console.log("\n1. Testing human-like text:");
console.log("Text:", humanText.trim().substring(0, 100) + "...");
try {
  const result1 = detectAIText(humanText);
  console.log("Result:", {
    isAIGenerated: result1.isAIGenerated,
    confidence: `${(result1.confidence * 100).toFixed(1)}%`,
    score: result1.score.toFixed(2),
    reasons: result1.reasons.slice(0, 3), // Show first 3 reasons
  });
} catch (error) {
  console.error("Error:", error.message);
}

// Test 2: AI-like text
console.log("\n2. Testing AI-like text:");
console.log("Text:", aiLikeText.trim().substring(0, 100) + "...");
try {
  const result2 = detectAIText(aiLikeText);
  console.log("Result:", {
    isAIGenerated: result2.isAIGenerated,
    confidence: `${(result2.confidence * 100).toFixed(1)}%`,
    score: result2.score.toFixed(2),
    reasons: result2.reasons.slice(0, 3), // Show first 3 reasons
  });
} catch (error) {
  console.error("Error:", error.message);
}

// Test 3: Short text
console.log("\n3. Testing short text:");
const shortText = "Hello world!";
console.log("Text:", shortText);
try {
  const result3 = detectAIText(shortText);
  console.log("Result:", {
    isAIGenerated: result3.isAIGenerated,
    confidence: `${(result3.confidence * 100).toFixed(1)}%`,
    score: result3.score.toFixed(2),
    reasons: result3.reasons,
  });
} catch (error) {
  console.error("Error:", error.message);
}

console.log("\n" + "=".repeat(50));
console.log("Testing completed!");
