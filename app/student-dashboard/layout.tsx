import DashboardShell from "./_components/DashboardShell";

/* Persistent dashboard layout — the sidebar + topbar render once and
   stay mounted across in-app navigation. Only `{children}` re-renders
   per route, eliminating the full-tree remount the shell used to suffer. */
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <DashboardShell>{children}</DashboardShell>;
}
