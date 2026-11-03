import { CONTACT, messengerUrl } from '../data'
import { Icon } from './Icons'

const MESSAGE =
  "Hi CJFoodieSarap! I'd like to inquire about your party trays, bilao, and packed meals."

export default function StickyMobileBar() {
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 gap-2 border-t-2 border-forest/15 bg-cream/97 px-3 pt-2 shadow-[0_-8px_24px_rgba(31,77,26,0.1)] backdrop-blur-md lg:hidden"
      style={{ paddingBottom: 'calc(.55rem + env(safe-area-inset-bottom))' }}
      aria-label="Quick contact"
    >
      <a
        className="btn btn-forest min-h-12 gap-1.5 px-2 py-2 text-[.72rem]"
        href={messengerUrl(MESSAGE)}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Icon name="messenger" className="h-[18px] w-[18px]" /> Message on Messenger
      </a>
      <a className="btn btn-primary min-h-12 gap-1.5 px-2 py-2 text-[.72rem]" href={`tel:${CONTACT.phoneTel}`}>
        <Icon name="phone" className="h-[18px] w-[18px]" /> Call Now
      </a>
    </div>
  )
}
