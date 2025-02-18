import QueryProvider from "@/components/QueryProvider";

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
