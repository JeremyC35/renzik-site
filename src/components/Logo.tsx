import Image from "next/image";
import { site } from "@/config/site";

/** The real "RENZIK / AUTOMATED SERVICES" lockup from internal/brand/. Its text is ink, so it sits on paper only. */
export function Logo({
  height = 40,
  className = "",
  priority = false,
}: {
  height?: number;
  className?: string;
  priority?: boolean;
}) {
  const width = Math.round((height * 278.7) / 80);
  return (
    <Image
      src="/brand/renzik-lockup.svg"
      alt={site.lockupName}
      width={width}
      height={height}
      unoptimized
      priority={priority}
      className={className}
    />
  );
}
