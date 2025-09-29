"use client";

import ImageToCodeArt from "~/components/ImageToCodeArt";

export default function App() {
  return (
    <div className="max-w-6xl mx-auto py-8 px-4 min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="space-y-8">
        <div className="text-center space-y-4 bg-white border-2 border-blue-200 rounded-lg p-8 shadow-lg">
          <h1 className="text-4xl font-bold tracking-tight text-blue-800">
            Image to Code Art Studio
          </h1>
          <p className="text-lg text-blue-600">
            Transform your images into beautiful p5.js code art with filters and animations
          </p>
        </div>

        <div className="bg-white border-2 border-blue-200 rounded-lg p-6 shadow-lg">
          <ImageToCodeArt />
        </div>
      </div>
    </div>
  );
}
