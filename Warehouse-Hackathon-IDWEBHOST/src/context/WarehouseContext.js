import React, { createContext, useContext, useState, useCallback } from 'react';

const WarehouseContext = createContext();

// Initial Mock Data aligned with PRD & Figma
const INITIAL_PRODUCTS = [
  {
    id: 'prod-1',
    name: 'Indomie Goreng Spesial 85g',
    sku: 'SKU-10023',
    ean13: '8998866200225',
    kategori: 'Makanan Instan',
    stok_disp: 120,
    stok_gdg: 480,
    total_stok: 600,
    min_stok: 150,
    status: 'NORMAL',
    harga_beli: 2800,
    harga_jual: 3500,
    margin: 20.0,
    unit: 'pcs',
    lokasi_rak: 'R-01A (Display) / G-A02 (Gudang)',
    supplier: 'PT Indofood CBP Sukses Makmur',
    avgSalesDaily: 32,
  },
  {
    id: 'prod-2',
    name: 'Aqua Air Mineral 600ml',
    sku: 'SKU-10024',
    ean13: '8998866200232',
    kategori: 'Minuman Ringan',
    stok_disp: 40,
    stok_gdg: 960,
    total_stok: 1000,
    min_stok: 200,
    status: 'NORMAL',
    harga_beli: 2200,
    harga_jual: 3000,
    margin: 26.6,
    unit: 'botol',
    lokasi_rak: 'R-03C (Chiller) / G-B01 (Gudang)',
    supplier: 'PT Tirta Investama',
    avgSalesDaily: 65,
  },
  {
    id: 'prod-3',
    name: 'Teh Botol Sosro Kotak 250ml',
    sku: 'SKU-10025',
    ean13: '8998866200249',
    kategori: 'Minuman Ringan',
    stok_disp: 15,
    stok_gdg: 18,
    total_stok: 33,
    min_stok: 50,
    status: 'STOK MENIPIS',
    harga_beli: 2500,
    harga_jual: 3200,
    margin: 21.8,
    unit: 'kotak',
    lokasi_rak: 'R-03B / G-B02',
    supplier: 'PT Sinar Sosro',
    avgSalesDaily: 14,
  },
  {
    id: 'prod-4',
    name: 'SilverQueen Chocolate Almond 62g',
    sku: 'SKU-10026',
    ean13: '8998866200256',
    kategori: 'Camilan & Cokelat',
    stok_disp: 0,
    stok_gdg: 0,
    total_stok: 0,
    min_stok: 20,
    status: 'HABIS',
    harga_beli: 12500,
    harga_jual: 15500,
    margin: 19.3,
    unit: 'pcs',
    lokasi_rak: 'R-02B / G-C01',
    supplier: 'PT Petra Foods',
    avgSalesDaily: 8,
  },
  {
    id: 'prod-5',
    name: 'Minyak Goreng Bimoli 2 Liter',
    sku: 'SKU-10027',
    ean13: '8998866200263',
    kategori: 'Bahan Pokok',
    stok_disp: 35,
    stok_gdg: 120,
    total_stok: 155,
    min_stok: 40,
    status: 'NORMAL',
    harga_beli: 34000,
    harga_jual: 38000,
    margin: 10.5,
    unit: 'pouch',
    lokasi_rak: 'R-04A / G-D01',
    supplier: 'PT Salim Ivomas Pratama',
    avgSalesDaily: 22,
  },
  {
    id: 'prod-6',
    name: 'Beras Pandan Wangi Super 5kg',
    sku: 'SKU-10028',
    ean13: '8998866200270',
    kategori: 'Bahan Pokok',
    stok_disp: 8,
    stok_gdg: 10,
    total_stok: 18,
    min_stok: 25,
    status: 'STOK MENIPIS',
    harga_beli: 75000,
    harga_jual: 85000,
    margin: 11.7,
    unit: 'karung',
    lokasi_rak: 'R-04C / G-D02',
    supplier: 'CV Sinar Pangan',
    avgSalesDaily: 6,
  },
  {
    id: 'prod-7',
    name: 'Lifebuoy Sabun Mandi Merah 110g',
    sku: 'SKU-10029',
    ean13: '8998866200287',
    kategori: 'Perawatan Pribadi',
    stok_disp: 45,
    stok_gdg: 200,
    total_stok: 245,
    min_stok: 60,
    status: 'NORMAL',
    harga_beli: 4200,
    harga_jual: 5500,
    margin: 23.6,
    unit: 'pcs',
    lokasi_rak: 'R-05A / G-E01',
    supplier: 'PT Unilever Indonesia Tbk',
    avgSalesDaily: 18,
  },
  {
    id: 'prod-8',
    name: 'Pepsodent Pencegah Gigi Berlubang 190g',
    sku: 'SKU-10030',
    ean13: '8998866200294',
    kategori: 'Perawatan Pribadi',
    stok_disp: 50,
    stok_gdg: 150,
    total_stok: 200,
    min_stok: 50,
    status: 'NORMAL',
    harga_beli: 9800,
    harga_jual: 12500,
    margin: 21.6,
    unit: 'pcs',
    lokasi_rak: 'R-05B / G-E02',
    supplier: 'PT Unilever Indonesia Tbk',
    avgSalesDaily: 15,
  },
  {
    id: 'prod-9',
    name: 'Chitato Sapi Panggang 68g',
    sku: 'SKU-10031',
    ean13: '8998866200300',
    kategori: 'Camilan & Cokelat',
    stok_disp: 12,
    stok_gdg: 24,
    total_stok: 36,
    min_stok: 40,
    status: 'STOK MENIPIS',
    harga_beli: 8900,
    harga_jual: 11500,
    margin: 22.6,
    unit: 'bungkus',
    lokasi_rak: 'R-02A / G-C02',
    supplier: 'PT Indofood CBP Sukses Makmur',
    avgSalesDaily: 12,
  },
  {
    id: 'prod-10',
    name: 'Kopi ABC Susu Renceng (10x25g)',
    sku: 'SKU-10032',
    ean13: '8998866200317',
    kategori: 'Minuman Ringan',
    stok_disp: 25,
    stok_gdg: 100,
    total_stok: 125,
    min_stok: 30,
    status: 'NORMAL',
    harga_beli: 11200,
    harga_jual: 13500,
    margin: 17.0,
    unit: 'renceng',
    lokasi_rak: 'R-03A / G-B03',
    supplier: 'PT Santos Jaya Abadi',
    avgSalesDaily: 10,
  },
];

