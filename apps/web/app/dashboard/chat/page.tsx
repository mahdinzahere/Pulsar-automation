"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Upload, 
  Image, 
  X, 
  CheckCircle, 
  AlertCircle,
  Camera,
  FileText,
  Disc
} from "lucide-react";

export default function ChatPage() {
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const requiredImages = [
    { id: "box_front", label: "Box Front", icon: Camera, description: "Front of the DVD box" },
    { id: "coa_closeup", label: "COA Close-up", icon: FileText, description: "Certificate of Authenticity sticker" },
    { id: "disc_top", label: "Disc Top", icon: Disc, description: "Top view of the DVD disc" }
  ];

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFiles = (files: File[]) => {
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    setUploadedImages(prev => [...prev, ...imageFiles]);
  };

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const getImageStatus = (imageType: string) => {
    const hasImage = uploadedImages.some(img => {
      // Simple heuristic - in real app, you'd use AI to classify images
      const name = img.name.toLowerCase();
      if (imageType === "box_front") return name.includes("box") || name.includes("front");
      if (imageType === "coa_closeup") return name.includes("coa") || name.includes("sticker");
      if (imageType === "disc_top") return name.includes("disc") || name.includes("top");
      return false;
    });
    return hasImage;
  };

  const allRequiredImagesUploaded = requiredImages.every(req => getImageStatus(req.id));

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-6 py-12 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Create New Listing
          </h1>
          <p className="mt-2 text-muted-foreground">
            Upload photos of your Windows DVD and let our AI create the perfect eBay listing.
          </p>
        </div>

        <div className="space-y-8">
          {/* Required Images Guide */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Image className="h-5 w-5" />
                <span>Required Product Images</span>
              </CardTitle>
              <CardDescription>
                Upload these three images to get started with AI listing creation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                {requiredImages.map((req) => {
                  const hasImage = getImageStatus(req.id);
                  const Icon = req.icon;
                  
                  return (
                    <div
                      key={req.id}
                      className={`p-4 rounded-lg border-2 transition-colors ${
                        hasImage 
                          ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/20" 
                          : "border-dashed border-muted-foreground/25"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-full ${
                          hasImage ? "bg-green-100 text-green-600" : "bg-muted text-muted-foreground"
                        }`}>
                          {hasImage ? (
                            <CheckCircle className="h-4 w-4" />
                          ) : (
                            <Icon className="h-4 w-4" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-medium text-foreground">{req.label}</h3>
                          <p className="text-sm text-muted-foreground">{req.description}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Upload Area */}
          <Card>
            <CardHeader>
              <CardTitle>Upload Your Images</CardTitle>
              <CardDescription>
                Drag and drop your images here, or click to browse
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive 
                    ? "border-primary bg-primary/5" 
                    : "border-muted-foreground/25 hover:border-muted-foreground/50"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => e.target.files && handleFiles(Array.from(e.target.files))}
                  className="hidden"
                />
                
                <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <div className="space-y-2">
                  <p className="text-lg font-medium text-foreground">
                    {dragActive ? "Drop your images here" : "Upload product images"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    PNG, JPG, or WEBP up to 10MB each
                  </p>
                </div>
                
                <Button 
                  onClick={openFileDialog}
                  className="mt-4"
                  variant="outline"
                >
                  Choose Files
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Uploaded Images */}
          {uploadedImages.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Uploaded Images ({uploadedImages.length})</CardTitle>
                <CardDescription>
                  Review your uploaded images before proceeding
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {uploadedImages.map((file, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Upload ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeImage(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      <div className="mt-2">
                        <p className="text-sm font-medium text-foreground truncate">
                          {file.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {(file.size / 1024 / 1024).toFixed(1)} MB
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              size="lg" 
              className="flex-1"
              disabled={!allRequiredImagesUploaded}
            >
              {allRequiredImagesUploaded ? (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Start AI Analysis
                </>
              ) : (
                <>
                  <AlertCircle className="mr-2 h-4 w-4" />
                  Upload Required Images
                </>
              )}
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              disabled={uploadedImages.length === 0}
            >
              Save as Draft
            </Button>
          </div>

          {/* Help Text */}
          {!allRequiredImagesUploaded && (
            <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <h3 className="font-medium text-yellow-800 dark:text-yellow-200">
                    Missing Required Images
                  </h3>
                  <p className="mt-1 text-sm text-yellow-700 dark:text-yellow-300">
                    Please upload all three required images (Box Front, COA Close-up, and Disc Top) to proceed with AI analysis.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}