import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import Analytics from "@/components/Analytics";
import {
  SITE_URL,
  SITE_NAME,
  SITE_SHORT,
  SITE_DESCRIPTION,
  NAV_LINKS,
  FOOTER_LINKS,
} from "@/lib/site";

const TITLE_DEFAULT = `${SITE_NAME}｜社会保険料・所得税・住民税を自動計算`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE_DEFAULT,
    template: `%s｜${SITE_SHORT}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: TITLE_DEFAULT,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary",
    title: TITLE_DEFAULT,
    description: SITE_DESCRIPTION,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className="min-h-screen flex flex-col">
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
            <Link href="/" className="text-base font-bold text-brand-dark">
              {SITE_SHORT}シミュレーター
            </Link>
            <nav aria-label="メインナビゲーション">
              <ul className="flex gap-4 text-sm text-slate-600">
                {NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="hover:text-brand-dark">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </header>

        <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8">{children}</main>

        <footer className="border-t border-slate-200 bg-white">
          <div className="mx-auto max-w-4xl px-4 py-6 text-sm text-slate-500">
            <ul className="flex flex-wrap gap-x-5 gap-y-2">
              {FOOTER_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-brand-dark">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-slate-400">
              © {SITE_NAME}. 掲載内容は情報提供を目的としたもので、税務・法務上の助言ではありません。
            </p>
          </div>
        </footer>

        <Analytics />
      </body>
    </html>
  );
}
