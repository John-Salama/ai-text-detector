import {
  detectAIText,
  isAIGenerated,
  getConfidenceScore,
  getPerplexityScore,
  getBurstinessScore,
} from "./index";

describe("Advanced AI Text Detector", () => {
  // Real human text samples - authentic, unpolished, with natural imperfections
  const realHumanTexts = {
    casualConversation: `honestly idk what's wrong with me lately. keep procrastinating on everything and then stress about it later. like yesterday i had this assignment due and instead of working on it i spent 3 hours watching tiktoks about cats?? make it make sense. my brain is literally broken i swear. anyway finally got it done at 2am and it's probably garbage but whatever. at least i submitted something. coffee is my best friend rn`,

    personalStory: `So this is gonna sound crazy but I think my neighbor might be a serial killer. Hear me out - he's always getting packages at weird hours, never talks to anyone, and I swear I heard screaming from his apartment last week. My roommate thinks I'm being paranoid but like... what if I'm right? Should I call the cops? Or am I just watching too much true crime? This is keeping me up at night ngl`,

    workRant: `My manager is the absolute WORST. Today she scheduled a "quick 15-minute standup" that lasted 2 hours. TWO HOURS! Then she had the audacity to ask why I didn't finish my tasks. Like girl, maybe because you had me in a meeting talking about synergy and ideation for half the day? I'm updating my resume tonight. This place is toxic af and I'm done.`,

    academicHuman: `The results of our longitudinal study were... well, let's just say unexpected. We hypothesized that increased social media usage would correlate with decreased academic performance, but the data tells a different story. Students who used Instagram and TikTok for 2+ hours daily actually showed marginal improvements in certain cognitive areas. I'm not sure if we messed up the methodology or if Gen Z is just built different. Need to run this by my advisor before we publish anything.`,

    emotionalPost: `I can't stop crying. My dog died yesterday and I feel like my heart has been ripped out. He was only 6 years old and the vet said it was sudden heart failure. No warning signs, nothing. One day he's running around chasing squirrels and the next day he's gone. I keep expecting him to come running when I open the door. The house feels so empty without his stupid barking at the mailman. I don't know how to process this.`,
  };

  // AI-generated text samples from different models
  const aiGeneratedTexts = {
    gpt4Sample: `Artificial intelligence has emerged as a transformative force in contemporary society, fundamentally reshaping how we approach complex challenges across diverse domains. The integration of machine learning algorithms into various sectors has demonstrated remarkable potential for enhancing operational efficiency and decision-making processes. Furthermore, the systematic implementation of AI-driven solutions facilitates improved organizational workflows while establishing robust frameworks for sustainable growth. It is important to note that these technological advancements represent significant opportunities for stakeholders to leverage innovative capabilities and unlock considerable value propositions in an increasingly competitive landscape.`,

    claudeSample: `When examining the multifaceted implications of digital transformation, we must consider the comprehensive approach required to navigate this evolving technological landscape. The strategic implementation of advanced analytical frameworks enables organizations to harness the full potential of data-driven insights. Moreover, the systematic integration of innovative methodologies facilitates enhanced operational excellence and sustainable competitive advantages. It's worth noting that these developments underscore the critical importance of adaptive leadership in fostering collaborative environments that promote continuous improvement and strategic alignment across all organizational levels.`,

    geminiSample: `The paradigm shift toward sustainable technologies represents a fundamental transformation in how we conceptualize environmental stewardship and economic development. Through the lens of comprehensive analysis, it becomes evident that the systematic adoption of renewable energy solutions facilitates significant improvements in both ecological preservation and operational efficiency. Furthermore, the strategic implementation of green infrastructure initiatives demonstrates considerable potential for establishing resilient frameworks that support long-term sustainability objectives while creating meaningful value for diverse stakeholder communities.`,

    modernAI: `In today's rapidly evolving digital ecosystem, organizations must embrace comprehensive strategies that leverage cutting-edge technologies to drive innovation and maintain competitive advantages. The strategic implementation of AI-powered solutions enables stakeholders to optimize operational workflows while simultaneously enhancing customer experiences through personalized, data-driven approaches. Furthermore, these technological advancements facilitate seamless integration across multiple touchpoints, creating synergistic relationships that unlock significant value propositions and establish robust foundations for sustainable growth in an increasingly complex marketplace.`,
  };
  describe("Human Text Detection", () => {
    test("should correctly identify casual human conversation", () => {
      const result = detectAIText(realHumanTexts.casualConversation);
      expect(result.isAIGenerated).toBe(false);
      expect(result.confidence).toBeLessThan(0.65);
      expect(result.perplexityScore).toBeGreaterThan(0);
      expect(typeof result.burstinessScore).toBe("number");
    });

    test("should correctly identify personal human storytelling", () => {
      const result = detectAIText(realHumanTexts.personalStory);
      expect(result.isAIGenerated).toBe(false);
      expect(result.confidence).toBeLessThan(0.65);
      expect(result.reasons).toEqual(
        expect.arrayContaining([expect.stringMatching(/human/i)])
      );
    });

    test("should correctly identify emotional human rant", () => {
      const result = detectAIText(realHumanTexts.workRant);
      expect(result.isAIGenerated).toBe(false);
      expect(result.confidence).toBeLessThan(0.65);
      expect(typeof result.burstinessScore).toBe("number");
    });

    test("should handle academic human writing", () => {
      const result = detectAIText(realHumanTexts.academicHuman);
      expect(result.isAIGenerated).toBe(false);
      expect(result.confidence).toBeLessThan(0.8); // Might be higher due to formal tone
      expect(result.perplexityScore).toBeGreaterThan(0);
    });

    test("should correctly identify deeply emotional human text", () => {
      const result = detectAIText(realHumanTexts.emotionalPost);
      expect(result.isAIGenerated).toBe(false);
      expect(result.confidence).toBeLessThan(0.65);
      expect(result.reasons).toEqual(
        expect.arrayContaining([
          expect.stringMatching(/human|variation|entropy/i),
        ])
      );
    });
  });
  describe("GPT-4 Detection", () => {
    test("should detect GPT-4 generated text", () => {
      const result = detectAIText(aiGeneratedTexts.gpt4Sample);
      expect(result.isAIGenerated).toBe(true);
      expect(result.confidence).toBeGreaterThan(0.65);
      expect(result.perplexityScore).toBeGreaterThan(0);
      expect(typeof result.burstinessScore).toBe("number");
    });

    test("should identify GPT-4 AI patterns", () => {
      const result = detectAIText(aiGeneratedTexts.gpt4Sample);
      expect(result.reasons).toEqual(
        expect.arrayContaining([
          expect.stringMatching(/AI|burstiness|discourse/i),
        ])
      );
      expect(result.reasons.length).toBeGreaterThan(3);
    });
  });
  describe("Claude Detection", () => {
    test("should detect Claude generated text", () => {
      const result = detectAIText(aiGeneratedTexts.claudeSample);
      expect(result.isAIGenerated).toBe(true);
      expect(result.confidence).toBeGreaterThan(0.65);
      expect(result.perplexityScore).toBeGreaterThan(0);
    });

    test("should identify Claude AI patterns", () => {
      const result = detectAIText(aiGeneratedTexts.claudeSample);
      expect(result.reasons).toEqual(
        expect.arrayContaining([
          expect.stringMatching(/AI|burstiness|discourse|formal/i),
        ])
      );
      expect(result.score).toBeGreaterThan(0.65);
    });
  });
  describe("Gemini Detection", () => {
    test("should detect Gemini generated text", () => {
      const result = detectAIText(aiGeneratedTexts.geminiSample);
      expect(result.isAIGenerated).toBe(true);
      expect(result.confidence).toBeGreaterThan(0.65);
      expect(result.perplexityScore).toBeGreaterThan(0);
    });

    test("should identify Gemini AI patterns", () => {
      const result = detectAIText(aiGeneratedTexts.geminiSample);
      expect(result.reasons).toEqual(
        expect.arrayContaining([
          expect.stringMatching(/AI|burstiness|discourse/i),
        ])
      );
      expect(typeof result.burstinessScore).toBe("number");
    });
  });
  describe("Cross-Model AI Detection", () => {
    test("should detect modern AI text with typical patterns", () => {
      const result = detectAIText(aiGeneratedTexts.modernAI);
      expect(result.isAIGenerated).toBe(true);
      expect(result.confidence).toBeGreaterThan(0.65);
      expect(result.reasons).toEqual(
        expect.arrayContaining([expect.stringMatching(/AI|formal|discourse/i)])
      );
    });

    test("should consistently flag AI across different models", () => {
      const results = [
        detectAIText(aiGeneratedTexts.gpt4Sample),
        detectAIText(aiGeneratedTexts.claudeSample),
        detectAIText(aiGeneratedTexts.geminiSample),
        detectAIText(aiGeneratedTexts.modernAI),
      ];

      results.forEach((result) => {
        expect(result.isAIGenerated).toBe(true);
        expect(result.confidence).toBeGreaterThan(0.65);
        expect(result.perplexityScore).toBeGreaterThan(0);
      });
    });
  });

  describe("Function API Tests", () => {
    test("should return boolean for isAIGenerated function", () => {
      expect(typeof isAIGenerated(realHumanTexts.casualConversation)).toBe(
        "boolean"
      );
      expect(typeof isAIGenerated(aiGeneratedTexts.gpt4Sample)).toBe("boolean");
      expect(isAIGenerated(realHumanTexts.casualConversation)).toBe(false);
      expect(isAIGenerated(aiGeneratedTexts.gpt4Sample)).toBe(true);
    });

    test("should return confidence score between 0 and 1", () => {
      const humanScore = getConfidenceScore(realHumanTexts.emotionalPost);
      const aiScore = getConfidenceScore(aiGeneratedTexts.claudeSample);

      expect(humanScore).toBeGreaterThanOrEqual(0);
      expect(humanScore).toBeLessThanOrEqual(1);
      expect(aiScore).toBeGreaterThanOrEqual(0);
      expect(aiScore).toBeLessThanOrEqual(1);
      expect(aiScore).toBeGreaterThan(humanScore);
    });

    test("should return valid perplexity scores", () => {
      const humanPerplexity = getPerplexityScore(realHumanTexts.personalStory);
      const aiPerplexity = getPerplexityScore(aiGeneratedTexts.geminiSample);

      expect(typeof humanPerplexity).toBe("number");
      expect(typeof aiPerplexity).toBe("number");
      expect(humanPerplexity).toBeGreaterThan(0);
      expect(aiPerplexity).toBeGreaterThan(0);
      expect(humanPerplexity).toBeGreaterThan(aiPerplexity);
    });

    test("should return valid burstiness scores", () => {
      const humanBurstiness = getBurstinessScore(realHumanTexts.workRant);
      const aiBurstiness = getBurstinessScore(aiGeneratedTexts.modernAI);

      expect(typeof humanBurstiness).toBe("number");
      expect(typeof aiBurstiness).toBe("number");
      expect(humanBurstiness).toBeGreaterThan(aiBurstiness);
    });
  });

  describe("Edge Cases and Error Handling", () => {
    test("should throw error for empty text", () => {
      expect(() => detectAIText("")).toThrow("Text cannot be empty");
      expect(() => detectAIText("   ")).toThrow("Text cannot be empty");
      expect(() => detectAIText("\n\t")).toThrow("Text cannot be empty");
    });

    test("should throw error for very short text", () => {
      expect(() => detectAIText("Short.")).toThrow(
        "Text too short for reliable analysis"
      );
      expect(() => detectAIText("Hi there")).toThrow(
        "Text too short for reliable analysis"
      );
    });

    test("should handle medium-length text", () => {
      const mediumText =
        "This is a medium-length text that should be long enough for analysis but not too complex to handle properly. It contains multiple sentences.";
      const result = detectAIText(mediumText);

      expect(result).toHaveProperty("isAIGenerated");
      expect(result).toHaveProperty("confidence");
      expect(result).toHaveProperty("reasons");
      expect(result).toHaveProperty("score");
      expect(result).toHaveProperty("perplexityScore");
      expect(result).toHaveProperty("burstinessScore");
    });

    test("should handle text with special characters and emojis", () => {
      const specialText =
        "OMG this is so crazy!!! 😱 I can't believe what happened today... like seriously?? My mind = blown 🤯 #NoWayThisIsReal";
      const result = detectAIText(specialText);

      expect(result.isAIGenerated).toBe(false);
      expect(result.confidence).toBeLessThan(0.5);
    });
  });
  describe("Comparative Analysis", () => {
    test("should show clear distinction between human and AI confidence scores", () => {
      const humanResults = Object.values(realHumanTexts).map((text) =>
        detectAIText(text)
      );
      const aiResults = Object.values(aiGeneratedTexts).map((text) =>
        detectAIText(text)
      );

      const avgHumanConfidence =
        humanResults.reduce((sum, result) => sum + result.confidence, 0) /
        humanResults.length;
      const avgAIConfidence =
        aiResults.reduce((sum, result) => sum + result.confidence, 0) /
        aiResults.length;

      expect(avgAIConfidence).toBeGreaterThan(avgHumanConfidence);
    });

    test("should show perplexity score differences", () => {
      const humanPerplexity = Object.values(realHumanTexts).map((text) =>
        getPerplexityScore(text)
      );
      const aiPerplexity = Object.values(aiGeneratedTexts).map((text) =>
        getPerplexityScore(text)
      );

      const avgHumanPerplexity =
        humanPerplexity.reduce((sum, score) => sum + score, 0) /
        humanPerplexity.length;
      const avgAIPerplexity =
        aiPerplexity.reduce((sum, score) => sum + score, 0) /
        aiPerplexity.length;

      expect(avgHumanPerplexity).toBeGreaterThan(0);
      expect(avgAIPerplexity).toBeGreaterThan(0);
    });
  });
});
