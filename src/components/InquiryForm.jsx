import { useRef, useState } from 'react'
import { BILAOS, CONTACT, PACKAGES, formatPeso, messengerUrl } from '../data'
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

const pad = (value) => String(value).padStart(2, '0')

function getTodayISO() {
  const now = new Date()
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`
}

function formatDate(isoDate) {
  if (!isoDate) return '—'
  const parsed = new Date(`${isoDate}T00:00:00`)
  if (Number.isNaN(parsed.getTime())) return isoDate
  return parsed.toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })
}

function buildInquiryMessage(values) {
  return [
    'Hi CJFoodieSarap! I would like to inquire about an order.',
    '',
    `Name: ${values.name}`,
    `Mobile: ${values.mobile}`,
    `Event date: ${formatDate(values.date)}`,
    `Guests: ${values.guests}`,
    `Interested in: ${values.interest}`,
    `Delivery address: ${values.address}`,
    `Notes: ${values.notes || '—'}`,
    '',
    'Salamat! (Sent from the CJFoodieSarap website)',
  ].join('\n')
}

function validate(values) {
  const errors = {}

  if (values.name.trim().length < 2) {
    errors.name = 'Please enter your name.'
  }

  const digits = values.mobile.replace(/\D/g, '')
  if (!/^(09\d{9}|639\d{9})$/.test(digits)) {
    errors.mobile = 'Enter a valid PH mobile number, e.g. 0917 123 4567.'
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
          <span className="text-orange-deep" aria-hidden="true">
            *
          </span>
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
  const formRef = useRef(null)

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
      event.nativeEvent.submitter?.getAttribute('data-channel') === 'email' ? 'email' : 'messenger'
    const builtMessage = buildInquiryMessage(values)
    setMessage(builtMessage)
    setShowOutput(true)

    if (channel === 'email') {
      const subject = `CJFoodieSarap inquiry — ${values.name} — ${formatDate(values.date)}`
      window.location.href = `mailto:${CONTACT.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(builtMessage)}`
      setStatus(
        `Opening your email app with the inquiry filled in. If nothing opens, copy the message below and send it to ${CONTACT.email}.`,
      )
    } else {
      window.open(messengerUrl(builtMessage), '_blank', 'noopener')
      setStatus(
        'Opening Messenger with your details ready to send. If nothing opens, copy the message below and send it to us.',
      )
    }
  }

  const handleCopy = async () => {
    if (!message) return
    let copied
    try {
      await navigator.clipboard.writeText(message)
      copied = true
    } catch {
      const helper = document.createElement('textarea')
      helper.value = message
      helper.setAttribute('readonly', '')
      helper.style.position = 'fixed'
      helper.style.top = '-1000px'
      helper.style.opacity = '0'
      document.body.appendChild(helper)
      helper.select()
      try {
        copied = document.execCommand('copy')
      } catch {
        copied = false
      }
      helper.remove()
    }
    setCopyLabel(copied ? 'Copied!' : 'Copy failed')
    window.setTimeout(() => setCopyLabel('Copy message'), 2000)
  }

  return (
    <section id="inquire" className="bg-cream-2 py-14 sm:py-20">
      <div className="wrap">
        <div className="reveal">
          <SectionHeading eyebrow="Inquiry" title="Tell Us About Your Handaan">
            Fill this out and we&apos;ll open Messenger or your email app with your details ready to
            send. No account needed, no backend — just hit send.
          </SectionHeading>
        </div>

        <div className="grid gap-5 lg:grid-cols-[.85fr_1.15fr] lg:items-start">
          <aside className="order-2 rounded-[26px] bg-forest p-5 text-cream shadow-[0_10px_30px_rgba(31,77,26,.18)] lg:order-1 lg:p-6">
            <span
              className="mb-3 grid h-[52px] w-[52px] place-items-center rounded-full bg-cream/10 text-cream shadow-[inset_0_0_0_2px_rgba(249,178,51,.7)]"
              aria-hidden="true"
            >
              <Icon name="cloche" className="h-8 w-8" />
            </span>
            <h3 className="mb-1.5 font-display text-[2rem] leading-[.95] tracking-[.03em] text-white">
              Let&apos;s go, Kafoodies!
            </h3>
            <p className="text-[.82rem] leading-relaxed text-[#e6eeda]">
              Prefer to chat directly? Message us on Facebook or call — we&apos;re happy to help you
              plan the menu.
            </p>

            <div className="my-4 grid gap-2">
              <a
                href={`tel:${CONTACT.phoneTel}`}
                className="flex items-center gap-2.5 rounded-xl border border-cream/20 bg-cream/5 px-3 py-2.5 text-[.78rem] font-semibold text-cream no-underline transition hover:border-gold/50 hover:bg-gold/15"
              >
                <Icon name="phone" className="h-[18px] w-[18px] text-gold" />
                <span>
                  {CONTACT.phoneDisplay}
                  <small className="block font-normal text-[#cfddc2]">Call · Viber · WhatsApp</small>
                </span>
              </a>
              <a
                href={`mailto:${CONTACT.email}`}
                className="flex items-center gap-2.5 rounded-xl border border-cream/20 bg-cream/5 px-3 py-2.5 text-[.78rem] font-semibold text-cream no-underline transition hover:border-gold/50 hover:bg-gold/15"
              >
                <Icon name="mail" className="h-[18px] w-[18px] text-gold" />
                {CONTACT.email}
              </a>
              <a
                href={CONTACT.messenger}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 rounded-xl border border-cream/20 bg-cream/5 px-3 py-2.5 text-[.78rem] font-semibold text-cream no-underline transition hover:border-gold/50 hover:bg-gold/15"
              >
                <Icon name="messenger" className="h-[18px] w-[18px] text-gold" />
                Message on Messenger
              </a>
            </div>

            <p className="text-[.82rem] leading-relaxed text-[#e6eeda]">
              <strong className="text-gold">FREE delivery</strong> in Makati &amp; Taguig. Other areas
              — please inquire first.
            </p>
            <p className="mt-4 border-t border-cream/20 pt-3 text-[.68rem] text-[#cfddc2]">
              CJFoodieSarap · Serving customers since 2018 · Good Food Brings People Together.
            </p>
          </aside>

          <div className="reveal order-1 rounded-[26px] border border-forest/15 bg-paper p-4 shadow-[0_12px_32px_rgba(31,77,26,.13)] sm:p-5 lg:order-2">
            <form ref={formRef} onSubmit={handleSubmit} noValidate>
              <div className="grid gap-3.5 sm:grid-cols-2">
                <FormField id="f-name" name="name" label="Your name" required error={errors.name}>
                  <input
                    id="f-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    placeholder="Juan Dela Cruz"
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
                    placeholder="0917 123 4567"
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
                  <select
                    id="f-interest"
                    name="interest"
                    value={values.interest}
                    onChange={handleChange}
                    aria-invalid={Boolean(errors.interest)}
                    aria-describedby="err-interest"
                    className={inputClass('interest')}
                  >
                    <option value="">Choose one…</option>
                    <optgroup label="Party tray packages">
                      {PACKAGES.map((pkg) => {
                        const value = `Package ${pkg.id} (${formatPeso(pkg.price)})`
                        return (
                          <option key={pkg.id} value={value}>
                            Package {pkg.id} — {formatPeso(pkg.price)}
                          </option>
                        )
                      })}
                    </optgroup>
                    <optgroup label="Bilao packages">
                      {BILAOS.map((set) => {
                        const value = `Bilao Set ${set.id} (${formatPeso(set.price)} · ${set.pax})`
                        return (
                          <option key={set.id} value={value}>
                            Bilao Set {set.id} — {formatPeso(set.price)} · {set.pax}
                          </option>
                        )
                      })}
                    </optgroup>
                    <optgroup label="À la carte & packed meals">
                      <option value="À la carte tray order">À la carte tray order</option>
                      <option value="Food packed meals">Food packed meals</option>
                      <option value="Custom order / not sure yet">Custom order / not sure yet</option>
                    </optgroup>
                  </select>
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
                This form opens your own Messenger or email app — nothing is stored on this website.
                You can also call or text{' '}
                <a href={`tel:${CONTACT.phoneTel}`} className="font-semibold text-forest underline">
                  {CONTACT.phoneDisplay}
                </a>
                .
              </p>

              {showOutput && (
                <div className="mt-4 rounded-[14px] border-2 border-dashed border-[#8ab87b] bg-[#f1f8ec] p-3.5">
                  <div className="mb-1.5 flex flex-wrap items-center justify-between gap-2">
                    <strong className="text-[.82rem] text-forest">Your inquiry is ready</strong>
                    <button type="button" className="btn btn-forest btn-sm min-h-9 px-3 py-1.5 text-[.7rem]" onClick={handleCopy}>
                      <Icon name="copy" className="h-4 w-4" /> {copyLabel}
                    </button>
                  </div>
                  <p className="mb-2 text-[.7rem] leading-relaxed text-[#46583b]">
                    If your Messenger or email app didn&apos;t open, copy the message below and send it
                    to us directly.
                  </p>
                  <pre
                    className="max-h-[260px] overflow-auto rounded-[10px] bg-white p-3 font-mono text-[.72rem] leading-relaxed whitespace-pre-wrap break-words text-[#3a3529]"
                    tabIndex={0}
                  >
                    {message}
                  </pre>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
