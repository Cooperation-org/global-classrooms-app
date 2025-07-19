"use client";
import React from "react";
import { useSearchParams } from "next/navigation";

const DonationThankYouPage: React.FC = () => {
  const searchParams = useSearchParams();
  const amount = searchParams.get('amount') || '100';

  return (
    <div
      style={{
        fontFamily: "system-ui, sans-serif",
        backgroundColor: "#f8f9fa",
        minHeight: "100vh",
        padding: "20px",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "40px",
          alignItems: "start",
        }}
      >
        {/* Left Section */}
        <div
          style={{
            backgroundColor: "white",
            padding: "40px",
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <h1
              style={{
                fontSize: "2rem",
                fontWeight: "bold",
                color: "#333",
                marginBottom: "8px",
              }}
            >
              Support Global Classrooms
            </h1>
            <p
              style={{
                color: "#666",
                fontSize: "1rem",
              }}
            >
              Help us empower students to create environmental change
            </p>
          </div>

          {/* Why Donate Section */}
          <div style={{ marginBottom: "40px" }}>
            <h2
              style={{
                fontSize: "1.5rem",
                fontWeight: "bold",
                color: "#333",
                marginBottom: "20px",
              }}
            >
              Why Donate?
            </h2>

            <div
              style={{ display: "flex", flexDirection: "column", gap: "20px" }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "15px",
                }}
              >
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    backgroundColor: "#e8f5e8",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "20px",
                  }}
                >
                  👥
                </div>
                <div>
                  <h3
                    style={{
                      fontSize: "1.1rem",
                      fontWeight: "bold",
                      color: "#333",
                      marginBottom: "4px",
                    }}
                  >
                    Empower Students
                  </h3>
                  <p style={{ color: "#666", fontSize: "0.9rem" }}>
                    Support students in implementing environmental projects
                  </p>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "15px",
                }}
              >
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    backgroundColor: "#e3f2fd",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "20px",
                  }}
                >
                  🏫
                </div>
                <div>
                  <h3
                    style={{
                      fontSize: "1.1rem",
                      fontWeight: "bold",
                      color: "#333",
                      marginBottom: "4px",
                    }}
                  >
                    Equip Schools
                  </h3>
                  <p style={{ color: "#666", fontSize: "0.9rem" }}>
                    Provide schools with sustainable technology and resources
                  </p>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "15px",
                }}
              >
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    backgroundColor: "#f3e5f5",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "20px",
                  }}
                >
                  🌍
                </div>
                <div>
                  <h3
                    style={{
                      fontSize: "1.1rem",
                      fontWeight: "bold",
                      color: "#333",
                      marginBottom: "4px",
                    }}
                  >
                    Global Impact
                  </h3>
                  <p style={{ color: "#666", fontSize: "0.9rem" }}>
                    Create lasting environmental change across communities
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Our Impact So Far */}
          <div style={{ marginBottom: "40px" }}>
            <h2
              style={{
                fontSize: "1.5rem",
                fontWeight: "bold",
                color: "#333",
                marginBottom: "20px",
              }}
            >
              Our Impact So Far
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "20px",
              }}
            >
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    fontSize: "2.5rem",
                    fontWeight: "bold",
                    color: "#4caf50",
                  }}
                >
                  1,200+
                </div>
                <p style={{ color: "#666", fontSize: "0.9rem" }}>
                  Students Engaged
                </p>
              </div>

              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    fontSize: "2.5rem",
                    fontWeight: "bold",
                    color: "#2196f3",
                  }}
                >
                  25
                </div>
                <p style={{ color: "#666", fontSize: "0.9rem" }}>
                  Schools Connected
                </p>
              </div>

              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    fontSize: "2.5rem",
                    fontWeight: "bold",
                    color: "#9c27b0",
                  }}
                >
                  45
                </div>
                <p style={{ color: "#666", fontSize: "0.9rem" }}>
                  Projects Funded
                </p>
              </div>

              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    fontSize: "2.5rem",
                    fontWeight: "bold",
                    color: "#ff5722",
                  }}
                >
                  12
                </div>
                <p style={{ color: "#666", fontSize: "0.9rem" }}>
                  Countries Reached
                </p>
              </div>
            </div>
          </div>

          {/* Featured Projects */}
          <div>
            <h2
              style={{
                fontSize: "1.5rem",
                fontWeight: "bold",
                color: "#333",
                marginBottom: "20px",
              }}
            >
              Featured Projects Needing Support
            </h2>

            <div
              style={{ display: "flex", flexDirection: "column", gap: "15px" }}
            >
              {[
                { name: "Water Conservation System", amount: "$2,500" },
                { name: "School Garden Project", amount: "$2,500" },
                { name: "Recycling Program", amount: "$2,500" },
              ].map((project, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "15px",
                    backgroundColor: "#f8f9fa",
                    borderRadius: "8px",
                  }}
                >
                  <div>
                    <h4
                      style={{
                        fontSize: "1rem",
                        fontWeight: "bold",
                        color: "#333",
                        marginBottom: "4px",
                      }}
                    >
                      {project.name}
                    </h4>
                    <p style={{ color: "#666", fontSize: "0.9rem" }}>
                      Needs {project.amount}
                    </p>
                  </div>
                  <button
                    style={{
                      backgroundColor: "transparent",
                      border: "1px solid #4caf50",
                      color: "#4caf50",
                      padding: "8px 16px",
                      borderRadius: "6px",
                      fontSize: "0.9rem",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                    }}
                  >
                    Support →
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Section - Thank You Card */}
        <div
          style={{
            backgroundColor: "white",
            padding: "60px 40px 40px 40px",
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            position: "sticky",
            top: "20px",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "500px",
          }}
        >
          {/* Success Icon */}
          <div
            style={{
              width: "120px",
              height: "120px",
              backgroundColor: "#4caf50",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "30px",
              position: "relative",
            }}
          >
            {/* Checkmark Icon */}
            <svg
              width="60"
              height="60"
              viewBox="0 0 60 60"
              fill="none"
              style={{ color: "white" }}
            >
              <path
                d="M20 30 L27 37 L40 23"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            {/* Radiating lines around the circle */}
            <div
              style={{
                position: "absolute",
                width: "160px",
                height: "160px",
                top: "-20px",
                left: "-20px",
              }}
            >
              {Array.from({ length: 12 }, (_, i) => (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    width: "3px",
                    height: "15px",
                    backgroundColor: "#4caf50",
                    borderRadius: "2px",
                    top: "10px",
                    left: "50%",
                    transformOrigin: "50% 70px",
                    transform: `translateX(-50%) rotate(${i * 30}deg)`,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Thank You Message */}
          <h1
            style={{
              fontSize: "2rem",
              fontWeight: "bold",
              color: "#333",
              marginBottom: "15px",
              lineHeight: 1.2,
            }}
          >
            Thank you for your donation!
          </h1>

          <p
            style={{
              color: "#666",
              fontSize: "1rem",
              marginBottom: "30px",
            }}
          >
            Your contribution will help empower students to create environmental change. A receipt has been sent to your email.
          </p>

          {/* Donation Amount Display */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "15px",
              backgroundColor: "#f8f9fa",
              padding: "20px 30px",
              borderRadius: "10px",
              border: "1px solid #e9ecef",
              marginBottom: "30px",
            }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                backgroundColor: "#e9ecef",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#666"
                strokeWidth="2"
              >
                <path d="M12 1v22" />
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </div>
            <span
              style={{
                fontSize: "1.5rem",
                fontWeight: "bold",
                color: "#333",
              }}
            >
              ${amount}
            </span>
          </div>

          {/* Download Buttons */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "15px",
              width: "100%",
              maxWidth: "300px",
            }}
          >
            {/* Download Receipt Button */}
            <button
              onClick={() => {
                // Handle download receipt functionality
                console.log("Download receipt clicked");
              }}
              style={{
                width: "100%",
                padding: "15px 20px",
                backgroundColor: "#333",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "1rem",
                fontWeight: "bold",
                cursor: "pointer",
                transition: "background-color 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#555";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#333";
              }}
            >
              Download Receipt
            </button>

            {/* Download Certificate of Honor Button */}
            <button
              onClick={() => {
                // Handle download certificate functionality
                console.log("Download certificate of honor clicked");
              }}
              style={{
                width: "100%",
                padding: "15px 20px",
                backgroundColor: "#333",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "1rem",
                fontWeight: "bold",
                cursor: "pointer",
                transition: "background-color 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#555";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#333";
              }}
            >
              Download Certificate of Honor
            </button>

            {/* Back to Dashboard Button */}
            <button
              onClick={() => {
                window.location.href = '/dashboard';
              }}
              style={{
                width: "100%",
                padding: "15px 20px",
                backgroundColor: "transparent",
                color: "#333",
                border: "1px solid #333",
                borderRadius: "8px",
                fontSize: "1rem",
                fontWeight: "bold",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#333";
                e.currentTarget.style.color = "white";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "#333";
              }}
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonationThankYouPage; 