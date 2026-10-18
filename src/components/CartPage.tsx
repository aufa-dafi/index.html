import React from 'react';
import { ItemKeranjang, Vendor } from '../types';
import { formatRupiah } from '../utils/format';
import { Trash2, Plus, Minus, Store, MapPin, ArrowRight, ShoppingBag, ArrowLeft } from 'lucide-react';

interface CartPageProps {
  keranjang: ItemKeranjang[];
  daftarVendor: Vendor[];
  onUbahJumlah: (produkId: string, jumlahBaru: number, pilihanMotif?: string, pilihanUkuran?: string) => void;
  onHapusItem: (produkId: string, pilihanMotif?: string, pilihanUkuran?: string) => void;
  onLanjutCheckout: () => void;
  onKembaliBelanja: () => void;
  onPilihVendor: (vendorId: string) => void;
}

export const CartPage: React.FC<CartPageProps> = ({
  keranjang,
  daftarVendor,
  onUbahJumlah,
  onHapusItem,
  onLanjutCheckout,
  onKembaliBelanja,
  onPilihVendor,
}) => {
  // Kelompokkan item di keranjang berdasarkan vendorId
  const itemPerVendor: { [vendorId: string]: ItemKeranjang[] } = {};
  keranjang.forEach((item) => {
    const vId = item.produk.vendorId;
    if (!itemPerVendor[vId]) {
      itemPerVendor[vId] = [];
    }
    itemPerVendor[vId].push(item);
  });

  const totalProdukSemua = keranjang.reduce(
    (total, item) => total + item.produk.harga * item.jumlah,
    0
  );

  const totalJumlahItem = keranjang.reduce((total, item) => total + item.jumlah, 0);

  if (keranjang.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-stone-200 p-8 sm:p-12 text-center max-w-lg mx-auto my-8">
        <div className="w-16 h-16 bg-amber-100 text-amber-800 rounded-full flex items-center justify-center mx-auto mb-4">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-stone-900">Keranjang Belanja Masih Kosong</h2>
        <p className="text-sm text-stone-500 mt-2">
          Yuk dukung UMKM lokal dengan membeli produk khas Nusantara buatan tangan pengrajin daerah!
        </p>
        <button
          onClick={onKembaliBelanja}
          className="mt-6 px-6 py-2.5 bg-amber-700 hover:bg-amber-800 text-white text-sm font-semibold rounded-xl shadow-xs inline-flex items-center gap-2 transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Mulai Belanja Produk UMKM</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-stone-900">
            Keranjang Belanja Multi-Vendor
          </h1>
          <p className="text-xs sm:text-sm text-stone-500">
            Pesanan Anda dikelompokkan berdasarkan toko UMKM penjual untuk memudahkan pengiriman.
          </p>
        </div>
        <button
          onClick={onKembaliBelanja}
          className="text-xs sm:text-sm font-semibold text-amber-800 hover:underline flex items-center gap-1 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Tambah Barang Lain</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Kolom Kiri: Daftar Barang Per Vendor */}
        <div className="lg:col-span-2 space-y-4">
          {Object.keys(itemPerVendor).map((vendorId) => {
            const vendor = daftarVendor.find((v) => v.id === vendorId);
            const items = itemPerVendor[vendorId];
            const subtotalVendor = items.reduce(
              (acc, item) => acc + item.produk.harga * item.jumlah,
              0
            );

            return (
              <div
                key={vendorId}
                className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-xs"
              >
                {/* Header Toko Vendor */}
                <div className="bg-stone-50 p-3 sm:px-4 border-b border-stone-200 flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <Store className="w-4 h-4 text-amber-700" />
                    <button
                      onClick={() => onPilihVendor(vendorId)}
                      className="font-bold text-sm text-stone-800 hover:text-amber-800 cursor-pointer"
                    >
                      {vendor?.namaToko || 'Toko UMKM'}
                    </button>
                    <span className="text-xs text-stone-400 flex items-center gap-0.5">
                      <MapPin className="w-3 h-3" /> {vendor?.kota}
                    </span>
                  </div>
                  <span className="text-xs bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-medium">
                    Subtotal Toko: {formatRupiah(subtotalVendor)}
                  </span>
                </div>

                {/* List Item Toko Ini */}
                <div className="divide-y divide-stone-100 p-4 space-y-3">
                  {items.map((item, itemIdx) => (
                    <div
                      key={`${item.produk.id}-${item.pilihanMotif || ''}-${item.pilihanUkuran || ''}-${itemIdx}`}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 first:pt-0"
                    >
                      {/* Foto & Info Produk */}
                      <div className="flex items-center gap-3">
                        <img
                          src={(item.pilihanMotif && item.produk.fotoMotif?.[item.pilihanMotif]) || item.produk.foto}
                          alt={item.produk.nama}
                          referrerPolicy="no-referrer"
                          className="w-16 h-16 rounded-lg object-cover border border-stone-200 shrink-0"
                        />
                        <div>
                          <h4 className="font-semibold text-sm text-stone-900 line-clamp-1">
                            {item.produk.nama}
                          </h4>
                          
                          {/* Label Pilihan Motif & Ukuran */}
                          {(item.pilihanMotif || item.pilihanUkuran) && (
                            <div className="flex flex-wrap items-center gap-1.5 mt-0.5 mb-1">
                              {item.pilihanMotif && (
                                <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded border border-amber-200">
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

                          <div className="text-xs text-stone-500 mt-0.5">
                            Harga Satuan: <strong className="text-amber-900">{formatRupiah(item.produk.harga)}</strong>
                          </div>
                          <span className="text-[11px] text-stone-400">
                            Berat: {item.produk.beratGram * item.jumlah} gr
                          </span>
                        </div>
                      </div>

                      {/* Tombol Kontrol Jumlah & Subtotal Item */}
                      <div className="flex items-center justify-between sm:justify-end gap-4">
                        <div className="flex items-center border border-stone-300 rounded-lg overflow-hidden bg-stone-50">
                          <button
                            onClick={() => onUbahJumlah(item.produk.id, item.jumlah - 1, item.pilihanMotif, item.pilihanUkuran)}
                            className="p-1.5 hover:bg-stone-200 transition cursor-pointer text-stone-700"
                            title="Kurangi"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-3 text-xs font-bold text-stone-800">
                            {item.jumlah}
                          </span>
                          <button
                            onClick={() => onUbahJumlah(item.produk.id, item.jumlah + 1, item.pilihanMotif, item.pilihanUkuran)}
                            disabled={item.jumlah >= item.produk.stok}
                            className="p-1.5 hover:bg-stone-200 transition cursor-pointer text-stone-700 disabled:opacity-30"
                            title="Tambah"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="text-right min-w-[90px]">
                          <span className="text-sm font-bold text-stone-900">
                            {formatRupiah(item.produk.harga * item.jumlah)}
                          </span>
                        </div>

                        <button
                          onClick={() => onHapusItem(item.produk.id, item.pilihanMotif, item.pilihanUkuran)}
                          className="text-stone-400 hover:text-red-600 transition p-1.5 cursor-pointer"
                          title="Hapus dari keranjang"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Kolom Kanan: Ringkasan Belanja */}
        <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-xs space-y-4 sticky top-24">
          <h3 className="font-bold text-base text-stone-900 border-b border-stone-100 pb-3">
            Ringkasan Pesanan
          </h3>

          <div className="space-y-2 text-sm text-stone-600">
            <div className="flex justify-between">
              <span>Total Barang ({totalJumlahItem} pcs)</span>
              <span className="font-medium text-stone-900">{formatRupiah(totalProdukSemua)}</span>
            </div>
            <div className="flex justify-between">
              <span>Jumlah UMKM Penjual</span>
              <span className="font-medium text-stone-900">{Object.keys(itemPerVendor).length} Toko</span>
            </div>
            <div className="flex justify-between text-xs text-stone-500">
              <span>Estimasi Ongkir</span>
              <span className="italic">Dihitung di Checkout</span>
            </div>
          </div>

          <div className="pt-3 border-t border-stone-200 flex justify-between items-baseline">
            <span className="font-bold text-stone-900">Total Belanja</span>
            <span className="font-extrabold text-lg text-amber-900">
              {formatRupiah(totalProdukSemua)}
            </span>
          </div>

          <div className="bg-amber-50 rounded-lg p-3 text-xs text-amber-900 leading-relaxed border border-amber-200">
            💡 <strong>Info Pengiriman Multi-Vendor:</strong> Produk akan dikirim langsung oleh masing-masing pemilik UMKM dari kota mereka dengan kurir lokal terpercaya.
          </div>

          <button
            onClick={onLanjutCheckout}
            className="w-full py-3 bg-amber-700 hover:bg-amber-800 text-white font-bold rounded-xl shadow-xs flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <span>Lanjut ke Pembayaran</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
