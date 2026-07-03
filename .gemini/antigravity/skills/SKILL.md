## Image Upload Backend Endpoint

This skill covers implementing the image upload functionality for the Saudi Horizon Fresh website. Key components include:

- **Backend Endpoint**: `/api/upload` route for handling file uploads
- **Image Processing**: Client-side preview with server-side storage
- **Error Handling**: Graceful error handling for upload failures
- **Security**: Proper validation and sanitization of uploaded files

Implementation details:
- Uses Next.js API routes for endpoint creation
- Implements file upload handling with Express middleware
- Provides public URL for uploaded images
- Includes error handling for various