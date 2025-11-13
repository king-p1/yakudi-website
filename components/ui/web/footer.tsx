'use client';

import { motion } from 'framer-motion';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

 

  return (
    <footer className="relative bg-black text-white py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Main Footer Content */}
        <div className="text-center mb-8">
          {/* Brand Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="md:col-span-1"
          >
            <h3 className="font-namian-medium text-4xl text-[#DAFC85] p-2">
              Yakudi
            </h3>
             
          </motion.div>

          {/* Links Columns */}
         
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 my-6" />

        {/* Bottom Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-row  items-center justify-center gap-4"
        >
          {/* Copyright */}
          <p className="font-sharp-light text-sm text-white/60">
            © {currentYear} YAKUDI
          </p>
          <span className='font-sharp-medium text-md  text-white/60'>•</span>

          <p className="font-sharp-light text-sm text-white/60">
           Terms
          </p>

          <span className='font-sharp-medium text-md  text-white/60'>•</span>

          <p className="font-sharp-light text-sm text-white/60">
           Privacy
          </p>
 

       
        </motion.div>
      </div>
    </footer>
  );
};
