import InvoiceDisplay from '@/components/InvoiceDisplay';
import { Invoice } from '@/types/invoice';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { promises as fs } from 'fs';
import path from 'path';

async function getInvoice(id: string): Promise<Invoice | null> {
  try {
    const filePath = path.join(process.cwd(), 'public', 'invoices', `${id}.json`);
    const fileContents = await fs.readFile(filePath, 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    return null;
  }
}

export default async function InvoicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const invoice = await getInvoice(id);

  if (!invoice) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4 mb-4">
        <Link
          href="/"
          className="inline-block bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded transition-colors"
        >
          ← 一覧に戻る
        </Link>
      </div>
      <InvoiceDisplay invoice={invoice} />
    </div>
  );
}
