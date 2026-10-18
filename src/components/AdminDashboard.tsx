import React, { useState } from 'react';
import { Vendor, Produk, Pesanan } from '../types';
import { formatRupiah } from '../utils/format';
import { 
  Users, Package, BarChart3, Percent, CheckCircle, XCircle, 
  Plus, Edit3, DollarSign, ArrowUpRight, Search, Check, 
  Store, Building2, Download, AlertCircle, RefreshCw 
} from 'lucide-react';

interface AdminDashboardProps {
  daftarVendor: Vendor[];
  setDaftarVendor: React.Dispatch<React.SetStateAction<Vendor[]>>;
  daftarProduk: Produk[];
  setDaftarProduk: React.Dispatch<React.SetStateAction<Produk[]>>;
  daftarPesanan: Pesanan[];
  setDaftarPesanan: React.Dispatch<React.SetStateAction<Pesanan[]>>;
  persenKomisiDefault: number;
  setPersenKomisiDefault: (persen: number) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  daftarVendor,
  setDaftarVendor,
  daftarProduk,
  setDaftarProduk,
  daftarPesanan,
  setDaftarPesanan,
  persenKomisiDefault,
  setPersenKomisiDefault,
}) => {
  // Tab Admin yang aktif
  const [tabAdmin, setTabAdmin] = useState<'vendor' | 'produk' | 'keuangan' | 'komisi'>('vendor');

  // Filter & Search di Admin
  const [cariVendor, setCariVendor] = useState('');
  const [filterVendorId, setFilterVendorId] = useState<string>('semua');
  const [cariProduk, setCariProduk] = useState('');

  // State Modal Tambah Vendor
  const [bukaModalTambahVendor, setBukaModalTambahVendor] = useState(false);
  const [formVendor, setFormVendor] = useState({
    namaToko: '',
    pemilik: '',
    kota: '',
    sentraDaerah: '',
    alamatLengkap: '',
    jamOperasional: 'Setiap Hari 08.00 - 17.00 WIB',
    legalitasUMKM: 'P-IRT / NIB Terdaftar',
    kategori: 'Kuliner',
    deskripsi: '',
    rekeningBank: '',
    nomorWA: '',
    komisiPersen: persenKomisiDefault,
  });

  // State Modal Tambah Produk
  const [bukaModalTambahProduk, setBukaModalTambahProduk] = useState(false);
  const [formProduk, setFormProduk] = useState({
    vendorId: daftarVendor[0]?.id || '',
    nama: '',
    kategori: 'Kuliner' as Produk['kategori'],
    harga: 25000,
    stok: 20,
    foto: '/src/assets/images/tempe_sagu_chips_1792284312909.jpg',
    deskripsi: '',
    beratGram: 250,
    badge: 'Produk Baru',
  });

  // State toast notifikasi
  const [pesanNotif, setPesanNotif] = useState<string | null>(null);

  const munculkanNotif = (pesan: string) => {
    setPesanNotif(pesan);
    setTimeout(() => setPesanNotif(null), 3000);
  };

  // --- Handlers Manajemen Vendor ---
  const handleUbahStatusVendor = (vendorId: string, statusBaru: Vendor['status']) => {
    setDaftarVendor((prev) =>
      prev.map((v) => (v.id === vendorId ? { ...v, status: statusBaru } : v))
    );
    munculkanNotif(`Status toko berhasil diubah menjadi: ${statusBaru}`);
  };

  const handleUbahKomisiVendor = (vendorId: string, komisiBaru: number) => {
    setDaftarVendor((prev) =>
      prev.map((v) => (v.id === vendorId ? { ...v, komisiPersen: komisiBaru } : v))
    );
    munculkanNotif(`Persentase komisi toko diperbarui menjadi: ${komisiBaru}%`);
  };

  const handleTambahVendorBaru = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formVendor.namaToko.trim() || !formVendor.pemilik.trim()) {
      alert('Nama Toko dan Pemilik wajib diisi!');
      return;
    }

    const vendorBaru: Vendor = {
      id: `v-${Date.now()}`,
      namaToko: formVendor.namaToko,
      pemilik: formVendor.pemilik,
      kota: formVendor.kota || 'Indonesia',
      sentraDaerah: formVendor.sentraDaerah || 'Sentra Kerajinan & Kuliner Lokal',
      alamatLengkap: formVendor.alamatLengkap || `${formVendor.kota || 'Indonesia'}, Lapak Resmi UMKM`,
      jamOperasional: formVendor.jamOperasional || 'Setiap Hari 08.00 - 17.00 WIB',
      legalitasUMKM: formVendor.legalitasUMKM || 'Terdaftar di Dinas Koperasi & UMKM',
      linkPeta: `https://www.google.com/maps/search/${encodeURIComponent(formVendor.namaToko + ' ' + (formVendor.kota || 'Indonesia'))}`,
      kategori: formVendor.kategori,
      deskripsi: formVendor.deskripsi || 'UMKM binaan daerah dengan produk lokal berkualitas.',
      fotoToko: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      banner: '/src/assets/images/tempe_sagu_chips_1792284312909.jpg',
      rating: 5.0,
      totalPenjualan: 0,
      status: 'Aktif',
      komisiPersen: Number(formVendor.komisiPersen) || persenKomisiDefault,
      rekeningBank: formVendor.rekeningBank || 'BCA 1234567890 (a.n Pemilik)',
      nomorWA: formVendor.nomorWA || '081234567890',
      tahunBerdiri: new Date().getFullYear(),
    };

    setDaftarVendor((prev) => [vendorBaru, ...prev]);
    setBukaModalTambahVendor(false);
    setFormVendor({
      namaToko: '',
      pemilik: '',
      kota: '',
      sentraDaerah: '',
      alamatLengkap: '',
      jamOperasional: 'Setiap Hari 08.00 - 17.00 WIB',
      legalitasUMKM: 'P-IRT / NIB Terdaftar',
      kategori: 'Kuliner',
      deskripsi: '',
      rekeningBank: '',
      nomorWA: '',
      komisiPersen: persenKomisiDefault,
    });
    munculkanNotif(`Toko UMKM baru "${vendorBaru.namaToko}" berhasil didaftarkan!`);
  };

  // --- Handlers Manajemen Produk ---
  const handleToggleAktifProduk = (produkId: string) => {
    setDaftarProduk((prev) =>
      prev.map((p) => (p.id === produkId ? { ...p, isAktif: !p.isAktif } : p))
    );
    munculkanNotif('Status tayang produk berhasil diperbarui.');
  };

  const handleUpdateStokCepat = (produkId: string, delta: number) => {
    setDaftarProduk((prev) =>
      prev.map((p) => {
        if (p.id === produkId) {
          const stokBaru = Math.max(0, p.stok + delta);
          return { ...p, stok: stokBaru };
        }
        return p;
      })
    );
  };

  const handleTambahProdukBaru = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formProduk.nama.trim()) {
      alert('Nama produk wajib diisi!');
      return;
    }

    const produkBaru: Produk = {
      id: `p-${Date.now()}`,
      vendorId: formProduk.vendorId || (daftarVendor[0]?.id ?? 'v1'),
      nama: formProduk.nama,
      kategori: formProduk.kategori,
      harga: Number(formProduk.harga),
      stok: Number(formProduk.stok),
      foto: formProduk.foto,
      deskripsi: formProduk.deskripsi || 'Produk unggulan hasil karya pengrajin daerah.',
      beratGram: Number(formProduk.beratGram),
      terjual: 0,
      rating: 5.0,
      badge: formProduk.badge,
      isAktif: true,
    };

    setDaftarProduk((prev) => [produkBaru, ...prev]);
    setBukaModalTambahProduk(false);
    munculkanNotif(`Produk "${produkBaru.nama}" berhasil ditambahkan.`);
  };

  // --- Perhitungan Keuangan & Komisi ---
  const totalGMV = daftarPesanan.reduce((sum, ord) => sum + ord.totalProduk, 0);
  const totalKomisiPlatform = daftarPesanan.reduce((sum, ord) => sum + ord.totalKomisiAdmin, 0);
  const totalBersihKeVendor = totalGMV - totalKomisiPlatform;
  const totalPesananSelesai = daftarPesanan.length;

  // Pencairan dana vendor state (simulasi)
  const [daftarPencairan, setDaftarPencairan] = useState<{ [vendorId: string]: boolean }>({});

  const handleCairkanDana = (vendorId: string, namaToko: string, jumlah: number) => {
    setDaftarPencairan((prev) => ({ ...prev, [vendorId]: true }));
    munculkanNotif(`Pencairan dana ${formatRupiah(jumlah)} ke rekening ${namaToko} telah diproses!`);
  };

  const handleEksporCSV = () => {
    const header = 'ID Pesanan,Tanggal,Nama Pembeli,Metode Bayar,Total Belanja,Komisi Platform,Status\n';
    const rows = daftarPesanan
      .map(
        (p) =>
          `"${p.id}","${p.tanggal}","${p.namaPembeli}","${p.metodePembayaran}",${p.totalAkhir},${p.totalKomisiAdmin},"${p.status}"`
      )
      .join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Laporan_Keuangan_PasarUMKM_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    munculkanNotif('Laporan keuangan berhasil diunduh dalam format CSV.');
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Toast Notifikasi */}
      {pesanNotif && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-white px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 text-xs sm:text-sm animate-fade-in border border-stone-700">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{pesanNotif}</span>
        </div>
      )}

      {/* Header Panel Admin */}
      <div className="bg-stone-900 text-white rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-amber-500/20 text-amber-300 text-xs px-2.5 py-1 rounded-full font-semibold border border-amber-500/30 mb-2">
              <Building2 className="w-3.5 h-3.5" />
              <span>Pusat Kendali Pengelola PasarUMKM</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Dashboard Manajemen Multi-Vendor
            </h1>
            <p className="text-stone-400 text-xs sm:text-sm mt-1">
              Pantau mitra UMKM, katalog produk daerah, komisi platform, dan transparansi laporan bagi hasil.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-stone-400 hidden sm:inline">Standar Komisi:</span>
            <span className="bg-amber-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1">
              <Percent className="w-3.5 h-3.5" />
              <span>{persenKomisiDefault}% Per Transaksi</span>
            </span>
          </div>
        </div>

        {/* 4 Kartu KPI Keuangan Ringkas */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-6">
          <div className="bg-stone-800/80 p-4 rounded-xl border border-stone-700">
            <span className="text-stone-400 text-xs block">Total Omzet (GMV)</span>
            <span className="text-lg sm:text-xl font-bold text-white block mt-1">
              {formatRupiah(totalGMV)}
            </span>
            <span className="text-[10px] text-emerald-400 flex items-center gap-0.5 mt-0.5">
              <ArrowUpRight className="w-3 h-3" /> Dari semua pesanan masuk
            </span>
          </div>

          <div className="bg-stone-800/80 p-4 rounded-xl border border-stone-700">
            <span className="text-stone-400 text-xs block">Pendapatan Komisi Admin</span>
            <span className="text-lg sm:text-xl font-bold text-amber-400 block mt-1">
              {formatRupiah(totalKomisiPlatform)}
            </span>
            <span className="text-[10px] text-amber-300 mt-0.5 block">
              Operasional & pendampingan
            </span>
          </div>

          <div className="bg-stone-800/80 p-4 rounded-xl border border-stone-700">
            <span className="text-stone-400 text-xs block">Omzet Bersih Mitra UMKM</span>
            <span className="text-lg sm:text-xl font-bold text-emerald-400 block mt-1">
              {formatRupiah(totalBersihKeVendor)}
            </span>
            <span className="text-[10px] text-stone-400 mt-0.5 block">
              Diteruskan ke penjual
            </span>
          </div>

          <div className="bg-stone-800/80 p-4 rounded-xl border border-stone-700">
            <span className="text-stone-400 text-xs block">Mitra Toko Aktif</span>
            <span className="text-lg sm:text-xl font-bold text-white block mt-1">
              {daftarVendor.filter((v) => v.status === 'Aktif').length} Toko
            </span>
            <span className="text-[10px] text-stone-400 mt-0.5 block">
              Total {daftarProduk.length} produk katalog
            </span>
          </div>
        </div>
      </div>

      {/* Navigasi Sub-Tab Admin */}
      <div className="flex border-b border-stone-200 bg-white rounded-xl px-4 shadow-xs overflow-x-auto">
        <button
          onClick={() => setTabAdmin('vendor')}
          className={`py-3.5 px-4 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 whitespace-nowrap cursor-pointer transition ${
            tabAdmin === 'vendor'
              ? 'border-amber-700 text-amber-900'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>1. Manajemen Vendor ({daftarVendor.length})</span>
        </button>

        <button
          onClick={() => setTabAdmin('produk')}
          className={`py-3.5 px-4 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 whitespace-nowrap cursor-pointer transition ${
            tabAdmin === 'produk'
              ? 'border-amber-700 text-amber-900'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>2. Manajemen Produk ({daftarProduk.length})</span>
        </button>

        <button
          onClick={() => setTabAdmin('keuangan')}
          className={`py-3.5 px-4 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 whitespace-nowrap cursor-pointer transition ${
            tabAdmin === 'keuangan'
              ? 'border-amber-700 text-amber-900'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>3. Laporan Keuangan ({daftarPesanan.length} Pesanan)</span>
        </button>

        <button
          onClick={() => setTabAdmin('komisi')}
          className={`py-3.5 px-4 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 whitespace-nowrap cursor-pointer transition ${
            tabAdmin === 'komisi'
              ? 'border-amber-700 text-amber-900'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <Percent className="w-4 h-4" />
          <span>4. Manajemen Komisi & Pencairan</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* 1. MANAJEMEN VENDOR                                      */}
      {/* ======================================================== */}
      {tabAdmin === 'vendor' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-stone-200">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                placeholder="Cari toko, pemilik, atau kota..."
                value={cariVendor}
                onChange={(e) => setCariVendor(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:bg-white focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <button
              onClick={() => setBukaModalTambahVendor(true)}
              className="px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs cursor-pointer transition"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Toko UMKM Baru</span>
            </button>
          </div>

          <div className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-stone-700">
                <thead className="bg-stone-50 text-stone-500 font-bold uppercase tracking-wider border-b border-stone-200 text-[11px]">
                  <tr>
                    <th className="p-3.5">Nama Toko & Pemilik</th>
                    <th className="p-3.5">Kota Asal</th>
                    <th className="p-3.5">Kategori</th>
                    <th className="p-3.5">Komisi</th>
                    <th className="p-3.5">Rekening Bank</th>
                    <th className="p-3.5">Status Toko</th>
                    <th className="p-3.5 text-right">Aksi Manajemen</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {daftarVendor
                    .filter((v) =>
                      v.namaToko.toLowerCase().includes(cariVendor.toLowerCase()) ||
                      v.pemilik.toLowerCase().includes(cariVendor.toLowerCase()) ||
                      v.kota.toLowerCase().includes(cariVendor.toLowerCase())
                    )
                    .map((vendor) => (
                      <tr key={vendor.id} className="hover:bg-stone-50/80 transition">
                        <td className="p-3.5">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={vendor.fotoToko}
                              alt={vendor.namaToko}
                              referrerPolicy="no-referrer"
                              className="w-9 h-9 rounded-full object-cover border border-stone-200"
                            />
                            <div>
                              <strong className="block text-stone-900 text-sm font-bold">
                                {vendor.namaToko}
                              </strong>
                              <span className="text-[11px] text-stone-500">
                                Pemilik: {vendor.pemilik}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="p-3.5">{vendor.kota}</td>
                        <td className="p-3.5">
                          <span className="bg-stone-100 text-stone-700 px-2 py-0.5 rounded font-medium text-[11px]">
                            {vendor.kategori}
                          </span>
                        </td>

                        <td className="p-3.5">
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              min="0"
                              max="30"
                              value={vendor.komisiPersen}
                              onChange={(e) =>
                                handleUbahKomisiVendor(vendor.id, Number(e.target.value))
                              }
                              className="w-12 p-1 border border-stone-300 rounded text-center font-bold text-amber-900 bg-amber-50/50"
                            />
                            <span>%</span>
                          </div>
                        </td>

                        <td className="p-3.5 text-stone-600 font-mono text-[11px]">
                          {vendor.rekeningBank}
                        </td>

                        <td className="p-3.5">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[11px] font-bold inline-flex items-center gap-1 ${
                              vendor.status === 'Aktif'
                                ? 'bg-emerald-100 text-emerald-800'
                                : vendor.status === 'Menunggu Verifikasi'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {vendor.status === 'Aktif' ? (
                              <CheckCircle className="w-3 h-3" />
                            ) : (
                              <AlertCircle className="w-3 h-3" />
                            )}
                            <span>{vendor.status}</span>
                          </span>
                        </td>

                        <td className="p-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {vendor.status !== 'Aktif' && (
                              <button
                                onClick={() => handleUbahStatusVendor(vendor.id, 'Aktif')}
                                className="px-2.5 py-1 bg-emerald-600 text-white rounded-md text-[11px] font-semibold hover:bg-emerald-700 transition cursor-pointer"
                              >
                                Aktifkan
                              </button>
                            )}

                            {vendor.status === 'Aktif' && (
                              <button
                                onClick={() => handleUbahStatusVendor(vendor.id, 'Nonaktif')}
                                className="px-2.5 py-1 bg-stone-200 text-stone-700 hover:bg-red-100 hover:text-red-700 rounded-md text-[11px] font-semibold transition cursor-pointer"
                              >
                                Nonaktifkan
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. MANAJEMEN PRODUK                                      */}
      {/* ======================================================== */}
      {tabAdmin === 'produk' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-stone-200">
            <div className="flex flex-wrap items-center gap-2 flex-1">
              {/* Filter Toko */}
              <div className="flex items-center gap-1.5 text-xs text-stone-600">
                <Store className="w-4 h-4 text-amber-700" />
                <span>Filter Toko:</span>
                <select
                  value={filterVendorId}
                  onChange={(e) => setFilterVendorId(e.target.value)}
                  className="p-1.5 bg-stone-50 border border-stone-200 rounded-lg text-xs"
                >
                  <option value="semua">Semua Toko UMKM</option>
                  {daftarVendor.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.namaToko}
                    </option>
                  ))}
                </select>
              </div>

              {/* Cari Produk */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  placeholder="Cari nama produk..."
                  value={cariProduk}
                  onChange={(e) => setCariProduk(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:bg-white"
                />
              </div>
            </div>

            <button
              onClick={() => setBukaModalTambahProduk(true)}
              className="px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs cursor-pointer transition"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Produk Baru</span>
            </button>
          </div>

          <div className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-stone-700">
                <thead className="bg-stone-50 text-stone-500 font-bold uppercase tracking-wider border-b border-stone-200 text-[11px]">
                  <tr>
                    <th className="p-3.5">Produk</th>
                    <th className="p-3.5">Toko UMKM</th>
                    <th className="p-3.5">Kategori</th>
                    <th className="p-3.5">Harga Jual</th>
                    <th className="p-3.5">Stok Barang</th>
                    <th className="p-3.5">Terjual</th>
                    <th className="p-3.5">Status Tayang</th>
                    <th className="p-3.5 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {daftarProduk
                    .filter(
                      (p) =>
                        (filterVendorId === 'semua' || p.vendorId === filterVendorId) &&
                        p.nama.toLowerCase().includes(cariProduk.toLowerCase())
                    )
                    .map((produk) => {
                      const vendor = daftarVendor.find((v) => v.id === produk.vendorId);
                      return (
                        <tr key={produk.id} className="hover:bg-stone-50/80 transition">
                          <td className="p-3.5">
                            <div className="flex items-center gap-3">
                              <img
                                src={produk.foto}
                                alt={produk.nama}
                                referrerPolicy="no-referrer"
                                className="w-10 h-10 rounded-lg object-cover border border-stone-200 shrink-0"
                              />
                              <div>
                                <strong className="block text-stone-900 font-bold text-xs max-w-[200px] truncate">
                                  {produk.nama}
                                </strong>
                                <span className="text-[10px] text-stone-400">
                                  Berat: {produk.beratGram} gr
                                </span>
                              </div>
                            </div>
                          </td>

                          <td className="p-3.5 font-medium text-stone-800">
                            {vendor?.namaToko || '-'}
                          </td>

                          <td className="p-3.5">
                            <span className="bg-stone-100 text-stone-700 px-2 py-0.5 rounded text-[10px] font-medium">
                              {produk.kategori}
                            </span>
                          </td>

                          <td className="p-3.5 font-bold text-amber-900">
                            {formatRupiah(produk.harga)}
                          </td>

                          <td className="p-3.5">
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => handleUpdateStokCepat(produk.id, -5)}
                                className="w-5 h-5 bg-stone-100 hover:bg-stone-200 rounded text-stone-700 flex items-center justify-center font-bold"
                                title="Kurang 5"
                              >
                                -
                              </button>
                              <span className="font-bold w-7 text-center">{produk.stok}</span>
                              <button
                                onClick={() => handleUpdateStokCepat(produk.id, 5)}
                                className="w-5 h-5 bg-stone-100 hover:bg-stone-200 rounded text-stone-700 flex items-center justify-center font-bold"
                                title="Tambah 5"
                              >
                                +
                              </button>
                            </div>
                          </td>

                          <td className="p-3.5 text-stone-600 font-semibold">
                            {produk.terjual} pcs
                          </td>

                          <td className="p-3.5">
                            <button
                              onClick={() => handleToggleAktifProduk(produk.id)}
                              className={`px-2.5 py-1 rounded-full text-[10px] font-bold cursor-pointer transition ${
                                produk.isAktif
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-stone-200 text-stone-500'
                              }`}
                            >
                              {produk.isAktif ? 'Aktif Tayang' : 'Disembunyikan'}
                            </button>
                          </td>

                          <td className="p-3.5 text-right">
                            <button
                              onClick={() => handleToggleAktifProduk(produk.id)}
                              className="text-xs text-amber-800 hover:underline font-semibold cursor-pointer"
                            >
                              {produk.isAktif ? 'Sembunyikan' : 'Tayangkan'}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. LAPORAN KEUANGAN                                      */}
      {/* ======================================================== */}
      {tabAdmin === 'keuangan' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-stone-200">
            <div>
              <h3 className="font-bold text-sm text-stone-900">
                Rekap Transaksi & Arus Kas PasarUMKM
              </h3>
              <p className="text-xs text-stone-500">
                Pencatatan real-time seluruh pesanan, ongkir, serta potongan komisi platform
              </p>
            </div>

            <button
              onClick={handleEksporCSV}
              className="px-4 py-2 bg-stone-800 hover:bg-stone-900 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs cursor-pointer transition"
            >
              <Download className="w-4 h-4" />
              <span>Ekspor Laporan (CSV)</span>
            </button>
          </div>

          <div className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-stone-700">
                <thead className="bg-stone-50 text-stone-500 font-bold uppercase tracking-wider border-b border-stone-200 text-[11px]">
                  <tr>
                    <th className="p-3.5">ID Pesanan</th>
                    <th className="p-3.5">Tanggal</th>
                    <th className="p-3.5">Pembeli</th>
                    <th className="p-3.5">Metode Bayar</th>
                    <th className="p-3.5">Subtotal Barang</th>
                    <th className="p-3.5">Ongkir</th>
                    <th className="p-3.5 text-amber-900 font-extrabold">Komisi Pasar</th>
                    <th className="p-3.5">Total Bayar</th>
                    <th className="p-3.5">Status Pesanan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {daftarPesanan.map((pesanan) => (
                    <tr key={pesanan.id} className="hover:bg-stone-50/80 transition">
                      <td className="p-3.5 font-mono font-bold text-stone-900">
                        {pesanan.id}
                      </td>
                      <td className="p-3.5 text-stone-500">{pesanan.tanggal}</td>
                      <td className="p-3.5">
                        <span className="font-semibold block text-stone-800">
                          {pesanan.namaPembeli}
                        </span>
                        <span className="text-[10px] text-stone-400">{pesanan.noHp}</span>
                      </td>
                      <td className="p-3.5">
                        <span className="bg-stone-100 text-stone-700 px-2 py-0.5 rounded text-[11px] font-medium">
                          {pesanan.metodePembayaran}
                        </span>
                      </td>
                      <td className="p-3.5 font-medium">{formatRupiah(pesanan.totalProduk)}</td>
                      <td className="p-3.5 text-stone-500">{formatRupiah(pesanan.ongkir)}</td>
                      <td className="p-3.5 font-bold text-amber-900">
                        +{formatRupiah(pesanan.totalKomisiAdmin)}
                      </td>
                      <td className="p-3.5 font-bold text-stone-900">
                        {formatRupiah(pesanan.totalAkhir)}
                      </td>
                      <td className="p-3.5">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900">
                          {pesanan.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 4. MANAJEMEN KOMISI & PENCAIRAN (PAYOUT)                  */}
      {/* ======================================================== */}
      {tabAdmin === 'komisi' && (
        <div className="space-y-6">
          {/* Card Atur Persentase Komisi Default */}
          <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                  <Percent className="w-5 h-5 text-amber-700" />
                  <span>Pengaturan Persentase Komisi Platform</span>
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  Komisi dipotong otomatis saat transaksi terjadi untuk mendanai pemeliharaan server, promosi UMKM, dan customer support.
                </p>
              </div>

              <div className="flex items-center gap-3 bg-stone-50 p-2 rounded-xl border border-stone-200">
                <span className="text-xs font-semibold text-stone-700">Komisi Platform Standar:</span>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={persenKomisiDefault}
                    onChange={(e) => setPersenKomisiDefault(Number(e.target.value))}
                    className="w-16 p-2 bg-white border border-stone-300 rounded-lg text-center font-bold text-amber-900 text-sm"
                  />
                  <span className="font-bold text-stone-700">%</span>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 p-3.5 rounded-lg border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <span>
                <strong>Catatan Kebijakan UMKM:</strong> Anda juga dapat mengatur persentase komisi khusus per vendor pada tab <em>"1. Manajemen Vendor"</em> (misalnya memberikan komisi 0% - 3% untuk UMKM binaan pemula).
              </span>
            </div>
          </div>

          {/* Tabel Rekap Payout / Pencairan Dana ke Vendor */}
          <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs space-y-3 p-4">
            <div>
              <h3 className="font-bold text-sm text-stone-900">
                Rekap Dana Siap Dicairkan ke Rekening Vendor UMKM
              </h3>
              <p className="text-xs text-stone-500">
                Kalkulasi omzet kotor, potongan komisi platform, dan transfer bersih ke rekening bank penjual
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-stone-700">
                <thead className="bg-stone-50 text-stone-500 font-bold uppercase tracking-wider border-b border-stone-200 text-[11px]">
                  <tr>
                    <th className="p-3">Nama Toko & Rekening</th>
                    <th className="p-3">Komisi Berlaku</th>
                    <th className="p-3">Omzet Terjual</th>
                    <th className="p-3">Potongan Komisi</th>
                    <th className="p-3 text-emerald-900 font-extrabold">Dana Bersih Vendor</th>
                    <th className="p-3 text-right">Aksi Transfer</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {daftarVendor.map((vendor) => {
                    // Hitung total penjualan produk dari toko ini dari pesanan
                    let totalOmzetToko = 0;
                    daftarPesanan.forEach((pesan) => {
                      pesan.items.forEach((it) => {
                        if (it.vendorId === vendor.id) {
                          totalOmzetToko += it.subtotal;
                        }
                      });
                    });

                    // Jika pesanan belum ada yang tercatat untuk toko ini, ambil simulasi dari vendor.totalPenjualan
                    if (totalOmzetToko === 0) {
                      totalOmzetToko = vendor.totalPenjualan * 35000;
                    }

                    const potonganKomisi = Math.round((totalOmzetToko * vendor.komisiPersen) / 100);
                    const bersihKeVendor = totalOmzetToko - potonganKomisi;
                    const sudahCair = daftarPencairan[vendor.id];

                    return (
                      <tr key={vendor.id} className="hover:bg-stone-50/80 transition">
                        <td className="p-3">
                          <strong className="block text-stone-900 font-bold">
                            {vendor.namaToko}
                          </strong>
                          <span className="text-[11px] text-stone-500 font-mono">
                            {vendor.rekeningBank}
                          </span>
                        </td>

                        <td className="p-3">
                          <span className="bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded text-[11px]">
                            {vendor.komisiPersen}%
                          </span>
                        </td>

                        <td className="p-3 font-semibold text-stone-800">
                          {formatRupiah(totalOmzetToko)}
                        </td>

                        <td className="p-3 font-semibold text-amber-800">
                          -{formatRupiah(potonganKomisi)}
                        </td>

                        <td className="p-3 font-extrabold text-emerald-800 text-sm">
                          {formatRupiah(bersihKeVendor)}
                        </td>

                        <td className="p-3 text-right">
                          {sudahCair ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                              <Check className="w-3.5 h-3.5" />
                              <span>Sudah Ditransfer</span>
                            </span>
                          ) : (
                            <button
                              onClick={() =>
                                handleCairkanDana(vendor.id, vendor.namaToko, bersihKeVendor)
                              }
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs cursor-pointer transition"
                            >
                              Cairkan ke Bank
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL TAMBAH VENDOR UMKM                                 */}
      {/* ======================================================== */}
      {bukaModalTambahVendor && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-stone-200">
            <div className="p-4 bg-stone-50 border-b border-stone-200 flex justify-between items-center">
              <h3 className="font-bold text-stone-900 text-sm sm:text-base">
                Daftarkan Toko UMKM Binaan Baru
              </h3>
              <button
                onClick={() => setBukaModalTambahVendor(false)}
                className="text-stone-400 hover:text-stone-600 cursor-pointer"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleTambahVendorBaru} className="p-4 sm:p-6 space-y-3 text-xs sm:text-sm">
              <div>
                <label className="font-semibold text-stone-700 block mb-1">Nama Toko UMKM *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Kripik Bu Yati Sleman"
                  value={formVendor.namaToko}
                  onChange={(e) => setFormVendor({ ...formVendor, namaToko: e.target.value })}
                  className="w-full p-2 bg-stone-50 border border-stone-300 rounded-lg focus:bg-white focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Nama Pemilik *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ibu Yati"
                    value={formVendor.pemilik}
                    onChange={(e) => setFormVendor({ ...formVendor, pemilik: e.target.value })}
                    className="w-full p-2 bg-stone-50 border border-stone-300 rounded-lg focus:bg-white"
                  />
                </div>
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Kota / Kabupaten *</label>
                  <input
                    type="text"
                    required
                    placeholder="Sleman, D.I. Yogyakarta"
                    value={formVendor.kota}
                    onChange={(e) => setFormVendor({ ...formVendor, kota: e.target.value })}
                    className="w-full p-2 bg-stone-50 border border-stone-300 rounded-lg focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Nama Kawasan / Sentra UMKM Nyata</label>
                <input
                  type="text"
                  placeholder="Contoh: Sentra Gerabah Kasongan Bantul"
                  value={formVendor.sentraDaerah}
                  onChange={(e) => setFormVendor({ ...formVendor, sentraDaerah: e.target.value })}
                  className="w-full p-2 bg-stone-50 border border-stone-300 rounded-lg focus:bg-white"
                />
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Alamat Fisik Lengkap Nyata</label>
                <input
                  type="text"
                  placeholder="Jl. Kasongan No. 12, RT 02, Bangunjiwo, Kasihan, Bantul"
                  value={formVendor.alamatLengkap}
                  onChange={(e) => setFormVendor({ ...formVendor, alamatLengkap: e.target.value })}
                  className="w-full p-2 bg-stone-50 border border-stone-300 rounded-lg focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Kategori Usaha</label>
                  <select
                    value={formVendor.kategori}
                    onChange={(e) => setFormVendor({ ...formVendor, kategori: e.target.value })}
                    className="w-full p-2 bg-stone-50 border border-stone-300 rounded-lg focus:bg-white"
                  >
                    <option value="Kuliner">Kuliner & Oleh-oleh</option>
                    <option value="Kerajinan">Kerajinan Tangan</option>
                    <option value="Batik & Fashion">Batik & Busana</option>
                    <option value="Kopi & Minuman">Kopi & Minuman</option>
                    <option value="Kecantikan & Herbal">Herbal & Jamu</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Komisi Khusus Toko (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="20"
                    value={formVendor.komisiPersen}
                    onChange={(e) =>
                      setFormVendor({ ...formVendor, komisiPersen: Number(e.target.value) })
                    }
                    className="w-full p-2 bg-stone-50 border border-stone-300 rounded-lg focus:bg-white font-bold text-amber-900"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Rekening Bank untuk Pencairan</label>
                <input
                  type="text"
                  placeholder="BCA 892019283 (a.n Ibu Yati)"
                  value={formVendor.rekeningBank}
                  onChange={(e) => setFormVendor({ ...formVendor, rekeningBank: e.target.value })}
                  className="w-full p-2 bg-stone-50 border border-stone-300 rounded-lg focus:bg-white"
                />
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Deskripsi Singkat Usaha</label>
                <textarea
                  rows={2}
                  placeholder="Ceritakan tentang sejarah resep dan keunikan produk..."
                  value={formVendor.deskripsi}
                  onChange={(e) => setFormVendor({ ...formVendor, deskripsi: e.target.value })}
                  className="w-full p-2 bg-stone-50 border border-stone-300 rounded-lg focus:bg-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setBukaModalTambahVendor(false)}
                  className="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-lg font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-lg font-bold shadow-xs cursor-pointer"
                >
                  Simpan Toko UMKM
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL TAMBAH PRODUK BARU                                 */}
      {/* ======================================================== */}
      {bukaModalTambahProduk && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-stone-200">
            <div className="p-4 bg-stone-50 border-b border-stone-200 flex justify-between items-center">
              <h3 className="font-bold text-stone-900 text-sm sm:text-base">
                Tambah Produk untuk Mitra UMKM
              </h3>
              <button
                onClick={() => setBukaModalTambahProduk(false)}
                className="text-stone-400 hover:text-stone-600 cursor-pointer"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleTambahProdukBaru} className="p-4 sm:p-6 space-y-3 text-xs sm:text-sm">
              <div>
                <label className="font-semibold text-stone-700 block mb-1">Pilih Toko UMKM Pemilik *</label>
                <select
                  value={formProduk.vendorId}
                  onChange={(e) => setFormProduk({ ...formProduk, vendorId: e.target.value })}
                  className="w-full p-2 bg-stone-50 border border-stone-300 rounded-lg focus:bg-white"
                >
                  {daftarVendor.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.namaToko} ({v.kota})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Nama Produk *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Kripik Paru Sapi Gurih 200gr"
                  value={formProduk.nama}
                  onChange={(e) => setFormProduk({ ...formProduk, nama: e.target.value })}
                  className="w-full p-2 bg-stone-50 border border-stone-300 rounded-lg focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Harga Jual (Rp) *</label>
                  <input
                    type="number"
                    min="1000"
                    step="500"
                    required
                    value={formProduk.harga}
                    onChange={(e) => setFormProduk({ ...formProduk, harga: Number(e.target.value) })}
                    className="w-full p-2 bg-stone-50 border border-stone-300 rounded-lg focus:bg-white font-bold text-amber-900"
                  />
                </div>
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Stok Awal</label>
                  <input
                    type="number"
                    min="1"
                    value={formProduk.stok}
                    onChange={(e) => setFormProduk({ ...formProduk, stok: Number(e.target.value) })}
                    className="w-full p-2 bg-stone-50 border border-stone-300 rounded-lg focus:bg-white font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Kategori</label>
                  <select
                    value={formProduk.kategori}
                    onChange={(e) =>
                      setFormProduk({
                        ...formProduk,
                        kategori: e.target.value as Produk['kategori'],
                      })
                    }
                    className="w-full p-2 bg-stone-50 border border-stone-300 rounded-lg focus:bg-white"
                  >
                    <option value="Kuliner">Kuliner</option>
                    <option value="Kerajinan">Kerajinan</option>
                    <option value="Batik & Fashion">Batik & Fashion</option>
                    <option value="Kopi & Minuman">Kopi & Minuman</option>
                    <option value="Kecantikan & Herbal">Kecantikan & Herbal</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Label / Badge</label>
                  <input
                    type="text"
                    placeholder="Contoh: Paling Laris / Asli Desa"
                    value={formProduk.badge}
                    onChange={(e) => setFormProduk({ ...formProduk, badge: e.target.value })}
                    className="w-full p-2 bg-stone-50 border border-stone-300 rounded-lg focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">URL Foto Produk</label>
                <input
                  type="url"
                  value={formProduk.foto}
                  onChange={(e) => setFormProduk({ ...formProduk, foto: e.target.value })}
                  className="w-full p-2 bg-stone-50 border border-stone-300 rounded-lg focus:bg-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setBukaModalTambahProduk(false)}
                  className="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-lg font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-lg font-bold shadow-xs cursor-pointer"
                >
                  Tambahkan ke Lapak
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
