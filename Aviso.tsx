export default function Aviso({ ok, erro, msg }: { ok?: string; erro?: string; msg?: string }) {
  if (erro) return <p className="aviso err">{erro}</p>;
  if (msg) return <p className="aviso">{msg}</p>;
  if (ok) return <p className="aviso">Salvo.</p>;
  return null;
}
