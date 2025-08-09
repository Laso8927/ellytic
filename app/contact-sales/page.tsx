"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import Link from "next/link";

interface FormData {
  name: string;
  company: string;
  email: string;
  country: string;
  message: string;
  file?: File;
}

export default function ContactSalesPage() {
  const t = useTranslations();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    company: "",
    email: "",
    country: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    // Prefill message with interests from query params
    const audience = searchParams.get("audience");
    const interests = searchParams.get("interests");
    
    if (audience === "professionals" && interests) {
      const interestList = interests.split(",").map(interest => {
        switch (interest) {
          case "api": return "B2B API License";
          case "bulk": return "Bulk B2B Transactions";
          case "referral": return "Referral Program (B2B Lite)";
          default: return interest;
        }
      }).join(", ");

      setFormData(prev => ({
        ...prev,
        message: `I'm interested in the following services: ${interestList}\n\nPlease get in touch to discuss how we can work together.`
      }));
    }
  }, [searchParams]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, file }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const submitData = new FormData();
      submitData.append("name", formData.name);
      submitData.append("company", formData.company);
      submitData.append("email", formData.email);
      submitData.append("country", formData.country);
      submitData.append("message", formData.message);
      submitData.append("audience", searchParams.get("audience") || "");
      submitData.append("interests", searchParams.get("interests") || "");
      
      if (formData.file) {
        submitData.append("file", formData.file);
      }

      const response = await fetch("/api/sales-leads", {
        method: "POST",
        body: submitData,
      });

      if (response.ok) {
        setIsSubmitted(true);
      } else {
        throw new Error("Failed to submit");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("There was an error submitting your request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <header className="px-6 py-4 border-b sticky top-0 bg-white/70 backdrop-blur z-40">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <Link href="/" className="font-extrabold text-lg tracking-tight text-black subpixel-antialiased leading-none">ELLYTIC</Link>
          </div>
        </header>

        <div className="max-w-2xl mx-auto px-6 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-6"
          >
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">{t("contactSales.success.title")}</h1>
            <p className="text-lg text-gray-600">{t("contactSales.success.message")}</p>
            <div className="pt-4">
              <Link
                href="/"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                {t("contactSales.success.backHome")}
              </Link>
            </div>
          </motion.div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <header className="px-6 py-4 border-b sticky top-0 bg-white/70 backdrop-blur z-40">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="font-extrabold text-lg tracking-tight text-black subpixel-antialiased leading-none">ELLYTIC</Link>
          <Link className="text-sm text-gray-600 hover:text-black" href="/">{t("contactSales.backHome")}</Link>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{t("contactSales.title")}</h1>
            <p className="text-lg text-gray-600">{t("contactSales.subtitle")}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  {t("contactSales.form.name")} *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                  {t("contactSales.form.company")} *
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  required
                  value={formData.company}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  {t("contactSales.form.email")} *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                  {t("contactSales.form.country")} *
                </label>
                <input
                  type="text"
                  id="country"
                  name="country"
                  required
                  value={formData.country}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                {t("contactSales.form.message")} *
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={6}
                value={formData.message}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            <div>
              <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-2">
                {t("contactSales.form.attachment")} {t("contactSales.form.optional")}
              </label>
              <input
                type="file"
                id="file"
                name="file"
                onChange={handleFileChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                {isSubmitting ? t("contactSales.form.submitting") : t("contactSales.form.submit")}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </main>
  );
}