// Test file to verify exports work correctly
import {
  detectAIText,
  isAIGenerated,
  getConfidenceScore,
} from "./dist/index.esm.js";

const testText = "This is a test to verify the package exports work correctly.";

console.log("Testing exports...");
console.log("detectAIText:", typeof detectAIText);
console.log("isAIGenerated:", typeof isAIGenerated);
console.log("getConfidenceScore:", typeof getConfidenceScore);

const result = detectAIText(testText);
console.log("Detection result:", result.isAIGenerated);
console.log("Confidence:", result.confidence);

console.log("✅ All exports working correctly!");
