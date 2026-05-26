import { useMemo } from "react";

const APPLE_URL = "https://apps.apple.com/us/app/stepup-pedometer-step-counter/id979101825";
const ANDROID_URL = "https://play.google.com/store/apps/details?id=com.thestepupapp.stepup";

const guideSections = [
  {
    title: "How StepUp Works",
    steps: [
      "StepUp does not usually connect directly to your watch.",
      "On iPhone, StepUp reads your steps through Apple Health.",
      "On Android, StepUp reads your steps through Health Connect.",
      "If your device syncs steps into Apple Health or Health Connect, StepUp can usually use it.",
    ],
  },
  {
    title: "iPhone Only",
    steps: [
      "Download StepUp and sign in.",
      "Allow Apple Health permissions when prompted.",
      "Keep your phone on you during the day so your steps are counted.",
    ],
  },
  {
    title: "iPhone + Apple Watch",
    steps: [
      "Make sure your Apple Watch is paired to your iPhone.",
      "Open StepUp and go to Settings -> Sync Wearable.",
      "Allow Apple Health access and wear your watch daily.",
      "If steps look wrong, open Health -> Steps -> Data Sources & Access and move Apple Watch to the top.",
    ],
  },
  {
    title: "iPhone + Other Watches",
    steps: [
      "Pair your watch inside its own app first.",
      "Turn on Apple Health sync in that watch app.",
      "Open StepUp and allow Apple Health access.",
      "If counts look off, fix source priority in Apple Health.",
    ],
  },
  {
    title: "Android Only",
    steps: [
      "Download StepUp.",
      "Install or open Health Connect if needed.",
      "Open StepUp and allow permissions.",
      "Confirm StepUp can read steps in Health Connect.",
    ],
  },
  {
    title: "Android + Watches",
    steps: [
      "Pair your watch with its companion app.",
      "Make sure that app syncs your steps into Health Connect.",
      "Open StepUp and connect Health Connect from Sync Wearable or setup.",
      "Confirm permissions inside Health Connect if data is missing.",
    ],
  },
  {
    title: "Watch Types",
    steps: [
      "Apple Watch works through Apple Health and is usually the most reliable setup on iPhone.",
      "Fitbit, Garmin, Samsung, Oura, WHOOP, Withings, and similar devices need to sync through Apple Health or Health Connect first.",
      "Budget trackers can work too if they sync step data into the right health hub.",
    ],
  },
  {
    title: "Troubleshooting",
    steps: [
      "Open your watch app and sync manually first.",
      "Check Apple Health on iPhone or Health Connect on Android to confirm steps are there.",
      "Make sure StepUp still has permission to read steps.",
      "Restart StepUp, walk a few minutes, and check again.",
      "StepUp does not allow manual step entry, and some sync delays are normal.",
    ],
  },
  {
    title: "Best Setups",
    steps: [
      "Best overall: iPhone + Apple Watch.",
      "Best Android setup: Android + Health Connect + watch.",
      "Simplest setup: just use your phone.",
    ],
  },
];

export function SetupGuideModal({ isOpen, onClose }) {
  const downloadConfig = useMemo(() => {
    if (typeof navigator === "undefined") {
      return {
        label: "Download StepUp",
        href: APPLE_URL,
        detail: "Choose the right store for your device.",
      };
    }

    const userAgent = navigator.userAgent.toLowerCase();
    const isAndroid = /android/.test(userAgent);
    const isApple = /iphone|ipad|ipod/.test(userAgent);

    if (isAndroid) {
      return {
        label: "Download on Google Play",
        href: ANDROID_URL,
        detail: "Android device detected",
      };
    }

    if (isApple) {
      return {
        label: "Download on the App Store",
        href: APPLE_URL,
        detail: "Apple device detected",
      };
    }

    return {
      label: "Download StepUp",
      href: APPLE_URL,
      detail: "Best for iPhone and Apple Watch. Android users can use Google Play.",
    };
  }, []);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="guide-overlay" role="dialog" aria-modal="true" aria-labelledby="setup-guide-title">
      <div className="guide-backdrop" onClick={onClose} />
      <section className="guide-panel">
        <div className="guide-panel__header">
          <div>
            <p className="eyebrow">StepUp Tips</p>
            <h2 id="setup-guide-title">StepUp Setup Guide</h2>
            <p className="guide-panel__subtitle">
              Quick setup help for iPhone, Android, and watches so everyone&apos;s steps count correctly.
            </p>
          </div>

          <button type="button" className="guide-close" onClick={onClose} aria-label="Close setup guide">
            ×
          </button>
        </div>

        <div className="guide-download">
          <div>
            <p className="guide-download__eyebrow">Get The App</p>
            <strong>{downloadConfig.detail}</strong>
          </div>
          <a
            className="guide-download__button"
            href={downloadConfig.href}
            target="_blank"
            rel="noreferrer"
          >
            {downloadConfig.label}
          </a>
        </div>

        <div className="guide-grid">
          {guideSections.map((section) => (
            <article key={section.title} className="guide-card">
              <h3>{section.title}</h3>
              <ul>
                {section.steps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
