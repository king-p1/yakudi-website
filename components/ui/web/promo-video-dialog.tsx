'use client';

import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { motion, AnimatePresence } from 'framer-motion';
import { Play } from 'lucide-react';

const VIDEO_URL = 'https://ik.imagekit.io/4jn92qn70/yakudi-promo-video.mp4';
const THUMBNAIL_URL = 'https://ik.imagekit.io/4jn92qn70/yakudi-promo-video.mp4/ik-thumbnail.jpg';

export const PromoVideoDialog = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Learn More Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="px-6 py-4 bg-[#1E4C44]  text-white font-sharp-semibold rounded-[4px] hover:bg-[#1E4C44]/90 transition-colors cursor-pointer flex items-center gap-2 mx-auto -mt-4 mb-6"
      >
        <Play className="h-4 w-4" />
        Learn More
      </motion.button>

      {/* Video Dialog */}
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
        <DialogContent className="w-[95%] sm:w-[90%] md:w-full max-w-4xl mx-auto max-h-[90vh] overflow-y-auto p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="w-full"
          >
            {/* Video Container */}
            <div className="relative w-full bg-black rounded-lg overflow-hidden">
              {/* Aspect Ratio Container (16:9) */}
              <div className="relative w-full pt-[56.25%] mt-2">
                <video
                  className="absolute top-0 left-0 w-full h-full"
                  controls
                  controlsList="nodownload"
                  preload="none"
                  poster={THUMBNAIL_URL}
                  src={VIDEO_URL}
                />
              </div>
            </div>

            {/* Video Description */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-6 text-center"
            >
              <h3 className="text-2xl font-namian-bold text-[#1E4C44] mb-2">
                See Yakudi in Action
              </h3>
              <p className="text-foreground/70 font-sharp-medium mb-3">
                Watch how Yakudi makes peer-to-peer lending simple, secure, and accessible on WhatsApp
              </p>
            </motion.div>
          </motion.div>
        </DialogContent>
      </Dialog>
    </>
  );
};