const INITIAL_MOVEMENTS = [
  {
    id: 'mov-1',
    productId: 'prod-1',
    productName: 'Indomie Goreng Spesial 85g',
    type: 'MASUK',
    qty: 240,
    ref: 'PO-2026-089',
    date: 'Hari ini, 14:20',
    user: 'Budi Santoso',
    notes: 'Penerimaan PO reguler dari Indofood',
  },
  {
    id: 'mov-2',
    productId: 'prod-1',
    productName: 'Indomie Goreng Spesial 85g',
    type: 'TRANSFER',
    qty: 48,
    ref: 'TR-DISP-054',
    date: 'Hari ini, 10:15',
    user: 'Ani Wijaya',
    notes: 'Restock rak display depan kasir',
  },
  {
    id: 'mov-3',
    productId: 'prod-5',
    productName: 'Minyak Goreng Bimoli 2 Liter',
    type: 'TRANSFER',
    qty: 24,
    ref: 'TR-DISP-053',
    date: 'Kemarin, 16:30',
    user: 'Budi Santoso',
    notes: 'Pengisian rak sembako',
  },
  {
    id: 'mov-4',
    productId: 'prod-2',
    productName: 'Aqua Air Mineral 600ml',
    type: 'MASUK',
    qty: 480,
    ref: 'PO-2026-088',
    date: 'Kemarin, 09:15',
    user: 'Budi Santoso',
    notes: 'Restock air mineral chiller',
  },
  {
    id: 'mov-5',
    productId: 'prod-4',
    productName: 'SilverQueen Chocolate Almond 62g',
    type: 'KELUAR',
    qty: 12,
    ref: 'ADJ-2026-012',
    date: '2 hari lalu',
    user: 'Budi Santoso',
    notes: 'Retur barang kemasan rusak',
  },
  {
    id: 'mov-6',
    productId: 'prod-6',
    productName: 'Beras Pandan Wangi Super 5kg',
    type: 'ADJUSTMENT',
    qty: -2,
    ref: 'OPN-2026-004',
    date: '3 hari lalu',
    user: 'Ani Wijaya',
    notes: 'Stock opname selisih fisik',
  },
];

