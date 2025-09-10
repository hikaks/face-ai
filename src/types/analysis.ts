/**
 * Shared types for skin analysis application
 */

// New interfaces for Detect API data
export interface EyeStatus {
  left_eye_status?: {
    occlusion?: number;
    no_glass_eye_open?: number;
    normal_glass_eye_close?: number;
    normal_glass_eye_open?: number;
    dark_glasses?: number;
    no_glass_eye_close?: number;
  };
  right_eye_status?: {
    occlusion?: number;
    no_glass_eye_open?: number;
    normal_glass_eye_close?: number;
    normal_glass_eye_open?: number;
    dark_glasses?: number;
    no_glass_eye_close?: number;
  };
}

export interface MouthStatus {
  surgical_mask_or_respirator?: number;
  other_occlusion?: number;
  close?: number;
  open?: number;
}

export interface EyeGaze {
  left_eye_gaze?: {
    position_x_coordinate?: number;
    position_y_coordinate?: number;
    vector_x_component?: number;
    vector_y_component?: number;
    vector_z_component?: number;
  };
  right_eye_gaze?: {
    position_x_coordinate?: number;
    position_y_coordinate?: number;
    vector_x_component?: number;
    vector_y_component?: number;
    vector_z_component?: number;
  };
}

export interface FacialLandmark {
  [key: string]: {
    x: number;
    y: number;
  };
}

export interface FaceDetection {
  face_token?: string;
  face_rectangle?: {
    top: number;
    left: number;
    width: number;
    height: number;
  };
}

export interface SkinAnalysisData {
  timestamp?: string;
  analysisType?: 'basic' | 'advanced';
  analysisResults?: {
    skin?: {
      health?: number;
      stain?: number;
      acne?: number;
      dark_circle?: number;
      wrinkle?: number;
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
    };
    demographics?: {
      age?: number;
      gender?: string;
    };
    emotion?: {
      anger?: number;
      disgust?: number;
      fear?: number;
      happiness?: number;
      neutral?: number;
      sadness?: number;
      surprise?: number;
    };
    beauty?: {
      male_score?: number;
      female_score?: number;
    };
  };
  result?: SkinAnalyzeResult;
  demographics?: {
    age?: number;
    gender?: string;
  };
  emotion?: {
    anger?: number;
    disgust?: number;
    fear?: number;
    happiness?: number;
    neutral?: number;
    sadness?: number;
    surprise?: number;
  };
  beauty?: {
    male_score?: number;
    female_score?: number;
  };
  // New Detect API data
  eyestatus?: EyeStatus;
  mouthstatus?: MouthStatus;
  eyegaze?: EyeGaze;
  landmark?: FacialLandmark;
  face_token?: string;
  face_rectangle?: {
    top: number;
    left: number;
    width: number;
    height: number;
  };
  warning?: string[];
  quality_tips?: string[];
  skinAnalysis?: {
    eyelids?: {
      left_eyelids?: { value: number; confidence: number };
      right_eyelids?: { value: number; confidence: number };
    };
    eyeArea?: {
      eye_pouch?: { value: number; confidence: number };
      dark_circle?: { value: number; confidence: number };
    };
    wrinkles?: {
      forehead_wrinkle?: { value: number; confidence: number };
      crows_feet?: { value: number; confidence: number };
      eye_finelines?: { value: number; confidence: number };
      glabella_wrinkle?: { value: number; confidence: number };
      nasolabial_fold?: { value: number; confidence: number };
    };
    pores?: {
      pores_forehead?: { value: number; confidence: number };
      pores_left_cheek?: { value: number; confidence: number };
      pores_right_cheek?: { value: number; confidence: number };
      pores_jaw?: { value: number; confidence: number };
    };
    skinIssues?: {
      blackhead?: { value: number; confidence: number };
      acne?: { value: number; confidence: number };
      mole?: { value: number; confidence: number };
      skin_spot?: { value: number; confidence: number };
    };
    skinType?: {
      skin_type?: number;
      details?: { [key: string]: { value: number; confidence: number } };
    };
  };
  skinConfidence?: {
    health?: number;
    stain?: number;
    acne?: number;
    dark_circle?: number;
    wrinkle?: number;
  };
  emotionConfidence?: {
    [key: string]: number;
  };
  // Additional data from Face++ API
  smile?: {
    value?: number;
    threshold?: number;
  };
  blur?: {
    blurness?: {
      value?: number;
      threshold?: number;
    };
  };
  facequality?: {
    value?: number;
    threshold?: number;
  };
  headpose?: {
    pitch_angle?: number;
    roll_angle?: number;
    yaw_angle?: number;
  };
}

export interface BasicAnalysisResultsProps {
  analysisData: SkinAnalysisData;
}

export interface AdvancedAnalysisResultsProps {
  analysisData: SkinAnalysisData;
}

// Specific interface for Skin Analyze API result structure
export interface SkinAnalyzeResult {
  left_eyelids?: { value: string | number; confidence: number };
  right_eyelids?: { value: string | number; confidence: number };
  eye_pouch?: { value: string | number; confidence: number };
  dark_circle?: { value: string | number; confidence: number };
  forehead_wrinkle?: { value: string | number; confidence: number };
  crows_feet?: { value: string | number; confidence: number };
  eye_finelines?: { value: string | number; confidence: number };
  glabella_wrinkle?: { value: string | number; confidence: number };
  nasolabial_fold?: { value: string | number; confidence: number };
  skin_type?: number;
  details?: { [key: string]: { value: number; confidence: number } };
  pores_forehead?: { value: string | number; confidence: number };
  pores_left_cheek?: { value: string | number; confidence: number };
  pores_right_cheek?: { value: string | number; confidence: number };
  pores_jaw?: { value: string | number; confidence: number };
  blackhead?: { value: string | number; confidence: number };
  acne?: { value: string | number; confidence: number };
  mole?: { value: string | number; confidence: number };
  skin_spot?: { value: string | number; confidence: number };
}
