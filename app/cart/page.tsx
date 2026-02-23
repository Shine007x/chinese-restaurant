'use client';

import { useAuth } from '@/lib/auth-context';
import { useCart } from '@/lib/cart-context';
import { useLanguage } from '@/lib/language-context';
import { motion } from 'framer-motion';
import { ShoppingBag, Trash2 } from 'lucide-react';
import Link from 'next/link';

function formatPrice(kyats: number): string {
  return `${kyats.toLocaleString()} MMK`;
}

export default function CartPage() {
  const { language, t } = useLanguage();
  const { user, loading: authLoading } = useAuth();
  const { cart, removeItem, totalItems, totalPrice, getItem } = useCart();

  if (authLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-gray-500">{t.common.loading}</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-xl bg-white p-8 text-center shadow-lg">
          <h2 className="display-font text-2xl font-bold text-red-950">
            {language === 'en' ? 'Log in to view your cart' : 'ခြင်းတန်းကြည့်ရန် ဝင်ရောက်ပါ'}
          </h2>
          <p className="mt-2 text-gray-600">
            {language === 'en'
              ? 'You need to be logged in to add items and checkout.'
              : 'ပစ္စည်းများထည့်ရန်နှင့် ငွေပေးချေရန် ဝင်ရောက်ရမည်။'}
          </p>
          <Link
            href="/login?next=/cart"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-red-900 px-6 py-3 font-semibold text-yellow-300 transition-colors hover:bg-red-800"
          >
            {t.nav.login}
          </Link>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-red-50 to-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl bg-white p-12 text-center shadow-lg"
          >
            <ShoppingBag className="mx-auto h-16 w-16 text-gray-300" />
            <h2 className="display-font mt-4 text-2xl font-bold text-red-950">
              {t.cart.emptyCart}
            </h2>
            <p className="mt-2 text-gray-600">
              {language === 'en'
                ? 'Browse our menu and add items to get started.'
                : 'မီနူးကြည့်ပြီး ပစ္စည်းများထည့်ကာ စတင်ပါ။'}
            </p>
            <Link
              href="/menu"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-red-900 px-6 py-3 font-semibold text-yellow-300 transition-colors hover:bg-red-800"
            >
              {t.nav.menu}
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="display-font text-3xl font-bold text-red-950">
            {t.cart.cart}
          </h1>
          <p className="mt-1 text-gray-600">
            {totalItems} {language === 'en' ? 'item(s)' : 'ပစ္စည်း'}
          </p>

          <div className="mt-8 space-y-4">
            {cart.map((entry) => {
              const item = getItem(entry.menuItemId);
              if (!item) return null;
              return (
                <motion.div
                  key={entry.menuItemId}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex items-center gap-4 rounded-xl bg-white p-4 shadow-md"
                >
                  {item.image && (
                    <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg">
                      <img
                        src={item.image}
                        alt={language === 'en' ? item.nameEn : item.nameMm}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-red-950">
                      {language === 'en' ? item.nameEn : item.nameMm}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {entry.quantity} × {formatPrice(item.price)}
                    </p>
                  </div>
                  <p className="font-semibold text-red-800">
                    {formatPrice(item.price * entry.quantity)}
                  </p>
                  <button
                    onClick={() => removeItem(entry.menuItemId)}
                    aria-label={t.cart.remove}
                    className="rounded-lg p-2 text-red-600 transition-colors hover:bg-red-50 hover:text-red-800"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </motion.div>
              );
            })}
          </div>

          <div className="mt-8 rounded-xl bg-white p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold text-red-950">{t.cart.total}</span>
              <span className="text-2xl font-bold text-red-800">
                {formatPrice(totalPrice)}
              </span>
            </div>
            <Link
              href="/checkout"
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-red-900 px-6 py-3 font-semibold text-yellow-300 transition-colors hover:bg-red-800"
            >
              {t.cart.checkout}
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
