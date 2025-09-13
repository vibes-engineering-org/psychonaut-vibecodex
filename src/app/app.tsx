"use client";

import ImageToCodeArt from "~/components/ImageToCodeArt";

export default function App() {
  return (
    <div className="max-w-6xl mx-auto py-8 px-4 min-h-screen bg-background">
      <div className="space-y-8">
        <div className="text-center space-y-4 bg-card border border-border rounded-lg p-8 shadow-sm">
          <h1 className="text-4xl font-bold tracking-tight text-primary">
            Image to Code Art
          </h1>
          <p className="text-lg text-muted-foreground">
            Transform your images into beautiful p5.js code art
          </p>
        </div>
        
        <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
          <ImageToCodeArt />
        </div>
      </div>
    </div>
  );
}
