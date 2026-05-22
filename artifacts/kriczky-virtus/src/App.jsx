import React, { useState, useEffect, useRef, useCallback } from "react";

// ═══════════════════════════════════════════════════════════════════
// KRICZKY VIRTUS HOMEPAGE — v2
// Structural mirror of Valor homepage v19-c, adapted for the Virtus
// services brand. Primary conversion: the free Constraint Roadmap
// assessment (embedded live in the hero). Secondary: join the
// community waitlist (Build With Valor — founding member community).
//
// Sections, in order:
//  1.  Nav (fixed)
//  2.  HeroSection — headline + live MiniAssessment tabbed walkthrough
//  3.  SocialProof — early access + Edward credential + industry strip
//  4.  HowVirtusWorks — 3-stage ladder (Roadmap → Intensive → Partner)
//  5.  TestimonialStrip — client quotes with score rings
//  6.  HowItWorks — 5-step engagement journey (clickable left / mockup right)
//  7.  TestimonialStrip — 3-up quotes with score rings
//  8.  FoundingMemberSection — community waitlist (no Valor SW promises)
//  9.  ComparisonTable — With vs Without a partner in your corner
// 10.  PricingSection — Strategic Intensive + ongoing partner tiers
// 11.  CaseStudiesSection — video episodes (placeholder, exact v19-c shape)
// 12.  FAQSection — service-specific objections
// 13.  FinalCTA — dual-path (Roadmap / Community Waitlist)
// 14.  Footer
// The MiniAssessment is inlined at the very bottom under MA_ prefix.
// ═══════════════════════════════════════════════════════════════════

// ─── DESIGN TOKENS ───────────────────────────────────────────
const C = {
  gold: "#C8A24E", goldMuted: "#A68A42", goldLight: "#D4B665",
  green: "#34D399", red: "#F87171", amber: "#FBBF24",
  blue: "#60A5FA", cyan: "#22D3EE", purple: "#A78BFA",
  bgDeep: "#0A0E14", bgCard: "#111720", bgElev: "#1A2130", bgInput: "#0F141C",
  text1: "#E8ECF1", text2: "#8B95A5", text3: "#5A6474", text4: "#3D4654",
  border1: "rgba(255,255,255,0.06)", border2: "rgba(255,255,255,0.10)",
};
const GRAIN = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

// ─── RESPONSIVE HOOK ────────────────────────────────────────
const useBp = () => {
  const [bp, setBp] = useState("desktop");
  useEffect(() => {
    const check = () => {
      const w = window.innerWidth;
      setBp(w < 768 ? "mobile" : w < 1024 ? "tablet" : "desktop");
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  const mob = bp === "mobile";
  const tab = bp === "tablet";
  const desk = bp === "desktop";
  return { bp, mob, tab, desk };
};

const EDWARD_HEADSHOT = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAB4AHgDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD2kU8U0U8UAOFOFIKcKAFFed/Ej4u6B4GnaylEmoasBk2tuR+79N7H7v05PtVr40+LZvBngK71CxKi/mkW1tmYZCu2ct+ChiPfFfElxNLcXElxcyPLNKxd5HOSxJyST3NAHvepftL6rIgGmeHbKBs8tPM8uR6YG2m6J+0tqsdzJ/beh2Vxbt9wWjtE6fi24H9K8DLJgcHPfmtXSdE1DV0kOn2M9zs5YohIAoA+r/A3x28MeJbtLO+WXRbyRwkS3LBopCf+mgACn/eA+tes1+c95ZT2jsJoyhU4INfW37MvjK78S+ErnTdUmE13pDJGjk/O0LA7d3rt2kZ9MUAexUuKKKACilooASilxRQBQFPFMFPFADhThTRThQB4x+1W27wHpNsPvzamgH4Rv/jXnPwv+HNvHqsk/iO0iurUqogRzuznqxAr1j9o+1SfwbpUzkYt9WgJ/wB1gyn+YrmLPxJa6Oh8yCacxDkRgDb+JIFAHRXPwl8D3c4lbSWjbriKdlH5dK67wx4b0bw5ZvBo9p5StyxZyxP4muV8M/EXSPEUv2eyWVJxx5b4z+hNQeM/iNJ4auFtI9MM1w3OXY424yThQTxQBs+MPC+latp9x9osLYzkEpIIwGz9e/415p8ALc+H/ivqOmJ8sN3ZSAofVGVh/Wux0Dxf/b6gCaCQsA2xFdSg/wCBAZFUNMspLT4j3+v20AkewtgVh3bBM0iEEZ9hk/XFAHulKKgsrhLuzguYs+XNGsi59CM1PQAtFFFABRRRQBnCnioxUgoAeKcKaKcKAPNfjXp4u7CwmlDmGNZkIB4LFQRkf8ByPpXG2XhKw19Y7m42yOgztfJUE98V7brumx6tpktpKFy2GRj/AAuOQf8APrXiN0+oaDrN9pkW3z1ZlVQeDkZGD6YIoA0tO0my0nW7KGwWI3CbVJRQNqDOBx9TXUakllNcN/acYV+Ssh4IB68+hryfZLcSp5Or3Fjehy7/ACNucjjpgnA9q6zQ1mWRZL+91G+uGXYQY5DEffGMUAd3DaWdtZo1vtK4wvOeKpRWn2pmeKMGaOTCsDycqVK49DkflVPTo/s9mhZJIldjtil4KevFdp4Ts4TYLdvEpmd2KuRzt6D+tAG5bQi3toYVACxoqDHsMVJRRQA6ikozQAUUlFAGcDT1qJTUimgCUU4UxTTwaAHV5l8YdCJjt9es1YzxMsM6L1ZeSrD3HI+n0r0HVtTsdHsJb3VbuGztYlLvJM20Ae3c/Qc15Z4A8T/8LV8XeI2jMsGi2FulvYxt13u5Jmcf3jsAx2XjuaAMnQrm31Vk+0sHkHRgxB/Su90+zs7OAuihT3Zjkn8TXn/ibwtJp+pSITJY3ed3y8qwz95fUe4/Gr2jeHtXlCNq2tGS0PRIRgsPr2oA3JJG1XUPs9sTtH35eyL/AI16RpIjSwgiiZSIkVCAc7TgHB9Dgg/jWP4X0RJWW2s4tkC8yv8A3R9e5Ned/F/xc/w0+LWm6jbxNNpup6esd9ZoQCwjcqjr23gHAz1AIoA9oorF8J+KNI8WaWl/oV4lzCfvJ0kjPcOnVT+npmtnNAC0UlFABmikzRQBlqalU56VxfxD8d6b4F0uC71KOaeW4cpBbw4DOQMk5PAAyMn3FfMvjv4r+JfF5eB7j+ztNPAtLRioYf7bdX/Hj2oA+m/FfxT8JeF3eG/1RZ7xettZjznB9Dj5V/EivFPG37QOt6lvt/C1uukWx4898SXDD/0FPwBPvXiaqBinY5x60AWdRv77VrlrrVLy4vLhjkyTyF2P4mvdv2P7oReKtdscZ8+zSYfVJMfyevAFXbxkkV7/APsraUbi91fV7W6+z31kot1+QNuSVTnIPoUBHvQB9JfEDVPCWj6CJfGd5bW1ucmHef3pbHWID5ifoMeteS6F48+HslzbofEyWkM7kATwOsiDP8WAVTPqT+Aqp8Qfg+niG8vr261a/uNWnT9xPcSblRuy47KemB0zmvnbwr4a1DXPGFn4YhQ297NcG3mB6xbSfMLH/ZCsfwoA/RfSlsRpsJ0p4ZLN13RyROHVwf4gw659a+Nf2s7/AO2fFH7KDxY2UUWPRmy5/wDQhX0d8P8A4ex+C7SRdD1a+ht2+7ZyN5tuvvtPO49yCK+S/jqzP8VNdkkl82SSRZGIGMZUYUewGBQBwFje3em3kd3p1zPaXKH5ZYJCjD8RXsngz49+IdLCw+IYI9athx5hIinH/AgNrfiPxrxhk3MOfl7ipVPPFAH2J4V+MfhHxDNHb/a5NNu3OFivlCAn0DglfzIr0RHV03IQy/3lOR+dfn12rX8P+ItX8PXi3Wi6hc2co/55v8rD0ZehHsRQB93k0V4v8K/jN/wk2rWWha1ZLDqU4ZUuoGxHIyruwUPKkgHoSM+lFAHnn7VF15niLQrTPEVm8mPd5CP/AGQV4ivavV/2mQw+ItsWOVOnxYGenzPn9a8nTrigCUdaG4wfSm5p3UUAL0r3z9ki9VNa8RWRPzS20UwHrtcqf/QxXgQ5XnrXoXwD1c6T8StOy21LtJLRvcsuV/8AHlWgD668ea5Z+GvDN1rWoEeTaJ5m3u7dFQe5bA/GvjT4c+KH0P4maZ4gm+VGvC1wATgxykq498BiefSvWP2m/EbXunaRo0T4iMpnlAP3iq4AP4tXz0yeWrD+HBwfQ0AfpTeym30OaRTyEOCK+CPitP8AaPiR4jcHcBeMgP8AugL/AEr7ZN8ZfA9g7nmSGHcfqik18D65eHUNb1C8Jybi5lm/76cn+tAFEnHPpSoCq89e9Nc9B6mkZuKAJN1JvwaiDcVHK+AcUAdL8O7t7Tx54ZuEYqy6jAc+xcA/oaKzvCt/b6d4s0W8vSRa215DLKR2VXBP6CigDe+N+sprXxJ1SSBg0NsVtEIPXyxg/wDj26uFBw9LM7SzySSEs7sWJPck0wnDCgCalFN7UqmgBwOGx61a0m8On6rZ3iZ3W8yTDHX5WB/pVR+mR2pOD9DQB6h8c7lZPF/lRtuVQ0iHsVfaw/TFeeEiSMg/3SKfr2ryatd288xYyR20MBJ/6ZoFz+gqkJTgnv3oA+59f1AaZ8KDdM2Db2DS/iIsD9cV8PrkKAeoAFfT3xf1xovgzIiMB9o8i0/Anc2PwU18uF8KTQA8sN5PpxUbPTNxximEmgCUNUbHLge9IM55NNB/efQUAK565opDzRQA3oSD1pD1oooAkU8U4GiigB1NHBxRRQAYDOFJAz0J9aY2UJGMEcYoooA9X+KOvm78D+FdPV8mTzLuQZ9PkX/2evLCckD05oooAaTTc0UUALnimIfmoooAceKKKKAP/9k=";

// ─── ICON LIBRARY ────────────────────────────────────────────
const Icon = ({ children, size = 20, color = C.gold, glow = true }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
    style={glow ? { filter: `drop-shadow(0 0 6px ${color}60) drop-shadow(0 0 2px ${color}40)` } : {}}>{children}</svg>
);
const IconTarget = ({ size = 20, color = C.red }) => (<Icon size={size} color={color}><circle cx="12" cy="12" r="10" stroke={color}/><circle cx="12" cy="12" r="6" stroke={color}/><circle cx="12" cy="12" r="2" fill={color}/><line x1="12" y1="2" x2="12" y2="6" stroke={color}/><line x1="12" y1="18" x2="12" y2="22" stroke={color}/><line x1="2" y1="12" x2="6" y2="12" stroke={color}/><line x1="18" y1="12" x2="22" y2="12" stroke={color}/></Icon>);
const IconSearch = ({ size = 20, color = C.gold }) => (<Icon size={size} color={color}><circle cx="11" cy="11" r="8" stroke={color}/><line x1="21" y1="21" x2="16.65" y2="16.65" stroke={color}/></Icon>);
const IconWrench = ({ size = 20, color = C.green }) => (<Icon size={size} color={color}><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" stroke={color}/></Icon>);
const IconRefresh = ({ size = 20, color = C.blue }) => (<Icon size={size} color={color}><path d="M3 12a9 9 0 0 1 15-6.7L21 8" stroke={color}/><path d="M21 12a9 9 0 0 1-15 6.7L3 16" stroke={color}/><polyline points="21 3 21 8 16 8" stroke={color}/><polyline points="3 21 3 16 8 16" stroke={color}/></Icon>);
const IconClock = ({ size = 14, color = C.cyan }) => (<Icon size={size} color={color}><circle cx="12" cy="12" r="10" stroke={color}/><polyline points="12 6 12 12 16 14" stroke={color}/></Icon>);
const IconFlag = ({ size = 14, color = C.gold }) => (<Icon size={size} color={color}><path d="M4 21V4h14l-2 4 2 4H4" stroke={color} fill={`${color}15`}/></Icon>);
const IconChart = ({ size = 20, color = C.gold }) => (<Icon size={size} color={color}><rect x="3" y="12" width="4" height="9" rx="1" stroke={color} fill={`${color}15`}/><rect x="10" y="7" width="4" height="14" rx="1" stroke={color} fill={`${color}15`}/><rect x="17" y="3" width="4" height="18" rx="1" stroke={color} fill={`${color}15`}/></Icon>);
const IconTrendUp = ({ size = 20, color = C.green }) => (<Icon size={size} color={color}><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" stroke={color}/><polyline points="17 6 23 6 23 12" stroke={color}/></Icon>);
const IconUser = ({ size = 20, color = C.blue }) => (<Icon size={size} color={color}><circle cx="12" cy="8" r="4" stroke={color}/><path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1" stroke={color}/></Icon>);
const IconClipboard = ({ size = 20, color = C.blue }) => (<Icon size={size} color={color}><rect x="6" y="3" width="12" height="18" rx="2" stroke={color}/><line x1="9" y1="8" x2="15" y2="8" stroke={color}/><line x1="9" y1="12" x2="15" y2="12" stroke={color}/><line x1="9" y1="16" x2="12" y2="16" stroke={color}/></Icon>);
const IconDollar = ({ size = 20, color = C.cyan }) => (<Icon size={size} color={color}><circle cx="12" cy="12" r="10" stroke={color}/><path d="M12 6v12" stroke={color}/><path d="M15 9.5c0-1.4-1.3-2.5-3-2.5s-3 1.1-3 2.5 1.3 2.5 3 2.5 3 1.1 3 2.5-1.3 2.5-3 2.5" stroke={color}/></Icon>);
const IconShield = ({ size = 20, color = C.gold }) => (<Icon size={size} color={color}><path d="M12 2L3 7v5c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z" stroke={color}/><path d="M9 12l2 2 4-4" stroke={color}/></Icon>);
const IconLightning = ({ size = 20, color = C.amber }) => (<Icon size={size} color={color}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" stroke={color} fill={`${color}10`}/></Icon>);
const IconBenchmark = ({ size = 20, color = C.cyan }) => (<Icon size={size} color={color}><line x1="3" y1="20" x2="21" y2="20" stroke={color}/><polyline points="3 17 8 10 13 14 18 6 21 8" stroke={color}/><circle cx="8" cy="10" r="1.5" fill={color} opacity="0.6"/><circle cx="13" cy="14" r="1.5" fill={color} opacity="0.6"/><circle cx="18" cy="6" r="1.5" fill={color} opacity="0.6"/></Icon>);
const IconCheckList = ({ size = 20, color = C.green }) => (<Icon size={size} color={color}><path d="M4 7l3 3 5-5" stroke={color}/><line x1="14" y1="7" x2="20" y2="7" stroke={color}/><path d="M4 17l3 3 5-5" stroke={color}/><line x1="14" y1="17" x2="20" y2="17" stroke={color}/></Icon>);
const IconUsers = ({ size = 20, color = C.cyan }) => (<Icon size={size} color={color}><circle cx="9" cy="7" r="4" stroke={color}/><path d="M1 21v-1a5 5 0 0 1 5-5h6a5 5 0 0 1 5 5v1" stroke={color}/><circle cx="18" cy="8" r="3" stroke={color} opacity="0.5"/><path d="M21 21v-1a3.5 3.5 0 0 0-3-3.46" stroke={color} opacity="0.5"/></Icon>);
const IconCalendar = ({ size = 20, color = C.cyan }) => (<Icon size={size} color={color}><rect x="3" y="4" width="18" height="18" rx="2" stroke={color}/><line x1="16" y1="2" x2="16" y2="6" stroke={color}/><line x1="8" y1="2" x2="8" y2="6" stroke={color}/><line x1="3" y1="10" x2="21" y2="10" stroke={color}/></Icon>);

const IconBox = ({ children, color = C.gold, size = 40 }) => (
  <div style={{ width: size, height: size, borderRadius: size * 0.28, background: `linear-gradient(135deg,${color}12,${color}06)`, border: `1px solid ${color}25`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
    {children}
  </div>
);
const IconDoc = ({ size = 20, color = C.gold }) => (<Icon size={size} color={color}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke={color} fill={`${color}10`}/><polyline points="14 2 14 8 20 8" stroke={color}/><line x1="8" y1="13" x2="16" y2="13" stroke={color}/><line x1="8" y1="17" x2="14" y2="17" stroke={color}/></Icon>);
const IconHandshake = ({ size = 20, color = C.gold }) => (<Icon size={size} color={color}><path d="M6 12l6-6 6 6" stroke={color}/><path d="M2 12l4 4 4-4" stroke={color}/><path d="M22 12l-4 4-4-4" stroke={color}/><path d="M12 6v12" stroke={color}/></Icon>);
const IconMenu = ({ size = 24, color = C.text1 }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>);
const IconX = ({ size = 24, color = C.text1 }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>);
const IconPlay = ({ size = 24, color = "#fff" }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none"><polygon points="6 4 20 12 6 20 6 4" fill={color} stroke={color} strokeLinejoin="round"/></svg>);
const IconEye = ({ size = 14, color = C.text3 }) => (<Icon size={size} color={color}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke={color}/><circle cx="12" cy="12" r="3" stroke={color}/></Icon>);
const IconArrow = ({ size = 16, color = C.gold, dir = "right" }) => (<Icon size={size} color={color}>{dir === "right" ? <><line x1="5" y1="12" x2="19" y2="12" stroke={color}/><polyline points="12 5 19 12 12 19" stroke={color}/></> : <><line x1="19" y1="12" x2="5" y2="12" stroke={color}/><polyline points="12 19 5 12 12 5" stroke={color}/></>}</Icon>);

// ─── PRIMITIVES ──────────────────────────────────────────────
const Grain2 = () => <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 1, opacity: 0.07, mixBlendMode: "overlay", backgroundImage: GRAIN, backgroundSize: "128px 128px" }}/>;

const Caustic = ({ x, y, angle, width = 500, opacity = 0.2, color = C.gold, blur = 16, hide }) => {
  if (hide) return null;
  return (<div style={{ position: "absolute", left: x, top: y, width, height: 6, background: `linear-gradient(90deg,transparent,${color} 50%,transparent)`, filter: `blur(${blur}px)`, opacity, transform: `rotate(${angle}deg)`, pointerEvents: "none", zIndex: 2 }}/>);
};

const KVShield = ({ size = 28, glow = false }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none"
    style={glow ? { filter: `drop-shadow(0 0 12px ${C.gold}60) drop-shadow(0 0 4px ${C.gold}90)` } : {}}>
    <path d="M32 8L14 16V30C14 42 22 52 32 56C42 52 50 42 50 30V16L32 8Z"
      fill="none" stroke={C.gold} strokeWidth="2.5" strokeLinejoin="round"/>
    <path d="M32 12L18 18.5V30C18 40.5 24.5 49 32 52C39.5 49 46 40.5 46 30V18.5L32 12Z"
      fill="rgba(200,162,78,0.06)"/>
  </svg>
);

const Glass = ({ children, style, glow, intensity = "normal", hover = false }) => {
  const [h, setH] = useState(false);
  const s = intensity === "strong";
  return (
    <div
      onMouseEnter={hover ? () => setH(true) : undefined}
      onMouseLeave={hover ? () => setH(false) : undefined}
      style={{
        position: "relative", overflow: "hidden",
        background: s
          ? "linear-gradient(145deg,rgba(255,255,255,0.07),rgba(255,255,255,0.03) 50%,rgba(255,255,255,0.05))"
          : "linear-gradient(145deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02) 50%,rgba(255,255,255,0.04))",
        backdropFilter: "blur(16px) saturate(1.2)",
        WebkitBackdropFilter: "blur(16px) saturate(1.2)",
        border: `1px solid ${C.border2}`,
        borderTop: "1px solid rgba(255,255,255,0.16)",
        borderRadius: 18,
        boxShadow: glow
          ? `0 2px 4px rgba(0,0,0,0.2),0 8px 24px rgba(0,0,0,0.3),0 20px 48px rgba(0,0,0,0.2),inset 0 1px 0 rgba(255,255,255,0.09),0 0 60px ${glow}12,0 0 120px ${glow}06`
          : `0 2px 4px rgba(0,0,0,0.2),0 8px 24px rgba(0,0,0,0.3),0 20px 48px rgba(0,0,0,0.2),inset 0 1px 0 rgba(255,255,255,0.09)`,
        transition: "all 0.35s cubic-bezier(0.4,0,0.2,1)",
        transform: h ? "translateY(-4px)" : "none",
        ...(h && glow
          ? { boxShadow: `0 2px 4px rgba(0,0,0,0.2),0 12px 32px rgba(0,0,0,0.35),0 24px 56px rgba(0,0,0,0.25),inset 0 1px 0 rgba(255,255,255,0.12),0 0 80px ${glow}20,0 0 140px ${glow}0c` }
          : {}),
        ...style
      }}
    >
      {/* Diagonal shine — top-left to bottom-right */}
      <div style={{ position: "absolute", inset: 0, borderRadius: 18, background: "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 30%, transparent 50%, transparent 70%, rgba(255,255,255,0.03) 100%)", pointerEvents: "none", zIndex: 0 }}/>
      <div style={{ position: "relative", zIndex: 1 }}>{children}</div>
    </div>
  );
};

const Section = ({ children, gradient, style = {}, id }) => (
  <section id={id} style={{
    position: "relative", padding: "100px 0", overflow: "hidden",
    background: gradient || `radial-gradient(ellipse 80% 60% at 25% 85%,#221a08 0%,transparent 55%),radial-gradient(ellipse 60% 50% at 75% 15%,#151a30 0%,transparent 55%),linear-gradient(155deg,#070a10 0%,#0c1018 25%,#151208 50%,#0e1220 75%,#090d14 100%)`,
    ...style
  }}>
    <Grain2/>
    {children}
  </section>
);

const Box = ({ children, style = {} }) => {
  const { mob } = useBp();
  return <div style={{ maxWidth: 1200, margin: "0 auto", padding: mob ? "0 20px" : "0 40px", position: "relative", zIndex: 3, ...style }}>{children}</div>;
};

const Reveal = ({ children, delay = 0, style = {} }) => {
  const [v, setV] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const o = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setV(true); o.disconnect(); }
    }, { threshold: 0.1 });
    if (ref.current) o.observe(ref.current);
    return () => o.disconnect();
  }, []);
  return (
    <div ref={ref} style={{
      opacity: v ? 1 : 0,
      transform: v ? "translateY(0)" : "translateY(30px)",
      transition: `opacity 0.7s cubic-bezier(0.4,0,0.2,1) ${delay}ms, transform 0.7s cubic-bezier(0.4,0,0.2,1) ${delay}ms`,
      ...style
    }}>{children}</div>
  );
};

const GlowBar = ({ pct, color, height = 5, animated = false, delay = 0 }) => {
  const [w, setW] = useState(animated ? 0 : pct);
  useEffect(() => {
    if (!animated) { setW(pct); return; }
    setW(0);
    const t = setTimeout(() => setW(pct), delay);
    return () => clearTimeout(t);
  }, [pct, animated, delay]);
  return (
    <div style={{ flex: 1, height, background: "rgba(255,255,255,0.05)", borderRadius: height/2 }}>
      <div style={{
        width: `${w}%`, height: "100%",
        background: `linear-gradient(90deg,${color}cc,${color})`,
        borderRadius: height/2,
        boxShadow: `0 0 8px ${color}40,0 0 2px ${color}60`,
        transition: animated ? "width 1s cubic-bezier(0.4,0,0.2,1)" : "none"
      }}/>
    </div>
  );
};

const goldGradStyle = { color: C.gold, textShadow: `0 0 30px ${C.gold}30` };
const GoldText = ({ children }) => <span style={goldGradStyle}>{children}</span>;

const GoldBtn = ({ children, large, style = {}, onClick, arrowInset, color }) => {
  const { mob } = useBp();
  const defaultInset = large ? (mob ? 14 : 18) : 14;
  const rightVal = arrowInset !== undefined ? arrowInset : defaultInset;
  const btnColor = color || C.gold;
  return (
    <button onClick={onClick}
      onMouseEnter={e => { e.currentTarget.style.background = `linear-gradient(135deg,${btnColor}22,${btnColor}14)`; e.currentTarget.style.borderColor = `${btnColor}60`; e.currentTarget.style.boxShadow = `0 0 32px ${btnColor}20,0 4px 16px rgba(0,0,0,0.25)`; const a = e.currentTarget.querySelector('[data-btn-arrow]'); if(a){ a.style.opacity='1'; a.style.transform='translateX(3px)'; } }}
      onMouseLeave={e => { e.currentTarget.style.background = `linear-gradient(135deg,${btnColor}15,${btnColor}08)`; e.currentTarget.style.borderColor = `${btnColor}35`; e.currentTarget.style.boxShadow = `0 0 24px ${btnColor}12,0 4px 12px rgba(0,0,0,0.2)`; const a = e.currentTarget.querySelector('[data-btn-arrow]'); if(a){ a.style.opacity='0'; a.style.transform='translateX(0)'; } }}
      style={{
      position: "relative", overflow: "hidden",
      background: `linear-gradient(135deg,${btnColor}15,${btnColor}08)`,
      color: btnColor,
      fontFamily: "'DM Sans',sans-serif",
      fontWeight: 700,
      fontSize: large ? (mob ? 14 : 16) : 14,
      padding: large ? (mob ? "14px 28px" : "16px 36px") : "12px 28px",
      borderRadius: 12,
      border: `1px solid ${btnColor}35`,
      cursor: "pointer",
      boxShadow: `0 0 24px ${btnColor}12,0 4px 12px rgba(0,0,0,0.2)`,
      letterSpacing: 0.3,
      whiteSpace: "nowrap",
      transition: "all 0.25s ease",
      textAlign: "center",
      ...style
    }}>
      {/* Shimmer — slow auto-loop, no hover override */}
      <div style={{ position: "absolute", top: "-50%", left: "-50%", right: "-50%", bottom: "-50%", pointerEvents: "none", background: `linear-gradient(120deg, transparent 0%, transparent 42%, ${btnColor}12 48%, ${btnColor}25 50%, ${btnColor}12 52%, transparent 58%, transparent 100%)`, backgroundSize: "200% 200%", animation: "btnShimmerSlow 20s ease-in-out infinite", zIndex: 0 }}/>
      <span style={{ position: "relative", zIndex: 1 }}>{children}</span>
      <svg data-btn-arrow="" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={btnColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ position: "absolute", right: rightVal, top: "50%", marginTop: -7, transition: "transform 0.25s ease, opacity 0.25s ease", opacity: 0, flexShrink: 0, zIndex: 1 }}>
        <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
      </svg>
    </button>
  );
};

const GhostBtn = ({ children, color = C.gold, style = {}, onClick }) => (
  <button onClick={onClick}
    onMouseEnter={e => { e.currentTarget.style.background = `linear-gradient(135deg,${color}22,${color}14)`; e.currentTarget.style.borderColor = `${color}60`; e.currentTarget.style.boxShadow = `0 0 32px ${color}20,0 4px 16px rgba(0,0,0,0.25)`; }}
    onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = `${color}40`; e.currentTarget.style.boxShadow = "none"; }}
    style={{
    background: "transparent",
    color,
    fontFamily: "'DM Sans',sans-serif",
    fontWeight: 600,
    fontSize: 14,
    padding: "12px 28px",
    borderRadius: 12,
    border: `1px solid ${color}40`,
    cursor: "pointer",
    transition: "all 0.25s ease",
    ...style
  }}>{children}</button>
);

const CyanBtn = ({ children, large, style = {}, onClick }) => {
  const { mob } = useBp();
  return (
    <button onClick={onClick} style={{
      background: `linear-gradient(135deg,${C.cyan}15,${C.cyan}08)`,
      color: C.cyan,
      fontFamily: "'DM Sans',sans-serif",
      fontWeight: 700,
      fontSize: large ? (mob ? 14 : 16) : 14,
      padding: large ? (mob ? "14px 28px" : "16px 36px") : "12px 28px",
      borderRadius: 12,
      border: `1px solid ${C.cyan}35`,
      cursor: "pointer",
      boxShadow: `0 0 24px ${C.cyan}12,0 4px 12px rgba(0,0,0,0.2)`,
      ...style
    }}>{children}</button>
  );
};

