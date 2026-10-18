import React, { useState, useEffect } from 'react';
import { 
  Vendor, Produk, ItemKeranjang, Ulasan, Pesanan 
} from './types';
import { 
  INITIAL_VENDORS, INITIAL_PRODUCTS, INITIAL_REVIEWS, INITIAL_ORDERS 
} from './data';
import { Navbar } from './components/Navbar';
import { ProductCard } from './components/ProductCard';
import { VendorPage } from './components/VendorPage';
import { CartPage } from './components/CartPage';
import { CheckoutModal } from './components/CheckoutModal';
import { ReviewModal } from './components/ReviewModal';
import { AdminDashboard } from './components/AdminDashboard';
import { OrderHistory } from './components/OrderHistory';
import { ProductDetailModal } from './components/ProductDetailModal';
import { 
  Store, ShoppingBag, ShieldCheck, HeartHandshake, 
  MapPin, Star, Sparkles, Filter, CheckCircle, ArrowRight 
} from 'lucide-react';

export default function App() {
  // --- STATE UTAMA (Disimpan di LocalStorage agar data tetap aman saat refresh) ---
  const [mode, setMode] = useState<'user' | 'admin'>('user');
  const [halamanAktif, setHalamanAktif] = useState<'katalog' | 'toko' | 'keranjang' | 'pesanan'>('katalog');

  // 1. Data Vendor UMKM (Toko Nyata Legendaris Indonesia)
  const [daftarVendor, setDaftarVendor] = useState<Vendor[]>(() => {
    const tersimpan = localStorage.getItem('pasar_umkm_vendors_v5');
    if (tersimpan) return JSON.parse(tersimpan);
    return INITIAL_VENDORS;
  });

  // 2. Data Produk Nyata dari Toko Asli (Termasuk Motif Batik Lengkap)
  const [daftarProduk, setDaftarProduk] = useState<Produk[]>(() => {
    const tersimpan = localStorage.getItem('pasar_umkm_products_v5');
    if (tersimpan) return JSON.parse(tersimpan);
    return INITIAL_PRODUCTS;
  });

  // 3. Data Ulasan Toko & Produk
  const [daftarUlasan, setDaftarUlasan] = useState<Ulasan[]>(() => {
    const tersimpan = localStorage.getItem('pasar_umkm_reviews_v5');
    return tersimpan ? JSON.parse(tersimpan) : INITIAL_REVIEWS;
  });

  // 4. Data Pesanan (Order)
  const [daftarPesanan, setDaftarPesanan] = useState<Pesanan[]>(() => {
    const tersimpan = localStorage.getItem('pasar_umkm_orders_v5');
    return tersimpan ? JSON.parse(tersimpan) : INITIAL_ORDERS;
  });

  // 5. Keranjang Belanja Pembeli
  const [keranjang, setKeranjang] = useState<ItemKeranjang[]>(() => {
    const tersimpan = localStorage.getItem('pasar_umkm_cart_v5');
    return tersimpan ? JSON.parse(tersimpan) : [];
  });

  // 6. Komisi Platform Standar (Default 5%)
  const [persenKomisiDefault, setPersenKomisiDefault] = useState<number>(() => {
    const tersimpan = localStorage.getItem('pasar_umkm_commission');
    return tersimpan ? Number(tersimpan) : 5;
  });

  // Simpan otomatis ke LocalStorage setiap kali ada perubahan data
  useEffect(() => {
    localStorage.setItem('pasar_umkm_vendors_v5', JSON.stringify(daftarVendor));
  }, [daftarVendor]);

  useEffect(() => {
    localStorage.setItem('pasar_umkm_products_v5', JSON.stringify(daftarProduk));
  }, [daftarProduk]);

  useEffect(() => {
    localStorage.setItem('pasar_umkm_reviews_v5', JSON.stringify(daftarUlasan));
  }, [daftarUlasan]);

  useEffect(() => {
    localStorage.setItem('pasar_umkm_orders_v5', JSON.stringify(daftarPesanan));
  }, [daftarPesanan]);

  useEffect(() => {
    localStorage.setItem('pasar_umkm_cart_v5', JSON.stringify(keranjang));
  }, [keranjang]);

  useEffect(() => {
    localStorage.setItem('pasar_umkm_commission', persenKomisiDefault.toString());
  }, [persenKomisiDefault]);

  // --- STATE INTERAKSI UI ---
  const [kataKunciCari, setKataKunciCari] = useState('');
  const [kategoriPilihan, setKategoriPilihan] = useState<string>('Semua');
  const [motifBatikFilter, setMotifBatikFilter] = useState<string>('Semua');
  const [selectedVendorId, setSelectedVendorId] = useState<string | null>(null);

  // Modal State
  const [bukaCheckout, setBukaCheckout] = useState(false);
  const [bukaReviewModal, setBukaReviewModal] = useState(false);
  const [vendorUntukReview, setVendorUntukReview] = useState<Vendor | null>(null);
  const [produkDetailPilihan, setProdukDetailPilihan] = useState<Produk | null>(null);

  // Toast Notifikasi
  const [pesanToast, setPesanToast] = useState<string | null>(null);

  const tampilkanToast = (pesan: string) => {
    setPesanToast(pesan);
    setTimeout(() => setPesanToast(null), 2500);
  };

  // --- LOGIKA KERANJANG BELANJA MULTI-VENDOR ---
  const tambahKeKeranjang = (
    produk: Produk,
    jumlah = 1,
    pilihanMotif?: string,
    pilihanUkuran?: string
  ) => {
    const motif = pilihanMotif || produk.varianMotif?.[0];
    const ukuran = pilihanUkuran || produk.varianUkuran?.[0];

    setKeranjang((prev) => {
      const index = prev.findIndex(
        (item) =>
          item.produk.id === produk.id &&
          item.pilihanMotif === motif &&
          item.pilihanUkuran === ukuran
      );
      if (index > -1) {
        const salinan = [...prev];
        salinan[index].jumlah += jumlah;
        return salinan;
      } else {
        return [
          ...prev,
          {
            produk,
            jumlah,
            pilihanMotif: motif,
            pilihanUkuran: ukuran,
          },
        ];
      }
    });

    const infoVarian = [motif, ukuran ? `Size ${ukuran}` : ''].filter(Boolean).join(' • ');
    tampilkanToast(
      `"${produk.nama}" ${infoVarian ? `(${infoVarian})` : ''} berhasil masuk keranjang.`
    );
  };

  const ubahJumlahKeranjang = (
    produkId: string,
    jumlahBaru: number,
    pilihanMotif?: string,
    pilihanUkuran?: string
  ) => {
    if (jumlahBaru <= 0) {
      hapusItemKeranjang(produkId, pilihanMotif, pilihanUkuran);
      return;
    }
    setKeranjang((prev) =>
      prev.map((item) =>
        item.produk.id === produkId &&
        item.pilihanMotif === pilihanMotif &&
        item.pilihanUkuran === pilihanUkuran
          ? { ...item, jumlah: jumlahBaru }
          : item
      )
    );
  };

  const hapusItemKeranjang = (
    produkId: string,
    pilihanMotif?: string,
    pilihanUkuran?: string
  ) => {
    setKeranjang((prev) =>
      prev.filter(
        (item) =>
          !(
            item.produk.id === produkId &&
            item.pilihanMotif === pilihanMotif &&
            item.pilihanUkuran === pilihanUkuran
          )
      )
    );
    tampilkanToast('Barang dihapus dari keranjang belanja.');
  };

  // --- LOGIKA CHECKOUT & REVIEW ---
  const handleSelesaiCheckout = (pesananBaru: Pesanan) => {
    // Tambahkan pesanan ke riwayat
    setDaftarPesanan((prev) => [pesananBaru, ...prev]);
    // Kurangi stok produk yang dibeli
    setDaftarProduk((prev) =>
      prev.map((prod) => {
        const itemDibeli = pesananBaru.items.find((i) => i.produkId === prod.id);
        if (itemDibeli) {
          return {
            ...prod,
            stok: Math.max(0, prod.stok - itemDibeli.jumlah),
            terjual: prod.terjual + itemDibeli.jumlah,
          };
        }
        return prod;
      })
    );
    // Kosongkan keranjang setelah selesai belanja
    setKeranjang([]);
  };

  const handleSimpanUlasan = (ulasanBaru: Ulasan) => {
    setDaftarUlasan((prev) => [ulasanBaru, ...prev]);

    // Update rating rata-rata vendor
    const semuaUlasanToko = [...daftarUlasan, ulasanBaru].filter(
      (u) => u.vendorId === ulasanBaru.vendorId
    );
    const totalBintang = semuaUlasanToko.reduce((sum, u) => sum + u.rating, 0);
    const ratingBaru = Number((totalBintang / semuaUlasanToko.length).toFixed(1));

    setDaftarVendor((prev) =>
      prev.map((v) => (v.id === ulasanBaru.vendorId ? { ...v, rating: ratingBaru } : v))
    );

    tampilkanToast('Ulasan Anda berhasil disimpan. Terima kasih telah mendukung UMKM!');
  };

  // Vendor terpilih untuk halaman detail toko
  const vendorAktif = daftarVendor.find((v) => v.id === selectedVendorId);

  // Filter Produk di Katalog
  const produkTersaring = daftarProduk.filter((p) => {
    if (!p.isAktif) return false;
    const cocokKategori = kategoriPilihan === 'Semua' || p.kategori === kategoriPilihan;
    
    // Filter Motif Batik
    const cocokMotif =
      motifBatikFilter === 'Semua' ||
      (p.varianMotif && p.varianMotif.some((m) => m.toLowerCase().includes(motifBatikFilter.toLowerCase()))) ||
      p.nama.toLowerCase().includes(motifBatikFilter.toLowerCase()) ||
      p.deskripsi.toLowerCase().includes(motifBatikFilter.toLowerCase());

    const cocokCari =
      p.nama.toLowerCase().includes(kataKunciCari.toLowerCase()) ||
      p.deskripsi.toLowerCase().includes(kataKunciCari.toLowerCase()) ||
      (p.varianMotif && p.varianMotif.some((m) => m.toLowerCase().includes(kataKunciCari.toLowerCase())));

    return cocokKategori && cocokMotif && cocokCari;
  });

  const jumlahTotalKeranjang = keranjang.reduce((sum, i) => sum + i.jumlah, 0);

  return (
    <div className="min-h-screen bg-stone-100/70 text-stone-900 flex flex-col font-sans">
      
      {/* Toast Notifikasi Global */}
      {pesanToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2.5 text-xs sm:text-sm animate-fade-in border border-stone-700">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{pesanToast}</span>
        </div>
      )}

      {/* Navbar Atas */}
      <Navbar
        mode={mode}
        setMode={(m) => {
          setMode(m);
          setSelectedVendorId(null);
        }}
        halamanAktif={halamanAktif}
        setHalamanAktif={(h) => {
          setHalamanAktif(h);
          setSelectedVendorId(null);
        }}
        jumlahItemKeranjang={jumlahTotalKeranjang}
        kataKunciCari={kataKunciCari}
        setKataKunciCari={setKataKunciCari}
      />

      {/* Konten Utama */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
        
        {/* ========================================================= */}
        {/* MODE ADMIN PASAR UMKM                                     */}
        {/* ========================================================= */}
        {mode === 'admin' ? (
          <AdminDashboard
            daftarVendor={daftarVendor}
            setDaftarVendor={setDaftarVendor}
            daftarProduk={daftarProduk}
            setDaftarProduk={setDaftarProduk}
            daftarPesanan={daftarPesanan}
            setDaftarPesanan={setDaftarPesanan}
            persenKomisiDefault={persenKomisiDefault}
            setPersenKomisiDefault={setPersenKomisiDefault}
          />
        ) : (
          /* ========================================================= */
          /* MODE USER / PEMBELI                                       */
          /* ========================================================= */
          <>
            {/* JIKA MEMBUKA HALAMAN PROFIL TOKO PER VENDOR */}
            {selectedVendorId && vendorAktif ? (
              <VendorPage
                vendor={vendorAktif}
                daftarProduk={daftarProduk}
                daftarUlasan={daftarUlasan}
                onKembali={() => setSelectedVendorId(null)}
                onTambahKeranjang={tambahKeKeranjang}
                onBukaReviewModal={(v) => {
                  setVendorUntukReview(v);
                  setBukaReviewModal(true);
                }}
                onDetailProduk={(p) => setProdukDetailPilihan(p)}
              />
            ) : halamanAktif === 'keranjang' ? (
              /* HALAMAN KERANJANG BELANJA */
              <CartPage
                keranjang={keranjang}
                daftarVendor={daftarVendor}
                onUbahJumlah={ubahJumlahKeranjang}
                onHapusItem={hapusItemKeranjang}
                onLanjutCheckout={() => setBukaCheckout(true)}
                onKembaliBelanja={() => setHalamanAktif('katalog')}
                onPilihVendor={(vId) => setSelectedVendorId(vId)}
              />
            ) : halamanAktif === 'pesanan' ? (
              /* HALAMAN RIWAYAT PESANAN */
              <OrderHistory
                daftarPesanan={daftarPesanan}
                daftarVendor={daftarVendor}
                onBukaReview={(v) => {
                  setVendorUntukReview(v);
                  setBukaReviewModal(true);
                }}
                onKembaliBelanja={() => setHalamanAktif('katalog')}
                onPilihVendor={(vId) => setSelectedVendorId(vId)}
              />
            ) : halamanAktif === 'toko' ? (
              /* HALAMAN DAFTAR TOKO / VENDOR UMKM */
              <div className="space-y-6 pb-12">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-stone-900">
                    Daftar Lapak UMKM Binaan
                  </h1>
                  <p className="text-xs sm:text-sm text-stone-500">
                    Jelajahi profil pengrajin, petani kopi, dan dapur kuliner rumahan dari berbagai daerah di Indonesia.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {daftarVendor.map((vendor) => {
                    const totalProdukToko = daftarProduk.filter(
                      (p) => p.vendorId === vendor.id && p.isAktif
                    ).length;

                    return (
                      <div
                        key={vendor.id}
                        onClick={() => setSelectedVendorId(vendor.id)}
                        className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between cursor-pointer group"
                      >
                        <div>
                          {/* Banner Toko Mini */}
                          <div className="h-28 w-full relative bg-stone-200 overflow-hidden">
                            <img
                              src={vendor.banner}
                              alt={vendor.namaToko}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            <span className="absolute top-2 right-2 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
                              {vendor.status}
                            </span>
                          </div>

                          {/* Info Toko */}
                          <div className="p-4 pt-0 relative">
                            <div className="-mt-8 mb-2 flex items-end justify-between">
                              <img
                                src={vendor.fotoToko}
                                alt={vendor.pemilik}
                                referrerPolicy="no-referrer"
                                className="w-14 h-14 rounded-full border-2 border-white object-cover shadow-sm bg-white"
                              />
                              <div className="flex items-center gap-1 text-xs text-amber-600 font-bold bg-amber-50 px-2 py-1 rounded-md border border-amber-200">
                                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                                <span>{vendor.rating.toFixed(1)}</span>
                              </div>
                            </div>

                            <h3 className="font-bold text-base text-stone-900 group-hover:text-amber-800 transition">
                              {vendor.namaToko}
                            </h3>
                            
                            {vendor.sentraDaerah && (
                              <span className="inline-block text-[11px] font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 mt-1">
                                🏛️ {vendor.sentraDaerah}
                              </span>
                            )}

                            <p className="text-xs text-stone-500 flex items-center gap-1 mt-1 font-medium">
                              <MapPin className="w-3.5 h-3.5 text-red-600 shrink-0" /> {vendor.kota}
                            </p>

                            <p className="text-[11px] text-stone-500 line-clamp-1 mt-0.5 italic">
                              📍 {vendor.alamatLengkap}
                            </p>

                            <p className="text-xs text-stone-600 line-clamp-2 mt-2 leading-relaxed">
                              {vendor.deskripsi}
                            </p>
                          </div>
                        </div>

                        {/* Footer Toko */}
                        <div className="p-4 pt-0 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500 mt-2">
                          <span className="text-[11px]">{totalProdukToko} Produk Siap Kirim</span>
                          <span className="font-semibold text-amber-800 flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
                            Kunjungi Toko <ArrowRight className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              /* HALAMAN UTAMA: KATALOG BELANJA */
              <div className="space-y-6 pb-12">
                {/* Banner Hero Hangat Khas Nusantara */}
                <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-stone-900 via-amber-950 to-stone-900 text-white p-6 sm:p-10 shadow-sm">
                  <div className="max-w-2xl space-y-3 relative z-10">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-300 bg-amber-900/60 border border-amber-700/60 px-3 py-1 rounded-full">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Belanja Langsung Dari Tangan Pertama</span>
                    </span>

                    <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                      Dukung Usaha Lokal, Nikmati Produk Khas Asli Nusantara
                    </h1>

                    <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
                      Temukan keripik gurih Sleman, batik Pekalongan, seduhan kopi lereng Merapi, hingga anyaman rotan Cirebon. Setiap rupiah Anda membantu pertumbuhan ekonomi keluarga UMKM.
                    </p>

                    <div className="pt-2 flex flex-wrap gap-2 text-xs">
                      <span className="bg-white/10 px-3 py-1 rounded-md backdrop-blur-xs">
                        ✓ Multi-Vendor Terverifikasi
                      </span>
                      <span className="bg-white/10 px-3 py-1 rounded-md backdrop-blur-xs">
                        ✓ Bayar Mudah via QRIS & Rekber
                      </span>
                      <span className="bg-white/10 px-3 py-1 rounded-md backdrop-blur-xs">
                        ✓ Pengiriman Langsung Dari Pengrajin
                      </span>
                    </div>
                  </div>

                  <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-25 pointer-events-none hidden md:block">
                    <img
                      src="/src/assets/images/kain_jarik_batik_1792284336119.jpg"
                      alt="Batik Motif Nusantara"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Filter Kategori Produk */}
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
                    {['Semua', 'Kuliner', 'Kerajinan', 'Batik & Fashion', 'Kopi & Minuman', 'Kecantikan & Herbal'].map(
                      (kat) => (
                        <button
                          key={kat}
                          onClick={() => setKategoriPilihan(kat)}
                          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap cursor-pointer transition ${
                            kategoriPilihan === kat
                              ? 'bg-amber-800 text-white shadow-xs'
                              : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
                          }`}
                        >
                          {kat}
                        </button>
                      )
                    )}
                  </div>

                  <span className="text-xs text-stone-500 font-medium">
                    Menampilkan <strong>{produkTersaring.length}</strong> produk pilihan
                  </span>
                </div>

                {/* PILIHAN ANEKA MOTIF BAJU BATIK KHAS NUSANTARA */}
                <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🎨</span>
                      <div>
                        <h3 className="text-xs sm:text-sm font-bold text-amber-950">
                          Pilihan Macam-macam Motif Baju Batik Nusantara:
                        </h3>
                        <p className="text-[11px] text-amber-800/80">
                          Pilih corak batik favorit Anda — dilengkapi filosofi luhur dan foto asli motif
                        </p>
                      </div>
                    </div>

                    {motifBatikFilter !== 'Semua' && (
                      <button
                        onClick={() => setMotifBatikFilter('Semua')}
                        className="text-xs font-semibold text-amber-900 bg-amber-200/70 hover:bg-amber-200 px-3 py-1 rounded-lg transition cursor-pointer"
                      >
                        Tampilkan Semua Motif ✕
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
                    {[
                      { id: 'Semua', label: 'Semua Motif', filosofi: 'Koleksi Lengkap', corak: '🏛️' },
                      { id: 'Parang', label: 'Motif Parang', filosofi: 'Wibawa & Keteguhan', corak: '🗡️' },
                      { id: 'Mega Mendung', label: 'Mega Mendung', filosofi: 'Ketenangan Jiwa', corak: '☁️' },
                      { id: 'Kawung', label: 'Motif Kawung', filosofi: 'Kesucian & Keadilan', corak: '🌸' },
                      { id: 'Sekar Jagad', label: 'Sekar Jagad', filosofi: 'Keharmonisan Alam', corak: '🌺' },
                      { id: 'Truntum', label: 'Motif Truntum', filosofi: 'Cinta Kasih Abadi', corak: '✨' },
                      { id: 'Sidomukti', label: 'Motif Sidomukti', filosofi: 'Kemakmuran Luhur', corak: '👑' },
                    ].map((m) => {
                      const isAktif = motifBatikFilter === m.id;
                      return (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => {
                            setMotifBatikFilter(m.id);
                            if (m.id !== 'Semua') {
                              setKategoriPilihan('Batik & Fashion');
                            }
                          }}
                          className={`p-2.5 rounded-xl text-left border transition cursor-pointer flex flex-col justify-between ${
                            isAktif
                              ? 'bg-amber-800 text-white border-amber-800 shadow-sm ring-2 ring-amber-600/50'
                              : 'bg-white hover:bg-stone-50 text-stone-800 border-amber-200/80 hover:border-amber-300'
                          }`}
                        >
                          <div className="flex items-center justify-between text-sm">
                            <span>{m.corak}</span>
                            {isAktif && <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded font-bold">Aktif</span>}
                          </div>
                          <div className="mt-1">
                            <span className="font-bold text-xs block leading-tight">{m.label}</span>
                            <span className={`text-[10px] block leading-tight mt-0.5 ${isAktif ? 'text-amber-200' : 'text-stone-500'}`}>
                              {m.filosofi}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Grid Katalog Produk */}
                {produkTersaring.length === 0 ? (
                  <div className="bg-white rounded-2xl p-12 text-center border border-stone-200">
                    <ShoppingBag className="w-12 h-12 text-stone-300 mx-auto mb-2" />
                    <h3 className="font-bold text-stone-800 text-base">Produk Tidak Ditemukan</h3>
                    <p className="text-xs text-stone-500 mt-1">
                      Coba ganti kata kunci pencarian atau pilih kategori lain.
                    </p>
                    <button
                      onClick={() => {
                        setKataKunciCari('');
                        setKategoriPilihan('Semua');
                      }}
                      className="mt-4 px-4 py-2 bg-amber-700 text-white text-xs font-semibold rounded-lg cursor-pointer"
                    >
                      Reset Filter
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {produkTersaring.map((produk) => {
                      const vendor = daftarVendor.find((v) => v.id === produk.vendorId);
                      return (
                        <ProductCard
                          key={produk.id}
                          produk={produk}
                          vendor={vendor}
                          onTambahKeranjang={tambahKeKeranjang}
                          onPilihVendor={(vId) => setSelectedVendorId(vId)}
                          onDetailProduk={(p) => setProdukDetailPilihan(p)}
                        />
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer Bersahaja Khas Pasar UMKM */}
      <footer className="bg-stone-900 text-stone-400 text-xs py-8 border-t border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="space-y-2 md:col-span-2">
            <div className="flex items-center gap-2 text-white font-bold text-base">
              <span>🏪 PasarUMKM Multi-Vendor</span>
            </div>
            <p className="text-stone-400 text-xs leading-relaxed max-w-md">
              Aplikasi E-Commerce Multi-Vendor untuk memfasilitasi penjualan langsung pengrajin dan pelaku usaha mikro, kecil, dan menengah ke konsumen di seluruh Indonesia dengan sistem komisi yang adil dan transparan.
            </p>
            <p className="text-[11px] text-stone-500">
              © {new Date().getFullYear()} PasarUMKM Indonesia • Dibuat untuk memberdayakan produk lokal.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-2">
              Fitur Pembeli
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li>• Toko Khusus Per Vendor UMKM</li>
              <li>• Keranjang Belanja Terpisah Toko</li>
              <li>• Pembayaran QRIS & Rekber Aman</li>
              <li>• Ulasan Pembeli Jujur & Bintang</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-2">
              Fitur Pengelola / Admin
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li>• Verifikasi & Manajemen Mitra Vendor</li>
              <li>• Manajemen Stok & Katalog Produk</li>
              <li>• Laporan Transaksi & Arus Kas</li>
              <li>• Pengaturan Komisi & Payout ke Bank</li>
            </ul>
          </div>
        </div>
      </footer>

      {/* Modal Detail Produk */}
      {produkDetailPilihan && (
        <ProductDetailModal
          produk={produkDetailPilihan}
          vendor={daftarVendor.find((v) => v.id === produkDetailPilihan.vendorId)}
          onTutup={() => setProdukDetailPilihan(null)}
          onTambahKeranjang={tambahKeKeranjang}
          onKunjungiToko={(vId) => {
            setSelectedVendorId(vId);
            setHalamanAktif('toko');
          }}
        />
      )}

      {/* Modal Checkout Pembayaran */}
      {bukaCheckout && (
        <CheckoutModal
          isOpen={bukaCheckout}
          onTutup={() => {
            setBukaCheckout(false);
            setHalamanAktif('pesanan');
          }}
          keranjang={keranjang}
          daftarVendor={daftarVendor}
          persenKomisiDefault={persenKomisiDefault}
          onSelesaiCheckout={handleSelesaiCheckout}
        />
      )}

      {/* Modal Ulasan Toko & Produk */}
      {bukaReviewModal && vendorUntukReview && (
        <ReviewModal
          isOpen={bukaReviewModal}
          onTutup={() => {
            setBukaReviewModal(false);
            setVendorUntukReview(null);
          }}
          vendor={vendorUntukReview}
          daftarProduk={daftarProduk}
          onSimpanUlasan={handleSimpanUlasan}
        />
      )}

    </div>
  );
}
