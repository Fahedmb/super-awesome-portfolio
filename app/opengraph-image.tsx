import { ImageResponse } from "next/og";

export const alt = "Fahed Mbarek // Full-Stack Software Engineer & AI Systems Architect";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "space-between",
          backgroundColor: "#0a0a0c",
          backgroundImage:
            "radial-gradient(circle at 85% 15%, rgba(255, 214, 0, 0.15) 0%, transparent 50%), radial-gradient(circle at 15% 85%, rgba(180, 83, 9, 0.2) 0%, transparent 50%)",
          padding: "60px 80px",
          fontFamily: "sans-serif",
          color: "white",
          border: "2px solid rgba(255, 214, 0, 0.25)",
        }}
      >
        {/* Top Status & Brand Pill */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "8px 18px",
            borderRadius: "9999px",
            backgroundColor: "rgba(255, 214, 0, 0.1)",
            border: "1px solid rgba(255, 214, 0, 0.3)",
          }}
        >
          <div
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "9999px",
              backgroundColor: "#10b981",
            }}
          />
          <span
            style={{
              color: "#ffd600",
              fontSize: "16px",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            FAHED MBAREK // OFFICIAL PORTFOLIO &amp; SYSTEMS
          </span>
        </div>

        {/* Main Hero Typography */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div
            style={{
              fontSize: "64px",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              lineHeight: 1.05,
              color: "#ffffff",
            }}
          >
            Fahed Mbarek
          </div>
          <div
            style={{
              fontSize: "32px",
              fontWeight: 500,
              color: "#f59e0b",
              lineHeight: 1.2,
            }}
          >
            Full-Stack Software Engineer &amp; AI Systems Architect
          </div>
          <div
            style={{
              fontSize: "20px",
              color: "#a3a3a3",
              maxWidth: "850px",
              lineHeight: 1.4,
              marginTop: "8px",
            }}
          >
            National Engineering Diploma • Distributed Java/Spring Boot Microservices • Next.js &amp; React • AI Integrations • 3+ Years Client Delivery
          </div>
        </div>

        {/* Bottom Badges */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            borderTop: "1px solid rgba(255, 255, 255, 0.12)",
            paddingTop: "24px",
          }}
        >
          <div style={{ display: "flex", gap: "12px" }}>
            <div
              style={{
                padding: "6px 14px",
                borderRadius: "8px",
                backgroundColor: "rgba(255, 255, 255, 0.06)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                color: "#e5e5e5",
                fontSize: "14px",
                fontWeight: 600,
              }}
            >
              JAVA / SPRING BOOT
            </div>
            <div
              style={{
                padding: "6px 14px",
                borderRadius: "8px",
                backgroundColor: "rgba(255, 255, 255, 0.06)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                color: "#e5e5e5",
                fontSize: "14px",
                fontWeight: 600,
              }}
            >
              NEXT.JS / REACT
            </div>
            <div
              style={{
                padding: "6px 14px",
                borderRadius: "8px",
                backgroundColor: "rgba(255, 214, 0, 0.1)",
                border: "1px solid rgba(255, 214, 0, 0.25)",
                color: "#ffd600",
                fontSize: "14px",
                fontWeight: 600,
              }}
            >
              AI &amp; DATA SYSTEMS
            </div>
          </div>

          <div
            style={{
              fontSize: "16px",
              color: "#ffd600",
              fontWeight: 700,
              letterSpacing: "0.05em",
            }}
          >
            FAHEDMBAREK.COM
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
