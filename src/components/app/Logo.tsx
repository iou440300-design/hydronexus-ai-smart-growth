import logo from "@/assets/logo.png";

export function Logo({ size = 32, className = "" }: { size?: number; className?: string }) {
  return (
    <img
      src={logo}
      alt="HydroNexus AI"
      width={size}
      height={size}
      className={className}
      loading="eager"
      style={{ width: size, height: size }}
    />
  );
}
