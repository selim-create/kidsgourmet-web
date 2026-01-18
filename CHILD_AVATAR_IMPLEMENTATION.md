# Child Profile Avatar Feature - Implementation Summary

## Overview
This implementation adds child profile avatar upload, display, and delete functionality to the KidsGourmet web application, integrating with the existing backend API endpoints.

## Backend API Integration

The following backend endpoints were integrated:

- **POST** `/kg/v1/child-profiles/{uuid}/avatar` - Upload avatar (multipart/form-data)
- **GET** `/kg/v1/child-profiles/{uuid}/avatar` - Get signed URL (15 min expiry)
- **DELETE** `/kg/v1/child-profiles/{uuid}/avatar` - Delete avatar

## Changes Made

### 1. Type Definitions (`src/lib/types.ts`)

Added new fields to the `Child` interface:
```typescript
avatar_url?: string;      // Signed URL (temporary, 15 min expiry)
has_avatar?: boolean;     // Flag indicating if avatar exists
```

### 2. Service Layer (`src/services/user-service.ts`)

Added three new methods to `userService`:

```typescript
uploadChildAvatar(childId: string, file: File): Promise<{ avatar: { url: string } }>
getChildAvatarUrl(childId: string): Promise<{ url: string; expires_in: number }>
deleteChildAvatar(childId: string): Promise<void>
```

### 3. Custom Hook (`src/hooks/use-child-avatar-url.ts`)

Created `useChildAvatarUrl` hook for managing signed URLs with automatic refresh:
- Fetches avatar URL on mount
- Automatically refreshes URL at 80% of expiry time (12 minutes before expiration)
- Cleans up timeout on unmount
- Handles loading states

### 4. Avatar Upload Component (`src/components/features/ChildAvatarUpload.tsx`)

Created a reusable avatar upload component with features:

**Features:**
- File selection via click
- Image preview before upload
- Loading states during upload/delete
- Hover overlay with edit/delete buttons
- Fallback to child's initial letter when no avatar
- Three size options: sm (16x16), md (24x24), lg (32x32)
- Responsive text sizing based on component size

**Validation:**
- Maximum file size: 2MB (client-side)
- Accepted formats: JPG, JPEG, PNG, WebP
- Toast notifications for errors

**Props:**
```typescript
interface ChildAvatarUploadProps {
  childId: string;
  currentAvatarUrl?: string;
  childName: string;
  onAvatarChange?: (newUrl: string | null) => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}
```

### 5. UI Integration

#### Dashboard Page (`src/app/(main)/dashboard/page.tsx`)
- Replaced placeholder avatar circle with `ChildAvatarUpload` component
- Size: Large (32x32)
- Shows active child's avatar with upload capability
- Refreshes user data on avatar change

#### Profile Page (`src/app/(main)/profil/page.tsx`)
- Integrated `ChildAvatarUpload` in child cards
- Size: Small (16x16)
- Shows all children's avatars with edit capability
- Refreshes children list on avatar change

## User Experience Flow

### Uploading an Avatar:
1. User clicks on the child's avatar placeholder (showing initials)
2. File picker opens
3. User selects an image (jpg, png, or webp, max 2MB)
4. Preview shown immediately
5. Image uploads to backend
6. Success toast notification appears
7. Avatar displayed with actual image

### Editing an Avatar:
1. User hovers over existing avatar
2. Edit/Delete overlay appears
3. User clicks edit button
4. File picker opens
5. New image selected and uploaded
6. Avatar updates with new image

### Deleting an Avatar:
1. User hovers over avatar
2. User clicks delete button
3. Confirmation dialog appears
4. On confirmation, avatar deleted
5. Reverts to showing child's initial

## Security Considerations

1. **Authentication Required**: All avatar operations require valid JWT token
2. **Signed URLs**: URLs expire after 15 minutes for security
3. **Client-Side Validation**: File type and size checked before upload
4. **Backend Validation**: Backend performs additional validation
5. **No Security Vulnerabilities**: CodeQL scan passed with 0 alerts

## Technical Implementation Details

### URL Caching Strategy
- Signed URLs valid for 15 minutes (900 seconds)
- Hook refreshes URL at 80% of expiry (720 seconds / 12 minutes)
- 20% safety margin prevents expired URLs
- Automatic cleanup on component unmount

### Error Handling
- Network errors caught and displayed via toast
- File validation errors shown immediately
- Graceful fallback to initials on error
- Loading states prevent double-clicks

### Performance
- Images loaded asynchronously
- Preview uses FileReader for instant feedback
- Component memoization prevents unnecessary re-renders
- Minimal re-fetches due to smart caching

## Future Enhancements

Potential improvements that could be added later:

1. **Image Cropping**: Allow users to crop/adjust uploaded images
2. **Better Confirmation Modal**: Replace native `confirm()` with styled modal
3. **Image Compression**: Compress images client-side before upload
4. **Progress Indicator**: Show upload progress for large files
5. **Drag & Drop**: Add drag-and-drop file upload
6. **Multiple Upload**: Allow uploading from camera on mobile
7. **Avatar Gallery**: Predefined avatar options if user doesn't want to upload

## Testing Checklist

- [x] TypeScript compilation successful
- [x] Build successful with no errors
- [x] CodeQL security scan passed
- [x] Code review addressed
- [ ] Manual testing of avatar upload (requires backend)
- [ ] Manual testing of avatar delete (requires backend)
- [ ] Manual testing of URL refresh (requires backend)
- [ ] Mobile responsiveness testing (requires backend)

## Files Changed

1. `src/lib/types.ts` - Added avatar fields to Child interface
2. `src/services/user-service.ts` - Added avatar API methods
3. `src/hooks/use-child-avatar-url.ts` - New hook for URL management
4. `src/components/features/ChildAvatarUpload.tsx` - New component
5. `src/app/(main)/dashboard/page.tsx` - Integrated avatar display
6. `src/app/(main)/profil/page.tsx` - Integrated avatar editing

## Dependencies

No new dependencies were added. The implementation uses:
- Existing `sonner` for toast notifications
- Native browser APIs for file handling
- Existing authentication system

## Backward Compatibility

The implementation is fully backward compatible:
- Avatar fields are optional in Child interface
- Graceful fallback to initials if no avatar exists
- Existing child data continues to work
- No breaking changes to existing APIs
