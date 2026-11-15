import Link from "next/link";

const Alink = ({ href, children }) => {
  return (
    <Link
      href={href}
      className="text-link underline hover:text-ink"
    >
      {children}
    </Link>
  );
};

export default Alink;
