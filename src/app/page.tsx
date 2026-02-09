import Navbar from "@/components/ui/Navbar";
import Hero from "@/components/sections/Hero";
import VideoRecap from "@/components/sections/VideoRecap";
import PhotoGallery from "@/components/sections/PhotoGallery";
import EventSchedule from "@/components/sections/EventSchedule";
import AddToCalendar from "@/components/sections/AddToCalendar";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <VideoRecap />
        <PhotoGallery />
        <EventSchedule />
        <AddToCalendar />
      </main>
      <Footer />
    </>
  );
}
