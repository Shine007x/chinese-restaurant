'use client';

import { useAuth } from '@/lib/auth-context';
import { useCart } from '@/lib/cart-context';
import { useLanguage } from '@/lib/language-context';
import { createClient } from '@/lib/supabase/client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChangeEvent, FormEvent, useState } from 'react';

function formatPrice(kyats: number): string {
  return `${kyats.toLocaleString()} MMK`;
}

const MAX_FILE_SIZE_BYTES = 1024 * 1024; // 1MB

export default function CheckoutPage() {
  const { language, t } = useLanguage();
  const { user, loading: authLoading } = useAuth();
  const { cart, totalPrice, getItem, clearCart } = useCart();
  const router = useRouter();

  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (authLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-gray-500">{t.common.loading}</p>
      </div>
    );
  }

  if (!user || cart.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-xl bg-white p-8 text-center shadow-lg">
          <h2 className="display-font text-2xl font-bold text-red-950">
            {language === 'en' ? 'Your cart is empty' : 'သင့်ခြင်းတန်းသည် ဗလာဖြစ်နေပါသည်'}
          </h2>
          <Link
            href="/menu"
            className="mt-6 inline-flex rounded-lg bg-red-900 px-6 py-3 font-semibold text-yellow-300 hover:bg-red-800"
          >
            {t.nav.menu}
          </Link>
        </div>
      </div>
    );
  }

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const selected = event.target.files?.[0];
    if (!selected) {
      setFile(null);
      return;
    }
    if (selected.size > MAX_FILE_SIZE_BYTES) {
      setFile(null);
      setError(
        language === 'en'
          ? 'File must be 1MB or smaller.'
          : 'ဖိုင်အရွယ်အစားသည် ၁မီဂါဘိုက်ထက် မကြီးရပါ။'
      );
      return;
    }
    setFile(selected);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!user) return;
    if (!file) {
      setError(
        language === 'en'
          ? 'Please upload a payment screenshot.'
          : 'ငွေပေးချေသက်သေပြမှတ်တမ်းရုပ်ပုံးကို တင်ပေးပါ။'
      );
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const supabase = createClient();
      const path = `${user.id}/${Date.now()}-${file.name}`;

      const { error: uploadError } = await supabase.storage
        .from('payment-proofs')
        .upload(path, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        throw uploadError;
      }

      const { data: newOrder, error: insertError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          total_amount: totalPrice,
          status: 'pending',
          payment_screenshot_path: path,
        })
        .select('id')
        .single();

      if (insertError) {
        throw insertError;
      }

      if (newOrder?.id) {
        const items = cart.map((entry) => {
          const item = getItem(entry.menuItemId);
          return {
            order_id: newOrder.id,
            menu_item_id: entry.menuItemId,
            quantity: entry.quantity,
            unit_price: item ? item.price : 0,
          };
        });
        const { error: itemsError } = await supabase.from('order_items').insert(items);
        if (itemsError) throw itemsError;
      }

      clearCart();
      router.push('/cart?order=placed');
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : language === 'en'
          ? 'Something went wrong while submitting your payment.'
          : 'ငွေပေးချေမှုတင်သွင်းရာတွင် အမှားတစ်ခု ဖြစ်ပွားခဲ့သည်။'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl bg-white p-8 shadow-lg"
        >
          <h1 className="display-font text-3xl font-bold text-red-950">
            {language === 'en' ? 'Checkout' : 'ငွေပေးချေရန်'}
          </h1>

          {/* Order summary */}
          <div className="mt-6 space-y-3 border-b border-gray-200 pb-6">
            {cart.map((entry) => {
              const item = getItem(entry.menuItemId);
              if (!item) return null;
              return (
                <div
                  key={entry.menuItemId}
                  className="flex justify-between text-gray-700"
                >
                  <span>
                    {language === 'en' ? item.nameEn : item.nameMm} × {entry.quantity}
                  </span>
                  <span>{formatPrice(item.price * entry.quantity)}</span>
                </div>
              );
            })}
            <div className="mt-4 flex justify-between text-lg font-semibold">
              <span>{t.cart.total}</span>
              <span className="text-red-800">{formatPrice(totalPrice)}</span>
            </div>
          </div>

          {/* KBZPay instructions */}
          <div className="mt-8 grid gap-8 md:grid-cols-2">
            <div>
              <h2 className="display-font text-xl font-semibold text-red-950">
                {language === 'en'
                  ? 'Pay with KBZPay'
                  : 'KBZPay ဖြင့် ငွေပေးချေပါ'}
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                {language === 'en'
                  ? 'Scan the QR code in KBZPay and pay the exact amount to:'
                  : 'KBZPay ဖြင့် QR ကုပ်ကို စကန်းဖတ်၍ အောက်ပါ အကျသင့်ငွေကို ပေးချေပါ -'}
              </p>
              <ul className="mt-3 text-sm text-gray-800">
                <li>
                  <span className="font-semibold">KBZPay:</span>{' '}
                  09 261 463 788
                </li>
                <li>
                  <span className="font-semibold">
                    {language === 'en' ? 'Name' : 'နာမည်'}:
                  </span>{' '}
                  Mg Kyaw Zin Hein
                </li>
                <li>
                  <span className="font-semibold">
                    {language === 'en' ? 'Amount' : 'ငွေပမာဏ'}:
                  </span>{' '}
                  {formatPrice(totalPrice)}
                </li>
              </ul>
              <p className="mt-3 text-xs text-gray-500">
                {language === 'en'
                  ? 'After payment, take a screenshot and upload it below as proof.'
                  : 'ငွေပေးချေပြီးနောက် စကရိန်းရှော့တစ်ပုံကို ယူပြီး အောက်တွင် တင်ပေးပါ။'}
              </p>
            </div>

            <div className="flex flex-col items-center justify-center gap-4">
              {/* Replace /kpay-qr.png with your actual QR image in /public */}
              <div className="overflow-hidden rounded-xl border border-gray-200 bg-gray-50 p-3">
                <img
                  src="/kpay-qr.png"
                  alt="KBZPay QR code"
                  className="h-auto w-56 max-w-full"
                />
              </div>
            </div>
          </div>

          {/* Upload form */}
          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            {error && (
              <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="payment-proof"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                {language === 'en'
                  ? 'Upload payment screenshot (max 1MB)'
                  : 'ငွေပေးချေသက်သေပြ စကရိန်းရှော့ (အများဆုံး ၁မီဂါဘိုက်)'}
              </label>
              <input
                id="payment-proof"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-700 file:mr-4 file:rounded-md file:border-0 file:bg-red-900 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-yellow-300 hover:file:bg-red-800"
              />
              {file && (
                <p className="mt-1 text-xs text-gray-500">
                  {language === 'en' ? 'Selected file:' : 'ရွေးထားသည့်ဖိုင်'}{' '}
                  {file.name} ({Math.round(file.size / 1024)} KB)
                </p>
              )}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Link
                href="/cart"
                className="text-sm text-red-600 hover:text-red-800"
              >
                {language === 'en'
                  ? '← Back to cart'
                  : '← ခြင်းတန်းသို့ ပြန်သွားရန်'}
              </Link>

              <button
                type="submit"
                disabled={submitting}
                className="flex w-full items-center justify-center rounded-lg bg-red-900 px-6 py-3 text-sm font-semibold text-yellow-300 transition-colors hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
              >
                {submitting
                  ? language === 'en'
                    ? 'Submitting...'
                    : 'တင်သွင်းနေပါသည်...'
                  : language === 'en'
                  ? 'Submit payment & place order'
                  : 'ငွေပေးချေမှုပုံတင်၍ အော်ဒါအတည်ပြုရန်'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

