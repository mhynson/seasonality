import Link from "next/link";

interface IGlobalNavProps {
  links: { label: string; href: string }[];
}

export const GlobalNav = ({ links }: IGlobalNavProps) => (
  <nav className="bg-gray-800 p-4 text-white">
    {links.map(({ label, href }) => (
      <Link key={href} className="px-4" href={href}>
        {label}
      </Link>
    ))}
  </nav>
);
