import Hero from "@/components/Hero";
import Listings from "@/components/Listings";
import Testimonials from "@/components/Testimonials";
import WhyChooseUs from "@/components/WhyChooseUs";

const page = () => {
  return (
    <>
      <Hero />
      <WhyChooseUs />
      <Listings />
      <Testimonials />
    </>
  );
};
export default page;
