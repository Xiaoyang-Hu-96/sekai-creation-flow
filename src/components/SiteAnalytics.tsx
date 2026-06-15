import { useEffect } from "react";
import { Analytics, track } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";

const checkpoints = [15, 30, 60, 120, 300];

export function SiteAnalytics() {
  useEffect(() => {
    let activeSeconds = 0;
    const sent = new Set<number>();
    const timer = window.setInterval(() => {
      if (document.visibilityState !== "visible") return;
      activeSeconds += 1;
      checkpoints.forEach(seconds => {
        if (activeSeconds >= seconds && !sent.has(seconds)) {
          sent.add(seconds);
          track("Active time reached", { seconds });
        }
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  return <><Analytics /><SpeedInsights /></>;
}
