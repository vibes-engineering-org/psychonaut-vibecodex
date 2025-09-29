"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Badge } from "~/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { useToast } from "~/hooks/use-toast";
import dynamic from "next/dynamic";

interface ImageData {
  width: number;
  height: number;
  pixels: Uint8ClampedArray;
}

type ArtStyle = 'pixels' | 'circles' | 'triangles' | 'lines' | 'dots' | 'ascii' | 'psychedelic' | 'statue' | 'animation';

interface ArtStyleConfig {
  name: string;
  description: string;
}

const artStyles: Record<ArtStyle, ArtStyleConfig> = {
  pixels: { name: "Pixel Art", description: "Classic pixel-based representation" },
  circles: { name: "Circle Dots", description: "Circular dots creating the image" },
  triangles: { name: "Triangle Mosaic", description: "Triangular shapes forming patterns" },
  lines: { name: "Line Art", description: "Vertical lines with varying thickness" },
  dots: { name: "Dot Matrix", description: "Small dots with size based on brightness" },
  ascii: { name: "ASCII Art", description: "Text characters representing pixels" },
  psychedelic: { name: "Psychedelic Filter", description: "Trippy colors and distorted patterns" },
  statue: { name: "Marble Statue", description: "Classical marble statue effect" },
  animation: { name: "Animated GIF", description: "Convert to animated p5.js sketch" }
};

