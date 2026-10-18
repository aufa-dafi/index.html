import React, { useState } from 'react';
import { Vendor, Produk, Ulasan } from '../types';
import { ProductCard } from './ProductCard';
import { 
  Store, MapPin, User, Calendar, Star, CheckCircle, 
  MessageCircle, ArrowLeft, ShoppingBag, MessageSquarePlus 
} from 'lucide-react';

interface VendorPageProps {
  vendor: Vendor;
  daftarProduk: Produk[];
  daftarUlasan: Ulasan[];
  onKembali: () => void;
  onTambahKeranjang: (produk: Produk) => void;
  onBukaReviewModal: (vendor: Vendor) => void;
  onDetailProduk?: (produk: Produk) => void;
}

export const VendorPage: React.FC<VendorPageProps> = ({
  vendor,
  daftarProduk,
  daftarUlasan,
  onKembali,
  onTambahKeranjang,
  onBukaReviewModal,
  onDetailProduk,
}) => {
  const [tabAktif, setTabAktif] = useState<'produk' | 'ulasan'>('produk');

  // Filter produk milik toko ini saja
  const produkToko = daftarProduk.filter((p) => p.vendorId === vendor.id);
  // Filter ulasan milik toko ini saja
  const ulasanToko = daftarUlasan.filter((u) => u.vendorId === vendor.id);

  return (
    <div className="space-y-6 pb-12">
      {/* Tombol Navigasi Kembali */}
      <button
        onClick={onKembali}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-stone-600 hover:text-amber-800 transition cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Kembali ke Semua Lapak UMKM</span>
      </button>

      {/* Banner & Profil Header Toko */}
      <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-sm">
        {/* Banner Gambar */}
        <div className="h-44 sm:h-56 w-full relative bg-stone-200">
          <img
            src={vendor.banner}
            alt={vendor.namaToko}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <span className="bg-emerald-600/90 text-white text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-xs flex items-center gap-1 shadow-sm">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>{vendor.status}</span>
            </span>
          </div>

          <div className="absolute bottom-4 left-4 right-4 text-white flex items-end justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <img
                src={vendor.fotoToko}
                alt={vendor.pemilik}
                referrerPolicy="no-referrer"
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-3 border-white object-cover shadow-md"
              />
              <div>
                <h1 className="text-xl sm:text-2xl font-bold leading-tight drop-shadow-sm">
                  {vendor.namaToko}
                </h1>
                <p className="text-xs sm:text-sm text-stone-200 flex items-center gap-1.5 mt-0.5">
                  <User className="w-3.5 h-3.5" /> Dikelola oleh: <strong>{vendor.pemilik}</strong>
                </p>
                <p className="text-xs text-amber-200 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5" /> {vendor.kota}
                </p>
              </div>
            </div>

            {/* Tombol Hubungi Toko via WhatsApp */}
            <a
              href={`https://wa.me/${vendor.nomorWA.replace(/^0/, '62')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold px-4 py-2 rounded-xl flex items-center gap-2 shadow-sm transition"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chat Penjual (WA)</span>
            </a>
          </div>
        </div>

        {/* Ringkasan & Cerita UMKM serta Lokasi Nyata */}
        <div className="p-4 sm:p-6 bg-stone-50/60 border-t border-stone-100 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-3">
              <div>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-900 bg-amber-100 px-2.5 py-1 rounded-md mb-2">
                  🏛️ {vendor.sentraDaerah || 'Sentra UMKM Lokal'}
                </span>
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                  Tentang Usaha & Sentra Daerah
                </h3>
                <p className="text-stone-700 text-sm leading-relaxed mt-1">
                  {vendor.deskripsi}
                </p>
              </div>

              {/* Box Alamat Fisik Nyata di Dunia Nyata */}
              <div className="p-3.5 bg-white rounded-xl border border-stone-200 text-xs space-y-2">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="space-y-1">
                    <span className="font-bold text-stone-900 flex items-center gap-1.5 text-xs">
                      <MapPin className="w-3.5 h-3.5 text-red-600 shrink-0" />
                      <span>Alamat Lapak Fisik (Tempat Nyata):</span>
                    </span>
                    <p className="text-stone-600 pl-5 leading-relaxed font-medium">
                      {vendor.alamatLengkap || `${vendor.kota}, Indonesia`}
                    </p>
                  </div>

                  {vendor.linkPeta && (
                    <a
                      href={vendor.linkPeta}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 bg-stone-100 hover:bg-amber-100 text-amber-900 font-semibold px-2.5 py-1.5 rounded-lg border border-stone-300 transition text-[11px]"
                    >
                      <MapPin className="w-3 h-3 text-red-500" />
                      <span>Buka di Google Maps ↗</span>
                    </a>
                  )}
                </div>

                <div className="pt-2 border-t border-stone-100 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-stone-500">
                  <div>
                    🕒 <strong>Jam Buka:</strong> {vendor.jamOperasional || 'Setiap Hari 08.00 - 17.00 WIB'}
                  </div>
                  <div>
                    📜 <strong>Izin Usaha:</strong> {vendor.legalitasUMKM || 'Terdaftar di Dinas Koperasi & UMKM'}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-stone-200 grid grid-cols-2 gap-3 text-center self-start">
              <div>
                <span className="text-[11px] text-stone-500 block">Rating Toko</span>
                <div className="flex items-center justify-center gap-1 text-amber-600 font-bold text-lg">
                  <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                  <span>{vendor.rating.toFixed(1)}</span>
                </div>
                <span className="text-[10px] text-stone-400">({ulasanToko.length} ulasan)</span>
              </div>
              <div>
                <span className="text-[11px] text-stone-500 block">Total Terjual</span>
                <span className="text-lg font-bold text-stone-900 block">
                  {vendor.totalPenjualan}+
                </span>
                <span className="text-[10px] text-stone-400">Paket Terkirim</span>
              </div>
              <div className="col-span-2 pt-2 border-t border-stone-100 flex items-center justify-center gap-1.5 text-xs text-stone-600">
                <Calendar className="w-3.5 h-3.5 text-amber-700" />
                <span>Berdiri sejak tahun <strong>{vendor.tahunBerdiri}</strong></span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigasi Toko */}
        <div className="px-6 border-t border-stone-200 flex items-center justify-between">
          <div className="flex gap-4">
            <button
              onClick={() => setTabAktif('produk')}
              className={`py-3.5 text-sm font-semibold border-b-2 flex items-center gap-1.5 transition cursor-pointer ${
                tabAktif === 'produk'
                  ? 'border-amber-700 text-amber-900'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Produk Toko ({produkToko.length})</span>
            </button>

            <button
              onClick={() => setTabAktif('ulasan')}
              className={`py-3.5 text-sm font-semibold border-b-2 flex items-center gap-1.5 transition cursor-pointer ${
                tabAktif === 'ulasan'
                  ? 'border-amber-700 text-amber-900'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              <Star className="w-4 h-4" />
              <span>Ulasan Pembeli ({ulasanToko.length})</span>
            </button>
          </div>

          <button
            onClick={() => onBukaReviewModal(vendor)}
            className="hidden sm:flex items-center gap-1.5 text-xs font-semibold bg-amber-100 text-amber-900 hover:bg-amber-200 px-3 py-1.5 rounded-lg transition cursor-pointer"
          >
            <MessageSquarePlus className="w-4 h-4" />
            <span>Tulis Ulasan</span>
          </button>
        </div>
      </div>

      {/* Konten Tab Produk */}
      {tabAktif === 'produk' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-stone-800">
              Semua Produk dari {vendor.namaToko}
            </h2>
            <span className="text-xs text-stone-500">
              Menampilkan {produkToko.length} produk siap kirim
            </span>
          </div>

          {produkToko.length === 0 ? (
            <div className="bg-white rounded-xl p-8 text-center border border-stone-200 text-stone-500">
              <Store className="w-12 h-12 text-stone-300 mx-auto mb-2" />
              <p>Toko ini belum menambahkan produk yang aktif.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {produkToko.map((produk) => (
                <ProductCard
                  key={produk.id}
                  produk={produk}
                  vendor={vendor}
                  onTambahKeranjang={onTambahKeranjang}
                  onPilihVendor={() => {}}
                  onDetailProduk={onDetailProduk}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Konten Tab Ulasan */}
      {tabAktif === 'ulasan' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-stone-800">
                Ulasan & Testimoni untuk {vendor.namaToko}
              </h2>
              <p className="text-xs text-stone-500">
                Pengalaman nyata dari pembeli yang telah menerima pesanan dari UMKM ini
              </p>
            </div>
            <button
              onClick={() => onBukaReviewModal(vendor)}
              className="sm:hidden flex items-center gap-1 text-xs font-semibold bg-amber-700 text-white px-3 py-1.5 rounded-lg"
            >
              <MessageSquarePlus className="w-3.5 h-3.5" />
              <span>Beri Ulasan</span>
            </button>
          </div>

          {ulasanToko.length === 0 ? (
            <div className="bg-white rounded-xl p-8 text-center border border-stone-200">
              <Star className="w-12 h-12 text-stone-300 mx-auto mb-2" />
              <p className="text-stone-600 font-medium text-sm">Belum ada ulasan untuk toko ini.</p>
              <p className="text-xs text-stone-400 mt-1">Jadilah pembeli pertama yang memberikan ulasan jujur!</p>
              <button
                onClick={() => onBukaReviewModal(vendor)}
                className="mt-4 px-4 py-2 bg-amber-700 text-white rounded-lg text-xs font-semibold hover:bg-amber-800 transition cursor-pointer"
              >
                Tulis Ulasan Sekarang
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {ulasanToko.map((ulasan) => (
                <div key={ulasan.id} className="bg-white p-4 rounded-xl border border-stone-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 font-bold text-xs flex items-center justify-center">
                        {ulasan.namaPembeli.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-sm text-stone-900">{ulasan.namaPembeli}</div>
                        <div className="text-[11px] text-stone-400">{ulasan.tanggal}</div>
                      </div>
                    </div>
                    <div className="flex items-center text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < ulasan.rating ? 'fill-amber-500' : 'text-stone-200'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <p className="text-stone-700 text-sm italic bg-stone-50 p-3 rounded-lg border border-stone-100">
                    "{ulasan.komentar}"
                  </p>

                  {ulasan.balasanVendor && (
                    <div className="ml-4 pl-3 border-l-2 border-amber-600 text-xs bg-amber-50/70 p-2.5 rounded-r-lg">
                      <span className="font-bold text-amber-900 block mb-0.5">
                        Balasan dari Penjual ({vendor.namaToko}):
                      </span>
                      <p className="text-stone-700">{ulasan.balasanVendor}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
