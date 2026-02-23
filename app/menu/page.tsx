'use client';

import { useAuth } from '@/lib/auth-context';
import { useCart } from '@/lib/cart-context';
import { useLanguage } from '@/lib/language-context';
import { menuCategories, menuItems } from '@/lib/menu-data';
import { motion } from 'framer-motion';
import { ShoppingCart, UtensilsCrossed } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef } from 'react';

function formatPrice(kyats: number): string {
  return `${kyats.toLocaleString()} MMK`;
}

export default function MenuPage() {
  const { language, t } = useLanguage();
  const { user } = useAuth();
  const { addItem } = useCart();
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash && sectionRefs.current[hash]) {
      sectionRefs.current[hash]?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-red-950 via-red-900 to-red-800">
        <div className="absolute inset-0 bg-black/20" />
        <div
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1920&h=1080&fit=crop')",
          }}
        />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="display-font text-4xl font-bold tracking-tight text-yellow-400 sm:text-5xl md:text-6xl">
              {language === 'en' ? 'Our Menu' : 'ကျွန်ုပ်တို့၏ မီနူး'}
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-red-200">
              {language === 'en'
                ? 'Authentic Chinese dishes, from dim sum to roast specialties.'
                : 'ဒင်ဆမ်မှ ကင်အထူးဟင်းလျာများအထိ စစ်မှန်သော တရုတ်ဟင်းလျာများ။'}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Category jump links */}
      <section className="sticky top-16 z-40 border-b border-red-200/50 bg-white/90 py-3 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav className="flex flex-wrap justify-center gap-2 sm:gap-4">
            {menuCategories.map((cat) => (
              <a
                key={cat.slug}
                href={`#${cat.slug}`}
                className="rounded-lg px-4 py-2 text-sm font-medium text-red-900 transition-colors hover:bg-red-100 hover:text-red-950"
              >
                {language === 'en' ? cat.nameEn : cat.nameMm}
              </a>
            ))}
          </nav>
        </div>
      </section>

      {/* Menu sections */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        {menuCategories.map((category, catIndex) => {
          const items = menuItems.filter((m) => m.category === category.slug);
          if (items.length === 0) return null;

          return (
            <motion.section
              key={category.slug}
              id={category.slug}
              ref={(el) => {
                sectionRefs.current[category.slug] = el;
              }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: catIndex * 0.1 }}
              className="scroll-mt-24 pb-16"
            >
              <div className="mb-8 flex items-center gap-3">
                <UtensilsCrossed className="h-8 w-8 text-red-800" />
                <h2 className="display-font text-3xl font-bold text-red-950">
                  {language === 'en' ? category.nameEn : category.nameMm}
                </h2>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((item, index) => (
                  <motion.article
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    className="flex overflow-hidden rounded-xl bg-white shadow-md transition-shadow hover:shadow-lg"
                  >
                    {item.image && (
                      <div className="h-32 w-28 flex-shrink-0 overflow-hidden sm:h-36 sm:w-36">
                        <img
                          src={item.image}
                          alt={language === 'en' ? item.nameEn : item.nameMm}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex flex-1 flex-col justify-between p-4">
                      <div>
                        <h3 className="font-semibold text-red-950">
                          {language === 'en' ? item.nameEn : item.nameMm}
                        </h3>
                        <p className="mt-1 text-sm text-gray-600">
                          {language === 'en' ? item.descriptionEn : item.descriptionMm}
                        </p>
                      </div>
                      <div className="mt-2 flex items-center justify-between gap-2">
                        <p className="font-semibold text-red-800">
                          {formatPrice(item.price)}
                        </p>
                        {user ? (
                          <button
                            onClick={() => addItem(item.id)}
                            className="flex items-center gap-1.5 rounded-lg bg-red-800 px-3 py-1.5 text-sm font-medium text-yellow-300 transition-colors hover:bg-red-900"
                          >
                            <ShoppingCart className="h-4 w-4" />
                            {t.cart.addToCart}
                          </button>
                        ) : (
                          <Link
                            href="/login?next=/menu"
                            className="text-sm text-red-600 hover:text-red-800"
                          >
                            {t.cart.loginToAdd}
                          </Link>
                        )}
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>
            </motion.section>
          );
        })}
      </div>
    </div>
  );
}
