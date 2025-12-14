import Link from 'next/link';
import { promises as fs } from 'fs';
import path from 'path';

interface InvoiceSummary {
  id: string;
  invoiceNumber: string;
  invoiceDate: string;
  clientName: string;
  total: number;
}

async function getInvoices(): Promise<InvoiceSummary[]> {
  try {
    const filePath = path.join(process.cwd(), 'public', 'invoices', 'index.json');
    const fileContents = await fs.readFile(filePath, 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    return [];
  }
}

export default async function Home() {
  const invoices = await getInvoices();

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-black mb-8">請求書一覧</h1>
        
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-black font-semibold">請求書番号</th>
                <th className="px-6 py-3 text-left text-black font-semibold">発行日</th>
                <th className="px-6 py-3 text-left text-black font-semibold">顧客名</th>
                <th className="px-6 py-3 text-right text-black font-semibold">金額</th>
                <th className="px-6 py-3 text-center text-black font-semibold">操作</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <tr key={invoice.id} className="border-t border-gray-200 hover:bg-gray-50">
                  <td className="px-6 py-4 text-black">{invoice.invoiceNumber}</td>
                  <td className="px-6 py-4 text-black">{invoice.invoiceDate}</td>
                  <td className="px-6 py-4 text-black">{invoice.clientName}</td>
                  <td className="px-6 py-4 text-right text-black">
                    ¥{invoice.total.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Link
                      href={`/invoices/${invoice.id}`}
                      className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
                    >
                      詳細を見る
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

