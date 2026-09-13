# AURA Warehouse & Inventory Operations Frontend

Sistem Frontend Manajemen Gudang, Mutasi Stok, Penerimaan PO, Stock Opname, dan Decision Intelligence untuk Minimarket AURA — **Responsive & Adaptive for Desktop, Tablet, and Mobile**.

---

## 🌟 Fitur Utama & Kesesuaian PRD

1. **Responsive & Multi-Device Adaptive:**
   - **Desktop (Web):** Full sidebar navigasi, multi-column KPI grids, data table luas dengan detail drawer & pergerakan stok real-time.
   - **Tablet:** Collapsible sidebar, tabel adaptif, sliding bottom sheets.
   - **Mobile (Smartphone):** Bottom Navigation Bar (1-thumb fast access), Header Hamburger Drawer, Card List View, Fullscreen interactive modals, dan Mobile Barcode Scanner Simulator.

2. **Peran & Akses RBAC (Role-Based Access Control):**
   - **`WAREHOUSE_ADMIN` (Lead Gudang):** Akses penuh ke Dashboard, Inventori, Penerimaan PO, Transfer Display, Stock Opname, Master Produk Lifecycle, Purchasing, Hermes AI, dan Audit Log.
   - **`WAREHOUSE_STAFF` (Operasional Lapangan):** Dioptimalkan untuk alur cepat lapangan (Stock Opname, Scan Barcode, Transfer ke Display, dan Checklist Penerimaan). Menu khusus admin dilindungi dengan *403 Access Denied Guard*.
   - **Role Switcher Pill:** Beralih role kapan saja secara instan di TopBar.

3. **Modul Operasional Gudang Lengkap:**
   - **Dashboard:** KPI real-time (Incoming PO, Nilai Inventori Gudang, Stok Menipis, Mutasi Terkini), Alert Banner Hermes AI, dan Alur Cepat.
   - **Inventori Display vs Gudang Split:** Tabel/Kartu inventori dengan pemisahan transparan `STOK_DISP` (Rak Kasir) dan `STOK_GDG` (On-Hand Gudang), detail drawer produk, dan riwayat pergerakan stok.
   - **Penerimaan Barang (Stock Receiving):** Alur verifikasi surat jalan vs fisik pengiriman supplier, deteksi selisih kuantitas, approval otomatis masuk stok gudang.
   - **Transfer ke Display:** Form & modal mutasi stok dari Gudang ke Rak Display dengan validasi stok tersedia dan kalkulasi instan.
   - **Stock Opname & Pemeriksaan Fisik:** Audit fisik rak & gudang vs sistem dengan kalkulasi selisih (*variance*) real-time dan pencatatan alasan penyesuaian.
   - **Master Produk & Lifecycle:** Kelola harga beli, harga jual, margin %, status katalog (`AKTIF`, `NONAKTIF`, `DIARSIPKAN`).
   - **Purchasing & PO:** Pengadaan barang, penerbitan PO ke supplier rekanan minimarket.
   - **Hermes AI Assistant:** Decision intelligence untuk deteksi risiko stockout, akselerasi demand, dan tombol aksi langsung `[+ Buat Draft PO]`.
   - **Audit Trail:** Log kronologis seluruh mutasi barang dan ekspor CSV.

---

## 🚀 Cara Menjalankan

### 1. Instalasi Dependensi
```bash
npm install
```

### 2. Menjalankan di Mode Development
```bash
npm start
```
Aplikasi akan berjalan di: **`http://localhost:3001`**

### 3. Build untuk Produksi
```bash
npm run build
```
File bundle optimal akan dihasilkan di folder `dist/`.

### 4. Menjalankan dengan Docker & Dokploy
```bash
docker compose up -d --build
```
Aplikasi siap dideploy ke server Dokploy melalui port `3001` (atau port `80` container Nginx).