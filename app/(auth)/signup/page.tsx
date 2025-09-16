"use client";

import React, { useState, useEffect } from "react";
import { apiService } from "@/app/services/api";
import { API_ENDPOINTS } from "@/app/utils/constants";
import { isValidEmail, isValidPassword } from "@/app/utils/validation";
import { useConnect, useAccount } from "wagmi";

const SignUpPage = () => {
  const [showEmailForm, setShowEmailForm] = useState(false);
  // const [selectedRole, setSelectedRole] = useState("");

  // Form state
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    password_confirm: "",
  });

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [isWalletLoading, setIsWalletLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [pendingWalletRegistration, setPendingWalletRegistration] =
    useState(false);

  // Wagmi wallet connect
  const { connect, connectors, isPending } = useConnect();
  const { address, isConnected } = useAccount();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear errors when user starts typing
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    // if (!selectedRole) {
    //   setError("Please select a role");
    //   return;
    // }

    if (!formData.email || !formData.password || !formData.password_confirm) {
      setError("Please fill in all fields");
      return;
    }

    if (!isValidEmail(formData.email)) {
      setError("Please enter a valid email address");
      return;
    }

    const passwordValidation = isValidPassword(formData.password);
    if (!passwordValidation.isValid) {
      setError(passwordValidation.errors[0]);
      return;
    }

    if (formData.password !== formData.password_confirm) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await apiService.post(API_ENDPOINTS.AUTH.REGISTER, {
        email: formData.email,
        password: formData.password,
        password_confirm: formData.password_confirm,
        // role: selectedRole,
      });

      if (response.success) {
        // Store user data and tokens from the response if available
        const responseData = response.data as {
          user?: {
            id: string;
            username: string;
            email: string;
            first_name: string;
            last_name: string;
            full_name: string;
            role: string;
            mobile_number: string | null;
            gender: string | null;
            date_of_birth: string | null;
            profile_picture: string | null;
            city: string | null;
            country: string;
            is_active: boolean;
            date_joined: string;
            school_count: number;
            signup_method: string;
          };
          tokens?: {
            access: string;
            refresh: string;
          };
        };

        if (responseData?.user && responseData?.tokens) {
          localStorage.setItem("access_token", responseData.tokens.access);
          localStorage.setItem("refresh_token", responseData.tokens.refresh);
          localStorage.setItem("user_data", JSON.stringify(responseData.user));
          // Redirect to dashboard after successful registration
          setTimeout(() => {
            window.location.href = "/dashboard";
          }, 150);
        } else {
          // Fallback: If no tokens/user, show a generic success and reset form
          setSuccess("Account created successfully!");
          setFormData({
            email: "",
            password: "",
            password_confirm: "",
          });
          // setSelectedRole("");
          setShowEmailForm(false);
        }
      } else {
        setError(response.error || "Registration failed. Please try again.");
      }
    } catch (err) {
      setError("An error occurred during registration. Please try again.");
      console.error("Registration error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Wallet sign up handler
  const handleWalletSignUp = async () => {
    setError("");
    setSuccess("");

    // if (!selectedRole) {
    //   setError("Please select a role before connecting your wallet.");
    //   return;
    // }

    setIsWalletLoading(true);
    setPendingWalletRegistration(true);
    try {
      // If already connected, use the current address
      if (isConnected && address) {
        await handleWalletRegistration(address);
        setPendingWalletRegistration(false);
        return;
      }

      // If not connected, connect first
      const connector = connectors[0];
      if (!connector) {
        setError("No wallet connector found.");
        setIsWalletLoading(false);
        setPendingWalletRegistration(false);
        return;
      }

      await connect({ connector });
      // Registration will be handled in useEffect
    } catch (err: unknown) {
      console.error("Wallet connection error:", err);
      if (typeof err === "object" && err && "message" in err) {
        setError(
          (err as { message: string }).message || "Wallet connection failed."
        );
      } else {
        setError("Wallet connection failed.");
      }
      setIsWalletLoading(false);
      setPendingWalletRegistration(false);
    }
  };

  // Handle wallet registration after connection
  useEffect(() => {
    // if (isConnected && address && selectedRole && pendingWalletRegistration) {
    if (isConnected && address && pendingWalletRegistration) {
      handleWalletRegistration(address);
      setPendingWalletRegistration(false);
    }
  // }, [isConnected, address, selectedRole, pendingWalletRegistration]);
  }, [isConnected, address, pendingWalletRegistration]);

  const handleWalletRegistration = async (walletAddress: string) => {
    try {
      const response = await apiService.post("/auth/wallet-register/", {
        wallet_address: walletAddress,
        // role: selectedRole,
      });

      if (response.success) {
        setSuccess("Wallet registration successful!");

        // Store user data and tokens from the response
        const responseData = response.data as {
          user: {
            id: string;
            username: string;
            email: string | null;
            first_name: string;
            last_name: string;
            full_name: string;
            role: string;
            mobile_number: string | null;
            gender: string | null;
            date_of_birth: string | null;
            profile_picture: string | null;
            city: string | null;
            country: string;
            is_active: boolean;
            date_joined: string;
            school_count: number;
            signup_method: string;
          };
          tokens: {
            access: string;
            refresh: string;
          };
        };

        if (responseData?.user && responseData?.tokens) {
          localStorage.setItem("access_token", responseData.tokens.access);
          localStorage.setItem("refresh_token", responseData.tokens.refresh);
          localStorage.setItem("user_data", JSON.stringify(responseData.user));

          // Redirect to dashboard after successful registration
          setTimeout(() => {
            window.location.href = "/dashboard";
          }, 1500);
        }

        // Reset form
        // setSelectedRole("");
      } else {
        setError(response.error || "Wallet registration failed.");
      }
    } catch (err) {
      console.error("Wallet registration error:", err);
      setError("Wallet registration failed.");
    } finally {
      setIsWalletLoading(false);
    }
  };

  return (
    <div className="w-full bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
      {/* Main Content */}
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Create an account
          </h1>
          <p className="text-gray-600 text-sm">
            Choose how you want to sign up to earn CS tokens.
            <br />
            Powered by Universal Basic Income (UBI)
          </p>
        </div>

        {/* Role Selection */}
        
        {/* <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Select your role:
          </h3>
          <div className="grid grid-cols-2 gap-4"> */}
            {/* Student Role */}
            {/* <button
              type="button"
              onClick={() => setSelectedRole("student")}
              className={`p-4 rounded-lg border-2 transition-all ${
                selectedRole === "student"
                  ? "border-green-500 bg-green-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex flex-col items-center">
                <span className="font-semibold text-gray-900">Student</span>
              </div>
            </button> */}

            {/* Teacher Role */}
            {/* <button
              type="button"
              onClick={() => setSelectedRole("teacher")}
              className={`p-4 rounded-lg border-2 transition-all ${
                selectedRole === "teacher"
                  ? "border-yellow-500 bg-yellow-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex flex-col items-center">
                <span className="font-semibold text-gray-900">Teacher</span>
              </div>
            </button>
          </div>
        </div> */}

        {/* Error and Success Messages */}
        {error && (
          <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
            {error}
          </div>
        )}

        {success && (
          <div className="text-sm text-green-600 bg-green-50 p-3 rounded-lg">
            {success}
          </div>
        )}

        {/* Signup Options */}
        <div className="space-y-4">
          {/* Wallet Sign Up Button */}
          <button
            type="button"
            onClick={handleWalletSignUp}
            disabled={isWalletLoading || isPending}
            className="w-full p-4 bg-green-600 hover:bg-green-700 disabled:bg-green-400 rounded-lg flex items-center justify-center text-white font-semibold transition-colors"
          >
            {isWalletLoading || isPending
              ? "Connecting Wallet..."
              : "Sign up with Wallet"}
          </button>

          {/* OR Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">OR</span>
            </div>
          </div>

          {/* Email Signup Toggle */}
          <button
            type="button"
            onClick={() => setShowEmailForm(!showEmailForm)}
            className="w-full p-4 border-2 border-gray-200 hover:border-gray-300 rounded-lg flex items-center justify-between text-gray-700 transition-colors"
          >
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <span className="font-semibold text-gray-900">
                Sign up with Email
              </span>
            </div>
            <svg
              className={`w-5 h-5 text-gray-400 transition-transform ${
                showEmailForm ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {/* Email Form - Expandable */}
          {showEmailForm && (
            <form
              onSubmit={handleSubmit}
              className="border-2 border-gray-200 rounded-lg p-4 space-y-3 animate-in slide-in-from-top-2 duration-200"
            >
              <div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors"
                  required
                />
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Create a password"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors pr-10"
                  required
                />
                <button
                  type="button"
                  tabIndex={-1}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.657.403-3.22 1.125-4.575M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm2.121-2.121A9.969 9.969 0 0121 12c0 5.523-4.477 10-10 10a9.969 9.969 0 01-7.071-2.929M4.222 4.222l15.556 15.556"
                      />
                    </svg>
                  )}
                </button>
              </div>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="password_confirm"
                  value={formData.password_confirm}
                  onChange={handleInputChange}
                  placeholder="Confirm password"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors pr-10"
                  required
                />
                <button
                  type="button"
                  tabIndex={-1}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
                >
                  {showConfirmPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.657.403-3.22 1.125-4.575M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm2.121-2.121A9.969 9.969 0 0121 12c0 5.523-4.477 10-10 10a9.969 9.969 0 01-7.071-2.929M4.222 4.222l15.556 15.556"
                      />
                    </svg>
                  )}
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full p-3 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded-lg font-semibold transition-colors"
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </button>
            </form>
          )}
        </div>

        {/* Already have account link */}
        <p className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <a
            href="/signin"
            className="font-semibold text-green-600 hover:underline"
          >
            Log in
          </a>
        </p>

        {/* Terms */}
        <p className="text-center text-xs text-gray-500">
          By creating an account, you agree to our{" "}
          <a href="#" className="text-green-600 hover:underline">
            Terms of Service
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;
