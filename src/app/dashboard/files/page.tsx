// /dashboard/performance/page.tsx
"use client";

import { IconTrendingUp } from "@tabler/icons-react";
import UnavailableFeature from "@/components/UnavailableFeature";

export default function PerformancePage() {
  return (
    <UnavailableFeature
      icon={<IconTrendingUp className="w-16 h-16 text-muted-foreground" />}
      title="Files Unavailable"
      featureName="Files"
    />
  );
}
