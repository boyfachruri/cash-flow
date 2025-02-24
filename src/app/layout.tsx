import QueryProvider from "@/components/QueryProvider";

export const metadata = {
  title: "R3g Cashflow",
  description: "Created by R3g Software",
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
