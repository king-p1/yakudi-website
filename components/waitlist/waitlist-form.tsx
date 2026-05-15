/* eslint-disable @typescript-eslint/no-explicit-any */

'use client';

import { useState, useEffect } from 'react';
import { useDebounce } from 'use-debounce';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { submitWaitlistEntry } from '@/app/actions/waitlist';
import { toast } from 'sonner';
import { PartyPopper } from '@/components/animate-ui/icons/party-popper';

const COUNTRY_PHONE_LENGTHS: Record<string, { min: number; max: number }> = {
  ng: { min: 10, max: 10 },
  us: { min: 10, max: 10 },
  ca: { min: 10, max: 10 },
  gb: { min: 10, max: 10 },
};

const validateNigerianPhone = (digitsWithoutDialCode: string): boolean => {
  if (digitsWithoutDialCode.length !== 10) return false;
  return ['7', '8', '9'].includes(digitsWithoutDialCode[0]);
};

const validateEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
};

export const WaitlistForm = ({ isStacked, onSuccess, showInternalSuccess = true }: {
  isStacked?: boolean;
  onSuccess?: () => void;
  showInternalSuccess?: boolean;
}) => {
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('ng');
  const [debouncedPhone] = useDebounce(phone, 500);
  const [isPhoneValid, setIsPhoneValid] = useState(false);
  const [isPhoneValidating, setIsPhoneValidating] = useState(false);

  const [email, setEmail] = useState('');
  const [debouncedEmail] = useDebounce(email, 500);
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isEmailValidating, setIsEmailValidating] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [animateKey, setAnimateKey] = useState(0);

  const canSubmit = isPhoneValid && isEmailValid && !isSubmitting;

  useEffect(() => {
    const totalCycle = 3000;
    const interval = setInterval(() => setAnimateKey(prev => prev + 1), totalCycle);
    return () => clearInterval(interval);
  }, []);

  const validatePhoneByCountry = (phoneValue: string, country: string) => {
    if (!phoneValue) return false;
    const digitsOnly = phoneValue.replace(/\D/g, '');
    const rules = COUNTRY_PHONE_LENGTHS[country.toLowerCase()];
    if (!rules) return digitsOnly.length >= 10 && digitsOnly.length <= 15;

    const dialCodeLengths: Record<string, number> = { ng: 3, us: 1, ca: 1, gb: 2 };
    const dialCodeLength = dialCodeLengths[country.toLowerCase()] || 0;
    const numberWithoutDialCode = digitsOnly.slice(dialCodeLength);

    if (country.toLowerCase() === 'ng') return validateNigerianPhone(numberWithoutDialCode);
    return numberWithoutDialCode.length >= rules.min && numberWithoutDialCode.length <= rules.max;
  };

  const handlePhoneChange = (phoneValue: string, data: any) => {
    setPhone(phoneValue);
    setCountryCode(data.countryCode);
    if (phoneValue && !isPhoneValid) setIsPhoneValidating(true);
  };

  useEffect(() => {
    if (debouncedPhone) {
      setIsPhoneValid(validatePhoneByCountry(debouncedPhone, countryCode));
      setIsPhoneValidating(false);
    } else {
      setIsPhoneValid(false);
      setIsPhoneValidating(false);
    }
  }, [debouncedPhone, countryCode]);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (e.target.value && !isEmailValid) setIsEmailValidating(true);
  };

  useEffect(() => {
    if (debouncedEmail) {
      setIsEmailValid(validateEmail(debouncedEmail));
      setIsEmailValidating(false);
    } else {
      setIsEmailValid(false);
      setIsEmailValidating(false);
    }
  }, [debouncedEmail]);

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setIsSubmitting(true);
    try {
      const result = await submitWaitlistEntry(`+${phone}`, email.toLowerCase().trim());
      if (result.success) {
        setShowSuccessDialog(true);
        onSuccess?.();
        setTimeout(() => {
          setPhone('');
          setEmail('');
          setIsPhoneValid(false);
          setIsEmailValid(false);
        }, 500);
      } else {
        toast.error(result.error || 'Failed to join waitlist');
      }
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && canSubmit) handleSubmit();
  };

  return (
    <>
      <div className={cn('w-full space-y-4', !isStacked && 'max-w-4xl')}>
        {/* Phone Input */}
        <div className="relative w-full">
          <div
            className={cn(
              'relative rounded-[4px] flex justify-start items-center border transition-all duration-300 h-[58px]',
              isPhoneValid
                ? 'border-primary bg-background shadow-lg shadow-primary/10'
                : 'border-input bg-background hover:border-primary/50',
              'focus-within:ring-2 focus-within:ring-primary/20'
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
                placeholder="Enter your WhatsApp number"
                disableSearchIcon={false}
                dropdownStyle={{ top: '100%', bottom: 'auto' }}
                inputProps={{ name: 'phone', required: true, autoFocus: false }}
              />
            </div>
            <AnimatePresence>
              {isPhoneValidating && (
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
            <AnimatePresence>
              {isPhoneValid && !isPhoneValidating && (
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
          <AnimatePresence mode="wait">
            {phone && !isPhoneValidating && !isPhoneValid && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-sm text-destructive font-semibold mt-2 text-center"
              >
                Please enter a valid {countryCode.toUpperCase()} phone number
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Email Input */}
        <div className="relative w-full">
          <div
            className={cn(
              'relative rounded-[4px] flex items-center border transition-all duration-300 h-[58px] px-4',
              isEmailValid
                ? 'border-primary bg-background shadow-lg shadow-primary/10'
                : 'border-input bg-background hover:border-primary/50',
              'focus-within:ring-2 focus-within:ring-primary/20'
            )}
            onKeyDown={handleKeyDown}
          >
            <input
              type="email"
              value={email}
              onChange={handleEmailChange}
              disabled={isSubmitting}
              placeholder="Enter your email address"
              className="flex-1 bg-transparent outline-none text-sm font-sharp-medium text-foreground placeholder:text-muted-foreground pr-8"
            />
            <AnimatePresence>
              {isEmailValidating && (
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
            <AnimatePresence>
              {isEmailValid && !isEmailValidating && (
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
          <AnimatePresence mode="wait">
            {email && !isEmailValidating && !isEmailValid && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-sm text-destructive font-semibold mt-2 text-center"
              >
                Please enter a valid email address
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Submit Button */}
        <motion.button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className={cn(
            'w-full h-14 rounded-[4px] font-sharp-medium text-white',
            'flex items-center justify-center gap-2',
            'transition-all duration-300',
            canSubmit
              ? 'bg-[#1E4C44] hover:bg-[#1E4C44]/90 cursor-pointer shadow-lg shadow-primary/25'
              : 'bg-[#245a51]  cursor-not-allowed'
          )}
          whileHover={canSubmit ? { scale: 1.02 } : {}}
          whileTap={canSubmit ? { scale: 0.98 } : {}}
          animate={
            canSubmit
              ? {
                  boxShadow: [
                    '0 10px 25px -5px rgba(var(--primary), 0.25)',
                    '0 10px 35px -5px rgba(var(--primary), 0.4)',
                    '0 10px 25px -5px rgba(var(--primary), 0.25)',
                  ],
                }
              : {}
          }
          transition={{ duration: 2, repeat: canSubmit ? Infinity : 0 }}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Joining...</span>
            </>
          ) : (
            <span>Join Waitlist</span>
          )}
        </motion.button>
      </div>

      {/* Success Dialog */}
      <AnimatePresence>
        {showSuccessDialog && showInternalSuccess && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              onClick={() => setShowSuccessDialog(false)}
            />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                className="py-8 px-4 relative bg-background rounded-2xl shadow-2xl max-w-md w-full"
              >
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 15 }}
                  className="flex justify-center mb-6"
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
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-center space-y-3"
                >
                  <h3 className="text-3xl font-namian-bold text-[#1E4C44]">Hurray!</h3>
                  <p className="text-muted-foreground font-sharp-medium">
                    You&apos;ve successfully joined the waitlist!
                    <br />
                    We&apos;ll notify you as soon as Yakudi launches.
                  </p>
                </motion.div>
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
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
