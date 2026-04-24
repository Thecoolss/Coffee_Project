import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export function PhoneFrame({ children }: Props) {
  return (
    <div
      className="min-h-screen w-full md:flex md:items-center md:justify-center md:py-10"
      style={{
        background:
          "radial-gradient(60% 60% at 20% 10%, rgba(181,105,26,0.18) 0%, rgba(0,0,0,0) 60%), radial-gradient(60% 60% at 80% 90%, rgba(77,38,21,0.35) 0%, rgba(0,0,0,0) 55%), linear-gradient(160deg, #141010 0%, #0b0908 100%)"
      }}
    >
      <div className="relative w-full md:w-[400px] md:h-[860px] md:rounded-[3rem] md:border-[10px] md:border-[#0a0807] md:shadow-[0_50px_120px_-30px_rgba(0,0,0,0.85),0_0_0_1px_rgba(255,255,255,0.04)] md:overflow-hidden">
        <div className="pointer-events-none hidden md:block absolute left-1/2 top-0 z-30 h-7 w-36 -translate-x-1/2 rounded-b-2xl bg-[#0a0807]" />
        <div className="pointer-events-none hidden md:flex absolute top-1.5 left-0 right-0 z-40 items-center justify-between px-10 text-[11px] font-semibold text-mocha-900/90">
          <span>9:41</span>
          <span className="flex items-center gap-1">
            <span className="inline-block h-2 w-2 rounded-full bg-mocha-900/80" />
            <span className="inline-block h-2 w-2 rounded-full bg-mocha-900/80" />
            <span className="inline-block h-2 w-2 rounded-full bg-mocha-900/80" />
          </span>
        </div>
        {children}
      </div>
    </div>
  );
}
