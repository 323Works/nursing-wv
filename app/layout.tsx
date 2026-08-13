import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "WV Nursing Licensing Data | 323 Works",
  description: "Search and explore the West Virginia RN Board public roster snapshot.",
  openGraph: {
    title: "WV Nursing Licensing Data",
    description: "Explore public West Virginia RN and APRN licensing records.",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
