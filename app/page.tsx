import { Suspense } from "react";
import PageContent from "./PageContent";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function Home() {
  return (
    <Suspense fallback={<LoadingSpinner size="lg" color="primary" />}>
      <PageContent />
    </Suspense>
  );
}