const INITIAL_SHIPMENTS = [
  {
    id: 'ship-1',
    poNumber: 'PO-2026-092',
    supplier: 'PT Indofood CBP Sukses Makmur',
    date: '13 Sep 2026',
    estimatedArrival: 'Hari ini (15:00)',
    status: 'PENDING',
    driverName: 'Eko Prasetyo (B 9182 KDA)',
    items: [
      {
        productId: 'prod-1',
        name: 'Indomie Goreng Spesial 85g',
        sku: 'SKU-10023',
        expectedQty: 240,
        receivedQty: 240,
        unit: 'pcs',
        verified: false,
      },
      {
        productId: 'prod-9',
        name: 'Chitato Sapi Panggang 68g',
        sku: 'SKU-10031',
        expectedQty: 120,
        receivedQty: 120,
        unit: 'bungkus',
        verified: false,
      },
    ],
  },
  {
    id: 'ship-2',
    poNumber: 'PO-2026-091',
    supplier: 'PT Unilever Indonesia Tbk',
    date: '12 Sep 2026',
    estimatedArrival: 'Tiba Kemarin',
    status: 'APPROVED',
    driverName: 'Agus Santika (B 8231 TX)',
    items: [
      {
        productId: 'prod-7',
        name: 'Lifebuoy Sabun Mandi Merah 110g',
        sku: 'SKU-10029',
        expectedQty: 120,
        receivedQty: 120,
        unit: 'pcs',
        verified: true,
      },
      {
        productId: 'prod-8',
        name: 'Pepsodent Gigi Berlubang 190g',
        sku: 'SKU-10030',
        expectedQty: 80,
        receivedQty: 80,
        unit: 'pcs',
        verified: true,
      },
    ],
  },
  {
    id: 'ship-3',
    poNumber: 'PO-2026-090',
    supplier: 'PT Petra Foods (SilverQueen)',
    date: '11 Sep 2026',
    estimatedArrival: '11 Sep 2026',
    status: 'CORRECTION_REQUESTED',
    driverName: 'Surya Dharma (D 1102 AB)',
    items: [
      {
        productId: 'prod-4',
        name: 'SilverQueen Chocolate Almond 62g',
        sku: 'SKU-10026',
        expectedQty: 100,
        receivedQty: 75,
        unit: 'pcs',
        verified: true,
        discrepancyNote: 'Fisik barang kurang 25 pcs dari surat jalan',
      },
    ],
  },
];

const INITIAL_PURCHASE_ORDERS = [
  {
    id: 'po-1',
    poNumber: 'PO-2026-093',
    supplier: 'PT Salim Ivomas Pratama',
    category: 'Bahan Pokok (Minyak Goreng)',
    orderDate: '13 Sep 2026',
    deliveryDate: '15 Sep 2026',
    totalItems: 120,
    totalCost: 4080000,
    status: 'SUBMITTED',
    items: [{ name: 'Minyak Goreng Bimoli 2 Liter', qty: 120, price: 34000 }],
  },
  {
    id: 'po-2',
    poNumber: 'PO-2026-092',
    supplier: 'PT Indofood CBP Sukses Makmur',
    category: 'Makanan Instan & Camilan',
    orderDate: '12 Sep 2026',
    deliveryDate: '13 Sep 2026',
    totalItems: 360,
    totalCost: 1740000,
    status: 'IN_TRANSIT',
    items: [
      { name: 'Indomie Goreng Spesial 85g', qty: 240, price: 2800 },
      { name: 'Chitato Sapi Panggang 68g', qty: 120, price: 8900 },
    ],
  },
  {
    id: 'po-3',
    poNumber: 'PO-2026-089',
    supplier: 'CV Sinar Pangan',
    category: 'Beras & Gula',
    orderDate: '10 Sep 2026',
    deliveryDate: '12 Sep 2026',
    totalItems: 50,
    totalCost: 3750000,
    status: 'RECEIVED',
    items: [{ name: 'Beras Pandan Wangi Super 5kg', qty: 50, price: 75000 }],
  },
];

const DEMO_USERS = {
  'EMP-001': {
    id: 'EMP-001',
    pin: '1234',
    name: 'Budi Santoso',
    role: 'WAREHOUSE_ADMIN',
    avatar: 'BS',
    area: 'Pusat Distribusi (Admin)',
    position: 'Kepala Gudang',
  },
  'EMP-002': {
    id: 'EMP-002',
    pin: '5678',
    name: 'Ani Wijaya',
    role: 'WAREHOUSE_STAFF',
    avatar: 'AW',
    area: 'Gudang Utama (G-01)',
    position: 'Staff Operasional',
  },
  'EMP-003': {
    id: 'EMP-003',
    pin: '1122',
    name: 'Hendra Kusuma',
    role: 'WAREHOUSE_STAFF',
    avatar: 'HK',
    area: 'Loading Dock & Chiller',
    position: 'Staff Operasional',
  },
};

