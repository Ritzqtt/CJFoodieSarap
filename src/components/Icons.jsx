/* Reusable line icons. Add or edit symbols here, then use <Icon name="..." />. */
export function Icon({ name, className = 'h-5 w-5', ...props }) {
  return (
    <svg
      className={className}
      aria-hidden="true"
      focusable="false"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <use href={`#icon-${name}`} />
    </svg>
  )
}

export function IconSprite() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      className="pointer-events-none absolute h-0 w-0 overflow-hidden"
    >
      <defs>
        <symbol id="icon-cloche" viewBox="0 0 24 24">
          <path d="M3.5 17.5h17" />
          <path d="M5.5 17a6.5 6.5 0 0 1 13 0" />
          <path d="M12 8.5V7" />
          <circle cx="12" cy="5.2" r="1.4" fill="currentColor" stroke="none" />
        </symbol>
        <symbol id="icon-tray" viewBox="0 0 24 24">
          <rect x="3" y="8" width="18" height="10" rx="2.2" />
          <path d="M3 12.5h18M7.5 8V6.2M16.5 8V6.2M8.5 15.5h7" />
        </symbol>
        <symbol id="icon-bilao" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="8.2" />
          <path d="M3.8 12h16.4M7.3 6.4c1.5 3.2 1.5 7.9 0 11.2M16.7 6.4c-1.5 3.2-1.5 7.9 0 11.2" />
        </symbol>
        <symbol id="icon-box" viewBox="0 0 24 24">
          <rect x="3.5" y="8" width="17" height="12" rx="2.2" />
          <path d="M8.5 8V6.5A3.5 3.5 0 0 1 12 3a3.5 3.5 0 0 1 3.5 3.5V8M3.5 13h17" />
        </symbol>
        <symbol id="icon-phone" viewBox="0 0 24 24">
          <path d="M21.5 16.9v2.9a2 2 0 0 1-2.2 2 19.7 19.7 0 0 1-8.6-3.1 19.4 19.4 0 0 1-6-6A19.7 19.7 0 0 1 1.6 4.2 2 2 0 0 1 3.6 2h2.9a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.5 2.1L7.4 10a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.9.6 2.9.7a2 2 0 0 1 1.8 2z" />
        </symbol>
        <symbol id="icon-messenger" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            stroke="none"
            d="M12 2.2C6.3 2.2 2 6.4 2 11.8c0 2.8 1.2 5.2 3.2 6.9V22l3-1.6c1.2.3 2.5.5 3.8.5 5.7 0 10-4.2 10-9.6S17.7 2.2 12 2.2zm5.4 7.4-4.7 5-2.5-2.6-4.7 2.6 5.2-5.5 2.6 2.6 4.1-2.1z"
          />
        </symbol>
        <symbol id="icon-mail" viewBox="0 0 24 24">
          <rect x="2.5" y="4.5" width="19" height="15" rx="2.5" />
          <path d="m3.5 6 8.5 6.5L20.5 6" />
        </symbol>
        <symbol id="icon-pin" viewBox="0 0 24 24">
          <path d="M20 10.4c0 5.4-8 11.1-8 11.1s-8-5.7-8-11.1a8 8 0 1 1 16 0z" />
          <circle cx="12" cy="10.2" r="2.8" />
        </symbol>
        <symbol id="icon-truck" viewBox="0 0 24 24">
          <path d="M2.5 6.5h11v10h-11zM13.5 10h4l3 3v3.5h-7" />
          <circle cx="6.5" cy="18" r="1.8" />
          <circle cx="17.5" cy="18" r="1.8" />
        </symbol>
        <symbol id="icon-clock" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5.2l3.4 2" />
        </symbol>
        <symbol id="icon-cup" viewBox="0 0 24 24">
          <path d="M6 7h12l-1.2 12.2a2 2 0 0 1-2 1.8H9.2a2 2 0 0 1-2-1.8zM5 7h14M8.5 3.5h7M14.5 3.5V7" />
        </symbol>
        <symbol id="icon-facebook" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            stroke="none"
            d="M15.4 3H13a4.7 4.7 0 0 0-4.7 4.7V10H5.5v3.2h2.8V21H11v-7.8h2.8l.6-3.2H11V7.9c0-.9.7-1.6 1.6-1.6h2.4z"
          />
        </symbol>
        <symbol id="icon-instagram" viewBox="0 0 24 24">
          <rect x="3.2" y="3.2" width="17.6" height="17.6" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
        </symbol>
        <symbol id="icon-tiktok" viewBox="0 0 24 24">
          <path d="M14.2 3v10.8a3.6 3.6 0 1 1-3.2-3.6" />
          <path d="M14.2 3.2c.4 2.3 2 4 4.4 4.3" />
        </symbol>
        <symbol id="icon-whatsapp" viewBox="0 0 24 24">
          <path d="M20.6 11.6a8.5 8.5 0 0 1-12.4 7.5L3.4 20.2l1.2-4.6a8.5 8.5 0 1 1 16-4z" />
          <path
            fill="currentColor"
            stroke="none"
            d="M8.6 7.8c.3-.1.6 0 .8.4l.7 1.5c.1.3.1.5-.1.7l-.5.6c-.1.2-.2.4 0 .6.6 1 1.4 1.8 2.5 2.3.2.1.4.1.6-.1l.6-.6c.2-.2.4-.3.7-.2l1.5.7c.3.2.5.4.4.7-.2 1-1.1 1.7-2.2 1.7-3.2 0-6.2-2.9-6.2-6.1 0-1.1.7-2 1.2-2.2z"
          />
        </symbol>
        <symbol id="icon-check" viewBox="0 0 24 24">
          <path d="m4.5 12.5 5 5 10-11" />
        </symbol>
        <symbol id="icon-copy" viewBox="0 0 24 24">
          <rect x="8" y="8" width="12" height="12" rx="2" />
          <path d="M16 8V5.5A2.5 2.5 0 0 0 13.5 3H5.5A2.5 2.5 0 0 0 3 5.5v8A2.5 2.5 0 0 0 5.5 16H8" />
        </symbol>
        <symbol id="icon-calendar" viewBox="0 0 24 24">
          <rect x="3" y="5" width="18" height="16" rx="2.5" />
          <path d="M3 10h18M8 3v4M16 3v4" />
        </symbol>
        <symbol id="icon-users" viewBox="0 0 24 24">
          <circle cx="9" cy="8" r="3.4" />
          <path d="M2.8 20a6.2 6.2 0 0 1 12.4 0M16.5 4.9a3.4 3.4 0 0 1 0 6.2M18 14.4a6.2 6.2 0 0 1 3.2 5.6" />
        </symbol>
        <symbol id="icon-arrow" viewBox="0 0 24 24">
          <path d="M4 12h15M13 5.5 19.5 12 13 18.5" />
        </symbol>
        <symbol id="icon-send" viewBox="0 0 24 24">
          <path d="m21 3-7.2 18-3.6-7.2L3 10.2zM10.2 13.8 21 3" />
        </symbol>
        <symbol id="icon-heart" viewBox="0 0 24 24">
          <path d="M20.6 5.6a5 5 0 0 0-7.1 0L12 7.1l-1.5-1.5a5 5 0 0 0-7.1 7.1L12 21l8.6-8.3a5 5 0 0 0 0-7.1z" />
        </symbol>
      </defs>
    </svg>
  )
}
