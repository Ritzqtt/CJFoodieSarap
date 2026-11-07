import { useEffect, useMemo, useRef, useState } from 'react'
import {
  MENU_CATEGORIES,
  ORDER_COPY,
  ORDER_SPECIALS,
  PRICE_GROUPS,
  TRAY_SIZES,
  formatPeso,
  messengerUrl,
} from '../data'
import { buildOrderMessage } from '../lib/messages'
import { Icon } from './Icons'
import SectionHeading from './SectionHeading'

const ASK_MESSAGE =
  "Hello po! I'd like help building a tray order for my handaan. Here's what I have in mind:"

const trayKey = (categoryId, dish) => `tray:${categoryId}:${dish}`
const specialKey = (specialId) => `special:${specialId}`
const domId = (key) => key.replace(/[^a-z0-9-]+/gi, '-')

function PaxSelect({ id, value, onChange, label }) {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(value)
  const rootRef = useRef(null)
  const buttonRef = useRef(null)
  const listRef = useRef(null)
  const lastIndex = TRAY_SIZES.length - 1
  const listId = `${id}-pax-list`

  useEffect(() => {
    if (!open) return undefined

    const handlePointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false)
    }

    document.addEventListener('pointerdown', handlePointerDown)
    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [open])

  useEffect(() => {
    if (!open || active < 0) return undefined
    listRef.current?.querySelector(`[data-index="${active}"]`)?.scrollIntoView({ block: 'nearest' })
  }, [open, active])

  const commit = (index) => {
    onChange(index)
    setActive(index)
    setOpen(false)
    buttonRef.current?.focus()
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Escape' && open) {
      event.preventDefault()
      setOpen(false)
      return
    }

    if (!open) {
      if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        setActive(value)
        setOpen(true)
      } else if (event.key === 'ArrowUp') {
        event.preventDefault()
        setActive(lastIndex)
        setOpen(true)
      }
      return
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setActive((current) => Math.min(current + 1, lastIndex))
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActive((current) => Math.max(current - 1, 0))
    } else if (event.key === 'Home') {
      event.preventDefault()
      setActive(0)
    } else if (event.key === 'End') {
      event.preventDefault()
      setActive(lastIndex)
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      commit(active)
    } else if (event.key === 'Tab') {
      setOpen(false)
    }
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={buttonRef}
        type="button"
        role="combobox"
        aria-expanded={open}
        aria-controls={listId}
        aria-haspopup="listbox"
        aria-label={label}
        aria-activedescendant={open && active >= 0 ? `${id}-pax-${active}` : undefined}
        onClick={() => {
          setActive(value)
          setOpen((current) => !current)
        }}
        onKeyDown={handleKeyDown}
        className="flex min-h-8 items-center gap-1 rounded-[9px] border-[1.5px] border-forest/20 bg-white px-2 py-1 text-[.68rem] font-semibold text-forest transition hover:border-forest-mid focus:outline-none focus-visible:ring-4 focus-visible:ring-orange/25"
      >
        {TRAY_SIZES[value].label}
        <Icon
          name="arrow"
          className={`h-3 w-3 transition-transform duration-200 ${open ? '-rotate-90' : 'rotate-90'}`}
        />
      </button>

      {open && (
        <div
          ref={listRef}
          id={listId}
          role="listbox"
          aria-label={label}
          className="no-scrollbar absolute top-full left-0 z-30 mt-1 max-h-[190px] w-max min-w-full overflow-y-auto rounded-[10px] border-2 border-forest/20 bg-paper p-1 shadow-[0_12px_28px_rgba(18,51,15,.22)]"
        >
          {TRAY_SIZES.map((option, index) => (
            <div
              key={option.id}
              id={`${id}-pax-${index}`}
              data-index={index}
              role="option"
              aria-selected={index === value}
              onMouseDown={(event) => event.preventDefault()}
              onMouseEnter={() => setActive(index)}
              onClick={() => commit(index)}
              className={`flex min-h-8 cursor-pointer items-center rounded-[7px] px-2 py-1.5 text-[.68rem] font-semibold whitespace-nowrap transition-colors ${
                index === active
                  ? 'bg-forest text-white'
                  : index === value
                    ? 'bg-forest/10 text-forest'
                    : 'text-ink hover:bg-forest/5'
              }`}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function TrayMenu() {
  const [activeId, setActiveId] = useState(MENU_CATEGORIES[0].id)
  const [sizeIndex, setSizeIndex] = useState(1)
  const [cart, setCart] = useState({})
  const [orderCardVisible, setOrderCardVisible] = useState(true)
  const [tabsScroll, setTabsScroll] = useState({ left: false, right: false })
  const tabRefs = useRef([])
  const tabsScrollerRef = useRef(null)
  const orderCardRef = useRef(null)

  useEffect(() => {
    const scroller = tabsScrollerRef.current
    if (!scroller) return undefined

    const updateEdges = () => {
      setTabsScroll({
        left: scroller.scrollLeft > 4,
        right: scroller.scrollLeft + scroller.clientWidth < scroller.scrollWidth - 4,
      })
    }

    updateEdges()
    scroller.addEventListener('scroll', updateEdges, { passive: true })
    const observer = new ResizeObserver(updateEdges)
    observer.observe(scroller)
    if (scroller.firstElementChild) observer.observe(scroller.firstElementChild)

    return () => {
      scroller.removeEventListener('scroll', updateEdges)
      observer.disconnect()
    }
  }, [])

  useEffect(() => {
    const card = orderCardRef.current
    if (!card || typeof IntersectionObserver === 'undefined') return undefined

    const observer = new IntersectionObserver(
      ([entry]) => setOrderCardVisible(entry.isIntersecting),
      { threshold: 0 },
    )
    observer.observe(card)
    return () => observer.disconnect()
  }, [])

  const category = MENU_CATEGORIES.find((item) => item.id === activeId) ?? MENU_CATEGORIES[0]
  const prices = PRICE_GROUPS[category.priceGroup]
  const size = TRAY_SIZES[sizeIndex]
  const categorySpecials = ORDER_SPECIALS.filter((special) => special.categoryId === category.id)

  const toggleDish = (dish) => {
    const key = trayKey(category.id, dish)
    setCart((current) => {
      if (current[key]) {
        const next = { ...current }
        delete next[key]
        return next
      }
      return {
        ...current,
        [key]: {
          kind: 'tray',
          name: dish,
          categoryId: category.id,
          sizeIndex,
          quantity: 1,
        },
      }
    })
  }

  const toggleSpecial = (special) => {
    const key = specialKey(special.id)
    setCart((current) => {
      if (current[key]) {
        const next = { ...current }
        delete next[key]
        return next
      }
      return {
        ...current,
        [key]: {
          kind: 'special',
          specialId: special.id,
          name: special.displayName,
          categoryId: special.categoryId,
          quantity: special.defaultQuantity,
        },
      }
    })
  }

  const removeItem = (key) => {
    setCart((current) => {
      const next = { ...current }
      delete next[key]
      return next
    })
  }

  const clearOrder = () => setCart({})

  const setItemPax = (key, index) => {
    setCart((current) => {
      if (!current[key]) return current
      return { ...current, [key]: { ...current[key], sizeIndex: index } }
    })
  }

  const changeQuantity = (key, delta) => {
    setCart((current) => {
      const item = current[key]
      if (!item) return current
      const quantity = Math.max(1, item.quantity + delta)
      if (quantity === item.quantity) return current
      return { ...current, [key]: { ...item, quantity } }
    })
  }

  const orderGroups = useMemo(() => {
    const lines = Object.entries(cart)
      .map(([key, item]) => {
        const itemCategory = MENU_CATEGORIES.find((entry) => entry.id === item.categoryId)
        if (!itemCategory) return null

        if (item.kind === 'special') {
          const special = ORDER_SPECIALS.find((entry) => entry.id === item.specialId)
          if (!special) return null
          const lineTotal = special.price * item.quantity
          const quantityLabel =
            item.quantity === 1 ? special.quantityLabel.replace(/s$/, '') : special.quantityLabel
          return {
            key,
            kind: 'special',
            name: special.displayName,
            messageName: special.name,
            categoryId: itemCategory.id,
            quantity: item.quantity,
            quantityLabel,
            unitLabel: special.unit,
            messageUnit: special.messageUnit,
            unitPrice: special.price,
            lineTotal,
          }
        }

        const sizeLabel = TRAY_SIZES[item.sizeIndex].label
        const unitPrice = PRICE_GROUPS[itemCategory.priceGroup][item.sizeIndex]
        const lineTotal = unitPrice * item.quantity
        return {
          key,
          kind: 'tray',
          name: item.name,
          categoryId: itemCategory.id,
          sizeIndex: item.sizeIndex,
          sizeLabel,
          quantity: item.quantity,
          unitPrice,
          lineTotal,
        }
      })
      .filter(Boolean)

    return MENU_CATEGORIES.map((menuCategory) => ({
      id: menuCategory.id,
      label: menuCategory.name,
      lines: lines.filter((line) => line.categoryId === menuCategory.id),
    })).filter((group) => group.lines.length > 0)
  }, [cart])

  const total = orderGroups.reduce(
    (sum, group) => sum + group.lines.reduce((groupSum, line) => groupSum + line.lineTotal, 0),
    0,
  )
  const itemCount = orderGroups.reduce(
    (sum, group) => sum + group.lines.reduce((groupSum, line) => groupSum + line.quantity, 0),
    0,
  )

  const orderHref = useMemo(() => {
    const items = orderGroups.flatMap((group) =>
      group.lines.map((line) => ({
        category: group.label,
        name: line.kind === 'special' ? line.messageName : line.name,
        pax: line.kind === 'tray' ? line.sizeLabel : undefined,
        quantity: line.quantity,
        unit: line.kind === 'special' ? line.messageUnit : undefined,
      })),
    )
    return messengerUrl(buildOrderMessage(items))
  }, [orderGroups])

  const selectCategory = (id) => setActiveId(id)

  const handleTabKeyDown = (event, index) => {
    let nextIndex
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      nextIndex = (index + 1) % MENU_CATEGORIES.length
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      nextIndex = (index - 1 + MENU_CATEGORIES.length) % MENU_CATEGORIES.length
    } else if (event.key === 'Home') {
      nextIndex = 0
    } else if (event.key === 'End') {
      nextIndex = MENU_CATEGORIES.length - 1
    } else {
      return
    }

    event.preventDefault()
    setActiveId(MENU_CATEGORIES[nextIndex].id)
    tabRefs.current[nextIndex]?.focus()
  }

  const showOrderChip = itemCount > 0 && !orderCardVisible

  return (
    <section id="menu" className="bg-cream py-14 sm:py-20">
      <div className="wrap">
        <div className="reveal">
          <SectionHeading eyebrow="À La Carte" title="Tray Menu">
            Build your own spread. Choose a category and a tray size — the prices below update
            instantly. All prices are per tray unless marked per piece.
          </SectionHeading>
        </div>

        <div className="reveal mb-5 grid gap-3">
          <div className="relative min-w-0">
            <div ref={tabsScrollerRef} className="no-scrollbar overflow-x-auto pb-1.5">
              <div
                className="flex w-max min-w-full gap-1 rounded-full border border-forest/15 bg-white p-1.5 shadow-[0_4px_14px_rgba(31,77,26,.08)]"
                role="tablist"
                aria-label="Menu categories"
              >
                {MENU_CATEGORIES.map((item, index) => {
                  const selected = item.id === activeId
                  return (
                    <button
                      key={item.id}
                      ref={(element) => {
                        tabRefs.current[index] = element
                      }}
                      id={`menu-tab-${item.id}`}
                      type="button"
                      role="tab"
                      aria-selected={selected}
                      aria-controls="menu-panel"
                      tabIndex={selected ? 0 : -1}
                      onClick={() => selectCategory(item.id)}
                      onKeyDown={(event) => handleTabKeyDown(event, index)}
                      className={`min-h-[42px] rounded-full px-3 py-2 text-[.8rem] font-semibold whitespace-nowrap transition ${
                        selected
                          ? 'bg-forest text-white shadow-[0_3px_8px_rgba(18,51,15,.2)]'
                          : 'text-forest hover:bg-forest/10'
                      }`}
                    >
                      {item.name}
                    </button>
                  )
                })}
              </div>
            </div>

            <span
              aria-hidden="true"
              className={`pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-cream to-transparent transition-opacity duration-200 ${
                tabsScroll.left ? 'opacity-100' : 'opacity-0'
              }`}
            />
            <span
              aria-hidden="true"
              className={`pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-cream to-transparent transition-opacity duration-200 ${
                tabsScroll.right ? 'opacity-100' : 'opacity-0'
              }`}
            />
          </div>

          <div
            className="flex flex-wrap items-center gap-1.5 rounded-[17px] border border-forest/15 bg-white px-3 py-2.5 shadow-[0_4px_14px_rgba(31,77,26,.08)] justify-self-start min-[860px]:justify-self-end"
            role="group"
            aria-label="Choose tray size"
          >
            <span className="mr-0.5 text-[.63rem] font-extrabold tracking-[.11em] text-muted uppercase">
              Tray size
            </span>
            {TRAY_SIZES.map((option, index) => (
              <button
                key={option.id}
                type="button"
                aria-pressed={index === sizeIndex}
                onClick={() => setSizeIndex(index)}
                className={`min-h-9 rounded-full border-[1.5px] px-2.5 py-1.5 text-[.72rem] font-semibold whitespace-nowrap transition ${
                  index === sizeIndex
                    ? 'border-gold bg-gold text-forest-deep shadow-[0_2px_0_#c98a12]'
                    : 'border-forest/15 bg-cream text-forest hover:-translate-y-px hover:border-forest-mid'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div
          className="reveal rounded-[26px] border border-forest/15 bg-paper p-4 shadow-[0_8px_28px_rgba(31,77,26,.07)] sm:p-5"
          id="menu-panel"
          role="tabpanel"
          aria-labelledby={`menu-tab-${category.id}`}
          tabIndex={0}
        >
          <div className="mb-3.5 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 border-b-2 border-dashed border-forest/20 pb-3">
            <h3 className="font-display text-[1.8rem] leading-none tracking-[.04em] text-forest">
              {category.name}
            </h3>
            <p className="text-[.72rem] font-semibold text-muted">
              {category.items.length} dishes · {size.label} · prices per tray
            </p>
          </div>

          <div className="grid gap-2 sm:grid-cols-2 min-[900px]:grid-cols-3">
            {category.items.map((dish) => {
              const key = trayKey(category.id, dish)
              const checked = Boolean(cart[key])
              return (
                <label
                  key={dish}
                  className={`flex cursor-pointer items-center justify-between gap-2.5 rounded-[14px] border px-3.5 py-2.5 transition ${
                    checked
                      ? 'border-forest/45 bg-[#eff8e9] shadow-[0_3px_10px_rgba(31,77,26,.1)]'
                      : 'border-forest/15 bg-white hover:-translate-y-px hover:border-orange/55 hover:shadow-[0_5px_14px_rgba(31,77,26,.08)]'
                  }`}
                >
                  <span className="flex min-w-0 items-center gap-2.5">
                    <input
                      type="checkbox"
                      className="peer sr-only"
                      checked={checked}
                      onChange={() => toggleDish(dish)}
                      aria-label={`${dish} — ${size.label} tray, ${formatPeso(prices[sizeIndex])}`}
                    />
                    <span
                      aria-hidden="true"
                      className={`grid h-5 w-5 shrink-0 place-items-center rounded-[6px] border-2 transition peer-focus-visible:ring-4 peer-focus-visible:ring-orange/35 peer-focus-visible:ring-offset-1 ${
                        checked
                          ? 'border-forest bg-forest text-white'
                          : 'border-forest/30 bg-white text-transparent'
                      }`}
                    >
                      {checked && <Icon name="check" className="h-3.5 w-3.5" />}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[.86rem] leading-tight font-semibold text-ink">
                        {dish}
                      </span>
                      {category.notes?.[dish] && (
                        <span className="mt-0.5 block text-[.65rem] leading-tight font-semibold text-orange-deep">
                          {category.notes[dish]}
                        </span>
                      )}
                    </span>
                  </span>
                  <span className="shrink-0 pt-0.5 text-right font-display text-[1.3rem] leading-none tracking-[.03em] text-forest">
                    {formatPeso(prices[sizeIndex])}
                    <small className="mt-1 block font-body text-[.5rem] font-bold tracking-[.05em] text-muted uppercase">
                      per tray
                    </small>
                  </span>
                </label>
              )
            })}
          </div>

          {categorySpecials.length > 0 && (
            <div className="mt-4 flex flex-wrap items-center gap-2 border-t-2 border-dashed border-forest/15 pt-3.5">
              <p className="mr-0.5 text-[.63rem] font-extrabold tracking-[.11em] text-muted uppercase">
                Also available
              </p>
              {categorySpecials.map((special) => {
                const key = specialKey(special.id)
                const checked = Boolean(cart[key])
                return (
                  <label
                    key={special.id}
                    className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full border-[1.5px] px-2.5 py-1 text-[.72rem] font-semibold transition ${
                      checked
                        ? 'border-forest bg-[#e8f5df] text-forest shadow-[0_2px_0_rgba(31,77,26,.12)]'
                        : 'border-[#efcb7a] bg-[#fff3d6] text-[#6b4300] hover:border-forest-mid'
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="peer sr-only"
                      checked={checked}
                      onChange={() => toggleSpecial(special)}
                      aria-label={`${special.displayName} — ${formatPeso(special.price)} ${special.unit}`}
                    />
                    <span
                      aria-hidden="true"
                      className={`grid h-4 w-4 shrink-0 place-items-center rounded-[4px] border-2 transition peer-focus-visible:ring-4 peer-focus-visible:ring-orange/35 peer-focus-visible:ring-offset-1 ${
                        checked
                          ? 'border-forest bg-forest text-white'
                          : 'border-current bg-white/70 text-transparent'
                      }`}
                    >
                      {checked && <Icon name="check" className="h-2.5 w-2.5" />}
                    </span>
                    <span>
                      {special.displayName}{' '}
                      <strong className="font-extrabold text-forest">
                        {formatPeso(special.price)}
                      </strong>{' '}
                      {special.unit}
                    </span>
                  </label>
                )
              })}
            </div>
          )}

          <p className="mt-3.5 text-[.7rem] leading-relaxed text-muted">
            Prices are per tray. Serving sizes are estimates — message us and we will help you
            choose the right number of trays.
          </p>
        </div>

        <div
          ref={orderCardRef}
          id="your-order"
          className="reveal mt-5 scroll-mt-[84px] rounded-[26px] border border-forest/15 bg-paper p-4 shadow-[0_8px_28px_rgba(31,77,26,.07)] sm:p-5 lg:scroll-mt-[88px]"
        >
          <div className="mb-3.5 border-b-2 border-dashed border-forest/20 pb-3">
            <h3 className="font-display text-[1.8rem] leading-none tracking-[.04em] text-forest">
              {ORDER_COPY.title}
            </h3>
          </div>

          {itemCount === 0 ? (
            <p className="rounded-[14px] border border-dashed border-forest/20 bg-cream/60 px-4 py-6 text-center text-[.82rem] text-muted">
              {ORDER_COPY.empty}
            </p>
          ) : (
            <div className="grid gap-4">
              {orderGroups.map((group) => (
                <div key={group.id}>
                  <h4 className="mb-1.5 text-[.62rem] font-extrabold tracking-[.14em] text-orange-deep uppercase">
                    {group.label}
                  </h4>
                  <ul className="grid gap-2">
                    {group.lines.map((line) => (
                      <li
                        key={line.key}
                        className="rounded-[14px] border border-forest/15 bg-white px-3 py-2.5"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="min-w-0 text-[.84rem] leading-snug font-semibold text-ink">
                            {line.name}
                          </p>
                          <button
                            type="button"
                            onClick={() => removeItem(line.key)}
                            aria-label={`Remove ${line.name} from order`}
                            className="grid h-6 w-6 shrink-0 place-items-center rounded-full text-muted transition hover:bg-[#fdeaea] hover:text-[#a11d0e] focus:outline-none focus-visible:ring-4 focus-visible:ring-orange/25"
                          >
                            <span aria-hidden="true" className="text-[1rem] leading-none">
                              ×
                            </span>
                          </button>
                        </div>

                        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-2">
                          {line.kind === 'tray' ? (
                            <PaxSelect
                              id={domId(line.key)}
                              value={line.sizeIndex}
                              onChange={(index) => setItemPax(line.key, index)}
                              label={`Pax size for ${line.name}`}
                            />
                          ) : (
                            <span className="rounded-[9px] border-[1.5px] border-forest/20 bg-cream px-2 py-1 text-[.68rem] font-semibold text-forest">
                              {line.unitLabel}
                            </span>
                          )}

                          <div
                            className="flex items-center gap-1"
                            role="group"
                            aria-label={`Quantity for ${line.name}`}
                          >
                            <button
                              type="button"
                              onClick={() => changeQuantity(line.key, -1)}
                              disabled={line.quantity <= 1}
                              aria-label={`Decrease quantity of ${line.name}`}
                              className="grid h-7 w-7 place-items-center rounded-full border border-forest/20 bg-cream text-[.9rem] leading-none font-bold text-forest transition hover:border-forest-mid hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              −
                            </button>
                            <span className="min-w-[2.4ch] text-center text-[.78rem] font-bold text-forest">
                              {line.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => changeQuantity(line.key, 1)}
                              aria-label={`Increase quantity of ${line.name}`}
                              className="grid h-7 w-7 place-items-center rounded-full border border-forest/20 bg-cream text-[.9rem] leading-none font-bold text-forest transition hover:border-forest-mid hover:bg-white"
                            >
                              +
                            </button>
                          </div>

                          {line.kind === 'special' && (
                            <span className="text-[.62rem] font-semibold text-muted">
                              {line.quantityLabel}
                            </span>
                          )}

                          <span className="ml-auto font-display text-[1.15rem] leading-none tracking-[.02em] text-forest">
                            {formatPeso(line.lineTotal)}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          <div className="mt-4 border-t-2 border-dashed border-forest/15 pt-3">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[.72rem] font-semibold text-muted">
                {itemCount} {itemCount === 1 ? 'item' : 'items'}
              </p>
              <button
                type="button"
                onClick={clearOrder}
                disabled={itemCount === 0}
                className="text-[.7rem] font-bold text-muted underline decoration-dotted underline-offset-2 transition hover:text-[#a11d0e] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Clear all
              </button>
            </div>

            <div className="mt-1.5 flex items-baseline justify-between gap-3">
              <span className="text-[.72rem] font-extrabold tracking-[.12em] text-forest uppercase">
                Total
              </span>
              <span className="font-display text-[1.9rem] leading-none tracking-[.03em] text-orange-deep">
                {formatPeso(total)}
              </span>
            </div>

            <p className="mt-1.5 text-[.64rem] leading-relaxed text-muted">{ORDER_COPY.note}</p>

            <a
              href={itemCount > 0 ? orderHref : undefined}
              target="_blank"
              rel="noopener noreferrer"
              aria-disabled={itemCount === 0}
              onClick={(event) => {
                if (itemCount === 0) event.preventDefault()
              }}
              className={`btn btn-forest mt-3 w-full ${
                itemCount === 0 ? 'cursor-not-allowed opacity-50' : ''
              }`}
            >
              <Icon name="messenger" /> Send Order on Messenger
            </a>
          </div>
        </div>

        {showOrderChip && (
          <button
            type="button"
            onClick={() =>
              document.getElementById('your-order')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }
            className="fixed left-1/2 z-30 -translate-x-1/2 rounded-full bg-forest px-4 py-2.5 text-[.74rem] font-bold text-cream shadow-[0_10px_28px_rgba(18,51,15,.35)] ring-2 ring-gold/70 transition hover:bg-forest-deep lg:hidden"
            style={{ bottom: 'calc(76px + env(safe-area-inset-bottom) + 8px)' }}
          >
            View order ({itemCount}) · {formatPeso(total)}
          </button>
        )}

        <p className="sr-only" aria-live="polite">
          Showing {category.name} tray prices for {size.label}. {category.items.length} dishes.{' '}
          {itemCount} {itemCount === 1 ? 'item' : 'items'} selected.
        </p>

        <div className="reveal mt-5 flex flex-wrap items-center justify-between gap-3 rounded-[18px] border-2 border-dashed border-forest/30 bg-[#f2f8ea] px-4 py-4">
          <p className="text-[.84rem] text-[#3e4a33]">
            <strong className="text-forest">Can&apos;t decide?</strong> Tell us your budget, pax, and
            favorite dishes — we&apos;ll suggest a lineup.
          </p>
          <a
            className="btn btn-forest btn-sm"
            href={messengerUrl(ASK_MESSAGE)}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icon name="messenger" /> Ask for a suggestion
          </a>
        </div>
      </div>
    </section>
  )
}
