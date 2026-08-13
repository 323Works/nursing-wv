import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://wvnursing.323tools.com"),
  title: "WV Nursing Licensing Data | 323 Works",
  description: "Search and explore the West Virginia RN Board public roster snapshot.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "WV Nursing Licensing Data",
    description: "Explore public West Virginia RN and APRN licensing records.",
    type: "website",
    url: "/",
    siteName: "WV Nursing Licensing Data",
  },
  twitter: {
    card: "summary",
    title: "WV Nursing Licensing Data",
    description: "Explore public West Virginia RN and APRN licensing records.",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
