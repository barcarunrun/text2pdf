export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface Invoice {
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  from: {
    name: string;
    address: string;
    email?: string;
    phone?: string;
  };
  to: {
    name: string;
    address: string;
    email?: string;
    phone?: string;
  };
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  notes?: string;
}
