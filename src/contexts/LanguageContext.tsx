"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'bn';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translation data
const translations = {
  en: {
    // Navigation
    'nav.homes': 'Homes',
    'nav.experiences': 'Experiences',
    'nav.services': 'Services',
    'nav.becomeHost': 'Become a host',
    'nav.helpCenter': 'Help Center',
    'nav.referHost': 'Refer a Host',
    'nav.findCohost': 'Find a co-host',
    'nav.giftCards': 'Gift cards',
    'nav.loginSignup': 'Log in or sign up',
    'nav.signup': 'Sign up',
    'nav.login': 'Log in',
    
    // Search Bar
    'search.where': 'Where',
    'search.destinations': 'Search destinations',
    'search.checkin': 'Check in',
    'search.checkout': 'Check out',
    'search.addDates': 'Add dates',
    'search.who': 'Who',
    'search.addGuests': 'Add guests',
    'search.search': 'Search',
    'search.anywhere': 'Anywhere',
    'search.anytime': 'Anytime',
    'search.addGuestsShort': 'Add guests',
    
    // Date Modal
    'date.whenTrip': 'When\'s your trip?',
    'date.dates': 'Dates',
    'date.months': 'Months',
    'date.flexible': 'Flexible',
    'date.howLongStay': 'How long would you like to stay?',
    'date.weekend': 'Weekend',
    'date.week': 'Week',
    'date.month': 'Month',
    'date.goAnytime': 'Go anytime',
    'date.exactDates': 'Exact dates',
    'date.add1Day': '+ 1 day',
    'date.add2Days': '+ 2 days',
    'date.add7Days': '+ 7 days',
    'date.clear': 'Clear',
    'date.save': 'Save',
    
    // Guest Modal
    'guest.adults': 'Adults',
    'guest.children': 'Children',
    'guest.infants': 'Infants',
    'guest.pets': 'Pets',
    'guest.ages13': 'Ages 13+',
    'guest.ages2to12': 'Ages 2-12',
    'guest.under2': 'Under 2',
    'guest.bringingPets': 'Bringing a service animal?',
    'guest.apply': 'Apply',
    
    // Footer
    'footer.support': 'Support',
    'footer.helpCenter': 'Help Center',
    'footer.airCover': 'AirCover',
    'footer.antiDiscrimination': 'Anti-discrimination',
    'footer.disabilitySupport': 'Disability support',
    'footer.cancellationOptions': 'Cancellation options',
    'footer.reportNeighborhood': 'Report neighborhood concern',
    'footer.hosting': 'Hosting',
    'footer.airbnbHome': 'Airbnb your home',
    'footer.airCoverHost': 'AirCover for Hosts',
    'footer.hostingResources': 'Hosting resources',
    'footer.communityForum': 'Community forum',
    'footer.hostingResponsibly': 'Hosting responsibly',
    'footer.airbnbOrg': 'Airbnb.org',
    'footer.airbnb': 'Airbnb',
    'footer.newsroom': 'Newsroom',
    'footer.newFeatures': 'New features',
    'footer.careers': 'Careers',
    'footer.investors': 'Investors',
    'footer.giftCards': 'Gift cards',
    'footer.airbnbLuxe': 'Airbnb Luxe',
    'footer.inspiration': 'Inspiration for future getaways',
    'footer.travelTips': 'Travel tips & inspiration',
    'footer.airbnbApartments': 'Airbnb-friendly apartments',
    'footer.popularDestinations': 'Popular destinations',
    'footer.asiaPacific': 'Asia Pacific',
    'footer.europe': 'Europe',
    'footer.northAmerica': 'North America',
    'footer.centralAmerica': 'Central America',
    'footer.southAmerica': 'South America',
    'footer.africa': 'Africa',
    'footer.middleEast': 'Middle East',
    'footer.caribbean': 'Caribbean',
    'footer.copyright': '© 2024 Airbnb, Inc. · Privacy · Terms · Sitemap',
    
    // Footer content translations
    'footer.safetyIssue': 'Get help with a safety issue',
    'footer.airbnbExperience': 'Airbnb your experience',
    'footer.airbnbService': 'Airbnb your service',
    'footer.hostingClass': 'Join a free Hosting class',
    'footer.summerRelease': '2025 Summer Release',
    'footer.familyTravelHub': 'Family travel hub',
    'footer.tipsAndInspiration': 'Tips and inspiration',
    'footer.kidFriendlyParks': 'Kid-friendly state parks',
    'footer.familyHikingTrails': 'Check out these family-friendly hiking trails',
    'footer.familyBudgetTravel': 'Family budget travel',
    'footer.getThereForLess': 'Get there for less',
    'footer.vacationIdeas': 'Vacation ideas for any budget',
    'footer.makeItSpecial': 'Make it special without making it stressful',
    'footer.travelEuropeBudget': 'Travel Europe on a budget',
    'footer.kidsToEurope': 'How to take the kids to Europe for less',
    'footer.outdoorAdventure': 'Outdoor adventure',
    'footer.exploreNature': 'Explore nature with the family',
    'footer.bucketListParks': 'Bucket list national parks',
    'footer.mustSeeParks': 'Must-see parks for family travel',
    'footer.petFriendlyApartments': 'Pet-friendly apartments',
    'footer.welcomeFurryFriends': 'Find places that welcome your furry friends',
    'footer.extendedStayOptions': 'Extended stay options',
    'footer.perfectForLongerTrips': 'Perfect for longer trips and remote work',
    'footer.cityCenterLocations': 'City center locations',
    'footer.heartOfAction': 'Stay in the heart of the action',
    'footer.luxuryApartmentRentals': 'Luxury apartment rentals',
    'footer.highEndAccommodations': 'High-end accommodations for special occasions',
    'footer.budgetFriendlyApartments': 'Budget-friendly apartments',
    'footer.affordableOptions': 'Affordable options without compromising comfort',
    'footer.familySizedApartments': 'Family-sized apartments',
    'footer.spaciousAccommodations': 'Spacious accommodations for larger groups',
    'footer.businessTravelReady': 'Business travel ready',
    'footer.workspaceAmenities': 'Apartments with workspace amenities',
    
    // Search Results
    'searchResults.homesIn': 'homes in',
    'searchResults.noProperties': 'No properties found',
    'searchResults.tryAdjusting': 'Try adjusting your search criteria',
    'searchResults.backToHome': 'Back to Home',
    'searchResults.searchError': 'Search Error',
    'searchResults.searchingProperties': 'Searching properties...',
    
    // Room Details
    'room.guests': 'guests',
    'room.bedrooms': 'bedrooms',
    'room.bathrooms': 'bathrooms',
    'room.perNight': 'per night',
    'room.nights': 'nights',
    'room.superhost': 'Superhost',
    'room.yearsHosting': 'years hosting',
    'room.responseRate': 'response rate',
    'room.responseTime': 'response time',
    'room.whatGuestsLove': 'What guests love',
    'room.amenities': 'Amenities',
    'room.thingsToKnow': 'Things to know',
    'room.houseRules': 'House rules',
    'room.safetyInfo': 'Safety info',
    'room.cancellationPolicy': 'Cancellation policy',
    'room.reserve': 'Reserve',
    'room.basePrice': 'Base price',
    'room.originalPrice': 'Original price',
    'room.discount': 'Discount',
    'room.cleaningFee': 'Cleaning fee',
    'room.serviceFee': 'Service fee',
    'room.taxes': 'Taxes',
    'room.total': 'Total',
  },
  bn: {
    // Navigation
    'nav.homes': 'বাড়ি',
    'nav.experiences': 'অভিজ্ঞতা',
    'nav.services': 'সেবা',
    'nav.becomeHost': 'হোস্ট হন',
    'nav.helpCenter': 'সহায়তা কেন্দ্র',
    'nav.referHost': 'হোস্ট রেফার করুন',
    'nav.findCohost': 'সহ-হোস্ট খুঁজুন',
    'nav.giftCards': 'উপহার কার্ড',
    'nav.loginSignup': 'লগ ইন বা সাইন আপ',
    'nav.signup': 'সাইন আপ',
    'nav.login': 'লগ ইন',
    
    // Search Bar
    'search.where': 'কোথায়',
    'search.destinations': 'গন্তব্য খুঁজুন',
    'search.checkin': 'চেক ইন',
    'search.checkout': 'চেক আউট',
    'search.addDates': 'তারিখ যোগ করুন',
    'search.who': 'কে',
    'search.addGuests': 'অতিথি যোগ করুন',
    'search.search': 'খুঁজুন',
    'search.anywhere': 'যেকোনো জায়গা',
    'search.anytime': 'যেকোনো সময়',
    'search.addGuestsShort': 'অতিথি যোগ করুন',
    
    // Date Modal
    'date.whenTrip': 'আপনার ট্রিপ কখন?',
    'date.dates': 'তারিখ',
    'date.months': 'মাস',
    'date.flexible': 'নমনীয়',
    'date.howLongStay': 'আপনি কতদিন থাকতে চান?',
    'date.weekend': 'সপ্তাহান্ত',
    'date.week': 'সপ্তাহ',
    'date.month': 'মাস',
    'date.goAnytime': 'যেকোনো সময় যান',
    'date.exactDates': 'নির্দিষ্ট তারিখ',
    'date.add1Day': '+ ১ দিন',
    'date.add2Days': '+ ২ দিন',
    'date.add7Days': '+ ৭ দিন',
    'date.clear': 'মুছুন',
    'date.save': 'সংরক্ষণ',
    
    // Guest Modal
    'guest.adults': 'প্রাপ্তবয়স্ক',
    'guest.children': 'শিশু',
    'guest.infants': 'শিশু',
    'guest.pets': 'পোষা প্রাণী',
    'guest.ages13': '১৩+ বছর',
    'guest.ages2to12': '২-১২ বছর',
    'guest.under2': '২ বছরের কম',
    'guest.bringingPets': 'সেবা প্রাণী আনছেন?',
    'guest.apply': 'প্রয়োগ',
    
    // Footer
    'footer.support': 'সহায়তা',
    'footer.helpCenter': 'সহায়তা কেন্দ্র',
    'footer.airCover': 'এয়ার কভার',
    'footer.antiDiscrimination': 'বৈষম্য বিরোধী',
    'footer.disabilitySupport': 'প্রতিবন্ধী সহায়তা',
    'footer.cancellationOptions': 'বাতিলের বিকল্প',
    'footer.reportNeighborhood': 'পাড়ার সমস্যা রিপোর্ট',
    'footer.hosting': 'হোস্টিং',
    'footer.airbnbHome': 'আপনার বাড়ি এয়ারবিএনবি করুন',
    'footer.airCoverHost': 'হোস্টদের জন্য এয়ার কভার',
    'footer.hostingResources': 'হোস্টিং সম্পদ',
    'footer.communityForum': 'কমিউনিটি ফোরাম',
    'footer.hostingResponsibly': 'দায়িত্বশীল হোস্টিং',
    'footer.airbnbOrg': 'এয়ারবিএনবি.অর্গ',
    'footer.airbnb': 'এয়ারবিএনবি',
    'footer.newsroom': 'নিউজরুম',
    'footer.newFeatures': 'নতুন বৈশিষ্ট্য',
    'footer.careers': 'ক্যারিয়ার',
    'footer.investors': 'বিনিয়োগকারী',
    'footer.giftCards': 'উপহার কার্ড',
    'footer.airbnbLuxe': 'এয়ারবিএনবি লাক্স',
    'footer.inspiration': 'ভবিষ্যতের ছুটির জন্য অনুপ্রেরণা',
    'footer.travelTips': 'ভ্রমণ টিপস এবং অনুপ্রেরণা',
    'footer.airbnbApartments': 'এয়ারবিএনবি-বান্ধব অ্যাপার্টমেন্ট',
    'footer.popularDestinations': 'জনপ্রিয় গন্তব্য',
    'footer.asiaPacific': 'এশিয়া প্যাসিফিক',
    'footer.europe': 'ইউরোপ',
    'footer.northAmerica': 'উত্তর আমেরিকা',
    'footer.centralAmerica': 'মধ্য আমেরিকা',
    'footer.southAmerica': 'দক্ষিণ আমেরিকা',
    'footer.africa': 'আফ্রিকা',
    'footer.middleEast': 'মধ্যপ্রাচ্য',
    'footer.caribbean': 'ক্যারিবিয়ান',
    'footer.copyright': '© ২০২৪ এয়ারবিএনবি, ইনক. · গোপনীয়তা · শর্তাবলী · সাইটম্যাপ',
    
    // Footer content translations
    'footer.safetyIssue': 'নিরাপত্তা সমস্যার জন্য সাহায্য পান',
    'footer.airbnbExperience': 'আপনার অভিজ্ঞতা এয়ারবিএনবি করুন',
    'footer.airbnbService': 'আপনার সেবা এয়ারবিএনবি করুন',
    'footer.hostingClass': 'বিনামূল্যে হোস্টিং ক্লাসে যোগ দিন',
    'footer.summerRelease': '২০২৫ গ্রীষ্মকালীন রিলিজ',
    'footer.familyTravelHub': 'পারিবারিক ভ্রমণ কেন্দ্র',
    'footer.tipsAndInspiration': 'টিপস এবং অনুপ্রেরণা',
    'footer.kidFriendlyParks': 'শিশু-বান্ধব রাজ্য উদ্যান',
    'footer.familyHikingTrails': 'এই পারিবারিক-বান্ধব হাইকিং ট্রেইলগুলি দেখুন',
    'footer.familyBudgetTravel': 'পারিবারিক বাজেট ভ্রমণ',
    'footer.getThereForLess': 'কম খরচে সেখানে যান',
    'footer.vacationIdeas': 'যেকোনো বাজেটের জন্য ছুটির ধারণা',
    'footer.makeItSpecial': 'এটিকে চাপমুক্ত করে বিশেষ করুন',
    'footer.travelEuropeBudget': 'বাজেটে ইউরোপ ভ্রমণ',
    'footer.kidsToEurope': 'কম খরচে শিশুদের ইউরোপে নিয়ে যাওয়ার উপায়',
    'footer.outdoorAdventure': 'বাইরের অ্যাডভেঞ্চার',
    'footer.exploreNature': 'পরিবারের সাথে প্রকৃতি অন্বেষণ করুন',
    'footer.bucketListParks': 'বাকেট লিস্ট জাতীয় উদ্যান',
    'footer.mustSeeParks': 'পারিবারিক ভ্রমণের জন্য অবশ্যই দেখার উদ্যান',
    'footer.petFriendlyApartments': 'পোষা প্রাণী-বান্ধব অ্যাপার্টমেন্ট',
    'footer.welcomeFurryFriends': 'আপনার পশমী বন্ধুদের স্বাগত জানায় এমন জায়গা খুঁজুন',
    'footer.extendedStayOptions': 'বর্ধিত থাকার বিকল্প',
    'footer.perfectForLongerTrips': 'দীর্ঘ ভ্রমণ এবং দূরবর্তী কাজের জন্য উপযুক্ত',
    'footer.cityCenterLocations': 'শহরের কেন্দ্রস্থল',
    'footer.heartOfAction': 'কর্মের কেন্দ্রে থাকুন',
    'footer.luxuryApartmentRentals': 'বিলাসবহুল অ্যাপার্টমেন্ট ভাড়া',
    'footer.highEndAccommodations': 'বিশেষ অনুষ্ঠানের জন্য উচ্চমানের থাকার ব্যবস্থা',
    'footer.budgetFriendlyApartments': 'বাজেট-বান্ধব অ্যাপার্টমেন্ট',
    'footer.affordableOptions': 'আরাম বিসর্জন না দিয়ে সাশ্রয়ী বিকল্প',
    'footer.familySizedApartments': 'পারিবারিক আকারের অ্যাপার্টমেন্ট',
    'footer.spaciousAccommodations': 'বড় দলের জন্য প্রশস্ত থাকার ব্যবস্থা',
    'footer.businessTravelReady': 'ব্যবসায়িক ভ্রমণের জন্য প্রস্তুত',
    'footer.workspaceAmenities': 'কর্মক্ষেত্রের সুবিধা সহ অ্যাপার্টমেন্ট',
    
    // Search Results
    'searchResults.homesIn': 'বাড়ি',
    'searchResults.noProperties': 'কোন সম্পত্তি পাওয়া যায়নি',
    'searchResults.tryAdjusting': 'আপনার অনুসন্ধানের মানদণ্ড সামঞ্জস্য করুন',
    'searchResults.backToHome': 'হোমে ফিরুন',
    'searchResults.searchError': 'অনুসন্ধান ত্রুটি',
    'searchResults.searchingProperties': 'সম্পত্তি খুঁজছি...',
    
    // Room Details
    'room.guests': 'অতিথি',
    'room.bedrooms': 'বেডরুম',
    'room.bathrooms': 'বাথরুম',
    'room.perNight': 'প্রতি রাত',
    'room.nights': 'রাত',
    'room.superhost': 'সুপারহোস্ট',
    'room.yearsHosting': 'বছর হোস্টিং',
    'room.responseRate': 'প্রতিক্রিয়া হার',
    'room.responseTime': 'প্রতিক্রিয়া সময়',
    'room.whatGuestsLove': 'অতিথিরা যা পছন্দ করে',
    'room.amenities': 'সুবিধা',
    'room.thingsToKnow': 'জানার বিষয়',
    'room.houseRules': 'বাড়ির নিয়ম',
    'room.safetyInfo': 'নিরাপত্তা তথ্য',
    'room.cancellationPolicy': 'বাতিল নীতি',
    'room.reserve': 'সংরক্ষণ',
    'room.basePrice': 'মূল মূল্য',
    'room.originalPrice': 'মূল মূল্য',
    'room.discount': 'ছাড়',
    'room.cleaningFee': 'পরিষ্কারের ফি',
    'room.serviceFee': 'সেবা ফি',
    'room.taxes': 'কর',
    'room.total': 'মোট',
  }
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  // Load language from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('airbnb-language') as Language;
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'bn')) {
      setLanguage(savedLanguage);
    }
  }, []);

  // Save language to localStorage when changed
  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('airbnb-language', lang);
  };

  // Translation function
  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
