// CommonJS version for Node.js environments that don't support ES modules
const importAIDetector = async () => {
    const { detectAIText, isAIGenerated, getConfidenceScore } = await import('ai-text-detector');
    return { detectAIText, isAIGenerated, getConfidenceScore };
};

// Test function
async function runTests() {
    try {
        const { detectAIText, isAIGenerated, getConfidenceScore } = await importAIDetector();

        // Test with some sample texts
        const humanText = `
        I love going to the beach on weekends. The waves are so relaxing, and I enjoy collecting seashells. 
        Sometimes I bring a book and read under the shade of an umbrella. Last weekend, I saw dolphins 
        swimming near the shore, which made my day absolutely perfect!
        `;

        const aiLikeText = `
        Artificial intelligence represents a transformative paradigm in modern computational frameworks. 
        The integration of machine learning algorithms facilitates enhanced data processing capabilities. 
        These systems demonstrate remarkable efficiency in pattern recognition tasks across diverse domains. 
        Furthermore, the implementation of neural networks enables sophisticated analytical functionalities.
        `;

        console.log('Testing AI Text Detector (CommonJS version)\n');
        console.log('='.repeat(50));

        // Test 1: Human-like text
        console.log('\n1. Testing human-like text:');
        console.log('Text:', humanText.trim().substring(0, 100) + '...');
        const result1 = detectAIText(humanText);
        console.log('Is AI Generated:', isAIGenerated(humanText));
        console.log('Confidence Score:', (getConfidenceScore(humanText) * 100).toFixed(1) + '%');
        console.log('Full Result:', {
            isAIGenerated: result1.isAIGenerated,
            confidence: `${(result1.confidence * 100).toFixed(1)}%`,
            score: result1.score.toFixed(2),
            reasons: result1.reasons.slice(0, 3)
        });

        // Test 2: AI-like text
        console.log('\n2. Testing AI-like text:');
        console.log('Text:', aiLikeText.trim().substring(0, 100) + '...');
        const result2 = detectAIText(aiLikeText);
        console.log('Is AI Generated:', isAIGenerated(aiLikeText));
        console.log('Confidence Score:', (getConfidenceScore(aiLikeText) * 100).toFixed(1) + '%');
        console.log('Full Result:', {
            isAIGenerated: result2.isAIGenerated,
            confidence: `${(result2.confidence * 100).toFixed(1)}%`,
            score: result2.score.toFixed(2),
            reasons: result2.reasons.slice(0, 3)
        });

        console.log('\n' + '='.repeat(50));
        console.log('Testing completed!');

    } catch (error) {
        console.error('Error running tests:', error.message);
    }
}

// Run the tests
runTests();