const ScoreRing = ({ score = 72, size = 160, sw = 8, trigger = true }) => {
  const [cur, setCur] = useState(0);
  const r = (size - sw * 2) / 2, circ = 2 * Math.PI * r;
  useEffect(() => {
    if (!trigger) { setCur(0); return; }
    let s = 0;
    const step = () => {
      s += 1.2;
      setCur(Math.min(Math.round(s), score));
      if (s < score) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [score, trigger]);
  const color = cur >= 90 ? C.green : cur >= 70 ? C.cyan : cur >= 50 ? C.gold : C.red;
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size/2} cy={size/2} r={r} stroke="rgba(255,255,255,0.06)" strokeWidth={sw} fill="none"/>
        <circle cx={size/2} cy={size/2} r={r} stroke={color} strokeWidth={sw} fill="none"
          strokeDasharray={circ} strokeDashoffset={circ - (cur/100)*circ} strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 8px ${color}50)` }}/>
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: size*0.3, fontWeight: 700, color: C.text1, lineHeight: 1, textShadow: `0 0 20px ${color}30` }}>{cur}</span>
        <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: Math.max(7, size*0.055), color: C.text3, letterSpacing: 1, textTransform: "uppercase", marginTop: 1 }}>Health Score</span>
      </div>
    </div>
  );
};

// Animated count-up for numbers
const CountUp = ({ value, trigger, duration = 800, delay = 0, prefix = "", suffix = "", decimals = 0 }) => {
  const [cur, setCur] = useState(0);
  const numVal = typeof value === "number" ? value : parseFloat(String(value).replace(/[^0-9.]/g, "")) || 0;
  useEffect(() => {
    if (!trigger) { setCur(0); return; }
    const start = performance.now();
    const step = (now) => {
      const elapsed = now - start - delay;
      if (elapsed < 0) { requestAnimationFrame(step); return; }
      const p = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setCur(numVal * eased);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [trigger, numVal, duration, delay]);
  const display = decimals > 0 ? cur.toFixed(decimals) : Math.round(cur);
  return <>{prefix}{display}{suffix}</>;
};

// ═══════════════════════════════════════════════════════════════════
// HERO V3 — 3D Carousel (Resources Hub pattern)
// ═══════════════════════════════════════════════════════════════════

// SVG-based cover mockups for the 3D carousel
const CoverMockup = ({ title, score, color }) => (
  <div style={{ width: "100%", height: "100%", background: C.bgDeep, borderRadius: 8, overflow: "hidden", position: "relative", fontFamily: "'DM Sans',sans-serif" }}>
    <div style={{ position: "absolute", top: "-20%", left: "50%", transform: "translateX(-50%)", width: "140%", height: "70%", background: `radial-gradient(ellipse at center, ${color}22 0%, transparent 60%)`, pointerEvents: "none" }}/>
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 1, opacity: 0.05, mixBlendMode: "overlay", backgroundImage: GRAIN, backgroundSize: "128px 128px" }}/>
    <div style={{ position: "absolute", inset: 0, padding: "16% 10% 12%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
      <div>
        <div style={{ fontSize: 7, letterSpacing: "0.24em", textTransform: "uppercase", color: C.gold, fontWeight: 600, marginBottom: 6 }}>The Constraint Roadmap</div>
        <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 11, color: C.text1, letterSpacing: "0.02em" }}>Kriczky <span style={{ color: C.gold }}>Virtus</span></div>
      </div>
      <div>
        <div style={{ fontSize: 6, letterSpacing: "0.22em", textTransform: "uppercase", color, fontWeight: 600, marginBottom: 4 }}>Your #1 Constraint</div>
        <div style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 500, fontSize: 20, lineHeight: 1.05, color: C.text1, textShadow: `0 0 30px ${color}30`, whiteSpace: "pre-line", marginBottom: 10 }}>{title}</div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div style={{ position: "relative", width: 64, height: 64 }}>
            <svg width={64} height={64} style={{ transform: "rotate(-90deg)" }}>
              <circle cx={32} cy={32} r={26} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={4}/>
              <circle cx={32} cy={32} r={26} fill="none" stroke={color} strokeWidth={4} strokeLinecap="round" strokeDasharray={2 * Math.PI * 26} strokeDashoffset={2 * Math.PI * 26 * (1 - score / 100)} style={{ filter: `drop-shadow(0 0 4px ${color}60)` }}/>
            </svg>
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <div style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 300, fontSize: 22, lineHeight: 1, color }}>{score}</div>
              <div style={{ fontSize: 5, letterSpacing: "0.18em", textTransform: "uppercase", color: C.text4, fontWeight: 600 }}>/ 100</div>
            </div>
          </div>
        </div>
      </div>
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 6, display: "flex", justifyContent: "space-between" }}>
        <div style={{ fontSize: 6, color: C.text4, letterSpacing: "0.12em", textTransform: "uppercase" }}>Edward Kriczky</div>
        <div style={{ fontSize: 6, color: C.text4, letterSpacing: "0.14em", textTransform: "uppercase" }}>2026</div>
      </div>
    </div>
  </div>
);

const HERO_CAROUSEL_ITEMS = [
  { title: "Profitability\n& Margins", score: 42, color: "#F87171" },
  { title: "Cash Flow\nFragility", score: 61, color: C.gold },
  { title: "Owner\nDependency", score: 38, color: "#FBBF24" },
  { title: "Revenue\nQuality", score: 55, color: C.cyan },
  { title: "Operational\nEfficiency", score: 72, color: C.green },
];

// ═══════════════════════════════════════════════════════════════════
// NAV
// ═══════════════════════════════════════════════════════════════════
const Nav = ({ onPrimary }) => {
  const { mob } = useBp();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);
  useEffect(() => {
    if (!menuOpen) return;
    const h = () => setMenuOpen(false);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, [menuOpen]);

  const links = [
    { label: "How It Works", href: "#journey" },
    { label: "Resources", href: "/tools" },
    { label: "Pricing", href: "#pricing" },
    { label: "FAQ", href: "#faq" },
  ];

  return (<>
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      background: scrolled ? "rgba(10,14,20,0.85)" : "rgba(10,14,20,0.4)",
      backdropFilter: "blur(20px) saturate(1.3)",
      borderBottom: `1px solid ${scrolled ? "rgba(255,255,255,0.08)" : "transparent"}`,
      transition: "all 0.4s",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: mob ? "0 16px" : "0 40px", display: "flex", alignItems: "center", justifyContent: "space-between", height: mob ? 60 : 72 }}>
        <a href="#top" style={{ display: "flex", alignItems: "center", gap: mob ? 8 : 12, textDecoration: "none" }}>
          <div style={{ width: mob ? 34 : 40, height: mob ? 34 : 40, borderRadius: mob ? 8 : 10, background: "rgba(200,162,78,0.06)", border: "1px solid rgba(200,162,78,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <KVShield size={mob ? 18 : 22} glow/>
          </div>
          <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.05 }}>
            <span style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, fontSize: mob ? 15 : 19, color: C.text1, letterSpacing: 1.2, textTransform: "uppercase" }}>KRICZKY VIRTUS</span>
          </div>
        </a>
        {mob ? (
          <button onClick={() => setMenuOpen(!menuOpen)} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
            {menuOpen ? <IconX size={24} color={C.text1}/> : <IconMenu size={24} color={C.text1}/>}
          </button>
        ) : (<>
          <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
            {links.map(l => (
              <a key={l.label} href={l.href}
                style={{ color: C.text2, fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 500, textDecoration: "none", cursor: "pointer" }}
                onMouseEnter={e => { e.target.style.color = C.text1; }}
                onMouseLeave={e => { e.target.style.color = C.text2; }}>
                {l.label}
              </a>
            ))}
          </div>
          <GoldBtn onClick={onPrimary}>Get Your Free Roadmap</GoldBtn>
        </>)}
      </div>
    </nav>
    {/* Mobile dropdown menu */}
    {mob && (
      <div style={{
        position: "fixed", top: 60, left: 0, right: 0, zIndex: 99,
        background: "rgba(10,14,20,0.95)", backdropFilter: "blur(20px)",
        borderBottom: `1px solid ${C.border1}`,
        transform: menuOpen ? "translateY(0)" : "translateY(-120%)",
        opacity: menuOpen ? 1 : 0,
        transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
        padding: "16px 20px",
      }}>
        {links.map(l => (
          <a key={l.label} href={l.href} onClick={() => setMenuOpen(false)}
            style={{ display: "block", padding: "12px 0", color: C.text2, fontFamily: "'DM Sans',sans-serif", fontSize: 16, fontWeight: 500, textDecoration: "none", borderBottom: `1px solid ${C.border1}` }}>
            {l.label}
          </a>
        ))}
        <div style={{ marginTop: 16 }}>
          <GoldBtn large style={{ width: "100%" }} onClick={() => { setMenuOpen(false); onPrimary && onPrimary(); }}>
            Get Your Free Roadmap
          </GoldBtn>
        </div>
      </div>
    )}
  </>);
};
// ═══════════════════════════════════════════════════════════════════
// HERO CAROUSEL + SECTION
// ═══════════════════════════════════════════════════════════════════

const HeroCarousel = () => {
  const [active, setActive] = useState(0);
  const total = HERO_CAROUSEL_ITEMS.length;
  useEffect(() => {
    const timer = setInterval(() => setActive(p => (p + 1) % total), 3500);
    return () => clearInterval(timer);
  }, [total]);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
      {HERO_CAROUSEL_ITEMS.map((cover, i) => {
        const offset = ((i - active + total) % total);
        const isCenter = offset === 0;
        const isR1 = offset === 1, isR2 = offset === 2;
        const isL1 = offset === total - 1, isL2 = offset === total - 2;
        const vis = isCenter || isR1 || isR2 || isL1 || isL2;
        let x = 0, sc = 0.65, op = 0, z = 0, ry = 0;
        if (isCenter) { x = 0; sc = 1; op = 1; z = 10; ry = 0; }
        if (isR1) { x = 130; sc = 0.75; op = 0.45; z = 5; ry = -14; }
        if (isR2) { x = 210; sc = 0.56; op = 0.12; z = 2; ry = -20; }
        if (isL1) { x = -130; sc = 0.75; op = 0.45; z = 5; ry = 14; }
        if (isL2) { x = -210; sc = 0.56; op = 0.12; z = 2; ry = 20; }
        return (
          <div key={i} onClick={() => setActive(i)} style={{
            position: "absolute", width: 210, height: 296, cursor: "pointer",
            transform: `translateX(${x}px) scale(${sc}) perspective(900px) rotateY(${ry}deg)`,
            opacity: vis ? op : 0, zIndex: z,
            transition: "all 0.7s cubic-bezier(0.4, 0, 0.2, 1)",
          }}>
            <div style={{
              width: "100%", height: "100%", borderRadius: 8, overflow: "hidden",
              border: `1px solid ${isCenter ? cover.color + "50" : cover.color + "20"}`,
              boxShadow: isCenter ? `0 12px 48px rgba(0,0,0,0.5), 0 0 28px ${cover.color}12` : `0 4px 20px rgba(0,0,0,0.4)`,
            }}>
              <CoverMockup title={cover.title} score={cover.score} color={cover.color}/>
            </div>
          </div>
        );
      })}
      <div style={{ position: "absolute", bottom: -4, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 6 }}>
        {HERO_CAROUSEL_ITEMS.map((c, i) => (
          <div key={i} onClick={() => setActive(i)} style={{
            width: active === i ? 18 : 6, height: 6, borderRadius: 3, cursor: "pointer",
            background: active === i ? HERO_CAROUSEL_ITEMS[active].color : C.text4,
            transition: "all 0.3s ease",
            boxShadow: active === i ? `0 0 8px ${HERO_CAROUSEL_ITEMS[active].color}50` : "none",
          }}/>
        ))}
      </div>
    </div>
  );
};

const HeroSection = ({ onPrimary }) => {
  const { mob, tab } = useBp();
  return (
    <Section gradient={`radial-gradient(ellipse 70% 55% at 30% 70%,rgba(200,162,78,0.10) 0%,transparent 60%),radial-gradient(ellipse 80% 60% at 20% 90%,#221a08 0%,transparent 50%),radial-gradient(ellipse 60% 50% at 80% 20%,#151a30 0%,transparent 55%),linear-gradient(180deg,#070a10 0%,#0c1018 40%,#0e1118 100%)`} style={{ paddingTop: mob ? 100 : 0, paddingBottom: mob ? 40 : 0, minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", overflow: "visible" }}>
      <Caustic x="-5%" y="25%" angle={-8} width={mob ? 400 : 700} opacity={0.12}/>
      <Caustic x="55%" y="80%" angle={12} width={mob ? 300 : 500} opacity={0.1} color={C.goldLight}/>
      <Box style={{ position: "relative" }}>
        {/* Headline + CTA — takes ~55% on desktop */}
        <div style={{ maxWidth: mob ? "100%" : tab ? "55%" : "55%", textAlign: mob ? "center" : "left", position: "relative", zIndex: 5 }}>
          <Reveal>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 16px", borderRadius: 100, background: "rgba(34,211,238,0.08)", border: "1px solid rgba(34,211,238,0.20)", marginBottom: mob ? 20 : 28, position: "relative" }}>
              {/* 360° shimmer border — SVG rotating conic gradient */}
              <div className="pill-shimmer" style={{ position: "absolute", inset: -1, borderRadius: 100, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
                <div style={{ position: "absolute", inset: 0, borderRadius: 100, background: `conic-gradient(from var(--shimmer-angle, 0deg), transparent 0%, transparent 70%, ${C.cyan}60 78%, ${C.cyan} 80%, ${C.cyan}60 82%, transparent 90%, transparent 100%)`, mask: `linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)`, WebkitMask: `linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)`, maskComposite: "exclude", WebkitMaskComposite: "xor", padding: 1 }}/>
              </div>
              <IconTarget size={14} color={C.cyan} style={{ position: "relative", zIndex: 1 }}/>
              <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: mob ? 11 : 12, fontWeight: 600, color: C.cyan, letterSpacing: 0.3, position: "relative", zIndex: 1 }}>1 constraint. 1 roadmap. 3 moves this week.</span>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <h1 style={{
              fontFamily: "'Cormorant Garamond',serif", fontWeight: 700,
              fontSize: mob ? 34 : tab ? 44 : 52,
              lineHeight: 1.05, color: C.text1, textTransform: "uppercase",
              letterSpacing: -1, margin: "0 0 20px",
              textShadow: "0 2px 20px rgba(0,0,0,0.5)",
            }}>
              YOUR BUSINESS SHOULD BE AN ASSET THAT COMPOUNDS — <GoldText>NOT A JOB THAT DEMANDS.</GoldText>
            </h1>
          </Reveal>
          <Reveal delay={200}>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: mob ? 15 : 17, lineHeight: 1.65, color: C.text2, margin: "0 0 32px", maxWidth: 560 }}>
              A free roadmap that tells you exactly what's holding back your profit, your time, and your growth — and the three moves to fix it this week.
            </p>
          </Reveal>
          <Reveal delay={300}>
            <div style={{ display: "inline-flex", flexDirection: "column", alignItems: mob ? "center" : "flex-start" }}>
              <GoldBtn large onClick={onPrimary}>Get Your Free Constraint Roadmap</GoldBtn>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: C.text3, margin: "10px 0 0", textAlign: "center" }}>Free · 90 seconds · No account needed</p>
            </div>
          </Reveal>
        </div>

        {/* Carousel — absolutely positioned on right, free from Box constraints */}
        {!mob && (
          <Reveal delay={200} style={{ position: "absolute", right: 40, top: "50%", transform: "translateY(-50%)", width: tab ? 400 : 480, height: 380, zIndex: 4 }}>
            <HeroCarousel/>
          </Reveal>
        )}
      </Box>

      {/* Mobile carousel below headline */}
      {mob && (
        <Box>
          <Reveal delay={300} style={{ width: "100%", height: 320, position: "relative", marginTop: 8 }}>
            <HeroCarousel/>
          </Reveal>
        </Box>
      )}
    </Section>
  );
};


// ═══════════════════════════════════════════════════════════════════
// SOCIAL PROOF — Industries served + Edward credential + rotating quote
// ═══════════════════════════════════════════════════════════════════
const INDUSTRY_LOGOS = [
  { name: "Digital Education", industry: "$1M–$10M", initial: "DE" },
  { name: "Home Services", industry: "$1M–$10M", initial: "HS" },
  { name: "Construction & Design", industry: "$1M–$10M", initial: "CD" },
  { name: "Healthcare Practices", industry: "$1M–$10M", initial: "HP" },
  { name: "Automotive Services", industry: "$1M–$10M", initial: "AS" },
  { name: "Marketing & Agency", industry: "$1M–$10M", initial: "MA" },
];

const CLIENT_QUOTES = [
  { text: "I knew something was off, but I couldn't name it. The roadmap named it on the first page — and quantified how much it was costing me.", name: "Business Owner", title: "Professional Services · $1.4M" },
  { text: "Seven questions and I got back a 15-page report that was more useful than the last two years of quarterly reviews from my CPA.", name: "Business Owner", title: "Construction · $3.2M" },
  { text: "I expected a generic PDF. Instead I got my actual constraint, three root causes with dollar amounts, and a 90-day plan I could start Monday.", name: "Business Owner", title: "Healthcare · $2.1M" },
];

const IndustryPills = ({ mob }) => (
  <div style={{ display: "flex", flexWrap: "wrap", gap: mob ? 8 : 10, justifyContent: "center" }}>
    {INDUSTRY_LOGOS.map((logo, i) => (
      <div key={i} style={{
        display: "inline-flex", alignItems: "center", gap: 8,
        padding: mob ? "6px 12px" : "8px 14px", borderRadius: 100,
        background: "rgba(255,255,255,0.02)", border: `1px solid ${C.gold}20`,
        transition: "all 0.3s ease",
      }}>
        <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: mob ? 11 : 13, fontWeight: 700, color: C.gold, letterSpacing: 0.5 }}>{logo.initial}</span>
        <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: mob ? 10 : 11, color: C.text2, fontWeight: 500 }}>{logo.name}</span>
      </div>
    ))}
  </div>
);

const RotatingQuote = ({ mob }) => {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % CLIENT_QUOTES.length), 5500);
    return () => clearInterval(t);
  }, []);
  return (
    <div style={{ position: "relative", minHeight: mob ? 100 : 90 }}>
      {CLIENT_QUOTES.map((q, i) => (
        <div key={i} style={{
          position: "absolute", inset: 0,
          opacity: i === idx ? 1 : 0,
          transform: i === idx ? "translateY(0)" : "translateY(8px)",
          transition: "all 0.5s cubic-bezier(0.4,0,0.2,1)",
          pointerEvents: i === idx ? "auto" : "none",
        }}>
          <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: mob ? 17 : 20, fontStyle: "italic", color: C.text1, lineHeight: 1.4, margin: "0 0 8px" }}>"{q.text}"</p>
          <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: C.text3, display: "block" }}>— <span style={{ color: C.text2, fontWeight: 600 }}>{q.name}</span> · {q.title}</span>
        </div>
      ))}
    </div>
  );
};

const SocialProof = () => {
  const { mob } = useBp();
  return (
    <div style={{ position: "relative", background: `linear-gradient(180deg,${C.bgCard} 0%,#0d131c 100%)`, borderTop: `1px solid ${C.border1}`, borderBottom: `1px solid ${C.border1}`, padding: mob ? "24px 0" : "30px 0", overflow: "hidden", zIndex: 2 }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg,transparent,${C.gold}40,${C.gold}80,${C.gold}40,transparent)` }}/>
      <Box>
        <div style={{ display: "flex", flexDirection: mob ? "column" : "row", alignItems: "center", gap: mob ? 18 : 28 }}>
          {/* Left — Edward credential */}
          <div style={{ display: "flex", alignItems: "center", gap: mob ? 12 : 16, flexShrink: 0 }}>
            <img src={EDWARD_HEADSHOT} alt="Edward Kriczky" style={{ width: mob ? 56 : 64, height: mob ? 56 : 64, borderRadius: 14, objectFit: "cover", flexShrink: 0, border: `1.5px solid ${C.gold}50`, boxShadow: `0 0 16px ${C.gold}18` }}/>
            <div>
              <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: mob ? 17 : 20, color: C.text1, fontWeight: 700, display: "block", lineHeight: 1.2 }}>Edward Kriczky, CEPA</span>
              <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: mob ? 10 : 11, color: C.text3, display: "block", marginTop: 2 }}>Certified Exit Planning Advisor</span>
            </div>
          </div>

          {/* Divider */}
          <div style={{ width: mob ? "60%" : 1, height: mob ? 1 : 40, background: `linear-gradient(${mob ? "90deg" : "180deg"}, transparent, ${C.border2}, transparent)`, flexShrink: 0 }}/>

          {/* Right — One powerful quote */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
              <svg width={18} height={18} viewBox="0 0 32 32" fill="none" style={{ flexShrink: 0, marginTop: 2, opacity: 0.4 }}>
                <path d="M9 7C5.7 7 3 9.7 3 13v8h8v-8H7c0-1.1 0.9-2 2-2V7zm14 0c-3.3 0-6 2.7-6 6v8h8v-8h-4c0-1.1 0.9-2 2-2V7z" fill={C.gold}/>
              </svg>
              <div>
                <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: mob ? 12 : 13, color: C.text2, lineHeight: 1.55, margin: "0 0 10px", fontStyle: "italic" }}>Within 9 months of working with Edward we have implemented two core improvements in our business and both our <span style={{ color: C.text1, fontWeight: 600 }}>revenue and profit are on track now to be up ~50% compared to last year.</span> He also helped us see that we still have a <span style={{ color: C.text1, fontWeight: 600 }}>Profit Gap of $300K per year we are leaving on the table</span> that we are actively working to close so we can attract and retain better talent.</p>
                <div style={{ display: "flex", alignItems: "center", gap: mob ? 8 : 12, flexWrap: "wrap" }}>
                  <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, color: C.text3 }}>Phil C. · $3.0M Revenue · Home Services</span>
                  <div style={{ display: "flex", gap: 8 }}>
                    <div style={{ padding: "6px 16px", borderRadius: 8, background: `${C.cyan}08`, border: `1px solid ${C.cyan}20`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, fontWeight: 700, color: C.cyan, letterSpacing: "0.04em" }}>Profit Gap: $300K/yr</span>
                    </div>
                    <div style={{ padding: "6px 16px", borderRadius: 8, background: `${C.gold}08`, border: `1px solid ${C.gold}20`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, fontWeight: 700, color: C.gold, letterSpacing: "0.04em" }}>Value Gap: $779K</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Box>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════
// ═══════════════════════════════════════════════════════════════════
// JOURNEY V3 — Visual step accordion with live preview panels
// Stage 1: Find the Constraint (free roadmap → carousel covers)
// Stage 2: Go Deeper (self-serve diagnostic tools → tool cards)
// Stage 3: Execute With a Partner (Kriczky Virtus engagements → tier cards)
// ═══════════════════════════════════════════════════════════════════


// ═══════════════════════════════════════════════════════════════════
// JOURNEY V3.2 — Visual step accordion with dynamic preview panels
// ═══════════════════════════════════════════════════════════════════

// Smooth animated number
const AnimNum = ({ value, prefix = "", suffix = "", decimals = 0 }) => {
  const [display, setDisplay] = useState(value);
  const ref = useRef(value);
  useEffect(() => {
    const start = ref.current; const end = value; const dur = 800; const t0 = performance.now();
    const tick = (now) => { const p = Math.min((now - t0) / dur, 1); const ease = 1 - Math.pow(1 - p, 3);
      setDisplay(start + (end - start) * ease); if (p < 1) requestAnimationFrame(tick); else ref.current = end; };
    requestAnimationFrame(tick);
  }, [value]);
  return <>{prefix}{display.toFixed(decimals)}{suffix}</>;
};

const fmt = (n) => { const a = Math.abs(n); return a >= 1000 ? `$${(n/1000).toFixed(1)}M` : `$${Math.round(n)}K`; };

// Smooth animated number hook
const useAnim = (target, dur = 800) => {
  const [val, setVal] = useState(target);
  const ref = useRef(target);
  useEffect(() => {
    const s = ref.current, e = target, t0 = performance.now();
    const tick = (now) => {
      const p = Math.min((now - t0) / dur, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      const v = s + (e - s) * ease;
      setVal(v);
      if (p < 1) requestAnimationFrame(tick); else ref.current = e;
    };
    requestAnimationFrame(tick);
  }, [target, dur]);
  return val;
};
const fmtK = (n) => Math.abs(n) >= 1000 ? `$${(n/1000).toFixed(1)}M` : `$${Math.round(n)}K`;

// ── Step 1: Flippable Roadmap Covers ──
const JOURNEY_COVERS = [
  { title: "Profitability\n& Margins", score: 42, color: "#F87171", back: "Margin leakage identified across two service lines — $94K recovered in Q1." },
  { title: "Cash Flow\nFragility", score: 61, color: C.gold, back: "12-month cash projection showing exactly when runway gets tight — and what to cut." },
  { title: "Owner\nDependency", score: 38, color: "#FBBF24", back: "Three processes only you can do — mapped, documented, and delegated in 90 days." },
  { title: "Revenue\nQuality", score: 55, color: C.cyan, back: "Top-3 client concentration risk exposed — diversification plan with dollar targets." },
];

const JourneyCover = ({ title, score, color, back }) => {
  const [hov, setHov] = useState(false);
  const [flipped, setFlipped] = useState(false);
  return (
    <div onMouseEnter={() => { setHov(true); setFlipped(true); }} onMouseLeave={() => { setHov(false); setFlipped(false); }}
      style={{ width: 150, height: 200, perspective: 800, flexShrink: 0, cursor: "default" }}>
      <div style={{
        width: "100%", height: "100%", position: "relative", transformStyle: "preserve-3d",
        transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
        transition: "transform 0.6s cubic-bezier(0.4,0,0.2,1)",
      }}>
        {/* FRONT */}
        <div style={{
          position: "absolute", inset: 0, backfaceVisibility: "hidden", borderRadius: 10, overflow: "hidden",
          background: C.bgDeep,
          border: `1.5px solid ${hov ? color + "50" : color + "20"}`,
          boxShadow: hov ? `0 8px 32px rgba(0,0,0,0.4), 0 0 20px ${color}15` : `0 4px 20px rgba(0,0,0,0.4)`,
          transition: "border-color 0.35s, box-shadow 0.35s",
        }}>
          <div style={{ position: "absolute", top: "-20%", left: "50%", transform: "translateX(-50%)", width: "140%", height: "60%", background: `radial-gradient(ellipse at center, ${color}20 0%, transparent 60%)`, pointerEvents: "none" }}/>
          <div style={{ position: "absolute", top: 0, left: "15%", width: "70%", height: 1.5, background: `linear-gradient(90deg, transparent, ${color}35, transparent)` }}/>
          <div style={{ position: "absolute", inset: 0, padding: "16px 12px 12px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontSize: 6, letterSpacing: "0.22em", textTransform: "uppercase", color: C.gold, fontWeight: 600, marginBottom: 3 }}>Constraint Roadmap</div>
              <div style={{ fontSize: 6, letterSpacing: "0.18em", textTransform: "uppercase", color, fontWeight: 600, marginBottom: 3 }}>Your #1 Constraint</div>
              <div style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 500, fontSize: 15, lineHeight: 1.1, color: C.text1, whiteSpace: "pre-line" }}>{title}</div>
            </div>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <div style={{ position: "relative", width: 48, height: 48 }}>
                <svg width={48} height={48} style={{ transform: "rotate(-90deg)" }}>
                  <circle cx={24} cy={24} r={20} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={3}/>
                  <circle cx={24} cy={24} r={20} fill="none" stroke={color} strokeWidth={3} strokeLinecap="round" strokeDasharray={2 * Math.PI * 20} strokeDashoffset={2 * Math.PI * 20 * (1 - score / 100)} style={{ filter: `drop-shadow(0 0 3px ${color}60)` }}/>
                </svg>
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 300, fontSize: 17, color }}>{score}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* BACK */}
        <div style={{
          position: "absolute", inset: 0, backfaceVisibility: "hidden", borderRadius: 10, overflow: "hidden",
          transform: "rotateY(180deg)",
          background: `linear-gradient(135deg, ${color}12, ${C.bgDeep})`,
          border: `1.5px solid ${color}50`,
          boxShadow: `0 8px 32px rgba(0,0,0,0.4), 0 0 24px ${color}18`,
          padding: "16px 14px", display: "flex", flexDirection: "column", justifyContent: "space-between",
        }}>
          <div>
            <div style={{ fontSize: 7, letterSpacing: "0.18em", textTransform: "uppercase", color, fontWeight: 700, marginBottom: 8 }}>From Your Roadmap</div>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: C.text1, lineHeight: 1.5, margin: 0 }}>{back}</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 10 }}>
            <div style={{ width: 4, height: 4, borderRadius: 2, background: color }}/>
            <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 8, color: C.text3, fontStyle: "italic" }}>Personalized to your business</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Step 2: Auto-cycling Gap Examples ──
const GAP_EXAMPLES = [
  { industry: "Professional Services", rev: 2800, margin: 12, bic: 22, mult: 2.5, bicMult: 5.5, gaugePos: 28 },
  { industry: "Construction", rev: 6200, margin: 9, bic: 18, mult: 2.0, bicMult: 5.0, gaugePos: 22 },
  { industry: "Healthcare Practice", rev: 4500, margin: 15, bic: 26, mult: 3.5, bicMult: 7.0, gaugePos: 42 },
  { industry: "HVAC / Plumbing", rev: 3100, margin: 11, bic: 22, mult: 2.5, bicMult: 5.5, gaugePos: 30 },
  { industry: "Manufacturing", rev: 8000, margin: 10, bic: 20, mult: 2.8, bicMult: 6.0, gaugePos: 32 },
  { industry: "Landscaping", rev: 1900, margin: 14, bic: 24, mult: 2.2, bicMult: 4.5, gaugePos: 25 },
];

const GapCycler = ({ mob }) => {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx(p => (p + 1) % GAP_EXAMPLES.length), 4500);
    return () => clearInterval(t);
  }, []);
  const ex = GAP_EXAMPLES[idx];
  const ebitda = ex.rev * ex.margin / 100;
  const bicEbitda = ex.rev * ex.bic / 100;
  const profitGap = bicEbitda - ebitda;
  const curVal = ebitda * ex.mult;
  const potVal = bicEbitda * ex.bicMult;
  const valueGap = potVal - curVal;
  // Fixed max across all scenarios so bars move
  const globalMax = 8000 * 0.26 * 7.0; // largest possible potVal

  // Animated values
  const aEbitda = useAnim(ebitda);
  const aBicE = useAnim(bicEbitda);
  const aPGap = useAnim(profitGap);
  const aCurV = useAnim(curVal);
  const aPotV = useAnim(potVal);
  const aVGap = useAnim(valueGap);

  const bandColor = ex.gaugePos < 25 ? "#F87171" : ex.gaugePos < 35 ? "#FBBF24" : ex.gaugePos < 50 ? "#D4A63E" : ex.gaugePos < 70 ? "#22D3EE" : "#34D399";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {/* Industry label + dots */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 6, height: 6, borderRadius: 3, background: C.cyan, boxShadow: `0 0 6px ${C.cyan}60` }}/>
          <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: mob ? 11 : 12, fontWeight: 700, color: C.text1 }}>{ex.industry}</span>
          <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: C.text3 }}>· {fmtK(ex.rev)} revenue</span>
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          {GAP_EXAMPLES.map((_, di) => (
            <div key={di} onClick={() => setIdx(di)} style={{ width: idx === di ? 14 : 5, height: 5, borderRadius: 3, cursor: "pointer", background: idx === di ? C.cyan : C.text4, transition: "all 0.3s" }}/>
          ))}
        </div>
      </div>

      {/* Range of Value — colored slider + horizontal zone labels */}
      <div style={{ padding: mob ? "12px 14px" : "14px 18px", borderRadius: 12, background: "linear-gradient(145deg, rgba(255,255,255,0.035), rgba(255,255,255,0.01))", border: "1px solid rgba(255,255,255,0.10)" }}>
        <div style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: C.text3, marginBottom: 8 }}>Estimated Placement</div>
        <div style={{ position: "relative", height: 12, borderRadius: 6, marginBottom: 6, background: "linear-gradient(90deg, #F87171, #FBBF24, #D4A63E, #22D3EE, #34D399)", overflow: "visible" }}>
          <div style={{ position: "absolute", top: -3, width: 18, height: 18, borderRadius: "50%", background: bandColor, border: "2px solid white", boxShadow: `0 0 10px ${bandColor}80`, left: `${ex.gaugePos}%`, transform: "translateX(-50%)", transition: "left 1s cubic-bezier(0.4,0,0.2,1), background 0.8s ease" }}/>
        </div>
        <div style={{ display: "flex", fontSize: 7.5, textTransform: "uppercase", letterSpacing: "0.03em", fontWeight: 600 }}>
          <div style={{ width: "25%", textAlign: "center" }}><div style={{ color: "#F87171" }}>Not Sellable</div><div style={{ color: "#F87171", fontSize: 9, fontWeight: 700, marginTop: 1 }}>0×</div></div>
          <div style={{ width: "15%", textAlign: "center" }}><div style={{ color: "#FBBF24" }}>Discount</div><div style={{ color: "#FBBF24", fontSize: 9, fontWeight: 700, marginTop: 1 }}>3–4×</div></div>
          <div style={{ width: "20%", textAlign: "center" }}><div style={{ color: "#D4A63E" }}>Market</div><div style={{ color: "#D4A63E", fontSize: 9, fontWeight: 700, marginTop: 1 }}>~5×</div></div>
          <div style={{ width: "18%", textAlign: "center" }}><div style={{ color: "#22D3EE" }}>Green Zone</div><div style={{ color: "#22D3EE", fontSize: 9, fontWeight: 700, marginTop: 1 }}>5–6×</div></div>
          <div style={{ width: "22%", textAlign: "center" }}><div style={{ color: "#34D399" }}>Best-In-Class</div><div style={{ color: "#34D399", fontSize: 9, fontWeight: 700, marginTop: 1 }}>7–8×</div></div>
        </div>
      </div>

      {/* EBITDA comparison */}
      <div style={{ display: "flex", gap: mob ? 8 : 14, alignItems: "center" }}>
        <div style={{ flex: 1, textAlign: "center", padding: "12px", borderRadius: 10, background: "rgba(251,191,36,0.06)", border: "1px solid rgba(251,191,36,0.15)" }}>
          <div style={{ fontSize: 8, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#FBBF24", marginBottom: 2 }}>Your EBITDA</div>
          <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 22, fontWeight: 300, color: C.text1 }}>{fmtK(Math.round(aEbitda))}</div>
          <div style={{ fontSize: 9, color: C.text3, marginTop: 1 }}>{ex.margin}% of {fmtK(ex.rev)}</div>
        </div>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.gold} strokeWidth="2" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        <div style={{ flex: 1, textAlign: "center", padding: "12px", borderRadius: 10, background: "rgba(52,211,153,0.06)", border: "1px solid rgba(52,211,153,0.15)" }}>
          <div style={{ fontSize: 8, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: C.green, marginBottom: 2 }}>Best-In-Class EBITDA</div>
          <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 22, fontWeight: 300, color: C.text1 }}>{fmtK(Math.round(aBicE))}</div>
          <div style={{ fontSize: 9, color: C.text3, marginTop: 1 }}>{ex.bic}% of {fmtK(ex.rev)}</div>
        </div>
      </div>

      {/* Current Value vs Potential Value bars */}
      <div style={{ padding: "14px 18px", borderRadius: 12, background: "linear-gradient(145deg, rgba(255,255,255,0.035), rgba(255,255,255,0.01))", border: "1px solid rgba(255,255,255,0.10)" }}>
        {[
          { label: "Current Value", val: aCurV, color: "#F87171" },
          { label: "Potential Value", val: aPotV, color: "#34D399" },
        ].map((r, ri) => (
          <div key={ri} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: ri === 0 ? 8 : 0 }}>
            <span style={{ fontSize: 10, color: C.text1, width: mob ? 80 : 95, textAlign: "right", flexShrink: 0 }}>{r.label}</span>
            <div style={{ flex: 1, height: 18, borderRadius: 5, background: "rgba(255,255,255,0.04)", overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${Math.max((r.val / globalMax) * 100, 1)}%`, borderRadius: 5, background: `linear-gradient(180deg, ${r.color}30, ${r.color}15)`, border: `0.5px solid ${r.color}`, boxShadow: `0 0 10px ${r.color}25, inset 0 1px 0 ${r.color}20`, transition: "width 0.8s cubic-bezier(0.4,0,0.2,1)" }}/>
            </div>
            <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 16, fontWeight: 700, color: r.color, width: 65, textAlign: "right" }}>{fmtK(Math.round(r.val))}</span>
          </div>
        ))}
      </div>

      {/* Profit Gap + Value Gap */}
      <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "1fr 1fr", gap: 10 }}>
        <div style={{ padding: "14px 18px", borderRadius: 12, background: "rgba(34,211,238,0.08)", border: "1px solid rgba(34,211,238,0.20)", textAlign: "center" }}>
          <div style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: C.cyan, marginBottom: 4 }}>Profit Gap</div>
          <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 26, fontWeight: 300, color: C.cyan }}>{fmtK(Math.round(aPGap))}<span style={{ fontSize: 14, color: C.text3 }}>/yr</span></div>
          <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, color: C.text3, marginTop: 4 }}>Unrealized annual earnings vs. best-in-class peers</div>
        </div>
        <div style={{ padding: "14px 18px", borderRadius: 12, background: "rgba(200,162,78,0.08)", border: "1px solid rgba(200,162,78,0.20)", textAlign: "center" }}>
          <div style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: C.gold, marginBottom: 4 }}>Value Gap</div>
          <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 26, fontWeight: 300, color: C.gold }}>{fmtK(Math.round(aVGap))}</div>
          <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, color: C.text3, marginTop: 4 }}>Enterprise value you could be building</div>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "center", margin: "6px 0" }}>
        <GoldBtn color={C.cyan}>Go Deeper With Your Business</GoldBtn>
      </div>
      <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, color: C.text3, margin: 0, fontStyle: "italic", textAlign: "center" }}>Illustrative examples for educational purposes only. Best-in-class margins vary by industry — results not guaranteed.</p>
    </div>
  );
};

