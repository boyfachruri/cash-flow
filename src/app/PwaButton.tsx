"use client";
import { useEffect, useState } from "react";

export default function InstallPWAButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handler = (event: any) => {
      event.preventDefault(); // Mencegah pop-up otomatis
      setDeferredPrompt(event);
      setShowButton(true); // Menampilkan tombol install
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === "accepted") {
          console.log("User accepted the install prompt");
        } else {
          console.log("User dismissed the install prompt");
        }
        setDeferredPrompt(null);
        setShowButton(false); // Sembunyikan tombol setelah install
      });
    }
  };

  return (
    <>
      {showButton && (
        <button
          onClick={handleInstallClick}
          className="fixed bottom-4 right-4 px-4 py-2 bg-blue-500 text-white rounded shadow-lg"
        >
          Install App
        </button>
      )}
    </>
  );
}
