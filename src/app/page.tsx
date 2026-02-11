import Navbar from "@/components/ui/Navbar";
import Hero from "@/components/sections/Hero";
import VideoRecap from "@/components/sections/VideoRecap";
import PhotoGallery from "@/components/sections/PhotoGallery";
import EventSchedule from "@/components/sections/EventSchedule";
import AddToCalendar from "@/components/sections/AddToCalendar";
import Footer from "@/components/sections/Footer";
import Starfield from "@/components/ui/Starfield";
import GrainOverlay from "@/components/ui/GrainOverlay";
import IntroVideo from "@/components/ui/IntroVideo";
import SectionDivider from "@/components/ui/SectionDivider";

export default function Home() {
  return (
    <>
      <Starfield />
      <Navbar />
      <main className="relative z-10">
        <Hero />
        <SectionDivider variant="geometric" />
        <VideoRecap />
        <SectionDivider variant="stars" />
        <PhotoGallery />
        <SectionDivider variant="wave" />
        <EventSchedule />
        <SectionDivider variant="geometric" />
        <AddToCalendar />
      </main>
      <Footer />
      <GrainOverlay />
      <IntroVideo />
    </>
  );
}
