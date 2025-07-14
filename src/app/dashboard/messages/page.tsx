// /dashboard/messages/page.tsx
"use client";

import { IconMessageCircleOff } from "@tabler/icons-react";
import UnavailableFeature from "@/components/UnavailableFeature";

export default function MessagesPage() {
  return (
    <UnavailableFeature
      icon={
        <IconMessageCircleOff className="w-16 h-16 text-muted-foreground" />
      }
      title="Messages Unavailable"
      featureName="Messages"
    />
  );
}
