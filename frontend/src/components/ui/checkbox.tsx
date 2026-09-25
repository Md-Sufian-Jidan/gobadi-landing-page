"use client"

import * as React from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

export interface CheckboxProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  onCheckedChange?: (checked: boolean) => void
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, checked, defaultChecked, onChange, onCheckedChange, ...props }, ref) => {
    const [isChecked, setIsChecked] = React.useState<boolean>(
      checked !== undefined ? !!checked : !!defaultChecked
    )

    React.useEffect(() => {
      if (checked !== undefined) {
        setIsChecked(!!checked)
      }
    }, [checked])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (checked === undefined) {
        setIsChecked(e.target.checked)
      }
      onChange?.(e)
      onCheckedChange?.(e.target.checked)
    }

    return (
      <label className="relative inline-flex items-center justify-center cursor-pointer select-none">
        <input
          type="checkbox"
          ref={ref}
          checked={isChecked}
          onChange={handleChange}
          className="sr-only peer"
          {...props}
        />
        <div
          className={cn(
            "w-[18px] h-[18px] rounded-[5px] border border-[#D0C9BE] bg-white transition-all flex items-center justify-center peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-disabled:cursor-not-allowed peer-disabled:opacity-50 peer-checked:bg-[#1A1A1A] peer-checked:border-[#1A1A1A] hover:border-[#1A1A1A]",
            className
          )}
        >
          {isChecked && <Check className="w-3 h-3 text-white stroke-[3]" />}
        </div>
      </label>
    )
  }
)

Checkbox.displayName = "Checkbox"

export { Checkbox }
