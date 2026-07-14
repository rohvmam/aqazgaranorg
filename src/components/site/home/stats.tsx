import { Counter } from "@/components/motion/counter";
import { MeridianLine } from "@/components/motion/draw-line";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { Container } from "@/components/site/primitives";
import { STATS } from "@/content/home";
import { loc } from "@/lib/content";

export function Stats({ locale }: { locale: string }) {
  return (
    <section className="relative py-20 md:py-28">
      <MeridianLine className="absolute inset-x-0 top-0 h-8" />
      <Container>
        <Reveal>
          <p className="eyebrow mb-12 text-center">{loc(STATS.eyebrow, locale)}</p>
        </Reveal>
        <RevealGroup className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4" stagger={0.1}>
          {STATS.items.map((stat, i) => (
            <RevealItem key={i} className="text-center">
              <p className="font-mono text-[clamp(2.4rem,5vw,3.6rem)] font-medium leading-none text-gradient tabular">
                <Counter
                  to={stat.value}
                  prefix={stat.prefix}
                  suffix={stat.suffix}
                  locale={locale}
                  duration={2.2}
                />
              </p>
              <p className="mt-4 text-sm text-text-2">{loc(stat.label, locale)}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </section>
  );
}
