import { NextRequest } from 'next/server';

/**
 * API route for dedicated skin analysis using Face++ Skin Analyze API v1
 * 
 * This endpoint provides comprehensive skin analysis including:
 * - Eyelids analysis (left/right)
 * - Eye pouch detection
 * - Dark circle analysis
 * - Wrinkle detection (forehead, crow's feet, eye finelines, glabella, nasolabial fold)
 * - Pore analysis (forehead, left cheek, right cheek, jaw)
 * - Blackhead detection
 * - Acne analysis
 * - Mole detection
 * - Skin spot analysis
 * - Skin type classification
 * 
 * @param {NextRequest} request - The incoming request with image file in FormData
 * @returns {Response} JSON response with comprehensive skin analysis results
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

    // Prepare request to Face++ Skin Analyze API v1
    const facePlusPlusUrl = 'https://api-us.faceplusplus.com/facepp/v1/skinanalyze';
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

    console.log('Sending request to Face++ Skin Analyze API v1');
    console.log('API Key configured:', !!apiKey);
    console.log('API Secret configured:', !!apiSecret);
    console.log('Image base64 length:', base64Image.length);

    // Send request to Face++ Skin Analyze API v1
    const response = await fetch(facePlusPlusUrl, {
      method: 'POST',
      body: new URLSearchParams({
        api_key: apiKey as string,
        api_secret: apiSecret as string,
        image_base64: base64Image
      }),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    console.log('Face++ Skin Analyze API response status:', response.status);
    console.log('Face++ Skin Analyze API response headers:', [...response.headers.entries()]);

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
            // Handle specific Skin Analyze API errors
            if (errorData.error_message.includes('NO_FACE_FOUND')) {
              return Response.json(
                { error: 'No face detected in the image. Please ensure the image contains a clear face, facing forward with good lighting.' },
                { status: 400 }
              );
            }
            if (errorData.error_message.includes('INVALID_IMAGE_FACE')) {
              return Response.json(
                { error: 'Image quality is not suitable for skin analysis. Please use a clearer image with a single face, proper lighting, and frontal view.' },
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
            if (errorData.error_message.includes('INVALID_IMAGE_FACE_COUNT')) {
              return Response.json(
                { error: 'Multiple faces detected. Please use an image with only one face for accurate skin analysis.' },
                { status: 400 }
              );
            }
          }
        } catch (parseError) {
          console.error('Error parsing error response:', parseError);
        }
        
        return Response.json(
          { error: 'Bad request to Face++ Skin Analyze API. Check image format and size.' },
          { status: 400 }
        );
      }
      
      return Response.json(
        { error: `Face++ Skin Analyze API error: ${response.status} - ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('Face++ Skin Analyze API response data:', JSON.stringify(data, null, 2));

    // Check if Face++ returned an error in the response
    if (data.error_message) {
      return Response.json(
        { error: `Face++ Skin Analyze API error: ${data.error_message}` },
        { status: 400 }
      );
    }

    // Add quality recommendations based on warnings if present
    if (data.warning && data.warning.length > 0) {
      const qualityTips = [];
      for (const warning of data.warning) {
        if (warning.includes('INVALID_IMAGE_FACE')) {
          qualityTips.push('For better skin analysis results, please ensure your face is clearly visible and well-lit.');
        }
        if (warning.includes('LOW_QUALITY')) {
          qualityTips.push('Image quality could be improved for more accurate skin analysis.');
        }
      }
      // Add the quality tips to the response
      data.quality_tips = qualityTips;
    }

    // Transform the response to include detailed skin analysis categories
    const skinAnalysisResult = {
      ...data,
      // Organize skin analysis by categories for better frontend handling
      // Note: data.result is an object, not an array, so we access properties directly
      skinAnalysis: {
        eyelids: {
          left_eyelids: data.result?.left_eyelids,
          right_eyelids: data.result?.right_eyelids
        },
        eyeArea: {
          eye_pouch: data.result?.eye_pouch,
          dark_circle: data.result?.dark_circle
        },
        wrinkles: {
          forehead_wrinkle: data.result?.forehead_wrinkle,
          crows_feet: data.result?.crows_feet,
          eye_finelines: data.result?.eye_finelines,
          glabella_wrinkle: data.result?.glabella_wrinkle,
          nasolabial_fold: data.result?.nasolabial_fold
        },
        pores: {
          pores_forehead: data.result?.pores_forehead,
          pores_left_cheek: data.result?.pores_left_cheek,
          pores_right_cheek: data.result?.pores_right_cheek,
          pores_jaw: data.result?.pores_jaw
        },
        skinIssues: {
          blackhead: data.result?.blackhead,
          acne: data.result?.acne,
          mole: data.result?.mole,
          skin_spot: data.result?.skin_spot
        },
        skinType: data.result?.skin_type
      }
    };

    // Return successful response with comprehensive skin analysis data
    return Response.json(skinAnalysisResult);
  } catch (error) {
    console.error('Skin Analysis API Error:', error);
    return Response.json(
      { error: 'Internal server error during skin analysis' },
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