export default function ImageToCodeArt() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [generatedCode, setGeneratedCode] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [artStyle, setArtStyle] = useState<ArtStyle>('pixels');
  const [showPreview, setShowPreview] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
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

  const generateP5Code = useCallback((imageData: ImageData, style: ArtStyle): string => {
    const { width, height, pixels } = imageData;
    const scale = Math.min(400 / width, 400 / height);
    const scaledWidth = Math.floor(width * scale);
    const scaledHeight = Math.floor(height * scale);
    const step = Math.max(1, Math.floor(8 / scale));

    let setupCode = `function setup() {
  createCanvas(${scaledWidth}, ${scaledHeight});
  noLoop();
  background(255);
}

function draw() {`;

    let drawCode = '';

    switch (style) {
      case 'pixels':
        setupCode += `
  noStroke();`;
        for (let y = 0; y < height; y += step) {
          for (let x = 0; x < width; x += step) {
            const pixelIndex = (y * width + x) * 4;
            const r = pixels[pixelIndex];
            const g = pixels[pixelIndex + 1];
            const b = pixels[pixelIndex + 2];
            const a = pixels[pixelIndex + 3];
            if (a > 128) {
              const scaledX = Math.floor(x * scale);
              const scaledY = Math.floor(y * scale);
              drawCode += `
  fill(${r}, ${g}, ${b});
  rect(${scaledX}, ${scaledY}, ${Math.ceil(step * scale)}, ${Math.ceil(step * scale)});`;
            }
          }
        }
        break;

      case 'circles':
        setupCode += `
  noStroke();`;
        for (let y = 0; y < height; y += step) {
          for (let x = 0; x < width; x += step) {
            const pixelIndex = (y * width + x) * 4;
            const r = pixels[pixelIndex];
            const g = pixels[pixelIndex + 1];
            const b = pixels[pixelIndex + 2];
            const a = pixels[pixelIndex + 3];
            if (a > 128) {
              const scaledX = Math.floor(x * scale);
              const scaledY = Math.floor(y * scale);
              const size = Math.ceil(step * scale);
              drawCode += `
  fill(${r}, ${g}, ${b});
  circle(${scaledX + size/2}, ${scaledY + size/2}, ${size});`;
            }
          }
        }
        break;

      case 'triangles':
        setupCode += `
  noStroke();`;
        for (let y = 0; y < height; y += step) {
          for (let x = 0; x < width; x += step) {
            const pixelIndex = (y * width + x) * 4;
            const r = pixels[pixelIndex];
            const g = pixels[pixelIndex + 1];
            const b = pixels[pixelIndex + 2];
            const a = pixels[pixelIndex + 3];
            if (a > 128) {
              const scaledX = Math.floor(x * scale);
              const scaledY = Math.floor(y * scale);
              const size = Math.ceil(step * scale);
              drawCode += `
  fill(${r}, ${g}, ${b});
  triangle(${scaledX + size/2}, ${scaledY}, ${scaledX}, ${scaledY + size}, ${scaledX + size}, ${scaledY + size});`;
            }
          }
        }
        break;

      case 'lines':
        setupCode += `
  strokeCap(SQUARE);`;
        for (let y = 0; y < height; y += step) {
          for (let x = 0; x < width; x += step) {
            const pixelIndex = (y * width + x) * 4;
            const r = pixels[pixelIndex];
            const g = pixels[pixelIndex + 1];
            const b = pixels[pixelIndex + 2];
            const a = pixels[pixelIndex + 3];
            if (a > 128) {
              const brightness = (r + g + b) / 3;
              const lineHeight = brightness / 255 * (step * scale - 1) + 1;
              const scaledX = Math.floor(x * scale);
              const scaledY = Math.floor(y * scale);
              drawCode += `
  stroke(${r}, ${g}, ${b});
  strokeWeight(${Math.ceil(step * scale * 0.8)});
  line(${scaledX}, ${scaledY}, ${scaledX}, ${scaledY + lineHeight});`;
            }
          }
        }
        break;

      case 'dots':
        setupCode += `
  noStroke();`;
        for (let y = 0; y < height; y += step) {
          for (let x = 0; x < width; x += step) {
            const pixelIndex = (y * width + x) * 4;
            const r = pixels[pixelIndex];
            const g = pixels[pixelIndex + 1];
            const b = pixels[pixelIndex + 2];
            const a = pixels[pixelIndex + 3];
            if (a > 128) {
              const brightness = (r + g + b) / 3;
              const dotSize = brightness / 255 * (step * scale - 1) + 1;
              const scaledX = Math.floor(x * scale);
              const scaledY = Math.floor(y * scale);
              drawCode += `
  fill(${r}, ${g}, ${b});
  circle(${scaledX + step * scale / 2}, ${scaledY + step * scale / 2}, ${dotSize});`;
            }
          }
        }
        break;

      case 'ascii':
        setupCode += `
  textAlign(CENTER, CENTER);
  textSize(${Math.ceil(step * scale * 0.8)});
  fill(0);`;
        const chars = '@%#*+=-:. ';
        for (let y = 0; y < height; y += step) {
          for (let x = 0; x < width; x += step) {
            const pixelIndex = (y * width + x) * 4;
            const r = pixels[pixelIndex];
            const g = pixels[pixelIndex + 1];
            const b = pixels[pixelIndex + 2];
            const a = pixels[pixelIndex + 3];
            if (a > 128) {
              const brightness = (r + g + b) / 3;
              const charIndex = Math.floor((1 - brightness / 255) * (chars.length - 1));
              const char = chars[charIndex];
              const scaledX = Math.floor(x * scale);
              const scaledY = Math.floor(y * scale);
              drawCode += `
  text("${char}", ${scaledX + step * scale / 2}, ${scaledY + step * scale / 2});`;
            }
          }
        }
        break;

      case 'psychedelic':
        setupCode = `function setup() {
  createCanvas(${scaledWidth}, ${scaledHeight});
  colorMode(HSB, 360, 100, 100);
  noStroke();
}

let time = 0;

function draw() {
  time += 0.02;`;
        for (let y = 0; y < height; y += step) {
          for (let x = 0; x < width; x += step) {
            const pixelIndex = (y * width + x) * 4;
            const r = pixels[pixelIndex];
            const g = pixels[pixelIndex + 1];
            const b = pixels[pixelIndex + 2];
            const a = pixels[pixelIndex + 3];
            if (a > 128) {
              const brightness = (r + g + b) / 3;
              const scaledX = Math.floor(x * scale);
              const scaledY = Math.floor(y * scale);
              drawCode += `
  let hue = (${brightness} + sin(time + ${x * 0.01}) * 50 + cos(time + ${y * 0.01}) * 30) % 360;
  let sat = 80 + sin(time * 2 + ${x * 0.02}) * 20;
  let bright = 70 + sin(time * 1.5 + ${y * 0.02}) * 30;
  fill(hue, sat, bright);
  let size = ${Math.ceil(step * scale)} + sin(time + ${x * 0.03} + ${y * 0.03}) * 3;
  ellipse(${scaledX + step * scale / 2}, ${scaledY + step * scale / 2}, size, size);`;
            }
          }
        }
        break;

      case 'statue':
        setupCode += `
  noStroke();`;
        for (let y = 0; y < height; y += step) {
          for (let x = 0; x < width; x += step) {
            const pixelIndex = (y * width + x) * 4;
            const r = pixels[pixelIndex];
            const g = pixels[pixelIndex + 1];
            const b = pixels[pixelIndex + 2];
            const a = pixels[pixelIndex + 3];
            if (a > 128) {
              const brightness = (r + g + b) / 3;
              // Convert to marble-like grayscale with blue tint
              const marbleValue = Math.floor(brightness * 0.8 + 40);
              const scaledX = Math.floor(x * scale);
              const scaledY = Math.floor(y * scale);
              drawCode += `
  fill(${marbleValue - 20}, ${marbleValue - 10}, ${marbleValue + 15});
  rect(${scaledX}, ${scaledY}, ${Math.ceil(step * scale)}, ${Math.ceil(step * scale)});`;
            }
          }
        }
        break;

      case 'animation':
        setupCode = `function setup() {
  createCanvas(${scaledWidth}, ${scaledHeight});
  noStroke();
}

let frame = 0;

function draw() {
  background(255);
  frame += 0.05;`;
        for (let y = 0; y < height; y += step) {
          for (let x = 0; x < width; x += step) {
            const pixelIndex = (y * width + x) * 4;
            const r = pixels[pixelIndex];
            const g = pixels[pixelIndex + 1];
            const b = pixels[pixelIndex + 2];
            const a = pixels[pixelIndex + 3];
            if (a > 128) {
              const scaledX = Math.floor(x * scale);
              const scaledY = Math.floor(y * scale);
              drawCode += `
  let wave = sin(frame + ${x * 0.02} + ${y * 0.02}) * 5;
  let alpha = 200 + sin(frame * 2 + ${x * 0.01}) * 55;
  fill(${r}, ${g}, ${b}, alpha);
  circle(${scaledX + step * scale / 2} + wave, ${scaledY + step * scale / 2} + wave * 0.5, ${Math.ceil(step * scale)});`;
            }
          }
        }
        break;
    }

    const fullCode = setupCode + drawCode + `
}

// Helper function for mapping values
function map(value, start1, stop1, start2, stop2) {
  return start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1));
}`;

    return fullCode;
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
      const code = generateP5Code(imageData, artStyle);
      setGeneratedCode(code);
      setShowPreview(false);
      
      toast({
        title: "Conversion complete",
        description: `Your image has been converted to ${artStyles[artStyle].name} p5.js code!`
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
  }, [selectedFile, artStyle, analyzeImage, generateP5Code, toast]);

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

  const handlePreview = useCallback(() => {
    if (!generatedCode) return;

    if (showPreview) {
      setShowPreview(false);
      return;
    }

    setShowPreview(true);
  }, [generatedCode, showPreview]);

  // Effect to handle iframe creation when preview becomes visible
  useEffect(() => {
    if (!showPreview || !generatedCode || !previewRef.current) return;

    // Clear previous preview
    previewRef.current.innerHTML = '';

    // Create iframe for p5.js preview
    const iframe = document.createElement('iframe');
    iframe.style.width = '100%';
    iframe.style.height = '400px';
    iframe.style.border = '1px solid #e2e8f0';
    iframe.style.borderRadius = '8px';

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.7.0/p5.min.js"></script>
        <style>body { margin: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh; background: #f8f9fa; }</style>
      </head>
      <body>
        <script>
          ${generatedCode}
        </script>
      </body>
      </html>
    `;

    iframe.srcdoc = htmlContent;
    previewRef.current.appendChild(iframe);
  }, [showPreview, generatedCode]);

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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Art Style</label>
                    <Select value={artStyle} onValueChange={(value: ArtStyle) => setArtStyle(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(artStyles).map(([key, style]) => (
                          <SelectItem key={key} value={key}>
                            <div>
                              <div className="font-medium">{style.name}</div>
                              <div className="text-xs text-muted-foreground">{style.description}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-end">
                    <Button
                      onClick={handleConvert}
                      disabled={isProcessing}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      {isProcessing ? "Converting..." : "Convert to p5.js"}
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <Badge variant="secondary">
                    {selectedFile?.name}
                  </Badge>
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
        <>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Generated p5.js Code</CardTitle>
                  <CardDescription>
                    Copy and paste this code into a p5.js editor to see your art
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handlePreview} variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-50">
                    {showPreview ? "Hide Preview" : "Live Preview"}
                  </Button>
                  <Button onClick={handleCopyCode} variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-50">
                    Copy Code
                  </Button>
                </div>
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

          {showPreview && (
            <Card>
              <CardHeader>
                <CardTitle>Live Preview</CardTitle>
                <CardDescription>
                  Interactive p5.js canvas showing your generated art
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div ref={previewRef} className="w-full"></div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}