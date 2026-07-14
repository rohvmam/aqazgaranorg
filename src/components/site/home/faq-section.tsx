import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Reveal } from "@/components/motion/reveal";
import { Container, Section, SectionHeading } from "@/components/site/primitives";
import { FAQ } from "@/content/home";
import { loc } from "@/lib/content";

export function FaqSection({ locale }: { locale: string }) {
  return (
    <Section className="border-t border-border/30">
      <Container className="max-w-4xl">
        <SectionHeading
          eyebrow={loc(FAQ.eyebrow, locale)}
          title={loc(FAQ.title, locale)}
          align="center"
        />
        <Reveal>
          <Accordion type="single" collapsible className="w-full">
            {FAQ.items.map((item, i) => (
              <AccordionItem
                key={i}
                value={`faq-${i}`}
                className="border-border/40"
              >
                <AccordionTrigger className="py-6 text-start font-heading text-base font-medium hover:no-underline sm:text-lg [&>svg]:text-brand-cyan">
                  {loc(item.q, locale)}
                </AccordionTrigger>
                <AccordionContent className="pb-6 text-sm leading-relaxed text-text-2 sm:text-base">
                  {loc(item.a, locale)}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </Container>
    </Section>
  );
}
