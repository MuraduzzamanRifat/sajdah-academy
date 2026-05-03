"use client";

import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";

const testimonials = [
  {
    quote:
      "আমার জীবনের সবচেয়ে শান্তির ৬ মাস ছিল এই কোর্স। প্রতিদিনের আমল, রাতের তাহাজ্জুদ, আর সবাই মিলে কুরআন শেখা—এক অন্যরকম অভিজ্ঞতা।",
    name: "মুহাম্মদ ইসমাইল",
    role: "ব্যাচ-১ অংশগ্রহণকারী",
    initial: "ই",
  },
  {
    quote:
      "প্রিমিয়াম রিসোর্টে এমন একটি দ্বীনি পরিবেশে থাকা ও শেখা যেন স্বপ্নের মতো। এখন আমি নিজের জীবন আল্লাহর জন্য সাজাতে পারছি।",
    name: "আবু তালহা রহমান",
    role: "ব্যাচ-১ অংশগ্রহণকারী",
    initial: "ত",
  },
  {
    quote:
      "শুধু ক্লাস না, এখানে চরিত্র গঠন হয়—সাহাবা রা.-এর মতো ভ্রাতৃত্ব শেখা যায়। তরুণদের জন্য এটি আজ সময়ের প্রয়োজন।",
    name: "মাওলানা যাকারিয়া",
    role: "প্রস্তাবিত মেন্টর",
    initial: "য",
  },
];

export default function Testimonials() {
  return (
    <section className="py-20 bg-emerald-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-amber-600 font-bold tracking-wider uppercase text-sm mb-3 block">
              Voices from the Academy
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-emerald-950 mb-4">
              যারা আমাদের সাথে আছেন
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              অংশগ্রহণকারী ও মেন্টরদের কথা—এই যাত্রার বাস্তব অভিজ্ঞতা।
            </p>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <motion.figure
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="relative bg-white rounded-2xl p-8 shadow-sm border border-emerald-100 hover:shadow-md transition-shadow"
            >
              <Quote
                aria-hidden
                className="absolute top-6 right-6 w-10 h-10 text-emerald-100"
                strokeWidth={1.5}
              />

              <div className="flex items-center gap-1 mb-5 relative z-10">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>

              <blockquote className="text-slate-700 leading-relaxed mb-6 relative z-10">
                {t.quote}
              </blockquote>

              <figcaption className="flex items-center gap-3 pt-5 border-t border-slate-100 relative z-10">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-emerald-700 to-emerald-900 text-white flex items-center justify-center font-bold text-lg shrink-0">
                  {t.initial}
                </div>
                <div>
                  <p className="font-bold text-emerald-950">{t.name}</p>
                  <p className="text-sm text-slate-500">{t.role}</p>
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
