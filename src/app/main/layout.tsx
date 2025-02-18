import QueryProvider from "@/components/QueryProvider";
import Navbar from "./Navbar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryProvider>
      <html lang="en">
        <body>
          <Navbar>{children}</Navbar>
        </body>
      </html>
    </QueryProvider>
  );
}
