'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/lib/auth-context';
import { useLanguage } from '@/lib/language-context';
import { motion } from 'framer-motion';
import { CheckCircle2, Clock, Eye, Package, Truck, XCircle } from 'lucide-react';
import { menuItems } from '@/lib/menu-data';

type OrderStatus = 'pending' | 'approved' | 'declined' | 'cancelled' | 'preparing' | 'shipped';

const ORDER_STATUSES: OrderStatus[] = [
  'pending',
  'approved',
  'declined',
  'preparing',
  'shipped',
  'cancelled',
];

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

export default function AdminOrdersPage() {
  const { user, profile, loading: authLoading } = useAuth();
  const { language } = useLanguage();
  const router = useRouter();
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [proofUrls, setProofUrls] = useState<Record<string, string>>({});

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      setLoading(false);
      router.replace('/');
      return;
    }

    // Wait for profile to know if user is admin; avoid loading orders until then
    if (profile === null) return;
    if (profile.role !== 'admin') {
      setLoading(false);
      router.replace('/');
      return;
    }

    const loadOrders = async () => {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('orders')
          .select('*, order_items(*)')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setOrders((data ?? []) as OrderRow[]);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load orders');
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [authLoading, user, profile]);

  // Load signed URLs for payment proof images so we can show inline previews
  useEffect(() => {
    const paths = orders
      .filter((o) => o.payment_screenshot_path)
      .map((o) => ({ id: o.id, path: o.payment_screenshot_path! }));

    if (paths.length === 0) return;

    const supabase = createClient();
    const expiry = 60 * 60; // 1 hour

    Promise.all(
      paths.map(async ({ id, path }) => {
        const { data, error } = await supabase.storage
          .from('payment-proofs')
          .createSignedUrl(path, expiry);
        if (error || !data?.signedUrl) return { id, url: null };
        return { id, url: data.signedUrl };
      })
    ).then((results) => {
      setProofUrls((prev) => {
        const next = { ...prev };
        results.forEach(({ id, url }) => {
          if (url) next[id] = url;
        });
        return next;
      });
    });
  }, [orders]);

  const handleChangeStatus = async (id: string, status: OrderStatus) => {
    setUpdatingId(id);
    setError(null);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      setOrders((prev) =>
        prev.map((o) => (o.id === id ? { ...o, status } : o))
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to update order status'
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const handleViewProof = async (order: OrderRow) => {
    if (!order.payment_screenshot_path) return;
    try {
      const supabase = createClient();
      const { data, error } = await supabase.storage
        .from('payment-proofs')
        .createSignedUrl(order.payment_screenshot_path, 60 * 60);

      if (error || !data?.signedUrl) {
        throw error ?? new Error('No signed URL');
      }

      window.open(data.signedUrl, '_blank', 'noopener,noreferrer');
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to open payment proof'
      );
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-gray-500">
          {language === 'en' ? 'Loading orders...' : 'အော်ဒါများ ဖတ်နေပါသည်...'}
        </p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-xl bg-white p-8 text-center shadow-lg">
          <h2 className="display-font text-2xl font-bold text-red-950">
            {language === 'en'
              ? 'You must be logged in to view admin orders.'
              : 'အော်ဒါစီမံခန့်ခွဲမှုကို ကြည့်ရန် ဝင်ရောက်ထားရပါမည်။'}
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl bg-white p-6 shadow-lg"
        >
          <h1 className="display-font text-3xl font-bold text-red-950">
            {language === 'en' ? 'Orders (Admin)' : 'အော်ဒါများ (စီမံခန့်ခွဲမှု)'}
          </h1>
          {error && (
            <div className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          {orders.length === 0 ? (
            <p className="mt-6 text-gray-600">
              {language === 'en'
                ? 'No orders yet.'
                : 'အော်ဒါများ မရှိသေးပါ။'}
            </p>
          ) : (
            <div className="mt-6 overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left font-semibold text-gray-700">
                      ID
                    </th>
                    <th className="px-3 py-2 text-left font-semibold text-gray-700">
                      User
                    </th>
                    <th className="px-3 py-2 text-left font-semibold text-gray-700">
                      Items
                    </th>
                    <th className="px-3 py-2 text-left font-semibold text-gray-700">
                      Total
                    </th>
                    <th className="px-3 py-2 text-left font-semibold text-gray-700">
                      Status
                    </th>
                    <th className="px-3 py-2 text-left font-semibold text-gray-700">
                      Created
                    </th>
                    <th className="px-3 py-2 text-left font-semibold text-gray-700">
                      Proof
                    </th>
                    <th className="px-3 py-2 text-right font-semibold text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td className="px-3 py-2 align-top text-xs text-gray-500">
                        {order.id.slice(0, 8)}…
                      </td>
                      <td className="px-3 py-2 align-top text-xs text-gray-700">
                        {order.user_id}
                      </td>
                      <td className="max-w-[200px] px-3 py-2 align-top text-xs text-gray-700">
                        {order.order_items && order.order_items.length > 0 ? (
                          <ul className="list-inside list-disc space-y-0.5">
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
                                    ({oi.unit_price.toLocaleString()} MMK)
                                  </span>
                                </li>
                              );
                            })}
                          </ul>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-3 py-2 align-top font-semibold text-red-800">
                        {order.total_amount.toLocaleString()} MMK
                      </td>
                      <td className="px-3 py-2 align-top">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                            order.status === 'approved'
                              ? 'bg-green-100 text-green-800'
                              : order.status === 'declined'
                                ? 'bg-red-100 text-red-800'
                                : order.status === 'cancelled'
                                  ? 'bg-gray-100 text-gray-700'
                                  : order.status === 'preparing'
                                    ? 'bg-blue-100 text-blue-800'
                                    : order.status === 'shipped'
                                      ? 'bg-indigo-100 text-indigo-800'
                                      : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {order.status === 'approved' && <CheckCircle2 className="h-3 w-3" />}
                          {order.status === 'pending' && <Clock className="h-3 w-3" />}
                          {order.status === 'declined' && <XCircle className="h-3 w-3" />}
                          {order.status === 'preparing' && <Package className="h-3 w-3" />}
                          {order.status === 'shipped' && <Truck className="h-3 w-3" />}
                          {order.status === 'cancelled' && <XCircle className="h-3 w-3" />}
                          {order.status}
                        </span>
                      </td>
                      <td className="px-3 py-2 align-top text-xs text-gray-500">
                        {new Date(order.created_at).toLocaleString()}
                      </td>
                      <td className="px-3 py-2 align-top">
                        {order.payment_screenshot_path ? (
                          proofUrls[order.id] ? (
                            <button
                              type="button"
                              onClick={() => handleViewProof(order)}
                              className="block rounded-lg border border-gray-200 overflow-hidden bg-gray-100 hover:opacity-90 focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
                            >
                              <img
                                src={proofUrls[order.id]}
                                alt="Payment proof"
                                className="h-14 w-20 object-cover object-center"
                              />
                            </button>
                          ) : (
                            <span className="text-xs text-gray-400">
                              {language === 'en' ? 'Loading…' : 'ဖတ်နေပါသည်…'}
                            </span>
                          )
                        ) : (
                          <span className="text-xs text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-3 py-2 align-top text-right">
                        <div className="flex justify-end gap-2">
                          {order.payment_screenshot_path && proofUrls[order.id] && (
                            <button
                              onClick={() => handleViewProof(order)}
                              className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2 py-1 text-xs text-gray-700 hover:bg-gray-50"
                            >
                              <Eye className="h-3 w-3" />
                              {language === 'en' ? 'Open full' : 'သက်သေပြကြည့်ရန်'}
                            </button>
                          )}
                          <select
                            value={order.status}
                            disabled={updatingId === order.id}
                            onChange={(e) =>
                              handleChangeStatus(
                                order.id,
                                e.target.value as OrderStatus
                              )
                            }
                            className="rounded-lg border border-gray-300 bg-white px-2 py-1.5 text-xs font-medium text-gray-800 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 disabled:opacity-60"
                          >
                            {ORDER_STATUSES.map((s) => (
                              <option key={s} value={s}>
                                {s.charAt(0).toUpperCase() + s.slice(1)}
                              </option>
                            ))}
                          </select>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

