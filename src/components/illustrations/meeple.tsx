type Props = { fill?: string; className?: string };

// Flat, upright, front-facing meeple: classic silhouette (round head, open
// arms, split legs) with an even night-blue outline and no volume. Fill comes
// from the prop.
export default function Meeple({ fill = "#ffc700", className }: Props) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      focusable="false"
      className={className}
    >
      <path
        d="M12 2a4 4 0 0 1 3.9 4.9c2.6.8 5.1 2.3 5.1 4.3 0 1.3-1.5 1.6-3.3 1.7l2.8 8.1a1 1 0 0 1-.9 1.4h-4.2a1 1 0 0 1-.9-.6L12 16.5l-2.5 5.3a1 1 0 0 1-.9.6H4.4a1 1 0 0 1-.9-1.4l2.8-8.1C4.5 12.8 3 12.5 3 11.2c0-2 2.5-3.5 5.1-4.3A4 4 0 0 1 12 2Z"
        fill={fill}
        stroke="#2e294e"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}
