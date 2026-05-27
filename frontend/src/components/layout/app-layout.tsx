import { Navbar } from "./navbar"
import { BottomNavigation } from "./bottom-navigation"

export default function AppLayout({ children, isAdmin }: { children: React.ReactNode; isAdmin?: boolean }) {
  return (
    <>
      <Navbar isAdmin={isAdmin} />
      <main className="min-h-screen pb-14 md:pb-0 md:pt-14">
        {children}
      </main>
      <BottomNavigation />
    </>
  )
}

export { Navbar, BottomNavigation }
