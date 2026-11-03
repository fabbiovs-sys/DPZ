import { redirect } from "next/navigation";
import { sb } from "./supabase/server";

export type Sb = Awaited<ReturnType<typeof sb>>;

export async function requireAdmin(): Promise<Sb> {
  const s = await sb();
  const { data: { user } } = await s.auth.getUser();
  if (!user) redirect("/admin/login");
  const { data: ok } = await s.rpc("is_admin");
  if (!ok) redirect("/admin/login?erro=sem-permissao");
  return s;
}

const TIPOS = ["image/jpeg", "image/png", "image/webp", "image/gif"];

/** Envia uma imagem para o bucket "banners" e devolve a URL pública (ou null se não houver arquivo). */
export async function enviarImagem(s: Sb, arquivo: FormDataEntryValue | null, pasta: string): Promise<string | null> {
  if (!arquivo || typeof arquivo === "string" || !arquivo.size) return null;
  if (!TIPOS.includes(arquivo.type) || arquivo.size > 5 * 1024 * 1024) {
    throw new Error("Imagem inválida: use JPG, PNG, WebP ou GIF de até 5 MB.");
  }
  const ext = (arquivo.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
  const caminho = `${pasta}/${crypto.randomUUID()}.${ext}`;
  const { error } = await s.storage.from("banners").upload(caminho, arquivo, { contentType: arquivo.type });
  if (error) throw new Error(error.message);
  return s.storage.from("banners").getPublicUrl(caminho).data.publicUrl;
}

export const slugify = (t: string) =>
  t.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

export const nul = (v: FormDataEntryValue | null) => String(v ?? "").trim() || null;
export const num = (v: FormDataEntryValue | null) => {
  const t = String(v ?? "").trim().replace(",", ".");
  return t ? Number(t) : null;
};
/** datetime-local (horário de Brasília) -> ISO */
export const dt = (v: FormDataEntryValue | null) => (v ? new Date(`${v}:00-03:00`).toISOString() : null);
export const paraInput = (iso?: string | null) =>
  iso ? new Date(new Date(iso).getTime() - 3 * 3600e3).toISOString().slice(0, 16) : "";
export const paraData = (iso?: string | null) => paraInput(iso).slice(0, 10);
