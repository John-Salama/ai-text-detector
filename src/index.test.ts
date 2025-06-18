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

  test("should better detect informal human text with new improvements", () => {
    const informalHumanText = `OMG, so I was at this coffee shop today and the barista was super weird lol. Like, she kept staring at me while making my latte and I'm thinking "wtf is happening here?" 😅 Anyway, turns out she recognized me from high school! Small world, right? We ended up chatting for like 20 mins about old times. Crazy how life works sometimes... btw, the coffee was amazing too! 10/10 would recommend.`;

    const result = detectAIText(informalHumanText);
    expect(result.isAIGenerated).toBe(false);
    expect(result.confidence).toBeLessThan(0.5); // Should be much lower now
    expect(
      result.reasons.some(
        (reason) => reason.includes("informal") || reason.includes("human")
      )
    ).toBe(true);
  });

  test("should detect modern AI text patterns better", () => {
    const modernAIText = `It's worth noting that artificial intelligence has fundamentally transformed the landscape of modern technology. As we delve into this fascinating topic, it's clear that AI systems demonstrate remarkable capabilities across various domains. In today's digital age, these cutting-edge solutions revolutionize traditional methodologies and streamline operational processes. Stakeholders can leverage the power of these innovative frameworks to unlock significant benefits and harness their full potential. The comprehensive approach ensures optimal value proposition while maintaining synergistic relationships between end-users and technological infrastructure.`;

    const result = detectAIText(modernAIText);
    expect(result.isAIGenerated).toBe(true);
    expect(result.confidence).toBeGreaterThan(0.7);
    expect(
      result.reasons.some(
        (reason) =>
          reason.includes("discourse marker") || reason.includes("formality")
      )
    ).toBe(true);
  });

  test("should handle emotional human text correctly", () => {
    const emotionalText = `I'm SO frustrated right now!!! My boss is being absolutely ridiculous and I can't handle this anymore. I love my job usually, but today was AWFUL. Had to deal with three angry customers, my computer crashed twice, and then my lunch got stolen from the office fridge. I'm feeling pretty defeated tbh. Some days you just wanna scream, you know? Tomorrow HAS to be better... it just has to be. 😭`;

    const result = detectAIText(emotionalText);
    expect(result.isAIGenerated).toBe(false);
    expect(result.confidence).toBeLessThan(0.4);
    expect(
      result.reasons.some(
        (reason) => reason.includes("emotional") || reason.includes("human")
      )
    ).toBe(true);
  });

  test("should provide more detailed analysis reasons", () => {
    const testText = `The comprehensive methodology utilized in this analysis demonstrates significant potential for enhancing operational efficiency. Furthermore, the systematic implementation of these innovative frameworks facilitates improved organizational workflows and establishes robust foundations for future development initiatives.`;

    const result = detectAIText(testText);
    expect(result.reasons.length).toBeGreaterThan(3);
    expect(
      result.reasons.some(
        (reason) =>
          reason.includes("entropy") || reason.includes("human-likeness")
      )
    ).toBe(true);
  });

  test("should handle mixed formal and informal text", () => {
    const mixedText = `The research methodology employed in this study is pretty solid, ngl. We used random sampling techniques to minimize bias, which is standard practice. But honestly? The results were way more interesting than I expected! The data shows significant correlations between variables, and I'm excited to see where this leads. It's gonna be a game-changer for sure.`;

    const result = detectAIText(mixedText);
    // Should lean towards human due to informal elements
    expect(result.confidence).toBeLessThan(0.65);
  });
});
