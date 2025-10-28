interface OTPData {
  code: string;
  expires: number;
}

const otpStore = new Map<string, OTPData>();

export const setOTP = (phone: string, code: string) => {
  otpStore.set(phone, {
    code,
    expires: Date.now() + 5 * 60 * 1000 // 5 minutes
  });
};

export const getOTP = (phone: string): string | null => {
  const data = otpStore.get(phone);
  if (!data) return null;
  
  if (Date.now() > data.expires) {
    otpStore.delete(phone);
    return null;
  }
  
  return data.code;
};

export const deleteOTP = (phone: string) => {
  otpStore.delete(phone);
};

export default otpStore;
