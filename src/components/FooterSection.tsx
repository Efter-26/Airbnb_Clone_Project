"use client";

import { useState, useRef, useEffect } from "react";
import LanguageModal from "./LanguageModal";
import CurrencyModal from "./CurrencyModal";
import { useLanguage } from "../contexts/LanguageContext";

interface Language {
  code: string;
  name: string;
  region: string;
  flag: string;
}

interface Currency {
  code: string;
  name: string;
  symbol: string;
  region: string;
}

const languages: Language[] = [
  { code: "en-US", name: "English", region: "United States", flag: "🇺🇸" },
  { code: "bn-BD", name: "বাংলা", region: "Bangladesh", flag: "🇧🇩" },
  { code: "es-ES", name: "Español", region: "España", flag: "🇪🇸" },
  { code: "fr-FR", name: "Français", region: "France", flag: "🇫🇷" },
  { code: "de-DE", name: "Deutsch", region: "Deutschland", flag: "🇩🇪" },
  { code: "it-IT", name: "Italiano", region: "Italia", flag: "🇮🇹" },
  { code: "hi-IN", name: "हिन्दी", region: "India", flag: "🇮🇳" },
  { code: "ja-JP", name: "日本語", region: "日本", flag: "🇯🇵" },
  { code: "ko-KR", name: "한국어", region: "대한민국", flag: "🇰🇷" },
  { code: "zh-CN", name: "中文", region: "中国", flag: "🇨🇳" },
];

const currencies: Currency[] = [
  {
    code: "USD",
    name: "United States dollar",
    symbol: "$",
    region: "United States",
  },
  { code: "BDT", name: "Bangladeshi taka", symbol: "৳", region: "Bangladesh" },
  { code: "EUR", name: "Euro", symbol: "€", region: "Spain" },
  {
    code: "GBP",
    name: "Pound sterling",
    symbol: "£",
    region: "United Kingdom",
  },
  { code: "JPY", name: "Japanese yen", symbol: "¥", region: "Japan" },
  { code: "KRW", name: "South Korean won", symbol: "₩", region: "South Korea" },
  { code: "CNY", name: "Chinese yuan", symbol: "¥", region: "China" },
  { code: "INR", name: "Indian rupee", symbol: "₹", region: "India" },
  { code: "DKK", name: "Danish krone", symbol: "kr", region: "Denmark" },
  { code: "CHF", name: "Swiss franc", symbol: "CHF", region: "Switzerland" },
];

