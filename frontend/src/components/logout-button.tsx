"use client"

import { LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"

export function LogoutButton({ iconOnly = false }: { iconOnly?: boolean }) {
  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button variant="ghost" size="icon-xs" aria-label="Logout" />
        }
      >
        <LogOut className="size-3.5" />
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Sign out</DialogTitle>
        <DialogDescription>
          Are you sure you want to sign out? You'll need to sign in with Google
          again to access your predictions.
        </DialogDescription>
        <DialogFooter>
          <DialogClose
            render={<Button variant="outline">Cancel</Button>}
          />
          <form action="/api/auth/logout" method="POST">
            <Button variant="default" type="submit">
              Sign out
            </Button>
          </form>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
