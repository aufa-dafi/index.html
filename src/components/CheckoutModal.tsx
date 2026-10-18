import React, { useState } from 'react';
import { ItemKeranjang, Vendor, Pesanan } from '../types';
import { formatRupiah } from '../utils/format';
import { 
  X, CheckCircle2, QrCode, CreditCard, Wallet, Truck, 
  MapPin, ShieldCheck, ArrowRight, Copy, Check 
} from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onTutup: () => void;
  keranjang: ItemKeranjang[];
  daftarVendor: Vendor[];
  persenKomisiDefault: number;
  onSelesaiCheckout: (pesananBaru: Pesanan) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onTutup,
  keranjang,
  daftarVendor,
  persenKomisiDefault,
  onSelesaiCheckout,
}) => {
  const [namaPembeli, setNamaPembeli] = useState('Bambang Pamungkas');
  const [noHp, setNoHp] = useState('081298765432');
  const [alamat, setAlamat] = useState('Jl. Kenari No. 28, RT 03/RW 04, Menteng, Jakarta Pusat, 10310');
  const [kurir, setKurir] = useState('J&T Express Reguler (2-3 hari)');
  const [metodeBayar, setMetodeBayar] = useState<'qris' | 'transfer' | 'ewallet' | 'cod'>('qris');
  const [bankTujuan, setBankTujuan] = useState<'bca' | 'bri' | 'mandiri'>('bca');
  
  // Status selesai bayar
  const [pesananSelesai, setPesananSelesai] = useState<Pesanan | null>(null);
  const [sudahSalin, setSudahSalin] = useState(false);

  if (!isOpen) return null;

  // Hitung subtotal dan biaya
  const totalProduk = keranjang.reduce(
    (acc, item) => acc + item.produk.harga * item.jumlah,
    0
  );

  // Hitung jumlah vendor unik untuk estimasi pengiriman multi-toko
  const vendorIds = Array.from(new Set(keranjang.map((i) => i.produk.vendorId)));
  const ongkirPerVendor = 12000;
  const totalOngkir = vendorIds.length * ongkirPerVendor;
  const biayaLayanan = 1000;
  const totalAkhir = totalProduk + totalOngkir + biayaLayanan;

  // Hitung total komisi platform
  const totalKomisiAdmin = keranjang.reduce((acc, item) => {
    const v = daftarVendor.find((vendor) => vendor.id === item.produk.vendorId);
    const persen = v ? v.komisiPersen : persenKomisiDefault;
    return acc + Math.round((item.produk.harga * item.jumlah * persen) / 100);
  }, 0);

  const handleProsesBayar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaPembeli.trim() || !alamat.trim() || !noHp.trim()) {
      alert('Mohon lengkapi nama, nomor WhatsApp, dan alamat pengiriman!');
      return;
    }

    const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const metodeNama = 
      metodeBayar === 'qris' 
        ? 'QRIS Instan UMKM' 
        : metodeBayar === 'transfer' 
        ? `Transfer Bank ${bankTujuan.toUpperCase()}` 
        : metodeBayar === 'ewallet' 
        ? 'E-Wallet (GoPay/ShopeePay)' 
        : 'COD (Bayar di Tempat)';

    const orderData: Pesanan = {
      id: orderId,
      tanggal: new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      }),
      namaPembeli,
      noHp,
      alamat,
      metodePembayaran: metodeNama,
      items: keranjang.map((item) => ({
        produkId: item.produk.id,
        namaProduk: item.produk.nama,
        vendorId: item.produk.vendorId,
        harga: item.produk.harga,
        jumlah: item.jumlah,
        subtotal: item.produk.harga * item.jumlah,
        pilihanMotif: item.pilihanMotif,
        pilihanUkuran: item.pilihanUkuran,
      })),
      totalProduk,
      ongkir: totalOngkir,
      totalAkhir,
      totalKomisiAdmin,
      status: metodeBayar === 'cod' ? 'Diproses UMKM' : 'Diproses UMKM'
    };

    setPesananSelesai(orderData);
    onSelesaiCheckout(orderData);
  };

  const handleSalinRekening = (text: string) => {
    navigator.clipboard?.writeText(text);
    setSudahSalin(true);
    setTimeout(() => setSudahSalin(false), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full my-8 overflow-hidden shadow-2xl border border-stone-200">
        
        {/* Tampilan Jika Sudah Berhasil Pesan */}
        {pesananSelesai ? (
          <div className="p-6 sm:p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                Pesanan Berhasil Dibuat
              </span>
              <h2 className="text-2xl font-bold text-stone-900 mt-2">
                Terima Kasih, Pesanan Diteruskan ke UMKM!
              </h2>
              <p className="text-sm text-stone-500">
                Nomor Pesanan: <strong className="text-stone-800">{pesananSelesai.id}</strong>
              </p>
            </div>

            {/* Simulasi Petunjuk Bayar */}
            <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 text-left text-xs sm:text-sm space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-stone-200">
                <span className="text-stone-600">Metode Pembayaran:</span>
                <span className="font-bold text-stone-900">{pesananSelesai.metodePembayaran}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-stone-200">
                <span className="text-stone-600">Total Tagihan:</span>
                <span className="font-extrabold text-amber-900 text-base">
                  {formatRupiah(pesananSelesai.totalAkhir)}
                </span>
              </div>

              {pesananSelesai.metodePembayaran.includes('QRIS') && (
                <div className="text-center py-2 space-y-2">
                  <p className="text-stone-600 font-medium">Scan QRIS Nasional melalui aplikasi m-Banking atau E-Wallet:</p>
                  <div className="inline-block p-3 bg-white border border-stone-300 rounded-xl shadow-xs">
                    <img
                      src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=PASAR-UMKM-ORD-9821"
                      alt="QRIS Code"
                      className="w-40 h-40 mx-auto"
                    />
                    <span className="text-[10px] text-stone-400 mt-1 block">NMID: ID102030495810 PASAR UMKM</span>
                  </div>
                  <p className="text-[11px] text-emerald-700 font-semibold">
                    ✓ Otomatis terverifikasi dalam 1-2 menit
                  </p>
                </div>
              )}

              {pesananSelesai.metodePembayaran.includes('Transfer') && (
                <div className="py-2 space-y-2">
                  <p className="text-stone-600">Silakan transfer tepat sesuai nominal ke rekening bersama:</p>
                  <div className="p-3 bg-white border border-stone-200 rounded-lg flex items-center justify-between">
                    <div>
                      <span className="text-xs text-stone-400 block font-semibold">REKENING REKBER PASAR UMKM</span>
                      <strong className="text-base text-stone-800 tracking-wide">
                        {bankTujuan === 'bca' ? 'BCA: 5410-9921-33' : bankTujuan === 'bri' ? 'BRI: 0192-01-002931-50' : 'MANDIRI: 137-00-99210-44'}
                      </strong>
                    </div>
                    <button
                      onClick={() => handleSalinRekening(bankTujuan === 'bca' ? '5410992133' : bankTujuan === 'bri' ? '01920100293150' : '137009921044')}
                      className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-lg flex items-center gap-1 cursor-pointer"
                    >
                      {sudahSalin ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{sudahSalin ? 'Tersalin' : 'Salin'}</span>
                    </button>
                  </div>
                </div>
              )}

              <p className="text-stone-500 text-xs">
                Penjual UMKM telah menerima notifikasi dan pesanan Anda sedang disiapkan untuk dikirim ke <strong>{pesananSelesai.alamat}</strong>.
              </p>
            </div>

            <button
              onClick={onTutup}
              className="w-full py-3 bg-amber-700 hover:bg-amber-800 text-white font-bold rounded-xl shadow-xs transition cursor-pointer"
            >
              Lihat Riwayat Pesanan Saya
            </button>
          </div>
        ) : (
          /* Tampilan Form Checkout */
          <form onSubmit={handleProsesBayar}>
            {/* Header Modal */}
            <div className="p-4 sm:px-6 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  <span>Pembayaran & Pengiriman UMKM</span>
                </h3>
                <p className="text-xs text-stone-500">
                  Pembayaran aman terproteksi escrow resmi PasarUMKM
                </p>
              </div>
              <button
                type="button"
                onClick={onTutup}
                className="text-stone-400 hover:text-stone-600 p-1.5 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 sm:p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              {/* Bagian 1: Data Penerima */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-amber-700" />
                  <span>Alamat Pengiriman Pembeli</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-stone-700 block mb-1">
                      Nama Lengkap Penerima
                    </label>
                    <input
                      type="text"
                      required
                      value={namaPembeli}
                      onChange={(e) => setNamaPembeli(e.target.value)}
                      className="w-full p-2.5 text-sm bg-stone-50 border border-stone-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-stone-700 block mb-1">
                      Nomor WhatsApp / HP Aktif
                    </label>
                    <input
                      type="tel"
                      required
                      value={noHp}
                      onChange={(e) => setNoHp(e.target.value)}
                      className="w-full p-2.5 text-sm bg-stone-50 border border-stone-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    Alamat Lengkap & Patokan Rumah
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={alamat}
                    onChange={(e) => setAlamat(e.target.value)}
                    className="w-full p-2.5 text-sm bg-stone-50 border border-stone-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* Bagian 2: Pilihan Kurir Pengiriman */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-amber-700" />
                  <span>Layanan Kurir UMKM ({vendorIds.length} Asal Kota Toko)</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {[
                    { nama: 'J&T Express Reguler (2-3 hari)', ket: 'Standar pengiriman cepat' },
                    { nama: 'SiCepat Halu (2-4 hari)', ket: 'Ekonomis & ramah UMKM' },
                    { nama: 'JNE Reguler (2-3 hari)', ket: 'Jangkauan pelosok desa' },
                    { nama: 'Pos Indonesia Kilat Khusus', ket: 'BUMN menjangkau nusantara' },
                  ].map((item) => (
                    <label
                      key={item.nama}
                      className={`p-2.5 border rounded-lg flex items-center gap-2 cursor-pointer transition ${
                        kurir === item.nama
                          ? 'border-amber-600 bg-amber-50/50'
                          : 'border-stone-200 hover:border-stone-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="kurir"
                        checked={kurir === item.nama}
                        onChange={() => setKurir(item.nama)}
                        className="text-amber-700"
                      />
                      <div>
                        <strong className="block text-stone-800">{item.nama}</strong>
                        <span className="text-[10px] text-stone-500">{item.ket}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Bagian 3: Pilihan Metode Pembayaran */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-amber-700" />
                  <span>Pilih Metode Pembayaran</span>
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setMetodeBayar('qris')}
                    className={`p-3 rounded-xl border text-center flex flex-col items-center gap-1.5 cursor-pointer transition ${
                      metodeBayar === 'qris'
                        ? 'border-amber-700 bg-amber-50 text-amber-900 font-bold'
                        : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    <QrCode className="w-5 h-5 text-amber-700" />
                    <span>QRIS Instan</span>
                    <span className="text-[10px] text-emerald-600 font-normal">Semua e-Wallet</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMetodeBayar('transfer')}
                    className={`p-3 rounded-xl border text-center flex flex-col items-center gap-1.5 cursor-pointer transition ${
                      metodeBayar === 'transfer'
                        ? 'border-amber-700 bg-amber-50 text-amber-900 font-bold'
                        : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 text-amber-700" />
                    <span>Transfer Bank</span>
                    <span className="text-[10px] text-stone-500 font-normal">BCA/BRI/Mandiri</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMetodeBayar('ewallet')}
                    className={`p-3 rounded-xl border text-center flex flex-col items-center gap-1.5 cursor-pointer transition ${
                      metodeBayar === 'ewallet'
                        ? 'border-amber-700 bg-amber-50 text-amber-900 font-bold'
                        : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    <Wallet className="w-5 h-5 text-amber-700" />
                    <span>E-Wallet</span>
                    <span className="text-[10px] text-stone-500 font-normal">GoPay, ShopeePay</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMetodeBayar('cod')}
                    className={`p-3 rounded-xl border text-center flex flex-col items-center gap-1.5 cursor-pointer transition ${
                      metodeBayar === 'cod'
                        ? 'border-amber-700 bg-amber-50 text-amber-900 font-bold'
                        : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    <Truck className="w-5 h-5 text-amber-700" />
                    <span>COD</span>
                    <span className="text-[10px] text-stone-500 font-normal">Bayar di Tempat</span>
                  </button>
                </div>

                {metodeBayar === 'transfer' && (
                  <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 flex gap-4 text-xs mt-2">
                    <span className="font-semibold text-stone-700">Pilih Bank:</span>
                    <label className="flex items-center gap-1 cursor-pointer">
                      <input
                        type="radio"
                        checked={bankTujuan === 'bca'}
                        onChange={() => setBankTujuan('bca')}
                      />
                      <span>BCA</span>
                    </label>
                    <label className="flex items-center gap-1 cursor-pointer">
                      <input
                        type="radio"
                        checked={bankTujuan === 'bri'}
                        onChange={() => setBankTujuan('bri')}
                      />
                      <span>BRI</span>
                    </label>
                    <label className="flex items-center gap-1 cursor-pointer">
                      <input
                        type="radio"
                        checked={bankTujuan === 'mandiri'}
                        onChange={() => setBankTujuan('mandiri')}
                      />
                      <span>Mandiri</span>
                    </label>
                  </div>
                )}
              </div>

              {/* Rincian Biaya */}
              <div className="bg-stone-50 rounded-xl p-4 border border-stone-200 space-y-2 text-xs sm:text-sm">
                <div className="flex justify-between text-stone-600">
                  <span>Total Produk ({keranjang.length} jenis)</span>
                  <span className="font-semibold text-stone-800">{formatRupiah(totalProduk)}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Ongkos Kirim ({vendorIds.length} Toko UMKM x {formatRupiah(ongkirPerVendor)})</span>
                  <span className="font-semibold text-stone-800">{formatRupiah(totalOngkir)}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Biaya Layanan & Pemeliharaan UMKM</span>
                  <span className="font-semibold text-stone-800">{formatRupiah(biayaLayanan)}</span>
                </div>
                <div className="pt-2 border-t border-stone-200 flex justify-between text-sm sm:text-base font-bold">
                  <span className="text-stone-900">Total Pembayaran</span>
                  <span className="text-amber-900 font-extrabold">{formatRupiah(totalAkhir)}</span>
                </div>
              </div>
            </div>

            {/* Footer Tombol Bayar */}
            <div className="p-4 sm:px-6 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
              <div>
                <span className="text-xs text-stone-500 block">Total Tagihan</span>
                <span className="text-lg font-extrabold text-amber-900">
                  {formatRupiah(totalAkhir)}
                </span>
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 bg-amber-700 hover:bg-amber-800 text-white font-bold rounded-xl shadow-xs flex items-center gap-2 transition cursor-pointer text-sm"
              >
                <span>Bayar Sekarang</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