// ── Step 3: Auto-carousel with animated numbers ──
const PROGRESSION_STAGES = [
  { label: "Before", sub: "Day 1", score: 38, color: C.red, margin: 11, profit: 440, valuation: 0, profitGap: 480 },
  { label: "After", sub: "6 Months", score: 50, color: C.gold, margin: 14, profit: 560, valuation: 1400, profitGap: 360 },
  { label: "After", sub: "1 Year", score: 58, color: C.gold, margin: 16, profit: 640, valuation: 2600, profitGap: 280 },
  { label: "After", sub: "18 Months", score: 66, color: C.cyan, margin: 18, profit: 720, valuation: 3600, profitGap: 200 },
  { label: "After", sub: "2 Years", score: 74, color: C.green, margin: 20, profit: 800, valuation: 4800, profitGap: 120 },
];

const ProgressionCarousel = ({ mob, isOpen }) => {
  const [active, setActive] = useState(0);
  // Reset to beginning when step opens
  useEffect(() => {
    if (isOpen) setActive(0);
  }, [isOpen]);
  // Only auto-cycle when open
  useEffect(() => {
    if (!isOpen) return;
    const t = setInterval(() => setActive(p => (p + 1) % PROGRESSION_STAGES.length), 3500);
    return () => clearInterval(t);
  }, [isOpen]);
  const s = PROGRESSION_STAGES[active];
  const [hov, setHov] = useState(false);

  const aScore = useAnim(s.score);
  const aMargin = useAnim(s.margin);
  const aProfit = useAnim(s.profit);
  const aVal = useAnim(s.valuation);
  const aPGap = useAnim(s.profitGap);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
        style={{
          padding: mob ? "20px 20px" : "28px 36px", borderRadius: 16, position: "relative", overflow: "hidden",
          background: hov
            ? "linear-gradient(160deg, rgba(255,255,255,0.09) 0%, rgba(255,255,255,0.03) 40%, rgba(255,255,255,0.05) 100%)"
            : "linear-gradient(160deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 40%, rgba(255,255,255,0.04) 100%)",
          border: `1.5px solid ${hov ? s.color + "45" : "rgba(255,255,255,0.10)"}`,
          boxShadow: hov ? `0 12px 48px rgba(0,0,0,0.4), 0 0 40px ${s.color}12` : "0 8px 32px rgba(0,0,0,0.3)",
          transition: "all 0.5s ease",
        }}>
        <div style={{ position: "absolute", top: 0, left: "15%", width: "70%", height: 2, background: `linear-gradient(90deg, transparent, ${s.color}${hov ? "60" : "40"}, transparent)`, transition: "all 0.35s ease" }}/>
        <div style={{ position: "absolute", top: -40, left: "50%", transform: "translateX(-50%)", width: 300, height: 100, borderRadius: "50%", background: `radial-gradient(ellipse, ${s.color}${hov ? "15" : "08"}, transparent 70%)`, pointerEvents: "none", transition: "all 0.35s ease" }}/>

        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: mob ? 16 : 24, marginBottom: 16 }}>
            <div style={{ position: "relative", width: 72, height: 72, flexShrink: 0 }}>
              <svg width={72} height={72} style={{ transform: "rotate(-90deg)" }}>
                <circle cx={36} cy={36} r={30} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={4}/>
                <circle cx={36} cy={36} r={30} fill="none" stroke={s.color} strokeWidth={4} strokeLinecap="round" strokeDasharray={2 * Math.PI * 30} strokeDashoffset={2 * Math.PI * 30 * (1 - aScore/100)} style={{ filter: `drop-shadow(0 0 4px ${s.color}60)`, transition: "stroke 0.5s, stroke-dashoffset 0.6s ease" }}/>
              </svg>
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 22, fontWeight: 600, color: s.color, transition: "color 0.5s" }}>{Math.round(aScore)}</span>
              </div>
            </div>
            <div>
              <div style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: s.color, marginBottom: 2, transition: "color 0.5s" }}>{s.label} — {s.sub}</div>
              <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: mob ? 22 : 28, fontWeight: 700, color: C.text1, lineHeight: 1.1 }}>
                {active === 0 ? "Where most owners start." : active === 4 ? "Where a partner takes you." : "Progress compounding."}
              </div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr 1fr" : "1fr 1fr 1fr 1fr", gap: 8 }}>
            {[
              { label: "EBITDA Margin", val: `${Math.round(aMargin)}%`, c: s.color },
              { label: "Annual Profit", val: fmtK(Math.round(aProfit)), c: s.color },
              { label: "Est. Valuation", val: s.valuation === 0 && active === 0 ? "$0" : fmtK(Math.round(aVal)), c: s.valuation === 0 && active === 0 ? C.red : s.color },
              { label: "Profit Gap", val: `${fmtK(Math.round(aPGap))}/yr`, c: active === 0 ? C.red : s.color },
            ].map((m, mi) => (
              <div key={mi} style={{ padding: "10px 12px", borderRadius: 10, background: `${m.c}06`, border: `1px solid ${m.c}15`, textAlign: "center" }}>
                <div style={{ fontSize: 7, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: C.text3, marginBottom: 3 }}>{m.label}</div>
                <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 18, fontWeight: 600, color: m.c, transition: "color 0.5s" }}>{m.val}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "center", gap: 6 }}>
        {PROGRESSION_STAGES.map((st, si) => (
          <div key={si} onClick={() => setActive(si)} style={{
            width: active === si ? 18 : 6, height: 6, borderRadius: 3, cursor: "pointer",
            background: active === si ? st.color : C.text4,
            boxShadow: active === si ? `0 0 8px ${st.color}50` : "none",
            transition: "all 0.3s",
          }}/>
        ))}
      </div>
      <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, color: C.text3, margin: 0, fontStyle: "italic", textAlign: "center", whiteSpace: "nowrap" }}>Illustrative example for educational purposes only. Actual results depend on your business, industry, and execution — results not guaranteed.</p>
    </div>
  );
};

// ── Journey Accordion ──
const JourneyAccordion = ({ onPrimary }) => {
  const { mob, tab } = useBp();
  const [openStep, setOpenStep] = useState(0);

  const steps = [
    {
      num: "01", kicker: "Start Here — Free", title: "Find the Constraint",
      accent: C.gold, icon: <IconSearch size={16} color={C.gold}/>,
      description: "A 90-second assessment and a 15-page personalized roadmap that names your #1 constraint, its root causes, and three moves you can make this week.",
      outcome: "You know what's broken and what to do first.",
    },
    {
      num: "02", kicker: "Go Deeper — Free", title: "How Much Money Are You Leaving On The Table?",
      accent: C.cyan, icon: <IconChart size={16} color={C.cyan}/>,
      description: "Your business has a Profit Gap and a Value Gap — ",
      descHighlight: "how much profit you're making today vs. how much you could be making ",
      descHighlightItalic: "without growing revenue",
      descEnd: ", and what your business valuation is vs. what it could be (without growing revenue). Our free tools gauge a potential range of where your business valuation might fall into by assessing its internal health.",
      outcome: "You see the exact dollar gap between where you are and where you could be.",
    },
    {
      num: "03", kicker: "Work With Kriczky Virtus", title: "Close the Gap With a Partner",
      accent: C.green, icon: <IconRefresh size={16} color={C.green}/>,
      description: "Get numbers personalized to your business by modeling your revenue, margins, and multiples against best-in-class peers in your industry — then get help executing and systematically improving profits and valuation, not just the diagnosis. Virtus builds and oversees the financial model, owns the KPIs, and runs 90-day sprints with you to ruthlessly execute on the core constraint (not just talk about how to grow). Every quarter: re-score, re-prioritize, and",
      descSuffix: "work long-term towards compounding profits and valuation.",
      outcome: "Your Profit Gap closes, your score climbs, and your business value compounds.",
    },
  ];

  return (
    <Section id="journey" gradient={`radial-gradient(ellipse 80% 60% at 50% 30%,rgba(200,162,78,0.07) 0%,transparent 55%),linear-gradient(180deg,#090d14 0%,#0a0e15 50%,#090d14 100%)`} style={{ padding: mob ? "60px 0" : "100px 0" }}>
      <Caustic x="10%" y="15%" angle={-7} width={mob ? 350 : 600} opacity={0.12}/>
      <Box style={{ maxWidth: 920 }}>
        <div style={{ textAlign: "center", marginBottom: mob ? 20 : 28 }}>
          <Reveal><p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: mob ? 11 : 12, color: C.gold, textTransform: "uppercase", letterSpacing: 1.8, marginBottom: 10, fontWeight: 600 }}>The Journey</p></Reveal>
          <Reveal delay={100}><h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, fontSize: mob ? 30 : tab ? 38 : 48, lineHeight: 1.05, color: C.text1, textTransform: "uppercase", letterSpacing: -1, margin: "0 0 14px", textShadow: "0 2px 20px rgba(0,0,0,0.5)" }}>Three stages. <GoldText>Your pace.</GoldText></h2></Reveal>
        </div>
        <Reveal delay={150}>
          <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: mob ? 18 : 22, fontWeight: 400, color: C.text2, lineHeight: 1.4, margin: "0 auto 36px", maxWidth: 640, textAlign: "center", fontStyle: "italic" }}>
            You've built something real. But <span style={{ color: C.gold, fontWeight: 700 }}>the gap between what you earn and what you keep is growing</span> — and that's not a failure of effort. It's a constraint you haven't been able to see.
          </p>
        </Reveal>

        <Reveal delay={200}>
          <div style={{ display: "flex", flexDirection: "column", gap: mob ? 10 : 12 }}>
            {steps.map((step, i) => {
              const isOpen = openStep === i;
              return (
                <div key={i} style={{
                  borderRadius: 16, overflow: "hidden",
                  background: isOpen ? `linear-gradient(135deg, ${step.accent}08, rgba(255,255,255,0.02))` : "rgba(255,255,255,0.015)",
                  border: `1.5px solid ${isOpen ? step.accent + "30" : C.border1}`,
                  transition: "all 0.4s cubic-bezier(0.4,0,0.2,1)",
                  boxShadow: isOpen ? `0 8px 40px rgba(0,0,0,0.3), 0 0 40px ${step.accent}06` : "none",
                }}>
                  <div onClick={() => setOpenStep(isOpen ? -1 : i)} style={{
                    display: "flex", alignItems: "center", gap: mob ? 14 : 18,
                    padding: mob ? "16px 18px" : "20px 28px", cursor: "pointer", userSelect: "none",
                  }}>
                    <div style={{ width: mob ? 44 : 52, height: mob ? 44 : 52, borderRadius: 14, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", background: isOpen ? `${step.accent}15` : C.bgElev, border: `1.5px solid ${isOpen ? step.accent + "40" : C.border1}`, transition: "all 0.3s" }}>
                      <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: mob ? 20 : 24, fontWeight: 700, color: isOpen ? step.accent : C.text4, transition: "color 0.3s" }}>{step.num}</span>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                        {step.icon}
                        <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: mob ? 9 : 10, color: step.accent, textTransform: "uppercase", letterSpacing: 1.2, fontWeight: 700, opacity: isOpen ? 1 : 0.6, transition: "opacity 0.3s" }}>{step.kicker}</span>
                      </div>
                      <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: mob ? 20 : 26, fontWeight: 700, color: isOpen ? C.text1 : C.text3, margin: 0, lineHeight: 1.15, transition: "color 0.3s" }}>{step.title}</h3>
                    </div>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.3s ease" }}>
                      <polyline points="6 9 12 15 18 9" stroke={isOpen ? step.accent : C.text4} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>

                  <div style={{ maxHeight: isOpen ? 1200 : 0, opacity: isOpen ? 1 : 0, overflow: "hidden", transition: "max-height 0.5s cubic-bezier(0.4,0,0.2,1), opacity 0.4s ease" }}>
                    <div style={{ padding: mob ? "0 18px 22px" : "0 28px 28px" }}>
                      <div style={{ marginBottom: 16, paddingLeft: mob ? 0 : 70 }}>
                        <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: mob ? 13 : 14, color: C.text2, lineHeight: 1.65, margin: "0 0 12px", maxWidth: 620 }}>
                          {step.description}
                          {step.descHighlight && <span style={{ color: C.gold, fontWeight: 700 }}>{step.descHighlight}</span>}
                          {step.descHighlightItalic && <span style={{ color: C.gold, fontWeight: 700, fontStyle: "italic" }}>{step.descHighlightItalic}</span>}
                          {step.descEnd && <span>{step.descEnd}</span>}
                          {step.descSuffix && <span style={{ color: C.gold, fontWeight: 700 }}> {step.descSuffix}</span>}
                        </p>
                        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 14px", borderRadius: 10, background: `${C.green}08`, border: `1px solid ${C.green}20` }}>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={C.green} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                          <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: mob ? 11 : 12, color: C.green, fontWeight: 600 }}>{step.outcome}</span>
                        </div>
                      </div>

                      {/* STEP 1: Flippable covers — aligned with text */}
                      {i === 0 && (
                        <div style={{ display: "flex", gap: mob ? 8 : 12, overflowX: "auto", paddingBottom: 8, paddingLeft: mob ? 0 : 70, paddingRight: mob ? 0 : 70 }}>
                          {JOURNEY_COVERS.map((c, j) => (
                            <JourneyCover key={j} title={c.title} score={c.score} color={c.color} back={c.back}/>
                          ))}
                        </div>
                      )}

                      {/* STEP 2: Auto-cycling gap calculator — symmetric padding */}
                      {i === 1 && (
                        <div style={{ paddingLeft: mob ? 0 : 70, paddingRight: mob ? 0 : 70 }}>
                          <GapCycler mob={mob}/>
                        </div>
                      )}

                      {/* STEP 3: Progression carousel — symmetric padding */}
                      {i === 2 && (
                        <div style={{ paddingLeft: mob ? 0 : 70, paddingRight: mob ? 0 : 70 }}>
                          <ProgressionCarousel mob={mob} isOpen={isOpen}/>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Reveal>

        <Reveal delay={300}>
          <div style={{ marginTop: mob ? 28 : 36, textAlign: "center" }}>
            <GoldBtn large onClick={onPrimary}>Get Your Free Constraint Roadmap</GoldBtn>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: C.text3, margin: "8px 0 0" }}>Free · 90 seconds · No account needed</p>
          </div>
        </Reveal>
      </Box>
    </Section>
  );
};
// ═══════════════════════════════════════════════════════════════════
// TESTIMONIAL WALL — dual-row scrolling (6+ quotes) or static grid (<6)
// ═══════════════════════════════════════════════════════════════════
const TESTIMONIALS = [
  { text: "Edward looked at the path our business was on and identified that we were going to stall revenue because we were missing one core hire. He found and connected me with a top-tier candidate, we hired him, and now ", highlight: "we are on track to have both revenue and profit up ~50% in 1 year.", textEnd: "", role: "Phil C. · Landscaping & Design · $3.0M" },
  { text: "I went from having no clear way to monetize my services to having a clear offer based on quantifiable metrics for my ideal customer based on what they valued most — ", highlight: "I went from basically no revenue to multi-5-figure monthly run rate in 60 days", textEnd: " thanks to Edward.", role: "Evan L. · Digital Education / Media · After working session" },
  { text: "Our lead generation was almost solely dependent on people finding us organically and hoping more would come to us — we had tried paid ads before but with no meaningful success. Edward connected us with one of his Strategic Partners and ", highlight: "now we have so many leads that are our ideal customers", textEnd: " that we truly can't get to them fast enough.", role: "Dan C. · Landscape & Design · $2.1M" },
  { text: "Having someone who actually owns the numbers with me changed how I make decisions. ", highlight: "I'm not guessing anymore", textEnd: " — I know where to focus my attention and where to prioritize business reinvestment for growth, and to help reduce risk.", role: "Ryan K. · Automotive Services · $750K Annual Run-Rate" },
  { text: "Edward helped me see that I was holding way too much cash in my business bank account because I thought it made me feel 'safe', but in reality ", highlight: "I was losing money not redeploying it productively", textEnd: " to grow my business (and reduce my money's risk).", role: "Paul L. · eCommerce · $2.5M · After working session" },
];

const TESTIMONIAL_ACCENTS = [C.gold, C.cyan, C.green, C.gold, C.cyan];

const TestimonialCard = ({ q, mob, idx = 0 }) => {
  const accent = TESTIMONIAL_ACCENTS[idx % TESTIMONIAL_ACCENTS.length];
  const [hov, setHov] = useState(false);
  const parts = q.role.split(" · ");
  const name = parts[0];
  const details = parts.slice(1).join(" · ");
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        width: mob ? 280 : 340, flexShrink: 0, borderRadius: 14,
        position: "relative", overflow: "hidden", cursor: "default",
        background: `linear-gradient(160deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 40%, rgba(255,255,255,0.04) 100%)`,
        backdropFilter: "blur(16px)",
        border: `1px solid ${hov ? accent + "45" : "rgba(255,255,255,0.10)"}`,
        boxShadow: hov ? `0 16px 48px rgba(0,0,0,0.5), 0 0 40px ${accent}18, inset 0 0 20px ${accent}06` : `0 8px 32px rgba(0,0,0,0.3)`,
        transition: "all 0.35s ease",
      }}>
      {/* Top accent glow line */}
      <div style={{ position: "absolute", top: 0, left: "10%", width: "80%", height: 1.5, background: `linear-gradient(90deg, transparent, ${accent}${hov ? "60" : "35"}, transparent)`, zIndex: 3, transition: "all 0.35s ease" }}/>
      {/* Static diagonal shine — top-right to bottom-left */}
      <div style={{ position: "absolute", inset: 0, background: `linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 30%, transparent 50%, transparent 70%, rgba(255,255,255,0.03) 100%)`, pointerEvents: "none" }}/>
      {/* VIRTUS watermark — just below the name divider */}
      <div style={{ position: "absolute", bottom: 34, left: "50%", transform: "translateX(-50%)", fontFamily: "'Cormorant Garamond',serif", fontSize: 22, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.2em", color: "transparent", WebkitTextStroke: `0.7px ${accent}${hov ? "20" : "0c"}`, pointerEvents: "none", userSelect: "none", whiteSpace: "nowrap", transition: "all 0.35s ease" }}>VIRTUS</div>
      {/* Inner radial glow — intensifies on hover */}
      <div style={{ position: "absolute", top: -30, left: "50%", transform: "translateX(-50%)", width: 200, height: 80, borderRadius: "50%", background: `radial-gradient(ellipse, ${accent}${hov ? "18" : "06"}, transparent 70%)`, pointerEvents: "none", transition: "all 0.35s ease" }}/>

      {/* Content */}
      <div style={{ position: "relative", zIndex: 1, padding: mob ? 18 : 22, display: "flex", flexDirection: "column", height: "100%" }}>
        <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: mob ? 12 : 13, color: hov ? C.text1 : C.text2, lineHeight: 1.65, margin: 0, flex: 1, fontStyle: "italic", paddingTop: 2, transition: "color 0.35s ease" }}>
          "{q.text}{q.highlight && <span style={{ color: hov ? C.gold : "inherit", transition: "color 0.35s ease" }}>{q.highlight}</span>}{q.textEnd || ""}"
        </p>
        <div style={{ marginTop: 14, paddingTop: 10, borderTop: `1px solid ${hov ? accent + "20" : "rgba(255,255,255,0.06)"}`, transition: "border-color 0.35s ease" }}>
          <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 15, fontWeight: 700, color: hov ? accent : C.text1, transition: "color 0.35s ease", letterSpacing: 0.3 }}>{name}</div>
          {details && <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, color: C.text3, marginTop: 3 }}>{details}</div>}
        </div>
      </div>
    </div>
  );
};

