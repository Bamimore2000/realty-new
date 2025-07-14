// /dashboard/leave/page.tsx
"use client";

import { IconCalendarTime } from "@tabler/icons-react";
import UnavailableFeature from "@/components/UnavailableFeature";

export default function LeavePage() {
  return (
    <UnavailableFeature
      icon={<IconCalendarTime className="w-16 h-16 text-muted-foreground" />}
      title="Leave Management Unavailable"
      featureName="Leave Management"
    />
  );
}
