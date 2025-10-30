import { useScroll } from 'framer-motion';
// @mui
// components
import ScrollProgress from 'src/components/scroll-progress';
//
import HomeHero from '../home-hero';
import HomeWhyChooseIssuerPro from '../home-why-choose-issuer-pro';
import HomeGetStarted from '../home-get-started';
// ----------------------------------------------------------------------

export default function HomeView() {
  const { scrollYProgress } = useScroll();

  return (
    <>
      <ScrollProgress scrollYProgress={scrollYProgress} />

      <HomeHero />
      <HomeWhyChooseIssuerPro />
      <HomeGetStarted />
    </>
  );
}
