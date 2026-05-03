"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CreditCard, Smartphone, CheckCircle } from "lucide-react";

export default function Registration() {
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("bkash");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handlePayment = () => {
    setStep(3);
  };

  return (
    <section id="register" className="py-20 bg-emerald-900 text-slate-50 relative overflow-hidden">
      <div aria-hidden className="ambient-orbs orbs-dark" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            অনলাইন রেজিস্ট্রেশন
          </h2>
          <p className="text-emerald-200">
            আপনার সিট বুকিং করতে নিচের ফর্মটি পূরণ করুন এবং পেমেন্ট সম্পন্ন করুন।
          </p>
        </div>

        <div className="glass-light text-slate-800 rounded-2xl overflow-hidden">
          <div className="flex border-b border-slate-200/50">
            <div
              className={`flex-1 py-4 text-center font-medium ${
                step >= 1
                  ? "bg-emerald-50 text-emerald-700 border-b-2 border-emerald-500"
                  : "text-slate-400"
              }`}
            >
              ১. ব্যক্তিগত তথ্য
            </div>
            <div
              className={`flex-1 py-4 text-center font-medium ${
                step >= 2
                  ? "bg-emerald-50 text-emerald-700 border-b-2 border-emerald-500"
                  : "text-slate-400"
              }`}
            >
              ২. পেমেন্ট
            </div>
            <div
              className={`flex-1 py-4 text-center font-medium ${
                step === 3
                  ? "bg-emerald-50 text-emerald-700 border-b-2 border-emerald-500"
                  : "text-slate-400"
              }`}
            >
              ৩. সম্পন্ন
            </div>
          </div>

          <div className="p-8">
            {step === 1 && (
              <motion.form
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="reg-name" className="block text-sm font-medium text-slate-700 mb-2">পূর্ণ নাম</label>
                    <input
                      id="reg-name"
                      required
                      type="text"
                      className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                      placeholder="আপনার নাম"
                    />
                  </div>
                  <div>
                    <label htmlFor="reg-phone" className="block text-sm font-medium text-slate-700 mb-2">মোবাইল নম্বর</label>
                    <input
                      id="reg-phone"
                      required
                      type="tel"
                      className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                      placeholder="01XXXXXXXXX"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="reg-email" className="block text-sm font-medium text-slate-700 mb-2">ইমেইল এড্রেস</label>
                  <input
                    id="reg-email"
                    required
                    type="email"
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                    placeholder="example@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="reg-batch" className="block text-sm font-medium text-slate-700 mb-2">পছন্দের রিসোর্ট ব্যাচ</label>
                  <select
                    id="reg-batch"
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                  >
                    <option>গাজীপুর রিসোর্ট ব্যাচ - মে ২০২৬</option>
                    <option>সিলেট ইকো-রিসোর্ট ব্যাচ - জুন ২০২৬</option>
                    <option>কক্সবাজার সি-ভিউ ব্যাচ - জুলাই ২০২৬</option>
                  </select>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-lg transition-all duration-200 text-lg cursor-pointer active:scale-[0.99] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-300/60"
                  >
                    পরবর্তী ধাপে যান
                  </button>
                </div>
              </motion.form>
            )}

            {step === 2 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 mb-8">
                  <h3 className="font-bold text-lg mb-2">কোর্স ফি: ৳১৫,০০০</h3>
                  <p className="text-sm text-slate-500">
                    ৬ মাসের কোর্স, থাকা-খাওয়া ও রিসোর্ট ফি অন্তর্ভুক্ত।
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-4">পেমেন্ট মেথড নির্বাচন করুন</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("bkash")}
                      className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all duration-200 cursor-pointer active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-pink-300/60 ${
                        paymentMethod === "bkash"
                          ? "border-pink-500 bg-pink-50 text-pink-700"
                          : "border-slate-200 hover:border-pink-200"
                      }`}
                    >
                      <Smartphone className="w-8 h-8" />
                      <span className="font-bold">bKash</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("nagad")}
                      className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all duration-200 cursor-pointer active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange-300/60 ${
                        paymentMethod === "nagad"
                          ? "border-orange-500 bg-orange-50 text-orange-700"
                          : "border-slate-200 hover:border-orange-200"
                      }`}
                    >
                      <Smartphone className="w-8 h-8" />
                      <span className="font-bold">Nagad</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("card")}
                      className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all duration-200 cursor-pointer active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-300/60 ${
                        paymentMethod === "card"
                          ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                          : "border-slate-200 hover:border-emerald-200"
                      }`}
                    >
                      <CreditCard className="w-8 h-8" />
                      <span className="font-bold">Card</span>
                    </button>
                  </div>
                </div>

                <div className="pt-4 flex gap-4">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-6 py-4 border border-slate-200 text-slate-600 font-bold rounded-lg hover:bg-slate-50 transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-slate-300/60"
                  >
                    ফিরে যান
                  </button>
                  <button
                    type="button"
                    onClick={handlePayment}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-lg transition-all duration-200 text-lg cursor-pointer active:scale-[0.99] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-300/60"
                  >
                    পেমেন্ট সম্পন্ন করুন
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-2">রেজিস্ট্রেশন সফল হয়েছে!</h3>
                <p className="text-slate-600 mb-8">
                  আপনার পেমেন্ট সফলভাবে গ্রহণ করা হয়েছে। বিস্তারিত তথ্য আপনার ইমেইলে পাঠানো হবে।
                </p>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-8 py-3 bg-emerald-100 text-emerald-700 font-bold rounded-lg hover:bg-emerald-200 transition-all duration-200 cursor-pointer active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-300/60"
                >
                  নতুন রেজিস্ট্রেশন
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
