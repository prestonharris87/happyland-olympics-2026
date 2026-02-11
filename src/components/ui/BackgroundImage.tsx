"use client";

export default function BackgroundImage() {
  return (
    <div className="fixed inset-0 z-[-1]" aria-hidden="true">
      <picture>
        <source media="(orientation: portrait)" srcSet="/images/bg-portrait.webp" type="image/webp" />
        <source media="(orientation: portrait)" srcSet="/images/bg-portrait.jpg" type="image/jpeg" />
        <source media="(orientation: landscape)" srcSet="/images/bg-landscape.webp" type="image/webp" />
        <img
          src="/images/bg-landscape.jpg"
          alt=""
          className="w-full h-full object-cover"
          fetchPriority="high"
          loading="eager"
          decoding="async"
        />
      </picture>
    </div>
  );
}
