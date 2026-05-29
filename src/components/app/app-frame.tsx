import { cn } from "@/lib/utils";

export function AppFrame({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("min-h-screen w-full bg-background text-foreground", className)}>
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-24 left-1/2 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,oklch(0.77_0.17_165/0.18),transparent_60%)] blur-2xl" />
        <div className="absolute -bottom-28 left-1/3 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,oklch(0.73_0.2_15/0.14),transparent_60%)] blur-2xl" />
        <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(to_right,oklch(1_0_0/0.18)_1px,transparent_1px),linear-gradient(to_bottom,oklch(1_0_0/0.18)_1px,transparent_1px)] [background-size:52px_52px]" />
      </div>
      <div className="relative mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">{children}</div>
    </div>
  );
}

