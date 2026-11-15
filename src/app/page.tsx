"use client";

import dynamic from "next/dynamic";

const YatraApp = dynamic(
  () => import("@/components/yatra-app").then((module) => module.YatraApp),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-dvh items-center justify-center bg-cream">
        <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-forest-soft/60">
          Preparing your yatra…
        </span>
      </div>
    ),
  },
);

export default function Page() {
  return <YatraApp />;
}
