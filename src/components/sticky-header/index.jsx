const StickyHeader = ({ children, size = "" }) => {
  return <header className="sticky top-0 z-50 shadow-md">{children}</header>;
};

export default StickyHeader;
