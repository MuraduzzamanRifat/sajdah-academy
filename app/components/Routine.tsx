"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  Moon,
  Sun,
  Coffee,
  BookOpen,
  Heart,
  Activity,
  CalendarDays,
  Sunrise,
  Sunset,
} from "lucide-react";

const thursdayRoutine = [
  { time: "Before Magrib", event: "Arrival", duration: "10 Mins", icon: <Clock className="w-5 h-5" /> },
  { time: "6.30 – 7.00 PM", event: "Salatul Magrib & Introducing", duration: "30 Mins", icon: <Sunset className="w-5 h-5" /> },
  { time: "7.00 – 7.30 PM", event: "Dinner & others", duration: "30 Mins", icon: <Coffee className="w-5 h-5" /> },
  { time: "7.30 – 8.30 PM", event: "Emotional starting (Class-1)", duration: "60 Mins", icon: <BookOpen className="w-5 h-5" />, highlight: true },
  { time: "8.30 – 8.50 PM", event: "Q & A", duration: "20 Mins", icon: <Clock className="w-5 h-5" /> },
  { time: "8.50 – 9.30 PM", event: "Salatul Esha & Preparation", duration: "40 Mins", icon: <Moon className="w-5 h-5" /> },
  { time: "9.30 – 10.00 PM", event: "Welcome snacks, Drinks & Nasheed", duration: "30 Mins", icon: <Coffee className="w-5 h-5" /> },
  { time: "10.00 – 10.30 PM", event: "Self-writing (“If I die tonight…”)", duration: "30 Mins", icon: <Heart className="w-5 h-5" />, highlight: true },
  { time: "10.30 – 3.30 AM", event: "Sleep without Mobile", duration: "300 Mins", icon: <Moon className="w-5 h-5" /> },
];

const fridayMorning = [
  { time: "3.30 – 3.45 AM", event: "Ready to Tahajjud", duration: "15 Mins", icon: <Moon className="w-5 h-5" /> },
  { time: "3.45 – 4.30 AM", event: "Tahajjud & Dua", duration: "45 Mins", icon: <Heart className="w-5 h-5" /> },
  { time: "4.30 – 5.00 AM", event: "Class-2 (self-crying moment)", duration: "30 Mins", icon: <BookOpen className="w-5 h-5" />, highlight: true },
  { time: "5.00 – 5.30 AM", event: "Salatul Fazr & Dua", duration: "30 Mins", icon: <Sunrise className="w-5 h-5" /> },
  { time: "5.30 – 6.00 AM", event: "Live with Nature (Walking)", duration: "30 Mins", icon: <Activity className="w-5 h-5" /> },
  { time: "6.00 – 6.30 AM", event: "Happy Breakfast & Ishraq", duration: "30 Mins", icon: <Coffee className="w-5 h-5" /> },
  { time: "6.30 – 8.00 AM", event: "Class-3", duration: "90 Mins", icon: <BookOpen className="w-5 h-5" />, highlight: true },
  { time: "8.00 – 8.30 AM", event: "Q & A", duration: "30 Mins", icon: <Clock className="w-5 h-5" /> },
  { time: "8.30 – 9.30 AM", event: "Self-Activity with Mentor", duration: "60 Mins", icon: <Activity className="w-5 h-5" /> },
];

const fridayAfternoon = [
  { time: "9.30 – 10.00 AM", event: "Leisure Time", duration: "30 Mins", icon: <Clock className="w-5 h-5" /> },
  { time: "10.00 – 11.00 AM", event: "Enjoy with Playing", duration: "60 Mins", icon: <Activity className="w-5 h-5" /> },
  { time: "11.00 – 11.30 AM", event: "Lunch", duration: "30 Mins", icon: <Coffee className="w-5 h-5" /> },
  { time: "11.30 – 2.15 PM", event: "Personal time & Salatul Jumua", duration: "165 Mins", icon: <Sun className="w-5 h-5" /> },
  { time: "2.15 – 3.30 PM", event: "Class-4", duration: "75 Mins", icon: <BookOpen className="w-5 h-5" />, highlight: true },
  { time: "3.30 – 4.00 PM", event: "Q & A", duration: "30 Mins", icon: <Clock className="w-5 h-5" /> },
  { time: "4.00 – 4.30 PM", event: "Self-Activity", duration: "30 Mins", icon: <Activity className="w-5 h-5" /> },
  { time: "4.30 – 5.00 PM", event: "Preparation & Salatul Asr", duration: "30 Mins", icon: <Sun className="w-5 h-5" /> },
  { time: "5.00 – 5.30 PM", event: "Lifestyle Marketing & Snacks", duration: "30 Mins", icon: <Coffee className="w-5 h-5" /> },
  { time: "5.30 – 6.00 PM", event: "Fruitful afternoon with meditation", duration: "30 Mins", icon: <Heart className="w-5 h-5" /> },
  { time: "6.30 – 7.00 PM", event: "Salatul Magrib & dua", duration: "30 Mins", icon: <Sunset className="w-5 h-5" /> },
  { time: "7.00 – 8.00 PM", event: "Class -5", duration: "60 Mins", icon: <BookOpen className="w-5 h-5" />, highlight: true },
  { time: "8.00 – 9.00 PM", event: "Salatul Esha & Ready to go", duration: "60 Mins", icon: <Moon className="w-5 h-5" /> },
];

