import * as Dialog from "@radix-ui/react-dialog";
import { X, ZoomIn } from "lucide-react";

export default function HoverZoomImage({ src, alt, className = "mx-auto w-1/3", frameClassName = "" }) {
  const framed = Boolean(frameClassName);
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button
          type="button"
          className={`group relative block cursor-zoom-in rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2 ${className}`}
          aria-label={`Expand image: ${alt}`}
        >
          <span className={`relative block w-full overflow-hidden rounded-xl border border-slate-200 bg-white ${frameClassName}`}>
            <img
              src={src}
              alt={alt}
              className={framed ? "absolute inset-0 h-full w-full object-contain" : "mx-auto block h-auto max-w-full"}
              loading="lazy"
            />
          </span>
          <span
            className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-xl bg-slate-950/20 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
            aria-hidden="true"
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-lg">
              <ZoomIn className="h-4 w-4" aria-hidden="true" />
              Click to Expand
            </span>
          </span>
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/80" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[calc(100vw-2rem)] max-w-[1400px] -translate-x-1/2 -translate-y-1/2 rounded-xl border border-slate-200 bg-white p-3 pt-12 shadow-xl">
          <Dialog.Title className="sr-only">Expanded image</Dialog.Title>
          <Dialog.Description className="sr-only">{alt}</Dialog.Description>
          <img
            src={src}
            alt={alt}
            className="mx-auto block max-h-[calc(90dvh-3.75rem)] max-w-full object-contain"
          />
          <Dialog.Close asChild>
            <button
              type="button"
              aria-label="Close expanded image"
              className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full text-slate-700 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
