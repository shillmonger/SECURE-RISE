"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function Translate() {
  const pathname = usePathname();

  useEffect(() => {
    const loadTranslate = () => {
      const existingScript = document.querySelector(
        'script[src="https://cdn.gtranslate.net/widgets/latest/float.js"]'
      );

      // Settings must exist before script loads
      (window as any).gtranslateSettings = {
        default_language: "en",
        native_language_names: true,
        detect_browser_language: true,
        languages: [
          "en",
          "fr",
          "es",
          "de",
          "zh-CN",
          "ja",
          "ar",
          "ru",
          "pt",
          "it",
        ],
        wrapper_selector: ".gtranslate_wrapper",
        alt_flags: { en: "usa" },
      };

      if (!existingScript) {
        const script = document.createElement("script");
        script.src = "https://cdn.gtranslate.net/widgets/latest/float.js";
        script.defer = true;
        document.body.appendChild(script);
      } else {
        // If script already exists, force re-render
        const wrapper = document.querySelector(".gtranslate_wrapper");
        if (wrapper) {
          wrapper.innerHTML = "";
        }

        const script = document.createElement("script");
        script.src = "https://cdn.gtranslate.net/widgets/latest/float.js";
        script.defer = true;
        document.body.appendChild(script);
      }
    };

    const loadSmartsupp = () => {
      const existingScript = document.querySelector(
        'script[src^="https://www.smartsuppchat.com/loader.js"]'
      );

      if (!existingScript) {
        // Initialize Smartsupp settings
        (window as any)._smartsupp = (window as any)._smartsupp || {};
        (window as any)._smartsupp.key = '62fb93ac97458d2446908c0172ecb781cc1c5b8b';

        // Create and load Smartsupp script
        (window as any).smartsupp = (window as any).smartsupp || function(d: any) {
          var s: any, c: any, o = (window as any).smartsupp = function() { (o as any)._ .push(arguments)}; (o as any)._ = [];
          s = d.getElementsByTagName('script')[0]; c = d.createElement('script');
          c.type = 'text/javascript'; c.charset = 'utf-8'; c.async = true;
          c.src = 'https://www.smartsuppchat.com/loader.js?'; s.parentNode.insertBefore(c, s);
        };

        // Initialize Smartsupp
        (window as any).smartsupp(document);
      }
    };

    loadTranslate();
    loadSmartsupp();
  }, [pathname]); // 👈 re-run when route changes

  return (
    <div className="fixed bottom-6 left-5 z-50">
      <div className="gtranslate_wrapper"></div>
    </div>
  );
}