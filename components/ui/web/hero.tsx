
"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { WaitlistNumber } from "@/components/waitlist/waitlist-number";
import demoImg from '@/public/demo-image.png'

export const Hero = () => {
  return (
    <section className="w-full py-20 mobile-top lg:py-32">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column - Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* Headline with Shimmer Effect */}
            <div className="md:space-y-4 text-center md:text-left">
              <h1 className="font-namian-semibold text-3xl sm:text-4xl md:text-5xl lg:text-7xl leading-tight text-[#1E4C44]">
                <span className="shimmer-text-1">
                  Borrow Smart.
                </span>
                <br />
                <span className="shimmer-text-2">
                  Lend Smarter.
                </span>
              </h1>

              {/* Subheadline */}
              <p className="font-sharp-medium text-base sm:text-lg md:text-xl lg:text-2xl text-foreground/80 max-w-lg mx-auto md:mx-0">
                Build your credit score when you offer & receive Loans from
                family and friends on WhatsApp.
              </p>
            </div>

            {/* Waitlist Form */}
            <div className="-mt-2">
              <WaitlistNumber />
            </div>
          </motion.div>

          {/* Right Column - Hero Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative hidden md:block"
          >
            <div className="relative w-full h-full min-h-[600px]">
              <Image
                src={demoImg}
                alt="Yakudi App Demo"
                fill
                className="object-contain"
                priority
                // loading='lazy'
              />
            </div>
          </motion.div>
        </div>

        {/* Mobile Hero Image */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="md:hidden mt-16"
        >
          <div className="relative w-full h-80">
            <Image
              src={demoImg}
              alt="Yakudi App Demo"
              fill
              className="object-contain"
              priority
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};