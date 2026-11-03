export default function SectionHeading({ eyebrow, title, children, light = false, className = '' }) {
  return (
    <div className={`mx-auto mb-12 max-w-3xl text-center ${className}`}>
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="brush-title">{title}</h2>
      {children && (
        <p className={`mx-auto mt-5 max-w-[62ch] text-[.96rem] ${light ? 'text-[#e6eeda]' : 'text-muted'}`}>
          {children}
        </p>
      )}
    </div>
  )
}
