"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { User } from "lucide-react"

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string
  alt?: string
  fallback?: string
  size?: "sm" | "md" | "lg"
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, alt, fallback, size = "md", ...props }, ref) => {
    const [imageError, setImageError] = React.useState(false)

    const sizeClasses = {
      sm: "w-8 h-8 text-xs",
      md: "w-10 h-10 text-sm",
      lg: "w-12 h-12 text-base",
    }

    return (
      <div
        ref={ref}
        className={cn(
          "relative flex shrink-0 overflow-hidden rounded-full bg-[#E5E0D8] items-center justify-center font-semibold text-[#525252] border border-[#EAE5DD]",
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {src && !imageError ? (
          <img
            src={src}
            alt={alt || "Avatar"}
            className="aspect-square h-full w-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : fallback ? (
          <span>{fallback}</span>
        ) : (
          <User className="w-1/2 h-1/2 text-[#737373]" />
        )}
      </div>
    )
  }
)

Avatar.displayName = "Avatar"

export { Avatar }
