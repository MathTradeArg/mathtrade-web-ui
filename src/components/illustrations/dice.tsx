type Props = { fill?: string; className?: string };

// Same drawing as the logo (Die), extracted from components/logo/svg.jsx:
// night-blue outline first (thickened with a stroke to match the other
// illustrations), then the fill.
export default function Die({ fill = "#ffc700", className }: Props) {
  return (
    <svg
      viewBox="263 109 144 144"
      aria-hidden
      focusable="false"
      className={className}
      fillRule="evenodd"
      clipRule="evenodd"
    >
      <path fill="#2e294e" stroke="#2e294e" strokeWidth="4.6" strokeLinejoin="round" d="M319.39 119.692a5.524 5.524 0 015.383-1.108l55.046 18.088a5.515 5.515 0 013.682 4.121c2.255 10.8 9.693 46.485 11.945 57.28a5.532 5.532 0 01-1.728 5.244l-43.576 38.98a5.523 5.523 0 01-5.397 1.134l-55.324-18.056a5.524 5.524 0 01-3.7-4.151L273.98 163.5a5.524 5.524 0 011.756-5.242l43.655-38.566z" />
      <path fill={fill} d="M366.978 195.87l-20.715 42.263-39.057-30.399 59.772-11.864zm-64.39 13.66l-9.94 11.48 42.776 14.045-32.836-25.525zm86.324-8.08l-16.74-5.901-18.277 36.812 35.017-30.912zm-107.937-27.193l8.723 43.546 10.132-11.608-18.855-31.938zm85.747 17.059l-41.559-45.663-19.432 58.297 60.99-12.634zm-87.414-28.54l22.446 38.417 18.278-56.181-40.724 17.765zm94.148 28.476l17.122 5.58-9.62-45.92-7.502 40.34zm4.874-49.126l-8.786 46.111-40.79-45.15 49.576-.961zm-56.694-2.373l-1.347-14.75-32.708 29.436 34.055-14.686zm3.143-15.585l1.282 14.623 40.34-.834-41.622-13.789z" />
    </svg>
  );
}
