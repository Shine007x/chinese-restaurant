'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { useCart } from '@/lib/cart-context';
import { useLanguage } from '@/lib/language-context';
import { Menu, ShoppingCart, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function Navbar() {
  const { language, setLanguage, t } = useLanguage();
  const { user, profile, loading: authLoading, signOut } = useAuth();
  const { totalItems } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const router = useRouter();

  const handleLogoutClick = () => {
    setMobileMenuOpen(false);
    setShowLogoutConfirm(true);
  };

  const handleLogoutConfirm = async () => {
    setLoggingOut(true);
    setShowLogoutConfirm(false);
    router.replace('/');
    router.refresh();
    try {
      await signOut();
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-red-900/20 bg-gradient-to-b from-red-950/95 to-red-900/95 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-red-100">
              {t.nav.home === 'Home' ? 'Golden Dragon' : 'ရွှေနဂါး'}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            <Link
              href="/"
              className="text-sm font-medium text-red-100 transition-colors hover:text-yellow-400"
            >
              {t.nav.home}
            </Link>
            <Link
              href="/menu"
              className="text-sm font-medium text-red-100 transition-colors hover:text-yellow-400"
            >
              {t.nav.menu}
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium text-red-100 transition-colors hover:text-yellow-400"
            >
              {t.nav.about}
            </Link>
            {user && (
              <Link
                href="/orders"
                className="text-sm font-medium text-red-100 transition-colors hover:text-yellow-400"
              >
                {t.nav.orders}
              </Link>
            )}
            {profile?.role === 'admin' && (
              <Link
                href="/admin/orders"
                className="text-sm font-bold text-yellow-400 transition-colors hover:text-white"
              >
                {t.nav.admin}
              </Link>
            )}
            {user ? (
              <>
                <Link
                  href="/cart"
                  className="relative flex items-center gap-1 text-sm font-medium text-red-100 transition-colors hover:text-yellow-400"
                >
                  <ShoppingCart className="h-5 w-5" />
                  <span className="hidden sm:inline">{t.cart.cart}</span>
                  {totalItems > 0 && (
                    <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-yellow-400 px-1.5 text-xs font-bold text-red-950">
                      {totalItems > 99 ? '99+' : totalItems}
                    </span>
                  )}
                </Link>
                <button
                  onClick={handleLogoutClick}
                  className="text-sm font-medium text-red-100 transition-colors hover:text-yellow-400"
                >
                  {t.nav.logout}
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="text-sm font-medium text-red-100 transition-colors hover:text-yellow-400"
              >
                {t.nav.login}
              </Link>
            )}

            {/* Language Switcher */}
            <div className="flex items-center space-x-2 border-l border-red-800/50 pl-6">
              <button
                onClick={() => setLanguage('en')}
                className={`px-2 py-1 text-sm font-medium transition-colors ${language === 'en'
                  ? 'text-yellow-400'
                  : 'text-red-200 hover:text-yellow-400'
                  }`}
              >
                EN
              </button>
              <span className="text-red-600">|</span>
              <button
                onClick={() => setLanguage('mm')}
                className={`px-2 py-1 text-sm font-medium transition-colors ${language === 'mm'
                  ? 'text-yellow-400'
                  : 'text-red-200 hover:text-yellow-400'
                  }`}
              >
                MM
              </button>
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-red-100 hover:text-yellow-400"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-3">
            <Link
              href="/"
              className="block px-3 py-2 text-base font-medium text-red-100 hover:text-yellow-400"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t.nav.home}
            </Link>
            <Link
              href="/menu"
              className="block px-3 py-2 text-base font-medium text-red-100 hover:text-yellow-400"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t.nav.menu}
            </Link>
            <Link
              href="/about"
              className="block px-3 py-2 text-base font-medium text-red-100 hover:text-yellow-400"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t.nav.about}
            </Link>
            {user && (
              <Link
                href="/orders"
                className="block px-3 py-2 text-base font-medium text-red-100 hover:text-yellow-400"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t.nav.orders}
              </Link>
            )}
            {profile?.role === 'admin' && (
              <Link
                href="/admin/orders"
                className="block px-3 py-2 text-base font-bold text-yellow-400 hover:text-white underline decoration-yellow-400/50 underline-offset-4"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t.nav.admin}
              </Link>
            )}
            {user ? (
              <>
                <Link
                  href="/cart"
                  className="flex items-center gap-2 px-3 py-2 text-base font-medium text-red-100 hover:text-yellow-400"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t.cart.cart}
                  {totalItems > 0 && (
                    <span className="rounded-full bg-yellow-400 px-2 py-0.5 text-xs font-bold text-red-950">
                      {totalItems}
                    </span>
                  )}
                </Link>
                <button
                  onClick={handleLogoutClick}
                  className="block w-full px-3 py-2 text-left text-base font-medium text-red-100 hover:text-yellow-400"
                >
                  {t.nav.logout}
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="block px-3 py-2 text-base font-medium text-red-100 hover:text-yellow-400"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t.nav.login}
              </Link>
            )}
            <div className="flex items-center space-x-2 border-t border-red-800/50 pt-3 mt-3">
              <button
                onClick={() => {
                  setLanguage('en');
                  setMobileMenuOpen(false);
                }}
                className={`px-3 py-2 text-base font-medium ${language === 'en'
                  ? 'text-yellow-400'
                  : 'text-red-200'
                  }`}
              >
                EN
              </button>
              <span className="text-red-600">|</span>
              <button
                onClick={() => {
                  setLanguage('mm');
                  setMobileMenuOpen(false);
                }}
                className={`px-3 py-2 text-base font-medium ${language === 'mm'
                  ? 'text-yellow-400'
                  : 'text-red-200'
                  }`}
              >
                MM
              </button>
            </div>
          </div>
        )}

        {/* Logout confirmation modal */}
        {showLogoutConfirm && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="logout-confirm-title"
            onClick={() => !loggingOut && setShowLogoutConfirm(false)}
          >
            <div
              className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h2
                id="logout-confirm-title"
                className="display-font text-lg font-semibold text-red-950"
              >
                {t.auth.logoutConfirmTitle}
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                {t.auth.logoutConfirmMessage}
              </p>
              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowLogoutConfirm(false)}
                  disabled={loggingOut}
                  className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
                >
                  {t.auth.logoutConfirmCancel}
                </button>
                <button
                  type="button"
                  onClick={handleLogoutConfirm}
                  disabled={loggingOut}
                  className="flex-1 rounded-lg bg-red-900 px-4 py-2 text-sm font-semibold text-yellow-300 transition-colors hover:bg-red-800 disabled:opacity-70"
                >
                  {loggingOut ? t.common.loading : t.auth.logoutConfirmButton}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
