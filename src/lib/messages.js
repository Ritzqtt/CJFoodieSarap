export const BOOK_MESSAGE =
  "Hello po! I'd like to book an order."

export const ORDER_INTRO =
  "Hello po! I'd like to place an order:"

export function formatDate(isoDate) {
  if (!isoDate) return '—'
  const parsed = new Date(`${isoDate}T00:00:00`)
  if (Number.isNaN(parsed.getTime())) return isoDate
  return parsed.toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function buildInquiryMessage(values) {
  return [
    'Hi po! I would like to inquire about an order.',
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

export function buildOrderMessage(items) {
  const groups = new Map()

  items.forEach((item) => {
    if (!groups.has(item.category)) groups.set(item.category, [])
    groups
      .get(item.category)
      .push(
        item.pax
          ? `- ${item.name}, ${item.pax} x${item.quantity}`
          : `- ${item.name} x${item.quantity}${item.unit ? ` ${item.unit}` : ''}`,
      )
  })

  const lines = [ORDER_INTRO]
  groups.forEach((groupLines, category) => {
    lines.push(category.toUpperCase(), ...groupLines)
  })
  return lines.join('\n')
}

export async function copyTextToClipboard(text) {
  if (!text) return false

  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text)
      return true
    }
  } catch {
    // Fall through to the legacy textarea approach.
  }

  const helper = document.createElement('textarea')
  helper.value = text
  helper.setAttribute('readonly', '')
  helper.style.position = 'fixed'
  helper.style.top = '-1000px'
  helper.style.opacity = '0'
  document.body.appendChild(helper)
  helper.select()

  let copied
  try {
    copied = document.execCommand('copy')
  } catch {
    copied = false
  }
  helper.remove()
  return copied
}