type TimelineItem = {
  time: string;
  event: string;
  duration: string;
  icon: React.ReactNode;
  highlight?: boolean;
};

const Timeline = ({ data }: { data: TimelineItem[] }) => (
  <div className="relative max-w-3xl mx-auto mt-12">
    <div className="absolute left-[28px] sm:left-[120px] top-4 bottom-4 w-1 bg-gradient-to-b from-emerald-200 via-emerald-300 to-emerald-200 rounded-full" />
    <div className="space-y-8">
      {data.map((item, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          className="relative flex items-start gap-6 sm:gap-8 group"
        >
          <div className="hidden sm:block w-[88px] shrink-0 text-right pt-3">
            <span className="text-sm font-bold text-emerald-700">{item.time.split(" ")[0]}</span>
            <span className="text-xs font-medium text-emerald-500 block">
              {item.time.split(" ").slice(1).join(" ")}
            </span>
          </div>

          <div className="relative shrink-0 z-10">
            <div
              className={`w-14 h-14 rounded-full border-4 border-white shadow-md flex items-center justify-center transition-transform duration-300 group-hover:scale-110 ${
                item.highlight ? "bg-amber-400 text-amber-950" : "bg-emerald-500 text-white"
              }`}
            >
              {item.icon}
            </div>
          </div>

          <div
            className={`flex-1 p-5 rounded-2xl shadow-sm border transition-all duration-300 group-hover:shadow-md ${
              item.highlight ? "bg-amber-50 border-amber-200" : "bg-white border-slate-100"
            }`}
          >
            <div className="sm:hidden mb-2 inline-block px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">
              {item.time}
            </div>
            <h4
              className={`text-lg font-bold mb-1 ${
                item.highlight ? "text-amber-900" : "text-slate-800"
              }`}
            >
              {item.event}
            </h4>
            <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
              <Clock className="w-4 h-4" />
              <span>{item.duration}</span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
);

export default function Routine() {
  const [activeTab, setActiveTab] = useState("thursday");

  const tabs = [
    { id: "thursday", label: "Thursday (Block-1)", icon: <Moon className="w-4 h-4" /> },
    { id: "friday-morning", label: "Friday Morning", icon: <Sunrise className="w-4 h-4" /> },
    { id: "friday-afternoon", label: "Friday Afternoon", icon: <Sun className="w-4 h-4" /> },
  ];

  const getActiveData = () => {
    if (activeTab === "thursday") return thursdayRoutine;
    if (activeTab === "friday-morning") return fridayMorning;
    return fridayAfternoon;
  };

  return (
    <section className="pb-24 bg-slate-50">
      <div className="bg-emerald-900 text-white py-20 px-4 relative overflow-hidden pt-32">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-100 via-transparent to-transparent" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-800/50 border border-emerald-700 mb-6"
          >
            <CalendarDays className="w-5 h-5 text-amber-400" />
            <span className="text-emerald-100 font-medium">Basic Course-1</span>
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Effective Routine</h1>
          <p className="text-xl text-emerald-200 max-w-2xl mx-auto">
            বৃহস্পতিবার মাগরিব থেকে শুক্রবার এশা পর্যন্ত আমাদের একটি পূর্ণাঙ্গ দিনের রুটিন।
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="grid sm:grid-cols-2 gap-4 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 flex items-center gap-6"
          >
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
              <Clock className="w-8 h-8 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">
                Total Time
              </p>
              <p className="text-3xl font-bold text-emerald-950">
                16.30 <span className="text-lg text-slate-500 font-medium">hrs</span>
              </p>
              <p className="text-sm text-emerald-600 font-medium">990 Minutes</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 flex items-center gap-6"
          >
            <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
              <BookOpen className="w-8 h-8 text-amber-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">
                Course Duration
              </p>
              <p className="text-3xl font-bold text-emerald-950">
                9.20 <span className="text-lg text-slate-500 font-medium">hrs</span>
              </p>
              <p className="text-sm text-amber-600 font-medium">560 Minutes</p>
            </div>
          </motion.div>
        </div>

        <div
          role="tablist"
          aria-label="Routine day"
          className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-4 mb-8 bg-white p-2 rounded-2xl shadow-sm border border-slate-100"
        >
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const ariaSelected: "true" | "false" = isActive ? "true" : "false";
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={ariaSelected}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-bold transition-all duration-200 flex-1 cursor-pointer active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-300/60 ${
                  isActive
                    ? "bg-emerald-600 text-white shadow-md"
                    : "text-slate-500 hover:bg-emerald-50 hover:text-emerald-700"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-4 sm:p-8 overflow-hidden min-h-[600px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Timeline data={getActiveData()} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