const INITIAL_STAFF_TASKS = [
  {
    id: 'task-1',
    title: 'Restock Rak Display Minuman',
    category: 'TRANSFER',
    priority: 'URGENT',
    location: 'G-B01 ➔ R-03C',
    productName: 'Aqua Air Mineral 600ml',
    qty: '48 botol',
    status: 'PENDING',
    assignedTo: null,
    time: '10:30',
    desc: 'Stok rak display chiller di bawah 40 botol. Pindahkan 48 botol dari gudang.',
  },
  {
    id: 'task-2',
    title: 'Audit Fisik Selisih Beras Pandan Wangi',
    category: 'OPNAME',
    priority: 'NORMAL',
    location: 'G-D02 / R-04C',
    productName: 'Beras Pandan Wangi Super 5kg',
    qty: 'Audit 18 karung',
    status: 'PENDING',
    assignedTo: null,
    time: '11:00',
    desc: 'Terdapat catatan selisih 2 karung dari stock opname berkala.',
  },
  {
    id: 'task-3',
    title: 'Verifikasi Fisik Kedatangan Indomie',
    category: 'RECEIVING',
    priority: 'URGENT',
    location: 'Loading Dock B',
    productName: 'Indomie Goreng Spesial (PO-2026-092)',
    qty: '240 pcs',
    status: 'IN_PROGRESS',
    assignedTo: 'Ani Wijaya',
    time: '14:00',
    desc: 'Cek fisik kardus dan barcode kedatangan armada Indofood.',
  },
  {
    id: 'task-4',
    title: 'Pengisian Rak Cokelat SilverQueen',
    category: 'RESTOCK',
    priority: 'NORMAL',
    location: 'G-C01 ➔ R-02B',
    productName: 'SilverQueen Chocolate Almond 62g',
    qty: '24 pcs',
    status: 'DONE',
    assignedTo: 'Ani Wijaya',
    time: '09:15',
    desc: 'Restock rak depan display kasir berhasil diselesaikan.',
  },
];

const INITIAL_STAFF_ACTIVITY = [
  { id: 'act-1', type: 'CLOCK', action: 'Clock In Shift Pagi (08:00 WIB)', time: '08:00' },
  { id: 'act-2', type: 'TRANSFER', action: 'Restock 24 pcs SilverQueen ke Rak R-02B', time: '09:15' },
  { id: 'act-3', type: 'COUNTING', action: 'Scan Barcode Aqua 600ml (EAN: 8998866200232)', time: '10:05' },
  { id: 'act-4', type: 'RECEIVING', action: 'Mulai verifikasi PO Indofood di Loading Dock', time: '14:00' },
];

