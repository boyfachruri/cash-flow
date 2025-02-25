import QueryProvider from "@/components/QueryProvider";
import InstallPWAButton from "./PwaButton";

export const metadata = {
  title: "R3g Cashflow",
  description: "Created by R3g Software",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryProvider>
      <html lang="en">
        <body>
          {children}
        </body>
      </html>
    </QueryProvider>
  );
}
