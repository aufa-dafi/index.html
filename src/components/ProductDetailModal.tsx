import React, { useState } from 'react';
import { Produk, Vendor } from '../types';
import { formatRupiah } from '../utils/format';
import { 
  X, Star, Store, MapPin, Plus, Minus, ShoppingCart, 
  ShieldCheck, Check, Sparkles, Truck 
} from 'lucide-react';

interface ProductDetailModalProps {
  produk: Produk | null;
  vendor: Vendor | undefined;
  onTutup: () => void;
  onTambahKeranjang: (produk: Produk, jumlah: number, pilihanMotif?: string, pilihanUkuran?: string) => void;
  onKunjungiToko: (vendorId: string) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  produk,
  vendor,
  onTutup,
  onTambahKeranjang,
  onKunjungiToko,
}) => {
  const [jumlah, setJumlah] = useState<number>(1);
  const [ditambahkan, setDitambahkan] = useState(false);
  const [pilihanMotif, setPilihanMotif] = useState<string>(
    produk?.varianMotif?.[0] || ''
  );
  const [pilihanUkuran, setPilihanUkuran] = useState<string>(
    produk?.varianUkuran?.[0] || ''
  );

  // Foto yang sedang aktif (bisa berganti saat motif dipilih)
  const fotoAktif =
    (pilihanMotif && produk?.fotoMotif?.[pilihanMotif]) ||
    produk?.foto ||
    '';

  if (!produk) return null;

  const handlePilihMotif = (motif: string) => {
    setPilihanMotif(motif);
  };

  const handleBeli = () => {
    onTambahKeranjang(produk, jumlah, pilihanMotif || undefined, pilihanUkuran || undefined);
    setDitambahkan(true);
    setTimeout(() => {
      setDitambahkan(false);
      onTutup();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl border border-stone-200">
        
        {/* Header Modal */}
        <div className="p-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-900 bg-amber-100 px-2 py-0.5 rounded">
              {produk.kategori}
            </span>
            {produk.badge && (
              <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                {produk.badge}
              </span>
            )}
          </div>
          <button
            onClick={onTutup}
            className="text-stone-400 hover:text-stone-600 p-1 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-6 max-h-[75vh] overflow-y-auto">
          {/* Foto Produk */}
          <div className="space-y-3">
            <div className="aspect-square w-full rounded-xl overflow-hidden bg-stone-100 border border-stone-200 relative group">
              <img
                src={fotoAktif}
                alt={produk.nama}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-all duration-300"
              />
              {pilihanMotif && (
                <span className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-xs text-white text-[11px] font-semibold px-2.5 py-1 rounded-md">
                  Varian: {pilihanMotif}
                </span>
              )}
            </div>

            {/* Info Penjual / UMKM */}
            {vendor && (
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <img
                    src={vendor.fotoToko}
                    alt={vendor.namaToko}
                    referrerPolicy="no-referrer"
                    className="w-9 h-9 rounded-full object-cover border border-stone-300"
                  />
                  <div>
                    <h5 className="font-bold text-xs text-stone-900">{vendor.namaToko}</h5>
                    {vendor.sentraDaerah && (
                      <span className="text-[10px] text-amber-800 font-medium block">
                        🏛️ {vendor.sentraDaerah}
                      </span>
                    )}
                    <span className="text-[11px] text-stone-500 flex items-center gap-0.5">
                      <MapPin className="w-3 h-3 text-red-500" /> {vendor.kota}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    onTutup();
                    onKunjungiToko(vendor.id);
                  }}
                  className="px-2.5 py-1 text-xs font-semibold text-amber-800 bg-amber-100 hover:bg-amber-200 rounded-lg transition cursor-pointer"
                >
                  Buka Toko
                </button>
              </div>
            )}
          </div>

          {/* Info Detail Produk */}
          <div className="space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <h2 className="text-lg sm:text-xl font-bold text-stone-900 leading-snug">
                {produk.nama}
              </h2>

              <div className="flex items-center gap-3 text-xs text-stone-500">
                <div className="flex items-center text-amber-600 font-bold gap-1">
                  <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                  <span>{produk.rating.toFixed(1)}</span>
                </div>
                <span>•</span>
                <span>{produk.terjual} terjual</span>
                <span>•</span>
                <span className="text-emerald-700 font-medium">Stok: {produk.stok} pcs</span>
              </div>

              <div className="text-2xl font-extrabold text-amber-900">
                {formatRupiah(produk.harga)}
              </div>

              {/* Pilihan Motif Batik Interaktif */}
              {produk.varianMotif && produk.varianMotif.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-stone-200">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                      <span>🎨 Pilihan Motif Batik:</span>
                    </span>
                    <span className="text-[11px] font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                      {pilihanMotif || 'Pilih motif'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {produk.varianMotif.map((motif) => {
                      const isDipilih = pilihanMotif === motif;
                      const fotoMini = produk.fotoMotif?.[motif];
                      return (
                        <button
                          type="button"
                          key={motif}
                          onClick={() => handlePilihMotif(motif)}
                          className={`p-2 rounded-xl text-left border flex items-center gap-2 cursor-pointer transition ${
                            isDipilih
                              ? 'border-amber-700 bg-amber-50/80 shadow-xs ring-1 ring-amber-600'
                              : 'border-stone-200 hover:border-stone-300 bg-white'
                          }`}
                        >
                          {fotoMini && (
                            <img
                              src={fotoMini}
                              alt={motif}
                              referrerPolicy="no-referrer"
                              className="w-9 h-9 rounded-lg object-cover shrink-0 border border-stone-200"
                            />
                          )}
                          <div className="min-w-0">
                            <strong className={`block text-xs truncate ${isDipilih ? 'text-amber-950 font-bold' : 'text-stone-700'}`}>
                              {motif}
                            </strong>
                            <span className="text-[10px] text-stone-500 block truncate">
                              {motif.includes('Parang')
                                ? 'Keteguhan & Wibawa'
                                : motif.includes('Mega Mendung')
                                ? 'Ketenangan Jiwa'
                                : motif.includes('Kawung')
                                ? 'Kesucian & Adil'
                                : motif.includes('Sekar')
                                ? 'Keharmonisan Semesta'
                                : motif.includes('Truntum')
                                ? 'Cinta Kasih Abadi'
                                : motif.includes('Sidomukti')
                                ? 'Kemakmuran & Mulia'
                                : 'Canting Tradisional'}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Pilihan Ukuran Baju Batik */}
              {produk.varianUkuran && produk.varianUkuran.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between text-xs font-bold text-stone-800">
                    <span>📏 Pilih Ukuran (Size):</span>
                    <span className="text-stone-500 font-normal">Ukuran Pria Standar Indonesia</span>
                  </div>
                  <div className="flex gap-2">
                    {produk.varianUkuran.map((ukuran) => (
                      <button
                        type="button"
                        key={ukuran}
                        onClick={() => setPilihanUkuran(ukuran)}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-bold border transition cursor-pointer ${
                          pilihanUkuran === ukuran
                            ? 'bg-amber-800 text-white border-amber-800 shadow-xs'
                            : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                        }`}
                      >
                        {ukuran}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-1 pt-1">
                <span className="text-xs font-bold uppercase text-stone-400 block tracking-wider">
                  Deskripsi Produk & Filosofi
                </span>
                <p className="text-stone-700 text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                  {produk.deskripsi}
                </p>
              </div>

              <div className="bg-stone-50 p-2.5 rounded-lg border border-stone-200 text-xs text-stone-600 space-y-1">
                <div className="flex justify-between">
                  <span>Berat Bersih / Packing:</span>
                  <span className="font-semibold text-stone-800">{produk.beratGram} gram</span>
                </div>
                <div className="flex justify-between">
                  <span>Kategori Produk:</span>
                  <span className="font-semibold text-stone-800">{produk.kategori}</span>
                </div>
              </div>
            </div>

            {/* Jumlah & Beli */}
            <div className="pt-3 border-t border-stone-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-stone-700">Atur Jumlah:</span>
                <div className="flex items-center border border-stone-300 rounded-lg overflow-hidden bg-stone-50">
                  <button
                    onClick={() => setJumlah(Math.max(1, jumlah - 1))}
                    className="p-1.5 hover:bg-stone-200 transition text-stone-700 cursor-pointer"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 text-xs font-bold text-stone-900">{jumlah}</span>
                  <button
                    onClick={() => setJumlah(Math.min(produk.stok, jumlah + 1))}
                    disabled={jumlah >= produk.stok}
                    className="p-1.5 hover:bg-stone-200 transition text-stone-700 disabled:opacity-30 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-stone-500">Subtotal:</span>
                <span className="text-base font-bold text-stone-900">
                  {formatRupiah(produk.harga * jumlah)}
                </span>
              </div>

              <button
                onClick={handleBeli}
                disabled={produk.stok <= 0}
                className={`w-full py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-xs transition cursor-pointer ${
                  ditambahkan
                    ? 'bg-emerald-600 text-white'
                    : produk.stok <= 0
                    ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                    : 'bg-amber-700 hover:bg-amber-800 text-white'
                }`}
              >
                {ditambahkan ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Berhasil Masuk Keranjang!</span>
                  </>
                ) : produk.stok <= 0 ? (
                  <span>Stok Habis</span>
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4" />
                    <span>Tambahkan ke Keranjang Belanja</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
