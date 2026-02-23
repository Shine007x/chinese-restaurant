'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/lib/auth-context';
import { useLanguage } from '@/lib/language-context';
import { motion } from 'framer-motion';
import { CheckCircle2, Clock, Eye, Package, Truck, XCircle } from 'lucide-react';
import { menuItems } from '@/lib/menu-data';

type OrderStatus = 'pending' | 'approved' | 'declined' | 'cancelled' | 'preparing' | 'shipped';

type OrderItemRow = {
  id: string;
  order_id: string;
  menu_item_id: string;
  quantity: number;
  unit_price: number;
};

type OrderRow = {
  id: string;
  user_id: string;
  total_amount: number;
  status: OrderStatus;
  payment_screenshot_path: string | null;
  created_at: string;
  order_items?: OrderItemRow[];
};

function formatPrice(kyats: number): string {
  return `${kyats.toLocaleString()} MMK`;
}

export default function OrdersPage() {
  const { user, loading: authLoading } = useAuth();
  const { language, t } = useLanguage();
  const router = useRouter();
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      setLoading(false);
      return;
    }

    const loadOrders = async () => {
      try {
        const supabase = createClient();
        const { data, error: fetchError } = await supabase
          .from('orders')
          .select('*, order_items(*)')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (fetchError) throw fetchError;
        setOrders((data ?? []) as OrderRow[]);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load orders');
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [authLoading, user]);

  const handleViewProof = async (order: OrderRow) => {
    if (!order.payment_screenshot_path) return;
    try {
      const supabase = createClient();
      const { data, error: urlError } = await supabase.storage
        .from('payment-proofs')
        .createSignedUrl(order.payment_screenshot_path, 60 * 60);

      if (urlError || !data?.signedUrl) {
        throw urlError ?? new Error('Could not load image');
      }
      window.open(data.signedUrl, '_blank', 'noopener,noreferrer');
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to open payment proof'
      );
    }
  };

  const statusConfig: Record<
    OrderStatus,
    { labelEn: string; labelMm: string; className: string; icon: typeof Clock }
  > = {
    pending: {
      labelEn: 'Pending',
      labelMm: 'စီစဉ်ဆောင်ရွက်နေသည်',
      className: 'bg-yellow-100 text-yellow-800',
      icon: Clock,
    },
    approved: {
      labelEn: 'Approved',
      labelMm: 'အတည်ပြုပြီး',
      className: 'bg-green-100 text-green-800',
      icon: CheckCircle2,
    },
    declined: {
      labelEn: 'Declined',
      labelMm: 'ငြင်းပယ်ပြီး',
      className: 'bg-red-100 text-red-800',
      icon: XCircle,
    },
    cancelled: {
      labelEn: 'Cancelled',
      labelMm: 'ပယ်ဖျက်ပြီး',
      className: 'bg-gray-100 text-gray-700',
      icon: XCircle,
    },
    preparing: {
      labelEn: 'Preparing',
      labelMm: 'ပြင်ဆင်နေသည်',
      className: 'bg-blue-100 text-blue-800',
      icon: Package,
    },
    shipped: {
      labelEn: 'Shipped',
      labelMm: 'ပို့ပြီး',
      className: 'bg-indigo-100 text-indigo-800',
      icon: Truck,
    },
  };

  if (authLoading || loading) {
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
            {language === 'en'
              ? 'Log in to view your orders'
              : 'သင့်အော်ဒါများကြည့်ရန် ဝင်ရောက်ပါ'}
          </h2>
          <p className="mt-2 text-gray-600">
            {language === 'en'
              ? 'Sign in to see your order history and status.'
              : 'သင့်အော်ဒါ မှတ်တမ်းနှင့် အခြေအနေကြည့်ရန် ဝင်ရောက်ပါ။'}
          </p>
          <Link
            href="/login?next=/orders"
            className="mt-6 inline-flex rounded-lg bg-red-900 px-6 py-3 font-semibold text-yellow-300 transition-colors hover:bg-red-800"
          >
            {t.nav.login}
          </Link>
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
          className="rounded-xl bg-white p-6 shadow-lg"
        >
          <h1 className="display-font text-3xl font-bold text-red-950">
            {t.nav.orders}
          </h1>
          <p className="mt-1 text-gray-600">
            {language === 'en'
              ? 'Your order history and current status.'
              : 'သင့်အော်ဒါ မှတ်တမ်းနှင့် အခြေအနေ။'}
          </p>

          {error && (
            <div className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          {orders.length === 0 ? (
            <div className="mt-8 flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 py-16">
              <Package className="h-16 w-16 text-gray-300" />
              <p className="mt-4 text-center text-gray-600">
                {language === 'en'
                  ? "You haven't placed any orders yet."
                  : 'သင် အော်ဒါများ မှာယူထားခြင်း မရှိသေးပါ။'}
              </p>
              <Link
                href="/menu"
                className="mt-6 rounded-lg bg-red-900 px-6 py-3 font-semibold text-yellow-300 transition-colors hover:bg-red-800"
              >
                {t.nav.menu}
              </Link>
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              {orders.map((order) => {
                const config = statusConfig[order.status] ?? statusConfig.pending;
                const StatusIcon = config.icon;
                const statusLabel =
                  language === 'en' ? config.labelEn : config.labelMm;

                return (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-gray-50/50 p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-gray-500">
                        {language === 'en' ? 'Order' : 'အော်ဒါ'} #{order.id.slice(0, 8)}
                      </p>
                      <p className="mt-1 text-sm text-gray-600">
                        {new Date(order.created_at).toLocaleString(
                          language === 'en' ? 'en-US' : 'my-MM',
                          {
                            dateStyle: 'medium',
                            timeStyle: 'short',
                          }
                        )}
                      </p>
                      {order.order_items && order.order_items.length > 0 && (
                        <ul className="mt-2 space-y-0.5 text-sm text-gray-700">
                          {order.order_items.map((oi) => {
                            const item = menuItems.find((m) => m.id === oi.menu_item_id);
                            const name = item
                              ? language === 'en'
                                ? item.nameEn
                                : item.nameMm
                              : oi.menu_item_id;
                            return (
                              <li key={oi.id}>
                                {name} × {oi.quantity}
                                <span className="text-gray-500">
                                  {' '}
                                  — {formatPrice(oi.quantity * oi.unit_price)}
                                </span>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                      <span
                        className={`mt-2 inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${config.className}`}
                      >
                        <StatusIcon className="h-3.5 w-3.5" />
                        {statusLabel}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 sm:gap-6">
                      <p className="text-lg font-semibold text-red-800">
                        {formatPrice(order.total_amount)}
                      </p>
                      {order.payment_screenshot_path && (
                        <button
                          type="button"
                          onClick={() => handleViewProof(order)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                        >
                          <Eye className="h-4 w-4" />
                          {language === 'en'
                            ? 'View proof'
                            : 'သက်သြကြည့်ရန်'}
                        </button>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
