'use client'
import Script from 'next/script'

export default function ClientExtras() {
  // app_build Query এখান থেকে পুরা Remove করে দিলাম!
  // ওটা শুধু AutoUpdater.jsx Handle করবে - Duplicate 0 হবে!

  return (
    <>
      <Script id="schema-store" type="application/ld+json" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "OnlineStore",
          "name": "Baharaz Bangladesh",
          "url": "https://baharaz.com.bd",
          "logo": "https://baharaz.com.bd/logo.png",
          "description": "Largest Online Shopping Mall in Bangladesh - Mini Fan, Mobile, Game, Fashion - #1 Brand",
          "address": { "@type": "PostalAddress", "addressLocality": "Rajshahi", "addressCountry": "BD" },
          "potentialAction": { "@type": "SearchAction", "target": "https://baharaz.com.bd/search?q={search_term_string}", "query-input": "required name=search_term_string" },
          "sameAs": ["https://facebook.com/baharazbd","https://instagram.com/baharazbd"]
        })}} />

      <Script id="schema-org" type="application/ld+json" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "Baharaz",
          "alternateName": "Baharaz BD",
          "url": "https://baharaz.com.bd",
          "logo": "https://baharaz.com.bd/logo.png",
          "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.9", "reviewCount": "15432" },
          "contactPoint": { "@type": "ContactPoint", "telephone": "+880-XXX-XXXXXXX", "contactType": "Customer Service", "areaServed": "BD", "availableLanguage": ["en", "bn"] }
        })}} />

      <Script src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX" strategy="afterInteractive" />

      <Script id="baharaz-features" strategy="afterInteractive">{`
          if ('serviceWorker' in navigator) {
            window.addEventListener('load', function() {
              navigator.serviceWorker.register('/sw.js').then(function(reg){ console.log('Baharaz PWA Ready'); }).catch(()=>{});
            });
          }
          window.addEventListener('storage', function(e){
            try {
              if(e.key === 'baharaz_cart') { window.dispatchEvent(new Event('cartUpdated')); }
              if(e.key === 'baharaz_user') { window.dispatchEvent(new Event('userUpdated')); }
              if(e.key === 'baharaz_lang') {
                if(e.newValue && (e.newValue === 'bn' || e.newValue === 'en')){
                  window.dispatchEvent(new CustomEvent('languageChanged', {detail: {lang: e.newValue}}));
                  document.documentElement.lang = e.newValue === 'bn'? 'bn' : 'en';
                }
              }
            } catch(err){}
          });
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-XXXXXXXXXX');
      `}</Script>
    </>
  )
}