export const WarehouseProvider = ({ children }) => {
  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Roles: 'WAREHOUSE_ADMIN' (Lead/Admin) or 'WAREHOUSE_STAFF' (Field Staff)
  const [userRole, setUserRole] = useState('WAREHOUSE_ADMIN');
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [movements, setMovements] = useState(INITIAL_MOVEMENTS);
  const [shipments, setShipments] = useState(INITIAL_SHIPMENTS);
  const [purchaseOrders, setPurchaseOrders] = useState(INITIAL_PURCHASE_ORDERS);

  // Toast Notification
  const [toast, setToast] = useState({ visible: false, message: '', type: 'info' });

  const showToast = useCallback((message, type = 'success') => {
    setToast({ visible: true, message, type });
    setTimeout(() => {
      setToast({ visible: false, message: '', type: 'info' });
    }, 3500);
  }, []);

  // Staff State
  const [staffTasks, setStaffTasks] = useState(INITIAL_STAFF_TASKS);
  const [staffActivityLog, setStaffActivityLog] = useState(INITIAL_STAFF_ACTIVITY);
  const [shiftInfo, setShiftInfo] = useState({
    isClockedIn: false,
    clockInTime: null,
    clockOutTime: null,
    totalHours: '0',
  });
  const [scanHistory, setScanHistory] = useState([
    { id: 'scan-1', sku: 'SKU-10024', name: 'Aqua Air Mineral 600ml', time: '10:05', ean13: '8998866200232' },
    { id: 'scan-2', sku: 'SKU-10023', name: 'Indomie Goreng Spesial 85g', time: '09:40', ean13: '8998866200225' },
  ]);

  // Auth Handlers
  const handleLogin = useCallback((empId, pinInput) => {
    const user = DEMO_USERS[empId];
    if (user && user.pin === pinInput) {
      setIsAuthenticated(true);
      setCurrentUser(user);
      setUserRole(user.role);
      showToast(`Selamat datang, ${user.name}!`, 'success');
      return { success: true };
    }
    return { success: false, error: 'Employee ID atau PIN salah' };
  }, []);

  const handleLogout = useCallback(() => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    showToast('Anda telah keluar dari sistem', 'info');
  }, []);

  // Staff Shift Handlers
  const handleClockIn = useCallback(() => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    setShiftInfo({
      isClockedIn: true,
      clockInTime: now.toISOString(),
      clockOutTime: null,
      totalHours: '0',
    });
    setStaffActivityLog((prev) => [
      { id: `act-${Date.now()}`, type: 'CLOCK', action: `Clock In Shift (${timeStr} WIB)`, time: timeStr },
      ...prev,
    ]);
    showToast('Clock In berhasil! Selamat bertugas.', 'success');
  }, []);

  const handleClockOut = useCallback(() => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    setShiftInfo((prev) => ({
      ...prev,
      isClockedIn: false,
      clockOutTime: now.toISOString(),
    }));
    setStaffActivityLog((prev) => [
      { id: `act-${Date.now()}`, type: 'CLOCK', action: `Clock Out Shift (${timeStr} WIB)`, time: timeStr },
      ...prev,
    ]);
    showToast('Clock Out berhasil! Terima kasih atas kerja keras Anda hari ini.', 'info');
  }, []);

  // Staff Task Handlers
  const handleClaimTask = useCallback((taskId) => {
    const timeStr = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    let claimedTask = null;
    setStaffTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          claimedTask = t;
          return { ...t, status: 'IN_PROGRESS', assignedTo: currentUser?.name || 'Ani Wijaya' };
        }
        return t;
      })
    );
    if (claimedTask) {
      setStaffActivityLog((prev) => [
        { id: `act-${Date.now()}`, type: claimedTask.category || 'TRANSFER', action: `Mengambil tugas: ${claimedTask.title}`, time: timeStr },
        ...prev,
      ]);
      showToast(`Tugas "${claimedTask.title}" berhasil diambil`, 'info');
    }
  }, [currentUser]);

  const handleCompleteTask = useCallback((taskId) => {
    const timeStr = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    let completedTask = null;
    setStaffTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          completedTask = t;
          return { ...t, status: 'DONE' };
        }
        return t;
      })
    );
    if (completedTask) {
      setStaffActivityLog((prev) => [
        { id: `act-${Date.now()}`, type: completedTask.category || 'TRANSFER', action: `Menyelesaikan tugas: ${completedTask.title}`, time: timeStr },
        ...prev,
      ]);
      showToast(`Tugas "${completedTask.title}" selesai! Kerja bagus 🎉`, 'success');
    }
  }, []);

  // Scan History Handler
  const handleAddScanHistory = useCallback((product) => {
    const timeStr = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    const newEntry = {
      id: `scan-${Date.now()}`,
      sku: product.sku,
      name: product.name,
      ean13: product.ean13,
      time: timeStr,
    };
    setScanHistory((prev) => [newEntry, ...prev.slice(0, 19)]);
    setStaffActivityLog((prev) => [
      { id: `act-${Date.now()}`, type: 'COUNTING', action: `Scan Barcode: ${product.name} (${product.sku})`, time: timeStr },
      ...prev,
    ]);
  }, []);

  // Modals & Drawers
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [isReceivingModalOpen, setIsReceivingModalOpen] = useState(false);
  const [isOpnameModalOpen, setIsOpnameModalOpen] = useState(false);
  const [isScannerModalOpen, setIsScannerModalOpen] = useState(false);
  const [isCreatePoModalOpen, setIsCreatePoModalOpen] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState(null);

  // Action: Transfer Stock from Gudang to Display
  const handleTransferStock = useCallback(
    ({ productId, qty, notes }) => {
      const parsedQty = parseInt(qty, 10);
      if (isNaN(parsedQty) || parsedQty <= 0) {
        showToast('Jumlah transfer tidak valid', 'danger');
        return false;
      }

      let updatedProd = null;
      setProducts((prev) =>
        prev.map((p) => {
          if (p.id === productId) {
            if (p.stok_gdg < parsedQty) {
              showToast(`Stok gudang tidak cukup! (Tersedia: ${p.stok_gdg})`, 'danger');
              updatedProd = false;
              return p;
            }
            const newDisp = p.stok_disp + parsedQty;
            const newGdg = p.stok_gdg - parsedQty;
            const total = newDisp + newGdg;
            const status =
              total === 0 ? 'HABIS' : total < p.min_stok ? 'STOK MENIPIS' : 'NORMAL';

            updatedProd = {
              ...p,
              stok_disp: newDisp,
              stok_gdg: newGdg,
              total_stok: total,
              status,
            };
            return updatedProd;
          }
          return p;
        })
      );

      if (updatedProd === false) return false;

      // Log movement
      const targetProd = products.find((p) => p.id === productId);
      const newMovement = {
        id: `mov-${Date.now()}`,
        productId,
        productName: targetProd ? targetProd.name : 'Produk',
        type: 'TRANSFER',
        qty: parsedQty,
        ref: `TR-DISP-${Math.floor(100 + Math.random() * 900)}`,
        date: 'Baru saja',
        user: userRole === 'WAREHOUSE_ADMIN' ? 'Budi Santoso' : 'Ani Wijaya',
        notes: notes || 'Transfer otomatis Gudang ke Display',
      };

      setMovements((prev) => [newMovement, ...prev]);
      showToast(
        `Sukses transfer ${parsedQty} pcs ke Display (${targetProd?.name})`,
        'success'
      );
      setIsTransferModalOpen(false);
      return true;
    },
    [products, userRole, showToast]
  );

  // Action: Confirm Stock Receiving from Supplier
  const handleReceiveStock = useCallback(
    (shipmentId, verifiedItems, status = 'APPROVED') => {
      setShipments((prev) =>
        prev.map((s) => (s.id === shipmentId ? { ...s, status, items: verifiedItems } : s))
      );

      if (status === 'APPROVED') {
        // Increase stok_gdg for approved items
        verifiedItems.forEach((item) => {
          setProducts((prev) =>
            prev.map((p) => {
              if (p.sku === item.sku || p.id === item.productId) {
                const newGdg = p.stok_gdg + parseInt(item.receivedQty, 10);
                const total = p.stok_disp + newGdg;
                return {
                  ...p,
                  stok_gdg: newGdg,
                  total_stok: total,
                  status:
                    total === 0 ? 'HABIS' : total < p.min_stok ? 'STOK MENIPIS' : 'NORMAL',
                };
              }
              return p;
            })
          );

          // Log movement MASUK
          setMovements((prev) => [
            {
              id: `mov-${Date.now()}-${item.sku}`,
              productId: item.productId,
              productName: item.name,
              type: 'MASUK',
              qty: parseInt(item.receivedQty, 10),
              ref: `PO-REC-${shipmentId.toUpperCase()}`,
              date: 'Baru saja',
              user: userRole === 'WAREHOUSE_ADMIN' ? 'Budi Santoso' : 'Ani Wijaya',
              notes: 'Barang diterima dan diverifikasi di gudang',
            },
            ...prev,
          ]);
        });

        showToast('Penerimaan barang berhasil disetujui & stok diperbarui!', 'success');
      } else if (status === 'CORRECTION_REQUESTED') {
        showToast('Permintaan koreksi barang telah dikirim ke Supplier', 'warning');
      } else {
        showToast('Pengiriman barang telah ditolak', 'danger');
      }

      setIsReceivingModalOpen(false);
    },
    [userRole, showToast]
  );

  // Action: Stock Opname Adjustment
  const handleStockOpname = useCallback(
    ({ productId, physicalDisp, physicalGdg, reason, notes }) => {
      const targetProd = products.find((p) => p.id === productId);
      if (!targetProd) return;

      const pDisp = parseInt(physicalDisp, 10);
      const pGdg = parseInt(physicalGdg, 10);
      const newTotal = pDisp + pGdg;
      const delta = newTotal - targetProd.total_stok;

      setProducts((prev) =>
        prev.map((p) => {
          if (p.id === productId) {
            return {
              ...p,
              stok_disp: pDisp,
              stok_gdg: pGdg,
              total_stok: newTotal,
              status:
                newTotal === 0 ? 'HABIS' : newTotal < p.min_stok ? 'STOK MENIPIS' : 'NORMAL',
            };
          }
          return p;
        })
      );

      // Log movement ADJUSTMENT
      setMovements((prev) => [
        {
          id: `mov-${Date.now()}`,
          productId,
          productName: targetProd.name,
          type: 'ADJUSTMENT',
          qty: delta,
          ref: `OPN-${Math.floor(1000 + Math.random() * 9000)}`,
          date: 'Baru saja',
          user: userRole === 'WAREHOUSE_ADMIN' ? 'Budi Santoso' : 'Ani Wijaya',
          notes: `Stock Opname (${reason}): ${notes || 'Penyesuaian fisik'}`,
        },
        ...prev,
      ]);

      showToast(
        `Hasil Opname disimpan: Selisih ${delta >= 0 ? '+' : ''}${delta} pcs (${targetProd.name})`,
        delta === 0 ? 'success' : 'warning'
      );
      setIsOpnameModalOpen(false);
    },
    [products, userRole, showToast]
  );

  // Action: Update Product Price & Lifecycle Status
  const handleUpdateProduct = useCallback(
    (productId, { harga_jual, status, reason }) => {
      setProducts((prev) =>
        prev.map((p) => {
          if (p.id === productId) {
            const newSell = harga_jual !== undefined ? parseInt(harga_jual, 10) : p.harga_jual;
            const newMargin = (((newSell - p.harga_beli) / newSell) * 100).toFixed(1);
            return {
              ...p,
              harga_jual: newSell,
              margin: parseFloat(newMargin),
              status: status || p.status,
            };
          }
          return p;
        })
      );
      showToast('Perubahan produk dan status katalog berhasil disimpan', 'success');
    },
    [showToast]
  );

  // Action: Create Draft PO (from Hermes AI or manual)
  const handleCreatePo = useCallback(
    ({ supplier, category, items, totalCost }) => {
      const newPo = {
        id: `po-${Date.now()}`,
        poNumber: `PO-2026-0${Math.floor(94 + Math.random() * 50)}`,
        supplier,
        category,
        orderDate: 'Hari ini',
        deliveryDate: '2 hari lagi',
        totalItems: items.reduce((acc, i) => acc + (parseInt(i.qty, 10) || 0), 0),
        totalCost: totalCost || items.reduce((acc, i) => acc + (i.price * i.qty), 0),
        status: 'DRAFT',
        items,
      };

      setPurchaseOrders((prev) => [newPo, ...prev]);
      showToast(`Draft Purchase Order (${newPo.poNumber}) berhasil dibuat!`, 'success');
      setIsCreatePoModalOpen(false);
    },
    [showToast]
  );

  return (
    <WarehouseContext.Provider
      value={{
        // Auth
        isAuthenticated,
        currentUser,
        handleLogin,
        handleLogout,
        // Role
        userRole,
        setUserRole,
        // Data
        products,
        movements,
        shipments,
        purchaseOrders,
        // Staff
        staffTasks,
        staffActivityLog,
        shiftInfo,
        scanHistory,
        handleClockIn,
        handleClockOut,
        handleClaimTask,
        handleCompleteTask,
        handleAddScanHistory,
        // UI State
        selectedProduct,
        setSelectedProduct,
        isDetailDrawerOpen,
        setIsDetailDrawerOpen,
        isTransferModalOpen,
        setIsTransferModalOpen,
        isReceivingModalOpen,
        setIsReceivingModalOpen,
        isOpnameModalOpen,
        setIsOpnameModalOpen,
        isScannerModalOpen,
        setIsScannerModalOpen,
        isCreatePoModalOpen,
        setIsCreatePoModalOpen,
        selectedShipment,
        setSelectedShipment,
        toast,
        showToast,
        // Actions
        handleTransferStock,
        handleReceiveStock,
        handleStockOpname,
        handleUpdateProduct,
        handleCreatePo,
      }}
    >
      {children}
    </WarehouseContext.Provider>
  );
};

export const useWarehouse = () => {
  const context = useContext(WarehouseContext);
  if (!context) {
    throw new Error('useWarehouse must be used within a WarehouseProvider');
  }
  return context;
};
