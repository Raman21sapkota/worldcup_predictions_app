import { test, expect } from "@playwright/test"

test.describe("Authentication", () => {
  test("shows landing page when accessing home without auth", async ({ page }) => {
    await page.goto("/")
    await expect(page.getByText("FIFA World Cup 2026")).toBeVisible()
    await expect(page.getByText("Sign in with Google")).toBeVisible()
  })

  test("redirects to landing page when accessing leaderboard without auth", async ({ page }) => {
    await page.goto("/leaderboard")
    await expect(page.getByText("FIFA World Cup 2026")).toBeVisible()
  })

  test("redirects to landing page when accessing profile without auth", async ({ page }) => {
    await page.goto("/profile")
    await expect(page.getByText("FIFA World Cup 2026")).toBeVisible()
  })

  test("redirects to landing page when accessing history without auth", async ({ page }) => {
    await page.goto("/history")
    await expect(page.getByText("FIFA World Cup 2026")).toBeVisible()
  })

  test("login endpoint redirects to Google", async ({ page }) => {
    await page.goto("/api/auth/login")
    await page.waitForURL(/accounts\.google\.com/)
    expect(page.url()).toContain("accounts.google.com")
  })

  test("returns 401 for /api/auth/me without cookie", async ({ request }) => {
    const res = await request.get("/api/auth/me")
    expect(res.status()).toBe(401)
  })

  test("returns 401 for protected API routes without auth", async ({ request }) => {
    const routes = ["/api/matches", "/api/predictions/me", "/api/leaderboard", "/api/users/me"]
    for (const route of routes) {
      const res = await request.get(route)
      expect(res.status(), `Expected 401 for ${route}`).toBe(401)
    }
  })

  test("logout clears session", async ({ request }) => {
    const res = await request.post("/api/auth/logout", { maxRedirects: 0 })
    expect(res.status()).toBe(303)
    expect(res.headers()["location"]).toBe("http://localhost:3000/")
  })
})