export default function FooterSection() {
  const { t, language, setLanguage } = useLanguage();
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(
    language === "en" ? languages[0] : languages[1]
  );
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(
    currencies[0]
  );
  const [languageModalOpen, setLanguageModalOpen] = useState(false);
  const [currencyModalOpen, setCurrencyModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"tips" | "apartments">("tips");

  const languageModalRef = useRef<HTMLDivElement>(null);
  const currencyModalRef = useRef<HTMLDivElement>(null);

  // Close modals when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        languageModalRef.current &&
        !languageModalRef.current.contains(event.target as Node)
      ) {
        setLanguageModalOpen(false);
      }
      if (
        currencyModalRef.current &&
        !currencyModalRef.current.contains(event.target as Node)
      ) {
        setCurrencyModalOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLanguageSelect = (lang: Language) => {
    setSelectedLanguage(lang);
    setLanguageModalOpen(false);
    // Map language codes to our context format
    const langCode = lang.code === "en-US" ? "en" : "bn";
    setLanguage(langCode);
    // Reload page to apply language changes
    window.location.reload();
  };

  const handleCurrencySelect = (currency: Currency) => {
    setSelectedCurrency(currency);
    setCurrencyModalOpen(false);
  };

  return (
    <footer className="bg-gray-100 border-t border-gray-200">
      {/* Inspiration Section */}
      <div className="py-12 px-10">
        <div className="max-w-7xl mx-auto">
          {/* Main Title */}
          <h2 className="text-2xl font-semibold text-gray-900 mb-8">
            {t("footer.inspiration")}
          </h2>

          {/* Tab Navigation */}
          <div className="mb-8">
            <div className="flex space-x-8 border-b border-gray-300">
              <button
                onClick={() => setActiveTab("tips")}
                className={`pb-4 text-lg font-medium transition-colors ${
                  activeTab === "tips"
                    ? "text-gray-900 border-b-2 border-gray-900"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {t("footer.travelTips")}
              </button>
              <button
                onClick={() => setActiveTab("apartments")}
                className={`pb-4 text-lg font-medium transition-colors ${
                  activeTab === "apartments"
                    ? "text-gray-900 border-b-2 border-gray-900"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {t("footer.airbnbApartments")}
              </button>
            </div>
          </div>

          {/* Content Grid */}
          {activeTab === "tips" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg mb-1">
                    {t("footer.familyTravelHub")}
                  </h3>
                  <p className="text-gray-600">
                    {t("footer.tipsAndInspiration")}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg mb-1">
                    {t("footer.kidFriendlyParks")}
                  </h3>
                  <p className="text-gray-600">
                    {t("footer.familyHikingTrails")}
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg mb-1">
                    {t("footer.familyBudgetTravel")}
                  </h3>
                  <p className="text-gray-600">{t("footer.getThereForLess")}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg mb-1">
                    {t("footer.vacationIdeas")}
                  </h3>
                  <p className="text-gray-600">{t("footer.makeItSpecial")}</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg mb-1">
                    {t("footer.travelEuropeBudget")}
                  </h3>
                  <p className="text-gray-600">{t("footer.kidsToEurope")}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg mb-1">
                    {t("footer.outdoorAdventure")}
                  </h3>
                  <p className="text-gray-600">{t("footer.exploreNature")}</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg mb-1">
                    {t("footer.bucketListParks")}
                  </h3>
                  <p className="text-gray-600">{t("footer.mustSeeParks")}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "apartments" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg mb-1">
                    {t("footer.petFriendlyApartments")}
                  </h3>
                  <p className="text-gray-600">
                    {t("footer.welcomeFurryFriends")}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg mb-1">
                    {t("footer.extendedStayOptions")}
                  </h3>
                  <p className="text-gray-600">
                    {t("footer.perfectForLongerTrips")}
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg mb-1">
                    {t("footer.cityCenterLocations")}
                  </h3>
                  <p className="text-gray-600">{t("footer.heartOfAction")}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg mb-1">
                    {t("footer.luxuryApartmentRentals")}
                  </h3>
                  <p className="text-gray-600">
                    {t("footer.highEndAccommodations")}
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg mb-1">
                    {t("footer.budgetFriendlyApartments")}
                  </h3>
                  <p className="text-gray-600">
                    {t("footer.affordableOptions")}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg mb-1">
                    {t("footer.familySizedApartments")}
                  </h3>
                  <p className="text-gray-600">
                    {t("footer.spaciousAccommodations")}
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg mb-1">
                    {t("footer.businessTravelReady")}
                  </h3>
                  <p className="text-gray-600">
                    {t("footer.workspaceAmenities")}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="py-10 px-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Support Column */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">
              {t("footer.support")}
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  {t("footer.helpCenter")}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  {t("footer.safetyIssue")}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  {t("footer.airCover")}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  {t("footer.antiDiscrimination")}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  {t("footer.disabilitySupport")}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  {t("footer.cancellationOptions")}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  {t("footer.reportNeighborhood")}
                </a>
              </li>
            </ul>
          </div>

          {/* Hosting Column */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">
              {t("footer.hosting")}
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  {t("footer.airbnbHome")}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  {t("footer.airbnbExperience")}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  {t("footer.airbnbService")}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  {t("footer.airCoverHost")}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  {t("footer.hostingResources")}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  {t("footer.communityForum")}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  {t("footer.hostingResponsibly")}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  {t("footer.airbnbApartments")}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  {t("footer.hostingClass")}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  {t("footer.findCohost")}
                </a>
              </li>
            </ul>
          </div>

          {/* Airbnb Column */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">
              {t("footer.airbnb")}
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  {t("footer.summerRelease")}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  {t("footer.newsroom")}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  {t("footer.careers")}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  {t("footer.investors")}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  {t("footer.giftCards")}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  {t("footer.airbnbOrg")}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-300 pt-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            {/* Left Side - Copyright and Legal Links */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span>{t("footer.copyright")}</span>
                <a href="#" className="hover:text-gray-900 transition-colors">
                  Terms
                </a>
                <a href="#" className="hover:text-gray-900 transition-colors">
                  Sitemap
                </a>
                <a href="#" className="hover:text-gray-900 transition-colors">
                  Privacy
                </a>
                <a
                  href="#"
                  className="hover:text-gray-900 transition-colors flex items-center gap-1"
                >
                  Your Privacy Choices
                  <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                </a>
              </div>
            </div>

            {/* Right Side - Language, Currency, and Social Media */}
            <div className="flex items-center gap-4">
              {/* Language Selector */}
              <div className="relative">
                <button
                  onClick={() => setLanguageModalOpen(true)}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <img
                    width="16"
                    height="16"
                    src="https://img.icons8.com/forma-light/24/1A1A1A/geography.png"
                    alt="geography"
                  />
                  <span>{selectedLanguage.name}</span>
                </button>
              </div>

              {/* Currency Selector */}
              <div className="relative">
                <button
                  onClick={() => setCurrencyModalOpen(true)}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <img
                    width="18"
                    height="18"
                    src="https://img.icons8.com/material-two-tone/24/us-dollar--v1.png"
                    alt="us-dollar--v1"
                  />
                  <span>{selectedCurrency.code}</span>
                </button>
              </div>

              {/* Social Media Icons */}
              <div className="flex items-center gap-3">
                <a href="#" className="hover:opacity-80 transition-opacity">
                  <img
                    width="26"
                    height="26"
                    src="https://img.icons8.com/ios-glyphs/30/facebook-new.png"
                    alt="facebook-new"
                  />
                </a>
                <a href="#" className="hover:opacity-80 transition-opacity">
                  <img
                    width="24"
                    height="24"
                    src="https://img.icons8.com/forma-thin/24/twitterx.png"
                    alt="twitterx"
                  />
                </a>
                <a href="#" className="hover:opacity-80 transition-opacity">
                  <img
                    width="24"
                    height="24"
                    src="https://img.icons8.com/fluency-systems-regular/48/instagram-new--v1.png"
                    alt="instagram-new--v1"
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Language Modal */}
      <LanguageModal
        open={languageModalOpen}
        onClose={() => setLanguageModalOpen(false)}
        onSelectLanguage={handleLanguageSelect}
        selectedLanguage={selectedLanguage}
      />

      {/* Currency Modal */}
      <CurrencyModal
        open={currencyModalOpen}
        onClose={() => setCurrencyModalOpen(false)}
        onSelectCurrency={handleCurrencySelect}
        selectedCurrency={selectedCurrency}
      />
    </footer>
  );
}
