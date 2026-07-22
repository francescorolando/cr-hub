// piccola libreria di icone SVG inline (stroke, currentColor) per non dipendere
// da font di emoji che rendono in modo incoerente fra piattaforme.
function Icon({ children, className = "h-4 w-4", ...props }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {children}
    </svg>
  );
}

export function TrophyIcon(props) {
  return (
    <Icon {...props}>
      <path d="M8 4h8v5a4 4 0 0 1-8 0V4Z" />
      <path d="M8 5H5a1 1 0 0 0-1 1v1a3 3 0 0 0 3 3" />
      <path d="M16 5h3a1 1 0 0 1 1 1v1a3 3 0 0 1-3 3" />
      <path d="M10 15v2H9a1 1 0 0 0-1 1v1h8v-1a1 1 0 0 0-1-1h-1v-2" />
    </Icon>
  );
}

export function CrownIcon(props) {
  return (
    <Icon {...props}>
      <path d="M3 8l4 3 5-6 5 6 4-3-2 10H5L3 8Z" />
      <path d="M5 18h14" />
    </Icon>
  );
}

export function ShieldIcon(props) {
  return (
    <Icon {...props}>
      <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3Z" />
    </Icon>
  );
}

export function SwordsIcon(props) {
  return (
    <Icon {...props}>
      <path d="M14.5 3.5 20 9l-2 2-5.5-5.5L14.5 3.5Z" />
      <path d="M9.5 3.5 4 9l2 2 5.5-5.5L9.5 3.5Z" />
      <path d="M4 20l4-4" />
      <path d="M20 20l-4-4" />
      <path d="M9 15l3-3 3 3" />
    </Icon>
  );
}

export function MedalIcon(props) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="14" r="6" />
      <path d="M9 4h6l-2 6.5h-2L9 4Z" />
      <path d="M10.3 12.8l1.7 1 1.7-1" />
    </Icon>
  );
}

export function CardsIcon(props) {
  return (
    <Icon {...props}>
      <rect x="4" y="6" width="11" height="15" rx="1.5" transform="rotate(-6 9.5 13.5)" />
      <rect x="9" y="4" width="11" height="15" rx="1.5" />
    </Icon>
  );
}

export function EvolutionIcon(props) {
  return (
    <Icon {...props}>
      <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1" />
      <circle cx="12" cy="12" r="3.2" />
    </Icon>
  );
}

export function GiftIcon(props) {
  return (
    <Icon {...props}>
      <rect x="4" y="9" width="16" height="4" />
      <rect x="5" y="13" width="14" height="8" />
      <path d="M12 9v12" />
      <path d="M12 9C10 6 6 6 6 8.5S9 9 12 9Z" />
      <path d="M12 9c2-3 6-3 6-0.5S15 9 12 9Z" />
    </Icon>
  );
}
