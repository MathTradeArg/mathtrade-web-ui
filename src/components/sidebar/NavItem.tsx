"use client";
import Link from "next/link";
import type { MouseEvent, ReactNode } from "react";

type NavItemProps = {
  href: string;
  locked?: boolean;
  className?: string;
  title?: string;
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
  children: ReactNode;
};

const NavItem = ({
  href,
  locked = false,
  className,
  title,
  onClick,
  children,
}: NavItemProps) => {
  if (locked) {
    return (
      <span className={className} title={title} aria-disabled="true">
        {children}
      </span>
    );
  }

  return (
    <Link href={href} className={className} title={title} onClick={onClick}>
      {children}
    </Link>
  );
};

export default NavItem;
