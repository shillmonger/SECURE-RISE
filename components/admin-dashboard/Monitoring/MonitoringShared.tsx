"use client";

import React from "react";

type UserStatus = "online" | "offline" | "away";

export function UserStatusBadge({ status }: { status: UserStatus }) {
  if (status === "online") return (
    <span className="relative flex h-2.5 w-2.5">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
    </span>
  );
  if (status === "away") return (
    <span className="relative flex h-2.5 w-2.5">
      <span className="animate-pulse absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-60" />
      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500" />
    </span>
  );
  return <span className="inline-flex rounded-full h-2.5 w-2.5 bg-rose-500/70" />;
}
