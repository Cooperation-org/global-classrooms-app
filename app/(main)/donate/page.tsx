"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LockIcon } from "lucide-react";

const DonationForm = () => {
  const [isECard, setIsECard] = useState(false);

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
                  <img src="empower.png" alt="Icon" className="w-6 h-6 mt-1" />
                  <div>
                    <strong>Empower Students:</strong> Support students in
                    implementing environmental projects
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <img src="equip.png" alt="Icon" className="w-6 h-6 mt-1" />
                  <div>
                    <strong>Equip Schools:</strong> Provide schools with
                    sustainable technology and resources
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <img src="global.png" alt="Icon" className="w-6 h-6 mt-1" />
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

        {/* Right Section */}
        <Card>
          <CardContent className="p-6 space-y-6 text-center">
            <Image
              src="/vector.png" // path relative to /public folder
              alt="Heart Icon"
              width={24} // width in pixels
              height={24} // height in pixels
              className="mx-auto"
            />

            <h2 className="text-xl font-semibold">Make a Donation</h2>

            <ToggleGroup
              type="single"
              defaultValue="once"
              className="w-full justify-center"
            >
              <ToggleGroupItem
                value="once"
                className="px-4 py-2 rounded-r-md data-[state=on]:bg-black data-[state=on]:text-white"
              >
                One-time Donation
              </ToggleGroupItem>

              <ToggleGroupItem value="monthly">
                Monthly Donation
              </ToggleGroupItem>
            </ToggleGroup>
            <div>
              <p className="font-medium mb-2 text-left">Payment Mode</p>
              {/* Pay by Credit Card Header with Lock */}
              <div className="p-3 bg-gray-50 rounded-lg border">
                {/* Header with Lock Icon */}
                <div className="flex items-center justify-between mb-3">
                  {/* Left side: Green icon + Text */}
                  <div className="flex items-center gap-2 mb-3">
                    {/* Left icon */}
                    <img
                      src="/greenicon.png"
                      alt="Green icon"
                      className="w-5 h-5 object-contain ml-1 mt-1"
                    />

                    {/* Text + lock together */}
                    <span className="text-lg font-normal text-gray-800 flex items-center gap-2">
                      Pay by Credit Card
                      <LockIcon className="h-4 w-4 text-gray-600" />
                    </span>
                  </div>
                </div>

                {/* Payment Method Images in Small Boxes - One Line */}
                <div className="flex space-x-2 justify-start">
                  <div className="flex items-center justify-center p-3 border border-gray-200 rounded hover:border-blue-300 transition-colors">
                    <img
                      src="/mastercard.png"
                      alt="MasterCard"
                      className="h-8"
                    />
                  </div>

                  <div className="flex items-center justify-center p-3 border border-gray-200 rounded hover:border-blue-300 transition-colors bg-white shadow-sm">
                    <img src="/maestro.png" alt="Maestro" className="h-10" />
                  </div>

                  <div className="flex items-center justify-center p-3 border border-gray-200 rounded hover:border-blue-300 transition-colors bg-white shadow-sm">
                    <img src="/visa.png" alt="VISA" className="h-8" />
                  </div>

                  <div className="flex items-center justify-center p-3 border border-gray-200 rounded hover:border-blue-300 transition-colors bg-white shadow-sm">
                    <img src="/discover.jpg" alt="Discover" className="h-8" />
                  </div>
                </div>
              </div>

              {/* Pay with Wallet Button */}
              <Button
                variant="outline"
                className="w-full p-6 mt-4 text-left h-auto min-h-[80px]"
              >
                <div className="flex items-start gap-3 justify-start w-full text-left">
                  <div className="mt-1">
                    <img
                      src="circle.png"
                      alt="Circle icon"
                      className="w-4 h-4"
                    />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="font-semibold text-lg">
                      Pay with Wallet
                    </span>
                    <span className="text-sm text-[#5C8A5C]">
                      Connect any of your wallet to GoodCollective
                    </span>
                  </div>
                </div>
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[10, 25, 50, 100, 250, 500].map((amount) => (
                <Button key={amount} variant="outline">
                  ${amount}
                </Button>
              ))}
            </div>
            <div className="flex flex-col items-start text-left w-full">
              <span className="font-semibold text-lg">Custom Amount</span>
              <Input placeholder="Custom Amount" />
            </div>
            <div className="space-y-2 flex flex-col items-start text-left w-full">
              <span className="font-semibold text-lg">
                Credit Card Information
              </span>
              <Input placeholder="Name on Card" />
              <Input placeholder="Card Number" />
              <div className="flex gap-2">
                <Input placeholder="MM/YY" className="w-1/2" />
                <Input placeholder="CVV" className="w-1/2" />
              </div>
              <Input placeholder="Billing Email (optional)" />
            </div>
            <div className="space-y-2 text-left w-full">
              <p className="font-medium">Dedicate this Donation (optional)</p>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Purpose" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="in-honor">In Honor</SelectItem>
                  <SelectItem value="in-memory">In Memory</SelectItem>
                </SelectContent>
              </Select>
              <Input placeholder="Recipient Name" />
              <div className="flex items-center gap-2 bg-[#F7FCF7] p-2">
                <div className="flex items-center justify-between gap-2 bg-[#F7FCF7] p-2">
                  <label htmlFor="ecard" className="cursor-pointer">
                    Send e-Card?
                  </label>
                  <Switch
                    id="ecard"
                    checked={isECard}
                    onCheckedChange={setIsECard}
                  />
                </div>
              </div>
              {isECard && <Input placeholder="Recipient Email" />}

              <Textarea
                placeholder="Message on Card (Optional)"
                className="font-bold"
              />
            </div>

            <Button className="w-full flex items-center justify-center gap-2">
              <img src="heart.png" alt="Icon" className="w-4 h-4" />
              Donate Now
            </Button>
            <p className="text-center text-sm text-gray-400">
              All donations are processed securely
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DonationForm;
