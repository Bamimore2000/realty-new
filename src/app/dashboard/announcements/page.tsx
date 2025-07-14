// /dashboard/announcements/page.tsx
"use client";

import { IconSpeakerphone } from "@tabler/icons-react";
import UnavailableFeature from "@/components/UnavailableFeature";

export default function AnnouncementsPage() {
  return (
    <UnavailableFeature
      icon={<IconSpeakerphone className="w-16 h-16 text-muted-foreground" />}
      title="Announcements Unavailable"
      featureName="Announcements"
    />
  );
}
