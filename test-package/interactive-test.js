import { detectAIText, isAIGenerated, getConfidenceScore, getPerplexityScore, getBurstinessScore } from 'ai-text-detector';
import readline from 'readline';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log('🤖 AI Text Detector - Interactive Testing Tool');
console.log('='.repeat(50));
console.log('Enter text to analyze (type "exit" to quit):\n');

function analyzeText(text) {
    if (text.toLowerCase() === 'exit') {
        console.log('Goodbye! 👋');
        rl.close();
        return;
    }

    if (text.trim().length < 50) {
        console.log('❌ Text too short for reliable analysis (minimum 50 characters)\n');
        promptUser();
        return;
    }

    try {
        const result = detectAIText(text);
        
        console.log('\n📊 Analysis Results:');
        console.log('─'.repeat(30));
        console.log(`🎯 AI Generated: ${result.isAIGenerated ? '✅ YES' : '❌ NO'}`);
        console.log(`📈 Confidence: ${(result.confidence * 100).toFixed(1)}%`);
        console.log(`⚡ Overall Score: ${result.score.toFixed(2)}`);
        console.log(`🧠 Perplexity Score: ${result.perplexityScore.toFixed(2)}`);
        console.log(`📝 Burstiness Score: ${result.burstinessScore.toFixed(2)}`);
        
        if (result.reasons.length > 0) {
            console.log('\n💡 Key Indicators:');
            result.reasons.forEach((reason, index) => {
                console.log(`   ${index + 1}. ${reason}`);
            });
        }
        
        console.log('\n' + '='.repeat(50));
        
    } catch (error) {
        console.log(`❌ Error: ${error.message}\n`);
    }
    
    promptUser();
}

function promptUser() {
    rl.question('Enter text to analyze: ', analyzeText);
}

// Start the interactive session
promptUser();
