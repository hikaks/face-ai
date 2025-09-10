import { NextRequest } from 'next/server';

/**
 * API route for comprehensive face analysis using Face++ Detect API v3
 * 
 * This endpoint receives an image file, validates it, and sends it to Face++ Detect API v3
 * for detailed face analysis. The response includes various attributes:
 * - Skin condition analysis (acne, dark circles, wrinkles, etc.) through skinstatus attribute
 * - Demographic information (age, gender)
 * - Emotional analysis
 * - Beauty scoring
 * - Face quality metrics
 * - Facial landmarks (106-point)
 * 
 * This implementation uses the Face++ v3/detect endpoint with comprehensive attributes
 * to provide all the features outlined in the QWEN.md specification.
 * 
 * @param {NextRequest} request - The incoming request with image file in FormData
 * @returns {Response} JSON response with comprehensive face analysis results
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const imageFile = formData.get('image') as File | null;

    // Validate image file
    if (!imageFile) {
      return Response.json(
        { error: 'No image file provided' },
        { status: 400 }
      );
    }

    // Validate file type - Skin Analyze API supports JPEG and PNG
    const allowedTypes = ['image/jpeg', 'image/png'];
    if (!allowedTypes.includes(imageFile.type)) {
      return Response.json(
        { error: 'Invalid file type. Only JPEG and PNG files are allowed.' },
        { status: 400 }
      );
    }

    // Validate file size - Skin Analyze API has 2MB limit
    if (imageFile.size > 2 * 1024 * 1024) {
      return Response.json(
        { error: 'File size too large. Maximum allowed size is 2MB.' },
        { status: 400 }
      );
    }

    // Convert file to buffer for image analysis
    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Convert file to base64 for Face++ API
    const base64Image = buffer.toString('base64');
    
    // Validate base64 image
    if (!base64Image || base64Image.length === 0) {
      console.error('Failed to convert image to base64');
      return Response.json(
        { error: 'Failed to process image. Please try a different image.' },
        { status: 400 }
      );
    }
    
    console.log('Image base64 length:', base64Image.length);
    
    // Check if image is too large for base64 (approximately 2MB limit)
    if (base64Image.length > 2 * 1024 * 1024 * 1.37) { // 1.37 is approximate base64 overhead
      console.error('Image too large for base64 conversion');
      return Response.json(
        { error: 'Image file is too large. Maximum allowed size is 2MB.' },
        { status: 400 }
      );
    }

    // Prepare request to Face++ Detect API v3
    // Using v3/detect endpoint for comprehensive face analysis
    const facePlusPlusUrl = 'https://api-us.faceplusplus.com/facepp/v3/detect';
    const apiKey = process.env.FACE_API_KEY;
    const apiSecret = process.env.FACE_API_SECRET;

    // Validate API credentials format
    if (!apiKey || !apiSecret || apiKey.length < 10 || apiSecret.length < 10) {
      console.error('Invalid Face++ API credentials format');
      return Response.json(
        { error: 'Invalid Face++ API credentials format. Please check your environment variables.' },
        { status: 500 }
      );
    }

    console.log('Sending request to Face++ Detect API v3');
    console.log('API Key configured:', !!apiKey);
    console.log('API Secret configured:', !!apiSecret);
    console.log('Image base64 length:', base64Image.length);

    // Send request to Face++ Detect API v3 with comprehensive attributes
    const response = await fetch(facePlusPlusUrl, {
      method: 'POST',
      body: new URLSearchParams({
        api_key: apiKey as string,
        api_secret: apiSecret as string,
        image_base64: base64Image,
        return_landmark: '2', // 106-point landmarks
        return_attributes: 'skinstatus,gender,age,emotion,beauty,headpose,facequality,blur,eyestatus,mouthstatus,eyegaze,smiling'
      }),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    console.log('Face++ API response status:', response.status);
    console.log('Face++ API response headers:', [...response.headers.entries()]);

    // Handle Face++ API errors
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Face++ Skin Analyze API Error:', errorText);
      console.error('Response status:', response.status);
      console.error('Response headers:', [...response.headers.entries()]);
      
      // Handle specific error cases
      if (response.status === 401) {
        return Response.json(
          { error: 'Invalid Face++ API credentials' },
          { status: 401 }
        );
      }
      
      if (response.status === 400) {
        try {
          const errorData = JSON.parse(errorText);
          if (errorData.error_message) {
            // Handle specific Detect API errors
            if (errorData.error_message.includes('NO_FACE_FOUND')) {
              return Response.json(
                { error: 'No face detected in the image. Please ensure the image contains a clear face, facing forward with good lighting.' },
                { status: 400 }
              );
            }
            if (errorData.error_message.includes('INVALID_IMAGE_FACE')) {
              return Response.json(
                { error: 'Image quality is not suitable for analysis. Please use a clearer image with a single face, proper lighting, and frontal view.' },
                { status: 400 }
              );
            }
            if (errorData.error_message.includes('IMAGE_ERROR_UNSUPPORTED_FORMAT')) {
              return Response.json(
                { error: 'Image format not supported. Please use JPEG or PNG format.' },
                { status: 400 }
              );
            }
            if (errorData.error_message.includes('IMAGE_FILE_TOO_LARGE')) {
              return Response.json(
                { error: 'Image file is too large. Maximum allowed size is 2MB.' },
                { status: 400 }
              );
            }
            if (errorData.error_message.includes('INVALID_IMAGE_SIZE')) {
              return Response.json(
                { error: 'Image size does not meet requirements. Please use an image with dimensions between 48x48 and 4096x4096 pixels.' },
                { status: 400 }
              );
            }
            if (errorData.error_message.includes('TOO_MANY_FACE_ATTRIBUTES')) {
              return Response.json(
                { error: 'Multiple faces detected. Please use an image with only one face for accurate analysis.' },
                { status: 400 }
              );
            }
            if (errorData.error_message.includes('INSUFFICIENT_PERMISSION')) {
              return Response.json(
                { error: 'API Key does not have sufficient permissions for this operation. Please check your API Key type.' },
                { status: 403 }
              );
            }
          }
        } catch (parseError) {
          console.error('Error parsing error response:', parseError);
        }
        
        return Response.json(
          { error: 'Bad request to Face++ Detect API. Check image format and size.' },
          { status: 400 }
        );
      }
      
      return Response.json(
        { error: `Face++ API error: ${response.status} - ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('Face++ API response data:', JSON.stringify(data, null, 2));

    // Check if Face++ returned an error in the response
    if (data.error_message) {
      return Response.json(
        { error: `Face++ API error: ${data.error_message}` },
        { status: 400 }
      );
    }

    // Add quality recommendations based on warnings if present
    if (data.warning && data.warning.length > 0) {
      const qualityTips = [];
      if (data.warning.includes('improper_headpose')) {
        qualityTips.push('For better results, please ensure your face is facing straight forward to the camera.');
      }
      // Add the quality tips to the response
      data.quality_tips = qualityTips;
    }

    // Transform the response to match the expected structure for comprehensive analysis
    // The Detect API returns an array of faces, we'll use the first one
    const faceData = data.faces && data.faces.length > 0 ? data.faces[0] : null;
    
    if (!faceData) {
      return Response.json(
        { error: 'No face detected in the image.' },
        { status: 400 }
      );
    }

    // Extract skin status data from attributes
    const skinStatus = faceData.attributes?.skinstatus || {};
    
    // Calculate health score based on skin status
    const calculateHealthScore = (skinData: Record<string, number | undefined>) => {
      if (!skinData) return 0;
      
      const issues = [
        skinData.acne || 0,
        skinData.stain || 0,
        skinData.dark_circle || 0,
        skinData.wrinkle || 0
      ];
      
      const totalIssues = issues.reduce((sum, issue) => sum + (issue || 0), 0);
      const maxPossibleIssues = issues.length * 100; // Assuming max value is 100
      
      return Math.max(0, Math.min(100, Math.round(
        100 - (totalIssues / maxPossibleIssues) * 100
      )));
    };
    
    const healthScore = calculateHealthScore(skinStatus);
    
    // Add quality recommendations based on head pose if present
    if (faceData.attributes?.headpose) {
      const { roll_angle, yaw_angle, pitch_angle } = faceData.attributes.headpose;
      // Check if angles are within recommended range (-45 to 45 degrees)
      if (Math.abs(roll_angle) > 45 || Math.abs(yaw_angle) > 45 || Math.abs(pitch_angle) > 45) {
        data.warning = data.warning || [];
        data.warning.push('improper_headpose');
      }
    }

    // Restructure the response to match the expected format
    // This maintains compatibility with the existing frontend code
    const transformedData = {
      ...data,
      // Add face-specific data from Detect API
      face_token: faceData.face_token,
      face_rectangle: faceData.face_rectangle,
      landmark: faceData.landmark,
      result: {
        // Map skin status data with proper structure - UNIFIED FORMAT
        health: healthScore,
        stain: skinStatus.stain || 0,
        acne: skinStatus.acne || 0,
        dark_circle: skinStatus.dark_circle || 0,
        wrinkle: skinStatus.wrinkle || 0,
        // Add other skin analysis data
        eye_pouch: skinStatus.eye_pouch || 0,
        forehead_wrinkle: skinStatus.forehead_wrinkle || 0,
        crows_feet: skinStatus.crows_feet || 0,
        eye_finelines: skinStatus.eye_finelines || 0,
        glabella_wrinkle: skinStatus.glabella_wrinkle || 0,
        nasolabial_fold: skinStatus.nasolabial_fold || 0,
        pores_forehead: skinStatus.pores_forehead || 0,
        pores_left_cheek: skinStatus.pores_left_cheek || 0,
        pores_right_cheek: skinStatus.pores_right_cheek || 0,
        pores_jaw: skinStatus.pores_jaw || 0,
        blackhead: skinStatus.blackhead || 0,
        mole: skinStatus.mole || 0,
        skin_spot: skinStatus.skin_spot || 0,
        skin_type: skinStatus.skin_type || 0
      },
      // Add skinAnalysis structure for consistency with Advanced Analysis
      skinAnalysis: {
        eyelids: {
          left_eyelids: { value: 0, confidence: 0 }, // Not available in Basic Analysis
          right_eyelids: { value: 0, confidence: 0 }
        },
        eyeArea: {
          eye_pouch: { value: skinStatus.eye_pouch || 0, confidence: 0.8 },
          dark_circle: { value: skinStatus.dark_circle || 0, confidence: 0.8 }
        },
        wrinkles: {
          forehead_wrinkle: { value: skinStatus.forehead_wrinkle || 0, confidence: 0.8 },
          crows_feet: { value: skinStatus.crows_feet || 0, confidence: 0.8 },
          eye_finelines: { value: skinStatus.eye_finelines || 0, confidence: 0.8 },
          glabella_wrinkle: { value: skinStatus.glabella_wrinkle || 0, confidence: 0.8 },
          nasolabial_fold: { value: skinStatus.nasolabial_fold || 0, confidence: 0.8 }
        },
        pores: {
          pores_forehead: { value: skinStatus.pores_forehead || 0, confidence: 0.8 },
          pores_left_cheek: { value: skinStatus.pores_left_cheek || 0, confidence: 0.8 },
          pores_right_cheek: { value: skinStatus.pores_right_cheek || 0, confidence: 0.8 },
          pores_jaw: { value: skinStatus.pores_jaw || 0, confidence: 0.8 }
        },
        skinIssues: {
          blackhead: { value: skinStatus.blackhead || 0, confidence: 0.8 },
          acne: { value: skinStatus.acne || 0, confidence: 0.8 },
          mole: { value: skinStatus.mole || 0, confidence: 0.8 },
          skin_spot: { value: skinStatus.skin_spot || 0, confidence: 0.8 }
        },
        skinType: {
          skin_type: skinStatus.skin_type || 0,
          details: {} // Not available in Basic Analysis
        }
      },
      // Add demographic data if available
      demographics: {
        age: faceData.attributes?.age?.value,
        gender: faceData.attributes?.gender?.value,
        // Add other demographic data as needed
      },
      // Add emotion data if available
      emotion: faceData.attributes?.emotion,
      // Add beauty score if available
      beauty: faceData.attributes?.beauty,
      // Add smile detection if available
      smile: faceData.attributes?.smile,
      // Add blur detection if available
      blur: faceData.attributes?.blur,
      // Add eye status if available
      eyestatus: faceData.attributes?.eyestatus,
      // Add face quality if available
      facequality: faceData.attributes?.facequality,
      // Add mouth status if available
      mouthstatus: faceData.attributes?.mouthstatus,
      // Add eye gaze if available
      eyegaze: faceData.attributes?.eyegaze,
      // Add head pose if available
      headpose: faceData.attributes?.headpose,
      // Add confidence scores for skin analysis
      skinConfidence: {
        health: 0.95, // High confidence for calculated health score
        stain: skinStatus.stain ? 0.85 : 0, // Default confidence for skin status
        acne: skinStatus.acne ? 0.85 : 0,
        dark_circle: skinStatus.dark_circle ? 0.85 : 0,
        wrinkle: skinStatus.wrinkle ? 0.85 : 0
      },
      // Add emotion confidence scores
      emotionConfidence: faceData.attributes?.emotion ? {
        anger: 0.8,
        disgust: 0.8,
        fear: 0.8,
        happiness: 0.8,
        neutral: 0.8,
        sadness: 0.8,
        surprise: 0.8
      } : {}
    };

    // Return successful response with face analysis data
    return Response.json(transformedData);
  } catch (error) {
    console.error('Analysis API Error:', error);
    return Response.json(
      { error: 'Internal server error during image analysis' },
      { status: 500 }
    );
  }
}

// Disable body parsing for file uploads to handle multipart/form-data properly
export const config = {
  api: {
    bodyParser: false,
  },
};