const TestimonialStrip = () => {
  const { mob, tab } = useBp();
  const useSingleScroll = TESTIMONIALS.length >= 4 && TESTIMONIALS.length < 10;
  const useDualScroll = TESTIMONIALS.length >= 10;

  // Split into two rows for dual scrolling
  const mid = Math.ceil(TESTIMONIALS.length / 2);
  const row1 = TESTIMONIALS.slice(0, mid);
  const row2 = TESTIMONIALS.slice(mid);

  return (
    <Section gradient={`radial-gradient(ellipse 60% 50% at 50% 50%,rgba(200,162,78,0.04) 0%,transparent 50%),linear-gradient(180deg,#090d14 0%,#0a0e15 50%,#090d14 100%)`} style={{ padding: mob ? "70px 0 120px" : "110px 0 210px", position: "relative", overflow: "visible" }}>
      {/* Background VIRTUS watermark — wireframe with top-to-bottom fade */}
      <div style={{ position: "absolute", bottom: mob ? -70 : -100, left: "-10%", right: "-10%", height: mob ? 160 : 280, pointerEvents: "none", userSelect: "none", zIndex: 1, display: "flex", justifyContent: "center" }}>
        <svg width="100%" height="100%" viewBox="0 0 1800 240" preserveAspectRatio="xMidYMid meet" style={{ overflow: "visible" }}>
          <defs>
            <linearGradient id="virtusWmFade" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={C.gold} stopOpacity="0.12"/>
              <stop offset="40%" stopColor={C.gold} stopOpacity="0.07"/>
              <stop offset="70%" stopColor={C.gold} stopOpacity="0.03"/>
              <stop offset="100%" stopColor={C.gold} stopOpacity="0"/>
            </linearGradient>
          </defs>
          <text x="900" y="170" textAnchor="middle" fontFamily="'Cormorant Garamond', serif" fontSize="280" fontWeight="700" letterSpacing="0.25em" fill="none" stroke="url(#virtusWmFade)" strokeWidth="1.2">VIRTUS</text>
        </svg>
      </div>
      <Box>
        <Reveal><p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: mob ? 11 : 12, color: C.gold, textTransform: "uppercase", letterSpacing: 2, marginBottom: 12, fontWeight: 600, textAlign: "center" }}>What Owners Are Saying</p></Reveal>
        <Reveal delay={100}><h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, fontSize: mob ? 28 : 44, lineHeight: 1.1, color: C.text1, textTransform: "uppercase", textAlign: "center", margin: "0 0 " + (mob ? "24px" : "36px"), textShadow: "0 2px 20px rgba(0,0,0,0.5)" }}>Real owners. <GoldText>Real results.</GoldText></h2></Reveal>
      </Box>

      {/* Static grid for <4 quotes */}
      {!useSingleScroll && !useDualScroll && (
        <Box>
          <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : `repeat(${Math.min(TESTIMONIALS.length, 3)}, 1fr)`, gap: mob ? 12 : 20 }}>
            {TESTIMONIALS.map((q, i) => (
              <Reveal key={i} delay={i * 100}>
                <Glass glow={C.gold} style={{ padding: mob ? 18 : 24, display: "flex", flexDirection: "column", height: "100%" }}>
                  <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: mob ? 13 : 14, color: C.text2, lineHeight: 1.65, margin: 0, flex: 1, fontStyle: "italic" }}>"{q.text}"</p>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 16, paddingTop: 12, borderTop: `1px solid ${C.border1}` }}>
                    <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: C.text3 }}>{q.role}</span>
                  </div>
                </Glass>
              </Reveal>
            ))}
          </div>
        </Box>
      )}

      {/* Single-row scrolling for 4-9 quotes */}
      {useSingleScroll && (
        <Reveal delay={200}>
          <div style={{ overflow: "hidden", maskImage: "linear-gradient(90deg, transparent 0%, #000 8%, #000 92%, transparent 100%)", WebkitMaskImage: "linear-gradient(90deg, transparent 0%, #000 8%, #000 92%, transparent 100%)" }}
            onMouseEnter={e => { const row = e.currentTarget.querySelector('[data-scroll-row]'); if (row) row.style.animationPlayState = 'paused'; }}
            onMouseLeave={e => { const row = e.currentTarget.querySelector('[data-scroll-row]'); if (row) row.style.animationPlayState = 'running'; }}>
            <div data-scroll-row="" style={{ display: "flex", gap: mob ? 12 : 16, animation: "testimonialScrollL 50s linear infinite", width: "max-content" }}>
              {[...TESTIMONIALS, ...TESTIMONIALS, ...TESTIMONIALS].map((q, i) => (
                <TestimonialCard key={`r1-${i}`} q={q} mob={mob} idx={i}/>
              ))}
            </div>
          </div>
        </Reveal>
      )}

      {/* Dual-row scrolling for 10+ quotes */}
      {useDualScroll && (
        <Reveal delay={200}>
          <div style={{ overflow: "hidden", maskImage: "linear-gradient(90deg, transparent 0%, #000 8%, #000 92%, transparent 100%)", WebkitMaskImage: "linear-gradient(90deg, transparent 0%, #000 8%, #000 92%, transparent 100%)" }}
            onMouseEnter={e => { e.currentTarget.querySelectorAll('[data-scroll-row]').forEach(r => r.style.animationPlayState = 'paused'); }}
            onMouseLeave={e => { e.currentTarget.querySelectorAll('[data-scroll-row]').forEach(r => r.style.animationPlayState = 'running'); }}>
            <div data-scroll-row="" style={{ display: "flex", gap: mob ? 12 : 16, animation: "testimonialScrollL 45s linear infinite", width: "max-content", marginBottom: mob ? 12 : 16 }}>
              {[...row1, ...row1, ...row1].map((q, i) => (
                <TestimonialCard key={`r1-${i}`} q={q} mob={mob} idx={i}/>
              ))}
            </div>
            <div data-scroll-row="" style={{ display: "flex", gap: mob ? 12 : 16, animation: "testimonialScrollR 50s linear infinite", width: "max-content" }}>
              {[...row2, ...row2, ...row2].map((q, i) => (
                <TestimonialCard key={`r2-${i}`} q={q} mob={mob} idx={i}/>
              ))}
            </div>
          </div>
        </Reveal>
      )}
    </Section>
  );
};

// ═══════════════════════════════════════════════════════════════════
// FOUNDING MEMBER — Community Waitlist (no Valor SW promises)
// ═══════════════════════════════════════════════════════════════════
const FoundingMemberSection = ({ onWaitlist }) => {
  const { mob, tab } = useBp();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const whyJoin = [
    { title: "The full methodology, self-serve", desc: "Access to the constraint-first diagnostic framework in a peer-group format. Run it against your own business alongside owners working through the same constraints." },
    { title: "Cohort-based working sessions", desc: "Live deep-dives where member businesses get analyzed with their permission. Health score, constraint, root cause, fix — walked through in the room." },
    { title: "A peer group that's facing the same problem", desc: "Owners in your revenue range, working through their own constraints. Benchmark yourself honestly against people who understand the numbers." },
    { title: "A library of constraint-resolution playbooks", desc: "Written and video breakdowns of specific constraints and how owners fix them. Searchable by industry, revenue tier, and category." },
    { title: "Founding cohort status, locked", desc: "Your entry rate is locked for the life of the cohort. As the community grows, new cohorts enter at higher prices; you stay where you started." },
  ];
  const alsoIncluded = [
    "Priority access when 1-on-1 partner tier slots open",
    "Founding Cohort status in all member-facing materials",
    "Early input on which constraint workshops get built next",
    "Direct line to Edward during member-only office hours",
    "Discount on the Strategic Intensive if you graduate into 1-on-1",
  ];
  const comingAsItGrows = [
    "In-person member retreats (1–2 per year, opt-in)",
    "Industry cohorts within the community (construction, services, e-com, etc.)",
    "Member directory and peer-match by revenue tier",
    "Guest advisor sessions across specialties (tax, legal, M&A)",
  ];
  const handleSubmit = (e) => {
    e && e.preventDefault && e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;
    setSubmitted(true);
    // eslint-disable-next-line no-console
    console.log("[Virtus] Community waitlist submission:", email);
  };
  return (
    <Section id="community" gradient={`radial-gradient(ellipse 80% 65% at 50% 60%,rgba(34,211,238,0.08) 0%,transparent 55%),radial-gradient(ellipse 50% 40% at 20% 80%,#081820 0%,transparent 50%),linear-gradient(180deg,#090d14 0%,#0c1018 50%,#090d14 100%)`} style={{ padding: mob ? "60px 0" : "100px 0" }}>
      <Caustic x="10%" y="20%" angle={-8} width={mob ? 350 : 600} opacity={0.15} color={C.cyan}/>
      <Caustic x="60%" y="80%" angle={12} width={400} opacity={0.1} color={C.goldLight}/>
      <Box>
        <Reveal>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 16px", borderRadius: 100, background: `${C.gold}08`, border: `1px solid ${C.gold}20`, marginBottom: mob ? 16 : 20 }}>
            <IconClock size={14} color={C.gold}/>
            <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: mob ? 11 : 12, fontWeight: 600, color: C.gold, letterSpacing: 0.3 }}>Coming Soon · Waitlist Open</span>
          </div>
        </Reveal>
        <Reveal delay={100}>
          <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, fontSize: mob ? 28 : tab ? 36 : 48, lineHeight: 1.05, color: C.text1, textTransform: "uppercase", margin: "0 0 12px", textShadow: "0 2px 20px rgba(0,0,0,0.5)" }}>
            Build With <GoldText>Valor</GoldText>
          </h2>
        </Reveal>
        <Reveal delay={200}>
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: mob ? 15 : 17, lineHeight: 1.65, color: C.text2, margin: "0 0 14px", maxWidth: 720 }}>
            The founding member group for Build With Valor is forming. For owners who want to run the constraint-first methodology themselves, alongside peers at their revenue tier — with accountability, shared frameworks, and first access to everything we build next.
          </p>
        </Reveal>
        <Reveal delay={250}>
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: mob ? 12 : 13, lineHeight: 1.6, color: C.text3, margin: "0 0 36px", maxWidth: 720, fontStyle: "italic" }}>
            Pricing and launch date are being finalized. Waitlist members get first access, founding-cohort pricing, and input on format.
          </p>
        </Reveal>
        <div style={{ display: "flex", flexDirection: mob ? "column" : "row", gap: mob ? 24 : 36, alignItems: "flex-start" }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <Reveal delay={300}>
              <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: C.cyan, textTransform: "uppercase", letterSpacing: 1.2, fontWeight: 700, marginBottom: 14 }}>Why Members Will Join</div>
            </Reveal>
            {whyJoin.map((b, i) => (
              <Reveal key={i} delay={320 + i * 60}>
                <Glass style={{ padding: mob ? 14 : 18, marginBottom: 10 }}>
                  <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <div style={{ flexShrink: 0, marginTop: 2 }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <polygon points="12 2 15 9 22 10 17 15 18 22 12 19 6 22 7 15 2 10 9 9 12 2" stroke={C.cyan} strokeWidth="1.5" fill={`${C.cyan}15`} strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: mob ? 13 : 14, fontWeight: 700, color: C.text1, marginBottom: 4 }}>{b.title}</div>
                      <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: mob ? 11 : 12, color: C.text2, lineHeight: 1.55 }}>{b.desc}</div>
                    </div>
                  </div>
                </Glass>
              </Reveal>
            ))}
            <Reveal delay={700}>
              <Glass style={{ padding: mob ? 16 : 20, marginTop: 14 }}>
                <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, color: C.text3, textTransform: "uppercase", letterSpacing: 1.2, fontWeight: 700, marginBottom: 10 }}>Also Included</div>
                {alsoIncluded.map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 7 }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: 3 }}>
                      <polyline points="4 12 10 18 20 6" stroke={C.cyan} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: mob ? 11 : 12, color: C.text2, lineHeight: 1.5 }}>{item}</span>
                  </div>
                ))}
                <div style={{ height: 1, background: C.border1, margin: "14px 0 12px" }}/>
                <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, color: C.text3, textTransform: "uppercase", letterSpacing: 1.2, fontWeight: 700, marginBottom: 10 }}>Coming As The Community Grows</div>
                {comingAsItGrows.map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 7 }}>
                    <div style={{ width: 8, height: 8, borderRadius: 4, border: `1.5px solid ${C.cyan}50`, flexShrink: 0, marginTop: 4 }}/>
                    <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: mob ? 11 : 12, color: C.text3, lineHeight: 1.5 }}>{item}</span>
                  </div>
                ))}
              </Glass>
            </Reveal>
          </div>
          <Reveal delay={350} style={{ width: mob ? "100%" : tab ? 340 : 400, flexShrink: 0, position: mob ? "static" : "sticky", top: 100 }}>
            <Glass intensity="strong" glow={C.cyan} style={{ padding: mob ? 24 : 28, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", inset: 0, opacity: 0.03, backgroundImage: `linear-gradient(rgba(34,211,238,0.3) 1px,transparent 1px),linear-gradient(90deg,rgba(34,211,238,0.3) 1px,transparent 1px)`, backgroundSize: "24px 24px" }}/>
              <div style={{ position: "relative", zIndex: 1 }}>
                <div style={{ display: "inline-block", marginBottom: 16, padding: "5px 12px", borderRadius: 6, border: `1px solid ${C.cyan}50` }}>
                  <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, fontWeight: 700, color: C.cyan, letterSpacing: 1.2, textTransform: "uppercase" }}>Founding Cohort Waitlist</span>
                </div>
                <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: mob ? 26 : 30, fontWeight: 700, color: C.text1, lineHeight: 1.1, margin: "0 0 10px" }}>Reserve your place.</h3>
                <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: C.text2, lineHeight: 1.6, margin: "0 0 20px" }}>
                  We're starting with 100 founding members at $49/month. Founding members get first access to new tools, frameworks, and features as they launch. Waitlist members get the first invites.
                </p>
                <div style={{ padding: "14px 14px", borderRadius: 10, background: "rgba(255,255,255,0.02)", border: `1px solid ${C.border1}`, marginBottom: 18 }}>
                  <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 9, color: C.text3, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10, fontWeight: 700 }}>What The Waitlist Gets You</div>
                  {["First access when seats open", "Founding-cohort rate, locked", "Input on format and cadence", "Zero obligation — opt out anytime"].map((item, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                        <polyline points="4 12 10 18 20 6" stroke={C.cyan} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: C.text2 }}>{item}</span>
                    </div>
                  ))}
                </div>
                {!submitted ? (
                  <>
                    <input type="email" placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSubmit(e)}
                      style={{ width: "100%", padding: "13px 16px", borderRadius: 10, background: C.bgInput, border: `1px solid ${C.border2}`, color: C.text1, fontSize: 14, fontFamily: "'DM Sans',sans-serif", outline: "none", marginBottom: 10, boxSizing: "border-box" }}/>
                    <CyanBtn large style={{ width: "100%" }} onClick={handleSubmit}>Join The Waitlist →</CyanBtn>
                    <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: C.text3, textAlign: "center", marginTop: 10, lineHeight: 1.5 }}>
                      No spam. No pressure. When the cohort opens you'll be the first to know.
                    </p>
                  </>
                ) : (
                  <div style={{ padding: "16px 14px", borderRadius: 10, background: `${C.green}08`, border: `1px solid ${C.green}25`, textAlign: "center" }}>
                    <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: C.green, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>You're on the list</div>
                    <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: C.text2 }}>We'll email <span style={{ color: C.text1, fontWeight: 600 }}>{email}</span> the moment the cohort opens.</div>
                  </div>
                )}
              </div>
            </Glass>
          </Reveal>
        </div>
      </Box>
    </Section>
  );
};

// ═══════════════════════════════════════════════════════════════════
// COMPARISON TABLE — With a partner vs Without
// ═══════════════════════════════════════════════════════════════════
const InfoTip = ({ text, mob }) => {
  const [show, setShow] = useState(false);
  return (
    <span style={{ position: "relative", display: "inline-flex", alignItems: "center", marginLeft: 6, cursor: "pointer", verticalAlign: "middle" }}
      onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}
      onClick={() => setShow(p => !p)}>
      <div style={{ width: 16, height: 16, borderRadius: "50%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.2s", ...(show ? { background: `${C.gold}15`, borderColor: `${C.gold}40` } : {}) }}>
        <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 9, fontWeight: 700, color: show ? C.gold : C.text4, transition: "color 0.2s" }}>i</span>
      </div>
      {show && (
        <div style={{ position: "absolute", top: "calc(100% + 8px)", left: 0, width: mob ? 240 : 300, padding: "12px 14px", borderRadius: 10, backgroundColor: "#0d1117", border: `1px solid ${C.gold}30`, boxShadow: `0 12px 40px rgba(0,0,0,1), 0 4px 12px rgba(0,0,0,0.9)`, zIndex: 9999, isolation: "isolate" }}>
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: C.text2, lineHeight: 1.5, margin: 0 }}>{text}</p>
          <div style={{ position: "absolute", top: -5, left: 4, transform: "rotate(45deg)", width: 8, height: 8, backgroundColor: "#0d1117", borderLeft: `1px solid ${C.gold}30`, borderTop: `1px solid ${C.gold}30` }}/>
        </div>
      )}
    </span>
  );
};

const ComparisonTable = () => {
  const { mob, tab } = useBp();
  const [guaranteeOpen, setGuaranteeOpen] = useState(false);
  const rows = [
    { label: "Actively working to help grow profits and close the Profit Gap", info: "The Profit Gap is the difference between your current EBITDA and what best-in-class businesses at your revenue tier earn. It's the profit you're leaving on the table every year — often without knowing it." },
    { label: "Helping build enterprise value and tracking valuation growth", info: "Enterprise value is what your business is worth to a buyer, investor, or to you as a long-term asset. We track it quarterly so you can see the direct impact of every constraint you fix." },
    { label: "Identify and prioritize fixing the #1 constraint each quarter", info: "Instead of a 40-item to-do list, we identify the single bottleneck suppressing your profit and value, then execute against it in focused 90-day sprints. Fix one, re-score, repeat." },
    { label: "Hands-on execution — develop offer structure to stand out from competitors, pricing, systems implementation, talent acquisition, etc.", info: "This isn't consulting where you get a report and figure it out yourself. We build the financial models, pricing tables, scorecards, hiring profiles, and project plans — then project-manage execution with your team. Degree depends on service tier." },
    { label: "Coordinating your full advisor team (CPA, legal, wealth, M&A)", info: "Most owners have 3-5 advisors who never talk to each other — and sometimes give contradictory advice. We coordinate the full team so everyone rows in the same direction toward a common outcome." },
    { label: "Conditional valuation growth guarantee — backed by free work if unmet", info: "We put our fee at risk. If we don't deliver measurable valuation growth within 24 months (with conditions met), we work for free until we do. Click below for details.", highlight: true },
  ];
  return (
    <Section gradient={`radial-gradient(ellipse 70% 50% at 50% 50%,rgba(200,162,78,0.06) 0%,transparent 55%),linear-gradient(180deg,#090d14 0%,#0a0e15 100%)`} style={{ padding: mob ? "50px 0 30px" : "70px 0 50px" }}>
      <Caustic x="20%" y="30%" angle={-6} width={mob ? 300 : 500} opacity={0.1}/>
      <Box>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: mob ? 24 : 36 }}>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: mob ? 11 : 12, color: C.gold, textTransform: "uppercase", letterSpacing: 1.8, marginBottom: 10, fontWeight: 600 }}>The Missing Piece</p>
            <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, fontSize: mob ? 28 : tab ? 36 : 44, lineHeight: 1.1, color: C.text1, textTransform: "uppercase", margin: "0 0 12px", textShadow: "0 2px 20px rgba(0,0,0,0.5)" }}>
              What falls through <GoldText>the gap.</GoldText>
            </h2>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: mob ? 13 : 15, color: C.text2, margin: "0 auto", maxWidth: 540, lineHeight: 1.6 }}>
              Your CPA handles compliance and tax. Your bookkeeper keeps records clean. Both are essential — but between those roles, there's a gap where profit growth, constraint execution, and valuation building happen.
            </p>
          </div>
        </Reveal>
        <Reveal delay={150}>
          <div style={{ borderRadius: 18, background: "rgba(255,255,255,0.02)", border: `1.5px solid ${C.gold}15`, boxShadow: `0 8px 40px rgba(0,0,0,0.3), 0 0 50px ${C.gold}05`, position: "relative" }}>
            {/* Diagonal shine */}
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.015) 30%, transparent 50%, transparent 70%, rgba(255,255,255,0.02) 100%)", pointerEvents: "none", zIndex: -1 }}/>
            <div style={{ position: "absolute", top: 0, left: "10%", width: "80%", height: 1.5, background: `linear-gradient(90deg, transparent, ${C.gold}30, transparent)`, zIndex: -1 }}/>
            {/* Header */}
            <div style={{ display: "grid", gridTemplateColumns: mob ? "1.4fr 0.8fr 0.8fr" : "2fr 1fr 1fr", padding: mob ? "18px 16px" : "22px 28px", borderBottom: `1px solid ${C.border2}`, background: `${C.gold}03`, position: "relative", zIndex: 1, borderRadius: "18px 18px 0 0" }}>
              <div/>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: mob ? 9 : 11, color: C.text3, textTransform: "uppercase", letterSpacing: 0.8, fontWeight: 600, whiteSpace: "nowrap" }}>Your Current Team</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: mob ? 9 : 11, color: C.gold, textTransform: "uppercase", letterSpacing: 0.8, fontWeight: 700, whiteSpace: "nowrap" }}>With Kriczky Virtus</div>
              </div>
            </div>
            {/* Rows */}
            <div style={{ position: "relative", zIndex: 10 }}>
              {rows.map((row, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: mob ? "1.4fr 0.8fr 0.8fr" : "2fr 1fr 1fr", padding: mob ? "12px 16px" : "15px 28px", borderBottom: i < rows.length - 1 ? "1px solid rgba(255,255,255,0.03)" : "none", background: row.highlight ? `linear-gradient(90deg, ${C.gold}08, ${C.gold}04)` : "transparent", borderLeft: row.highlight ? `3px solid ${C.gold}50` : "3px solid transparent", alignItems: "center", transition: "background 0.2s" }}
                  onMouseEnter={e => { if(!row.highlight) e.currentTarget.style.background = "rgba(255,255,255,0.02)"; }}
                  onMouseLeave={e => { if(!row.highlight) e.currentTarget.style.background = row.highlight ? "" : "transparent"; }}
                >
                  <div>
                    <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: mob ? 12 : 14, color: row.highlight ? C.gold : C.text2, fontWeight: row.highlight ? 600 : 400, lineHeight: 1.45 }}>{row.label}</span>
                    {row.info && <InfoTip text={row.info} mob={mob}/>}
                  </div>
                  <div style={{ textAlign: "center", display: "flex", justifyContent: "center" }}>
                    <div style={{ width: 22, height: 22, borderRadius: "50%", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <svg width="10" height="2" viewBox="0 0 10 2" fill="none"><line x1="1" y1="1" x2="9" y2="1" stroke={C.text4} strokeWidth="1.5" strokeLinecap="round"/></svg>
                    </div>
                  </div>
                  <div style={{ textAlign: "center", display: "flex", justifyContent: "center" }}>
                    <div style={{ width: 22, height: 22, borderRadius: "50%", background: `${C.gold}12`, border: `1px solid ${C.gold}25`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none"><polyline points="4 12 10 18 20 6" stroke={C.gold} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* Guarantee — collapsible ROI section */}
            <div style={{ borderTop: `1.5px solid ${C.gold}25`, position: "relative", zIndex: 1 }}>
              <div onClick={() => setGuaranteeOpen(p => !p)} style={{ padding: mob ? "16px 16px" : "20px 28px", background: `linear-gradient(135deg, ${C.gold}${guaranteeOpen ? "0c" : "08"}, ${C.gold}04)`, cursor: "pointer", userSelect: "none", transition: "background 0.3s" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: mob ? 12 : 16 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: `${C.gold}12`, border: `1px solid ${C.gold}30`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.gold} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                    </div>
                    <div>
                      <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: mob ? 16 : 20, fontWeight: 700, color: C.cyan, lineHeight: 1.2 }}>The Valuation Growth Guarantee</div>
                      <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: mob ? 11 : 12, color: C.text2, marginTop: 2 }}>
                        If your business value doesn't quantifiably grow by at least $250K within 24 months, we keep working for free.
                      </div>
                    </div>
                  </div>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginLeft: 12, transform: guaranteeOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.3s ease" }}>
                    <polyline points="6 9 12 15 18 9" stroke={C.gold} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>

              {/* Expanded details */}
              <div style={{ maxHeight: guaranteeOpen ? 400 : 0, opacity: guaranteeOpen ? 1 : 0, overflow: "hidden", transition: "max-height 0.4s cubic-bezier(0.4,0,0.2,1), opacity 0.3s ease" }}>
                <div style={{ padding: mob ? "0 16px 20px" : "0 28px 24px" }}>
                  <div style={{ height: 1, background: `${C.gold}15`, marginBottom: 16 }}/>
                  <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: mob ? 12 : 13, color: C.text1, lineHeight: 1.6, margin: "0 0 10px" }}>
                    <span style={{ fontWeight: 600, color: C.gold }}>Clarity Partner tier ($3K/mo):</span> If your documented valuation hasn't grown by $250K within 24 months, we work with you for up to 6 additional months of hands-on execution help for free until it does.
                  </p>
                  <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: mob ? 12 : 13, color: C.text1, lineHeight: 1.6, margin: "0 0 12px" }}>
                    <span style={{ fontWeight: 600, color: C.gold }}>Growth Partner tier ($5K/mo):</span> The threshold is $500K, with up to 12 months of additional 1:1 hands-on execution help for free until it does.
                  </p>
                  <div style={{ padding: "12px 16px", borderRadius: 10, background: "rgba(255,255,255,0.02)", border: `1px solid ${C.border1}` }}>
                    <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: C.text3, marginBottom: 6 }}>Conditions</div>
                    {["80%+ session attendance over the engagement period", "Execution of agreed-upon action items each quarter", "Use of the approved advisor stack (CPA, wealth advisor, legal, etc.)"].map((c, ci) => (
                      <div key={ci} style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: ci < 2 ? 5 : 0 }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: 3 }}><polyline points="4 12 10 18 20 6" stroke={C.gold} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: mob ? 11 : 12, color: C.text2, lineHeight: 1.5 }}>{c}</span>
                      </div>
                    ))}
                    <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, color: C.text3, margin: "8px 0 0", fontStyle: "italic" }}>Full terms discussed during the working session.</p>
                  </div>
                </div>
              </div>
            </div>
            {/* Bottom bar */}
            <div style={{ padding: mob ? "16px 16px" : "20px 28px", background: `${C.gold}04`, borderTop: `1px solid ${C.gold}12`, position: "relative", zIndex: 1, borderRadius: "0 0 18px 18px" }}>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: mob ? 12 : 14, color: C.text1, margin: 0, lineHeight: 1.55, textAlign: "center" }}>
                <span style={{ color: C.gold, fontWeight: 700 }}>Your CPA, bookkeeper/fractional-CFO, and attorney are essential.</span> Virtus is the partner that fills the gap between them — helping actively grow profits, build business valuation, and coordinate the whole team to row in the same direction for a common outcome — a more profitable and valuable business that is an asset that runs without you day-to-day.
              </p>
            </div>
          </div>
        </Reveal>
      </Box>
    </Section>
  );
};

// ═══════════════════════════════════════════════════════════════════
// GO DEEPER — Auto-cycling animated previews of Resources Hub tools
// ═══════════════════════════════════════════════════════════════════
const SCORE_SCENARIOS = [
  { label: "Not Sellable", scores: [2,3,2,3,3,2,3,2,3,3], bandIdx: 0, bandColor: C.red, pct: 43 },
  { label: "Discount", scores: [3,4,2,3,3,3,2,3,4,3], bandIdx: 1, bandColor: C.amber, pct: 50 },
  { label: "Market", scores: [4,4,3,4,4,4,3,4,4,3], bandIdx: 2, bandColor: C.gold, pct: 62 },
  { label: "Green Zone", scores: [4,5,4,5,4,3,4,5,3,4], bandIdx: 3, bandColor: C.cyan, pct: 68 },
  { label: "Best-In-Class", scores: [5,5,5,5,5,5,4,5,5,4], bandIdx: 4, bandColor: C.green, pct: 80 },
];
const SCORE_DIMS_A = ["Market Position","Revenue Quality","Financial Performance","Customer Concentration","Management Team"];
const SCORE_DIMS_R = ["Documentation","Contingency","Financial Infrastructure","Revenue Predictability","Mgmt Succession"];
const SCORE_BANDS = [
  { label: "Not Sellable", mult: "0×", color: C.red },
  { label: "Discount", mult: "3–4×", color: C.amber },
  { label: "Market", mult: "~5×", color: C.gold },
  { label: "Green Zone", mult: "5–6×", color: C.cyan },
  { label: "Best-In-Class", mult: "7–8×", color: C.green },
];
const GAP_SCENARIOS = [
  { rev:2000,mg:12,bic:22,lm:1.5,hm:5 },
  { rev:4000,mg:15,bic:24,lm:3,hm:6 },
  { rev:7500,mg:10,bic:20,lm:2,hm:5 },
  { rev:3000,mg:8,bic:18,lm:1.5,hm:5.5 },
  { rev:6000,mg:22,bic:30,lm:4,hm:8 },
];

