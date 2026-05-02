import { CategoryTabs } from "@/components/home/CategoryTabs";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { VideoSkeleton } from "@/components/video/VideoSkeleton";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="mx-auto flex w-full max-w-8xl gap-6 px-4 py-6 sm:px-6">
        <Sidebar />
        <section className="flex-1">
          <CategoryTabs />
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 9 }).map((_, index) => (
              <VideoSkeleton key={index} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
