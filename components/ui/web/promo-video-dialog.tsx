'use client';

import { motion } from 'framer-motion';

const VIDEO_URL = 'https://ik.imagekit.io/4jn92qn70/yakudi-promo-video.mp4';
const THUMBNAIL_URL = 'https://ik.imagekit.io/4jn92qn70/yakudi-promo-video.mp4/ik-thumbnail.jpg';

export const PromoVideoDialog = () => {
  return (
    <section className="py-12 lg:py-16 w-full flex items-center justify-center mobile-top-reduce mt-2 mb-2">
      <div className="w-full max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 md:mb-12"
        >
          <h2 className="font-namian-semibold text-3xl md:text-4xl text-[#1E4C44]">
            More about Yakudi
          </h2>
        </motion.div>

        {/* Video Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative w-full bg-black rounded-lg overflow-hidden shadow-2xl mx-auto -mt-3 md:mt-22"
        >
          {/* Aspect Ratio Container (16:9) */}
          <div className="relative w-full pt-[56.25%]">
            <video
              className="absolute top-0 left-0 w-full h-full"
              controls
              controlsList="nodownload"
              preload="none"
              poster={THUMBNAIL_URL}
              src={VIDEO_URL}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};
