"use client";

import dynamic from "next/dynamic";

const IntroVideo = dynamic(() => import("./IntroVideo"), { ssr: false });

export default function IntroVideoLoader() {
  return <IntroVideo />;
}
