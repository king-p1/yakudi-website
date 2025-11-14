"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { WaitlistNumber } from "@/components/waitlist/waitlist-number";
import { Menu, X } from "lucide-react";
import { PartyPopper } from "@/components/animate-ui/icons/party-popper";
import Link from "next/link";
import { Button } from "../button";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const navLinks = [
    // { label: 'How it Works', href: '#how-it-works' },
    // { label: 'Security', href: '#security' },
    // { label: 'Use Cases', href: '#use-cases' },
    { label: "FAQs", href: "#faqs", onClick: (e: React.MouseEvent) => {
      e.preventDefault();
      const element = document.getElementById("faqs");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }},
  ];

  const [animateKey, setAnimateKey] = useState(0);
  const duration = 1500;
  const delay = 1500;
  useEffect(() => {
    const totalCycle = duration + delay;
    const interval = setInterval(() => {
      setAnimateKey((prev) => prev + 1);
    }, totalCycle);

    return () => clearInterval(interval);
  }, [delay, duration]);

  return (
    <>
      <div className="sticky top-4 z-50 px-4 sm:px-8 lg:px-8">
        <div className="bg-white/95 rounded-[4px] shadow-lg backdrop-blur-2xl md:p-2">
          <nav className="w-full p-2">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex w-full items-center justify-between h-10">
              {/* Logo */}
              <div className="shrink-0 -ml-2">
                <Link href="/">
                  <span
                    className="font-namian-bold text-2xl text-[#1E4C44]
"
                  >
                    Yakudi
                  </span>
                </Link>
              </div>

              <div className="flex items-center justify-center h-full  gap-6">
                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-8">
                  {navLinks.map((link) => (
                    <Button
                      key={link.label}
                      variant="ghost"
                      className="border px-6 py-2.5 w-[182px] h-[48px] rounded-[4px] border-[#1E4C44] font-sharp-medium text-sm transition-colors underline cursor-pointer"
                      onClick={link.onClick}
                    >
                      {link.label}
                    </Button>
                  ))}
                </div>

                {/* Desktop Join Waitlist Button */}
                <div className="hidden md:flex items-center gap-4 ">
                  <motion.button
                    onClick={() => setIsOpen(true)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-2.5 bg-[#1E4C44] w-[182px] h-[48px] text-white font-sharp-semibold text-sm rounded-[4px] hover:bg-[#1E4C44]/90 transition-colors cursor-pointer"
                  >
                    Join Waitlist
                  </motion.button>
                </div>
              </div>
              {/* Mobile Menu Button */}
              <div className="md:hidden">
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="text-foreground hover:text-foreground/70 transition-colors cursor-pointer mt-2"
                >
                  {isMobileMenuOpen ? (
                    <X className="h-6 w-6" />
                  ) : (
                    <Menu className="h-6 w-6" />
                  )}
                </button>
              </div>


            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
              {isMobileMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="md:hidden pb-4 space-y-3 border-t border-border/50 pt-4"
                >
                  {navLinks.map((link) => (
                    <Button
                      key={link.label}
                      variant="ghost"
                      className="border px-6 py-2.5 w-full cursor-pointer h-[48px] rounded-[4px] border-[#1E4C44] font-sharp-medium text-sm transition-colors underline"
                      onClick={(e) => {
                        link.onClick?.(e as React.MouseEvent);
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      {link.label}
                    </Button>
                  ))}
                  <motion.button
                    onClick={() => {
                      setIsOpen(true);
                      setIsMobileMenuOpen(false);
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className=" px-6 py-2.5 bg-[#1E4C44] w-full h-[48px] text-white font-sharp-semibold text-sm rounded-[4px] hover:bg-[#1E4C44]/90 transition-colors cursor-pointer"
                  >
                    Join Waitlist
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </nav>
        </div>
      </div>

      {/* Waitlist Dialog */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="w-[95%] sm:w-[90%] md:w-full max-w-lg mx-auto max-h-[90vh] overflow-y-auto p-4 sm:p-6">
          <div className="w-full">
            <div className="text-center space-y-2 p-2 mb-8">
              <h2 className="text-3xl text-[#1E4C44] font-namian-bold ">
                Join the Waitlist
              </h2>
              <p className="text-muted-foreground font-sharp-medium">
                Be the first to know when Yakudi launches
              </p>
            </div>
            <WaitlistNumber
              isStacked={true}
              showInternalSuccess={false}
              onSuccess={() => {
                setIsOpen(false);
                setShowSuccessDialog(true);
              }}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <AnimatePresence>
        {showSuccessDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={() => setShowSuccessDialog(false)}
          />
        )}
      </AnimatePresence>
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="w-[95%] sm:w-[90%] md:w-full max-w-lg mx-auto max-h-[90vh] overflow-y-auto p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="py-8 px-4"
          >
            {/* Success Icon with Animation */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                delay: 0.2,
                type: "spring",
                stiffness: 200,
                damping: 15,
              }}
              className="flex justify-center mb-6"
            >
              <div className="relative">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4, type: "spring" }}
                  className="relative flex items-center justify-center w-16 h-16"
                >
                  <div className="w-16 h-16 bg-[#1B5E40] rounded-full flex items-center justify-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.6 }}
                    >
                      <PartyPopper
                        animate={"default"}
                        key={animateKey}
                        className="w-8 h-8 text-white"
                      />
                    </motion.div>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Success Message */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center space-y-3"
            >
              <h3 className="text-3xl font-namian-bold text-[#1E4C44]">
                Hurray!{" "}
              </h3>
              <p className="text-muted-foreground font-sharp-medium">
                You&apos;ve successfully joined the waitlist!
                <br />
                We&apos;ll notify you as soon as Yakudi launches.
              </p>
            </motion.div>

            {/* Close Button */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              onClick={() => setShowSuccessDialog(false)}
              className="w-full mt-8 px-6 py-3 bg-[#1E4C44] text-white font-sharp-semibold rounded-lg hover:bg-[#1E4C44]/90 transition-colors cursor-pointer"
            >
              Close
            </motion.button>
          </motion.div>
        </DialogContent>
      </Dialog>
    </>
  );
};
