import Navbar from "@/components/ui/Navbar";
import Hero from "@/components/sections/Hero";
import VideoRecap from "@/components/sections/VideoRecap";
import PhotoGallery from "@/components/sections/PhotoGallery";
import EventSchedule from "@/components/sections/EventSchedule";
import AddToCalendar from "@/components/sections/AddToCalendar";
import Footer from "@/components/sections/Footer";
import GrainOverlay from "@/components/ui/GrainOverlay";
import IntroCover from "@/components/ui/IntroCover";
import IntroVideoLoader from "@/components/ui/IntroVideoLoader";
import BackgroundImage from "@/components/ui/BackgroundImage";

export default function Home() {
  return (
    <>
      <BackgroundImage />
      <Navbar />
      <main className="relative z-10">
        <Hero />
        <VideoRecap />
        <PhotoGallery />
        <EventSchedule />
        <AddToCalendar />
      </main>
      <Footer />
      <GrainOverlay />
      <IntroCover />
      <IntroVideoLoader />
    </>
  );
}
