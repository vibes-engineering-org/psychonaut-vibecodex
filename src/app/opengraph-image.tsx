import { ImageResponse } from "next/og";
import {
  PROJECT_TITLE,
  PROJECT_DESCRIPTION,
  PROJECT_AVATAR_URL,
} from "~/lib/constants";

export const alt = PROJECT_TITLE;
export const contentType = "image/png";
export const size = {
  width: 1200,
  height: 630,
};

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          backgroundColor: "#1a1a1a",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background gradient optimized for code art theme */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)",
          }}
        />

        {/* Code-inspired pattern overlay */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage:
              "radial-gradient(circle at 25% 25%, rgba(79, 172, 254, 0.1) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(255, 121, 198, 0.1) 0%, transparent 50%)",
          }}
        />

        {/* Main content container - centered in safe zone */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
            padding: "60px",
            position: "relative",
            zIndex: 10,
          }}
        >
          {/* Visual representation of image-to-code conversion */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "40px",
              marginBottom: "48px",
              position: "relative",
            }}
          >
            {/* Image representation */}
            <div
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "12px",
                background: "linear-gradient(45deg, #ff6b6b, #feca57)",
                border: "3px solid rgba(255, 255, 255, 0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 8px 24px rgba(0, 0, 0, 0.3)",
              }}
            >
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                  borderRadius: "6px",
                }}
              />
            </div>
            
            {/* Arrow indicating transformation */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                color: "#4facfe",
                fontSize: "48px",
                fontWeight: "bold",
              }}
            >
              →
            </div>
            
            {/* Code representation */}
            <div
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "12px",
                background: "linear-gradient(45deg, #4facfe, #00f2fe)",
                border: "3px solid rgba(255, 255, 255, 0.2)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "4px",
                boxShadow: "0 8px 24px rgba(0, 0, 0, 0.3)",
              }}
            >
              <div
                style={{
                  width: "50px",
                  height: "6px",
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                  borderRadius: "3px",
                }}
              />
              <div
                style={{
                  width: "40px",
                  height: "6px",
                  backgroundColor: "rgba(255, 255, 255, 0.7)",
                  borderRadius: "3px",
                }}
              />
              <div
                style={{
                  width: "45px",
                  height: "6px",
                  backgroundColor: "rgba(255, 255, 255, 0.8)",
                  borderRadius: "3px",
                }}
              />
            </div>
          </div>

          {/* Project title with high contrast */}
          <h1
            style={{
              fontSize: PROJECT_TITLE.length > 25 ? "65px" : "72px",
              fontWeight: "900",
              color: "#ffffff",
              textAlign: "center",
              marginBottom: "40px",
              lineHeight: 1.1,
              letterSpacing: "-2px",
              textShadow: "0 6px 20px rgba(0, 0, 0, 0.4)",
              maxWidth: "1100px",
              fontFamily: "system-ui, -apple-system, sans-serif",
              whiteSpace: PROJECT_TITLE.length > 40 ? "normal" : "nowrap",
              paddingLeft: "20px",
              paddingRight: "20px",
            }}
          >
            {PROJECT_TITLE}
          </h1>

          {/* Project description */}
          <p
            style={{
              fontSize: "36px",
              fontWeight: "600",
              color: "rgba(255, 255, 255, 0.95)",
              textAlign: "center",
              marginBottom: "56px",
              lineHeight: 1.3,
              textShadow: "0 3px 12px rgba(0, 0, 0, 0.4)",
              maxWidth: "800px",
              fontFamily: "system-ui, -apple-system, sans-serif",
            }}
          >
            {PROJECT_DESCRIPTION}
          </p>

          {/* Mini App branding with code theme */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              padding: "20px 40px",
              backgroundColor: "rgba(79, 172, 254, 0.15)",
              borderRadius: "50px",
              border: "2px solid rgba(79, 172, 254, 0.3)",
              backdropFilter: "blur(10px)",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
            }}
          >
            {/* Code brackets icon */}
            <div
              style={{
                fontSize: "32px",
                fontWeight: "bold",
                color: "#4facfe",
                fontFamily: "monospace",
              }}
            >
              &lt;/&gt;
            </div>
            <span
              style={{
                fontSize: "26px",
                fontWeight: "700",
                color: "#ffffff",
                fontFamily: "system-ui, -apple-system, sans-serif",
                letterSpacing: "-0.5px",
              }}
            >
              Farcaster Mini App
            </span>
          </div>
        </div>

        {/* Bottom gradient fade for depth */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "200px",
            background:
              "linear-gradient(to top, rgba(0, 0, 0, 0.4) 0%, transparent 100%)",
          }}
        />
      </div>
    ),
    {
      ...size,
    },
  );
}
