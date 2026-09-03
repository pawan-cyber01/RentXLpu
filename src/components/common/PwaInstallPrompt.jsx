import { useState, useEffect } from 'react';
import { usePwaInstall } from '../../hooks/usePwaInstall';
import { Download, Smartphone, X, Sparkles, CheckCircle2 } from 'lucide-react';
import logo from '../../assets/logo.svg';

export default function PwaInstallPrompt() {
  const { isInstallable, isInstalled, promptInstall } = usePwaInstall();
  const [showPopup, setShowPopup] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  useEffect(() => {
    // Show popup after 3 seconds if not dismissed previously in session
    const dismissed = sessionStorage.getItem('pwa_prompt_dismissed');
    if (!dismissed && !isInstalled) {
      const timer = setTimeout(() => {
        setShowPopup(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isInstalled]);

  const handleInstallClick = async () => {
    const success = await promptInstall();
    if (!success) {
      // If browser doesn't support native prompt trigger, show clear manual instructions
      setShowInstructions(true);
    } else {
      setShowPopup(false);
    }
  };

  const handleDismiss = () => {
    setShowPopup(false);
    sessionStorage.setItem('pwa_prompt_dismissed', 'true');
  };

  if (isInstalled || !showPopup) return null;

  return (
    <>
      {/* Translucent Claymorphic Bottom Popup Banner */}
      <div style={{
        position: 'fixed',
        bottom: 'calc(var(--bottom-nav-height) + 16px)',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'calc(100% - 32px)',
        maxWidth: 460,
        zIndex: 450,
        background: 'var(--bg-tertiary)',
        border: '1.5px solid var(--primary-500)',
        borderRadius: 'var(--radius-2xl)',
        padding: 'var(--space-4)',
        backdropFilter: 'blur(24px) saturate(200%)',
        WebkitBackdropFilter: 'blur(24px) saturate(200%)',
        boxShadow: '0 12px 36px rgba(0, 0, 0, 0.35), 0 0 24px rgba(251, 192, 45, 0.25)',
        animation: 'slideUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)'
      }}>
        <button
          className="btn-icon btn-ghost btn-sm"
          onClick={handleDismiss}
          style={{ position: 'absolute', top: 10, right: 10 }}
          aria-label="Close"
        >
          <X size={16} />
        </button>

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)' }}>
          {/* App Icon */}
          <div style={{
            width: 48,
            height: 48,
            borderRadius: 'var(--radius-xl)',
            background: 'linear-gradient(135deg, #fbc02d, #f57f17)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: '0 6px 16px rgba(251, 192, 45, 0.4)'
          }}>
            <img src={logo} alt="RentX" style={{ width: 28, height: 28 }} />
          </div>

          <div style={{ flex: 1, paddingRight: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-extrabold)', margin: 0 }}>
                Install RentX App
              </h3>
              <Sparkles size={14} color="var(--primary-500)" />
            </div>
            <p className="text-xs text-secondary" style={{ marginTop: 2, marginBottom: 0, lineHeight: 1.4 }}>
              Install on your home screen for faster browsing & instant campus marketplace access!
            </p>

            <div style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 'var(--space-3)' }}>
              <button
                className="btn btn-primary btn-sm"
                onClick={handleInstallClick}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  borderRadius: 'var(--radius-lg)',
                  fontWeight: 'var(--font-bold)',
                  boxShadow: '0 4px 14px rgba(251, 192, 45, 0.4)'
                }}
              >
                <Download size={14} />
                <span>Install Now</span>
              </button>
              <button
                className="btn btn-secondary btn-sm"
                onClick={handleDismiss}
                style={{ borderRadius: 'var(--radius-lg)', fontSize: '11px' }}
              >
                Later
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MANUAL INSTALL INSTRUCTIONS MODAL (If browser blocks native prompt) */}
      {showInstructions && (
        <div className="overlay" style={{ zIndex: 1000 }}>
          <div className="modal glass-card card-body" style={{ width: '90%', maxWidth: 420, position: 'relative' }}>
            <button
              className="btn-icon btn-ghost"
              onClick={() => setShowInstructions(false)}
              style={{ position: 'absolute', top: 12, right: 12 }}
            >
              <X size={20} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 'var(--space-4)' }}>
              <Smartphone size={24} color="var(--primary-500)" />
              <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)', margin: 0 }}>
                How to Install RentX
              </h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', fontSize: 'var(--text-sm)' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <CheckCircle2 size={18} color="var(--primary-500)" style={{ flexShrink: 0, marginTop: 2 }} />
                <div>
                  <strong>Android / Chrome / Edge:</strong><br />
                  Tap the browser menu <strong>(⋮)</strong> and select <strong>"Add to Home screen"</strong> or <strong>"Install App"</strong>.
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <CheckCircle2 size={18} color="var(--primary-500)" style={{ flexShrink: 0, marginTop: 2 }} />
                <div>
                  <strong>iPhone / iOS Safari:</strong><br />
                  Tap the Share button <strong>(⎋)</strong> at the bottom and select <strong>"Add to Home Screen"</strong>.
                </div>
              </div>
            </div>

            <button
              className="btn btn-primary btn-full"
              onClick={() => { setShowInstructions(false); setShowPopup(false); }}
              style={{ marginTop: 'var(--space-4)', borderRadius: 'var(--radius-xl)' }}
            >
              Got it!
            </button>
          </div>
        </div>
      )}
    </>
  );
}
