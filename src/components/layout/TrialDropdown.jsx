import React from "react";
import { ChevronDown } from "lucide-react";
import { TRIAL_CHOICES } from "@/lib/trialChoices";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";

export default function TrialDropdown({ mobile = false, onSelect }) {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={"btn-anim inline-flex items-center justify-center gap-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red-500 " + (mobile ? "w-full px-4 py-3" : "px-4 py-2")}
        >
          Download Trial <ChevronDown className="w-4 h-4" aria-hidden="true" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={8} className="w-72 max-w-[calc(100vw-2rem)] border-white/10 bg-neutral-950 text-slate-200 p-2 shadow-2xl">
        {TRIAL_CHOICES.map((choice) => (
          <DropdownMenuItem key={choice.path} asChild onSelect={onSelect} className="px-3 py-3 cursor-pointer text-sm focus:bg-red-600/20 focus:text-white">
            <a href={choice.path}>{choice.label}</a>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
