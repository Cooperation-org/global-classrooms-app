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

const DonationForm: React.FC = () => {
  const [isECard, setIsECard] = useState<boolean>(false);

  return (
    <div className="p-2 xs:p-3 sm:p-4 md:p-6 lg:p-8 xl:p-10 bg-white min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 xs:gap-4 sm:gap-5 md:gap-6 lg:gap-8 xl:gap-10 max-w-8xl mx-auto">
        {/* Left Section */}
        <div className="space-y-3 xs:space-y-4 sm:space-y-5 md:space-y-6">
          <div>
            <h1 className="text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl font-semibold mb-1 xs:mb-1.5 sm:mb-2 leading-tight">
              Support Global Classrooms
            </h1>
            <p className="text-gray-600 text-xs xs:text-sm sm:text-sm md:text-base lg:text-base xl:text-lg 2xl:text-xl leading-relaxed">
              Help us empower students to create environmental change
            </p>
          </div>

          {/* Why Donate */}
          <Card>
            <CardContent className="p-2 xs:p-3 sm:p-4 md:p-5 lg:p-6 space-y-2 xs:space-y-3 sm:space-y-4">
              <h2 className="text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-semibold leading-tight">
                Why Donate?
              </h2>
              <ul className="list-disc list-inside text-gray-700 space-y-1.5 xs:space-y-2 sm:space-y-2.5">
                {[
                  {
                    icon: "/empower.png",
                    title: "Empower Students",
                    desc: "Support students in implementing environmental projects",
                  },
                  {
                    icon: "/equip.png",
                    title: "Equip Schools",
                    desc: "Provide schools with sustainable technology and resources",
                  },
                  {
                    icon: "/global.png",
                    title: "Global Impact",
                    desc: "Create lasting environmental change across communities",
                  },
                ].map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 xs:gap-2.5 sm:gap-3"
                  >
                    <img
                      src={item.icon}
                      alt="Icon"
                      className="w-3 h-3 xs:w-4 xs:h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 mt-0.5 flex-shrink-0"
                    />
                    <div className="text-xs xs:text-xs sm:text-sm md:text-base lg:text-base xl:text-lg 2xl:text-xl leading-relaxed">
                      <strong>{item.title}:</strong> {item.desc}
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Impact Cards */}
          <Card>
            <CardContent className="p-2 xs:p-3 sm:p-4 md:p-5 lg:p-6">
              <h2 className="text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-semibold mb-2 xs:mb-3 sm:mb-4 leading-tight">
                Our Impact So Far
              </h2>
              <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-3 xl:grid-cols-5 gap-1 xs:gap-1.5 sm:gap-2 md:gap-3 lg:gap-2 xl:gap-3">
                {[
                  {
                    label: "Students Engaged",
                    value: "1,200+",
                    color: "text-green-600",
                  },
                  {
                    label: "Schools Connected",
                    value: "25",
                    color: "text-blue-600",
                  },
                  {
                    label: "Projects Funded",
                    value: "45",
                    color: "text-purple-600",
                  },
                  {
                    label: "Countries Reached",
                    value: "12",
                    color: "text-red-500",
                  },
                  {
                    label: "Trees Planted",
                    value: "45K+",
                    color: "text-green-700",
                  },
                ].map((stat, i) => (
                  <div
                    key={i}
                    className="bg-[#F9FAFB] p-1.5 xs:p-2 sm:p-3 md:p-4 lg:p-3 xl:p-4 rounded border text-center min-h-[50px] xs:min-h-[60px] sm:min-h-[70px] md:min-h-[80px] lg:min-h-[85px] xl:min-h-[90px] flex flex-col justify-center"
                  >
                    <p
                      className={`text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl font-bold ${stat.color} leading-tight`}
                    >
                      {stat.value}
                    </p>
                    <p className="text-[9px] xs:text-[10px] sm:text-xs md:text-sm lg:text-base xl:text-lg 2xl:text-xl text-gray-600 leading-tight mt-0.5">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Featured Projects */}
          <Card>
            <CardContent className="p-2 xs:p-3 sm:p-4 md:p-5 lg:p-6">
              <h2 className="text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-semibold mb-2 xs:mb-3 sm:mb-4 leading-tight">
                Featured Projects Needing Support
              </h2>
              {[
                "Water Conservation System",
                "School Garden Project",
                "Recycling Program",
              ].map((project, i) => (
                <div
                  key={i}
                  className="flex flex-col xs:flex-col sm:flex-row justify-between items-start sm:items-center mb-2 xs:mb-2.5 sm:mb-3 gap-1.5 xs:gap-2 sm:gap-3"
                >
                  <div className="text-xs xs:text-xs sm:text-sm md:text-base lg:text-base xl:text-lg 2xl:text-xl flex-1">
                    <p className="font-medium leading-tight">{project}</p>
                    <p className="text-[9px] xs:text-[10px] sm:text-xs md:text-sm lg:text-base xl:text-lg text-gray-500 leading-tight">
                      Needs $2,500
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full xs:w-full sm:w-auto text-xs xs:text-xs sm:text-sm md:text-base lg:text-base xl:text-lg px-3 xs:px-4 sm:px-6 py-1.5 xs:py-2 sm:py-2.5 min-w-[80px] xs:min-w-[90px] sm:min-w-[100px] lg:min-w-[110px] xl:min-w-[120px]"
                  >
                    Support
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right Section (Donation Form) */}
        <div className="lg:sticky lg:top-4 h-fit">
          <Card className="w-full">
            <CardContent className="p-2 xs:p-3 sm:p-4 md:p-5 lg:p-6 space-y-3 xs:space-y-4 sm:space-y-5 md:space-y-6 text-center">
              <Image
                src="/vector.png"
                alt="Heart Icon"
                width={16}
                height={16}
                className="mx-auto w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8"
              />
              <h2 className="text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl font-semibold leading-tight">
                Make a Donation
              </h2>

              {/* Donation Frequency */}
              <ToggleGroup
                type="single"
                defaultValue="once"
                className="w-full flex justify-center flex-wrap gap-1 xs:gap-1.5 sm:gap-2"
              >
                <ToggleGroupItem
                  value="once"
                  className="px-2 xs:px-3 sm:px-4 md:px-5 lg:px-6 py-1 xs:py-1.5 sm:py-2 md:py-2.5 text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl rounded-md data-[state=on]:bg-black data-[state=on]:text-white flex-1 xs:flex-none min-w-[70px] xs:min-w-[80px] sm:min-w-[90px] md:min-w-[100px] lg:min-w-[110px]"
                >
                  One-time
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="monthly"
                  className="px-2 xs:px-3 sm:px-4 md:px-5 lg:px-6 py-1 xs:py-1.5 sm:py-2 md:py-2.5 text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl rounded-md data-[state=on]:bg-black data-[state=on]:text-white flex-1 xs:flex-none min-w-[70px] xs:min-w-[80px] sm:min-w-[90px] md:min-w-[100px] lg:min-w-[110px]"
                >
                  Monthly
                </ToggleGroupItem>
              </ToggleGroup>

              {/* Payment Mode */}
              <div className="text-left space-y-2 xs:space-y-2.5 sm:space-y-3 md:space-y-4 w-full">
                <p className="font-medium text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl leading-tight">
                  Payment Mode
                </p>
                <div className="p-1.5 xs:p-2 sm:p-3 md:p-4 lg:p-5 bg-gray-50 rounded-lg border space-y-1.5 xs:space-y-2 sm:space-y-2.5 md:space-y-3">
                  <div className="flex items-center gap-1 xs:gap-1.5 sm:gap-2">
                    <img
                      src="/greenicon.png"
                      alt="Green icon"
                      className="w-3 h-3 xs:w-4 xs:h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7"
                    />
                    <span className="text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-normal text-gray-800 flex items-center gap-0.5 xs:gap-1 leading-tight">
                      Pay by Credit Card
                      <LockIcon className="h-2 w-2 xs:h-3 xs:w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 lg:h-6 lg:w-6 text-gray-600" />
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-0.5 xs:gap-1 sm:gap-1.5 md:gap-2">
                    {[
                      "mastercard.png",
                      "maestro.png",
                      "visa.png",
                      "discover.jpg",
                    ].map((img, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-center p-0.5 xs:p-1 sm:p-1.5 md:p-2 lg:p-2.5 border rounded bg-white shadow-sm min-w-[30px] xs:min-w-[35px] sm:min-w-[40px] md:min-w-[45px] lg:min-w-[50px]"
                      >
                        <img
                          src={`/${img}`}
                          alt={img}
                          className="h-2.5 xs:h-3 sm:h-4 md:h-5 lg:h-6 xl:h-7 max-w-full object-contain"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="w-full p-2 xs:p-2.5 sm:p-3 md:p-4 lg:p-5 text-left min-h-[45px] xs:min-h-[50px] sm:min-h-[60px] md:min-h-[70px] lg:min-h-[80px] xl:min-h-[90px] mt-1 xs:mt-1.5 sm:mt-2"
                >
                  <div className="flex items-start gap-1.5 xs:gap-2 sm:gap-2.5 md:gap-3">
                    <img
                      src="/circle.png"
                      alt="Circle"
                      className="w-2 h-2 xs:w-2.5 xs:h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 mt-1 flex-shrink-0"
                    />
                    <div>
                      <p className="font-semibold text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl leading-tight">
                        Pay with Wallet
                      </p>
                      <p className="text-[10px] xs:text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl text-[#5C8A5C] leading-tight">
                        Connect any wallet to GoodCollective
                      </p>
                    </div>
                  </div>
                </Button>
              </div>

              {/* Quick Amounts */}
              <div className="grid grid-cols-3 xs:grid-cols-3 sm:grid-cols-6 md:grid-cols-3 lg:grid-cols-6 gap-0.5 xs:gap-1 sm:gap-1.5 md:gap-2 w-full">
                {[10, 25, 50, 100, 250, 500].map((amt) => (
                  <Button
                    key={amt}
                    variant="outline"
                    size="sm"
                    className="w-full text-[9px] xs:text-[10px] sm:text-xs md:text-sm lg:text-base xl:text-lg 2xl:text-xl py-1 xs:py-1.5 sm:py-2 md:py-2.5 min-h-[28px] xs:min-h-[32px] sm:min-h-[36px] md:min-h-[40px] lg:min-h-[44px] xl:min-h-[48px]"
                  >
                    ${amt}
                  </Button>
                ))}
              </div>

              {/* Custom Inputs */}
              <div className="space-y-1 xs:space-y-1.5 sm:space-y-2 text-left w-full">
                <span className="font-semibold text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl leading-tight">
                  Custom Amount
                </span>
                <Input
                  placeholder="Custom Amount"
                  className="text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl py-1.5 xs:py-2 sm:py-2.5 md:py-3 lg:py-4 h-auto min-h-[32px] xs:min-h-[36px] sm:min-h-[40px] md:min-h-[44px] lg:min-h-[48px] xl:min-h-[52px] placeholder:text-xs placeholder:xs:text-sm placeholder:sm:text-base placeholder:md:text-lg placeholder:lg:text-xl placeholder:xl:text-2xl"
                />
              </div>

              <div className="space-y-1.5 xs:space-y-2 sm:space-y-2.5 text-left w-full">
                <p className="font-semibold text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl leading-tight">
                  Credit Card Information
                </p>
                <Input
                  placeholder="Name on Card"
                  className="text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl py-1.5 xs:py-2 sm:py-2.5 md:py-3 lg:py-4 h-auto min-h-[32px] xs:min-h-[36px] sm:min-h-[40px] md:min-h-[44px] lg:min-h-[48px] xl:min-h-[52px] placeholder:text-xs placeholder:xs:text-sm placeholder:sm:text-base placeholder:md:text-lg placeholder:lg:text-xl placeholder:xl:text-2xl"
                />
                <Input
                  placeholder="Card Number"
                  className="text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl py-1.5 xs:py-2 sm:py-2.5 md:py-3 lg:py-4 h-auto min-h-[32px] xs:min-h-[36px] sm:min-h-[40px] md:min-h-[44px] lg:min-h-[48px] xl:min-h-[52px] placeholder:text-xs placeholder:xs:text-sm placeholder:sm:text-base placeholder:md:text-lg placeholder:lg:text-xl placeholder:xl:text-2xl"
                />
                <div className="flex gap-1 xs:gap-1.5 sm:gap-2">
                  <Input
                    placeholder="MM/YY"
                    className="w-1/2 text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl py-1.5 xs:py-2 sm:py-2.5 md:py-3 lg:py-4 h-auto min-h-[32px] xs:min-h-[36px] sm:min-h-[40px] md:min-h-[44px] lg:min-h-[48px] xl:min-h-[52px] placeholder:text-xs placeholder:xs:text-sm placeholder:sm:text-base placeholder:md:text-lg placeholder:lg:text-xl placeholder:xl:text-2xl"
                  />
                  <Input
                    placeholder="CVV"
                    className="w-1/2 text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl py-1.5 xs:py-2 sm:py-2.5 md:py-3 lg:py-4 h-auto min-h-[32px] xs:min-h-[36px] sm:min-h-[40px] md:min-h-[44px] lg:min-h-[48px] xl:min-h-[52px] placeholder:text-xs placeholder:xs:text-sm placeholder:sm:text-base placeholder:md:text-lg placeholder:lg:text-xl placeholder:xl:text-2xl"
                  />
                </div>
                <Input
                  placeholder="Billing Email (optional)"
                  className="text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl py-1.5 xs:py-2 sm:py-2.5 md:py-3 lg:py-4 h-auto min-h-[32px] xs:min-h-[36px] sm:min-h-[40px] md:min-h-[44px] lg:min-h-[48px] xl:min-h-[52px] placeholder:text-xs placeholder:xs:text-sm placeholder:sm:text-base placeholder:md:text-lg placeholder:lg:text-xl placeholder:xl:text-2xl"
                />
              </div>

              {/* Dedicate Donation */}
              <div className="space-y-1.5 xs:space-y-2 sm:space-y-2.5 text-left w-full">
                <p className="font-medium text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl leading-tight">
                  Dedicate this Donation (optional)
                </p>
                <Select>
                  <SelectTrigger className="text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl py-1.5 xs:py-2 sm:py-2.5 md:py-3 lg:py-4 h-auto min-h-[32px] xs:min-h-[36px] sm:min-h-[40px] md:min-h-[44px] lg:min-h-[48px] xl:min-h-[52px]">
                    <SelectValue
                      placeholder="Purpose"
                      className="text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl"
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem
                      value="in-honor"
                      className="text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl"
                    >
                      In Honor
                    </SelectItem>
                    <SelectItem
                      value="in-memory"
                      className="text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl"
                    >
                      In Memory
                    </SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  placeholder="Recipient Name"
                  className="text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl py-1.5 xs:py-2 sm:py-2.5 md:py-3 lg:py-4 h-auto min-h-[32px] xs:min-h-[36px] sm:min-h-[40px] md:min-h-[44px] lg:min-h-[48px] xl:min-h-[52px] placeholder:text-xs placeholder:xs:text-sm placeholder:sm:text-base placeholder:md:text-lg placeholder:lg:text-xl placeholder:xl:text-2xl"
                />
                <div className="flex justify-between items-center bg-[#F7FCF7] p-1.5 xs:p-2 sm:p-2.5 md:p-3 lg:p-4 rounded">
                  <label
                    htmlFor="ecard"
                    className="cursor-pointer font-medium text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl leading-tight"
                  >
                    Send e-Card?
                  </label>
                  <Switch
                    id="ecard"
                    checked={isECard}
                    onCheckedChange={setIsECard}
                  />
                </div>
                {isECard && (
                  <Input
                    placeholder="Recipient Email"
                    className="text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl py-1.5 xs:py-2 sm:py-2.5 md:py-3 lg:py-4 h-auto min-h-[32px] xs:min-h-[36px] sm:min-h-[40px] md:min-h-[44px] lg:min-h-[48px] xl:min-h-[52px] placeholder:text-xs placeholder:xs:text-sm placeholder:sm:text-base placeholder:md:text-lg placeholder:lg:text-xl placeholder:xl:text-2xl"
                  />
                )}
                <Textarea
                  placeholder="Message on Card (Optional)"
                  className="text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl min-h-[50px] xs:min-h-[60px] sm:min-h-[70px] md:min-h-[80px] lg:min-h-[90px] xl:min-h-[100px] resize-none placeholder:text-xs placeholder:xs:text-sm placeholder:sm:text-base placeholder:md:text-lg placeholder:lg:text-xl placeholder:xl:text-2xl"
                />
              </div>

              {/* Final CTA */}
              <Button
                size="lg"
                className="w-full flex items-center justify-center gap-1 xs:gap-1.5 sm:gap-2 text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl py-2 xs:py-2.5 sm:py-3 md:py-4 lg:py-5 min-h-[36px] xs:min-h-[40px] sm:min-h-[44px] md:min-h-[48px] lg:min-h-[52px] xl:min-h-[56px] 2xl:min-h-[60px]"
              >
                <img
                  src="/heart.png"
                  alt="Icon"
                  className="w-2.5 h-2.5 xs:w-3 xs:h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 xl:w-7 xl:h-7"
                />
                Donate Now
              </Button>
              <p className="text-[9px] xs:text-[10px] sm:text-xs md:text-sm lg:text-base xl:text-lg 2xl:text-xl text-gray-400 text-center leading-tight">
                All donations are processed securely
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DonationForm;
