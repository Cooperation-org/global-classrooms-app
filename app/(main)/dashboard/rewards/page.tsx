"use client";
import React, { useState } from "react";
import {
  ArrowLeftIcon,
  StarIcon,
  QuestionMarkCircledIcon,
  Cross2Icon,
  ExternalLinkIcon,
} from "@radix-ui/react-icons";

const RewardsSection: React.FC = () => {
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

  const withdrawalLinks = [
    {
      title: "Export to TrustWallet",
      description: "Learn how to export your GoodDollar account to TrustWallet",
      url: "https://gimt.notion.site/How-to-Export-GoodDollar-to-TrustWallet-af52436fe4ad49868fa8742658fcf177",
    },
    {
      title: "Export to MetaMask",
      description: "Add G$ Token to your MetaMask wallet",
      url: "https://gimt.notion.site/How-to-Add-G-Token-on-MetaMask-0c04e9d36d064ea0b9395cd653ab605f",
    },
    {
      title: "Exchange to Celo Network",
      description: "Exchange your G$ to Celo Network using gooddapp.org",
      url: "https://gimt.notion.site/How-to-Exchange-GoodDollar-to-Celo-3ce82f3e811a47a787a70b2149b35a7d",
    },
    {
      title: "Swapping & Withdrawal Guide",
      description:
        "Convert, withdraw and exchange funds using various platforms",
      url: "https://gooddollar.notion.site/Swapping-withdrawal-Guide-c252069f90f4429b81961dbf6928e7ca",
    },
  ];

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "0 16px" }}>
      {/* Header Section */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "24px",
          paddingTop: "16px",
          paddingBottom: "16px",
          backgroundColor: "#e8f5e8",
          borderRadius: "8px",
          padding: "16px",
        }}
      >
        <button
          style={{
            marginRight: "16px",
            color: "#666",
            background: "none",
            border: "none",
            padding: "8px",
            borderRadius: "50%",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "background-color 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.04)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
          }}
        >
          <ArrowLeftIcon width={24} height={24} />
        </button>
        <div>
          <h1
            style={{
              fontSize: "1.5rem",
              fontWeight: 600,
              color: "#333",
              margin: "0 0 4px 0",
            }}
          >
            Rewards & Certificates
          </h1>
          <p
            style={{
              color: "#666",
              fontSize: "0.875rem",
              margin: 0,
            }}
          >
            Your earned tokens, certificates, and impact recognition
          </p>
        </div>
      </div>

      {/* Tokens Card */}
      <div
        style={{
          background: "linear-gradient(135deg, #e8eaf6 0%, #f3e5f5 100%)",
          border: "none",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          borderRadius: "8px",
          textAlign: "center",
          padding: "40px 16px",
          marginBottom: "24px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <StarIcon
            width={48}
            height={48}
            style={{
              color: "#5e35b1",
              marginBottom: "8px",
            }}
          />
          <h2
            style={{
              fontWeight: 700,
              color: "#5e35b1",
              fontSize: "3rem",
              lineHeight: 1,
              margin: 0,
            }}
          >
            0
          </h2>
          <p
            style={{
              color: "#5e35b1",
              fontWeight: 500,
              fontSize: "1rem",
              margin: 0,
            }}
          >
            G$ Tokens
          </p>
        </div>
      </div>

      {/* Withdrawal Help Section */}
      <div
        style={{
          backgroundColor: "#f8f9fa",
          borderRadius: "8px",
          padding: "20px",
          border: "1px solid #e9ecef",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "12px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <QuestionMarkCircledIcon
              width={20}
              height={20}
              style={{ color: "#5e35b1" }}
            />
            <h3
              style={{
                fontSize: "1rem",
                fontWeight: 600,
                color: "#333",
                margin: 0,
              }}
            >
              Need help withdrawing G$?
            </h3>
          </div>
          <button
            onClick={() => setShowWithdrawModal(true)}
            style={{
              backgroundColor: "#5e35b1",
              color: "white",
              border: "none",
              padding: "8px 16px",
              borderRadius: "6px",
              fontSize: "0.875rem",
              fontWeight: 500,
              cursor: "pointer",
              transition: "background-color 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#4527a0";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#5e35b1";
            }}
          >
            View Guides
          </button>
        </div>
        <p
          style={{
            color: "#666",
            fontSize: "0.875rem",
            margin: 0,
            lineHeight: 1.5,
          }}
        >
          Learn how to export your account to wallets, exchange tokens, and
          withdraw your funds with our step-by-step guides.
        </p>
      </div>

      {/* Modal */}
      {showWithdrawModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "16px",
          }}
          onClick={() => setShowWithdrawModal(false)}
        >
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "12px",
              maxWidth: "500px",
              width: "100%",
              maxHeight: "80vh",
              overflow: "auto",
              boxShadow:
                "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "20px 24px 16px",
                borderBottom: "1px solid #e9ecef",
              }}
            >
              <h2
                style={{
                  fontSize: "1.25rem",
                  fontWeight: 600,
                  color: "#333",
                  margin: 0,
                }}
              >
                G$ Withdrawal Guides
              </h2>
              <button
                onClick={() => setShowWithdrawModal(false)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#666",
                  cursor: "pointer",
                  padding: "4px",
                  borderRadius: "4px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Cross2Icon width={20} height={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div style={{ padding: "20px 24px" }}>
              <p
                style={{
                  color: "#666",
                  fontSize: "0.875rem",
                  marginBottom: "20px",
                  lineHeight: 1.5,
                }}
              >
                To withdraw G$, kindly follow these step-by-step guides:
              </p>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                {withdrawalLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "16px",
                      backgroundColor: "#f8f9fa",
                      borderRadius: "8px",
                      textDecoration: "none",
                      color: "#333",
                      border: "1px solid #e9ecef",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#e9ecef";
                      e.currentTarget.style.transform = "translateY(-1px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "#f8f9fa";
                      e.currentTarget.style.transform = "translateY(0)";
                    }}
                  >
                    <div>
                      <h4
                        style={{
                          fontSize: "0.9rem",
                          fontWeight: 600,
                          color: "#5e35b1",
                          margin: "0 0 4px 0",
                        }}
                      >
                        {link.title}
                      </h4>
                      <p
                        style={{
                          fontSize: "0.8rem",
                          color: "#666",
                          margin: 0,
                          lineHeight: 1.4,
                        }}
                      >
                        {link.description}
                      </p>
                    </div>
                    <ExternalLinkIcon
                      width={16}
                      height={16}
                      style={{
                        color: "#5e35b1",
                        flexShrink: 0,
                        marginLeft: "12px",
                      }}
                    />
                  </a>
                ))}

                {/* 🔗 Slack Button */}
                <a
                  href="https://join.slack.com/your-workspace-link" // ← REPLACE with your actual Slack invite link
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "14px",
                    backgroundColor: "#4A154B",
                    borderRadius: "8px",
                    textDecoration: "none",
                    color: "#fff",
                    fontWeight: 600,
                    transition: "background-color 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#7B2E7D";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#4A154B";
                  }}
                >
                  Join the Conversation on Slack
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RewardsSection;
