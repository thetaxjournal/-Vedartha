
import { Branch, Client } from './types';

export const COMPANY_NAME = "Vedartha International Limited";
// The user explicitly provided this URL for invoices and receipts (White version intended for document processing)
export const COMPANY_LOGO = "https://res.cloudinary.com/dtgufvwb5/image/upload/v1765442492/White_Vedartha_Global_Consultancy_LOGO_2_re1hew.png";
// Logo used for UI elements with light/colored backgrounds (like sidebar/dashboard)
export const LOGO_DARK_BG = "https://res.cloudinary.com/dtgufvwb5/image/upload/v1765436446/Vedartha_Global_Consultancy_LOGO-removebg-preview_xt90yx.png";

export const HSN_MASTER = [
  { code: '998311', description: 'MANAGEMENT CONSULTING AND MANAGEMENT SERVICES' },
  { code: '998312', description: 'BUSINESS CONSULTING SERVICES' },
  { code: '998313', description: 'STRATEGIC MANAGEMENT SERVICES' },
  { code: '998314', description: 'FINANCIAL MANAGEMENT CONSULTING' },
  { code: '998713', description: 'IT INFRASTRUCTURE MANAGEMENT' },
  { code: '998319', description: 'OTHER MANAGEMENT CONSULTANCY' },
];

export const INITIAL_BRANCHES: Branch[] = [
  {
    id: 'B001',
    name: 'Vedartha International - Bengaluru HQ',
    address: {
      line1: '13th to 22nd Floor, Ward no.77',
      line2: 'Prestige Trade Tower, Municipal No.46, Palace Road',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560001',
      country: 'India'
    },
    contact: '+91 80 61886000',
    email: 'info@vedartha.com',
    gstin: '29AALFD7157J1ZV',
    pan: 'AALFD7157J',
    defaultTaxRate: 18,
    invoicePrefix: 'VED-BLR-',
    nextInvoiceNumber: 2075060834
  }
];

export const INITIAL_CLIENTS: Client[] = [];

export const APP_CONFIG = {
  currency: 'INR',
  currencySymbol: '₹',
  dateFormat: 'DD-MMM-YYYY',
  bankDetails: {
    bankName: 'RBL BANK LTD',
    address: 'Tower 2, 3rd Floor, One Indiabulls Centre, Senapati Bapat Marg, Lower Parel, Mumbai - 400 013.',
    accountNumber: '409000032439',
    ifscCode: 'RATN0000088'
  }
};
