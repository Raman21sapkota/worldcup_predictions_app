import { test, expect } from "@playwright/test"

test.describe("API Routes", () => {
  test.describe("GET /api/matches", () => {
    test("returns 401 without auth", async ({ request }) => {
      const res = await request.get("/api/matches")
      expect(res.status()).toBe(401)
    })
  })

  test.describe("POST /api/predictions", () => {
    test("returns 401 without auth", async ({ request }) => {
      const res = await request.post("/api/predictions", {
        data: { matchId: "test" },
      })
      expect(res.status()).toBe(401)
    })

    test("returns 401 with empty body", async ({ request }) => {
      const res = await request.post("/api/predictions", {
        data: {},
      })
      expect(res.status()).toBe(401)
    })
  })

  test.describe("GET /api/predictions/me", () => {
    test("returns 401 without auth", async ({ request }) => {
      const res = await request.get("/api/predictions/me")
      expect(res.status()).toBe(401)
    })
  })

  test.describe("GET /api/leaderboard", () => {
    test("returns 401 without auth", async ({ request }) => {
      const res = await request.get("/api/leaderboard")
      expect(res.status()).toBe(401)
    })
  })

  test.describe("GET /api/users/me", () => {
    test("returns 401 without auth", async ({ request }) => {
      const res = await request.get("/api/users/me")
      expect(res.status()).toBe(401)
    })
  })

  test.describe("POST /api/sync", () => {
    test("returns 403 without admin role", async ({ request }) => {
      const res = await request.post("/api/sync")
      expect(res.status()).toBe(403)
    })
  })

  test.describe("GET /api/sync", () => {
    test("returns 403 without admin role", async ({ request }) => {
      const res = await request.get("/api/sync")
      expect(res.status()).toBe(403)
    })
  })

  test.describe("POST /api/auth/logout", () => {
    test("logout works without auth", async ({ request }) => {
      const res = await request.post("/api/auth/logout", { maxRedirects: 0 })
      expect(res.status()).toBe(303)
      expect(res.headers()["location"]).toBe("http://localhost:3000/")
    })
  })
})
