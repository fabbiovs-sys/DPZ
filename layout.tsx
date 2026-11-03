import "./globals.css";
import Link from "next/link";
import type { Metadata } from "next";
import LogoTopo from "@/components/LogoTopo";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: { default: "Drop Zero — A agenda de quem corre", template: "%s · Drop Zero" },
  description: "Calendário de corridas de rua com regulamento, organizador, fotos, cronometragem e links oficiais de inscrição.",
  openGraph: { siteName: "Drop Zero", locale: "pt_BR", type: "website" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800&display=swap" /></head>
      <body>
        <header className="top">
          <Link href="/" className="brand" aria-label="Drop Zero, página inicial">
            <LogoTopo /><span className="brand-tag">A agenda de quem corre</span>
          </Link>
          <nav aria-label="Principal"><Link href="/">Corridas</Link><Link href="/conteudo">Conteúdo</Link><Link href="/beneficios">Benefícios</Link><Link href="/videos">Vídeos</Link><Link href="/ferramentas">Ferramentas</Link><Link href="/favoritos">Favoritos</Link></nav>
        </header>
        <main>{children}</main>
        <footer className="foot">
          <img src="/logo.png" alt="Drop Zero" className="logo" />
          <p>Confirme sempre data, local e valores com o organizador antes de se inscrever.</p>
          <nav><Link href="/privacidade">Privacidade</Link></nav>
        </footer>
      </body>
    </html>
  );
}
