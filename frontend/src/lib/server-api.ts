import { cookies } from "next/headers"

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:4000"

export async function serverApi(path: string, options?: RequestInit) {
  const c = await cookies()
  const res = await fetch(`${BACKEND_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Cookie: c.toString(),
      ...options?.headers,
    },
    cache: "no-store",
  })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}
