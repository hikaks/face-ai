"use client";

import { useState, useRef, ChangeEvent, DragEvent } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, X } from "lucide-react";

/**
 * Props for ImageUpload component
 */
interface ImageUploadProps {
  /**
   * Callback function triggered when a valid image is selected
   * @param file - The selected image file
   */
  onImageSelect: (file: File) => void;
}

/**
 * ImageUpload Component
 * 
 * This component provides a complete image upload solution with:
 * - Drag and drop functionality
 * - File browser selection
 * - Image preview
 * - File validation (type and size)
 * - Error handling
 * - Responsive design
 * 
 * Features:
 * - Drag and drop zone with visual feedback
 * - File type validation (JPEG, PNG)
 * - File size validation (max 2MB)
 * - Image preview with remove option
 * - Accessible file input
 * - User-friendly error messages
 * - Responsive design for all device sizes
 * 
 * Supported file types:
 * - image/jpeg
 * - image/png
 * - image/jpg
 * 
 * Maximum file size: 2MB
 */
export function ImageUpload({ onImageSelect }: ImageUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  /**
   * Validate uploaded file type and size - optimized for skin analysis
   * @param file - The file to validate
   * @returns boolean indicating if file is valid
   */
  const validateFile = (file: File): boolean => {
    // Check file type - prioritize JPEG for skin analysis
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!allowedTypes.includes(file.type)) {
      setError("Format file tidak didukung. Gunakan JPEG (direkomendasikan) atau PNG.");
      return false;
    }

    // Check file size (max 5MB for higher quality skin analysis)
    if (file.size > 5 * 1024 * 1024) {
      setError("Ukuran file terlalu besar. Maksimal 5MB.");
      return false;
    }

    // Check minimum file size for quality analysis
    if (file.size < 50 * 1024) {
      setError("Ukuran file terlalu kecil. Minimal 50KB untuk analisis yang akurat.");
      return false;
    }

    setError(null);
    return true;
  };

  /**
   * Handle file selection and validation - optimized for skin analysis
   * @param file - The file to handle
   */
  const handleFile = (file: File) => {
    if (validateFile(file)) {
      // Convert PNG to JPEG for better skin analysis compatibility
      if (file.type === "image/png") {
        convertPngToJpeg(file);
      } else {
        onImageSelect(file);
        setFileName(file.name);
        createPreview(file);
      }
    }
  };

  /**
   * Convert PNG to JPEG for optimal skin analysis
   * @param file - PNG file to convert
   */
  const convertPngToJpeg = (file: File) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Fill white background for PNG transparency
      if (ctx) {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const jpegFile = new File([blob], file.name.replace(/\.png$/i, '.jpg'), {
              type: 'image/jpeg',
              lastModified: Date.now()
            });
            onImageSelect(jpegFile);
            setFileName(jpegFile.name);
            createPreview(jpegFile);
          }
        }, 'image/jpeg', 0.95);
      }
    };
    
    img.src = URL.createObjectURL(file);
  };

  /**
   * Create image preview
   * @param file - File to create preview for
   */
  const createPreview = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  /**
   * Handle drag events for drag and drop functionality
   * @param e - Drag event
   */
  const handleDrag = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  /**
   * Handle file drop event
   * @param e - Drag event
   */
  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  /**
   * Handle file input change event
   * @param e - Change event
   */
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  /**
   * Trigger file input click when button is clicked
   */
  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  /**
   * Remove selected image and reset component state
   */
  const removeImage = () => {
    setPreviewUrl(null);
    setFileName(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-4">
      <Input
        type="file"
        ref={fileInputRef}
        onChange={handleChange}
        accept="image/jpeg,image/jpg,image/png"
        className="hidden"
      />
      
      {previewUrl ? (
        <Card className="border-2 border-dashed">
          <CardContent className="p-4">
            <div className="relative">
              <img 
                src={previewUrl} 
                alt="Preview" 
                className="w-full h-64 object-contain rounded-lg"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2"
                onClick={removeImage}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-2 truncate">
              {fileName}
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card 
          className={`border-2 border-dashed ${dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25"}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <CardContent className="p-8 text-center cursor-pointer">
            <div className="flex flex-col items-center justify-center gap-4">
              <div className="rounded-full bg-primary/10 p-3">
                <Upload className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-medium">
                  Tarik dan lepas foto ke sini
                </p>
                <p className="text-sm text-muted-foreground">
                  atau klik untuk memilih file
                </p>
              </div>
              <Button type="button" variant="secondary" onClick={onButtonClick}>
                Pilih File
              </Button>
              <p className="text-xs text-muted-foreground">
                Format yang didukung: JPEG (direkomendasikan), PNG (Maks. 5MB)
              </p>
            </div>
          </CardContent>
        </Card>
      )}
      
      {error && (
        <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
          {error}
        </div>
      )}
    </div>
  );
}