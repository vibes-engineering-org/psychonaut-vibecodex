"use client";

import { useState, useCallback } from "react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Badge } from "~/components/ui/badge";
import { useToast } from "~/hooks/use-toast";

interface ImageData {
  width: number;
  height: number;
  pixels: Uint8ClampedArray;
}

export default function ImageToCodeArt() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [generatedCode, setGeneratedCode] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const analyzeImage = useCallback((file: File): Promise<ImageData> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        
        if (!ctx) {
          reject(new Error("Could not get canvas context"));
          return;
        }

        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        
        resolve({
          width: canvas.width,
          height: canvas.height,
          pixels: imageData.data
        });
      };

      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = URL.createObjectURL(file);
    });
  }, []);

  const generateP5Code = useCallback((imageData: ImageData): string => {
    const { width, height, pixels } = imageData;
    const scale = Math.min(400 / width, 400 / height);
    const scaledWidth = Math.floor(width * scale);
    const scaledHeight = Math.floor(height * scale);
    const pixelSize = Math.max(1, Math.floor(4 / scale));

    let code = `function setup() {
  createCanvas(${scaledWidth}, ${scaledHeight});
  noLoop();
  background(255);
}

function draw() {
  noStroke();
  
  // Convert image to pixel art
`;

    for (let y = 0; y < height; y += Math.ceil(pixelSize / scale)) {
      for (let x = 0; x < width; x += Math.ceil(pixelSize / scale)) {
        const pixelIndex = (y * width + x) * 4;
        const r = pixels[pixelIndex];
        const g = pixels[pixelIndex + 1];
        const b = pixels[pixelIndex + 2];
        const a = pixels[pixelIndex + 3];

        if (a > 0) {
          const scaledX = Math.floor(x * scale);
          const scaledY = Math.floor(y * scale);
          
          code += `  fill(${r}, ${g}, ${b}, ${a});
  rect(${scaledX}, ${scaledY}, ${pixelSize}, ${pixelSize});
`;
        }
      }
    }

    code += `}

// Alternative artistic interpretations:

// Circles instead of rectangles
function drawCircles() {
  background(255);
  noStroke();
`;

    for (let y = 0; y < height; y += Math.ceil(pixelSize * 2 / scale)) {
      for (let x = 0; x < width; x += Math.ceil(pixelSize * 2 / scale)) {
        const pixelIndex = (y * width + x) * 4;
        const r = pixels[pixelIndex];
        const g = pixels[pixelIndex + 1];
        const b = pixels[pixelIndex + 2];
        const a = pixels[pixelIndex + 3];

        if (a > 0) {
          const scaledX = Math.floor(x * scale);
          const scaledY = Math.floor(y * scale);
          
          code += `  fill(${r}, ${g}, ${b}, ${a});
  circle(${scaledX + pixelSize/2}, ${scaledY + pixelSize/2}, ${pixelSize});
`;
        }
      }
    }

    code += `}

// Call drawCircles() in draw() function for circle version`;

    return code;
  }, []);

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/png", "image/svg+xml"];
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please select a JPEG, PNG, or SVG image.",
        variant: "destructive"
      });
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setGeneratedCode("");
  }, [toast]);

  const handleConvert = useCallback(async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    try {
      const imageData = await analyzeImage(selectedFile);
      const code = generateP5Code(imageData);
      setGeneratedCode(code);
      
      toast({
        title: "Conversion complete",
        description: "Your image has been converted to p5.js code!"
      });
    } catch (error) {
      toast({
        title: "Conversion failed",
        description: "Failed to process the image. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  }, [selectedFile, analyzeImage, generateP5Code, toast]);

  const handleCopyCode = useCallback(async () => {
    if (!generatedCode) return;

    try {
      await navigator.clipboard.writeText(generatedCode);
      toast({
        title: "Code copied",
        description: "The p5.js code has been copied to your clipboard."
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Failed to copy code to clipboard.",
        variant: "destructive"
      });
    }
  }, [generatedCode, toast]);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Image to Code Art Converter</CardTitle>
          <CardDescription>
            Upload an image and convert it to p5.js code art. Supports JPEG, PNG, and SVG files.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Input
              type="file"
              accept=".jpg,.jpeg,.png,.svg"
              onChange={handleFileSelect}
              className="mb-4"
            />
            
            {previewUrl && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">
                    {selectedFile?.name}
                  </Badge>
                  <Button 
                    onClick={handleConvert}
                    disabled={isProcessing}
                  >
                    {isProcessing ? "Converting..." : "Convert to p5.js"}
                  </Button>
                </div>
                
                <div className="border rounded-lg p-4 bg-gray-50">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="max-w-full max-h-64 mx-auto"
                  />
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {generatedCode && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Generated p5.js Code</CardTitle>
                <CardDescription>
                  Copy and paste this code into a p5.js editor to see your art
                </CardDescription>
              </div>
              <Button onClick={handleCopyCode} variant="outline">
                Copy Code
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Textarea
              value={generatedCode}
              readOnly
              className="min-h-96 font-mono text-sm"
              placeholder="Generated code will appear here..."
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}