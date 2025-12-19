import { ReactLenis } from "lenis/react";
import dynamic from "next/dynamic";
const EllipseCollapsibleHeader = dynamic(
  () => import("./components/EllipseCollapsibleHeader")
);

export default function Home() {
  return (
    <>
      <ReactLenis root />
      <EllipseCollapsibleHeader />
      <div className="h-[300vh] bg-pink">section</div>
    </>
  );
}
