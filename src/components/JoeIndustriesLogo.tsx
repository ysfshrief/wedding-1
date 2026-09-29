import Image from "next/image";
import logo from "@/assets/joe-industries-logo.jpg";

/** Wordmark region inside the 1078×606 source image. */
const CROP = { x: 200, y: 242, w: 770, h: 132 };

/**
 * The Joe Industries logo, cropped to its wordmark with CSS. The source is
 * silver on black: a little extra contrast turns the dark vignette pure black,
 * and `screen` blending then lets that black melt into the footer. (Keep
 * `opacity` off its ancestors: that would isolate the blend from the footer.)
 */
export function JoeIndustriesLogo({ className = "" }: { className?: string }) {
  return (
    <span
      className={`relative block overflow-hidden ${className}`}
      style={{ aspectRatio: `${CROP.w} / ${CROP.h}` }}
    >
      <Image
        src={logo}
        alt="Joe Industries"
        sizes="240px"
        className="absolute max-w-none mix-blend-screen transition-[filter] duration-300 [filter:contrast(1.5)_brightness(0.85)] group-hover:[filter:contrast(1.5)_brightness(1.05)]"
        style={{
          width: `${(logo.width / CROP.w) * 100}%`,
          height: "auto",
          left: `${(-CROP.x / CROP.w) * 100}%`,
          top: `${(-CROP.y / CROP.h) * 100}%`,
        }}
      />
    </span>
  );
}