const GoDeeper = () => {
  const { mob, tab } = useBp();
  const [si, setSi] = useState(2);
  const [gi, setGi] = useState(1);
  useEffect(() => { const t = setInterval(() => setSi(p => (p+1) % SCORE_SCENARIOS.length), 4500); return () => clearInterval(t); }, []);
  useEffect(() => { const t = setInterval(() => setGi(p => (p+1) % GAP_SCENARIOS.length), 5200); return () => clearInterval(t); }, []);

  const sc = SCORE_SCENARIOS[si];
  const a0=useAnim(sc.scores[0]);const a1=useAnim(sc.scores[1]);const a2=useAnim(sc.scores[2]);const a3=useAnim(sc.scores[3]);const a4=useAnim(sc.scores[4]);
  const a5=useAnim(sc.scores[5]);const a6=useAnim(sc.scores[6]);const a7=useAnim(sc.scores[7]);const a8=useAnim(sc.scores[8]);const a9=useAnim(sc.scores[9]);
  const aPct = useAnim(sc.pct);
  const aT = a0+a1+a2+a3+a4+a5+a6+a7+a8+a9;

  const gs = GAP_SCENARIOS[gi];
  const ebitda = gs.rev*(gs.mg/100); const bicE = gs.rev*(gs.bic/100);
  const curV = ebitda*gs.lm; const potV = bicE*gs.hm;
  const aEbitda = useAnim(ebitda); const aBicE = useAnim(bicE);
  const aCurV = useAnim(curV); const aPotV = useAnim(potV);
  const aVGap = useAnim(potV-curV); const aPGap = useAnim(bicE-ebitda);
  const maxBar = Math.max(potV, curV) * 1.15;
  const fmt = (n) => { const a=Math.abs(n); return a>=1000?`$${(n/1000).toFixed(1)}M`:`$${Math.round(n)}K`; };

  const scCol = (n) => n<=2?C.red:n<=3?C.amber:n<=4?C.cyan:C.green;

  const MiniBar = ({ label, score }) => {
    const col = scCol(score);
    const pct = (score / 6) * 100;
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
        <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: mob ? 8 : 10, color: C.text3, width: mob ? 75 : 95, textAlign: "right", flexShrink: 0 }}>{label}</span>
        <div style={{ flex: 1, height: mob ? 8 : 10, borderRadius: 5, background: "rgba(255,255,255,0.04)", overflow: "hidden", position: "relative" }}>
          <div style={{ position: "absolute", top: 0, left: 0, bottom: 0, width: `${pct}%`, borderRadius: 5, background: `linear-gradient(180deg, ${col}30, ${col}15)`, border: `0.5px solid ${col}`, boxShadow: `0 0 6px ${col}20, inset 0 1px 0 ${col}15`, transition: "all 1s cubic-bezier(0.4,0,0.2,1)" }}/>
        </div>
        <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: mob ? 9 : 11, fontWeight: 700, color: col, width: 14, textAlign: "center", transition: "color 1s ease" }}>{score}</span>
      </div>
    );
  };

  const FreeBadge = ({ color = C.green }) => (
    <div style={{ position: "relative", overflow: "hidden", padding: "5px 18px", borderRadius: 8, background: `linear-gradient(135deg, ${color}15, ${color}08)`, border: `1px solid ${color}35`, boxShadow: `0 0 12px ${color}12`, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ position: "absolute", top: "-50%", left: "-50%", right: "-50%", bottom: "-50%", pointerEvents: "none", background: `linear-gradient(120deg, transparent 0%, transparent 42%, ${color}12 48%, ${color}25 50%, ${color}12 52%, transparent 58%, transparent 100%)`, backgroundSize: "200% 200%", animation: "btnShimmerSlow 20s ease-in-out infinite" }}/>
      <span style={{ position: "relative", zIndex: 1, fontFamily: "'DM Sans',sans-serif", fontSize: 11, fontWeight: 700, color, letterSpacing: "0.08em" }}>FREE</span>
    </div>
  );

  return (
    <Section style={{ padding: mob ? "70px 0" : "110px 0" }}>
      <Box>
        <div style={{ textAlign: "center", marginBottom: mob ? 28 : 44 }}>
          <Reveal>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: mob ? 11 : 12, color: C.gold, textTransform: "uppercase", letterSpacing: 1.8, marginBottom: 10, fontWeight: 600 }}>Free Diagnostic Tools</p>
          </Reveal>
          <Reveal delay={100}>
            <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, fontSize: mob ? 28 : tab ? 38 : 48, lineHeight: 1.08, color: C.text1, textTransform: "uppercase", margin: "0 0 14px", letterSpacing: -0.5, textShadow: "0 2px 20px rgba(0,0,0,0.5)" }}>
              Go deeper. <GoldText>For free.</GoldText>
            </h2>
          </Reveal>
          <Reveal delay={150}>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: mob ? 13 : 16, color: C.text2, margin: "0 auto", maxWidth: 580, lineHeight: 1.6 }}>
              See how the scoring works, explore your Profit and Value Gaps, and discover the specific drivers that determine what your business is actually worth.
            </p>
          </Reveal>
        </div>

        <Reveal delay={200}>
          <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "1fr 1fr", gap: mob ? 18 : 24, marginBottom: mob ? 32 : 40 }}>

            {/* SCORING PREVIEW */}
            <div style={{ padding: mob ? 20 : 28, borderRadius: 18, background: "linear-gradient(160deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.015) 100%)", border: `1.5px solid ${C.cyan}20`, boxShadow: `0 6px 30px rgba(0,0,0,0.25), 0 0 40px ${C.cyan}05`, position: "relative", overflow: "hidden", cursor: "pointer", transition: "all 0.3s ease" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = `${C.cyan}50`; e.currentTarget.style.boxShadow = `0 8px 36px rgba(0,0,0,0.35), 0 0 60px ${C.cyan}15`; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = `${C.cyan}20`; e.currentTarget.style.boxShadow = `0 6px 30px rgba(0,0,0,0.25), 0 0 40px ${C.cyan}05`; }}
            >
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 30%, transparent 50%, transparent 70%, rgba(255,255,255,0.03) 100%)", pointerEvents: "none", zIndex: 0 }}/>
              <div style={{ position: "absolute", top: 0, left: "10%", width: "80%", height: 1.5, background: `linear-gradient(90deg, transparent, ${C.cyan}40, transparent)` }}/>

              <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", height: "100%" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: mob ? 12 : 16 }}>
                  <div>
                    <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: mob ? 9 : 10, color: C.cyan, textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700, marginBottom: 3 }}>Opportunities for Improvement in Your Business</div>
                    <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: mob ? 16 : 20, fontWeight: 700, color: C.text1, lineHeight: 1.2 }}>Business Attractiveness & Readiness</div>
                  </div>
                  <FreeBadge/>
                </div>

                {/* Scenario indicator */}
                <div style={{ display: "flex", gap: 4, marginBottom: mob ? 10 : 14 }}>
                  {SCORE_SCENARIOS.map((s,i) => (
                    <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: si===i ? s.bandColor : "rgba(255,255,255,0.06)", transition: "background 0.4s ease" }}/>
                  ))}
                </div>

                {/* Bars grid */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: mob ? 8 : 14, marginBottom: mob ? 10 : 14 }}>
                  <div>
                    <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: mob ? 8 : 9, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: C.cyan, marginBottom: 6 }}>Business Attractiveness</div>
                    {SCORE_DIMS_A.map((d,j) => { const s=sc.scores[j]; const col=scCol(s); return (
                      <div key={d} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                        <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: mob ? 8 : 10, color: C.text3, width: mob ? 75 : 95, textAlign: "right", flexShrink: 0 }}>{d}</span>
                        <div style={{ flex: 1, height: mob ? 8 : 10, borderRadius: 5, background: "rgba(255,255,255,0.04)", overflow: "hidden", position: "relative" }}>
                          <div style={{ position: "absolute", top: 0, left: 0, bottom: 0, width: `${(s/6)*100}%`, borderRadius: 5, background: `linear-gradient(180deg, ${col}30, ${col}15)`, border: `0.5px solid ${col}`, boxShadow: `0 0 6px ${col}20, inset 0 1px 0 ${col}15`, transition: "all 1s cubic-bezier(0.4,0,0.2,1)" }}/>
                        </div>
                        <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: mob ? 9 : 11, fontWeight: 700, color: col, width: 14, textAlign: "center", transition: "color 1s ease" }}>{s}</span>
                      </div>
                    );})}
                  </div>
                  <div>
                    <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: mob ? 8 : 9, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: C.gold, marginBottom: 6 }}>Business Readiness</div>
                    {SCORE_DIMS_R.map((d,j) => { const s=sc.scores[j+5]; const col=scCol(s); return (
                      <div key={d} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                        <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: mob ? 8 : 10, color: C.text3, width: mob ? 75 : 95, textAlign: "right", flexShrink: 0 }}>{d}</span>
                        <div style={{ flex: 1, height: mob ? 8 : 10, borderRadius: 5, background: "rgba(255,255,255,0.04)", overflow: "hidden", position: "relative" }}>
                          <div style={{ position: "absolute", top: 0, left: 0, bottom: 0, width: `${(s/6)*100}%`, borderRadius: 5, background: `linear-gradient(180deg, ${col}30, ${col}15)`, border: `0.5px solid ${col}`, boxShadow: `0 0 6px ${col}20, inset 0 1px 0 ${col}15`, transition: "all 1s cubic-bezier(0.4,0,0.2,1)" }}/>
                        </div>
                        <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: mob ? 9 : 11, fontWeight: 700, color: col, width: 14, textAlign: "center", transition: "color 1s ease" }}>{s}</span>
                      </div>
                    );})}
                  </div>
                </div>

                {/* Combined + placement */}
                <div style={{ padding: "10px 0 0", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                    <div>
                      <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 8, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: C.text4 }}>Combined </span>
                      <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: mob ? 22 : 26, fontWeight: 700, color: C.text1 }}>{Math.round(aT)}</span>
                      <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: C.text4 }}>/60</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: mob ? 10 : 11, fontWeight: 700, color: sc.bandColor, transition: "color 0.6s" }}>{sc.label}</span>
                      <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: mob ? 20 : 24, fontWeight: 700, color: sc.bandColor, transition: "color 0.6s" }}>{Math.round(aPct)}%</span>
                    </div>
                  </div>

                  {/* Placement bar */}
                  <div style={{ position: "relative", height: 8, borderRadius: 4, background: "linear-gradient(90deg, #F87171, #FBBF24, #D4A63E, #22D3EE, #34D399)", overflow: "visible", marginBottom: 10 }}>
                    <div style={{ position: "absolute", top: -4, width: 16, height: 16, borderRadius: "50%", background: sc.bandColor, border: "2.5px solid white", boxShadow: `0 0 10px ${sc.bandColor}80`, left: `${sc.pct}%`, transform: "translateX(-50%)", transition: "left 0.8s cubic-bezier(0.4,0,0.2,1), background 0.6s ease" }}/>
                  </div>

                  {/* Multiple ranges */}
                  <div style={{ display: "flex", gap: 4 }}>
                    {SCORE_BANDS.map((b,i) => (
                      <div key={i} style={{ flex: 1, textAlign: "center", padding: "6px 3px", borderRadius: 5, background: si===i ? `${b.color}12` : "rgba(255,255,255,0.02)", border: `1px solid ${si===i ? b.color+"30" : "rgba(255,255,255,0.04)"}`, transition: "all 0.6s ease" }}>
                        <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: mob ? 7 : 9, fontWeight: 600, color: si===i ? b.color : C.text4, transition: "color 0.6s" }}>{b.label}</div>
                        <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: mob ? 8 : 10, fontWeight: 700, color: si===i ? b.color : C.text4, transition: "color 0.6s" }}>{b.mult}</div>
                      </div>
                    ))}
                  </div>

                  {/* Disclaimer */}
                  <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: mob ? 8 : 10, color: C.text4, fontStyle: "italic", margin: "0", marginTop: "auto", paddingTop: 10, lineHeight: 1.4, textAlign: "center" }}>Multiple ranges vary by industry, revenue, growth rate, and risk profile. For educational and illustrative purposes only. Multiple ranges and valuations not guaranteed.</p>
                </div>
              </div>
            </div>

            {/* VALUE GAP PREVIEW */}
            <div style={{ padding: mob ? 20 : 28, borderRadius: 18, background: "linear-gradient(160deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.015) 100%)", border: `1.5px solid ${C.gold}20`, boxShadow: `0 6px 30px rgba(0,0,0,0.25), 0 0 40px ${C.gold}05`, position: "relative", overflow: "hidden", cursor: "pointer", transition: "all 0.3s ease" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = `${C.gold}50`; e.currentTarget.style.boxShadow = `0 8px 36px rgba(0,0,0,0.35), 0 0 60px ${C.gold}15`; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = `${C.gold}20`; e.currentTarget.style.boxShadow = `0 6px 30px rgba(0,0,0,0.25), 0 0 40px ${C.gold}05`; }}
            >
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 30%, transparent 50%, transparent 70%, rgba(255,255,255,0.03) 100%)", pointerEvents: "none", zIndex: 0 }}/>
              <div style={{ position: "absolute", top: 0, left: "10%", width: "80%", height: 1.5, background: `linear-gradient(90deg, transparent, ${C.gold}40, transparent)` }}/>

              <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", height: "100%" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: mob ? 12 : 16 }}>
                  <div>
                    <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: mob ? 9 : 10, color: C.gold, textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700, marginBottom: 3 }}>See The Gaps</div>
                    <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: mob ? 16 : 20, fontWeight: 700, color: C.text1, lineHeight: 1.2 }}>Profit & Value Gaps</div>
                  </div>
                  <FreeBadge/>
                </div>

                {/* Scenario dots */}
                <div style={{ display: "flex", gap: 4, marginBottom: mob ? 10 : 14 }}>
                  {GAP_SCENARIOS.map((_,i) => (
                    <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: gi===i ? C.gold : "rgba(255,255,255,0.06)", transition: "background 0.4s ease" }}/>
                  ))}
                </div>

                {/* EBITDA comparison */}
                <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
                  <div style={{ flex: 1, textAlign: "center", padding: "10px 8px", borderRadius: 10, background: `${C.amber}06`, border: `1px solid ${C.amber}12` }}>
                    <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 8, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: C.amber, marginBottom: 3 }}>Your EBITDA</div>
                    <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: mob ? 20 : 24, fontWeight: 700, color: C.text1 }}>{fmt(Math.round(aEbitda))}</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.gold} strokeWidth="2" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                  </div>
                  <div style={{ flex: 1, textAlign: "center", padding: "10px 8px", borderRadius: 10, background: `${C.green}06`, border: `1px solid ${C.green}12` }}>
                    <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 8, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: C.green, marginBottom: 3 }}>Best-In-Class</div>
                    <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: mob ? 20 : 24, fontWeight: 700, color: C.text1 }}>{fmt(Math.round(aBicE))}</div>
                  </div>
                </div>

                {/* Value bars */}
                <div style={{ padding: "12px 14px", borderRadius: 10, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", marginBottom: 14 }}>
                  {[{ label: "Current Value", val: aCurV, color: C.red }, { label: "Potential Value", val: aPotV, color: C.green }].map((r,i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: i===0 ? 8 : 0 }}>
                      <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: mob ? 9 : 10, color: C.text2, width: 80, textAlign: "right", flexShrink: 0 }}>{r.label}</span>
                      <div style={{ flex: 1, height: 14, borderRadius: 7, background: "rgba(255,255,255,0.04)", overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${Math.max((r.val/maxBar)*100, 1)}%`, borderRadius: 7, background: `linear-gradient(180deg, ${r.color}30, ${r.color}15)`, border: `0.5px solid ${r.color}`, boxShadow: `0 0 8px ${r.color}20, inset 0 1px 0 ${r.color}15`, transition: "width 0.8s cubic-bezier(0.4,0,0.2,1)" }}/>
                      </div>
                      <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: mob ? 14 : 16, fontWeight: 700, color: r.color, width: 55, textAlign: "right" }}>{fmt(Math.round(r.val))}</span>
                    </div>
                  ))}
                </div>

                {/* Gap callouts with descriptions */}
                <div style={{ display: "flex", gap: 10 }}>
                  <div style={{ flex: 1, textAlign: "center", padding: "10px 10px", borderRadius: 10, background: `${C.gold}06`, border: `1px solid ${C.gold}12` }}>
                    <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 8, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: C.gold, marginBottom: 3 }}>Value Gap</div>
                    <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: mob ? 20 : 24, fontWeight: 700, color: C.gold, marginBottom: 4 }}>{fmt(Math.round(aVGap))}</div>
                    <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 8, color: C.text3, lineHeight: 1.35, margin: 0 }}>The difference between what your business is worth today vs what it could be worth</p>
                  </div>
                  <div style={{ flex: 1, textAlign: "center", padding: "10px 10px", borderRadius: 10, background: `${C.cyan}06`, border: `1px solid ${C.cyan}12` }}>
                    <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 8, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: C.cyan, marginBottom: 3 }}>Profit Gap</div>
                    <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: mob ? 20 : 24, fontWeight: 700, color: C.cyan, marginBottom: 4 }}>{fmt(Math.round(aPGap))}<span style={{ fontSize: 12 }}>/yr</span></div>
                    <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 8, color: C.text3, lineHeight: 1.35, margin: 0 }}>How much profit you are leaving on the table each year compared to simply above average peers in your industry</p>
                  </div>
                </div>

                {/* Disclaimer */}
                <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: mob ? 8 : 10, color: C.text4, fontStyle: "italic", margin: "0", marginTop: "auto", paddingTop: 10, lineHeight: 1.4, textAlign: "center" }}>Illustrative examples for educational purposes only. Actual gaps depend on your business, industry, and execution. Results and valuations not guaranteed.</p>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={350}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            <GoldBtn onClick={() => { window.location.href = '/tools'; }} arrowInset={24} style={{ padding: "16px 48px" }}>Explore Free Tools</GoldBtn>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: C.text3, margin: 0 }}>No account needed · Personalize these numbers to your business</p>
          </div>
        </Reveal>
      </Box>
    </Section>
  );
};

// ═══════════════════════════════════════════════════════════════════
// PRICING — Qualification-focused, two core tiers + add-ons
// ═══════════════════════════════════════════════════════════════════
const PricingSection = ({ onPrimary }) => {
  const { mob, tab } = useBp();
  const tiers = [
    {
      name: "Valuation Driver Intensive",
      price: "$5,000",
      period: "one-time",
      sub: "For owners who are proactive and want to know exactly what's suppressing their valuation — and what to do about it, rather than hope their business is valuable in the future.",
      accent: C.green,
      isVDA: true,
      startHere: true,
      core: [
        ["Business Valuation Estimate", "based on the premier data provider for M&A transactions in the US across all recognized industries — your current value baseline through the eyes of a third-party buyer, even if you never plan to sell"],
        ["Your business scored across 5 key value drivers", "scored and benchmarked against industry peers to show exactly where risks and opportunities live in your business"],
        ["Profit Gap + Value Gap analysis", "the dollar amount you're leaving on the table each year and the difference between your business's value vs an above average peer in your industry, with a clear path to close it"],
        ["Scenario modeling", "what happens to your valuation if you close the Profit Gap and Value Gap simultaneously — that is your cash flow and net-worth opportunity"],
        ["Dollar-ranked value acceleration plan + written 90-day action plan", "specific actions prioritized by impact with three moves you can start executing immediately"],
      ],
      bonuses: [
        ["30-day follow-up check-in", "Revisit your progress, adjust the plan, and answer questions that came up during execution"],
      ],
      guaranteeTitle: "Valuation Opportunity Guarantee",
      guaranteeCustom: true,
      cta: "Book Your Intensive",
    },
    {
      name: "Clarity Partner",
      price: "$3,000",
      period: "/ month",
      sub: "For owners who know the gap exists and want hands-on help to close it.",
      accent: C.cyan,
      core: [
        ["Monthly Owner Freedom & Value Review", "review your numbers, prioritize 1–3 decisions, assign a 30-day action plan, and the proactive guidance to execute"],
        ["Quarterly constraint refresh", "what to focus on and execute next prioritized by ROI potential"],
      ],
      bonuses: [
        ["All Workshop Intensives included", "Semi-private cohort format limited to 20 owners in similar stages of business — no $2K ticket each time, attend any workshop we run as part of your tier"],
        ["Annual tax-planning deep dive", "One dedicated session per year alongside your CPA developing and implementing tax-efficient strategies related to entity structuring, business investment initiatives, etc."],
        ["Curated Vendor Black Book", "Pre-vetted service providers, agencies, and tools our clients use — skip wasting time, money, and headaches on trial and error"],
      ],
      guarantee: "$250K valuation growth in 24 months",
      guaranteeFallback: "Up to 6 months of additional hands-on execution help for free until it does",
      cta: "See If You Qualify",
    },
    {
      name: "Growth Partner",
      price: "$5,000",
      period: "/ month",
      sub: "For owners ready to execute aggressively and want help systematically compounding business valuation long-term.",
      badge: "MOST POPULAR",
      accent: C.gold,
      includesClarity: true,
      core: [
        ["Bi-weekly Execution Councils with your leadership team", "progress, decisions, delegation"],
        ["Quarterly hands-on constraint execution", "we build the models, pricing, scorecards, and project-manage your team through it"],
        ["Bi-annual half-day strategy sessions", ""],
        ["Active coordination of your full advisor team", "CPA, legal, wealth, M&A all rowing together"],
      ],
      bonuses: [
        ["Emergency line", "Same-day response + up to 2 urgent calls/month when something can't wait"],
        ["Priority network intros", "First access to our high-value advisor and vendor network for your specific needs"],
      ],
      guarantee: "$500K valuation growth in 24 months",
      guaranteeFallback: "Up to 12 months of additional 1:1 hands-on execution for free until it does",
      cta: "See If You Qualify",
    },
  ];
  return (
    <Section id="pricing" gradient={`radial-gradient(ellipse 80% 60% at 50% 80%,rgba(200,162,78,0.07) 0%,transparent 55%),linear-gradient(180deg,#080c12 0%,#0a0e15 50%,#090d14 100%)`} style={{ padding: mob ? "60px 0 80px" : "100px 0" }}>
      <Caustic x="15%" y="30%" angle={-10} width={mob ? 300 : 500} opacity={0.12}/>
      <Box>
        <Reveal><p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: mob ? 11 : 12, color: C.gold, textTransform: "uppercase", letterSpacing: 2, marginBottom: 12, fontWeight: 600, textAlign: "center" }}>How We Work Together</p></Reveal>
        <Reveal delay={100}><h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, fontSize: mob ? 28 : tab ? 38 : 48, lineHeight: 1.08, color: C.text1, textTransform: "uppercase", textAlign: "center", margin: "0 0 14px", letterSpacing: -0.5, textShadow: "0 2px 20px rgba(0,0,0,0.5)" }}>Start with clarity. <GoldText>Scale with a partner.</GoldText></h2></Reveal>
        <Reveal delay={150}><p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: mob ? 13 : 15, color: C.text2, textAlign: "center", margin: "0 auto 40px", maxWidth: 640, lineHeight: 1.6 }}>Most owners start with a one-time intensive to see exactly where the gaps are. From there, the ones who want hands-on help closing those gaps step into a partnership tier.</p></Reveal>

        <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "1fr 1fr 1fr", gap: mob ? 20 : 20, alignItems: "stretch", maxWidth: 1200, margin: "0 auto" }}>
          {tiers.map((t, i) => (
            <Reveal key={i} delay={200 + i * 100}>
              <div style={{
                height: "100%", display: "flex", flexDirection: "column",
                padding: mob ? 24 : 28, borderRadius: 18, position: "relative", overflow: "hidden",
                background: t.badge ? "linear-gradient(160deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.015) 100%)" : "rgba(255,255,255,0.02)",
                border: `1.5px solid ${t.accent}${t.badge ? "35" : t.startHere ? "30" : "20"}`,
                boxShadow: t.badge ? `0 8px 40px rgba(0,0,0,0.4), 0 0 60px ${t.accent}10` : `0 4px 24px rgba(0,0,0,0.3)`,
                transition: "border-color 0.3s, box-shadow 0.3s",
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = `${t.accent}60`; e.currentTarget.style.boxShadow = `0 8px 40px rgba(0,0,0,0.4), 0 0 80px ${t.accent}18`; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = `${t.accent}${t.badge ? "35" : t.startHere ? "30" : "20"}`; e.currentTarget.style.boxShadow = t.badge ? `0 8px 40px rgba(0,0,0,0.4), 0 0 60px ${t.accent}10` : `0 4px 24px rgba(0,0,0,0.3)`; }}
              >
                {/* Diagonal shine */}
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 30%, transparent 50%, transparent 70%, rgba(255,255,255,0.03) 100%)", pointerEvents: "none", zIndex: 0 }}/>
                <div style={{ position: "absolute", top: 0, left: "10%", width: "80%", height: 1.5, background: `linear-gradient(90deg, transparent, ${t.accent}${t.badge ? "50" : "35"}, transparent)` }}/>

                <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", height: "100%" }}>
                  {/* Tier name — full width, no badge interference */}
                  <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, fontSize: mob ? 20 : 22, color: C.text1, margin: "0 0 4px", minHeight: mob ? "auto" : 28, whiteSpace: "nowrap" }}>{t.name}</h3>

                  {/* Price + badge on same line */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8, minHeight: mob ? "auto" : 52 }}>
                    <div>
                      <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: mob ? 38 : 42, fontWeight: 700, color: t.accent, lineHeight: 1 }}>{t.price}</span>
                      <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: C.text3, marginLeft: 6 }}>{t.period}</span>
                    </div>
                    {(t.badge || t.startHere) && (
                      <div style={{ position: "relative", overflow: "hidden", fontFamily: "'DM Sans',sans-serif", fontSize: 9, fontWeight: 700, color: t.startHere ? C.green : C.gold, padding: "4px 12px", borderRadius: 8, background: `linear-gradient(135deg, ${t.startHere ? C.green : C.gold}15, ${t.startHere ? C.green : C.gold}08)`, border: `1px solid ${t.startHere ? C.green : C.gold}35`, boxShadow: `0 0 12px ${t.startHere ? C.green : C.gold}12`, letterSpacing: "0.04em", flexShrink: 0 }}>
                        <div style={{ position: "absolute", top: "-50%", left: "-50%", right: "-50%", bottom: "-50%", pointerEvents: "none", background: `linear-gradient(120deg, transparent 0%, transparent 42%, ${t.startHere ? C.green : C.gold}12 48%, ${t.startHere ? C.green : C.gold}25 50%, ${t.startHere ? C.green : C.gold}12 52%, transparent 58%, transparent 100%)`, backgroundSize: "200% 200%", animation: "btnShimmerSlow 20s ease-in-out infinite" }}/>
                        <span style={{ position: "relative", zIndex: 1 }}>{t.badge || "START HERE"}</span>
                      </div>
                    )}
                  </div>

                  {/* Sub — fixed height for alignment */}
                  <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: mob ? 11 : 12, color: C.text2, margin: "0 0 16px", lineHeight: 1.5, fontStyle: "italic", minHeight: mob ? "auto" : 72 }}>{t.sub}</p>

                  {/* Divider */}
                  <div style={{ height: 1, background: `linear-gradient(90deg, transparent, ${t.accent}20, transparent)`, marginBottom: 14 }}/>

                  {/* Core */}
                  <div style={{ marginBottom: 14 }}>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 8 }}>
                      <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 9, color: t.accent, textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 700 }}>What You Get</span>
                      {t.includesClarity && <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, color: C.text3, fontStyle: "italic" }}>— Everything in Clarity, plus:</span>}
                    </div>
                    {t.core.map(([title, desc], j) => (
                      <div key={j} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 7 }}>
                        <div style={{ width: 14, height: 14, borderRadius: "50%", background: `${t.accent}10`, border: `1px solid ${t.accent}20`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                          <svg width="7" height="7" viewBox="0 0 24 24" fill="none"><polyline points="4 12 10 18 20 6" stroke={t.accent} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </div>
                        <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: mob ? 11 : 12, lineHeight: 1.45 }}>
                          <strong style={{ color: C.text1 }}>{title}</strong>{desc && <span style={{ color: C.text3 }}> — {desc}</span>}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Bonuses — flex: 1 so Also Included aligns across Clarity and Growth */}
                  <div style={{ marginBottom: 14, flex: 1 }}>
                    <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 9, color: C.text3, textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 700, marginBottom: 8 }}>Also Included</div>
                    {t.bonuses.map(([title, why], j) => (
                      <div key={j} style={{ marginBottom: 8, paddingLeft: 2 }}>
                        <div style={{ display: "flex", gap: 6, alignItems: "flex-start" }}>
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={C.green} strokeWidth="2.5" strokeLinecap="round" style={{ flexShrink: 0, marginTop: 3 }}><polyline points="4 12 10 18 20 6"/></svg>
                          <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: mob ? 11 : 12, color: C.text1, fontWeight: 600, lineHeight: 1.4 }}>{title}</span>
                        </div>
                        <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, color: C.text3, margin: "2px 0 0 17px", lineHeight: 1.4 }}>{why}</p>
                      </div>
                    ))}
                  </div>

                  {/* Guarantee + CTA — pinned to bottom */}
                  <div style={{ marginTop: "auto" }}>
                    <div style={{ padding: "12px 14px", borderRadius: 10, background: `linear-gradient(135deg, ${t.accent}06, ${t.accent}02)`, border: `1.5px solid ${t.accent}25`, marginBottom: 16 }}>
                      <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, color: t.accent, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>{t.guaranteeTitle || "Valuation Growth Guarantee"}</div>
                      {t.guaranteeCustom ? (
                        <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, color: C.text2, lineHeight: 1.45, margin: 0 }}>If the intensive doesn't surface at least <span style={{ color: C.gold, fontWeight: 700 }}>$100K in actionable opportunities</span>, we will refund you the entire cost of the intensive.</p>
                      ) : (
                        <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, color: C.text2, lineHeight: 1.45, margin: 0 }}><span style={{ color: C.gold, fontWeight: 700 }}>{t.guarantee}</span>. If not met: {t.guaranteeFallback.toLowerCase()}.</p>
                      )}
                    </div>
                    <GoldBtn color={t.accent} style={{ width: "100%" }} onClick={onPrimary} arrowInset={18}>{t.cta}</GoldBtn>
                    <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, color: C.text3, margin: "8px 0 0", textAlign: "center" }}>{t.isVDA ? "One-time · No ongoing commitment" : "Free working session · No commitment"}</p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Quarterbacking add-ons */}
        <Reveal delay={450}>
          <div style={{ marginTop: mob ? 24 : 32, padding: mob ? "16px 18px" : "20px 28px", borderRadius: 14, background: "rgba(255,255,255,0.02)", border: `1px solid ${C.border1}`, textAlign: "center" }}>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: mob ? 13 : 14, color: C.text1, margin: 0, lineHeight: 1.55 }}>
              <span style={{ color: C.gold, fontWeight: 600 }}>Need deeper help?</span> Sell-side exit quarterbacking, buy-side acquisition support, and scaling sprints are available as add-ons to either tier. Details discussed during the working session.
            </p>
          </div>
        </Reveal>

      </Box>
    </Section>
  );
};

