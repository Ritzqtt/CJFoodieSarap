import { useEffect, useRef, useState } from 'react'
import { BILAOS, BRAND, CONTACT, PACKAGES, formatPeso, messengerUrl } from '../data'
import { buildInquiryMessage, copyTextToClipboard, formatDate } from '../lib/messages'
import { Icon } from './Icons'
import SectionHeading from './SectionHeading'

const EMPTY_FORM = {
  name: '',
  mobile: '',
  date: '',
  guests: '',
  interest: '',
  address: '',
  notes: '',
}

const INTEREST_GROUPS = [
  {
    label: 'Party tray packages',
    options: PACKAGES.map((pkg) => ({
      value: `Package ${pkg.id} (${formatPeso(pkg.price)})`,
      label: `Package ${pkg.id} — ${formatPeso(pkg.price)}`,
    })),
  },
  {
    label: 'Bilao packages',
    options: BILAOS.map((set) => ({
      value: `Bilao Set ${set.id} (${formatPeso(set.price)} · ${set.pax})`,
      label: `Bilao Set ${set.id} — ${formatPeso(set.price)} · ${set.pax}`,
    })),
  },
  {
    label: 'À la carte & packed meals',
    options: [
      { value: 'À la carte tray order', label: 'À la carte tray order' },
      { value: 'Food packed meals', label: 'Food packed meals' },
      { value: 'Custom order / not sure yet', label: 'Custom order / not sure yet' },
    ],
  },
]

const INTEREST_OPTIONS = INTEREST_GROUPS.flatMap((group) => group.options)

const pad = (value) => String(value).padStart(2, '0')

