const StickyHeader = ({ children, size = "" }) => {
  return <header className="sticky top-0 z-sticky shadow-md">{children}</header>;
};

export default StickyHeader;