// ═══════════════════════════════════════════════════════════════════
// SEE IT IN ACTION — Video Episodes
// Ported verbatim from v19-c per product direction: same episodes,
// same formatting, same carousel/modal behavior. This is a live
// placeholder — when real video content is ready, swap EPISODES.
// ═══════════════════════════════════════════════════════════════════
const EPISODES = [
  { id: 1, episode: "Episode 8", featured: true, title: "How a $4.2M Construction Firm Freed $800K in Stuck Cash", description: "I walk through the full diagnostic for Northstar Construction — a profitable contractor that was quietly dying of cash starvation. We find the constraint, model three fixes, and pick the one that unlocked 2.4x their runway in 60 days.", runtime: "12:47", views: "2,847", date: "2 days ago", industry: "Construction", business: "$4.2M General Contractor", constraint: "Cash Flow & Liquidity", constraintColor: C.red, thumbnail: "construction", isNew: true },
  { id: 2, episode: "Episode 7", title: "The Dental Practice That Couldn't Grow — And the 15-Minute Fix", description: "A multi-provider dental practice at $1.8M revenue was stuck. Their score revealed a revenue quality problem hiding in plain sight.", runtime: "9:23", views: "1,924", date: "1 week ago", industry: "Dental", business: "$1.8M Multi-Provider Practice", constraint: "Revenue Quality", constraintColor: C.amber, thumbnail: "dental" },
  { id: 3, episode: "Episode 6", title: "Why This Marketing Agency Should NOT Take on More Clients", description: "A profitable $1.1M creative studio was on the verge of hiring three more people. The constraint analysis said stop — here's why.", runtime: "8:51", views: "3,156", date: "2 weeks ago", industry: "Marketing", business: "$1.1M Creative Studio", constraint: "Revenue Quality", constraintColor: C.amber, thumbnail: "marketing" },
  { id: 4, episode: "Episode 5", title: "The Restaurant With Perfect Top-Line Growth and Dying Margins", description: "$1.6M in revenue and growing 18% year over year. But the founder was taking home less every year. The roadmap found the leak.", runtime: "11:14", views: "2,402", date: "3 weeks ago", industry: "Restaurant", business: "$1.6M Full-Service Kitchen", constraint: "Profitability & Margins", constraintColor: C.amber, thumbnail: "restaurant" },
  { id: 5, episode: "Episode 4", title: "How a $2.1M Consulting Firm Stopped Being Its Owner", description: "Classic owner dependency trap. Here's how the diagnostic named it and the 90-day plan that got the founder out of client delivery.", runtime: "14:02", views: "4,218", date: "1 month ago", industry: "Consulting", business: "$2.1M Professional Services", constraint: "Owner Dependency", constraintColor: C.red, thumbnail: "consulting" },
  { id: 6, episode: "Episode 3", title: "Revenue Line Analysis: The Untapped Margin Hiding in Plain Sight", description: "Most agencies treat all revenue as equal. Revenue Line Analysis found 68% gross margin on one line — and 22% on another they were prioritizing.", runtime: "10:36", views: "5,891", date: "1 month ago", industry: "Marketing", business: "$890K Creative Agency", constraint: "Revenue Quality", constraintColor: C.amber, thumbnail: "revenue" },
  { id: 7, episode: "Episode 2", title: "The Law Firm With a Healthy P&L and a Broken Balance Sheet", description: "A $3.2M law firm looked profitable on paper but was two months from a liquidity crisis. The diagnostic found the hidden AR trap.", runtime: "9:48", views: "1,687", date: "5 weeks ago", industry: "Legal", business: "$3.2M Law Firm", constraint: "Cash Flow & Liquidity", constraintColor: C.red, thumbnail: "consulting" },
  { id: 8, episode: "Episode 1", title: "Why I Built This — A Founder's Diagnostic Manifesto", description: "The origin story. How years of advisory work led to the constraint-first methodology every engagement is built on.", runtime: "13:22", views: "8,432", date: "6 weeks ago", industry: "Intro", business: "Founder's Note", constraint: "Philosophy", constraintColor: C.gold, thumbnail: "revenue" },
];

const VideoCarouselArrow = ({ dir, onClick, disabled, size = 44 }) => (
  <button onClick={onClick} disabled={disabled} className={disabled ? "" : "video-carousel-arrow"} style={{
    "--arrow-color": C.gold, width: size, height: size, borderRadius: 12,
    background: disabled ? "rgba(255,255,255,0.02)" : `${C.gold}12`,
    border: `1.5px solid ${disabled ? "rgba(255,255,255,0.06)" : C.gold + "50"}`,
    display: "flex", alignItems: "center", justifyContent: "center",
    cursor: disabled ? "default" : "pointer", transition: "all 0.3s", flexShrink: 0, position: "relative",
  }}>
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={disabled ? "#3D4654" : C.gold} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      {dir === "left" ? <polyline points="15 18 9 12 15 6"/> : <polyline points="9 18 15 12 9 6"/>}
    </svg>
  </button>
);

const VideoThumbnail = ({ episode, large = false, onPlay }) => {
  const [hovered, setHovered] = useState(false);
  const gradients = {
    construction: `radial-gradient(ellipse at 30% 30%,#2a1f0a 0%,transparent 60%),radial-gradient(ellipse at 70% 70%,#1a1208 0%,transparent 55%),linear-gradient(135deg,#0c0f14 0%,#1a1608 100%)`,
    dental: `radial-gradient(ellipse at 30% 30%,#0a1f2a 0%,transparent 60%),radial-gradient(ellipse at 70% 70%,#081820 0%,transparent 55%),linear-gradient(135deg,#0c0f14 0%,#08141c 100%)`,
    marketing: `radial-gradient(ellipse at 30% 30%,#2a0a1f 0%,transparent 60%),radial-gradient(ellipse at 70% 70%,#200818 0%,transparent 55%),linear-gradient(135deg,#0c0f14 0%,#1a0820 100%)`,
    restaurant: `radial-gradient(ellipse at 30% 30%,#2a1a0a 0%,transparent 60%),radial-gradient(ellipse at 70% 70%,#200e08 0%,transparent 55%),linear-gradient(135deg,#0c0f14 0%,#1a0e08 100%)`,
    consulting: `radial-gradient(ellipse at 30% 30%,#0a2a1a 0%,transparent 60%),radial-gradient(ellipse at 70% 70%,#082014 0%,transparent 55%),linear-gradient(135deg,#0c0f14 0%,#081a14 100%)`,
    revenue: `radial-gradient(ellipse at 30% 30%,#1a0a2a 0%,transparent 60%),radial-gradient(ellipse at 70% 70%,#140820 0%,transparent 55%),linear-gradient(135deg,#0c0f14 0%,#140820 100%)`,
  };
  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onClick={() => onPlay && onPlay(episode)}
      style={{
        position: "relative", width: "100%", aspectRatio: "16/9",
        borderRadius: large ? 16 : 12, overflow: "hidden", cursor: "pointer",
        background: gradients[episode.thumbnail] || gradients.consulting,
        border: `1px solid ${hovered ? C.gold + "40" : C.border2}`,
        boxShadow: hovered ? `0 0 30px ${C.gold}20,0 12px 40px rgba(0,0,0,0.4)` : `0 8px 24px rgba(0,0,0,0.3)`,
        transition: "all 0.4s cubic-bezier(0.4,0,0.2,1)",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
      }}>
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.08, mixBlendMode: "overlay", backgroundImage: GRAIN, backgroundSize: "128px 128px" }}/>
      <div style={{ position: "absolute", left: "-10%", top: "20%", width: "60%", height: 3, background: `linear-gradient(90deg,transparent,${C.gold}60 50%,transparent)`, filter: "blur(12px)", opacity: hovered ? 0.5 : 0.3, transform: "rotate(-8deg)", transition: "opacity 0.4s" }}/>
      <div style={{ position: "absolute", right: large ? "8%" : "6%", bottom: "0%", width: large ? "45%" : "42%", height: "85%", display: "flex", alignItems: "flex-end", justifyContent: "center", opacity: 0.65 }}>
        <svg viewBox="0 0 100 140" style={{ width: "100%", height: "100%" }}>
          <ellipse cx="50" cy="45" rx="22" ry="28" fill={`${C.gold}15`} stroke={`${C.gold}30`} strokeWidth="0.5"/>
          <path d="M 15 140 Q 15 90 30 80 L 70 80 Q 85 90 85 140 Z" fill={`${C.gold}12`} stroke={`${C.gold}25`} strokeWidth="0.5"/>
          <ellipse cx="44" cy="38" rx="4" ry="6" fill={`${C.gold}20`}/>
        </svg>
      </div>
      <div style={{ position: "absolute", top: large ? 16 : 12, left: large ? 16 : 12, display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ padding: large ? "5px 12px" : "3px 10px", borderRadius: 6, background: "rgba(10,14,20,0.75)", backdropFilter: "blur(8px)", border: `1px solid ${C.gold}30` }}>
          <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: large ? 11 : 10, color: C.gold, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.8 }}>{episode.episode}</span>
        </div>
        {episode.isNew && (
          <div style={{ padding: "3px 8px", borderRadius: 5, background: `${C.green}20`, border: `1px solid ${C.green}50`, boxShadow: `0 0 12px ${C.green}30` }}>
            <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 9, color: C.green, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.8 }}>● New</span>
          </div>
        )}
      </div>
      <div style={{ position: "absolute", top: large ? 16 : 12, right: large ? 16 : 12, padding: large ? "5px 10px" : "3px 8px", borderRadius: 5, background: "rgba(10,14,20,0.85)", backdropFilter: "blur(8px)", border: `1px solid ${C.border2}`, display: "flex", alignItems: "center", gap: 5 }}>
        <IconClock size={large ? 11 : 10} color={C.text2}/>
        <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: large ? 11 : 10, color: C.text1, fontWeight: 600 }}>{episode.runtime}</span>
      </div>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
        <div style={{
          width: large ? 84 : 58, height: large ? 84 : 58, borderRadius: "50%",
          background: `radial-gradient(circle,${C.gold} 0%,${C.goldMuted} 100%)`,
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: hovered ? `0 0 40px ${C.gold}60,0 0 80px ${C.gold}30,inset 0 1px 0 rgba(255,255,255,0.3)` : `0 0 24px ${C.gold}40,inset 0 1px 0 rgba(255,255,255,0.2)`,
          transform: hovered ? "scale(1.08)" : "scale(1)",
          transition: "all 0.4s cubic-bezier(0.4,0,0.2,1)",
          paddingLeft: large ? 6 : 4,
        }}>
          <IconPlay size={large ? 30 : 20} color="#0A0E14"/>
        </div>
      </div>
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "50%", background: "linear-gradient(to top,rgba(10,14,20,0.92) 0%,rgba(10,14,20,0.6) 50%,transparent 100%)", pointerEvents: "none" }}/>
      <div style={{ position: "absolute", bottom: large ? 20 : 14, left: large ? 20 : 14, right: large ? 20 : 14, zIndex: 2 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
          <div style={{ padding: "2px 7px", borderRadius: 4, background: `${episode.constraintColor}15`, border: `1px solid ${episode.constraintColor}35` }}>
            <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: large ? 9 : 8, color: episode.constraintColor, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.6 }}>{episode.industry}</span>
          </div>
          {large && <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, color: C.text3 }}>· {episode.business}</span>}
        </div>
        <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: large ? 22 : 14, fontWeight: 700, color: C.text1, lineHeight: 1.2, margin: 0, textShadow: "0 2px 12px rgba(0,0,0,0.8)" }}>
          {episode.title}
        </h3>
      </div>
    </div>
  );
};

const EpisodeCard = ({ episode, onPlay }) => {
  const { mob } = useBp();
  return (
    <div style={{ borderRadius: 12, border: `1px solid transparent`, transition: "border-color 0.25s ease, box-shadow 0.25s ease", cursor: "pointer" }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = `${C.gold}25`; e.currentTarget.style.boxShadow = `0 4px 20px rgba(0,0,0,0.3), 0 0 30px ${C.gold}08`; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = "transparent"; e.currentTarget.style.boxShadow = "none"; }}
      onClick={() => onPlay(episode)}>
      <VideoThumbnail episode={episode} onPlay={onPlay}/>
      <div style={{ padding: "12px 4px 0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, flexWrap: "wrap" }}>
          <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, color: C.gold, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.8 }}>{episode.episode}</span>
          <div style={{ width: 3, height: 3, borderRadius: 2, background: C.text4 }}/>
          <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, color: C.text3 }}>{episode.date}</span>
          <div style={{ width: 3, height: 3, borderRadius: 2, background: C.text4 }}/>
          <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, color: C.text3 }}>{episode.views} views</span>
        </div>
        <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: mob ? 17 : 18, fontWeight: 700, color: C.text1, lineHeight: 1.25, margin: "0 0 6px" }}>{episode.title}</h3>
        <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: C.text3, display: "block" }}>{episode.business}</span>
      </div>
    </div>
  );
};

const EpisodeCarousel = ({ episodes, onPlay }) => {
  const { mob, tab } = useBp();
  const [idx, setIdx] = useState(0);
  const scrollRef = useRef(null);
  const visible = mob ? 1 : tab ? 2 : 3;
  const peekPct = 0.20;
  const maxIdx = Math.max(0, episodes.length - visible);
  const atStart = idx === 0;
  const atEnd = idx >= maxIdx;
  const prev = () => setIdx(Math.max(0, idx - 1));
  const next = () => setIdx(Math.min(maxIdx, idx + 1));
  const cardWidthPct = 100 / (visible + peekPct);
  const translatePct = -idx * cardWidthPct;
  const gap = mob ? 14 : 20;

  if (mob) {
    return (
      <div style={{ position: "relative", marginLeft: -20, marginRight: -20 }}>
        <div ref={scrollRef} style={{ display: "flex", gap: 14, overflowX: "auto", scrollSnapType: "x mandatory", padding: "0 20px", scrollPaddingLeft: 20, WebkitOverflowScrolling: "touch", scrollbarWidth: "none", msOverflowStyle: "none" }}>
          {episodes.map(ep => (
            <div key={ep.id} style={{ flex: "0 0 82%", scrollSnapAlign: "start" }}>
              <EpisodeCard episode={ep} onPlay={onPlay}/>
            </div>
          ))}
          <div style={{ flex: "0 0 6px" }}/>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 14, opacity: 0.6 }}>
          <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, color: C.text3, letterSpacing: 0.5 }}>Swipe for more episodes</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.text3} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: "relative" }}>
      <div style={{ overflow: "hidden", position: "relative", borderRadius: 12 }}>
        <div style={{ display: "flex", gap, transform: `translateX(${translatePct}%)`, transition: "transform 0.5s cubic-bezier(0.4,0,0.2,1)" }}>
          {episodes.map(ep => (
            <div key={ep.id} style={{ flex: `0 0 calc(${cardWidthPct}% - ${gap*(visible+peekPct-1)/(visible+peekPct)}px)` }}>
              <EpisodeCard episode={ep} onPlay={onPlay}/>
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 22, gap: 16 }}>
        <VideoCarouselArrow dir="left" onClick={prev} disabled={atStart}/>
        <div style={{ display: "flex", gap: 6, flex: 1, justifyContent: "center", alignItems: "center" }}>
          {Array.from({ length: maxIdx + 1 }).map((_, i) => (
            <div key={i} onClick={() => setIdx(i)} style={{ width: i === idx ? 28 : 8, height: 4, borderRadius: 2, background: i === idx ? C.gold : "rgba(255,255,255,0.12)", cursor: "pointer", transition: "all 0.4s cubic-bezier(0.4,0,0.2,1)", boxShadow: i === idx ? `0 0 8px ${C.gold}60` : "none" }}/>
          ))}
          <div style={{ marginLeft: 14, display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, color: C.text3, letterSpacing: 0.5 }}>
              {Math.min(idx + visible, episodes.length)} of {episodes.length}
            </span>
          </div>
        </div>
        <VideoCarouselArrow dir="right" onClick={next} disabled={atEnd}/>
      </div>
    </div>
  );
};

const VideoModal = ({ episode, onClose, onPrimary }) => {
  const { mob } = useBp();
  useEffect(() => {
    const h = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", h);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", h); document.body.style.overflow = ""; };
  }, [onClose]);
  if (!episode) return null;
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(5,8,12,0.92)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", display: "flex", alignItems: "center", justifyContent: "center", padding: mob ? 16 : 40, animation: "videoFadeIn 0.3s ease" }}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: "100%", maxWidth: 1100, maxHeight: "90vh", overflow: "auto", position: "relative" }}>
        <button onClick={onClose} style={{ position: "absolute", top: mob ? 8 : 12, right: mob ? 8 : 12, width: 36, height: 36, borderRadius: "50%", background: "rgba(10,14,20,0.8)", backdropFilter: "blur(8px)", border: `1px solid ${C.border2}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", zIndex: 10, transition: "all 0.3s" }}
          onMouseEnter={e => e.currentTarget.style.background = "rgba(200,162,78,0.15)"}
          onMouseLeave={e => e.currentTarget.style.background = "rgba(10,14,20,0.8)"}>
          <IconX size={18}/>
        </button>
        <div style={{ width: "100%", aspectRatio: "16/9", borderRadius: mob ? 12 : 16, overflow: "hidden", background: "#000", position: "relative", border: `1px solid ${C.border2}`, boxShadow: `0 20px 80px rgba(0,0,0,0.6),0 0 40px ${C.gold}15` }}>
          <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at center,${C.bgCard} 0%,#000 100%)`, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16 }}>
            <div style={{ width: mob ? 60 : 80, height: mob ? 60 : 80, borderRadius: "50%", background: `radial-gradient(circle,${C.gold} 0%,${C.goldMuted} 100%)`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 40px ${C.gold}40`, paddingLeft: 4 }}>
              <IconPlay size={mob ? 26 : 34} color="#0A0E14"/>
            </div>
            <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: C.text3, textAlign: "center" }}>Video player placeholder — embed YouTube, Vimeo, or Mux player here</span>
          </div>
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: mob ? "12px 16px" : "16px 22px", background: "linear-gradient(to top,rgba(0,0,0,0.9),transparent)" }}>
            <div style={{ height: 3, background: "rgba(255,255,255,0.15)", borderRadius: 2, marginBottom: 10, position: "relative" }}>
              <div style={{ width: "32%", height: "100%", background: C.gold, borderRadius: 2, boxShadow: `0 0 8px ${C.gold}60` }}/>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontFamily: "monospace", fontSize: 11, color: C.text2 }}>4:08 / {episode.runtime}</span>
            </div>
          </div>
        </div>
        <div style={{ padding: mob ? "16px 4px 0" : "24px 8px 0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10, flexWrap: "wrap" }}>
            <div style={{ padding: "4px 10px", borderRadius: 6, background: `${C.gold}15`, border: `1px solid ${C.gold}35` }}>
              <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, color: C.gold, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.8 }}>{episode.episode}</span>
            </div>
            <div style={{ padding: "4px 10px", borderRadius: 6, background: `${episode.constraintColor}12`, border: `1px solid ${episode.constraintColor}30` }}>
              <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, color: episode.constraintColor, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.8 }}>{episode.industry}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <IconClock size={12} color={C.text3}/>
              <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: C.text3 }}>{episode.runtime}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <IconEye size={12} color={C.text3}/>
              <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: C.text3 }}>{episode.views} views</span>
            </div>
            <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: C.text3 }}>· {episode.date}</span>
          </div>
          <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: mob ? 22 : 30, fontWeight: 700, color: C.text1, lineHeight: 1.2, margin: "0 0 8px" }}>{episode.title}</h2>
          <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: C.text2, display: "block", marginBottom: 14 }}>{episode.business} · Primary constraint: <span style={{ color: episode.constraintColor, fontWeight: 700 }}>{episode.constraint}</span></span>
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: mob ? 13 : 14, color: C.text2, lineHeight: 1.6, margin: "0 0 18px" }}>{episode.description}</p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <GoldBtn large onClick={onPrimary}>Get Your Own Constraint Roadmap</GoldBtn>
            <GhostBtn onClick={onClose}>Close</GhostBtn>
          </div>
        </div>
      </div>
    </div>
  );
};

const CaseStudiesSection = ({ onPrimary }) => {
  const { mob, tab } = useBp();
  const [playing, setPlaying] = useState(null);
  const featured = EPISODES.find(e => e.featured);
  const others = EPISODES.filter(e => !e.featured);
  return (
    <Section gradient={`radial-gradient(ellipse 80% 60% at 50% 30%,rgba(200,162,78,0.06) 0%,transparent 55%),radial-gradient(ellipse 60% 50% at 20% 80%,#151a30 0%,transparent 55%),linear-gradient(180deg,#090d14 0%,#0c1018 50%,#090d14 100%)`} style={{ padding: mob ? "60px 0 80px" : "100px 0 120px" }}>
      <Caustic x="10%" y="15%" angle={-8} width={mob ? 400 : 700} opacity={0.12}/>
      <Caustic x="60%" y="75%" angle={10} width={mob ? 300 : 500} opacity={0.1} color={C.goldLight}/>
      <Box>
        <div style={{ textAlign: "center", marginBottom: mob ? 32 : 48 }}>
          <Reveal>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 16px", borderRadius: 100, background: `${C.gold}08`, border: `1px solid ${C.gold}20`, marginBottom: mob ? 14 : 18 }}>
              <IconPlay size={12} color={C.gold}/>
              <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: mob ? 11 : 12, fontWeight: 600, color: C.gold, letterSpacing: 0.3 }}>New episode every week</span>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, fontSize: mob ? 32 : 48, lineHeight: 1.05, color: C.text1, textTransform: "uppercase", letterSpacing: -1, margin: "0 0 12px", textShadow: "0 2px 20px rgba(0,0,0,0.5)" }}>
              See <GoldText>Virtus</GoldText> In Action
            </h2>
          </Reveal>
          <Reveal delay={200}>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: mob ? 14 : 16, lineHeight: 1.6, color: C.text2, margin: "0 auto", maxWidth: 640 }}>
              Real business diagnostics, walked through by Edward. Each episode breaks down a single business, its hidden constraint, and the exact fix that unlocked growth.
            </p>
          </Reveal>
        </div>

        <Reveal delay={300}>
          <div style={{ display: "grid", gridTemplateColumns: mob || tab ? "1fr" : "1.7fr 1fr", gap: mob ? 20 : 32, marginBottom: mob ? 32 : 48, alignItems: "center" }}>
            <VideoThumbnail episode={featured} large onPlay={setPlaying}/>
            <div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 10px", borderRadius: 6, background: `${C.green}10`, border: `1px solid ${C.green}25`, marginBottom: mob ? 12 : 14 }}>
                <div style={{ width: 6, height: 6, borderRadius: 3, background: C.green, boxShadow: `0 0 6px ${C.green}80` }}/>
                <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, color: C.green, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.8 }}>Featured · Just Released</span>
              </div>
              <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: mob ? 24 : 32, fontWeight: 700, color: C.text1, lineHeight: 1.15, margin: "0 0 10px" }}>{featured.title}</h3>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12, flexWrap: "wrap" }}>
                <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: C.text2, fontWeight: 600 }}>{featured.business}</span>
                <div style={{ width: 3, height: 3, borderRadius: 2, background: C.text4 }}/>
                <div style={{ padding: "2px 8px", borderRadius: 4, background: `${featured.constraintColor}12`, border: `1px solid ${featured.constraintColor}30` }}>
                  <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, color: featured.constraintColor, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.6 }}>{featured.constraint}</span>
                </div>
              </div>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: mob ? 13 : 14, color: C.text2, lineHeight: 1.65, margin: "0 0 18px" }}>{featured.description}</p>
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 18, flexWrap: "wrap" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <IconClock size={13} color={C.text3}/>
                  <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: C.text3 }}>{featured.runtime}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <IconEye size={13} color={C.text3}/>
                  <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: C.text3 }}>{featured.views} views</span>
                </div>
                <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: C.text3 }}>· {featured.date}</span>
              </div>
              <button onClick={() => setPlaying(featured)} style={{ padding: mob ? "12px 22px" : "14px 28px", borderRadius: 12, background: `linear-gradient(135deg,${C.gold},${C.goldMuted})`, color: "#0A0E14", fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: mob ? 13 : 14, border: "none", cursor: "pointer", boxShadow: `0 0 24px ${C.gold}30,0 4px 12px rgba(0,0,0,0.3)`, display: "inline-flex", alignItems: "center", gap: 10, transition: "all 0.25s ease" }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 0 40px ${C.gold}50,0 4px 16px rgba(0,0,0,0.3)`; e.currentTarget.style.background = `linear-gradient(135deg,${C.goldLight},${C.gold})`; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = `0 0 24px ${C.gold}30,0 4px 12px rgba(0,0,0,0.3)`; e.currentTarget.style.background = `linear-gradient(135deg,${C.gold},${C.goldMuted})`; }}>
                <IconPlay size={14} color="#0A0E14"/>
                Watch Full Episode
              </button>
            </div>
          </div>
        </Reveal>

        <Reveal delay={400}>
          <div style={{ marginBottom: mob ? 14 : 18 }}>
            <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: C.text4, textTransform: "uppercase", letterSpacing: 1, fontWeight: 600 }}>More Episodes</span>
          </div>
        </Reveal>

        <Reveal delay={500}>
          <EpisodeCarousel episodes={others} onPlay={setPlaying}/>
        </Reveal>

        <Reveal delay={600}>
          <div style={{ textAlign: "center", marginTop: mob ? 32 : 44 }}>
            <button style={{ padding: mob ? "12px 24px" : "14px 32px", borderRadius: 12, background: "rgba(255,255,255,0.03)", color: C.text1, fontFamily: "'DM Sans',sans-serif", fontWeight: 600, fontSize: mob ? 13 : 14, border: `1px solid ${C.border2}`, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8, transition: "all 0.3s" }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(200,162,78,0.08)"; e.currentTarget.style.borderColor = `${C.gold}40`; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.borderColor = C.border2; }}>
              View All Episodes <IconArrow size={14} color={C.text1}/>
            </button>
          </div>
        </Reveal>
      </Box>
      {playing && <VideoModal episode={playing} onClose={() => setPlaying(null)} onPrimary={onPrimary}/>}
    </Section>
  );
};

// ═══════════════════════════════════════════════════════════════════
// FAQ
// ═══════════════════════════════════════════════════════════════════
const faqs = [
  { q: "What's the difference between the free Roadmap and the Valuation Driver Intensive?", a: ["The Roadmap is a 7-question self-assessment that generates a 15-page diagnostic — enough to see your health score, your #1 constraint, and three immediate moves. The Valuation Driver Intensive is a comprehensive one-time engagement ($5K) where we build a full business valuation estimate, score your business across 5 key value drivers, map your Profit Gap and Value Gap with dollar amounts, model scenarios, and deliver a written 90-day action plan. ", "The Intensive is for owners who want precise numbers, a clear and detailed execution plan personalized to their business, and a guarantee that the quantified opportunities are worth multiples more than the cost of the Intensive."] },
  { q: "Do I need to book a call to get the Roadmap?", a: ["No. The assessment is self-serve — 7 questions, about 90 seconds. ", "You get your preliminary health score and constraint immediately, then the full 15-page PDF after you enter your email."] },
  { q: "How is this different from what my CPA or fractional CFO does?", a: ["Your CPA handles compliance and tax filing (sometimes baseline strategy). A fractional CFO typically manages reporting and financial controls with help for managing/reducing expenses. Both are essential — we don't replace either. Virtus helps fill the gap between them: ", "actively helping you grow your profits (offer structure, strategic partners, marketing and sales constraints, attracting and retaining A-tier talent, systematically making the business less dependent on the owner, etc.), build your business valuation, identify and execute against the #1 constraint suppressing your business's value and ability to scale, and coordinate your full advisor team so everyone rows in the same direction."] },
  { q: "What is the Valuation Growth Guarantee?", a: ["On the Clarity Partner tier ($3K/mo): if your documented business valuation hasn't grown by ", "$250K within 24 months", ", we continue working with you for up to 6 additional months of hands-on execution help for free until it does. On the Growth Partner tier ($5K/mo): ", "the threshold is $500K", ", with up to 12 months of additional 1:1 support for free. Conditions: 80%+ session attendance, execution of agreed action items, and use of the approved advisor stack (CPA, wealth advisor, legal, etc.). Full terms discussed during your free working session."] },
  { q: "What kinds of businesses is this for?", a: ["Owner-operated businesses between roughly $500K and $10M in revenue — services, agencies, construction, healthcare, e-commerce, restaurants, home services, and professional services firms. The methodology works on any business with a P&L, a balance sheet, and ", "an owner who wants to grow profits and build a business that is not dependent on them to run and grow, and that's valuable to an outside 3rd-party (whether they want to sell in the future or hold and own forever)."] },
  { q: "What if I'm not ready for 1-on-1 work?", a: ["Use the free diagnostic tools on the Resources Hub — score your business, explore your Profit and Value Gaps, and go deep on specific value drivers. ", "No account needed, and the results are personalized to your business.", " When you're ready for more precise numbers and hands-on help, the Valuation Driver Intensive is the natural next step."] },
  { q: "Will you sell my data or pitch me on the Working Session?", a: ["No we don't sell anyone's data. And no we aren't pitching you — ", "our entire goal is to help business owners like you grow your profits and the valuation of your business", " — if you also want hands-on help from us afterwards then we are happy to see if it would be a good fit for us to work together to help. If we do end up working together further, it's because you decide that's the right next step after seeing the data."] },
  { q: "What is the Valuation Opportunity Guarantee on the Intensive?", a: ["If the Valuation Driver Intensive doesn't surface at least $100K in actionable opportunities for your business, we refund you the entire cost of the intensive. ", "If we can't create a roadmap that lays out opportunities far exceeding the price of the Intensive, then we don't want to keep your money and you end up not getting a return on your investment."] },
  { q: "How can I trust the valuation numbers and the potential impact of implementing improvements?", a: ["We aren't making up these numbers on our own based on what we 'feel' like they should be worth. ", "We have partnered with a business valuation firm that has done over 10,000 business valuations over 40 years", " and the methodology used here is aligned with what they use in their certified valuations. We aren't doing a certified valuation here and there is no guarantee that the Value Gaps and the quantified value of implemented improvements are exactly what you would get in a sale (since markets shift and private businesses are risky and volatile), but these numbers come from their methodology from over 40 years and 10,000 valuations. The key is that you move in the right direction and systematically improve parts of your business that would suppress its value, not what is the 'exact' number that I should expect as a promise."] },
];

const FAQSection = () => {
  const { mob, tab } = useBp();
  const [open, setOpen] = useState(null);
  return (
    <Section id="faq" gradient={`radial-gradient(ellipse 60% 50% at 40% 50%,rgba(200,162,78,0.04) 0%,transparent 50%),linear-gradient(180deg,#090d14 0%,#0a0e15 50%,#090d14 100%)`} style={{ padding: mob ? "60px 0" : "100px 0" }}>
      <Box>
        <div style={{ display: "flex", flexDirection: mob ? "column" : "row", gap: mob ? 28 : 60, alignItems: "flex-start" }}>
          {/* Left — Heading */}
          <div style={{ width: mob ? "100%" : 280, flexShrink: 0, position: mob ? "static" : "sticky", top: 100 }}>
            <Reveal>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: mob ? 11 : 12, color: C.gold, textTransform: "uppercase", letterSpacing: 2, marginBottom: 12, fontWeight: 600 }}>FAQ</p>
              <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, fontSize: mob ? 32 : 40, lineHeight: 1.08, color: C.text1, textTransform: "uppercase", margin: "0 0 14px", textShadow: "0 2px 20px rgba(0,0,0,0.5)" }}>Common <GoldText>questions</GoldText></h2>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: mob ? 13 : 14, color: C.text3, lineHeight: 1.55, margin: 0 }}>Everything you need to know about working with Kriczky Virtus.</p>
            </Reveal>
          </div>

          {/* Right — Questions */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {faqs.map((faq, i) => (
              <Reveal key={i} delay={i * 40}>
                <div style={{ marginBottom: 10, borderRadius: 14, background: open === i ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.015)", border: `1px solid ${open === i ? `${C.gold}20` : C.border2}`, overflow: "hidden", transition: "all 0.3s ease" }}>
                  <div onClick={() => setOpen(open === i ? null : i)} style={{ padding: mob ? "14px 16px" : "18px 22px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}>
                    <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: mob ? 13 : 15, fontWeight: 600, color: C.text1, paddingRight: 16 }}>{faq.q}</span>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, transform: open === i ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.3s ease" }}>
                      <polyline points="6 9 12 15 18 9" stroke={C.gold} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div style={{ maxHeight: open === i ? 500 : 0, opacity: open === i ? 1 : 0, transition: "all 0.35s cubic-bezier(0.4,0,0.2,1)", overflow: "hidden" }}>
                    <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: mob ? 12 : 14, lineHeight: 1.65, color: C.text2, margin: 0, padding: mob ? "0 16px 16px" : "0 22px 20px" }}>
                      {faq.a.map((part, pi) => pi % 2 === 1 ? <span key={pi} style={{ color: C.gold, fontWeight: 600 }}>{part}</span> : <span key={pi}>{part}</span>)}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Box>
    </Section>
  );
};

// ═══════════════════════════════════════════════════════════════════
// FINAL CTA — dual-path: Roadmap + Community Waitlist
// ═══════════════════════════════════════════════════════════════════
const FinalCTA = ({ onPrimary }) => {
  const { mob } = useBp();
  return (
    <Section gradient={`radial-gradient(ellipse 80% 70% at 50% 60%,rgba(200,162,78,0.08) 0%,transparent 50%),linear-gradient(180deg,#090d14 0%,#0c1018 50%,#090d14 100%)`} style={{ padding: mob ? "60px 0" : "100px 0 80px" }}>
      <Caustic x="20%" y="20%" angle={-6} width={mob ? 350 : 600} opacity={0.15}/>
      <Box style={{ maxWidth: 720 }}>
        <Reveal>
          <Glass intensity="strong" glow={C.gold} style={{ padding: mob ? 28 : 48, textAlign: "center", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", inset: 0, opacity: 0.03, backgroundImage: `linear-gradient(rgba(200,162,78,0.3) 1px,transparent 1px),linear-gradient(90deg,rgba(200,162,78,0.3) 1px,transparent 1px)`, backgroundSize: "30px 30px" }}/>
            <div style={{ position: "relative", zIndex: 1 }}>
              <KVShield size={mob ? 40 : 52} glow/>
              <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, fontSize: mob ? 28 : 44, lineHeight: 1.1, color: C.text1, textTransform: "uppercase", margin: "20px 0 14px" }}>
                Your constraint is <GoldText>waiting</GoldText> to be found.
              </h2>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: mob ? 14 : 16, color: C.text2, margin: "0 auto 28px", lineHeight: 1.6, maxWidth: 520 }}>
                The Constraint Roadmap is free. Everything downstream is entered at your pace — never ours.
              </p>
              <div style={{ display: "flex", gap: 12, justifyContent: "center", alignItems: "center", flexWrap: "wrap" }}>
                <GoldBtn large style={{ width: mob ? "100%" : undefined }} onClick={onPrimary}>Get Your Free Constraint Roadmap</GoldBtn>
              </div>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: C.text3, marginTop: 16 }}>
                No pitch. No pressure. Your data stays with you.
              </p>
            </div>
          </Glass>
        </Reveal>
      </Box>
    </Section>
  );
};

