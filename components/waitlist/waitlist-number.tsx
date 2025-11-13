/* eslint-disable @typescript-eslint/no-explicit-any */
 
'use client';

import { useState, useEffect } from 'react';
import { useDebounce } from 'use-debounce';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { submitPhoneNumber } from '@/app/actions/waitlist';
import { toast } from 'sonner';
import { PartyPopper } from '@/components/animate-ui/icons/party-popper';

// Country-specific phone length validation
const COUNTRY_PHONE_LENGTHS: Record<string, { min: number; max: number }> = {
  ng: { min: 10, max: 11 }, // Nigeria: +234 XXX XXX XXXX (11 digits after +234)
  us: { min: 10, max: 10 }, // USA: +1 XXX XXX XXXX (10 digits after +1)
  ca: { min: 10, max: 10 }, // Canada: +1 XXX XXX XXXX (10 digits after +1)
  gb: { min: 10, max: 10 }, // UK: +44 XXXX XXXXXX (10 digits after +44)
};

export const WaitlistNumber = ({isStacked, onSuccess, showInternalSuccess = true}:{
  isStacked? : boolean
  onSuccess?: () => void
  showInternalSuccess?: boolean
}) => {
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('ng');
  const [debouncedPhone] = useDebounce(phone, 500);
  const [isValid, setIsValid] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [animateKey, setAnimateKey] = useState(0);

  useEffect(() => {
    const duration = 1500;
    const delay = 1500;
    const totalCycle = duration + delay;
    const interval = setInterval(() => {
      setAnimateKey(prev => prev + 1);
    }, totalCycle);

    return () => clearInterval(interval);
  }, []);

  const validatePhoneByCountry = (phoneValue: string, country: string) => {
    if (!phoneValue) return false;

    // Get digits only (remove country code)
    const digitsOnly = phoneValue.replace(/\D/g, '');
    
    // Get validation rules for country
    const rules = COUNTRY_PHONE_LENGTHS[country.toLowerCase()];
    
    if (!rules) {
      // Default validation for other countries
      return digitsOnly.length >= 10 && digitsOnly.length <= 15;
    }

    // Get country dial code length
    const dialCodeLengths: Record<string, number> = {
      ng: 3, // 234
      us: 1, // 1
      ca: 1, // 1
      gb: 2, // 44
    };

    const dialCodeLength = dialCodeLengths[country.toLowerCase()] || 0;
    const numberWithoutDialCode = digitsOnly.slice(dialCodeLength);

    return (
      numberWithoutDialCode.length >= rules.min &&
      numberWithoutDialCode.length <= rules.max
    );
  };

  const handlePhoneChange = (phoneValue: string, data: any) => {
    setPhone(phoneValue);
    setCountryCode(data.countryCode);
    
    if (phoneValue && !isValid) {
      setIsValidating(true);
    }
  };

  useEffect(() => {
    if (debouncedPhone) {
      const valid = validatePhoneByCountry(debouncedPhone, countryCode);
      setIsValid(valid);
      setIsValidating(false);
    } else {
      setIsValid(false);
      setIsValidating(false);
    }
  }, [debouncedPhone, countryCode]);

  const handleSubmit = async () => {
    if (!isValid || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const result = await submitPhoneNumber(`+${phone}`);

      if (result.success) {
        setShowSuccessDialog(true);
        onSuccess?.();

        // Reset form after showing dialog
        setTimeout(() => {
          setPhone('');
          setIsValid(false);
        }, 500);
      } else {
        toast.error(result.error || 'Failed to join waitlist');
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && isValid && !isSubmitting) {
      handleSubmit();
    }
  };

  const closeSuccessDialog = () => {
    setShowSuccessDialog(false);
  };

  return (
    <>
      <div className={cn("w-full space-y-6", !isStacked && "max-w-4xl")}>
        {/* Header */}


        {/* Phone Input + Button */}
        <div className={cn(
          isStacked
            ? "flex flex-col gap-4"
            : "flex flex-col sm:flex-row gap-3 sm:gap-4"
        )}>

        <div className={cn("space-y-3 flex-1", isStacked ? "w-full" : "grow")}>
          {/* Phone Input Container */}
          <div className="relative w-full">
            <div
              className={cn(
                'relative  rounded-[4px] flex justify-start items-center  border transition-all duration-300 h-[58px]',
                isValid
                  ? 'border-primary bg-background shadow-lg shadow-primary/10'
                  : 'border-input bg-background hover:border-primary/50',
                'focus-within:ring-2 focus-within:ring-primary/20 focus:border-none'
              )}
              onKeyDown={handleKeyDown}
            >
              <div className="phone-input-wrapper">
                <PhoneInput
                  country={'ng'}
                  value={phone}
                  onChange={handlePhoneChange}
                  disabled={isSubmitting}
                  containerClass="custom-phone-container"
                  inputClass="custom-phone-input"
                  buttonClass="custom-phone-button"
                  dropdownClass="custom-phone-dropdown"
                  searchClass="custom-phone-search"
                  enableSearch
                  searchPlaceholder="Search countries..."
                  placeholder='Enter your WhatsApp number'
                  disableSearchIcon={false}
                  dropdownStyle={{ top: '100%', bottom: 'auto' }}
                  inputProps={{
                    name: 'phone',
                    required: true,
                    autoFocus: false,
                  }}
                />
              </div>

              {/* Validation Spinner */}
              <AnimatePresence>
                {isValidating && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Valid Checkmark */}
              <AnimatePresence>
                {isValid && !isValidating && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    <div className="h-6 w-6 rounded-full bg-green-500/20 flex items-center justify-center">
                      <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Validation Helper Text */}
            <AnimatePresence mode="wait">
              {phone && !isValidating && !isValid && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-xs text-destructive mt-2 text-center"
                >
                  Please enter a valid {countryCode.toUpperCase()} phone number
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* Join Button */}
          </div>

          <motion.button
            onClick={handleSubmit}
            disabled={!isValid || isSubmitting}
            className={cn(
              'h-14 rounded-[4px] font-sharp-medium text-white bg-[#1E4C44] hover:bg-[#1E4C44]/90',
              'flex items-center justify-center gap-2',
              'transition-all duration-300',
              'disabled:bg-[#1E4C44] disabled:text-white disabled:cursor-not-allowed',
              isStacked ? 'w-full' : 'w-full sm:w-[140px]',
              isValid
                ? 'cursor-pointer text-primary-foreground shadow-lg shadow-primary/25 bg-[#1E4C44] hover:bg-[#1E4C44]/90'
                : 'bg-muted text-muted-foreground '
            )}
            whileHover={isValid ? { scale: 1.02 } : {}}
            whileTap={isValid ? { scale: 0.98 } : {}}
            animate={
              isValid
                ? {
                    boxShadow: [
                      '0 10px 25px -5px rgba(var(--primary), 0.25)',
                      '0 10px 35px -5px rgba(var(--primary), 0.4)',
                      '0 10px 25px -5px rgba(var(--primary), 0.25)',
                    ],
                  }
                : {}
            }
            transition={{ duration: 2, repeat: isValid ? Infinity : 0 }}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Joining...</span>
              </>
            ) : (
              <>
                <span>Join Waitlist</span>
                {/* <ArrowRight className="h-5 w-5" /> */}
              </>
            )}
          </motion.button>
          </div>

         
      </div>

      {/* Success Dialog */}
      <AnimatePresence>
        {showSuccessDialog && showInternalSuccess && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              onClick={closeSuccessDialog}
            />

            {/* Dialog */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                className="py-8 px-4 relative bg-background rounded-2xl shadow-2xl max-w-md w-full"
              >
                {/* Success Icon with Animation */}
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 15 }}
                  className="flex justify-center mb-6"
                >
                  <div className="relative">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.4, type: 'spring' }}
                      className="relative flex items-center justify-center w-16 h-16"
                    >
                      <div className="w-16 h-16 bg-[#1B5E40] rounded-full flex items-center justify-center">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.6 }}
                        >
                          <PartyPopper animate={'default'} key={animateKey} className="w-8 h-8 text-white" />
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
                  <h3 className="text-3xl font-namian-bold text-[#1E4C44]">Hurray! </h3>
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
                  onClick={closeSuccessDialog}
                  className="w-full mt-8 px-6 py-3 bg-[#1E4C44] text-white font-sharp-semibold rounded-lg hover:bg-[#1E4C44]/90 transition-colors cursor-pointer"
                >
                  Close
                </motion.button>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};