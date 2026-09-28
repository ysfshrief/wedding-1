import { Ornament } from "./Ornament";
import { Reveal } from "./Reveal";

interface Props {
  title: string;
  subtitle?: string;
}

export function SectionHeading({ title, subtitle }: Props) {
  return (
    <div className="text-center">
      <Reveal>
        <h2 className="section-title font-ar text-espresso">{title}</h2>
      </Reveal>
      {subtitle && (
        <Reveal delay={0.1} y={16}>
          <p className="mt-3 font-arSans text-charcoal/70">{subtitle}</p>
        </Reveal>
      )}
      <Reveal delay={0.2} y={0} scale={0.85}>
        <Ornament className="mx-auto mt-5 w-32 text-champagne" />
      </Reveal>
    </div>
  );
}