// ═══════════════════════════════════════════════════════════════════
// CLOSING STATEMENT
// ═══════════════════════════════════════════════════════════════════
const ClosingStatement = () => {
  const { mob } = useBp();
  return (
    <div style={{ position: "relative", overflow: "hidden" }}>
      <div style={{ minHeight: mob ? "auto" : "60vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", padding: mob ? "80px 20px 40px" : "120px 20px 40px", position: "relative" }}>
        {/* Background glow */}
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 50% 60% at 50% 40%, rgba(200,162,78,0.08) 0%, transparent 70%)`, pointerEvents: "none" }}/>
        <div style={{ position: "absolute", inset: 0, opacity: 0.025, backgroundImage: `linear-gradient(rgba(200,162,78,0.4) 1px,transparent 1px),linear-gradient(90deg,rgba(200,162,78,0.4) 1px,transparent 1px)`, backgroundSize: "40px 40px", pointerEvents: "none" }}/>

        {/* Quote */}
        <div style={{ position: "relative", zIndex: 1, marginBottom: 40 }}>
          <Reveal>
            <div style={{ width: 60, height: 2, margin: "0 auto 32px", background: `linear-gradient(90deg, transparent, ${C.gold}, transparent)` }}/>
          </Reveal>
          <Reveal delay={100}>
            <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: mob ? 24 : 36, fontWeight: 400, fontStyle: "italic", color: C.text1, maxWidth: 700, margin: "0 auto", lineHeight: 1.45, textShadow: `0 0 40px rgba(200,162,78,0.15)` }}>
              Building a business that is <span style={{ fontStyle: "normal", fontWeight: 700, color: C.gold }}>an asset that runs without you</span> shouldn't require doing it alone.
            </p>
          </Reveal>
          <Reveal delay={200}>
            <div style={{ width: 60, height: 2, margin: "32px auto 0", background: `linear-gradient(90deg, transparent, ${C.gold}, transparent)` }}/>
          </Reveal>
        </div>

        {/* VIRTUS wireframe watermark — fading top to bottom */}
        <div style={{ position: "relative", width: "100%", overflow: "hidden", height: mob ? 120 : 200, marginBottom: -40 }}>
          <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", fontFamily: "'Cormorant Garamond',serif", fontSize: mob ? 140 : 240, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.2em", whiteSpace: "nowrap", color: "transparent", WebkitTextStroke: "1.5px rgba(200,162,78,0.22)", maskImage: "linear-gradient(180deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)", WebkitMaskImage: "linear-gradient(180deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)", pointerEvents: "none", userSelect: "none", lineHeight: 0.85 }}>
            VIRTUS
          </div>
        </div>
      </div>

      {/* Gradient blending into footer */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 60, background: `linear-gradient(180deg,transparent,${C.bgDeep})`, pointerEvents: "none" }}/>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════
// FOOTER
// ═══════════════════════════════════════════════════════════════════
const Footer = () => {
  const { mob } = useBp();
  return (
    <footer style={{ position: "relative", background: C.bgDeep, borderTop: `1px solid ${C.border1}`, padding: mob ? "40px 0 24px" : "60px 0 32px" }}>
      <Box>
        {/* Top — 4 columns on desktop */}
        <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "1.5fr 1fr 1fr 1.2fr", gap: mob ? 28 : 40, marginBottom: mob ? 28 : 40 }}>
          {/* Brand — matching nav logo */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <div style={{ width: 34, height: 34, borderRadius: 8, background: "rgba(200,162,78,0.06)", border: "1px solid rgba(200,162,78,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <KVShield size={18} glow/>
              </div>
              <span style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, fontSize: 16, color: C.text1, letterSpacing: 1.2, textTransform: "uppercase" }}>KRICZKY VIRTUS</span>
            </div>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: C.text3, lineHeight: 1.55, margin: 0, maxWidth: 260 }}>
              Helping $500K–$10M business owners grow profits, build enterprise value, and create a business that runs without them.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, fontWeight: 700, color: C.text2, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 14 }}>Quick Links</div>
            {[
              { label: "Free Constraint Roadmap", href: "#hero" },
              { label: "Resources Hub", href: "/tools" },
              { label: "How We Work Together", href: "#pricing" },
              { label: "FAQ", href: "#faq" },
            ].map(l => (
              <a key={l.label} href={l.href} style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: C.text3, textDecoration: "none", display: "block", marginBottom: 10, transition: "color 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.color = C.gold}
                onMouseLeave={e => e.currentTarget.style.color = C.text3}
              >{l.label}</a>
            ))}
          </div>

          {/* Services */}
          <div>
            <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, fontWeight: 700, color: C.text2, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 14 }}>Services</div>
            {[
              { label: "Valuation Driver Intensive", href: "#pricing" },
              { label: "Clarity Partner", href: "#pricing" },
              { label: "Growth Partner", href: "#pricing" },
            ].map(l => (
              <a key={l.label} href={l.href} style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: C.text3, textDecoration: "none", display: "block", marginBottom: 10, transition: "color 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.color = C.gold}
                onMouseLeave={e => e.currentTarget.style.color = C.text3}
              >{l.label}</a>
            ))}
          </div>

          {/* Contact */}
          <div>
            <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, fontWeight: 700, color: C.text2, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 14 }}>Get In Touch</div>
            <a href="mailto:ekriczky@kriczkyvirtus.com" style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: C.text3, textDecoration: "none", display: "block", marginBottom: 10, transition: "color 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.color = C.gold}
              onMouseLeave={e => e.currentTarget.style.color = C.text3}
            >ekriczky@kriczkyvirtus.com</a>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: C.text4, margin: "4px 0 0", lineHeight: 1.45 }}>
              kriczkyvirtus.com
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: `1px solid ${C.border1}`, paddingTop: mob ? 16 : 20, display: "flex", flexDirection: mob ? "column" : "row", justifyContent: "space-between", alignItems: mob ? "center" : "center", gap: mob ? 12 : 0 }}>
          <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: C.text4 }}>© {new Date().getFullYear()} Kriczky Virtus, LLC</span>
          <div style={{ display: "flex", gap: 24 }}>
            {["Privacy Policy", "Terms of Service", "Disclaimer"].map(l => (
              <a key={l} href="#" style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: C.text4, textDecoration: "none", transition: "color 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.color = C.text2}
                onMouseLeave={e => e.currentTarget.style.color = C.text4}
              >{l}</a>
            ))}
          </div>
        </div>
      </Box>
    </footer>
  );
};

// ═══════════════════════════════════════════════════════════════════
// STORYBRAND: EMPATHY STATEMENT + 3-STEP PLAN
// Addresses Gap 2 (internal problem), Gap 4 (simplified plan),
// Gap 6 (failure stakes)
// ═══════════════════════════════════════════════════════════════════
// STORYBRAND: SUCCESS TRANSFORMATION
// Addresses Gap 5 (paint the success picture vividly)
// ═══════════════════════════════════════════════════════════════════
const TRANSFORM_ITEMS = [
  { before: "You check your bank account every morning wondering if payroll is covered.", after: "Cash flow is predictable — you plan from a 12-month projection, not a bank balance." },
  { before: "Revenue is growing but your take-home isn't — you can't explain where the margin went.", after: "Your worst-margin work has been re-priced or replaced — EBITDA margin expanding." },
  { before: "You work 50+ hours per week and can't name which clients are actually profitable.", after: "You know your numbers cold — by service line, by client, by month." },
  { before: "The business can't survive a week without you — you can't attract top-talent for growth, and if you look to sell a buyer would discount it for that.", after: "The business runs without you — growth happens without you and a buyer would pay a premium for it." },
  { before: "You haven't taken a real vacation in two years.", after: "You took two weeks off. Since your team runs everything anyway, nothing broke." },
];

const TRANSFORM_METRICS = [
  { label: "Profit Gap", before: 480, after: 60, unit: "K/yr", beforeNote: "left on the table each year", afterNote: "and closing" },
  { label: "EBITDA Margin", before: 11, after: 20, unit: "%", beforeNote: "", afterNote: "and climbing" },
  { label: "Valuation", before: 0, after: 4800, unit: "", beforeNote: "not sellable", afterNote: "Green Zone" },
  { label: "Score", before: 32, after: 78, unit: "", beforeNote: "", afterNote: "" },
];

const SuccessTransformation = ({ onPrimary }) => {
  const { mob, tab } = useBp();
  const [progress, setProgress] = useState(0); // 0 = Before, 100 = After
  const [touched, setTouched] = useState(false);
  const [nudged, setNudged] = useState(false);
  const nudgeRef = useRef(null);
  useEffect(() => {
    if (touched || nudged) return;
    const el = nudgeRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        obs.disconnect();
        setNudged(true);
        // Animate smoothly to 14
        const dur = 1200; const t0 = performance.now();
        const slideUp = (now) => {
          const p = Math.min((now - t0) / dur, 1);
          const ease = 1 - Math.pow(1 - p, 3);
          setProgress(ease * 14);
          if (p < 1) requestAnimationFrame(slideUp);
        };
        setTimeout(() => requestAnimationFrame(slideUp), 600);
        // After 5s hold, animate smoothly back to 0
        setTimeout(() => {
          const dur2 = 1000; const t1 = performance.now();
          const slideDown = (now) => {
            const p = Math.min((now - t1) / dur2, 1);
            const ease = 1 - Math.pow(1 - p, 3);
            setProgress(14 * (1 - ease));
            if (p < 1) requestAnimationFrame(slideDown);
          };
          requestAnimationFrame(slideDown);
        }, 6800);
      }
    }, { threshold: 0.4 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [touched, nudged]);

  const lerp = (a, b) => a + (b - a) * (progress / 100);
  const score = Math.round(lerp(32, 78));
  const scoreColor = score >= 70 ? C.green : score >= 50 ? C.gold : C.red;
  const stageColor = progress < 20 ? C.red : progress < 50 ? C.amber : progress < 75 ? C.gold : C.green;
  const stageLabel = progress < 20 ? "At Risk" : progress < 50 ? "Improving" : progress < 75 ? "Progressing" : "Compounding";

  const fmtMetric = (m) => {
    const v = Math.round(lerp(m.before, m.after));
    if (m.label === "Profit Gap") return `$${v}K/yr`;
    if (m.label === "EBITDA Margin") return `${v}%`;
    if (m.label === "Valuation") return v === 0 ? "$0" : `$${(v/1000).toFixed(1)}M`;
    return `${v}`;
  };
  const metricNote = (m) => {
    if (progress < 30) return m.beforeNote;
    if (progress > 70) return m.afterNote;
    return "";
  };

  const ringSize = mob ? 80 : 100;
  const r = ringSize / 2 - 6;

  return (
    <Section gradient={`radial-gradient(ellipse 60% 50% at 40% 60%,${stageColor}08 0%,transparent 50%),linear-gradient(180deg,#090d14 0%,#0a0e15 50%,#090d14 100%)`} style={{ padding: mob ? "60px 0" : "100px 0" }}>
      <Box style={{ maxWidth: 1080 }}>
        <div style={{ textAlign: "center", marginBottom: mob ? 28 : 48 }}>
          <Reveal>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: mob ? 11 : 12, color: C.gold, textTransform: "uppercase", letterSpacing: 1.8, marginBottom: 10, fontWeight: 600 }}>The Transformation</p>
          </Reveal>
          <Reveal delay={100}>
            <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, fontSize: mob ? 30 : tab ? 40 : 52, lineHeight: 1.08, color: C.text1, textTransform: "uppercase", letterSpacing: -0.5, margin: "0 0 16px", textShadow: "0 2px 20px rgba(0,0,0,0.5)" }}>
              From leaking profit to <GoldText>compounding value.</GoldText>
            </h2>
          </Reveal>
          <Reveal delay={150}>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: mob ? 14 : 16, color: C.text2, margin: "0 auto", maxWidth: 600, lineHeight: 1.6 }}>
              Same business. Same revenue. A fundamentally different relationship between you, your profit, and the value of your business.
            </p>
          </Reveal>
        </div>

        <Reveal delay={200}>
          <div ref={nudgeRef} style={{ padding: mob ? 22 : 36, borderRadius: 20, background: "linear-gradient(160deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.015) 100%)", border: `1.5px solid ${stageColor}20`, boxShadow: `0 12px 48px rgba(0,0,0,0.4), 0 0 60px ${stageColor}06`, position: "relative", overflow: "hidden", transition: "border-color 0.5s ease, box-shadow 0.5s ease" }}>
            <style>{`
              .transform-slider::-webkit-slider-thumb { background: ${stageColor} !important; }
              .transform-slider::-moz-range-thumb { background: ${stageColor} !important; }
            `}</style>
            {/* Diagonal shine */}
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 30%, transparent 50%, transparent 70%, rgba(255,255,255,0.03) 100%)", pointerEvents: "none", zIndex: 0 }}/>
            {/* Top glow edge */}
            <div style={{ position: "absolute", top: 0, left: "10%", width: "80%", height: 1.5, background: `linear-gradient(90deg, transparent, ${stageColor}40, transparent)`, zIndex: 2, transition: "background 0.5s ease" }}/>

            <div style={{ position: "relative", zIndex: 1 }}>
              {/* Score ring + stage label */}
              <div style={{ display: "flex", alignItems: "center", gap: mob ? 16 : 24, marginBottom: mob ? 20 : 24 }}>
                <div style={{ position: "relative", width: ringSize, height: ringSize, flexShrink: 0 }}>
                  <svg width={ringSize} height={ringSize} style={{ transform: "rotate(-90deg)" }}>
                    <circle cx={ringSize/2} cy={ringSize/2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={mob ? 4 : 5}/>
                    <circle cx={ringSize/2} cy={ringSize/2} r={r} fill="none" stroke={scoreColor} strokeWidth={mob ? 4 : 5} strokeLinecap="round" strokeDasharray={2*Math.PI*r} strokeDashoffset={2*Math.PI*r*(1-score/100)} style={{ filter: `drop-shadow(0 0 6px ${scoreColor}60)`, transition: "stroke 0.3s, stroke-dashoffset 0.1s" }}/>
                  </svg>
                  <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: mob ? 28 : 36, fontWeight: 600, color: scoreColor, lineHeight: 1, transition: "color 0.3s" }}>{score}</span>
                  </div>
                </div>
                <div>
                  <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, color: stageColor, textTransform: "uppercase", letterSpacing: 1.2, fontWeight: 700, marginBottom: 3, transition: "color 0.3s" }}>{stageLabel}</div>
                  <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: mob ? 22 : 28, fontWeight: 700, color: C.text1, lineHeight: 1.1 }}>
                    {progress < 30 ? "Where most owners start." : progress < 70 ? "Progress compounding." : "Where a partner takes you."}
                  </div>
                </div>
              </div>

              {/* Slider — full width, own row */}
              <div style={{ marginBottom: mob ? 24 : 28 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, color: C.red, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.8 }}>Before</span>
                  <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, color: C.green, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.8 }}>After</span>
                </div>
                <input type="range" min="0" max="100" value={progress} onChange={e => { setTouched(true); setProgress(Number(e.target.value)); }}
                  className="transform-slider"
                  style={{ width: "100%", height: 8, WebkitAppearance: "none", appearance: "none", borderRadius: 4, outline: "none", cursor: "pointer", background: `linear-gradient(90deg, ${C.red} 0%, ${C.amber} 30%, ${C.gold} 50%, ${C.cyan} 75%, ${C.green} 100%)`, opacity: 0.8 }}/>
              </div>

              {/* Metrics bar */}
              <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr 1fr" : "1fr 1fr 1fr", gap: mob ? 10 : 14, marginBottom: mob ? 24 : 28 }}>
                {TRANSFORM_METRICS.filter(m => m.label !== "Score").map((m, i) => (
                  <div key={i} style={{ padding: mob ? "10px 12px" : "14px 16px", borderRadius: 12, background: `${stageColor}06`, border: `1px solid ${stageColor}12`, textAlign: "center", transition: "all 0.3s ease" }}>
                    <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: C.text3, marginBottom: 4 }}>{m.label}</div>
                    <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: mob ? 22 : 26, fontWeight: 600, color: stageColor, transition: "color 0.3s" }}>{fmtMetric(m)}</div>
                    <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 9, color: stageColor, marginTop: 2, transition: "color 0.3s", minHeight: 14, opacity: metricNote(m) ? 1 : 0 }}>{metricNote(m) || "\u00A0"}</div>
                  </div>
                ))}
              </div>

              {/* Transition bullet points — stable height */}
              <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "1fr 1fr", gap: mob ? 10 : 16 }}>
                {TRANSFORM_ITEMS.map((item, i) => {
                  const isAfter = progress > (i + 1) * 18;
                  const color = isAfter ? C.green : C.red;
                  return (
                    <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "10px 14px", borderRadius: 10, background: `${color}04`, border: `1px solid ${color}10`, transition: "all 0.4s ease" }}>
                      <div style={{ width: 20, height: 20, borderRadius: isAfter ? "50%" : 5, background: `${color}12`, border: `1px solid ${color}25`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2, transition: "all 0.3s ease" }}>
                        {isAfter
                          ? <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke={C.green} strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                          : <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke={C.red} strokeWidth="3" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                        }
                      </div>
                      {/* Grid stack — both texts occupy same cell, tallest wins */}
                      <div style={{ flex: 1, display: "grid" }}>
                        <span style={{ gridArea: "1 / 1", fontFamily: "'DM Sans',sans-serif", fontSize: mob ? 12 : 13, color: C.text2, lineHeight: 1.55, opacity: isAfter ? 0 : 1, transition: "opacity 0.35s ease" }}>{item.before}</span>
                        <span style={{ gridArea: "1 / 1", fontFamily: "'DM Sans',sans-serif", fontSize: mob ? 12 : 13, color: C.text1, lineHeight: 1.55, opacity: isAfter ? 1 : 0, transition: "opacity 0.35s ease" }}>{item.after}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={300}>
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, color: C.text3, margin: "16px auto 0", fontStyle: "italic", textAlign: "center", maxWidth: 640, lineHeight: 1.5 }}>Illustrative example for educational purposes only. Actual results depend on your business, industry, and execution. Metrics shown are representative — not a guarantee of specific outcomes.</p>
        </Reveal>

        <Reveal delay={400}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, marginTop: mob ? 28 : 40 }}>
            <GoldBtn large onClick={onPrimary}>Get Your Free Constraint Roadmap</GoldBtn>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: C.text3, margin: 0 }}>Free · 90 seconds · No account needed</p>
          </div>
        </Reveal>
      </Box>
    </Section>
  );
};

