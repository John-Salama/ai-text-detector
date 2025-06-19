/**
 * Main AI Text Detector class
 */
import { DetectionResult } from './types';
export declare class AITextDetector {
    detectAIText(text: string): DetectionResult;
    private analyzeText;
    private calculateAdvancedAIScore;
    private applyAdaptiveThresholding;
    private generateDetailedReasons;
}
