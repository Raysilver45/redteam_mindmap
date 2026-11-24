import { navItems } from "@/lib/constants";

import Link from "next/link";
import ThemeToggle from "./themeToggle";

export default function Navigation() {
    return <nav className="sticky top-0 z-50 bg-background backdrop-blur-md border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
                <div className="flex-shrink-0">
                    <h1 className="text-5xl font-riant font-semibold text-foreground">
                        Arcadia
                    </h1>
                </div>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center space-x-8">
                    {navItems.map(item => (
                        <Link key={item.name} href={item.href} className="text-xl transition-colors duration-200">
                            {item.name}
                        </Link>
                    ))}

                    <ThemeToggle />
                </div>
            </div>
        </div>
    </nav>
}