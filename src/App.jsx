import BilaoPackages from './components/BilaoPackages'
import Contact from './components/Contact'
import Footer from './components/Footer'
import Hero from './components/Hero'
import HowToBook from './components/HowToBook'
import { IconSprite } from './components/Icons'
import InquiryForm from './components/InquiryForm'
import Navbar from './components/Navbar'
import PackedMeals from './components/PackedMeals'
import PartyPackages from './components/PartyPackages'
import StickyMobileBar from './components/StickyMobileBar'
import TrayMenu from './components/TrayMenu'
import useReveal from './hooks/useReveal'

export default function App() {
  useReveal()

  return (
    <>
      <a
        href="#main"
        className="fixed top-2 left-2 z-[200] -translate-y-[150%] rounded-[10px] bg-forest px-4 py-3 font-bold text-white no-underline transition-transform focus:translate-y-0"
      >
        Skip to main content
      </a>

      <IconSprite />
      <Navbar />

      <main id="main">
        <Hero />
        <PartyPackages />
        <TrayMenu />
        <BilaoPackages />
        <PackedMeals />
        <HowToBook />
        <InquiryForm />
        <Contact />
      </main>

      <Footer />
      <StickyMobileBar />
    </>
  )
}
