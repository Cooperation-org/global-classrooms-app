"use client";
import React from "react";

const DonationCertificate: React.FC = () => {
  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "0 auto",
        backgroundColor: "#ffffff",
        boxShadow:
          "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      {/* Header Section with Green Background */}
      <div
        style={{
          background: "linear-gradient(135deg, #4db6ac, #66bb6a)",
          padding: "60px 40px",
          textAlign: "center",
          color: "white",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "20px",
          }}
        >
          {/* Globe Icon */}
          <div
            style={{
              width: "60px",
              height: "60px",
              border: "3px solid white",
              borderRadius: "50%",
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            {/* Horizontal line through globe */}
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "12%",
                right: "12%",
                height: "2px",
                backgroundColor: "white",
                transform: "translateY(-50%)",
              }}
            />
            {/* Vertical line through globe */}
            <div
              style={{
                position: "absolute",
                top: "12%",
                bottom: "12%",
                left: "50%",
                width: "2px",
                backgroundColor: "white",
                transform: "translateX(-50%)",
              }}
            />
          </div>

          {/* Text */}
          <div style={{ textAlign: "left" }}>
            <h1
              style={{
                fontSize: "2.2rem",
                fontWeight: "bold",
                margin: "0 0 5px 0",
                lineHeight: 1.1,
              }}
            >
              Global Classrooms
            </h1>
            <p
              style={{
                fontSize: "1.1rem",
                margin: 0,
                opacity: 0.9,
                fontWeight: "normal",
              }}
            >
              Environmental Education Platform
            </p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div
        style={{
          padding: "60px 80px",
          textAlign: "center",
          backgroundColor: "#f5f5f5",
          lineHeight: 1.6,
        }}
      >
        <p
          style={{
            fontSize: "1.3rem",
            marginBottom: "40px",
            color: "#333",
            fontWeight: "normal",
            margin: "0 0 40px 0",
          }}
        >
          Sarah Johnson has dedicated a donation to
        </p>

        <h2
          style={{
            color: "#4db6ac",
            fontWeight: "bold",
            marginBottom: "40px",
            letterSpacing: "3px",
            fontSize: "2.2rem",
            margin: "0 0 40px 0",
          }}
        >
          GLOBAL CLASSROOM POOL
        </h2>

        <p
          style={{
            fontSize: "1.1rem",
            marginBottom: "15px",
            color: "#666",
            margin: "0 0 15px 0",
          }}
        >
          in honor of
        </p>

        <h3
          style={{
            color: "#4db6ac",
            fontWeight: "bold",
            marginBottom: "40px",
            fontSize: "2.2rem",
            margin: "0 0 40px 0",
          }}
        >
          Michael Anderson
        </h3>

        <p
          style={{
            fontSize: "1.3rem",
            marginBottom: "40px",
            color: "#333",
            margin: "0 0 40px 0",
          }}
        >
          This donation will help to grow 500 more trees.
        </p>

        {/* Dotted Separator */}
        <div
          style={{
            width: "100%",
            height: "2px",
            background: "transparent",
            borderTop: "3px dotted #999",
            margin: "40px 0",
          }}
        />

        <h4
          style={{
            fontWeight: "bold",
            marginBottom: "25px",
            color: "#333",
            fontSize: "1.4rem",
            margin: "0 0 25px 0",
          }}
        >
          Special Message:
        </h4>

        <p
          style={{
            marginBottom: "40px",
            lineHeight: 1.7,
            color: "#333",
            fontSize: "1rem",
            maxWidth: "600px",
            margin: "0 auto 40px auto",
          }}
        >
          Your commitment to the environment is inspiring. This donation in your
          honour will help create a greener future for generations to come.
          Thank you for being a catalyst for change.
        </p>

        {/* Dotted Separator */}
        <div
          style={{
            width: "100%",
            height: "2px",
            background: "transparent",
            borderTop: "3px dotted #999",
            margin: "40px 0",
          }}
        />

        <p
          style={{
            color: "#666",
            lineHeight: 1.6,
            fontSize: "0.95rem",
            maxWidth: "500px",
            margin: "0 auto",
          }}
        >
          You have received this message because a donation to Global Classroom
          pool was dedicated to you through our platform.
        </p>
      </div>
    </div>
  );
};

export default DonationCertificate;
