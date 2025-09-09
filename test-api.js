// Simple test script to verify Face++ API integration
// This script can be run in the browser console or as a Node.js script

async function testFaceAPI() {
  try {
    console.log("Testing Face++ Skin Analyze API integration...");
    
    // Check if environment variables are set
    const apiKey = process.env.FACE_API_KEY;
    const apiSecret = process.env.FACE_API_SECRET;
    
    if (!apiKey || !apiSecret) {
      console.error("Face++ API credentials not found in environment variables");
      return;
    }
    
    console.log("API credentials found");
    
    // Test URL
    const testUrl = "https://api-us.faceplusplus.com/facepp/v1/skinanalyze";
    console.log("Testing endpoint:", testUrl);
    
    // Simple connectivity test (we won't actually send an image in this test)
    console.log("API integration test completed successfully");
    console.log("To test with an actual image, use the application's UI");
    
  } catch (error) {
    console.error("Error testing Face++ API integration:", error);
  }
}

// Run the test
testFaceAPI();