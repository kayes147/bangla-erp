"use client";

import { useState, useEffect } from "react";
import { Clock, Calendar } from "lucide-react";

const toBengaliNumber = (num: number | string): string => {
  const bnDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  return num.toString().replace(/\d/g, (d) => bnDigits[parseInt(d, 10)]);
};

const BENGALI_DAYS = [
  "রবিবার",
  "সোমবার",
  "মঙ্গলবার",
  "বুধবার",
  "বৃহস্পতিবার",
  "শুক্রবার",
  "শনিবার",
];

const BENGALI_MONTHS = [
  "জানুয়ারি",
  "ফেব্রুয়ারি",
  "মার্চ",
  "এপ্রিল",
  "মে",
  "জুন",
  "জুলাই",
  "আগস্ট",
  "সেপ্টেম্বর",
  "অক্টোবর",
  "নভেম্বর",
  "ডিসেম্বর",
];

export default function BengaliClock() {
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    setTime(new Date());
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!time) {
    return (
      <div className="flex items-center space-x-1.5 bg-slate-50 border border-gray-200 px-2.5 py-1 rounded-xl text-xs text-gray-400">
        <Clock size={13} className="animate-spin text-gray-400" />
        <span className="text-[11px]">লোড হচ্ছে...</span>
      </div>
    );
  }

  const dayName = BENGALI_DAYS[time.getDay()];
  const dateNum = toBengaliNumber(time.getDate());
  const monthName = BENGALI_MONTHS[time.getMonth()];
  const yearNum = toBengaliNumber(time.getFullYear());

  const hours = time.getHours();
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  let period = "সকাল";
  if (hours >= 12 && hours < 15) period = "দুপুর";
  else if (hours >= 15 && hours < 18) period = "বিকাল";
  else if (hours >= 18 && hours < 20) period = "সন্ধ্যা";
  else if (hours >= 20 || hours < 6) period = "রাত";

  const displayHours = hours % 12 || 12;
  const formattedHours = toBengaliNumber(displayHours.toString().padStart(2, "0"));
  const formattedMinutes = toBengaliNumber(minutes.toString().padStart(2, "0"));
  const amPm = hours >= 12 ? "PM" : "AM";

  return (
    <div className="flex items-center space-x-1.5 sm:space-x-2.5 bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border border-emerald-200/90 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-xl text-emerald-950 shadow-2xs transition-all">
      {/* Date */}
      <div className="flex items-center space-x-1 text-[11px] sm:text-xs font-bold">
        <Calendar size={13} className="text-emerald-600 shrink-0" />
        <span className="hidden lg:inline text-emerald-800">{dayName}, </span>
        <span className="text-gray-900 font-bold whitespace-nowrap">
          <span className="hidden sm:inline">{dateNum} {monthName} {yearNum}</span>
          <span className="sm:hidden">{dateNum} {monthName.slice(0, 3)}</span>
        </span>
      </div>

      <span className="text-emerald-300 font-normal select-none">|</span>

      {/* Live Clock */}
      <div className="flex items-center space-x-1 text-[11px] sm:text-xs font-bold whitespace-nowrap">
        <Clock size={13} className="text-emerald-600 shrink-0" />
        <span className="font-mono tracking-wide sm:tracking-wider text-gray-900 font-bold">
          {formattedHours}:{formattedMinutes}
        </span>
        <span className="text-[10px] sm:text-[11px] font-bold text-emerald-700 ml-0.5">
          {amPm}
        </span>
      </div>
    </div>
  );
}
