import { useScroll } from 'framer-motion';
// @mui
// components
import ScrollProgress from 'src/components/scroll-progress';
//
import HomeHero from '../home-hero';

// ----------------------------------------------------------------------

export default function HomeView() {
  const { scrollYProgress } = useScroll();

  return (
    <>
      <ScrollProgress scrollYProgress={scrollYProgress} />

      <HomeHero />
    </>
  );
}
