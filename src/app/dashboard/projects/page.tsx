"use client";

import { IconFolderOff } from "@tabler/icons-react";
import UnavailableFeature from "@/components/UnavailableFeature";

export default function ProjectsPage() {
  return (
    <UnavailableFeature
      icon={<IconFolderOff className="w-16 h-16 text-muted-foreground" />}
      title="Projects Unavailable"
      featureName="Projects"
    />
  );
}
