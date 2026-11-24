export const navItems = [
    {
        name: "Home",
        href: "/"
    },
    {
        name: "Mindmaps",
        href: "/mindmaps"
    },
    {
        name: "Publications",
        href: "/publications"
    },
    {
        name: "Labs",
        href: "/labs"
    },
    {
        name: "Whothef***ami",
        href: "/whoami"
    }
]

export const SEVERITY_LEVELS: Record<string, { label: string; text: string; bg: string; dot: string; bar: string }> = {
    'informational': { label: 'Informational', text: 'text-slate-400', bg: 'bg-slate-500/10', dot: 'bg-slate-400', bar: 'bg-slate-400' },
    'low': { label: 'Low', text: 'text-blue-400', bg: 'bg-blue-500/10', dot: 'bg-blue-400', bar: 'bg-blue-400' },
    'medium': { label: 'Medium', text: 'text-amber-400', bg: 'bg-amber-500/10', dot: 'bg-amber-400', bar: 'bg-amber-400' },
    'high': { label: 'High', text: 'text-red-500', bg: 'bg-red-500/10', dot: 'bg-red-500', bar: 'bg-red-500' },
    'critical': { label: 'Critical', text: 'text-purple-500', bg: 'bg-purple-500/10', dot: 'bg-purple-500', bar: 'bg-purple-500' },
};