'use client';

import Link from 'next/link';
import { useLanguage } from '@/lib/language-context';
import { motion } from 'framer-motion';
import { ArrowRight, Heart, Sparkles, Users } from 'lucide-react';

export default function AboutPage() {
  const { t, language } = useLanguage();

  const story = {
    en: {
      heading: 'Our Story',
      lead: 'Golden Dragon has been serving authentic Chinese cuisine in Myanmar for over two decades. What started as a small family kitchen has grown into a beloved destination for dim sum, wok-fired classics, and roast specialties.',
      body: 'We believe in tradition without compromise. Our chefs use time-honored techniques and the finest ingredients to bring you the same flavors that have made Chinese food a favorite across generations. From our steamy baskets of siu mai to our crispy Peking duck, every dish is prepared with care and served with warmth.',
    },
    mm: {
      heading: 'ကျွန်ုပ်တို့၏ သမိုင်း',
      lead: 'ရွှေနဂါးသည် မြန်မာနိုင်ငံတွင် နှစ်နှစ်ဆယ်ကျော်ကြာ စစ်မှန်သော တရုတ်အစားအစာများ ပြင်ဆင်ပြီး စားသောက်ဆိုင်အဖြစ် လုပ်ကိုင်ခဲ့ပါသည်။ မိသားစုစချက်ပြုတ်သည့် နေရာငယ်လေးမှ စတင်၍ ဒင်ဆမ်၊ ဝေါ့ကြော်ဟင်းလျာများနှင့် ကင်အထူးဟင်းလျာများအတွက် လူကြိုက်များသော စားသောက်ဆိုင်တစ်ခု ဖြစ်လာခဲ့ပါသည်။',
      body: 'ကျွန်ုပ်တို့သည် ရိုးရာဓလေ့ကို လျှော့မပေးဘဲ ယုံကြည်ပါသည်။ ကျွန်ုပ်တို့၏ စားဖိုမှူးများသည် နည်းပညာများနှင့် အကောင်းဆုံးပါဝင်ပစ္စည်းများဖြင့် မျိုးဆက်တစ်ခုပြီးတစ်ခု တရုတ်အစားအစာကို နှစ်သက်စေခဲ့သော အရသာများကို သင့်ထံ ယူဆောင်ပေးပါသည်။ ဆိုင်းမိုင်းပေါင်းထုပ်များမှ ပက်ကင်းဘဲကင်အထိ ဟင်းလျာတိုင်းကို ဂရုတစိုက်ပြင်ဆင်ပြီး ကြင်နာစွာ ပြသပေးပါသည်။',
    },
  };

  const values = [
    {
      en: { title: 'Authentic Taste', desc: 'Traditional recipes and techniques passed down and perfected in our kitchen.' },
      mm: { title: 'စစ်မှန်သော အရသာ', desc: 'ရိုးရာဟင်းချက်နည်းများနှင့် ကျွန်ုပ်တို့အချို့ပြုတ်ခန်းတွင် ပြီးပြည့်စုံအောင် လုပ်ထားသော နည်းပညာများ။' },
      icon: Sparkles,
    },
    {
      en: { title: 'Fresh Ingredients', desc: 'We source quality ingredients to ensure every dish meets our standards.' },
      mm: { title: 'လတ်ဆတ်သော ပါဝင်ပစ္စည်းများ', desc: 'ဟင်းလျာတိုင်း ကျွန်ုပ်တို့စံချိန်စံညွှန်းနှင့် ကိုက်ညီစေရန် ပါဝင်ပစ္စည်းအရည်အသွေးကောင်းများ ရွေးချယ်ပါသည်။' },
      icon: Heart,
    },
    {
      en: { title: 'Family & Community', desc: 'A place where families and friends gather to share good food and moments.' },
      mm: { title: 'မိသားစုနှင့် ရပ်ရွာ', desc: 'မိသားစုများနှင့်မိတ်ဆွေများ ကောင်းသောအစားအစာနှင့် ကာလများကို မျှဝေရန် စုစည်းရာနေရာ။' },
      icon: Users,
    },
  ];

  const content = language === 'en' ? story.en : story.mm;
  const valueList = values.map((v) => ({ ...(language === 'en' ? v.en : v.mm), icon: v.icon }));

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
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="display-font text-5xl font-bold tracking-tight text-yellow-400 sm:text-6xl md:text-7xl">
              {language === 'en' ? 'About Us' : 'ကျွန်ုပ်တို့အကြောင်း'}
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-red-200">
              {language === 'en'
                ? 'Authentic Chinese cuisine, served with heart since day one.'
                : 'ပထမနေ့မှစ၍ စိတ်နှလုံးအပြည့်ဖြင့် ပြင်ဆင်ပြီး စစ်မှန်သော တရုတ်အစားအစာ။'}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <h2 className="display-font text-3xl font-bold text-red-950 sm:text-4xl">
            {content.heading}
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            {content.lead}
          </p>
          <p className="mt-4 text-lg leading-8 text-gray-600">
            {content.body}
          </p>
        </motion.div>
      </section>

      {/* Values */}
      <section className="border-t border-red-100 bg-white/50 py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="display-font text-3xl font-bold text-red-950 sm:text-4xl">
              {language === 'en' ? 'What We Stand For' : 'ကျွန်ုပ်တို့ ရပ်တည်ချက်'}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
              {language === 'en'
                ? 'Quality, tradition, and a welcoming table for everyone.'
                : 'အရည်အသွေး၊ ရိုးရာဓလေ့နှင့် လူတိုင်းအတွက် ကြိုဆိုသော စားပွဲ။'}
            </p>
          </motion.div>
          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {valueList.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="rounded-xl bg-white p-8 shadow-lg transition-shadow hover:shadow-xl"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-100 text-red-800">
                  <item.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 display-font text-xl font-semibold text-red-950">
                  {item.title}
                </h3>
                <p className="mt-2 text-gray-600">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
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
                ? 'Come dine with us'
                : 'ကျွန်ုပ်တို့နှင့်အတူ စားသောက်ပါ'}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-red-100">
              {language === 'en'
                ? 'Explore our menu and find your next favorite dish.'
                : 'ကျွန်ုပ်တို့၏ မီနူးကို ကြည့်ပြီး သင့်နောက်အချစ်ဆုံး ဟင်းလျာကို ရှာပါ။'}
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
