"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const DonationForm = () => {
  const [paymentMode, setPaymentMode] = useState<'stripe' | 'wallet'>('stripe');
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [donationAmount, setDonationAmount] = useState(0);
  
  // Dedication state
  const [recipientName, setRecipientName] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sendECard, setSendECard] = useState(false);
  const [purpose, setPurpose] = useState("");

  const getCurrentAmount = () => {
    if (selectedAmount) return selectedAmount;
    if (customAmount) {
      const parsed = parseFloat(customAmount);
      return isNaN(parsed) ? 0 : parsed;
    }
    return 0;
  };

  const handleStripeCheckout = async () => {
    const amount = getCurrentAmount();
    if (amount <= 0) {
      setError('Please select or enter a valid amount');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: Math.round(amount * 100), // Convert to cents
          donorName: 'Anonymous', // You can get this from user profile or form
          donorEmail: 'donor@example.com', // You can get this from user profile or form
          purpose,
          recipientName,
          recipientEmail,
          message,
          sendECard,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setIsLoading(false);
    }
  };

  const handleWalletPayment = () => {
    alert('Wallet payment coming soon!');
  };

  if (paymentSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
          <p className="text-gray-600 mb-4">Thank you for your donation of ${donationAmount.toFixed(2)}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-10 bg-white min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
        {/* Left Section */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-semibold mb-2">
              Support Global Classrooms
            </h1>
            <p className="text-gray-600">
              Help us empower students to create environmental change
            </p>
          </div>

          <Card>
            <CardContent className="p-6 space-y-4">
              <h2 className="text-lg font-semibold">Why Donate?</h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li className="flex items-start gap-3">
                  <img src="/empower.png" alt="Icon" className="w-6 h-6 mt-1" />
                  <div>
                    <strong>Empower Students:</strong> Support students in
                    implementing environmental projects
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <img src="/equip.png" alt="Icon" className="w-6 h-6 mt-1" />
                  <div>
                    <strong>Equip Schools:</strong> Provide schools with
                    sustainable technology and resources
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <img src="/global.png" alt="Icon" className="w-6 h-6 mt-1" />
                  <div>
                    <strong>Global Impact:</strong> Create lasting environmental
                    change across communities
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-4">Our Impact So Far</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#F9FAFB] p-4 rounded border">
                  <p className="text-2xl font-bold text-green-600">1,200+</p>
                  <p className="text-gray-600">Students Engaged</p>
                </div>
                <div className="bg-[#F9FAFB] p-4 rounded border">
                  <p className="text-2xl font-bold text-blue-600">25</p>
                  <p className="text-gray-600">Schools Connected</p>
                </div>
                <div className="bg-[#F9FAFB] p-4 rounded border">
                  <p className="text-2xl font-bold text-purple-600">45</p>
                  <p className="text-gray-600">Projects Funded</p>
                </div>
                <div className="bg-[#F9FAFB] p-4 rounded border">
                  <p className="text-2xl font-bold text-red-500">12</p>
                  <p className="text-gray-600">Countries Reached</p>
                </div>
                <div className="bg-[#F9FAFB] p-4 rounded border">
                  <p className="text-2xl font-bold text-green-700">45K+</p>
                  <p className="text-gray-600">Trees Planted</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-4">
                Featured Projects Needing Support
              </h2>
              {[
                "Water Conservation System",
                "School Garden Project",
                "Recycling Program",
              ].map((project) => (
                <div
                  key={project}
                  className="flex justify-between items-center mb-2"
                >
                  <div>
                    <p>{project}</p>
                    <p className="text-sm text-gray-500">Needs $2,500</p>
                  </div>
                  <Button variant="outline">Support</Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right Section - Sleek Donation Card */}
        <Card>
          <CardContent className="p-8 space-y-8 flex flex-col items-center">
            <Image
              src="/vector.png"
              alt="Heart Icon"
              width={32}
              height={32}
              className="mx-auto mb-2"
            />
            <h2 className="text-2xl font-bold mb-2 text-center">Make a Donation</h2>
            
            <div className="flex gap-2 w-full justify-center mb-2">
              <Button
                variant={paymentMode === 'stripe' ? 'default' : 'outline'}
                onClick={() => setPaymentMode('stripe')}
                className="flex-1"
              >
                Pay by Credit Card
              </Button>
              <Button
                variant={paymentMode === 'wallet' ? 'default' : 'outline'}
                onClick={() => setPaymentMode('wallet')}
                className="flex-1"
              >
                Pay with Wallet
              </Button>
            </div>

            {/* Unified Amount Selection */}
            <div className="w-full">
              <div className="grid grid-cols-3 gap-2 mb-3">
                {[10, 25, 50, 100, 250, 500].map((amount) => (
                  <Button
                    key={amount}
                    variant={selectedAmount === amount ? 'default' : 'outline'}
                    onClick={() => { setSelectedAmount(amount); setCustomAmount(''); }}
                    className="w-full"
                  >
                    ${amount}
                  </Button>
                ))}
              </div>
              <div className="flex items-center gap-2 mb-2">
                <Input
                  type="number"
                  min={1}
                  placeholder="Custom Amount"
                  value={customAmount}
                  onChange={e => { setCustomAmount(e.target.value); setSelectedAmount(null); }}
                  className="flex-1"
                />
                <span className="text-gray-500">USD</span>
              </div>
            </div>

            {/* Payment Buttons */}
            {paymentMode === 'stripe' && getCurrentAmount() > 0 && (
              <Button
                onClick={handleStripeCheckout}
                disabled={isLoading}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg text-lg"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Processing...
                  </div>
                ) : (
                  `Proceed to Checkout - $${getCurrentAmount().toFixed(2)}`
                )}
              </Button>
            )}

            {paymentMode === 'wallet' && getCurrentAmount() > 0 && (
              <Button
                className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg text-lg"
                onClick={handleWalletPayment}
              >
                Pay {getCurrentAmount().toLocaleString(undefined, { style: 'currency', currency: 'USD' })} with Wallet
              </Button>
            )}

            {/* Dedicate Donation Section */}
            <div className="w-full space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Dedicate this Donation (optional)</h3>
                <p className="text-sm text-gray-600 mb-4">
                  You can dedicate this donation and share an e-certificate with someone you&apos;d like to honour.
                </p>
              </div>
              
              <div className="space-y-3">
                <select
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Purpose</option>
                  <option value="memorial">In Memory Of</option>
                  <option value="honor">In Honor Of</option>
                  <option value="celebration">In Celebration Of</option>
                </select>

                <Input
                  type="text"
                  placeholder="Recipient Name"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  className="w-full"
                />

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="sendECard"
                    checked={sendECard}
                    onChange={(e) => setSendECard(e.target.checked)}
                    className="w-4 h-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="sendECard"
                    className="text-sm font-medium text-gray-700"
                  >
                    Send an E-card?
                  </label>
                </div>

                {sendECard && (
                  <Input
                    type="email"
                    placeholder="Recipient Email"
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                    className="w-full"
                  />
                )}

                <textarea
                  placeholder="Message on Card (Optional)"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-vertical"
                />
              </div>
            </div>

            {error && <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md my-2 w-full text-center">{error}</div>}

            <p className="text-center text-sm text-gray-400 mt-4">
              All donations are processed securely
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DonationForm;
