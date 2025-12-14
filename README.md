yarn dev

# text2invoice

「text2invoice」は、テキストデータから日本のビジネス向け請求書をWeb上で表示・PDF出力できる Next.js + TypeScript 製アプリケーションです。

## 主な機能

- 請求書一覧表示（`/`）
- 個別請求書の詳細表示（`/invoices/[id]`）
- 請求書データは `public/invoices/*.json` で管理
- 請求書のPDF出力（A4・日本語レイアウト対応、ワンクリックで印刷/保存）
- 10行明細・備考欄・日本語フォント・消費税対応
- レスポンシブ＆印刷最適化済み

## ディレクトリ構成

```
text2invoice/
├── public/
│   └── invoices/
│       ├── index.json         # 請求書一覧データ
│       ├── inv-xxxx-xxx.json # 個別請求書データ
├── src/
│   ├── app/
│   │   ├── page.tsx          # 請求書一覧ページ
│   │   ├── invoices/[id]/    # 個別請求書ページ
│   │   └── print.css         # 印刷用スタイル
│   ├── components/
│   │   └── InvoiceDisplay.tsx # 請求書表示・PDF出力コンポーネント
│   └── types/invoice.ts      # 型定義
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

## セットアップ

1. 依存パッケージのインストール

```bash
npm install
```

2. 開発サーバー起動

```bash
npm run dev
```

3. ブラウザで [http://localhost:3000](http://localhost:3000) を開く

## 請求書データの追加

- `public/invoices/` 配下に `inv-xxxx-xxx.json` 形式で請求書データを追加
- `index.json` に一覧用データを追記

## PDF出力

- 請求書詳細ページ右上の「PDFで出力」ボタンでA4レイアウトのPDFを印刷/保存できます

## 技術スタック

- Next.js (App Router, TypeScript)
- Tailwind CSS
- React
- react-to-print（PDF出力）
- ESLint

## ライセンス

MIT
