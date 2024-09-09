// i18n.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Bộ từ điển cho các ngôn ngữ khác nhau
const resources = {
  en: {
    translation: {
      greeting: "Hello",
      content: "Designing a website is not easy, focus on the basics.",
      test: "Nice to meet you",
    },
  },
  vi: {
    translation: {
      greeting: "Xin chào",
      content: "Thiết kế một trang web không hề dễ dàng, tập trung vào cơ bản.",
      test: "Rất vui được gặp bạn",
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "vi", // Ngôn ngữ mặc định
  interpolation: {
    escapeValue: false, // not needed for React as it escapes by default
  },
});

export default i18n;
