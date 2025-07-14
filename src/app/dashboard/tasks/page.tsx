// /dashboard/tasks/page.tsx
"use client";

import { IconClipboardOff } from "@tabler/icons-react";
import UnavailableFeature from "@/components/UnavailableFeature";

export default function TasksPage() {
  return (
    <UnavailableFeature
      icon={<IconClipboardOff className="w-16 h-16 text-muted-foreground" />}
      title="Tasks Unavailable"
      featureName="Tasks"
    />
  );
}
