export const CONTACT_INFO = {
  phone: '01031450254',
  phoneDisplay: '01031450254',
  phoneInternational: '+20 103 145 0254',
  whatsAppDigits: '201031450254',
  addressEn: '8 El basaa Street - Shoubra Masr, Cairo, Egypt',
  addressAr: '8 شارع البصاء - شبرا مصر، القاهرة',
  email: 'helalgroup2020@gmail.com',
  workingHoursEn: 'Sat - Thu: 10:00 AM - 10:00 PM',
  workingHoursAr: 'السبت - الخميس: 10:00 ص - 10:00 م',
};

export const getWhatsAppLink = (message: string) => {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${CONTACT_INFO.whatsAppDigits}?text=${encoded}`;
};
