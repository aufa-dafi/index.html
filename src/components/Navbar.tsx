import React from 'react';
import { ShoppingBag, Store, ShoppingCart, ShieldCheck, ClipboardList, Search, HeartHandshake } from 'lucide-react';

interface NavbarProps {
  mode: 'user' | 'admin';
  setMode: (mode: 'user' | 'admin') => void;
  halamanAktif: 'katalog' | 'toko' | 'keranjang' | 'pesanan';
  setHalamanAktif: (halaman: 'katalog' | 'toko' | 'keranjang' | 'pesanan') => void;
  jumlahItemKeranjang: number;
  kataKunciCari: string;
  setKataKunciCari: (keyword: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  mode,
  setMode,
  halamanAktif,
  setHalamanAktif,
  jumlahItemKeranjang,
  kataKunciCari,
  setKataKunciCari,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-stone-200 shadow-xs">
      {/* Baris Informasi Atas - Khas Nusantara & UMKM */}
      <div className="bg-amber-800 text-amber-50 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HeartHandshake className="w-4 h-4 text-amber-300" />
            <span>Dukung Gerakan Nasional <strong>#BanggaBuatanIndonesia</strong> — 100% Produk Asli UMKM Daerah</span>
          </div>
          <div className="hidden md:flex items-center gap-4 text-amber-200 text-xs">
            <span>📞 Bantuan Pasar: 0812-3456-7890</span>
            <span>📍 Kirim dari Seluruh Nusantara</span>
          </div>
        </div>
      </div>

      {/* Baris Utama Header */}
      <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          
          {/* Logo Brand Pasar UMKM */}
          <button
            onClick={() => {
              setMode('user');
              setHalamanAktif('katalog');
            }}
            className="flex items-center gap-2.5 text-left group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-600 to-orange-700 flex items-center justify-center text-white shadow-sm font-bold text-xl">
              🏪
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-extrabold text-stone-900 tracking-tight">PasarUMKM</span>
                <span className="text-[10px] uppercase font-bold bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded">Multi-Vendor</span>
              </div>
              <p className="text-xs text-stone-500 font-medium">Lapak Bersama Pengrajin & Petani Lokal</p>
            </div>
          </button>

          {/* Kolom Pencarian Cepat */}
          {mode === 'user' && (
            <div className="flex-1 max-w-md hidden md:block">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  placeholder="Cari keripik, batik, kopi lereng merapi, anyaman..."
                  value={kataKunciCari}
                  onChange={(e) => setKataKunciCari(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-sm bg-stone-100/80 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition"
                />
              </div>
            </div>
          )}

          {/* Navigasi Pembeli / Admin */}
          <div className="flex items-center gap-2 sm:gap-3">
            {mode === 'user' ? (
              <>
                <button
                  onClick={() => setHalamanAktif('katalog')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition cursor-pointer ${
                    halamanAktif === 'katalog'
                      ? 'bg-amber-100 text-amber-900 font-semibold'
                      : 'text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span className="hidden sm:inline">Katalog Belanja</span>
                </button>

                <button
                  onClick={() => setHalamanAktif('toko')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition cursor-pointer ${
                    halamanAktif === 'toko'
                      ? 'bg-amber-100 text-amber-900 font-semibold'
                      : 'text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  <Store className="w-4 h-4" />
                  <span className="hidden sm:inline">Daftar Toko UMKM</span>
                </button>

                <button
                  onClick={() => setHalamanAktif('pesanan')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition cursor-pointer ${
                    halamanAktif === 'pesanan'
                      ? 'bg-amber-100 text-amber-900 font-semibold'
                      : 'text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  <ClipboardList className="w-4 h-4" />
                  <span className="hidden sm:inline">Pesanan Saya</span>
                </button>

                {/* Tombol Keranjang Belanja */}
                <button
                  onClick={() => setHalamanAktif('keranjang')}
                  className="relative p-2.5 rounded-lg bg-orange-50 text-orange-800 hover:bg-orange-100 transition cursor-pointer flex items-center gap-2 font-medium text-sm border border-orange-200"
                >
                  <ShoppingCart className="w-5 h-5 text-orange-700" />
                  <span className="hidden sm:inline">Keranjang</span>
                  {jumlahItemKeranjang > 0 && (
                    <span className="w-5 h-5 bg-red-600 text-white rounded-full text-xs font-bold flex items-center justify-center">
                      {jumlahItemKeranjang}
                    </span>
                  )}
                </button>
              </>
            ) : null}

            {/* Switcher Mode: Pembeli vs Admin */}
            <div className="pl-2 border-l border-stone-200">
              {mode === 'user' ? (
                <button
                  onClick={() => setMode('admin')}
                  className="px-3 py-2 bg-stone-900 text-stone-100 hover:bg-stone-800 rounded-lg text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition cursor-pointer shadow-xs"
                  title="Masuk ke Panel Pengelola Pasar"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Panel Admin</span>
                </button>
              ) : (
                <button
                  onClick={() => setMode('user')}
                  className="px-3 py-2 bg-amber-600 text-white hover:bg-amber-700 rounded-lg text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition cursor-pointer shadow-xs"
                  title="Kembali ke Toko Pembeli"
                >
                  <Store className="w-4 h-4" />
                  <span>Kembali Belanja</span>
                </button>
              )}
            </div>

          </div>

        </div>

        {/* Input Pencarian di Layar Kecil (Mobile) */}
        {mode === 'user' && (
          <div className="mt-2.5 md:hidden">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                placeholder="Cari produk UMKM..."
                value={kataKunciCari}
                onChange={(e) => setKataKunciCari(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm bg-stone-100 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
              />
            </div>
          </div>
        )}

      </div>
    </header>
  );
};
