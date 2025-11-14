"use client";

import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQItems = [
  {
    id: "item-1",
    question: "What is Yakudi?",
    answer: `YAKUDI offers peer-to-peer lending via WhatsApp, enabling Nigerians to lend &
borrow within trusted circles while building formal credit through CreditRegistry, a
CBN-licensed bureau.`,
  },
  {
    id: "item-2",
    question: "How is Yakudi different from traditional banks & MFBs?",
    answer: `Yakudi formalises informal lending, helping users build credit history from
everyday transactions. It complements banks & MFBs by making community
lending faster, simpler, and more personal.`,
  },
  {
    id: "item-3",
    question:
      "What is a credit score & how does it impact my lending opportunities?",
    answer: `A credit score is a rating number that shows how reliable you are with credit.
YAKUDI helps you build and improve it through your everyday lending, borrowing
and repayment activity.`,
  },
  {
    id: "item-4",
    question: "How does Yakudi ensure the credibility of lending & borrowing?",
    answer: `YAKUDI partners with CreditRegistry, a CBN-licensed bureau, to verify and record
your transactions. This makes your informal lending count toward your formal
credit history.`,
  },
  {
    id: "item-5",
    question: "Why is Yakudi on WhatsApp and not an app?",
    answer: `YAKUDI runs on WhatsApp to make lending effortless & familiar; 0 downloads, 0
    storage worries. With over 51 million Nigerian users on WhatsApp, YAKUDI meets
    people where they already are`,
  },
  {
    id: "item-6",
    question: "How does Yakudi ensure security & privacy?",
    answer: `Users must enter a unique YAKUDI PIN before any action, ensuring full control
over transactions. The platform also relies on WhatsApp's native security that
includes biometrics & end-to-end encryption.`,
  },
  {
    id: "item-7",
    question: "Why should I use Yakudi?",
    answer: `With YAKUDI, you can:
. safely lend & borrow on WhatsApp.
. track repayments automatically, and build a recognised credit score through
CreditRegistry.`,
  },
  {
    id: "item-8",
    question: "How can I get started with Yakudi?",
    answer: `Simply sign up on the waitlist to be one of the first set of users on WhatsApp
when we launch.`,
  },
];



export const FAQ = () => {
  return (
    <section id="faqs" className="py-8 lg:py-12 md:-mt-10 mb-4 9990"> {/* Add proper padding */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8 md:mb-16"
        >
          <h2 className="font-namian-semibold text-2xl md:text-4xl mt-3 text-[#1E4C44]">
            Curious about YAKUDI?
          </h2>
        </motion.div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          <Accordion type="single" collapsible className="w-full ">
            {FAQItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <AccordionItem
                  value={item.id}
                  className="rounded-[4px] transition-all duration-300 mb-4 overflow-visible"
                >
                  <AccordionTrigger className=" bg-white border rounded-[4px] font-sharp-semibold text-foreground hover:text-[#1B5E40] p-4 text-left ">
                    <span className="text-lg">{item.question}</span>
                  </AccordionTrigger>
                  <AccordionContent className=" mt-1  rounded-[4px] shadow-lg backdrop-blur-sm font-sharp-medium text-foreground/80 px-6 pb-6 pt-4 bg-white/80">
                    <div className="pt-2 ">
                      {item.answer}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};