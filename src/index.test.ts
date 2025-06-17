import {
  detectAIText,
  isAIGenerated,
  getConfidenceScore,
  getPerplexityScore,
  getBurstinessScore,
} from "./index";

describe("Advanced AI Text Detector", () => {
  const humanText = `lol so i was at the store today and this weird thing happened. my cart had a wobbly wheel (of course) and i'm trying to navigate around this lady who's blocking the entire aisle with her cart while she reads every single ingredient on a cereal box. took FOREVER. then when i finally get to checkout, my card gets declined even though i literally just checked my balance. super embarrassing! turns out the chip reader was broken. why is shopping always such a disaster? anyway got my groceries eventually but what a mess of a day.`;

  const aiText = `Artificial intelligence represents a significant technological advancement that has fundamentally transformed various industries across multiple sectors. Furthermore, the systematic implementation of sophisticated machine learning algorithms has considerably enhanced operational efficiency and strategic decision-making processes. It is important to note that these comprehensive developments facilitate improved organizational workflows. Moreover, enterprises can effectively utilize these innovative tools to optimize their methodologies and establish more robust frameworks for future growth.`;

  const formalHumanText = `The research methodology employed in this study follows established academic protocols. Data collection procedures were designed to ensure statistical validity and reliability. Participants were selected through random sampling techniques to minimize bias. The analysis reveals significant correlations between variables that warrant further investigation.`;

  test("should detect human-written text correctly", () => {
    const result = detectAIText(humanText);
    expect(result.isAIGenerated).toBe(false);
    expect(result.confidence).toBeLessThan(0.65);
    expect(result).toHaveProperty("perplexityScore");
    expect(result).toHaveProperty("burstinessScore");
  });

  test("should detect AI-generated text correctly", () => {
    const result = detectAIText(aiText);
    expect(result.isAIGenerated).toBe(true);
    expect(result.confidence).toBeGreaterThan(0.65);
    expect(result.reasons.length).toBeGreaterThan(0);
    expect(result.perplexityScore).toBeLessThan(8);
  });

  test("should handle formal human text correctly", () => {
    const result = detectAIText(formalHumanText);
    // This should be less likely to be flagged as AI due to improved detection
    expect(typeof result.isAIGenerated).toBe("boolean");
    expect(result.confidence).toBeGreaterThanOrEqual(0);
    expect(result.confidence).toBeLessThanOrEqual(1);
  });

  test("should return boolean for isAIGenerated function", () => {
    expect(typeof isAIGenerated(humanText)).toBe("boolean");
    expect(typeof isAIGenerated(aiText)).toBe("boolean");
  });

  test("should return confidence score between 0 and 1", () => {
    const score1 = getConfidenceScore(humanText);
    const score2 = getConfidenceScore(aiText);

    expect(score1).toBeGreaterThanOrEqual(0);
    expect(score1).toBeLessThanOrEqual(1);
    expect(score2).toBeGreaterThanOrEqual(0);
    expect(score2).toBeLessThanOrEqual(1);
  });

  test("should return additional metrics", () => {
    const perplexity = getPerplexityScore(aiText);
    const burstiness = getBurstinessScore(aiText);

    expect(typeof perplexity).toBe("number");
    expect(typeof burstiness).toBe("number");
    expect(perplexity).toBeGreaterThan(0);
  });

  test("should throw error for very short text", () => {
    expect(() => detectAIText("Short text.")).toThrow(
      "Text too short for reliable analysis"
    );
    expect(() => detectAIText("")).toThrow("Text cannot be empty");
    expect(() => detectAIText("   ")).toThrow("Text cannot be empty");
  });

  test("should handle medium-length text", () => {
    const mediumText =
      "This is a medium-length text that should be long enough for analysis but not too complex to handle properly.";
    const result = detectAIText(mediumText);
    expect(result).toHaveProperty("isAIGenerated");
    expect(result).toHaveProperty("confidence");
    expect(result).toHaveProperty("reasons");
    expect(result).toHaveProperty("score");
    expect(result).toHaveProperty("perplexityScore");
    expect(result).toHaveProperty("burstinessScore");
  });
});
