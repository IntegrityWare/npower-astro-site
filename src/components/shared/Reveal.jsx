import React, { useEffect, useRef, useState } from "react";

/**
 * Scroll-triggered reveal wrapper.
 * direction: "up" (default) | "left" | "right" | "scale"
 * delay: ms before the element animates once visible
 */
export default function Reveal({ children, direction = "up", delay = 0, className = "", as: Tag = "div" }) {
  const ref = useRef(null);
  // Headless renderers (crawler snapshots, prerenderers) never scroll, so
  // content would stay hidden at opacity 0 — show everything immediately for them.
  const isBot = typeof navigator !== "undefined" &&
    (navigator.webdriver || /bot|crawl|spider|prerender|headless|lighthouse/i.test(navigator.userAgent));
  const [visible, setVisible] = useState(isBot);

  useEffect(() => {
    if (isBot) return;
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const dirClass =
    direction === "left" ? "reveal-left" :
    direction === "right" ? "reveal-right" :
    direction === "scale" ? "reveal-scale" : "";

  return (
    <Tag
      ref={ref}
      className={`reveal ${dirClass} ${visible ? "is-visible" : ""} ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}