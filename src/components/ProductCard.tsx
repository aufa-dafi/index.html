import React from 'react';
import { Produk, Vendor } from '../types';
import { formatRupiah } from '../utils/format';
import { Star, Store, MapPin, Plus, Check } from 'lucide-react';

interface ProductCardProps {
  produk: Produk;
  vendor?: Vendor;
  onTambahKeranjang: (produk: Produk) => void;
  onPilihVendor: (vendorId: string) => void;
  onDetailProduk?: (produk: Produk) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  produk,
  vendor,
  onTambahKeranjang,
  onPilihVendor,
  onDetailProduk,
}) => {
  const [ditambahkan, setDitambahkan] = React.useState(false);

  const handleBeli = (e: React.MouseEvent) => {
    e.stopPropagation();
    onTambahKeranjang(produk);
    setDitambahkan(true);
    setTimeout(() => setDitambahkan(false), 1200);
  };

  return (
    <div 
      onClick={() => onDetailProduk && onDetailProduk(produk)}
      className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group cursor-pointer"
    >
      <div>
        {/* Gambar Produk & Label Badge */}
        <div className="relative aspect-4/3 w-full bg-stone-100 overflow-hidden">
          <img
            src={produk.foto}
            alt={produk.nama}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          {produk.badge && (
            <span className="absolute top-2 left-2 bg-amber-600 text-white text-[11px] font-bold px-2 py-0.5 rounded shadow-sm">
              {produk.badge}
            </span>
          )}
          <span className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-xs text-white text-[10px] font-medium px-2 py-0.5 rounded">
            {produk.kategori}
          </span>
        </div>

        {/* Informasi Produk */}
        <div className="p-3.5">
          {/* Toko Vendor Penjual */}
          {vendor && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onPilihVendor(vendor.id);
              }}
              className="flex items-center gap-1.5 text-xs text-stone-600 hover:text-amber-800 font-medium mb-1.5 transition text-left"
              title={`Buka toko ${vendor.namaToko}`}
            >
              <Store className="w-3.5 h-3.5 text-amber-700 shrink-0" />
              <span className="truncate max-w-[140px] font-semibold">{vendor.namaToko}</span>
              <span className="text-[10px] text-stone-400 flex items-center gap-0.5">
                • <MapPin className="w-2.5 h-2.5 shrink-0" /> {vendor.kota.split(',')[0]}
              </span>
            </button>
          )}

          {/* Judul Produk */}
          <h3 className="font-semibold text-stone-900 text-sm line-clamp-2 leading-snug group-hover:text-amber-800 transition">
            {produk.nama}
          </h3>

          {produk.varianMotif && produk.varianMotif.length > 0 && (
            <div className="mt-1.5 flex items-center gap-1">
              <span className="text-[10px] font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                🎨 {produk.varianMotif.length} Pilihan Motif Batik
              </span>
            </div>
          )}

          {/* Rating & Penjualan */}
          <div className="flex items-center gap-2 mt-2 text-xs text-stone-500">
            <div className="flex items-center text-amber-600 font-bold gap-0.5">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>{produk.rating.toFixed(1)}</span>
            </div>
            <span>•</span>
            <span>{produk.terjual} terjual</span>
            <span>•</span>
            <span>Stok: {produk.stok}</span>
          </div>
        </div>
      </div>

      {/* Bagian Bawah: Harga & Tombol Tambah */}
      <div className="p-3.5 pt-0 border-t border-stone-100 flex items-center justify-between mt-2">
        <div>
          <span className="text-[10px] text-stone-500 block">Harga</span>
          <span className="text-base font-bold text-amber-900">
            {formatRupiah(produk.harga)}
          </span>
        </div>

        <button
          onClick={handleBeli}
          disabled={produk.stok <= 0}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition cursor-pointer ${
            ditambahkan
              ? 'bg-emerald-600 text-white'
              : produk.stok <= 0
              ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
              : 'bg-amber-600 hover:bg-amber-700 text-white shadow-xs'
          }`}
        >
          {ditambahkan ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Masuk!</span>
            </>
          ) : produk.stok <= 0 ? (
            <span>Habis</span>
          ) : (
            <>
              <Plus className="w-3.5 h-3.5" />
              <span>Keranjang</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
