import Background from "./background";

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
    <html lang="en">
      <body>
        <Background>{children}</Background>
      </body>
    </html>
  );
}
