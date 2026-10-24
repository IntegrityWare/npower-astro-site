import * as Dialog from "@radix-ui/react-dialog";
import { X, ZoomIn } from "lucide-react";

function ComparisonPair({ before, after }) {
  return (
    <span className="grid grid-cols-2 divide-x divide-slate-200">
      {[before, after].map((image) => (
        <span key={image.src} className="block min-w-0">
          <span className="relative block aspect-[6/5] overflow-hidden bg-white">
            <img
              src={image.src}
              alt={image.alt}
              className="absolute inset-0 h-full w-full object-cover object-[64%_50%]"
              loading="lazy"
            />
          </span>
          <span className="block bg-slate-50 px-2 py-3 text-center text-sm font-semibold text-slate-800 sm:text-base">
            {image.caption}
          </span>
        </span>
      ))}
    </span>
  );
}

export default function MicroFilletComparison({ before, after }) {
  const title = `${before.caption} / ${after.caption}`;

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button
          type="button"
          aria-label={`Expand comparison: ${title}`}
          className="group relative block w-full cursor-zoom-in overflow-hidden rounded-xl border border-slate-200 bg-white text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2"
        >
          <ComparisonPair before={before} after={after} />
          <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-slate-950/10 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100" aria-hidden="true">
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-lg">
              <ZoomIn className="h-4 w-4" />
              Click to Expand
            </span>
          </span>
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/80" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 max-h-[90dvh] w-[calc(100vw-2rem)] max-w-[1200px] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-xl border border-slate-200 bg-white p-3 shadow-xl">
          <Dialog.Title className="mb-3 pr-10 text-lg font-bold text-slate-900">{title}</Dialog.Title>
          <Dialog.Description className="sr-only">Compare the same assembly without micro-fillets on the left and with {after.caption.toLowerCase()} on the right.</Dialog.Description>
          <ComparisonPair before={before} after={after} />
          <Dialog.Close asChild>
            <button type="button" aria-label="Close comparison" className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full text-slate-700 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600">
              <X className="h-5 w-5" />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
