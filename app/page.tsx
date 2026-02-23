'use client';

import Link from 'next/link';
import { useLanguage } from '@/lib/language-context';
import { motion } from 'framer-motion';
import { ArrowRight, UtensilsCrossed } from 'lucide-react';

export default function Home() {
  const { t, language } = useLanguage();

  const signatureCategories = [
    {
      id: 1,
      name: language === 'en' ? 'Dim Sum' : 'ဒင်ဆမ်',
      description:
        language === 'en'
          ? 'Steamed delicacies and small plates'
          : 'ပေါင်းထားသော အရသာရှိသော အစားအစာများနှင့် ပန်းကန်ပြားငယ်များ',
      image: 'https://images.unsplash.com/photo-1583623025817-d180a2221d0a?w=800&h=600&fit=crop',
      slug: 'dim-sum',
    },
    {
      id: 2,
      name: language === 'en' ? 'Wok-Fried Classics' : 'ဝေါ့ကြော်ထားသော ရိုးရာဟင်းလျာများ',
      description:
        language === 'en'
          ? 'Traditional stir-fried dishes with authentic flavors'
          : 'စစ်မှန်သော အရသာဖြင့် ရိုးရာ ကြော်ထားသော ဟင်းလျာများ',
      image: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=800&h=600&fit=crop',
      slug: 'mains',
    },
    {
      id: 3,
      name: language === 'en' ? 'Noodles' : 'ခေါက်ဆွဲ',
      description:
        language === 'en'
          ? 'Hand-pulled noodles and classic noodle dishes'
          : 'လက်ဖြင့် ဆွဲထားသော ခေါက်ဆွဲများနှင့် ရိုးရာ ခေါက်ဆွဲဟင်းလျာများ',
      image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&h=600&fit=crop',
      slug: 'noodles',
    },
    {
      id: 4,
      name: language === 'en' ? 'Roast Specialties' : 'ကင်ထားသော အထူးဟင်းလျာများ',
      description:
        language === 'en'
          ? 'Crispy roasted duck, pork, and more'
          : 'ကြွပ်ကြွပ်ရှသော ဘဲကင်၊ ဝက်သားကင်နှင့် အခြားဟင်းလျာများ',
      image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800&h=600&fit=crop',
      slug: 'roast',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-red-950 via-red-900 to-red-800">
        <div className="absolute inset-0 bg-black/20"></div>
        <div
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1920&h=1080&fit=crop')",
          }}
        ></div>
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="display-font text-5xl font-bold tracking-tight text-yellow-400 sm:text-6xl md:text-7xl">
              {t.hero.title1}
            </h1>
            <p className="mt-6 text-2xl font-semibold text-red-100 sm:text-3xl">
              {t.hero.title2}
            </p>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-red-200">
              {t.hero.subtitle}
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="/menu"
                className="group flex items-center gap-2 rounded-lg bg-yellow-400 px-6 py-3 text-base font-semibold text-red-950 shadow-lg transition-all hover:bg-yellow-300 hover:shadow-xl"
              >
                {t.hero.cta}
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Signature Selections Section */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="display-font text-4xl font-bold text-red-950 sm:text-5xl">
              {language === 'en' ? 'Signature Selections' : 'အထူးရွေးချယ်ထားသော ဟင်းလျာများ'}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
              {language === 'en'
                ? 'Discover our most beloved dishes, crafted with traditional techniques and authentic ingredients.'
                : 'ရိုးရာ နည်းပညာများနှင့် စစ်မှန်သော ပါဝင်ပစ္စည်းများဖြင့် ပြုလုပ်ထားသော ကျွန်ုပ်တို့၏ အချစ်ဆုံး ဟင်းလျာများကို ရှာဖွေပါ။'}
            </p>
          </motion.div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {signatureCategories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative overflow-hidden rounded-lg bg-white shadow-lg transition-shadow hover:shadow-xl"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                </div>
                <div className="p-6">
                  <div className="mb-2 flex items-center gap-2">
                    <UtensilsCrossed className="h-5 w-5 text-yellow-500" />
                    <h3 className="display-font text-xl font-semibold text-red-950">
                      {category.name}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-600">{category.description}</p>
                  <Link
                    href={`/menu#${category.slug}`}
                    className="mt-4 inline-flex items-center text-sm font-medium text-red-700 transition-colors hover:text-red-900"
                  >
                    {language === 'en' ? 'View dishes' : 'ဟင်းလျာများကြည့်ရန်'}
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-red-900 to-red-800">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="display-font text-3xl font-bold text-white sm:text-4xl">
              {language === 'en'
                ? 'Ready to order?'
                : 'မှာယူရန် အဆင်သင့်ဖြစ်ပြီလား?'}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-red-100">
              {language === 'en'
                ? 'Browse our full menu and place your order today.'
                : 'ကျွန်ုပ်တို့၏ မီနူးအပြည့်အစုံကို ကြည့်ရှုပြီး ယနေ့ပင် မှာယူပါ။'}
            </p>
            <div className="mt-8">
              <Link
                href="/menu"
                className="inline-flex items-center gap-2 rounded-lg bg-yellow-400 px-8 py-3 text-base font-semibold text-red-950 shadow-lg transition-all hover:bg-yellow-300 hover:shadow-xl"
              >
                {t.hero.cta}
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
