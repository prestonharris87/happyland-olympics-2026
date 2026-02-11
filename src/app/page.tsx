import Navbar from "@/components/ui/Navbar";
import Hero from "@/components/sections/Hero";
import VideoRecap from "@/components/sections/VideoRecap";
import PhotoGallery from "@/components/sections/PhotoGallery";
import EventSchedule from "@/components/sections/EventSchedule";
import AddToCalendar from "@/components/sections/AddToCalendar";
import Footer from "@/components/sections/Footer";
import Starfield from "@/components/ui/Starfield";
import GrainOverlay from "@/components/ui/GrainOverlay";
import IntroVideoLoader from "@/components/ui/IntroVideoLoader";
import SectionDivider from "@/components/ui/SectionDivider";
import BackgroundImage from "@/components/ui/BackgroundImage";

export default function Home() {
  return (
    <>
      <BackgroundImage />
      <Starfield />
      <Navbar />
      <main className="relative z-10">
        <Hero />
        <VideoRecap />
        <PhotoGallery />
        <SectionDivider variant="wave" />
        <EventSchedule />
        <SectionDivider variant="geometric" />
        <AddToCalendar />
      </main>
      <Footer />
      <GrainOverlay />
      <IntroVideoLoader />
    </>
  );
}
