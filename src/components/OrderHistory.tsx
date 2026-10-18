import React from 'react';
import { Pesanan, Vendor } from '../types';
import { formatRupiah } from '../utils/format';
import { 
  PackageCheck, Truck, Clock, Store, MessageSquarePlus, 
  MapPin, ShoppingBag, ArrowLeft 
} from 'lucide-react';

interface OrderHistoryProps {
  daftarPesanan: Pesanan[];
  daftarVendor: Vendor[];
  onBukaReview: (vendor: Vendor) => void;
  onKembaliBelanja: () => void;
  onPilihVendor: (vendorId: string) => void;
}

export const OrderHistory: React.FC<OrderHistoryProps> = ({
  daftarPesanan,
  daftarVendor,
  onBukaReview,
  onKembaliBelanja,
  onPilihVendor,
}) => {
  if (daftarPesanan.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-stone-200 p-8 sm:p-12 text-center max-w-lg mx-auto my-8">
        <div className="w-16 h-16 bg-stone-100 text-stone-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-stone-900">Belum Ada Riwayat Pesanan</h2>
        <p className="text-sm text-stone-500 mt-2">
          Anda belum melakukan pembelian produk UMKM. Mari jelajahi produk lokal terbaik dari berbagai pelosok Nusantara!
        </p>
        <button
          onClick={onKembaliBelanja}
          className="mt-6 px-6 py-2.5 bg-amber-700 hover:bg-amber-800 text-white text-sm font-semibold rounded-xl shadow-xs inline-flex items-center gap-2 transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Mulai Belanja</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-stone-900">
            Riwayat Pesanan Saya
          </h1>
          <p className="text-xs sm:text-sm text-stone-500">
            Pantau status proses dari toko UMKM dan beri ulasan kepuasan belanja Anda
          </p>
        </div>
        <button
          onClick={onKembaliBelanja}
          className="text-xs sm:text-sm font-semibold text-amber-800 hover:underline flex items-center gap-1 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Katalog Produk</span>
        </button>
      </div>

      <div className="space-y-4">
        {daftarPesanan.map((pesanan) => {
          return (
            <div
              key={pesanan.id}
              className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-xs hover:border-stone-300 transition"
            >
              {/* Header Kartu Pesanan */}
              <div className="bg-stone-50 p-4 border-b border-stone-200 flex items-center justify-between flex-wrap gap-2 text-xs">
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-stone-900 text-sm">
                    {pesanan.id}
                  </span>
                  <span className="text-stone-400">•</span>
                  <span className="text-stone-500 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {pesanan.tanggal}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="bg-amber-100 text-amber-900 px-2.5 py-1 rounded-full font-bold text-[11px] flex items-center gap-1">
                    <Truck className="w-3 h-3" />
                    <span>{pesanan.status}</span>
                  </span>
                </div>
              </div>

              {/* Rincian Produk di Pesanan */}
              <div className="p-4 divide-y divide-stone-100">
                {pesanan.items.map((item, idx) => {
                  const vendor = daftarVendor.find((v) => v.id === item.vendorId);
                  return (
                    <div
                      key={idx}
                      className="py-3 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-stone-500 text-xs">
                          <Store className="w-3.5 h-3.5 text-amber-700" />
                          <button
                            onClick={() => vendor && onPilihVendor(vendor.id)}
                            className="font-semibold text-stone-700 hover:text-amber-800 cursor-pointer"
                          >
                            {vendor?.namaToko || 'Toko UMKM'}
                          </button>
                          <span>({vendor?.kota.split(',')[0]})</span>
                        </div>
                        <h4 className="font-bold text-stone-900">{item.namaProduk}</h4>
                        {(item.pilihanMotif || item.pilihanUkuran) && (
                          <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                            {item.pilihanMotif && (
                              <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded border border-amber-200">
                                🎨 {item.pilihanMotif}
                              </span>
                            )}
                            {item.pilihanUkuran && (
                              <span className="text-[10px] font-bold bg-stone-100 text-stone-800 px-1.5 py-0.5 rounded border border-stone-200">
                                📏 Size {item.pilihanUkuran}
                              </span>
                            )}
                          </div>
                        )}
                        <div className="text-stone-500 text-xs">
                          {item.jumlah} barang x {formatRupiah(item.harga)}
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-4">
                        <span className="font-extrabold text-stone-800">
                          {formatRupiah(item.subtotal)}
                        </span>

                        {vendor && (
                          <button
                            onClick={() => onBukaReview(vendor)}
                            className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition"
                          >
                            <MessageSquarePlus className="w-3.5 h-3.5" />
                            <span>Beri Ulasan Toko</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Footer Alamat & Total */}
              <div className="bg-stone-50/70 p-4 border-t border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="text-stone-600 space-y-0.5">
                  <div className="flex items-center gap-1 text-stone-700">
                    <MapPin className="w-3.5 h-3.5 text-stone-400" />
                    <span>Kirim ke: <strong>{pesanan.namaPembeli}</strong></span>
                  </div>
                  <p className="text-[11px] text-stone-500 line-clamp-1 max-w-md">
                    {pesanan.alamat}
                  </p>
                  <p className="text-[11px] text-stone-500">
                    Metode Pembayaran: <strong className="text-stone-700">{pesanan.metodePembayaran}</strong>
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-[11px] text-stone-500 block">
                    Total Pembayaran (Termasuk Ongkir):
                  </span>
                  <span className="text-base font-extrabold text-amber-900">
                    {formatRupiah(pesanan.totalAkhir)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
