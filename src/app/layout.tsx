import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "جمعية أجيال كيغلان | نسج المستقبل",
  description: "الموقع الرسمي لجمعية أجيال كيغلان للتنمية والثقافة بمكناس.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className="antialiased">
        <Navbar />
        <main>{children}</main>
        <footer className="bg-slate-900 text-white py-12 mt-20">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-2xl font-bold mb-4">جمعية أجيال كيغلان</h2>
            <p className="opacity-70 mb-8 max-w-xl mx-auto">
              ملتزمون بالتنمية الثقافية والاجتماعية لمجتمعنا. 
              تابعونا على فيسبوك لمواكبة آخر أخبارنا وفعالياتنا.
            </p>
            <div className="flex justify-center flex-wrap gap-6 mb-8">
              <a href="https://www.facebook.com/ajyalwirlan" target="_blank" className="hover:text-secondary transition-colors">فيسبوك</a>
              <a href="tel:+212622158485" className="hover:text-secondary transition-colors">0622-158485</a>
              <a href="mailto:ajyalmeknes@gmail.com" className="hover:text-secondary transition-colors">ajyalmeknes@gmail.com</a>
              <a href="#" className="hover:text-secondary transition-colors">مكناس، المغرب</a>
            </div>
            <div className="border-t border-white/10 pt-8 opacity-50 text-sm">
              &copy; {new Date().getFullYear()} جمعية أجيال كيغلان. جميع الحقوق محفوظة.
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
