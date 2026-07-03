# Cloudinary Setup Guide for Saudi Horizon Fresh

## Overview
Cloudinary has been successfully integrated into the Saudi Horizon Fresh Next.js project for optimized image management and delivery.

## Installation
```bash
npm install cloudinary next-cloudinary
```

## Environment Variables
Add these variables to your `.env.local` file:

```bash
# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_FOLDER=saudi-horizon-fresh
```

## Components Created

### 1. Cloudinary Utility Functions (`src/lib/cloudinary.ts`)
- **uploadToCloudinary()**: Upload single file with options
- **uploadMultipleToCloudinary()**: Upload multiple files
- **deleteFromCloudinary()**: Delete images by public ID
- **getOptimizedImageUrl()**: Generate optimized image URLs with transformations

### 2. CloudinaryImage Component (`src/components/CloudinaryImage.tsx`)
- React component for optimized image rendering
- Supports automatic format optimization (WebP, AVIF)
- Responsive image sizing
- Lazy loading support

## Usage Examples

### Uploading Images
```typescript
import { uploadToCloudinary } from '@/lib/cloudinary';

// Upload from file input
const file = e.target.files[0];
const result = await uploadToCloudinary(file, {
  folder: 'products',
  public_id: 'product-123',
  transformation: [{ width: 800, height: 600, crop: 'fill' }]
});
```

### Using the Image Component
```typescript
import CloudinaryImage from '@/components/CloudinaryImage';

// Using public ID
<CloudinaryImage
  src="products/product-123"
  alt="Product Image"
  width={400}
  height={300}
  quality="auto"
  format="auto"
/>

// Using full Cloudinary URL
<CloudinaryImage
  src="https://res.cloudinary.com/your-cloud/image/upload/v1234567890/products/product-123.jpg"
  alt="Product Image"
  width={400}
  height={300}
/>
```

### Getting Optimized URLs
```typescript
import { getOptimizedImageUrl } from '@/lib/cloudinary';

const optimizedUrl = getOptimizedImageUrl('products/product-123', {
  width: 400,
  height: 300,
  crop: 'fill',
  quality: 'auto'
});
```

## Next Steps

1. **Create Cloudinary Account**: Sign up at https://cloudinary.com
2. **Get API Credentials**: Find your cloud name, API key, and secret in your Cloudinary dashboard
3. **Update Environment Variables**: Replace placeholder values in `.env.local`
4. **Test Upload**: Use the test endpoint to verify integration
5. **Configure Upload Presets**: Set up unsigned upload presets for client-side uploads

## Security Notes
- Never expose your API secret in client-side code
- Use environment variables for sensitive credentials
- Consider implementing signed upload URLs for production
- Set appropriate folder permissions in Cloudinary dashboard

## Folder Structure in Cloudinary
- `saudi-horizon-fresh/products/` - Product images
- `saudi-horizon-fresh/categories/` - Category images
- `saudi-horizon-fresh/banners/` - Homepage banners
- `saudi-horizon-fresh/users/` - User profile images

## Support
For issues with Cloudinary integration, check:
- Cloudinary documentation: https://cloudinary.com/documentation
- Next.js image optimization: https://nextjs.org/docs/basic-features/image-optimization
- Environment variables are properly configured
## Overview
Cloudinary has been successfully integrated into the Saudi Horizon Fresh Next.js project for optimized image management and delivery.

## Installation
```bash
npm install cloudinary next-cloudinary
```

## Environment Variables
Add these variables to your `.env.local` file:

```bash
# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_FOLDER=saudi-horizon-fresh
```

## Components Created

### 1. Cloudinary Utility Functions (`src/lib/cloudinary.ts`)
- **uploadToCloudinary()**: Upload single file with options
- **uploadMultipleToCloudinary()**: Upload multiple files
- **deleteFromCloudinary()**: Delete images by public ID
- **getOptimizedImageUrl()**: Generate optimized image URLs with transformations

### 2. CloudinaryImage Component (`src/components/CloudinaryImage.tsx`)
- React component for optimized image rendering
- Supports automatic format optimization (WebP, AVIF)
- Responsive image sizing
- Lazy loading support

## Usage Examples

### Uploading Images
```typescript
import { uploadToCloudinary } from '@/lib/cloudinary';

// Upload from file input
const file = e.target.files[0];
const result = await uploadToCloudinary(file, {
  folder: 'products',
  public_id: 'product-123',
  transformation: [{ width: 800, height: 600, crop: 'fill' }]
});
```

### Using the Image Component
```typescript
import CloudinaryImage from '@/components/CloudinaryImage';

// Using public ID
<CloudinaryImage
  src="products/product-123"
  alt="Product Image"
  width={400}
  height={300}
  quality="auto"
  format="auto"
/>

// Using full Cloudinary URL
<CloudinaryImage
  src="https://res.cloudinary.com/your-cloud/image/upload/v1234567890/products/product-123.jpg"
  alt="Product Image"
  width={400}
  height={300}
/>
```

### Getting Optimized URLs
```typescript
import { getOptimizedImageUrl } from '@/lib/cloudinary';

const optimizedUrl = getOptimizedImageUrl('products/product-123', {
  width: 400,
  height: 300,
  crop: 'fill',
  quality: 'auto'
});
```

## Next Steps

1. **Create Cloudinary Account**: Sign up at https://cloudinary.com
2. **Get API Credentials**: Find your cloud name, API key, and secret in your Cloudinary dashboard
3. **Update Environment Variables**: Replace placeholder values in `.env.local`
4. **Test Upload**: Use the test endpoint to verify integration
5. **Configure Upload Presets**: Set up unsigned upload presets for client-side uploads

## Security Notes
- Never expose your API secret in client-side code
- Use environment variables for sensitive credentials
- Consider implementing signed upload URLs for production
- Set appropriate folder permissions in Cloudinary dashboard

## Folder Structure in Cloudinary
- `saudi-horizon-fresh/products/` - Product images
- `saudi-horizon-fresh/categories/` - Category images
- `saudi-horizon-fresh/banners/` - Homepage banners
- `saudi-horizon-fresh/users/` - User profile images

## Support
For issues with Cloudinary integration, check:
- Cloudinary documentation: https://cloudinary.com/documentation
- Next.js image optimization: https://nextjs.org/docs/basic-features/image-optimization
- Environment variables are properly configured
