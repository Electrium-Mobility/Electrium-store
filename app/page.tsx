import { Suspense } from "react";
import PageContent from "./PageContent";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function Home() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center h-screen"><LoadingSpinner size="lg" /></div>}>
      <PageContent />
    </Suspense>
  );
}
