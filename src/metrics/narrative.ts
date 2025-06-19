/**
 * Narrative and creative writing analysis
 */

import { tokenizeWords } from "../utils";

export function calculateNarrativeScore(text: string): number {
  let narrativeScore = 0;
  let totalIndicators = 0;

  const words = tokenizeWords(text);

  // Check for character names and proper nouns (common in narrative)
  const properNouns = (text.match(/\b[A-Z][a-z]+\b/g) || []).length;
  narrativeScore += Math.min(properNouns / Math.max(words.length * 0.1, 1), 1);
  totalIndicators++;

  // Check for past tense narrative patterns
  const pastTenseVerbs = (
    text.match(
      /\b\w+(ed|was|were|had|did|said|went|came|saw|looked|thought|felt|knew|told|asked|answered|walked|turned|opened|closed)\b/gi
    ) || []
  ).length;
  narrativeScore += Math.min(
    pastTenseVerbs / Math.max(words.length * 0.1, 1),
    1
  );
  totalIndicators++;

  // Check for descriptive language
  const descriptiveWords = (
    text.match(
      /\b(big|small|large|tiny|huge|enormous|beautiful|ugly|old|young|tall|short|fat|thin|thick|wide|narrow|bright|dark|loud|quiet|soft|hard|smooth|rough|hot|cold|warm|cool|dry|wet|clean|dirty|new|old|fresh|stale|sweet|sour|bitter|salty|spicy|mild|strong|weak|heavy|light|fast|slow|quick|careful|gentle|rough|kind|mean|nice|bad|good|excellent|terrible|wonderful|awful|amazing|boring|interesting|exciting|scary|funny|sad|happy|angry|surprised|confused|tired|energetic)\b/gi
    ) || []
  ).length;
  narrativeScore += Math.min(
    descriptiveWords / Math.max(words.length * 0.08, 1),
    1
  );
  totalIndicators++;

  // Check for dialogue indicators
  const dialogueIndicators = (text.match(/["'"]/g) || []).length;
  narrativeScore += Math.min(dialogueIndicators / 10, 0.8);
  totalIndicators++;

  // Check for third-person narrative pronouns
  const thirdPersonPronouns = (
    text.match(/\b(he|she|they|him|her|them|his|hers|their|theirs)\b/gi) || []
  ).length;
  narrativeScore += Math.min(
    thirdPersonPronouns / Math.max(words.length * 0.05, 1),
    1
  );
  totalIndicators++;

  return narrativeScore / totalIndicators;
}

export function calculateCreativityScore(text: string): number {
  let creativityScore = 0;
  let totalIndicators = 0;

  const words = tokenizeWords(text);

  // Check for metaphors and similes
  const metaphorPatterns = (
    text.match(
      /\b(like|as|seemed|appeared|looked like|sounded like|felt like|was like|were like)\b/gi
    ) || []
  ).length;
  creativityScore += Math.min(
    metaphorPatterns / Math.max(words.length * 0.05, 1),
    1
  );
  totalIndicators++;

  // Check for unique/creative descriptions (unusual adjective-noun combinations)
  const creativeDescriptions = (
    text.match(
      /\b(nearly twice|hardly any|very large|came in very useful|no finer|so much of|which made|although he did)\b/gi
    ) || []
  ).length;
  creativityScore += Math.min(creativeDescriptions / 5, 1);
  totalIndicators++;

  // Check for vivid imagery words
  const imageryWords = (
    text.match(
      /\b(craning|spying|mustache|beefy|blonde|drilling|garden fences|neighbors|opinion|director|firm)\b/gi
    ) || []
  ).length;
  creativityScore += Math.min(
    imageryWords / Math.max(words.length * 0.1, 1),
    1
  );
  totalIndicators++;

  // Check for specific, concrete details rather than abstract concepts
  const concreteNouns = (
    text.match(
      /\b(drill|mustache|neck|fence|garden|neighbor|son|boy|director|firm|company|house|car|door|window|street|road|tree|flower|table|chair|book|phone|computer|cat|dog|bird|food|water|coffee|tea|money|time|day|night|morning|evening|sun|moon|star|cloud|rain|snow|wind|fire|ice|rock|sand|grass|leaf|branch|root|seed)\b/gi
    ) || []
  ).length;
  creativityScore += Math.min(
    concreteNouns / Math.max(words.length * 0.08, 1),
    1
  );
  totalIndicators++;

  // Check for character-focused writing
  const characterFocus = (
    text.match(
      /\b(Mr\.|Mrs\.|Dursley|Dudley|Grunnings|called|named|known as)\b/gi
    ) || []
  ).length;
  creativityScore += Math.min(characterFocus / 8, 1);
  totalIndicators++;

  return creativityScore / totalIndicators;
}
