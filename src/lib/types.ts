/**
 * Types for comprehensive face analysis data structure
 * This matches the structure outlined in QWEN.md specification
 */

// Skin analysis data structure
export interface SkinAnalysisData {
  health: number;
  acne: number;
  stain: number;
  dark_circle: number;
  wrinkle: number;
  eye_pouch?: number;
  forehead_wrinkle?: number;
  crows_feet?: number;
  eye_finelines?: number;
  glabella_wrinkle?: number;
  nasolabial_fold?: number;
  pores_forehead?: number;
  pores_left_cheek?: number;
  pores_right_cheek?: number;
  pores_jaw?: number;
  blackhead?: number;
  mole?: number;
  skin_spot?: number;
  skin_type?: number;
}

// Demographic data structure
export interface DemographicsData {
  age?: number;
  gender?: string;
}

// Emotion analysis data structure
export interface EmotionData {
  anger?: number;
  disgust?: number;
  fear?: number;
  happiness?: number;
  neutral?: number;
  sadness?: number;
  surprise?: number;
}

// Beauty score data structure
export interface BeautyData {
  male_score?: number;
  female_score?: number;
}

// Comprehensive analysis results structure
export interface AnalysisResults {
  skin: SkinAnalysisData;
  skinAnalyze?: SkinAnalyzeResponse;
  demographics: DemographicsData;
  emotion: EmotionData;
  beauty: BeautyData;
  warning?: string[];
  quality_tips?: string[];
}

// Complete session storage data structure
export interface SessionStorageData {
  timestamp: string;
  imageData?: string;
  analysisResults: AnalysisResults;
  recommendations?: string[];
}

// Face++ API response structure for skin status
export interface FacePlusPlusSkinStatus {
  left_eyelids?: {
    value: string;
    confidence: number;
  };
  right_eyelids?: {
    value: string;
    confidence: number;
  };
  eye_pouch?: {
    value: string;
    confidence: number;
  };
  dark_circle?: {
    value: string;
    confidence: number;
  };
  forehead_wrinkle?: {
    value: string;
    confidence: number;
  };
  crows_feet?: {
    value: string;
    confidence: number;
  };
  eye_finelines?: {
    value: string;
    confidence: number;
  };
  glabella_wrinkle?: {
    value: string;
    confidence: number;
  };
  nasolabial_fold?: {
    value: string;
    confidence: number;
  };
  skin_type?: number;
  details?: {
    "0": {
      value: number;
      confidence: number;
    };
    "1": {
      value: number;
      confidence: number;
    };
    "2": {
      value: number;
      confidence: number;
    };
    "3": {
      value: number;
      confidence: number;
    };
  };
  pores_forehead?: {
    value: string;
    confidence: number;
  };
  pores_left_cheek?: {
    value: string;
    confidence: number;
  };
  pores_right_cheek?: {
    value: string;
    confidence: number;
  };
  pores_jaw?: {
    value: string;
    confidence: number;
  };
  blackhead?: {
    value: string;
    confidence: number;
  };
  acne?: {
    value: number;
    confidence: number;
  };
  mole?: {
    value: number;
    confidence: number;
  };
  skin_spot?: {
    value: number;
    confidence: number;
  };
}

// Face++ API attributes structure
export interface FacePlusPlusAttributes {
  gender?: {
    value: string;
  };
  age?: {
    value: number;
  };
  emotion?: EmotionData;
  beauty?: BeautyData;
  headpose?: {
    roll_angle: number;
    yaw_angle: number;
    pitch_angle: number;
  };
  // Add other attribute types as needed
}

// Face++ API face structure
export interface FacePlusPlusFace {
  attributes?: FacePlusPlusAttributes;
  face_rectangle?: {
    top: number;
    left: number;
    width: number;
    height: number;
  };
  face_token?: string;
}

// Face++ API response structure
export interface FacePlusPlusResponse {
  faces?: FacePlusPlusFace[];
  request_id?: string;
  time_used?: number;
  error_message?: string;
  warning?: string[];
  quality_tips?: string[];
}

// Face++ Skin Analyze API specific types
export interface SkinAnalyzeValue {
  value: string | number;
  confidence: number;
}

export interface SkinAnalyzeResult {
  left_eyelids?: SkinAnalyzeValue;
  right_eyelids?: SkinAnalyzeValue;
  eye_pouch?: SkinAnalyzeValue;
  dark_circle?: SkinAnalyzeValue;
  forehead_wrinkle?: SkinAnalyzeValue;
  crows_feet?: SkinAnalyzeValue;
  eye_finelines?: SkinAnalyzeValue;
  glabella_wrinkle?: SkinAnalyzeValue;
  nasolabial_fold?: SkinAnalyzeValue;
  pores_forehead?: SkinAnalyzeValue;
  pores_left_cheek?: SkinAnalyzeValue;
  pores_right_cheek?: SkinAnalyzeValue;
  pores_jaw?: SkinAnalyzeValue;
  blackhead?: SkinAnalyzeValue;
  acne?: SkinAnalyzeValue;
  mole?: SkinAnalyzeValue;
  skin_spot?: SkinAnalyzeValue;
  skin_type?: SkinAnalyzeValue;
}

export interface SkinAnalyzeCategories {
  eyelids: {
    left_eyelids?: SkinAnalyzeResult;
    right_eyelids?: SkinAnalyzeResult;
  };
  eyeArea: {
    eye_pouch?: SkinAnalyzeResult;
    dark_circle?: SkinAnalyzeResult;
  };
  wrinkles: {
    forehead_wrinkle?: SkinAnalyzeResult;
    crows_feet?: SkinAnalyzeResult;
    eye_finelines?: SkinAnalyzeResult;
    glabella_wrinkle?: SkinAnalyzeResult;
    nasolabial_fold?: SkinAnalyzeResult;
  };
  pores: {
    pores_forehead?: SkinAnalyzeResult;
    pores_left_cheek?: SkinAnalyzeResult;
    pores_right_cheek?: SkinAnalyzeResult;
    pores_jaw?: SkinAnalyzeResult;
  };
  skinIssues: {
    blackhead?: SkinAnalyzeResult;
    acne?: SkinAnalyzeResult;
    mole?: SkinAnalyzeResult;
    skin_spot?: SkinAnalyzeResult;
  };
  skinType?: SkinAnalyzeResult;
}

export interface SkinAnalyzeResponse {
  request_id?: string;
  result?: SkinAnalyzeResult[];
  warning?: string[];
  face_rectangle?: {
    top: number;
    left: number;
    width: number;
    height: number;
  };
  time_used?: number;
  error_message?: string;
  quality_tips?: string[];
  skinAnalysis?: SkinAnalyzeCategories;
}