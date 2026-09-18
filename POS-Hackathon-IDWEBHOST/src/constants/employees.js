// AURA SMART POS - Employee & Backend User Accounts
// Integrated with backend http://192.168.1.8:8000/api/v1/auth/login

export const EMPLOYEES = [
  {
    id: 'chasier@aura.pos',
    email: 'chasier@aura.pos',
    backendUsername: 'cashier@aura.pos',
    name: 'Andi Kasir',
    password: 'chasier123',
    pin: 'chasier123',
    role: 'CASHIER',
    roleLabel: 'Kasir Toko',
    shift: 'Shift-01',
    shiftLabel: 'Shift Pagi',
    shiftTime: '08:00 - 16:00',
    avatarColor: '#0284C7',
    badge: 'KASIR PAGI',
  },
  {
    id: 'cashier@aura.pos',
    email: 'cashier@aura.pos',
    backendUsername: 'cashier@aura.pos',
    name: 'Siti Rahma',
    password: 'cashier123',
    pin: 'cashier123',
    role: 'CASHIER',
    roleLabel: 'Kasir Toko',
    shift: 'Shift-02',
    shiftLabel: 'Shift Siang',
    shiftTime: '13:00 - 21:00',
    avatarColor: '#10B981',
    badge: 'KASIR SIANG',
  },
];

export const STORE_INFO = {
  name: 'Toko Belitung 01',
  storeCode: 'BLT-01',
  terminalId: 'POS-01',
  systemVersion: 'Windows Client v2.0.0 (API Connected)',
  backendUrl: 'http://192.168.1.8:8000/api/v1',
};

export default EMPLOYEES;
