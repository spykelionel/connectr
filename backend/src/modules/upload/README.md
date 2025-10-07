# 🚀 Cloudinary Integration Module

A robust, reusable file upload module for the Connectr social network that handles image uploads to Cloudinary and returns secure URLs for storage in your database.

## 📋 Features

- **Multiple Upload Methods**: Single file, multiple files, URL-based uploads
- **Optimized Uploads**: Pre-configured settings for different content types (profile, post, network)
- **File Validation**: Comprehensive validation with custom pipes
- **Bulk Operations**: Upload and delete multiple files
- **Signed URLs**: Generate signed upload URLs for client-side uploads
- **Comprehensive Swagger Documentation**: Full API documentation with examples
- **Error Handling**: Robust error handling with detailed logging
- **Security**: JWT authentication required for all operations

## 🏗️ Module Structure

```
src/modules/upload/
├── dto/
│   ├── upload.dto.ts          # DTOs for requests and responses
│   └── index.ts              # Export barrel
├── pipes/
│   └── file-validation.pipe.ts # File validation pipes
├── cloudinary.service.ts      # Enhanced Cloudinary service
├── upload.controller.ts       # Upload controller with Swagger docs
└── upload.module.ts          # Module definition
```

## 🔧 API Endpoints

### Single File Upload

- `POST /upload/single` - Upload any file type
- `POST /upload/profile` - Upload profile image (optimized)
- `POST /upload/post` - Upload post image (optimized)
- `POST /upload/network` - Upload network avatar (optimized)

### Multiple File Operations

- `POST /upload/multiple` - Upload multiple files
- `POST /upload/delete-multiple` - Delete multiple files

### Advanced Operations

- `POST /upload/from-url` - Upload from external URL
- `POST /upload/signed-url` - Generate signed upload URL
- `GET /upload/info/:publicId` - Get file information
- `DELETE /upload/:publicId` - Delete single file

## 📝 Usage Examples

### Upload Profile Image

```typescript
// Frontend
const formData = new FormData();
formData.append('file', profileImageFile);
formData.append('uploadType', 'profile');
formData.append('tags', JSON.stringify(['avatar', 'profile']));

const response = await fetch('/upload/profile', {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${token}`,
  },
  body: formData,
});
```

### Upload Post Image

```typescript
// Frontend
const formData = new FormData();
formData.append('file', postImageFile);
formData.append('uploadType', 'post');
formData.append(
  'transformation',
  JSON.stringify({
    quality: 'auto',
    format: 'webp',
  }),
);

const response = await fetch('/upload/post', {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${token}`,
  },
  body: formData,
});
```

### Upload Multiple Files

```typescript
// Frontend
const formData = new FormData();
files.forEach((file) => {
  formData.append('files', file);
});
formData.append('uploadType', 'post');
formData.append('folder', 'user-gallery');

const response = await fetch('/upload/multiple', {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${token}`,
  },
  body: formData,
});
```

## 🔒 File Validation

### Supported File Types

- **Images**: JPEG, JPG, PNG, WebP, GIF
- **Max Sizes**:
  - Profile images: 5MB
  - Post images: 10MB
  - Network avatars: 5MB
  - General uploads: 10MB

### Validation Pipes

- `FileValidationPipe` - General file validation
- `ProfileImageValidationPipe` - Profile image specific
- `PostImageValidationPipe` - Post image specific
- `NetworkImageValidationPipe` - Network avatar specific

## 🎨 Image Transformations

### Automatic Optimizations

- **Profile Images**: 300x300px, fill crop, auto quality, JPG format
- **Post Images**: Auto quality, WebP format
- **Network Avatars**: 200x200px, fill crop, auto quality, JPG format

### Custom Transformations

```typescript
const uploadDto = {
  uploadType: 'post',
  transformation: {
    width: 800,
    height: 600,
    crop: 'fill',
    quality: '80',
    format: 'webp',
  },
};
```

## 🔐 Security Features

- **JWT Authentication**: All endpoints require valid JWT token
- **File Type Validation**: Only allowed MIME types accepted
- **Size Limits**: Configurable file size limits
- **Content Validation**: Empty file detection
- **Secure URLs**: All returned URLs are HTTPS

## 📊 Response Formats

### Successful Upload Response

```json
{
  "public_id": "profiles/user123_avatar",
  "secure_url": "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/profiles/user123_avatar.jpg",
  "format": "jpg",
  "bytes": 245760,
  "width": 300,
  "height": 300,
  "created_at": "2024-01-01T00:00:00.000Z",
  "uploadType": "profile",
  "folder": "profiles",
  "tags": ["avatar", "profile"]
}
```

### Bulk Upload Response

```json
{
  "successful": [
    {
      "public_id": "posts/image1",
      "secure_url": "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/posts/image1.jpg",
      "format": "jpg",
      "bytes": 1024000,
      "width": 800,
      "height": 600,
      "created_at": "2024-01-01T00:00:00.000Z",
      "uploadType": "post",
      "folder": "posts",
      "tags": ["post", "content"]
    }
  ],
  "failed": [
    {
      "filename": "large-image.jpg",
      "error": "File size exceeds limit"
    }
  ],
  "total": 2,
  "successCount": 1,
  "failureCount": 1
}
```

## 🛠️ Environment Configuration

Required environment variables:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## 📚 Swagger Documentation

Access the complete API documentation at `/swagger` when the server is running. The File Upload section includes:

- Detailed endpoint descriptions
- Request/response schemas
- Example payloads
- Error response codes
- Authentication requirements

## 🚀 Integration with Other Modules

The upload module integrates seamlessly with:

- **User Module**: Profile image uploads
- **Post Module**: Post image attachments
- **Network Module**: Network avatar uploads
- **Comment Module**: Comment image attachments

## 🔧 Error Handling

The module provides comprehensive error handling:

- **400 Bad Request**: Invalid file type, size, or parameters
- **401 Unauthorized**: Missing or invalid JWT token
- **413 Payload Too Large**: File size exceeds limits
- **500 Internal Server Error**: Cloudinary upload failures

## 📈 Performance Features

- **Automatic Format Conversion**: WebP for better compression
- **Quality Optimization**: Auto quality for optimal file sizes
- **Lazy Loading**: Efficient image delivery
- **CDN Integration**: Global content delivery via Cloudinary CDN

## 🎯 Best Practices

1. **Use Appropriate Endpoints**: Use specific endpoints (profile, post, network) for optimized uploads
2. **Validate on Frontend**: Implement client-side validation before upload
3. **Handle Errors Gracefully**: Implement proper error handling in your frontend
4. **Use Bulk Operations**: For multiple files, use bulk upload endpoints
5. **Clean Up**: Delete unused files to manage storage costs
6. **Optimize Images**: Use appropriate transformations for your use case

This module provides a complete, production-ready solution for file uploads in your Connectr social network platform! 🚀
