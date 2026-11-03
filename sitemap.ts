import type { MetadataRoute } from "next";
import { db } from "@/lib/db";
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
  const { data } = await db().from("eventos").select("slug,atualizado_em").in("status", ["publicado", "adiado"]).gte("data_inicio", new Date().toISOString());
  const fixas = ["", "/conteudo", "/beneficios", "/videos", "/ferramentas", "/privacidade"].map((p) => ({ url: base + p, changeFrequency: "daily" as const }));
  const { data: arts } = await db().from("artigos").select("slug,atualizado_em").eq("status", "publicado").eq("tipo", "editorial");
  return [...fixas, ...((arts ?? []) as any[]).map((a) => ({ url: `${base}/conteudo/${a.slug}`, lastModified: a.atualizado_em, changeFrequency: "monthly" as const })), ...((data ?? []) as any[]).map((e) => ({ url: `${base}/corridas/${e.slug}`, lastModified: e.atualizado_em, changeFrequency: "weekly" as const }))];
}
