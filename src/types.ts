export interface Vendor {
  id: string;
  namaToko: string;
  pemilik: string;
  kota: string;
  kategori: string;
  deskripsi: string;
  fotoToko: string;
  banner: string;
  rating: number;
  totalPenjualan: number;
  status: 'Aktif' | 'Menunggu Verifikasi' | 'Nonaktif';
  komisiPersen: number; // komisi khusus untuk toko ini (misal 5%)
  rekeningBank: string;
  nomorWA: string;
  tahunBerdiri: number;
  alamatLengkap: string; // Alamat fisik nyata toko di daerah
  sentraDaerah: string; // Nama sentra UMKM nyata (e.g. Sentra Keripik Godean)
  linkPeta: string; // Link Google Maps untuk tempat nyata
  jamOperasional: string;
  legalitasUMKM: string; // NIB / P-IRT / Halal resmi
}

export interface Produk {
  id: string;
  vendorId: string;
  nama: string;
  kategori: 'Kuliner' | 'Kerajinan' | 'Batik & Fashion' | 'Kopi & Minuman' | 'Kecantikan & Herbal';
  harga: number;
  stok: number;
  foto: string;
  deskripsi: string;
  beratGram: number;
  terjual: number;
  rating: number;
  badge?: string;
  isAktif: boolean;
  varianMotif?: string[]; // Pilihan motif batik (Parang, Mega Mendung, Kawung, Sekar Jagad, dll.)
  varianUkuran?: string[]; // Pilihan ukuran baju batik (M, L, XL, XXL)
  fotoMotif?: { [motif: string]: string }; // Foto spesifik tiap motif batik
}

export interface ItemKeranjang {
  produk: Produk;
  jumlah: number;
  catatan?: string;
  pilihanMotif?: string;
  pilihanUkuran?: string;
}

export interface Ulasan {
  id: string;
  vendorId: string;
  produkId?: string;
  namaPembeli: string;
  rating: number;
  komentar: string;
  tanggal: string;
  balasanVendor?: string;
}

export interface Pesanan {
  id: string;
  tanggal: string;
  namaPembeli: string;
  noHp: string;
  alamat: string;
  metodePembayaran: string;
  items: {
    produkId: string;
    namaProduk: string;
    vendorId: string;
    harga: number;
    jumlah: number;
    subtotal: number;
    pilihanMotif?: string;
    pilihanUkuran?: string;
  }[];
  totalProduk: number;
  ongkir: number;
  totalAkhir: number;
  totalKomisiAdmin: number;
  status: 'Menunggu Pembayaran' | 'Diproses UMKM' | 'Sedang Dikirim' | 'Selesai';
}
