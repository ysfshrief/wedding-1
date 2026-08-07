export function Ornament({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M2 12h60M138 12h60"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <path
        d="M100 3c-6 3-10 5-16 9 6 4 10 6 16 9 6-3 10-5 16-9-6-4-10-6-16-9z"
        stroke="currentColor"
        strokeWidth="1"
        fill="none"
      />
      <circle cx="100" cy="12" r="2.5" fill="currentColor" />
      <circle cx="66" cy="12" r="1.6" fill="currentColor" />
      <circle cx="134" cy="12" r="1.6" fill="currentColor" />
    </svg>
  );
}
