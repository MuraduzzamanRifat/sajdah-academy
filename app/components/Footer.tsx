import Link from "next/link";
import { Tent, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-emerald-950 text-emerald-200 py-12 border-t border-emerald-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Tent className="w-8 h-8 text-amber-500" />
              <span className="text-2xl font-bold text-white">Sajdah Academy</span>
            </div>
            <p className="text-emerald-400 mb-6 max-w-sm">
              প্রাকৃতিক পরিবেশে ফিজিক্যাল ট্রেনিং ও পূর্ণাঙ্গ ইসলামিক জীবনব্যবস্থা গড়ার এক
              অনন্য উদ্যোগ।
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4 text-lg">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-emerald-500" />
                <span>0180 55 65 444</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-emerald-500" />
                <span>sijdah.academybd@gmail.com</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-emerald-500" />
                <span>Dhaka, Bangladesh</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4 text-lg">Quick Links</h4>
            <div className="flex flex-col gap-2">
              <Link href="/" className="hover:text-amber-400 transition-colors">Home</Link>
              <Link href="/#curriculum" className="hover:text-amber-400 transition-colors">Curriculum</Link>
              <Link href="/routine" className="hover:text-amber-400 transition-colors">Routine</Link>
              <Link href="/#register" className="hover:text-amber-400 transition-colors">Register</Link>
              <Link href="#" className="hover:text-amber-400 transition-colors">Privacy Policy</Link>
            </div>
          </div>
        </div>

        <div className="border-t border-emerald-900 mt-12 pt-8 text-center text-emerald-500 text-sm">
          © {new Date().getFullYear()} Sajdah Academy. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
