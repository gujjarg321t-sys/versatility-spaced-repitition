import React, { useState } from 'react';
import { Fingerprint, Lock, ShieldCheck, Sparkles } from 'lucide-react';
import { authenticateWithBiometrics } from '../utils/biometric';
import { playRevisionChime } from '../utils/notifications';

interface BiometricLockScreenProps {
  onUnlock: () => void;
}

export const BiometricLockScreen: React.FC<BiometricLockScreenProps> = ({ onUnlock }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanSuccess, setScanSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFingerTouch = async () => {
    if (isScanning) return;
    setIsScanning(true);
    setErrorMessage(null);

    try {
      // Trigger WebAuthn or touch animation
      await authenticateWithBiometrics();

      // Realistic scanning feedback
      setTimeout(() => {
        setIsScanning(false);
        setScanSuccess(true);
        playRevisionChime();

        setTimeout(() => {
          onUnlock();
        }, 600);
      }, 900);
    } catch {
      setIsScanning(false);
      setErrorMessage('Fingerprint mismatch. Please touch again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#060503] flex flex-col items-center justify-between p-6 select-none">
      {/* Top Brand Crest */}
      <div className="pt-10 flex flex-col items-center space-y-2 text-center">
        <div className="w-16 h-16 rounded-full border-2 border-[#D4AF37] p-1 shadow-[0_0_25px_rgba(212,175,55,0.4)] overflow-hidden bg-black flex items-center justify-center">
          <img
            src="/assets/aistudio/app-icon_c51e9ee0.jpg"
            alt="Versatility Logo"
            className="w-full h-full object-cover rounded-full"
          />
        </div>

        <div>
          <h1 className="text-xl sm:text-2xl font-cinzel font-extrabold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-[#FFF5C6] via-[#D4AF37] to-[#AA771C]">
            VERSATILITY
          </h1>
          <p className="text-[10px] tracking-[0.3em] text-[#C7A75C] uppercase font-light mt-0.5">
            PRIVATE BIOMETRIC VAULT
          </p>
        </div>
      </div>

      {/* Center: Fingerprint Scanner */}
      <div className="flex flex-col items-center space-y-5 my-auto">
        <div
          onClick={handleFingerTouch}
          className={`relative w-28 h-28 sm:w-32 sm:h-32 rounded-3xl border-2 flex items-center justify-center transition-all duration-300 cursor-pointer shadow-[0_0_35px_rgba(0,0,0,0.9)] ${
            scanSuccess
              ? 'border-emerald-400 bg-emerald-950/40 text-emerald-300 shadow-[0_0_30px_rgba(52,211,153,0.5)]'
              : isScanning
              ? 'border-[#D4AF37] bg-[#221B10] shadow-[0_0_40px_rgba(212,175,55,0.6)] scale-105'
              : 'border-[#D4AF37]/50 bg-[#14110A] text-[#D4AF37] hover:border-[#D4AF37] hover:scale-102'
          }`}
        >
          {/* Laser scanning beam */}
          {isScanning && (
            <div className="absolute inset-x-2 h-1 bg-gradient-to-r from-transparent via-[#FFF2B2] to-transparent rounded-full shadow-[0_0_15px_#D4AF37] animate-bounce pointer-events-none"></div>
          )}

          {scanSuccess ? (
            <ShieldCheck className="w-16 h-16 text-emerald-400 stroke-[2.2] animate-scale-in" />
          ) : (
            <Fingerprint
              className={`w-16 h-16 transition-all ${
                isScanning ? 'text-[#FFF2B2] animate-pulse stroke-[2.5]' : 'text-[#D4AF37]'
              }`}
            />
          )}

          {/* Corner gold brackets */}
          <div className="absolute top-1 left-1 w-2.5 h-2.5 border-t-2 border-l-2 border-[#D4AF37]"></div>
          <div className="absolute top-1 right-1 w-2.5 h-2.5 border-t-2 border-r-2 border-[#D4AF37]"></div>
          <div className="absolute bottom-1 left-1 w-2.5 h-2.5 border-b-2 border-l-2 border-[#D4AF37]"></div>
          <div className="absolute bottom-1 right-1 w-2.5 h-2.5 border-b-2 border-r-2 border-[#D4AF37]"></div>
        </div>

        <div className="text-center space-y-1">
          <p className="font-cinzel text-sm sm:text-base font-bold text-[#FFF3BE]">
            {scanSuccess
              ? 'Fingerprint Verified • Welcome Queen'
              : isScanning
              ? 'Scanning Fingerprint Sensor...'
              : 'Touch Sensor With Finger to Unlock'}
          </p>
          <p className="text-xs text-[#8C8069]">
            {errorMessage ? (
              <span className="text-red-400 font-semibold">{errorMessage}</span>
            ) : (
              'Protected by Empire Biometric Encryption'
            )}
          </p>
        </div>
      </div>

      {/* Footer Info */}
      <div className="pb-6 text-center text-[11px] text-[#7A705E] font-mono">
        <span>Offline Encrypted Vault • Touch Fingerprint to Enter</span>
      </div>
    </div>
  );
};
