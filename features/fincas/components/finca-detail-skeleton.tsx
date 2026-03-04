import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function FincaDetailSkeleton() {
  return (
    <div className="animate-in fade-in duration-500">
      <div className="px-0 md:px-12 lg:px-20">
        {/* Gallery Skeleton */}
        <section className="md:pt-14 pb-8">
          <div className="container mx-auto px-0 md:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-auto lg:h-[70vh]">
              {/* Main Image Skeleton */}
              <div className="lg:col-span-2 h-[60vh] lg:h-full relative rounded-none md:rounded-2xl overflow-hidden bg-muted">
                <Skeleton className="w-full h-full" />
              </div>
              {/* Secondary Image/Video Skeleton */}
              <div className="hidden lg:block lg:col-span-1 h-full relative rounded-2xl overflow-hidden bg-muted">
                <Skeleton className="w-full h-full" />
              </div>
            </div>
          </div>
        </section>

        {/* Content Skeleton */}
        <section className="md:pb-10 relative max-md:z-40 -mt-14 max-md:bg-white rounded-t-3xl md:rounded-none md:mt-0">
          <div className="container mx-auto px-0 md:px-6 lg:px-6">
            <div className="grid lg:grid-cols-3 max-lg:gap-10">
              {/* Main Info Skeleton */}
              <div className="lg:col-span-2 lg:mr-10">
                <div className="py-6 max-md:px-5 max-md:pt-8 md:p-0">
                  {/* Title */}
                  <Skeleton className="h-10 md:h-14 w-3/4 mb-6 rounded-lg" />

                  {/* Badges */}
                  <div className="flex flex-wrap items-center gap-3 mb-8 mt-2 md:mt-8">
                    <Skeleton className="h-6 w-20 rounded-full" />
                    <Skeleton className="h-6 w-32 rounded-full" />
                    <Skeleton className="h-6 w-28 rounded-full" />
                  </div>

                  {/* Description */}
                  <div className="space-y-3 mb-8 max-md:px-3">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-4 w-4/6" />
                  </div>

                  <Skeleton className="h-px w-full my-8 bg-muted" />

                  {/* Features */}
                  <div className="mb-12 max-md:px-3">
                    <Skeleton className="h-7 w-48 mb-6" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
                      {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="flex items-center gap-4">
                          <Skeleton className="w-10 h-10 rounded-lg shrink-0" />
                          <Skeleton className="h-5 w-32" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Booking Card Skeleton */}
              <div className="lg:col-span-1 max-md:px-3 md:ml-4">
                <div className="sticky top-28 bg-white border border-border/40 rounded-xl p-6 shadow-sm">
                  <div className="flex justify-between items-start mb-6">
                    <div className="space-y-2">
                      <Skeleton className="h-8 w-32" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                    <Skeleton className="h-6 w-24" />
                  </div>

                  <div className="space-y-4 mb-6">
                    <Skeleton className="h-12 w-full rounded-xl" />
                    <Skeleton className="h-12 w-full rounded-xl" />
                  </div>

                  <Skeleton className="h-12 w-full rounded-lg mb-4" />

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-28" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                    <Skeleton className="h-px w-full my-4 bg-muted" />
                    <div className="flex justify-between">
                      <Skeleton className="h-6 w-24" />
                      <Skeleton className="h-6 w-24" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