function getTodayISO() {
  const now = new Date()
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`
}

function validate(values) {
  const errors = {}

  if (values.name.trim().length < 2) {
    errors.name = 'Please enter your name.'
  }

  const digits = values.mobile.replace(/\D/g, '')
  if (!/^(09\d{9}|639\d{9})$/.test(digits)) {
    errors.mobile = 'Enter a valid PH mobile number, e.g. 09123456789.'
  }

  if (!values.date) {
    errors.date = 'Please choose your event date.'
  } else {
    const chosen = new Date(`${values.date}T00:00:00`)
    const startOfToday = new Date()
    startOfToday.setHours(0, 0, 0, 0)
    if (Number.isNaN(chosen.getTime()) || chosen < startOfToday) {
      errors.date = 'Please choose today or a future date.'
    }
  }

  const guests = Number(values.guests)
  if (!Number.isInteger(guests) || guests < 1) {
    errors.guests = 'Enter the number of guests (1 or more).'
  } else if (guests > 5000) {
    errors.guests = 'For 5,000+ guests, please message us directly.'
  }

  if (!values.interest) {
    errors.interest = 'Please choose a package or order type.'
  }

  if (values.address.trim().length < 5) {
    errors.address = 'Please enter your complete delivery address.'
  }

  return errors
}

function FormField({ id, name, label, required = false, error, full = false, hint, children }) {
  return (
    <div className={`flex min-w-0 flex-col gap-1 ${full ? 'sm:col-span-2' : ''}`}>
      <label htmlFor={id} className="text-[.74rem] font-bold tracking-[.02em] text-forest">
        {label}{' '}
        {required ? (
          <span className="text-orange-deep" aria-hidden="true">*</span>
        ) : (
          <span className="font-medium text-muted">(optional)</span>
        )}
      </label>
      {children}
      {hint && <p className="text-[.65rem] text-muted">{hint}</p>}
      {error && (
        <p id={`err-${name}`} className="text-[.7rem] leading-snug font-semibold text-[#a11d0e]">
          {error}
        </p>
      )}
    </div>
  )
}

export default function InquiryForm() {
  const [values, setValues] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('')
  const [statusIsError, setStatusIsError] = useState(false)
  const [message, setMessage] = useState('')
  const [showOutput, setShowOutput] = useState(false)
  const [copyLabel, setCopyLabel] = useState('Copy message')
  const [interestOpen, setInterestOpen] = useState(false)
  const [activeInterest, setActiveInterest] = useState(-1)
  const formRef = useRef(null)
  const interestRef = useRef(null)
  const interestButtonRef = useRef(null)
  const interestListRef = useRef(null)

  useEffect(() => {
    if (!interestOpen) return undefined

    const handlePointerDown = (event) => {
      if (!interestRef.current?.contains(event.target)) {
        setInterestOpen(false)
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [interestOpen])

  useEffect(() => {
    if (!interestOpen || activeInterest < 0) return

    const option = interestListRef.current?.querySelector(
      `[data-index="${activeInterest}"]`
    )

    option?.scrollIntoView({ block: 'nearest' })
  }, [interestOpen, activeInterest])

  const inputClass = (name) =>
    `min-h-12 w-full rounded-xl border-2 px-3 py-2.5 font-body text-[.88rem] leading-snug transition focus:bg-white focus:outline-none focus:ring-4 ${
      errors[name]
        ? 'border-[#a11d0e] bg-[#fff4f1] focus:border-[#a11d0e] focus:ring-[#a11d0e]/15'
        : 'border-[#d9cdb8] bg-[#fffaf0] focus:border-forest-mid focus:ring-forest-mid/15'
    }`

  const handleChange = (event) => {
    const { name, value } = event.target
    setValues((current) => ({ ...current, [name]: value }))
    setErrors((current) => {
      if (!current[name]) return current
      const next = { ...current }
      delete next[name]
      return next
    })
  }

  const selectedInterestLabel =
    INTEREST_OPTIONS.find((option) => option.value === values.interest)?.label ?? ''

  const openInterest = (preferredIndex = 0) => {
    const selectedIndex = INTEREST_OPTIONS.findIndex(
      (option) => option.value === values.interest
    )

    setInterestOpen(true)
    setActiveInterest(selectedIndex >= 0 ? selectedIndex : preferredIndex)
  }

  const closeInterest = () => {
    setInterestOpen(false)
    setActiveInterest(-1)
  }

  const selectInterest = (index) => {
    const option = INTEREST_OPTIONS[index]
    if (!option) return
    setValues((current) => ({ ...current, interest: option.value }))
    setErrors((current) => {
      if (!current.interest) return current
      const next = { ...current }
      delete next.interest
      return next
    })
    closeInterest()
    interestButtonRef.current?.focus()
  }

  const handleInterestKeyDown = (event) => {
    const lastIndex = INTEREST_OPTIONS.length - 1

    if (event.key === 'Escape') {
      if (interestOpen) {
        event.preventDefault()
        closeInterest()
      }
      return
    }

    if (!interestOpen) {
      if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        openInterest(0)
      } else if (event.key === 'ArrowUp') {
        event.preventDefault()
        openInterest(lastIndex)
      }
      return
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setActiveInterest((current) => Math.min(current + 1, lastIndex))
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActiveInterest((current) => Math.max(current - 1, 0))
    } else if (event.key === 'Home') {
      event.preventDefault()
      setActiveInterest(0)
    } else if (event.key === 'End') {
      event.preventDefault()
      setActiveInterest(lastIndex)
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      selectInterest(activeInterest)
    } else if (event.key === 'Tab') {
      closeInterest()
    }
  }

  
  const handleSubmit = (event) => {
    event.preventDefault()

    const nextErrors = validate(values)
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      setStatus('Please check the highlighted fields and try again.')
      setStatusIsError(true)
      setShowOutput(false)

      const firstInvalid = Object.keys(nextErrors)[0]
      formRef.current?.querySelector(`[name="${firstInvalid}"]`)?.focus()

      return
    }

    setStatusIsError(false)

    const channel =
      event.nativeEvent.submitter?.getAttribute('data-channel') === 'email'
        ? 'email'
        : 'messenger'

    const builtMessage = buildInquiryMessage(values)

    setMessage(builtMessage)
    setShowOutput(true)

    if (channel === 'email') {
      const subject = `CJFoodieSarap inquiry — ${values.name} — ${formatDate(values.date)}`

      const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)

      if (isMobile) {
        // Mobile: Open the default email application
        const mailtoUrl = `mailto:${CONTACT.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(builtMessage)}`

        window.location.href = mailtoUrl
      } else {
        // Desktop: Let the customer choose their Google account
        const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(CONTACT.email)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(builtMessage)}`

        const accountChooserUrl =
          `https://accounts.google.com/AccountChooser?service=mail&continue=${encodeURIComponent(gmailUrl)}`

        window.open(accountChooserUrl, '_blank', 'noopener,noreferrer')
      }

      setStatus(
        `Your inquiry is ready! Please review and send your email to ${CONTACT.email}.`
      )
    } else {
      window.open(messengerUrl(builtMessage), '_blank', 'noopener')

      setStatus(
        'Opening Messenger with your details ready to send.'
      )
    }
  }

  return (
    <section id="inquire" className="bg-cream-2 py-14 sm:py-20">
      <div className="wrap">
        <div className="reveal">
          <SectionHeading eyebrow="Inquiry" title="Tell Us About Your Handaan">
            Fill this out and we'll open Messenger or your email app with your details ready to
            send.
          </SectionHeading>
        </div>

        <div className="grid gap-5 lg:grid-cols-[.85fr_1.15fr] lg:items-start">
          <aside className="order-1 rounded-[26px] bg-forest p-5 text-cream shadow-[0_10px_30px_rgba(31,77,26,.18)] lg:order-1 lg:sticky lg:top-[95px] lg:p-6">
            <span className="mb-3 grid h-[52px] w-[52px] place-items-center rounded-full bg-cream/10 text-cream shadow-[inset_0_0_0_2px_rgba(249,178,51,.7)]">
              <img
                src={BRAND.logo}
                alt="CJFoodieSarap logo"
                width={40}
                height={40}
                loading="lazy"
                className="h-10 w-auto max-w-full object-contain"
              />
            </span>
            <h3 className="mb-1.5 font-display text-[2rem] leading-[.95] tracking-[.03em] text-white">
              Let's go, Kafoodies!
            </h3>

            <br />

            <p className="text-[.82rem] leading-relaxed text-[#e6eeda]">
              Submit the inquiry form with your event details, contact information, preferred
              package, and delivery address. We will review your request and get in touch with you
              via Messenger or Email.
            </p>
            <br />
            <p className="text-[.82rem] leading-relaxed text-[#e6eeda]">
              <strong className="text-gold">FREE delivery</strong> in Makati &amp; Taguig. Other
              areas — please inquire first.
            </p>
            <p className="mt-4 border-t border-cream/20 pt-3 text-[.68rem] text-[#cfddc2]">
              CJFoodieSarap · Serving customers since 2018 · Good Food Brings People Together.
            </p>
          </aside>

          <div className="reveal order-2 rounded-[26px] border border-forest/15 bg-paper p-4 shadow-[0_12px_32px_rgba(31,77,26,.13)] sm:p-5 lg:order-2">
            <form ref={formRef} onSubmit={handleSubmit} noValidate>
              <div className="grid gap-3.5 sm:grid-cols-2">
                <FormField id="f-name" name="name" label="Your name" required error={errors.name}>
                  <input
                    id="f-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    placeholder="Firstname Lastname"
                    value={values.name}
                    onChange={handleChange}
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby="err-name"
                    className={inputClass('name')}
                  />
                </FormField>

                <FormField id="f-mobile" name="mobile" label="Mobile number" required error={errors.mobile}>
                  <input
                    id="f-mobile"
                    name="mobile"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    placeholder="09123456789"
                    value={values.mobile}
                    onChange={handleChange}
                    aria-invalid={Boolean(errors.mobile)}
                    aria-describedby="err-mobile"
                    className={inputClass('mobile')}
                  />
                </FormField>

                <FormField id="f-date" name="date" label="Event date" required error={errors.date}>
                  <input
                    id="f-date"
                    name="date"
                    type="date"
                    min={getTodayISO()}
                    value={values.date}
                    onChange={handleChange}
                    aria-invalid={Boolean(errors.date)}
                    aria-describedby="err-date"
                    className={inputClass('date')}
                  />
                </FormField>

                <FormField id="f-guests" name="guests" label="Number of guests" required error={errors.guests}>
                  <input
                    id="f-guests"
                    name="guests"
                    type="number"
                    inputMode="numeric"
                    min="1"
                    step="1"
                    placeholder="30"
                    value={values.guests}
                    onChange={handleChange}
                    aria-invalid={Boolean(errors.guests)}
                    aria-describedby="err-guests"
                    className={inputClass('guests')}
                  />
                </FormField>

                <FormField
                  id="f-interest"
                  name="interest"
                  label="Package or order interest"
                  required
                  error={errors.interest}
                  full
                >
                  <div ref={interestRef} className="relative">
                    <button
                      ref={interestButtonRef}
                      id="f-interest"
                      name="interest"
                      type="button"
                      role="combobox"
                      aria-expanded={interestOpen}
                      aria-controls="f-interest-listbox"
                      aria-haspopup="listbox"
                      aria-activedescendant={
                        interestOpen && activeInterest >= 0
                          ? `f-interest-opt-${activeInterest}`
                          : undefined
                      }
                      aria-invalid={Boolean(errors.interest)}
                      aria-describedby="err-interest"
                      onClick={() => {
                        if (interestOpen) closeInterest()
                        else openInterest(0)
                      }}
                      onKeyDown={handleInterestKeyDown}
                      className={`${inputClass('interest')} flex items-center justify-between gap-2 text-left ${
                        values.interest ? 'text-ink' : 'text-muted'
                      }`}
                    >
                      <span className="truncate">
                        {selectedInterestLabel || 'Choose one…'}
                      </span>

                      <Icon
                        name="arrow"
                        className={`h-4 w-4 shrink-0 transition-transform duration-200 ${
                          interestOpen ? '-rotate-90' : 'rotate-90'
                        }`}
                      />
                    </button>

                    {interestOpen && (
                      <div
                        ref={interestListRef}
                        id="f-interest-listbox"
                        role="listbox"
                        aria-label="Package or order interest"
                        className="no-scrollbar absolute top-full left-[-10px] z-30 mt-1 max-h-[280px] w-[calc(100%+10px)] overflow-y-auto rounded-xl border-2 border-forest/20 bg-paper p-1 shadow-[0_16px_34px_rgba(18,51,15,.22)]"
                      >
                        {INTEREST_GROUPS.map((group) => (
                          <div key={group.label} role="group" aria-label={group.label}>
                            <p className="px-2.5 pt-2 pb-1 text-[.58rem] font-extrabold tracking-[.11em] text-muted uppercase">
                              {group.label}
                            </p>
                            {group.options.map((option) => {
                              const index = INTEREST_OPTIONS.indexOf(option)
                              const isActive = activeInterest === index
                              const isSelected = values.interest === option.value
                              return (
                                <div
                                  key={option.value}
                                  id={`f-interest-opt-${index}`}
                                  data-index={index}
                                  role="option"
                                  aria-selected={isSelected}
                                  onMouseDown={(event) => event.preventDefault()}
                                  onMouseEnter={() => setActiveInterest(index)}
                                  onClick={() => selectInterest(index)}
                                  className={`flex min-h-[40px] cursor-pointer items-center rounded-lg px-2.5 py-2 text-[.82rem] leading-snug transition-colors ${
                                    isActive
                                      ? 'bg-forest text-white'
                                      : isSelected
                                        ? 'bg-forest/10 font-semibold text-forest'
                                        : 'text-ink hover:bg-forest/5'
                                  }`}
                                >
                                  {option.label}
                                </div>
                              )
                            })}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </FormField>

                <FormField id="f-address" name="address" label="Delivery address" required error={errors.address} full>
                  <input
                    id="f-address"
                    name="address"
                    type="text"
                    autoComplete="street-address"
                    placeholder="Barangay, city, landmark"
                    value={values.address}
                    onChange={handleChange}
                    aria-invalid={Boolean(errors.address)}
                    aria-describedby="err-address"
                    className={inputClass('address')}
                  />
                </FormField>

                <FormField id="f-notes" name="notes" label="Notes" full>
                  <textarea
                    id="f-notes"
                    name="notes"
                    rows="4"
                    placeholder="Dishes you like, allergies, preferred delivery time…"
                    value={values.notes}
                    onChange={handleChange}
                    className={`${inputClass('notes')} min-h-[100px] resize-y`}
                  />
                </FormField>
              </div>

              <div className="mt-4 border-t-2 border-dashed border-forest/15 pt-4">
                <p className="mb-2 text-[.64rem] font-extrabold tracking-[.12em] text-muted uppercase">
                  Send your inquiry via
                </p>
                <div className="grid gap-2 sm:grid-cols-2">
                  <button className="btn btn-forest w-full" type="submit" data-channel="messenger">
                    <Icon name="messenger" /> Send via Messenger
                  </button>
                  <button className="btn btn-outline w-full" type="submit" data-channel="email">
                    <Icon name="mail" /> Send via Email
                  </button>
                </div>
              </div>

              <p
                className={`mt-2.5 min-h-5 text-[.74rem] leading-snug font-semibold ${
                  statusIsError ? 'text-[#a11d0e]' : 'text-forest'
                }`}
                role="status"
                aria-live="polite"
              >
                {status}
              </p>
              <p className="mt-1.5 text-[.67rem] leading-relaxed text-muted">
                This form opens your own Messenger or email app. You can also call or text{' '}
                <a
                  href={`tel:${CONTACT.phoneTel}`}
                  className="font-semibold text-forest underline md:pointer-events-none md:no-underline"
                >
                  {CONTACT.phoneDisplay}
                </a>
                .
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
