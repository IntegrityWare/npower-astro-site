export default function HoverZoomImage({ src, alt, className = "mx-auto w-1/3", frameClassName = "" }) {
  const framed = Boolean(frameClassName);
  return (
    <div className={`group relative cursor-zoom-in ${className}`} tabIndex={0}>
      <div className={`relative w-full overflow-hidden rounded-xl border border-slate-200 bg-white ${frameClassName}`}>
        <img
          src={src}
          alt={alt}
          className={framed ? "absolute inset-0 h-full w-full object-contain" : "mx-auto block h-auto max-w-full"}
          loading="lazy"
        />
      </div>
      <div
        className="pointer-events-none fixed inset-0 z-50 hidden items-center justify-center bg-slate-950/75 p-6 group-hover:flex group-focus-within:flex"
        aria-hidden="true"
      >
        <img
          src={src}
          alt=""
          className="max-h-[90vh] max-w-[min(96vw,1400px)] rounded-lg object-contain shadow-2xl"
        />
      </div>
    </div>
  );
}
