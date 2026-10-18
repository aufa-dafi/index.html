import React, { useState } from 'react';
import { Vendor, Ulasan, Produk } from '../types';
import { Star, X, CheckCircle, HeartHandshake } from 'lucide-react';

interface ReviewModalProps {
  isOpen: boolean;
  onTutup: () => void;
  vendor: Vendor | null;
  daftarProduk: Produk[];
  onSimpanUlasan: (ulasanBaru: Ulasan) => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onTutup,
  vendor,
  daftarProduk,
  onSimpanUlasan,
}) => {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [namaPembeli, setNamaPembeli] = useState('');
  const [kotaPembeli, setKotaPembeli] = useState('');
  const [komentar, setKomentar] = useState('');
  const [produkPilihanId, setProdukPilihanId] = useState<string>('');
  const [berhasil, setBerhasil] = useState(false);

  if (!isOpen || !vendor) return null;

  // Produk dari vendor ini
  const produkToko = daftarProduk.filter((p) => p.vendorId === vendor.id);

  const getLabelRating = (r: number) => {
    switch (r) {
      case 1: return 'Sangat Kecewa';
      case 2: return 'Kurang Memuaskan';
      case 3: return 'Cukup Baik';
      case 4: return 'Puas & Bagus';
      case 5: return 'Sangat Puas & Rekomended!';
      default: return '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaPembeli.trim() || !komentar.trim()) {
      alert('Mohon isi nama Anda dan ulasan pengalaman belanja!');
      return;
    }

    const ulasanBaru: Ulasan = {
      id: `r-${Date.now()}`,
      vendorId: vendor.id,
      produkId: produkPilihanId || undefined,
      namaPembeli: kotaPembeli ? `${namaPembeli} (${kotaPembeli})` : namaPembeli,
      rating,
      komentar,
      tanggal: new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      }),
      balasanVendor: 'Terima kasih banyak atas dukungannya terhadap usaha UMKM kami! Semoga berkah dan cocok selalu.'
    };

    onSimpanUlasan(ulasanBaru);
    setBerhasil(true);

    setTimeout(() => {
      setBerhasil(false);
      setNamaPembeli('');
      setKotaPembeli('');
      setKomentar('');
      setRating(5);
      onTutup();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-stone-200">
        
        {/* Header Modal */}
        <div className="p-4 sm:px-6 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HeartHandshake className="w-5 h-5 text-amber-700" />
            <div>
              <h3 className="font-bold text-stone-900 text-sm sm:text-base">
                Tulis Ulasan untuk {vendor.namaToko}
              </h3>
              <p className="text-xs text-stone-500">
                Ulasan jujur Anda sangat membantu UMKM daerah berkembang
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onTutup}
            className="text-stone-400 hover:text-stone-600 p-1.5 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {berhasil ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-7 h-7" />
            </div>
            <h4 className="font-bold text-stone-900 text-lg">Ulasan Berhasil Dikirim!</h4>
            <p className="text-sm text-stone-500">
              Terima kasih telah meluangkan waktu memberikan penilaian positif untuk pengrajin lokal kami.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
            {/* Rating Bintang Interaktif */}
            <div className="text-center space-y-1 py-1">
              <label className="text-xs font-semibold text-stone-600 block">
                Berapa bintang untuk pengalaman belanja Anda?
              </label>
              <div className="flex justify-center gap-1.5 py-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                    className="p-1 cursor-pointer transition transform hover:scale-110"
                  >
                    <Star
                      className={`w-7 h-7 ${
                        star <= (hoverRating || rating)
                          ? 'fill-amber-500 text-amber-500'
                          : 'text-stone-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full inline-block">
                {getLabelRating(hoverRating || rating)}
              </span>
            </div>

            {/* Nama & Kota */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Nama Anda *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Ibu Rahayu"
                  value={namaPembeli}
                  onChange={(e) => setNamaPembeli(e.target.value)}
                  className="w-full p-2 text-sm bg-stone-50 border border-stone-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Kota Asal Anda (Opsional)
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Surabaya / Solo"
                  value={kotaPembeli}
                  onChange={(e) => setKotaPembeli(e.target.value)}
                  className="w-full p-2 text-sm bg-stone-50 border border-stone-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            {/* Produk Terkait (Opsional) */}
            {produkToko.length > 0 && (
              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Produk yang diulas (Opsional)
                </label>
                <select
                  value={produkPilihanId}
                  onChange={(e) => setProdukPilihanId(e.target.value)}
                  className="w-full p-2 text-sm bg-stone-50 border border-stone-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-amber-500"
                >
                  <option value="">-- Seluruh Toko / Pelayanan Umum --</option>
                  {produkToko.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nama}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Pesan Ulasan */}
            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1">
                Komentar Ulasan Jujur *
              </label>
              <textarea
                required
                rows={3}
                placeholder="Ceritakan rasa, kualitas jahitan/anyaman, keramahan penjual, atau kerapihan packing paket Anda..."
                value={komentar}
                onChange={(e) => setKomentar(e.target.value)}
                className="w-full p-2.5 text-sm bg-stone-50 border border-stone-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-stone-200">
              <button
                type="button"
                onClick={onTutup}
                className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-lg cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold rounded-lg shadow-xs transition cursor-pointer"
              >
                Kirimkan Ulasan
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
