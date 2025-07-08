"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { PaymentIntent } from "@stripe/stripe-js";
import StripePaymentForm from "@/app/components/payments/StripePaymentForm";
import { useConnect, useAccount, useSendTransaction, usePrepareSendTransaction } from 'wagmi';

const DONATION_WALLET_ADDRESS = '0xYourDonationWalletAddressHere'; // TODO: Replace with your actual donation address

const DonationPage: React.FC = () => {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [paymentMode, setPaymentMode] = useState("card");
  const [recipientName, setRecipientName] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sendECard, setSendECard] = useState(false);
  const [purpose, setPurpose] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [donationAmount, setDonationAmount] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const predefinedAmounts = [10, 25, 50, 100, 250, 500];
  const { connect, connectors, isPending: isConnecting } = useConnect();
  const { address, isConnected } = useAccount();

  // Prepare transaction (ETH, not ERC-20)
  const { config: sendTxConfig } = usePrepareSendTransaction({
    to: DONATION_WALLET_ADDRESS,
    value: getCurrentAmount() > 0 ? BigInt(Math.floor(getCurrentAmount() * 1e18)) : undefined, // ETH to wei
    enabled: paymentMode === 'goodcollective' && getCurrentAmount() > 0,
  });
  const { sendTransaction, isLoading: isTxLoading, isSuccess: isTxSuccess, isError: isTxError, error: txError, data: txData } = useSendTransaction(sendTxConfig);

  const getCurrentAmount = () => {
    if (selectedAmount) return selectedAmount;
    if (customAmount) {
      const parsed = parseFloat(customAmount);
      return isNaN(parsed) ? 0 : parsed;
    }
    return 0;
  };

  const handlePaymentSuccess = (paymentIntent: PaymentIntent) => {
    setPaymentSuccess(true);
    setDonationAmount(getCurrentAmount());
    console.log('Payment successful:', paymentIntent.id);
    // You can redirect to thank you page or show success message
    setTimeout(() => {
      router.push('/dashboard/donatecreditcard/thank-you');
    }, 2000);
  };

  const handlePaymentError = (error: string) => {
    setError(error);
    setIsLoading(false);
  };

  // Wallet payment handler
  const handleWalletPayment = async () => {
    setError(null);
    setIsLoading(true);
    try {
      if (!isConnected) {
        // Connect wallet
        const connector = connectors[0];
        if (!connector) throw new Error('No wallet connector found');
        await connect({ connector });
      }
      // Send transaction
      sendTransaction?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Wallet payment failed');
      setIsLoading(false);
    }
  };

  // Watch for transaction success
  React.useEffect(() => {
    if (isTxSuccess && txData) {
      setPaymentSuccess(true);
      setDonationAmount(getCurrentAmount());
      setTimeout(() => {
        router.push('/dashboard/donatecreditcard/thank-you');
      }, 2000);
    }
    if (isTxError && txError) {
      setError(txError.message);
      setIsLoading(false);
    }
  }, [isTxSuccess, isTxError, txError, txData]);

  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
          <p className="text-gray-600 mb-4">Thank you for your donation of ${donationAmount.toFixed(2)}</p>
          <p className="text-sm text-gray-500">Redirecting to thank you page...</p>
        </div>
      </div>
    );
  }

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

        {/* Right Section - Payment Form */}
        <div
          style={{
            backgroundColor: "white",
            padding: "40px",
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            position: "sticky",
            top: "20px",
          }}
        >
          {/* Make a Donation Header */}
          <div style={{ textAlign: "center", marginBottom: "30px" }}>
            <div
              style={{
                width: "50px",
                height: "50px",
                backgroundColor: "#fee",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 15px",
                fontSize: "24px",
              }}
            >
              ❤️
            </div>
            <h2
              style={{
                fontSize: "1.5rem",
                fontWeight: "bold",
                color: "#333",
                marginBottom: "8px",
              }}
            >
              Make a Donation
            </h2>
            <p style={{ color: "#666", fontSize: "0.9rem" }}>
              Choose an amount to donate
            </p>
          </div>

          {/* Amount Selection */}
          <div style={{ marginBottom: "25px" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "10px",
                marginBottom: "15px",
              }}
            >
              {predefinedAmounts.map((amount) => (
                <button
                  key={amount}
                  onClick={() => {
                    setSelectedAmount(amount);
                    setCustomAmount("");
                  }}
                  style={{
                    padding: "12px",
                    border:
                      selectedAmount === amount
                        ? "2px solid #4caf50"
                        : "1px solid #ddd",
                    backgroundColor:
                      selectedAmount === amount ? "#f0f8f0" : "white",
                    borderRadius: "8px",
                    fontSize: "1rem",
                    fontWeight: "bold",
                    cursor: "pointer",
                    color: selectedAmount === amount ? "#4caf50" : "#333",
                  }}
                >
                  ${amount}
                </button>
              ))}
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "0.9rem",
                  fontWeight: "bold",
                  color: "#333",
                  marginBottom: "8px",
                }}
              >
                Custom Amount
              </label>
              <input
                type="number"
                placeholder="Custom Amount"
                value={customAmount}
                onChange={(e) => {
                  setCustomAmount(e.target.value);
                  setSelectedAmount(null);
                }}
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  fontSize: "1rem",
                }}
              />
            </div>
          </div>

          {/* Payment Mode */}
          <div style={{ marginBottom: "25px" }}>
            <label
              style={{
                display: "block",
                fontSize: "0.9rem",
                fontWeight: "bold",
                color: "#333",
                marginBottom: "15px",
              }}
            >
              Payment Mode
            </label>

            <div
              style={{ display: "flex", flexDirection: "column", gap: "12px" }}
            >
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  cursor: "pointer",
                }}
              >
                <input
                  type="radio"
                  name="paymentMode"
                  value="card"
                  checked={paymentMode === "card"}
                  onChange={(e) => setPaymentMode(e.target.value)}
                />
                <div>
                  <div style={{ fontWeight: "bold", color: "#333" }}>Card</div>
                  <div style={{ fontSize: "0.8rem", color: "#666" }}>
                    Pay securely with Visa, Mastercard, Amex or Discover
                  </div>
                </div>
              </label>

              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  cursor: "pointer",
                }}
              >
                <input
                  type="radio"
                  name="paymentMode"
                  value="goodcollective"
                  checked={paymentMode === "goodcollective"}
                  onChange={(e) => setPaymentMode(e.target.value)}
                />
                <div>
                  <div style={{ fontWeight: "bold", color: "#333" }}>
                    Pay with GoodCollective
                  </div>
                  <div style={{ fontSize: "0.8rem", color: "#666" }}>
                    Connect your GoodDollar wallet to donate with G$
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Stripe Payment Form - only if Card selected */}
          {paymentMode === "card" && getCurrentAmount() > 0 && (
            <div style={{ marginBottom: "25px" }}>
              <StripePaymentForm
                amount={getCurrentAmount()}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
              />
            </div>
          )}

          {/* Pay with Wallet Button - only if Wallet selected */}
          {paymentMode === "goodcollective" && (
            <div style={{ marginBottom: "25px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "0.9rem",
                  fontWeight: "bold",
                  color: "#333",
                  marginBottom: "8px",
                }}
              >
                Connect GoodCollective Wallet
              </label>
              <button
                style={{
                  width: "100%",
                  padding: "12px",
                  backgroundColor: isTxLoading || isLoading ? "#888" : "#333",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "1rem",
                  fontWeight: "bold",
                  cursor: isTxLoading || isLoading ? "not-allowed" : "pointer",
                }}
                onClick={handleWalletPayment}
                disabled={isTxLoading || isLoading || getCurrentAmount() <= 0}
              >
                {isTxLoading || isLoading ? 'Processing...' : isConnected ? 'Pay with Wallet' : 'Connect Wallet'}
              </button>
              {isTxSuccess && txData && (
                <div style={{ color: 'green', marginTop: 8 }}>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div
              style={{
                backgroundColor: "#fee",
                color: "#c33",
                padding: "12px",
                borderRadius: "8px",
                fontSize: "0.9rem",
                marginBottom: "15px",
              }}
            >
              {error}
            </div>
          )}

          {/* Dedicate Donation */}
          <div style={{ marginBottom: "25px" }}>
            <label
              style={{
                display: "block",
                fontSize: "0.9rem",
                fontWeight: "bold",
                color: "#333",
                marginBottom: "15px",
              }}
            >
              Dedicate this Donation (optional)
            </label>

            <select
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              style={{
                width: "100%",
                padding: "12px",
                border: "1px solid #ddd",
                borderRadius: "8px",
                fontSize: "1rem",
                marginBottom: "15px",
              }}
            >
              <option value="">Purpose</option>
              <option value="memorial">In Memory Of</option>
              <option value="honor">In Honor Of</option>
              <option value="celebration">In Celebration Of</option>
            </select>

            <input
              type="text"
              placeholder="Recipient Name"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              style={{
                width: "100%",
                padding: "12px",
                border: "1px solid #ddd",
                borderRadius: "8px",
                fontSize: "1rem",
                marginBottom: "15px",
              }}
            />

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "15px",
              }}
            >
              <input
                type="checkbox"
                id="sendECard"
                checked={sendECard}
                onChange={(e) => setSendECard(e.target.checked)}
              />
              <label
                htmlFor="sendECard"
                style={{
                  fontSize: "0.9rem",
                  color: "#333",
                }}
              >
                Send an E-card?
              </label>
            </div>

            {sendECard && (
              <input
                type="email"
                placeholder="Recipient Email"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  fontSize: "1rem",
                  marginBottom: "15px",
                }}
              />
            )}

            <textarea
              placeholder="Message on Card (Optional)"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              style={{
                width: "100%",
                padding: "12px",
                border: "1px solid #ddd",
                borderRadius: "8px",
                fontSize: "1rem",
                resize: "vertical",
              }}
            />
          </div>

          <p
            style={{
              textAlign: "center",
              fontSize: "0.8rem",
              color: "#666",
            }}
          >
            All donations are processed securely
          </p>
        </div>
      </div>
    </div>
  );
};

export default DonationPage;
