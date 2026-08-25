export interface DeviceInfo {
  isMobile: boolean;
  isDesktop: boolean;
  os: "windows" | "mac" | "linux" | "ios" | "android" | "chromeos" | "other";
  osName: string;
  deviceType: "mobile" | "tablet" | "desktop";
}

export function detectDevice(): DeviceInfo {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return {
      isMobile: false,
      isDesktop: true,
      os: "other",
      osName: "Unknown",
      deviceType: "desktop",
    };
  }

  const ua = navigator.userAgent || "";
  const platform =
    (navigator as Navigator & { userAgentData?: { platform?: string } })
      .userAgentData?.platform ||
    navigator.platform ||
    "";

  // 1. Detect OS
  const isIOS =
    /iPad|iPhone|iPod/.test(ua) ||
    (platform === "MacIntel" && navigator.maxTouchPoints > 1);

  const isAndroid = /Android/i.test(ua);
  const isWindows =
    /Windows|Win32|Win64|WOW64/i.test(ua) || /Win/i.test(platform);
  const isMac =
    (/Macintosh|MacIntel|MacPPC|Mac68K/i.test(ua) || /Mac/i.test(platform)) &&
    !isIOS;
  const isCrOS = /CrOS/i.test(ua);
  const isLinux =
    (/Linux/i.test(ua) || /Linux/i.test(platform)) && !isAndroid && !isCrOS;

  let os: DeviceInfo["os"] = "other";
  let osName = "Desktop System";

  if (isIOS) {
    os = "ios";
    osName = "Apple iOS";
  } else if (isAndroid) {
    os = "android";
    osName = "Android OS";
  } else if (isWindows) {
    os = "windows";
    osName = "Windows PC";
  } else if (isMac) {
    os = "mac";
    osName = "macOS";
  } else if (isLinux) {
    os = "linux";
    osName = "Linux OS";
  } else if (isCrOS) {
    os = "chromeos";
    osName = "ChromeOS";
  }

  // 2. Detect Mobile vs Desktop
  const isMobileUA =
    /Mobile|Android|iP(hone|od|ad)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/i.test(
      ua
    );

  const isTouchScreen =
    ("ontouchstart" in window || navigator.maxTouchPoints > 0) &&
    window.matchMedia("(pointer: coarse)").matches;

  const isSmallScreen = window.innerWidth < 1024;

  const isMobile =
    isIOS || isAndroid || isMobileUA || (isTouchScreen && isSmallScreen);
  const isDesktop =
    !isMobile &&
    (isWindows || isMac || isLinux || isCrOS || window.innerWidth >= 1024);

  const deviceType: DeviceInfo["deviceType"] = isMobile
    ? window.innerWidth >= 768
      ? "tablet"
      : "mobile"
    : "desktop";

  return {
    isMobile,
    isDesktop,
    os,
    osName,
    deviceType,
  };
}
