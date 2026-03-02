"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "~/lib/utils";
import { FcPieChart, FcSearch, FcIdea } from "react-icons/fc";

const links = [
    { href: "/", label: "Dashboard", Icon: FcPieChart },
    { href: "/matching", label: "Campaign Matching", Icon: FcSearch },
    { href: "/brief", label: "Brief Generator", Icon: FcIdea },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="flex h-screen w-56 flex-col border-r bg-white">
            <div className="border-b px-5 py-4 bg-slate-50">
                <h1 className="text-base font-bold tracking-tight text-indigo-900 flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded bg-indigo-600 text-white text-xs">PM</span>
                    ProjectMatch
                </h1>
            </div>
            <nav className="flex flex-1 flex-col gap-1.5 p-3">
                {links.map(({ href, label, Icon }) => {
                    const isActive = pathname === href;
                    return (
                        <Link
                            key={href}
                            href={href}
                            className={cn(
                                "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-all duration-200",
                                isActive
                                    ? "bg-slate-100 text-slate-900 shadow-sm ring-1 ring-slate-200"
                                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                            )}
                        >
                            <Icon className="h-5 w-5 drop-shadow-sm" />
                            {label}
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}
