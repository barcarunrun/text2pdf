'use client';

import React from 'react';
import { Invoice } from '@/types/invoice';
import { useReactToPrint } from 'react-to-print';

interface InvoiceDisplayProps {
  invoice: Invoice;
}

const BLUE = '#3f6a95';      // 見本に近い青
const BLUE_DARK = '#2f537a'; // 罫線/濃い青
const ROW_ALT = '#dfeaf6';   // 交互行の薄い水色

export default function InvoiceDisplay({ invoice }: InvoiceDisplayProps) {
  const invoiceRef = React.useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: invoiceRef,
    documentTitle: invoice.invoiceNumber,
  });

  const maxRows = 10; // 見本の「空行で埋める」用（必要なら調整）
  const rows = invoice.items ?? [];
  const blankCount = Math.max(0, maxRows - rows.length);

  const yen = (n: number) => `¥${(n ?? 0).toLocaleString()}`;

  // 追加フィールドが型に無い場合でも落ちないように（必要ならInvoice型に追加してください）
  const fromAny = invoice.from as any;
  const registrationNumber: string | undefined = fromAny?.registrationNumber;
  const contactName: string | undefined = fromAny?.contactName;

  return (
    <>
      {/* 画面のみ */}
      <div className="mx-auto w-[210mm] px-4 mb-4 no-print">
        <button
          onClick={handlePrint}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors shadow-md"
        >
          📄 PDFで出力
        </button>
      </div>

      {/* A4 */}
      <div
        ref={invoiceRef}
        data-invoice
        className="mx-auto w-[210mm] bg-white text-black print:min-h-0"
        style={{
          padding: '8mm',
          fontFamily:
            '"Noto Sans JP", "Hiragino Kaku Gothic ProN", "Yu Gothic", system-ui, -apple-system, sans-serif',
        }}
      >
        {/* 外枠（見本は薄い枠） */}
        <div className="w-full h-full" style={{ border: `1px solid ${BLUE_DARK}` }}>
          {/* 青帯ヘッダー */}
          <div
            className="flex items-center justify-center"
            style={{
              height: '14mm',
              background: BLUE,
              color: 'white',
              fontSize: '20px',
              fontWeight: 700,
              letterSpacing: '0.35em',
            }}
          >
            御　請　求　書
          </div>

          <div style={{ padding: '5mm' }}>
            {/* 日付（右上） */}
            <div className="text-right" style={{ fontSize: '14px', fontWeight: 600 }}>
              {invoice.invoiceDate}
            </div>

            {/* 宛先 + 請求元 */}
            <div className="grid grid-cols-2 gap-6 mt-3">
              {/* 左：宛先 */}
              <div style={{ fontSize: '16px', lineHeight: 1.5 }}>
                <div style={{ fontWeight: 700 }}>
                  {invoice.to.name} 御中
                </div>
                <div className="whitespace-pre-line" style={{ marginTop: '4mm', fontWeight: 600 }}>
                  {invoice.to.address}
                </div>
              </div>

              {/* 右：請求元（郵便番号→住所→登録番号/担当者） */}
              <div style={{ fontSize: '14px', lineHeight: 1.55 }}>
                <div className="whitespace-pre-line" style={{ fontWeight: 600 }}>
                  {invoice.from.address}
                </div>
                <div style={{ marginTop: '4mm' }}>
                  {registrationNumber ? (
                    <div style={{ fontWeight: 600 }}>登録番号:{registrationNumber}</div>
                  ) : null}
                  {contactName ? (
                    <div style={{ fontWeight: 600 }}>担当者：{contactName}</div>
                  ) : null}
                </div>
              </div>
            </div>

            {/* 文言 */}
            <div style={{ marginTop: '3mm', fontSize: '14px', fontWeight: 600 }}>
              下記の通りお請求申し上げます。
            </div>

            {/* 合計金額バー（左：青ラベル / 右：白枠） */}
            <div className="flex items-stretch mt-1" style={{ width: '90mm' }}>
              <div
                className="flex items-center justify-center"
                style={{
                  width: '30mm',
                  background: BLUE,
                  color: 'white',
                  fontWeight: 800,
                  border: `2px solid ${BLUE_DARK}`,
                  borderRight: 'none',
                  fontSize: '18px',
                }}
              >
                合計金額
              </div>
              <div
                className="flex items-center justify-end"
                style={{
                  width: '60mm',
                  border: `2px solid ${BLUE_DARK}`,
                  paddingRight: '6mm',
                  fontWeight: 800,
                  fontSize: '20px',
                  color: BLUE_DARK,
                }}
              >
                {yen(invoice.total).replace('¥', '¥')}
              </div>
            </div>

            {/* 明細テーブル */}
            <div style={{ marginTop: '5mm' }}>
              <table
                className="w-full border-collapse"
                style={{
                  tableLayout: 'fixed',
                  border: `2px solid ${BLUE_DARK}`,
                  fontSize: '14px',
                }}
              >
                <colgroup>
                  <col style={{ width: '58%' }} />
                  <col style={{ width: '14%' }} />
                  <col style={{ width: '14%' }} />
                  <col style={{ width: '14%' }} />
                </colgroup>

                <thead>
                  <tr style={{ background: BLUE, color: 'white' }}>
                    <th className="py-2" style={{ borderRight: `2px solid ${BLUE_DARK}`, letterSpacing: '0.35em' }}>
                      品　　名
                    </th>
                    <th className="py-2" style={{ borderRight: `2px solid ${BLUE_DARK}` }}>
                      単　価
                    </th>
                    <th className="py-2" style={{ borderRight: `2px solid ${BLUE_DARK}` }}>
                      数　量
                    </th>
                    <th className="py-2">
                      金　額
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {rows.map((item, idx) => (
                    <tr
                      key={idx}
                      style={{
                        background: idx % 2 === 0 ? ROW_ALT : 'white',
                        borderTop: `1px solid ${BLUE_DARK}`,
                      }}
                    >
                      <td style={{ padding: '6px 8px', borderRight: `1px solid ${BLUE_DARK}` }}>
                        {item.description}
                      </td>
                      <td style={{ padding: '6px 8px', textAlign: 'right', borderRight: `1px solid ${BLUE_DARK}` }}>
                        {yen(item.unitPrice)}
                      </td>
                      <td style={{ padding: '6px 8px', textAlign: 'center', borderRight: `1px solid ${BLUE_DARK}` }}>
                        {item.quantity}
                      </td>
                      <td style={{ padding: '6px 8px', textAlign: 'right' }}>
                        {yen(item.amount)}
                      </td>
                    </tr>
                  ))}

                  {/* 空行で高さを合わせる */}
                  {Array.from({ length: blankCount }).map((_, i) => {
                    const rowIndex = rows.length + i;
                    return (
                      <tr
                        key={`blank-${i}`}
                        style={{
                          background: rowIndex % 2 === 0 ? ROW_ALT : 'white',
                          borderTop: `1px solid ${BLUE_DARK}`,
                          height: '26px',
                        }}
                      >
                        <td style={{ padding: '6px 8px', borderRight: `1px solid ${BLUE_DARK}` }}>&nbsp;</td>
                        <td style={{ padding: '6px 8px', borderRight: `1px solid ${BLUE_DARK}` }}>&nbsp;</td>
                        <td style={{ padding: '6px 8px', borderRight: `1px solid ${BLUE_DARK}` }}>&nbsp;</td>
                        <td style={{ padding: '6px 8px' }}>&nbsp;</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* 右下：小計/税/合計ボックス */}
              <div className="flex justify-end" style={{ marginTop: '-2px' }}>
                <table
                  className="border-collapse"
                  style={{
                    width: '78mm',
                    border: `2px solid ${BLUE_DARK}`,
                    fontSize: '14px',
                  }}
                >
                  <tbody>
                    <tr>
                      <td
                        style={{
                          width: '30mm',
                          background: BLUE,
                          color: 'white',
                          fontWeight: 700,
                          textAlign: 'center',
                          padding: '8px 6px',
                          borderRight: `2px solid ${BLUE_DARK}`,
                        }}
                      >
                        小　計
                      </td>
                      <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 700 }}>
                        {yen(invoice.subtotal)}
                      </td>
                    </tr>
                    <tr>
                      <td
                        style={{
                          background: BLUE,
                          color: 'white',
                          fontWeight: 700,
                          textAlign: 'center',
                          padding: '8px 6px',
                          borderRight: `2px solid ${BLUE_DARK}`,
                          borderTop: `2px solid ${BLUE_DARK}`,
                        }}
                      >
                        消費税(10%)
                      </td>
                      <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 700, borderTop: `2px solid ${BLUE_DARK}` }}>
                        {yen(invoice.tax)}
                      </td>
                    </tr>
                    <tr>
                      <td
                        style={{
                          background: BLUE,
                          color: 'white',
                          fontWeight: 800,
                          textAlign: 'center',
                          padding: '8px 6px',
                          borderRight: `2px solid ${BLUE_DARK}`,
                          borderTop: `2px solid ${BLUE_DARK}`,
                        }}
                      >
                        合　計
                      </td>
                      <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 800, borderTop: `2px solid ${BLUE_DARK}` }}>
                        {yen(invoice.total)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* 仕切り点線 */}
            <div style={{ marginTop: '10mm', borderTop: `1px dashed ${BLUE}` }} />

            {/* 備考（点線枠） */}
            <div
              style={{
                marginTop: '4mm',
                border: `1px dashed ${BLUE}`,
                padding: '3mm 4mm',
                minHeight: '30mm',
              }}
            >
              <div style={{ fontWeight: 700, marginBottom: '2mm' }}>備考</div>
              <div className="whitespace-pre-line" style={{ lineHeight: 1.5 }}>
                {invoice.notes ?? '下記の口座にお振込をお願い致します。'}
              </div>
            </div>
          </div>
        </div>

        {/* 印刷設定 */}
        <style jsx global>{`
          @page {
            size: A4;
            margin: 0;
          }
          @media print {
            body {
              background: #fff !important;
            }
            [data-invoice] {
              box-shadow: none !important;
            }
          }
        `}</style>
      </div>
    </>
  );
}
