"use client";
import React from "react";
import Link from "next/link";
import { useGlobalState } from "@/app/context/GlobalStateContext";

export default function Footer() {
  const { state } = useGlobalState()

  return (
    <footer className="bg-slate-800 text-white py-16 relative">
      <div className="container mx-auto px-4">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* EGR */}
          <div className="text-center md:text-left">
            <h3
              className="text-xl font-semibold mb-4"
              style={{ color: "#10b981" }}
            >
              EGR - Educating Global Resilience
            </h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Transforming environmental education through technology,
              collaboration, and economic incentives.
            </p>
          </div>

          {/* Quick Links */}
          <div className="text-center md:text-left">
            <h4
              className="text-xl font-semibold mb-4"
              style={{ color: "#10b981" }}
            >
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#features"
                  className="text-gray-300 transition text-sm"
                  onMouseEnter={(e) =>
                    ((e.target as HTMLElement).style.color = "#10b981")
                  }
                  onMouseLeave={(e) =>
                    ((e.target as HTMLElement).style.color = "#d1d5db")
                  }
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="/how-it-works"
                  className="text-gray-300 transition text-sm"
                  onMouseEnter={(e) =>
                    ((e.target as HTMLElement).style.color = "#10b981")
                  }
                  onMouseLeave={(e) =>
                    ((e.target as HTMLElement).style.color = "#d1d5db")
                  }
                >
                  How It Works
                </a>
              </li>
              <li>
                <a
                  href="/impact"
                  className="text-gray-300 transition text-sm"
                  onMouseEnter={(e) =>
                    ((e.target as HTMLElement).style.color = "#10b981")
                  }
                  onMouseLeave={(e) =>
                    ((e.target as HTMLElement).style.color = "#d1d5db")
                  }
                >
                  Impact
                </a>
              </li>
              <li>
                <a
                  href="https://www.gooddollar.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 transition text-sm"
                  onMouseEnter={(e) =>
                    ((e.target as HTMLElement).style.color = "#10b981")
                  }
                  onMouseLeave={(e) =>
                    ((e.target as HTMLElement).style.color = "#d1d5db")
                  }
                >
                  GoodDollar
                </a>
              </li>
            </ul>
          </div>

          {/* Partners */}
          <div className="text-center md:text-left">
            <h4
              className="text-xl font-semibold mb-4"
              style={{ color: "#10b981" }}
            >
              Partners
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://www.homebiogas.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 transition text-sm"
                  onMouseEnter={(e) =>
                    ((e.target as HTMLElement).style.color = "#10b981")
                  }
                  onMouseLeave={(e) =>
                    ((e.target as HTMLElement).style.color = "#d1d5db")
                  }
                >
                  HomeBiogas
                </a>
              </li>
              <li>
                <a
                  href="https://linkedtrust.us/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 transition text-sm"
                  onMouseEnter={(e) =>
                    ((e.target as HTMLElement).style.color = "#10b981")
                  }
                  onMouseLeave={(e) =>
                    ((e.target as HTMLElement).style.color = "#d1d5db")
                  }
                >
                  LinkedTrust
                </a>
              </li>
              <li>
                <a
                  href="https://goodcollective.xyz/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 transition text-sm"
                  onMouseEnter={(e) =>
                    ((e.target as HTMLElement).style.color = "#10b981")
                  }
                  onMouseLeave={(e) =>
                    ((e.target as HTMLElement).style.color = "#d1d5db")
                  }
                >
                  GoodCollective
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="text-center md:text-left">
            <h4
              className="text-xl font-semibold mb-4"
              style={{ color: "#10b981" }}
            >
              Contact
            </h4>
            <p className="text-gray-300 text-sm mb-4">
              Ready to bring EGR to your education center?
            </p>
            <Link href="/signin">
              <button
                className="text-white px-6 py-3 rounded-full font-medium transition"
                style={{ backgroundColor: "#10b981" }}
                onMouseEnter={(e) =>
                  ((e.target as HTMLElement).style.backgroundColor = "#059669")
                }
                onMouseLeave={(e) =>
                  ((e.target as HTMLElement).style.backgroundColor = "#10b981")
                }
              >
                Get Started Today
              </button>
            </Link>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 pt-8">
          <div className="text-center">
            <p className="text-gray-400 text-sm pb-3 sm:pb-0">
              © 2025 EGR. Building sustainable futures through education.
            </p>
          </div>
          {/* Vecteezy Attributions */}
          {
            state.isLandingPage && (
              <div className="flex flex-col absolute right-1 bottom-1">
                <small>
                  <a href="https://www.vecteezy.com/free-png/rabbit" target="_blank" rel="noopener noreferrer">
                    Rabbit PNGs by Vecteezy
                  </a>
                </small>
                <small>
                  <a href="https://www.vecteezy.com/free-png/fauna" target="_blank" rel="noopener noreferrer">
                    Fauna PNGs by Vecteezy
                  </a>
                </small>
                <small>
                  <a href="https://www.vecteezy.com/free-png/flying-birds" target="_blank" rel="noopener noreferrer">
                    Flying Birds PNGs by Vecteezy
                  </a>
                </small>
              </div>
            )
          }
        </div>
      </div>
    </footer>
  );
}