// ═══════════════════════════════════════════════════════════════════
// STORYBRAND: REPEATING CTA STRIP
// Addresses Gap 7 (CTA not repeated enough)
// ═══════════════════════════════════════════════════════════════════
const CTAStrip = ({ onPrimary, message = "Ready to find your #1 constraint?" }) => {
  const { mob } = useBp();
  return (
    <div style={{ position: "relative", background: `linear-gradient(180deg,${C.bgCard} 0%,#0d131c 100%)`, borderTop: `1px solid ${C.border1}`, borderBottom: `1px solid ${C.border1}`, padding: mob ? "24px 0" : "28px 0", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg,transparent,${C.gold}30,${C.gold}60,${C.gold}30,transparent)` }}/>
      <Box style={{ display: "flex", flexDirection: mob ? "column" : "row", alignItems: "center", justifyContent: "center", gap: mob ? 12 : 24 }}>
        <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: mob ? 18 : 22, color: C.text1, fontWeight: 500 }}>{message}</span>
        <GoldBtn onClick={onPrimary}>Get Your Free Roadmap</GoldBtn>
      </Box>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════
// MAIN — ties all sections together with shared handlers
// ═══════════════════════════════════════════════════════════════════
export default function KriczkyVirtusHomepage() {
  const scrollToHero = () => {
    const el = document.getElementById("top");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const scrollToHowItWorks = () => {
    const el = document.getElementById("how-it-works");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const scrollToEngagements = () => {
    const el = document.getElementById("engagements");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  return (
    <div id="top" style={{ background: C.bgDeep, minHeight: "100vh", overflow: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=DM+Sans:wght@400;500;600;700&display=swap');
        *,*::before,*::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { background: ${C.bgDeep}; }
        input::placeholder { color: ${C.text4}; }
        button:hover { }
        ::selection { background: ${C.gold}30; color: ${C.text1}; }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes shimmerStroke { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        @keyframes btnShimmerSlow { 0% { background-position: -200% 0; } 50% { background-position: 200% 0; } 50.01% { background-position: -200% 0; } 100% { background-position: -200% 0; } }
        @property --shimmer-angle { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
        @keyframes pillShimmerRotate { from { --shimmer-angle: 0deg; } to { --shimmer-angle: 360deg; } }
        .pill-shimmer > div { animation: pillShimmerRotate 4s linear infinite; }
        input[type="range"].transform-slider::-webkit-slider-thumb { -webkit-appearance: none; width: 20px; height: 20px; border-radius: 50%; border: 2.5px solid white; cursor: pointer; box-shadow: 0 0 12px rgba(255,255,255,0.5); }
        input[type="range"].transform-slider::-moz-range-thumb { width: 20px; height: 20px; border-radius: 50%; border: 2.5px solid white; cursor: pointer; box-shadow: 0 0 12px rgba(255,255,255,0.5); }
        @keyframes testimonialScrollL { from { transform: translateX(0); } to { transform: translateX(-33.33%); } }
        @keyframes testimonialScrollR { from { transform: translateX(-33.33%); } to { transform: translateX(0); } }
        @keyframes arrowPulse { 0%,100% { box-shadow: 0 0 8px 0 var(--arrow-color),0 0 0 0 var(--arrow-color); transform: scale(1); } 50% { box-shadow: 0 0 18px 3px var(--arrow-color),0 0 30px 6px var(--arrow-color); transform: scale(1.06); } }
        @keyframes videoFadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .video-carousel-arrow { animation: arrowPulse 2s ease-in-out infinite; }
        .video-carousel-arrow:hover { animation: none !important; transform: scale(1.08) !important; filter: brightness(1.3); }
        .carousel-arrow:hover { animation: none !important; transform: scale(1.1) !important; filter: brightness(1.3); }
        ::-webkit-scrollbar { display: none; }
      `}</style>
      <Nav onPrimary={scrollToHero}/>
      <HeroSection onPrimary={scrollToHero}/>
      <SocialProof/>
      <JourneyAccordion onPrimary={scrollToHero}/>
      <TestimonialStrip/>
      <SuccessTransformation onPrimary={scrollToHero}/>
      <ComparisonTable/>
      <CTAStrip onPrimary={scrollToHero} message="Free roadmap. 90 seconds. No account needed."/>
      <GoDeeper/>
      <PricingSection onPrimary={scrollToHero}/>
      {/* CaseStudiesSection hidden until video content is ready */}
      {/* <CaseStudiesSection onPrimary={scrollToHero}/> */}
      <FAQSection/>
      <FinalCTA onPrimary={scrollToHero}/>
      <ClosingStatement/>
      <Footer/>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// INLINED — VALOR MINI-ASSESSMENT V3 (with MA_ prefix to avoid collisions)
// ═══════════════════════════════════════════════════════════════════════════
const MA_CATEGORY_COLOR = {
  profitability: C.gold, cash_flow: C.green, owner_dependency: C.amber,
  revenue_quality: C.gold, operational_efficiency: C.amber, debt_coverage: C.red,
};
const MA_CATEGORY_ORDER = [
  { id: "profitability", label: "Profitability" },
  { id: "cash_flow", label: "Cash Flow" },
  { id: "revenue_quality", label: "Revenue Quality" },
  { id: "owner_dependency", label: "Owner Dependency" },
  { id: "operational_efficiency", label: "Operational Efficiency" },
  { id: "debt_coverage", label: "Debt & Coverage" },
];

const MA_Glass = ({ children, style, glow }) => (
  <div style={{
    background: "linear-gradient(145deg,rgba(255,255,255,0.07),rgba(255,255,255,0.03) 50%,rgba(255,255,255,0.05))",
    backdropFilter: "blur(16px) saturate(1.2)",
    WebkitBackdropFilter: "blur(16px) saturate(1.2)",
    border: `1px solid ${C.border2}`,
    borderTop: "1px solid rgba(255,255,255,0.16)",
    borderRadius: 18,
    boxShadow: glow
      ? `0 2px 4px rgba(0,0,0,0.2),0 8px 24px rgba(0,0,0,0.3),0 20px 48px rgba(0,0,0,0.2),inset 0 1px 0 rgba(255,255,255,0.09),0 0 60px ${glow}1f,0 0 140px ${glow}0d`
      : `0 2px 4px rgba(0,0,0,0.2),0 8px 24px rgba(0,0,0,0.3),0 20px 48px rgba(0,0,0,0.2),inset 0 1px 0 rgba(255,255,255,0.09)`,
    position: "relative", ...style,
  }}>{children}</div>
);

const MA_ScoreRing = ({ score, color, size = 200, stroke = 14 }) => {
  const r = (size - stroke) / 2, circ = 2 * Math.PI * r, off = circ - (score / 100) * circ;
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={stroke}/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={off} style={{ filter: `drop-shadow(0 0 12px ${color}aa)`, transition: "stroke-dashoffset 1.4s ease-out" }}/>
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 300, fontSize: size * 0.36, lineHeight: 1, color, letterSpacing: "-0.02em" }}>{score}</div>
        <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: C.text3, marginTop: 6 }}>out of 100</div>
      </div>
    </div>
  );
};

const MA_QUESTIONS = [
  { id: "revenue", category: "context", question: "What's your approximate annual revenue?", subtitle: "We calibrate the diagnostic to businesses your size",
    options: [
      { label: "Under $500K", value: "under_500k", score: null },
      { label: "$500K – $750K", value: "500k_750k", score: null },
      { label: "$750K – $1M", value: "750k_1m", score: null },
      { label: "$1M – $3M", value: "1m_3m", score: null },
      { label: "$3M – $10M", value: "3m_10m", score: null },
      { label: "Over $10M", value: "over_10m", score: null },
    ] },
  { id: "profit_clarity", category: "profitability", question: "Do you know your gross margin off the top of your head?", subtitle: "Not the calculated answer — the one you'd say right now",
    options: [
      { label: "Yes, I know it to the percentage point", score: 90 },
      { label: "Roughly, within 5 points", score: 70 },
      { label: "I have a ballpark but I'm not confident", score: 45 },
      { label: "Honestly, no", score: 20 },
    ] },
  { id: "cash_stress", category: "cash_flow", question: "How often do you worry about making payroll or covering bills?", subtitle: "Be honest — this is the most revealing question",
    options: [
      { label: "Never — we have 6+ months of runway", score: 95 },
      { label: "Rarely — we have 3–6 months of cushion", score: 75 },
      { label: "Sometimes — it's tight but manageable", score: 50 },
      { label: "Often — I check the bank account daily", score: 20 },
    ] },
  { id: "owner_dependency", category: "owner_dependency", question: "If you took a 2-week vacation with zero contact, what happens?", subtitle: "The ultimate test of whether you own the business or it owns you",
    options: [
      { label: "Business runs smoothly — team handles everything", score: 95 },
      { label: "Mostly fine with a few check-ins needed", score: 70 },
      { label: "Some problems would pile up, but we'd recover", score: 45 },
      { label: "It would be a disaster", score: 15 },
    ] },
  { id: "revenue_quality", category: "revenue_quality", question: "What percentage of revenue comes from your top customer?", subtitle: "Concentration risk is often invisible until it's a crisis",
    options: [
      { label: "Under 10% — well diversified", score: 90 },
      { label: "10–20%", score: 70 },
      { label: "20–40%", score: 45 },
      { label: "Over 40% — one customer dominates", score: 20 },
    ] },
  { id: "decision_data", category: "operational_efficiency", question: "When you make a major business decision, what do you base it on?", subtitle: "Hiring, pricing, expansion — the big moves",
    options: [
      { label: "Financial model with scenarios mapped out", score: 95 },
      { label: "Spreadsheet with basic numbers", score: 65 },
      { label: "Advice from my accountant or advisor", score: 50 },
      { label: "Mostly gut feel and experience", score: 25 },
    ] },
  { id: "biggest_worry", category: "constraint_signal", question: "What's the biggest thing keeping you up at night about your business?", subtitle: "One choice — pick the one that hits hardest",
    options: [
      { label: "I'm profitable but cash is always tight", value: "cash_flow", score: null },
      { label: "I can't step away without everything falling apart", value: "owner_dependency", score: null },
      { label: "I feel like money is leaking somewhere I can't see", value: "profitability", score: null },
      { label: "Too much of my revenue depends on too few customers", value: "revenue_quality", score: null },
      { label: "We're busy but operationally messy — things slip through", value: "operational_efficiency", score: null },
      { label: "Debt service is squeezing every decision I make", value: "debt_coverage", score: null },
    ] },
];

const ma_getQuestionScore = (questionId, answerValue) => {
  const q = MA_QUESTIONS.find(x => x.id === questionId);
  if (!q) return null;
  const opt = q.options.find(o => (o.value !== undefined ? o.value : o.label) === answerValue);
  return opt && opt.score != null ? opt.score : null;
};
const ma_buildCategoryScores = (answers) => {
  const sigByCat = {};
  for (const q of MA_QUESTIONS) {
    if (q.category === "context" || q.category === "constraint_signal") continue;
    const s = ma_getQuestionScore(q.id, answers[q.id]);
    if (s != null) sigByCat[q.category] = s;
  }
  const cf = sigByCat.cash_flow, pf = sigByCat.profitability;
  if (cf != null && pf != null) sigByCat.debt_coverage = Math.max(0, Math.round((cf + pf) / 2) - 5);
  else if (cf != null) sigByCat.debt_coverage = Math.max(0, cf - 5);
  else sigByCat.debt_coverage = 60;
  return MA_CATEGORY_ORDER.map(({ id, label }) => ({
    id, name: label,
    score: sigByCat[id] != null ? sigByCat[id] : 60,
    color: MA_CATEGORY_COLOR[id],
  }));
};
const ma_computeComposite = (categories) => {
  if (!categories.length) return 50;
  const sum = categories.reduce((a, c) => a + c.score, 0);
  return Math.round(sum / categories.length);
};
const ma_determineConstraintId = (answers, categories) => {
  const worryId = answers.biggest_worry;
  const lowest = [...categories].sort((a, b) => a.score - b.score)[0];
  if (worryId && lowest && lowest.id !== worryId && lowest.score < 30) return lowest.id;
  if (worryId) return worryId;
  return lowest ? lowest.id : "cash_flow";
};
const ma_buildResultData = (answers) => {
  const categories = ma_buildCategoryScores(answers);
  const score = ma_computeComposite(categories);
  const constraintId = ma_determineConstraintId(answers, categories);
  const cleanCategories = categories.map(({ name, score, color }) => ({ name, score, color }));
  return { score, constraintId, revenue: answers.revenue || "1m_3m", categories: cleanCategories };
};

const MA_CONSTRAINT_PREVIEW = {
  profitability: { name: "Profitability & Margins", teaser: "You're working hard and the bottom line isn't reflecting it. Margins are leaking somewhere you can't see, and the gap compounds every month it goes unfixed." },
  cash_flow: { name: "Cash Flow Fragility", teaser: "You may be profitable on paper, but cash isn't where it needs to be when you need it. This is almost always a timing problem, not a profit problem — and it caps growth before it breaks the business." },
  owner_dependency: { name: "Owner Dependency", teaser: "The business runs through you. That feels like dedication; it's actually the ceiling. A business that can't function without its owner is worth a fraction of one that can — and the gap shows up the day you try to step back." },
  revenue_quality: { name: "Revenue Quality", teaser: "Too much of your revenue sits in too few places. The shape of your revenue is making you cautious in ways that cost you the moves you should be making." },
  operational_efficiency: { name: "Operational Efficiency", teaser: "Overhead has grown faster than revenue and nobody on the team owns the cost structure. Margin is leaking across line items nobody's watching." },
  debt_coverage: { name: "Debt Coverage", teaser: "Your debt service is taking the oxygen before anything else can breathe. The payments were sized for a business you were hoping to be by now — not the one you actually are." },
};

function MiniAssessment({ onComplete }) {
  const { mob, tab } = useBp();
  const [step, setStep] = useState("intro");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [email, setEmail] = useState("");
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [displayScore, setDisplayScore] = useState(0);
  const [resultData, setResultData] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleAnswer = (questionId, value) => {
    const newAnswers = { ...answers, [questionId]: value };
    setAnswers(newAnswers);
    setTimeout(() => {
      if (currentQ < MA_QUESTIONS.length - 1) setCurrentQ(currentQ + 1);
      else {
        setStep("calculating");
        setTimeout(() => {
          const data = ma_buildResultData(newAnswers);
          setResultData(data);
          setStep("result");
        }, 1800);
      }
    }, 280);
  };

  useEffect(() => {
    if (step !== "result" || !resultData) return;
    let s = 0;
    const target = resultData.score;
    const tick = () => {
      s += 1.2;
      setDisplayScore(Math.min(Math.round(s), target));
      if (s < target) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [step, resultData]);

  const constraint = resultData ? MA_CONSTRAINT_PREVIEW[resultData.constraintId] : null;
  const constraintColor = resultData ? MA_CATEGORY_COLOR[resultData.constraintId] : C.gold;
  const scoreColor = displayScore >= 90 ? C.green : displayScore >= 70 ? C.cyan : displayScore >= 50 ? C.gold : C.red;
  const scoreLabel = displayScore >= 90 ? "Excellent" : displayScore >= 70 ? "Healthy" : displayScore >= 50 ? "At Risk" : "Critical";
  const progress = step === "questions" ? ((currentQ + 1) / MA_QUESTIONS.length) * 100 : step === "intro" ? 0 : 100;

  const handleRestart = () => {
    setStep("intro"); setCurrentQ(0); setAnswers({}); setDisplayScore(0);
    setResultData(null); setEmail(""); setEmailSubmitted(false);
    setSubmitting(false); setSubmitError("");
  };

  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const handleEmailSubmit = async () => {
    setSubmitError("");
    if (!email || !EMAIL_REGEX.test(email)) { setSubmitError("Enter a valid email address."); return; }
    if (!resultData) { setSubmitError("Something went wrong. Please refresh and try again."); return; }
    setSubmitting(true);
    try {
      // eslint-disable-next-line no-console
      console.log("[MiniAssessment] would POST /api/assessment/submit:", { email, resultData, submittedAt: new Date().toISOString() });
      await new Promise(r => setTimeout(r, 600));
      setEmailSubmitted(true);
      if (typeof onComplete === "function") onComplete(resultData);
    } catch (err) {
      setSubmitError(err.message || "Submission failed. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <div style={{ background: "transparent", minHeight: "100%", fontFamily: "'DM Sans',sans-serif", color: C.text1, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, zIndex: 0, background: `radial-gradient(ellipse 80% 60% at 25% 85%,#221a08 0%,transparent 55%),radial-gradient(ellipse 60% 50% at 75% 15%,#151a30 0%,transparent 55%),radial-gradient(ellipse 70% 50% at 50% 50%, rgba(200,162,78,0.04) 0%, transparent 60%),linear-gradient(155deg,#070a10 0%,#0c1018 25%,#151208 50%,#0e1220 75%,#090d14 100%)` }}/>
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 1, opacity: 0.07, mixBlendMode: "overlay", backgroundImage: GRAIN, backgroundSize: "128px 128px" }}/>

      {step !== "intro" && (
        <div style={{ position: "sticky", top: 0, left: 0, right: 0, zIndex: 50, height: 3, background: "rgba(255,255,255,0.04)" }}>
          <div style={{ height: "100%", width: `${progress}%`, background: `linear-gradient(90deg, ${C.gold}, ${C.goldLight})`, boxShadow: `0 0 8px ${C.gold}60`, transition: "width 0.5s cubic-bezier(0.4,0,0.2,1)" }}/>
        </div>
      )}

      <div style={{ position: "relative", zIndex: 10, maxWidth: 620, margin: "0 auto", padding: mob ? "36px 20px" : "56px 40px", display: "flex", alignItems: "center", justifyContent: "center", minHeight: mob ? 500 : 580 }}>
        {step === "intro" && (
          <div style={{ textAlign: "center", width: "100%" }}>
            <div style={{ marginBottom: 16, display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 14px", borderRadius: 8, border: `1px solid ${C.gold}30`, background: `${C.gold}08` }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: C.gold, boxShadow: `0 0 6px ${C.gold}60` }}/>
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: C.gold, textTransform: "uppercase" }}>Free Business Health Diagnostic</span>
            </div>
            <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: mob ? 30 : tab ? 40 : 46, fontWeight: 700, color: C.text1, lineHeight: 1.05, margin: "0 0 16px", letterSpacing: -0.5, textShadow: "0 2px 20px rgba(0,0,0,0.5)" }}>
              Find your <GoldText>#1 constraint</GoldText> in 90 seconds.
            </h1>
            <p style={{ fontSize: mob ? 14 : 16, color: C.text2, lineHeight: 1.5, margin: "0 auto 24px", maxWidth: 460 }}>
              7 quick questions. Get your health score and the single biggest thing holding your business back. No email required to start.
            </p>
            <button onClick={() => setStep("questions")} style={{
              background: `linear-gradient(180deg, ${C.goldLight}, ${C.gold} 50%, ${C.goldMuted})`,
              color: C.bgDeep, fontFamily: "'DM Sans',sans-serif", fontWeight: 600, fontSize: 15, letterSpacing: "0.02em",
              padding: "14px 32px", borderRadius: 12, border: "none", cursor: "pointer",
              boxShadow: `0 8px 24px ${C.gold}40, inset 0 1px 0 rgba(255,255,255,0.3)`, transition: "all 0.25s",
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 12px 32px ${C.gold}55, inset 0 1px 0 rgba(255,255,255,0.3)`; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = `0 8px 24px ${C.gold}40, inset 0 1px 0 rgba(255,255,255,0.3)`; }}>
              Start Assessment →
            </button>
            <div style={{ marginTop: 16, display: "flex", justifyContent: "center", gap: 18, flexWrap: "wrap" }}>
              {["90 seconds", "7 questions", "Confidential"].map((t, i) => (
                <span key={i} style={{ fontSize: 12, color: C.text3 }}>{t}</span>
              ))}
            </div>
          </div>
        )}

        {step === "questions" && MA_QUESTIONS[currentQ] && (
          <div style={{ width: "100%" }}>
            <div style={{ textAlign: "center", marginBottom: 16 }}>
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: C.gold, textTransform: "uppercase" }}>Question {currentQ + 1} of {MA_QUESTIONS.length}</span>
            </div>
            <MA_Glass glow={C.gold} style={{ padding: mob ? "22px 20px" : "30px 30px" }}>
              <div style={{ position: "absolute", top: 0, left: "10%", width: "80%", height: 3, background: `linear-gradient(90deg, transparent, ${C.gold}, transparent)`, opacity: 0.5 }}/>
              <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: mob ? 19 : 24, fontWeight: 700, color: C.text1, lineHeight: 1.2, margin: "0 0 8px" }}>
                {MA_QUESTIONS[currentQ].question}
              </h2>
              {MA_QUESTIONS[currentQ].subtitle && (
                <p style={{ fontSize: 13, color: C.text3, margin: "0 0 18px", lineHeight: 1.5, fontStyle: "italic" }}>
                  {MA_QUESTIONS[currentQ].subtitle}
                </p>
              )}
              <div style={{ display: "grid", gap: 9 }}>
                {MA_QUESTIONS[currentQ].options.map((opt, i) => {
                  const optValue = opt.value !== undefined ? opt.value : opt.label;
                  const isSelected = answers[MA_QUESTIONS[currentQ].id] === optValue;
                  return (
                    <button key={i} onClick={() => handleAnswer(MA_QUESTIONS[currentQ].id, optValue)}
                      style={{
                        display: "flex", alignItems: "center", gap: 12,
                        padding: mob ? "11px 14px" : "13px 18px", borderRadius: 12,
                        background: isSelected ? `${C.gold}12` : "rgba(255,255,255,0.02)",
                        border: `1px solid ${isSelected ? `${C.gold}40` : C.border1}`,
                        cursor: "pointer", transition: "all 0.2s cubic-bezier(0.4,0,0.2,1)",
                        textAlign: "left", fontFamily: "'DM Sans',sans-serif",
                      }}
                      onMouseEnter={e => { if (!isSelected) { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.border = `1px solid ${C.gold}25`; e.currentTarget.style.transform = "translateX(4px)"; } }}
                      onMouseLeave={e => { if (!isSelected) { e.currentTarget.style.background = "rgba(255,255,255,0.02)"; e.currentTarget.style.border = `1px solid ${C.border1}`; e.currentTarget.style.transform = "none"; } }}>
                      <div style={{ width: 20, height: 20, borderRadius: "50%", flexShrink: 0, border: `1.5px solid ${isSelected ? C.gold : C.text3}`, background: isSelected ? C.gold : "transparent", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}>
                        {isSelected && (
                          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                            <path d="M2 5L4 7L8 3" stroke="#0A0E14" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </div>
                      <span style={{ fontSize: 14, color: isSelected ? C.text1 : C.text2, fontWeight: isSelected ? 600 : 400, flex: 1 }}>{opt.label}</span>
                    </button>
                  );
                })}
              </div>
              {currentQ > 0 && (
                <button onClick={() => setCurrentQ(currentQ - 1)} style={{ marginTop: 14, fontSize: 12, color: C.text3, background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, fontFamily: "inherit" }}>
                  ← Previous question
                </button>
              )}
            </MA_Glass>
          </div>
        )}

        {step === "calculating" && (
          <div style={{ textAlign: "center" }}>
            <div style={{ width: 56, height: 56, borderRadius: "50%", border: `3px solid ${C.gold}20`, borderTopColor: C.gold, margin: "0 auto 18px", animation: "spin 1s linear infinite" }}/>
            <p style={{ fontSize: 14, color: C.text2, margin: 0 }}>Analyzing your business...</p>
            <p style={{ fontSize: 12, color: C.text4, margin: "6px 0 0" }}>Calculating across 6 categories</p>
          </div>
        )}

        {step === "result" && resultData && constraint && (
          <div style={{ width: "100%" }}>
            <div style={{ textAlign: "center", marginBottom: 18 }}>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, color: C.gold, textTransform: "uppercase" }}>Your Preliminary Health Score</span>
              <div style={{ margin: "12px auto 10px", display: "inline-block" }}>
                <MA_ScoreRing score={displayScore} color={scoreColor} size={mob ? 130 : 160} stroke={mob ? 10 : 12}/>
              </div>
              <div style={{ display: "inline-block", padding: "4px 14px", borderRadius: 6, background: `${scoreColor}12`, border: `1px solid ${scoreColor}25` }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: scoreColor, letterSpacing: 1, textTransform: "uppercase" }}>{scoreLabel}</span>
              </div>
            </div>
            <MA_Glass glow={constraintColor} style={{ padding: mob ? "18px 18px" : "22px 22px", marginBottom: 12 }}>
              <div style={{ position: "absolute", top: 0, left: "10%", width: "80%", height: 3, background: `linear-gradient(90deg, transparent, ${constraintColor}, transparent)` }}/>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, color: constraintColor, textTransform: "uppercase" }}>Your #1 Constraint</span>
              <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: mob ? 21 : 26, fontWeight: 700, color: C.text1, margin: "4px 0 10px", textShadow: `0 0 20px ${constraintColor}20` }}>
                {constraint.name}
              </h3>
              <p style={{ fontSize: 13, color: C.text2, lineHeight: 1.6, margin: "0 0 10px" }}>{constraint.teaser}</p>
              <div style={{ padding: "8px 12px", borderRadius: 8, background: `${constraintColor}08`, border: `1px solid ${constraintColor}15` }}>
                <span style={{ fontSize: 10.5, fontWeight: 700, color: constraintColor, textTransform: "uppercase", letterSpacing: 0.8 }}>The full roadmap: </span>
                <span style={{ fontSize: 12, color: C.text2 }}>root causes, three immediate moves, your 90-day action checklist, and industry benchmarks — unlocked next.</span>
              </div>
            </MA_Glass>
            {!emailSubmitted ? (
              <MA_Glass glow={C.gold} style={{ padding: mob ? "18px 18px" : "22px 22px" }}>
                <div style={{ position: "absolute", top: 0, left: "10%", width: "80%", height: 3, background: `linear-gradient(90deg, transparent, ${C.gold}, transparent)` }}/>
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, color: C.gold, textTransform: "uppercase" }}>Unlock The Full Roadmap</span>
                <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: mob ? 18 : 22, fontWeight: 700, color: C.text1, margin: "6px 0 10px", lineHeight: 1.2 }}>
                  Get your 15-page personalized PDF.
                </h3>
                <p style={{ fontSize: 12.5, color: C.text2, margin: "0 0 14px", lineHeight: 1.55 }}>
                  Includes the root causes behind your constraint, three immediate moves scoped to your revenue tier, a 90-day action checklist, and industry benchmarks for businesses your size.
                </p>
                <div style={{ display: "flex", gap: 8, flexDirection: mob ? "column" : "row" }}>
                  <input type="email" placeholder="your@email.com" value={email}
                    onChange={e => { setEmail(e.target.value); if (submitError) setSubmitError(""); }}
                    onKeyDown={e => e.key === "Enter" && !submitting && handleEmailSubmit()}
                    disabled={submitting}
                    style={{ flex: 1, padding: "12px 16px", borderRadius: 10, background: C.bgDeep, border: `1px solid ${submitError ? C.red + "60" : C.border2}`, color: C.text1, fontSize: 14, fontFamily: "inherit", outline: "none", transition: "all 0.2s", opacity: submitting ? 0.6 : 1 }}
                    onFocus={e => { if (!submitError) e.target.style.borderColor = `${C.gold}40`; }}
                    onBlur={e => { if (!submitError) e.target.style.borderColor = C.border2; }}/>
                  <button onClick={handleEmailSubmit} disabled={submitting} style={{
                    background: `linear-gradient(180deg, ${C.goldLight}, ${C.gold} 50%, ${C.goldMuted})`,
                    color: C.bgDeep, fontWeight: 600, fontSize: 14, letterSpacing: "0.02em",
                    padding: "12px 22px", borderRadius: 10, border: "none",
                    cursor: submitting ? "not-allowed" : "pointer",
                    boxShadow: `0 8px 24px ${C.gold}40, inset 0 1px 0 rgba(255,255,255,0.3)`,
                    fontFamily: "inherit", whiteSpace: "nowrap", opacity: submitting ? 0.7 : 1,
                    display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, minWidth: 150,
                  }}>
                    {submitting ? (
                      <>
                        <span style={{ width: 14, height: 14, borderRadius: "50%", border: `2px solid rgba(10,14,20,0.25)`, borderTopColor: "#0A0E14", animation: "spin 0.8s linear infinite", display: "inline-block" }}/>
                        Sending...
                      </>
                    ) : <>Get My Roadmap →</>}
                  </button>
                </div>
                {submitError && <p style={{ fontSize: 12, color: C.red, margin: "10px 0 0", textAlign: "center", fontWeight: 500 }}>{submitError}</p>}
                <p style={{ fontSize: 11, color: C.text4, margin: "10px 0 0", textAlign: "center" }}>No spam. Unsubscribe anytime. Your data stays with you.</p>
              </MA_Glass>
            ) : (
              <MA_Glass glow={C.green} style={{ padding: mob ? "20px 18px" : "24px 24px", textAlign: "center" }}>
                <div style={{ width: 48, height: 48, borderRadius: "50%", background: `${C.green}12`, border: `1.5px solid ${C.green}30`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                    <path d="M5 11L9 15L17 7" stroke={C.green} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 22, fontWeight: 700, color: C.text1, margin: "0 0 8px" }}>
                  Your roadmap is on its way.
                </h3>
                <p style={{ fontSize: 13, color: C.text2, margin: "0 0 4px", lineHeight: 1.5 }}>
                  We've sent the full 15-page diagnostic to <span style={{ color: C.text1, fontWeight: 600 }}>{email}</span>.
                </p>
              </MA_Glass>
            )}
            <div style={{ textAlign: "center", marginTop: 16 }}>
              <button onClick={handleRestart} style={{ fontSize: 12, color: C.text4, background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}>
                Take the assessment again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
