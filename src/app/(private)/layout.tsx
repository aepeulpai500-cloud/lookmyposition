import { AppFrame } from "@/components/app/app-frame";

export default function PrivateLayout({ children }: { children: React.ReactNode }) {
  return <AppFrame>{children}</AppFrame>;
}

