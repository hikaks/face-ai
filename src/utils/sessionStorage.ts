/**
 * Utility functions for sessionStorage operations
 */

import { SkinAnalysisData } from '@/types/analysis';

const STORAGE_KEYS = {
  ANALYSIS_RESULTS: 'skinAnalysisResults',
  ANALYSIS_TYPE: 'analysisType',
} as const;

/**
 * Save analysis results to sessionStorage
 */
export const saveAnalysisResults = (data: SkinAnalysisData): void => {
  try {
    sessionStorage.setItem(STORAGE_KEYS.ANALYSIS_RESULTS, JSON.stringify(data));
    if (data.analysisType) {
      sessionStorage.setItem(STORAGE_KEYS.ANALYSIS_TYPE, data.analysisType);
    }
  } catch (error) {
    console.error('Error saving analysis results:', error);
  }
};

/**
 * Load analysis results from sessionStorage
 */
export const loadAnalysisResults = (): SkinAnalysisData | null => {
  try {
    const storedData = sessionStorage.getItem(STORAGE_KEYS.ANALYSIS_RESULTS);
    return storedData ? JSON.parse(storedData) : null;
  } catch (error) {
    console.error('Error loading analysis results:', error);
    return null;
  }
};

/**
 * Get analysis type from sessionStorage
 */
export const getAnalysisType = (): 'basic' | 'advanced' | null => {
  try {
    const storedType = sessionStorage.getItem(STORAGE_KEYS.ANALYSIS_TYPE);
    return storedType as 'basic' | 'advanced' | null;
  } catch (error) {
    console.error('Error loading analysis type:', error);
    return null;
  }
};

/**
 * Clear all analysis data from sessionStorage
 */
export const clearAnalysisData = (): void => {
  try {
    sessionStorage.removeItem(STORAGE_KEYS.ANALYSIS_RESULTS);
    sessionStorage.removeItem(STORAGE_KEYS.ANALYSIS_TYPE);
  } catch (error) {
    console.error('Error clearing analysis data:', error);
  }
};

/**
 * Check if analysis data exists in sessionStorage
 */
export const hasAnalysisData = (): boolean => {
  return sessionStorage.getItem(STORAGE_KEYS.ANALYSIS_RESULTS) !== null;
};

/**
 * Detect analysis type based on data structure
 */
export const detectAnalysisType = (data: SkinAnalysisData): 'basic' | 'advanced' => {
  // Check if analysisType is explicitly set
  if (data.analysisType) {
    return data.analysisType;
  }

  // Check for advanced analysis indicators
  const hasSkinAnalysis = !!data.skinAnalysis;
  const hasDetailedSkinData = data.analysisResults?.skin && 
    Object.keys(data.analysisResults.skin).length > 5;
  const hasDetailedResult = data.result && 
    typeof data.result === 'object' && 
    Object.keys(data.result).length > 4;

  return (hasSkinAnalysis || hasDetailedSkinData || hasDetailedResult) ? 'advanced' : 'basic';
};
