import type { Metadata } from "next";
import { Providers } from "@/components/layout/Providers";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "КУРС — Онлайн-обучение программированию",
    template: "%s | КУРС",
  },
  description:
    "Практические курсы по программированию на русском языке. JavaScript, React, TypeScript, Python и другие технологии.",
  keywords: [
    "онлайн курсы программирования",
    "обучение программированию",
    "курсы JavaScript",
    "курсы React",
    "курсы TypeScript",
    "курсы Python",
    "обучение IT",
    "видеокурсы",
    "русский язык",
    "сертификат программирование",
  ],
  metadataBase: new URL(process.env.AUTH_URL ?? "http://localhost:3002"),
  alternates: { canonical: process.env.AUTH_URL ?? "http://localhost:3002" },
  openGraph: {
    siteName: "КУРС",
    locale: "ru_RU",
    type: "website",
  },
};

const YM_ID = process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru" className="h-full">
      <body className="min-h-full flex flex-col antialiased">
        <Providers>{children}</Providers>

        {/* Яндекс Метрика — российская аналитика */}
        {YM_ID && (
          <>
            <Script id="yandex-metrika" strategy="afterInteractive">
              {`
                (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
                m[i].l=1*new Date();
                for(var j=0;j<document.scripts.length;j++){if(document.scripts[j].src===r){return;}}
                k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
                (window,document,"script","https://mc.yandex.ru/metrika/tag.js","ym");
                ym(${YM_ID},"init",{
                  clickmap: true,
                  trackLinks: true,
                  accurateTrackBounce: true,
                  webvisor: true,
                  ecommerce: "dataLayer"
                });
              `}
            </Script>
            <noscript>
              <div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://mc.yandex.ru/watch/${YM_ID}`}
                  style={{ position: "absolute", left: -9999 }}
                  alt=""
                />
              </div>
            </noscript>
          </>
        )}
      </body>
    </html>
  );
}
