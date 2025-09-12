"use client";

import ImageToCodeArt from "~/components/ImageToCodeArt";

export default function App() {
  return (
    <div className="max-w-6xl mx-auto py-8 px-4 min-h-screen">
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-semibold tracking-tight">
            Image to Code Art
          </h1>
          <p className="text-lg text-muted-foreground">
            Transform your images into beautiful p5.js code art
          </p>
        </div>
        
        <ImageToCodeArt />
      </div>
    </div>
  );
}
