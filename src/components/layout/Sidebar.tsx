import Link from "next/link";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Watchlist", href: "/watchlist" },
];

export function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 border-r border-zinc-200 bg-white px-4 py-6 dark:border-zinc-800 dark:bg-zinc-950 md:block">
      <nav className="space-y-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="block rounded-2xl px-3 py-2 transition hover:bg-zinc-100 hover:text-zinc-950 dark:hover:bg-zinc-900 dark:hover:text-zinc-50"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
