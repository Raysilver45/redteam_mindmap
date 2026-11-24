import { Github, Instagram, Linkedin, Twitter } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const socialLinks = [
  {
    icon: Twitter,
    href: "https://x.com/Vee0x0",
    label: "Twitter",
  },
  {
    icon: Github,
    href: "https://github.com/the-pr0tagonist",
    label: "GitHub",
  },
];

export default function Footer() {
  return (
    <footer className="bg-background border-t border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-3xl font-riant font-bold text-foreground mb-4">
              Arcadia
            </h3>
            <p className="text-foreground mb-4">
              Exploring the art of offensive security and sharing practical knowledge the best I can.
            </p>

            <div className="flex space-x-4">
              {socialLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    className="text-foreground hover:text-primary transition-colors duration-300"
                  >
                    <Icon className="h-5 w-5" />
                    <span className="sr-only">{link.label}</span>
                  </Link>
                );
              })}
            </div>

            <div className="mt-5 pt-8 border-t border-border/50 text-center text-sm text-foreground">
              <p>© {new Date().getFullYear()} . All rights reserved.</p>
            </div>
          </div>

          {/* Additional information */}

          <div>
            <h4 className="font-semibold underline text-foreground mb-4">Disclaimer</h4>
            <p className="italic">I'm human and I can make mistakes even though I try my best to verify and source information before publishing. Feel free to reach on X for any correction to be made.</p>
          </div>

        </div>
      </div>
    </footer>
  );
}