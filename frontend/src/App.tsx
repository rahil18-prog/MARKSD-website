import { useState, useEffect, useRef, useCallback } from 'react'
import Hls from 'hls.js'
import { Link, Route, Routes, useLocation, useParams } from 'react-router-dom'
import marksdLogo from './imports/log_MARKSD.jpeg'
import hyrusHero from "./assets/images/hyrus/hero.webp";
import hyrusProcessing from "./assets/images/hyrus/processing.webp";
import hyrusWarehouse from "./assets/images/hyrus/warehouse.webp";
import hyrusRecycling from "./assets/images/hyrus/recycling.webp";
// ─── Types ────────────────────────────────────────────────────────────────────

interface Company {
  id: string
  slug: string
  name: string
  fullName: string
  category: string
  intro: string
  overview: string
  industriesServed: string[]
  mission: string
  expertise: string
  services: { title: string; description: string }[]
  description: string
  image: string
  location?: string
  tags: string[]
  gallery?: string[]
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const COMPANIES: Company[] = [
  {
    id: 'dmt',
    slug: 'atlas-marketing-and-strategy',
    name: 'DMT',
    fullName: 'Digital Meister Technologies Pvt. Ltd.',
    category: 'Digital Transformation',
    intro: 'A strategic digital growth partner for modern enterprises.',
    overview: 'DMT delivers integrated marketing, technology, and automation programs that help businesses improve demand generation, customer acquisition, and brand authority.',
    industriesServed: ['Technology', 'Professional Services', 'Consumer Brands', 'Industrial Businesses'],
    mission: 'To drive measurable business growth through disciplined digital strategy and execution.',
    expertise: 'Cross-channel marketing strategy, web platforms, automation workflows, and analytics-led performance optimization.',
    services: [
      { title: 'Digital Marketing Strategy', description: 'Integrated planning across SEO, paid media, and omnichannel campaigns.' },
      { title: 'Web & Experience Development', description: 'Corporate websites and conversion-focused digital touchpoints.' },
      { title: 'Performance Marketing', description: 'Data-driven campaign management focused on qualified pipeline growth.' },
      { title: 'Automation & AI Workflows', description: 'Operational automation solutions to improve speed and efficiency.' },
    ],
    description:
      'Digital marketing, branding, website development, SEO, performance marketing, offline marketing, consulting, AI solutions, automation and business growth.',
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=600&fit=crop&auto=format',
    tags: ['Digital Marketing', 'AI Solutions', 'Branding'],
  },
  {
    id: 'barrels',
    slug: 'mm-barrels-industry',
    name: 'MM Barrels Industry',
    fullName: 'MM Barrels Industry',
    category: 'Industrial Manufacturing',
    intro: 'Industrial packaging manufacturing built for quality and reliability.',
    overview: 'MM Barrels Industry manufactures high-standard barrel and packaging solutions for demanding industrial applications across India.',
    industriesServed: ['Chemicals', 'Agri Inputs', 'Industrial Goods', 'Processing Units'],
    mission: 'To deliver dependable industrial packaging that supports safe and efficient operations.',
    expertise: 'Precision fabrication, production consistency, and scalable packaging supply.',
    services: [
      { title: 'MS Barrel Manufacturing', description: 'Production of mild steel and tight-head barrels for industrial applications.' },
      { title: 'Industrial Packaging Supply', description: 'Bulk packaging support for manufacturing and process industries.' },
      { title: 'Custom Specifications', description: 'Tailored dimensions and packaging formats based on operational requirements.' },
      { title: 'Regional Distribution', description: 'Reliable fulfillment and logistics support across India.' },
    ],
    description:
      'Premier manufacturer of Mild Steel Barrels, Tight Head MS Barrels, and Industrial Packaging Solutions serving diverse industries across India.',
    image: 'https://images.unsplash.com/photo-1720036236855-9a1a2e4d3f26?w=800&h=600&fit=crop&auto=format',
    location: 'Chittoor, Andhra Pradesh',
    tags: ['MS Barrels', 'Industrial Packaging', 'Manufacturing'],
  },
  {
    id: 'pureterra',
    slug: 'ma-pureterra',
    name: 'MA PureTerra',
    fullName: 'MA PureTerra',
    category: 'Food Processing & Exports',
    intro: 'Premium food processing and spice trade operations.',
    overview: 'MA PureTerra processes and supplies high-quality spices and value-added agricultural products with a strong focus on quality systems and supply reliability.',
    industriesServed: ['Food Processing', 'Retail Supply', 'Export Trade', 'Hospitality'],
    mission: 'To deliver trusted quality in food ingredients through disciplined sourcing and processing.',
    expertise: 'Spice processing, quality grading, export readiness, and supply chain coordination.',
    services: [
      { title: 'Spice Processing', description: 'Processing and grading of premium Indian spices for consistent quality.' },
      { title: 'Essential Oils & Extracts', description: 'Production support for oils, natural extracts, and food powders.' },
      { title: 'Bulk Supply Programs', description: 'Volume supply contracts with dependable fulfillment cycles.' },
      { title: 'Trade & Export Coordination', description: 'Structured export operations and partner shipment coordination.' },
    ],
    description:
      'Premium Indian spices, essential oils, dehydrated vegetables, food powders, and natural extracts serving clients across India while expanding international trade partnerships.',
    image: 'https://images.unsplash.com/photo-1486548730767-5c679e8eda6b?w=800&h=600&fit=crop&auto=format',
    tags: ['Spices', 'Essential Oils', 'Export Trade'],
  },
  {
    id: 'interiors',
    slug: 'hyrus-interiors-constructions',
    name: 'HYRUS Interiors',
    fullName: 'HYRUS Interiors & Constructions',
    category: 'Architecture & Design',
    intro: 'End-to-end architecture and construction delivery.',
    overview: 'HYRUS Interiors & Constructions provides integrated design, architectural planning, and execution for premium residential and commercial projects.',
    industriesServed: ['Residential', 'Commercial', 'Hospitality', 'Corporate Offices'],
    mission: 'To execute thoughtfully designed spaces with high quality and long-term value.',
    expertise: 'Architectural planning, interior execution, project coordination, and material sourcing.',
    services: [
      { title: 'Architectural Planning', description: 'Design planning aligned to functionality, aesthetics, and efficiency.' },
      { title: 'Interior Design Execution', description: 'Detailed interior development with premium material standards.' },
      { title: 'Construction Management', description: 'Coordinated on-site execution with quality and timeline governance.' },
      { title: '3D Design Visualization', description: 'High-clarity concept visualization for design decision-making.' },
    ],
    description:
      'Architecture, interior design, construction, and material supply for commercial and residential projects with 3D visualization and luxury execution.',
    image: 'https://images.unsplash.com/photo-1715593949273-09009558300a?w=800&h=600&fit=crop&auto=format',
    tags: ['Architecture', 'Interior Design', 'Construction'],
  },
  {
    id: 'trade',
    slug: 'marksd-global-trade',
    name: 'MARKSD Global Trade',
    fullName: 'MARKSD Global Trade',
    category: 'International Trade',
    intro: 'Structured sourcing and trade operations for business expansion.',
    overview: 'MARKSD Global Trade supports sourcing, procurement, and trade logistics for Indian and international business partners with disciplined operational execution.',
    industriesServed: ['Agri Commodities', 'Industrial Products', 'Distribution Networks', 'Trade Partnerships'],
    mission: 'To deliver dependable trade operations that enable sustainable market growth.',
    expertise: 'Sourcing strategy, vendor coordination, logistics planning, and shipment documentation support.',
    services: [
      { title: 'Strategic Sourcing', description: 'Supplier and product sourcing aligned to quality and commercial goals.' },
      { title: 'Import-Export Operations', description: 'Transaction and process management for structured trade execution.' },
      { title: 'Logistics Coordination', description: 'Shipment planning and movement support with delivery visibility.' },
      { title: 'Trade Compliance Support', description: 'Operational documentation and process discipline for smoother trade cycles.' },
    ],
    description:
      'Import-export operations covering Indian spices, agricultural products, and industrial goods through strategic sourcing and trade operations.',
    image: 'https://images.unsplash.com/photo-1724597500306-a4cbb7d1324e?w=800&h=600&fit=crop&auto=format',
    tags: ['Import Export', 'Logistics', 'Strategic Sourcing'],
  },
  {
    id: 'scrap',
    slug: 'hyrus-scrap-trading',
    name: 'HYRUS Scrap Trading',
    fullName: 'HYRUS Scrap Trading',
    category: 'Scrap Trading & Recycling',
    intro: 'Comprehensive scrap trading and metal recycling solutions for industrial clients.',
    overview: 'HYRUS Scrap Trading provides end-to-end scrap metal trading, processing, and recycling services. We connect industrial suppliers with manufacturers through efficient scrap collection, sorting, and supply chain management.',
    industriesServed: ['Steel Manufacturing', 'Foundries', 'Automotive', 'Construction', 'Industrial Recycling'],
    mission: 'To deliver sustainable scrap trading solutions that support circular economy and industrial efficiency.',
    expertise: 'Metal scrap trading, industrial sorting, quality inspection, bulk supply, and sustainable recycling operations.',
    services: [
      { title: 'Ferrous Scrap Trading', description: 'Supply of mild steel, carbon steel, and other ferrous scrap for manufacturing.' },
      { title: 'Non-Ferrous Scrap Trading', description: 'Copper, aluminum, brass, and specialty metal scrap for industrial use.' },
      { title: 'Industrial Scrap Collection', description: 'On-site collection and pickup services for manufacturing facilities.' },
      { title: 'Scrap Processing & Sorting', description: 'Professional metal sorting, grading, and preparation for recycling.' },
      { title: 'Bulk Scrap Supply', description: 'Volume supply programs for steel mills, foundries, and processing plants.' },
      { title: 'Recycling Solutions', description: 'Sustainable scrap management and circular economy support.' },
    ],
    description:
      'Ferrous and non-ferrous scrap trading, industrial scrap collection, metal sorting, processing, bulk supply, and sustainable recycling solutions for manufacturers and foundries.',
    image: hyrusHero,
    gallery: [
      hyrusProcessing,
      hyrusWarehouse,
      hyrusRecycling,
      hyrusProcessing,
    ],
    tags: ['Scrap Trading', 'Metal Recycling', 'Industrial Supply'],
  },
]

const INDUSTRIES = [
  { label: 'Digital', icon: 'digital' },
  { label: 'Manufacturing', icon: 'manufacturing' },
  { label: 'Food Processing', icon: 'food' },
  { label: 'Architecture', icon: 'architecture' },
  { label: 'Construction', icon: 'construction' },
  { label: 'Exports', icon: 'exports' },
  { label: 'Scrap Trading', icon: 'technology' },
  { label: 'Technology', icon: 'technology' },
]

const TIMELINE = [
  { stage: 'Foundation', label: 'MARKSD Group', desc: 'MARKSD Group of Companies established with a vision to build diversified business excellence.' },
  { stage: 'Expansion', label: 'HYRUS Interiors', desc: 'HYRUS Interiors & Construction launched to deliver premium architecture and construction projects.' },
  { stage: 'Digital Growth', label: 'Digital Meister', desc: 'Digital Meister Technologies established to drive strategic digital transformation.' },
  { stage: 'Manufacturing', label: 'MM Barrels', desc: 'MM Barrels Industry commenced operations in industrial packaging manufacturing.' },
  { stage: 'Food Processing', label: 'MA PureTerra', desc: 'MA PureTerra entered premium spice processing and export operations.' },
  { stage: 'Trade', label: 'HYRUS Scrap Trading', desc: 'HYRUS Scrap Trading & Supply launched for industrial scrap and recycling solutions.' },
  { stage: 'Future', label: 'Expansion', desc: 'Expanding into new sectors across India with plans for Chennai, Bengaluru, Hyderabad, Mumbai, and Delhi.' },
]

const STATS = [
  { value: '6+', label: 'Companies' },
  { value: '10+', label: 'Business Domains' },
  { value: '100+', label: 'Projects' },
  { value: 'India', label: 'Operations' },
]

const VALUES = [
  { title: 'Innovation', desc: 'Continuously evolving with technology and market demands to deliver cutting-edge solutions.' },
  { title: 'Integrity', desc: 'Building trust through transparency, ethical practices, and consistent delivery.' },
  { title: 'Sustainability', desc: 'Creating businesses that endure, respect the environment, and benefit communities.' },
  { title: 'Quality', desc: 'Uncompromising standards across every product, service, and interaction.' },
  { title: 'National Impact', desc: 'Delivering measurable value across India while building toward international expansion.' },
]

// ─── Loading Screen ────────────────────────────────────────────────────────────

function LoadingScreen({ done }: { done: boolean }) {
  return (
    <div className={`loading-overlay ${done ? 'hidden' : ''}`}>
      <div className="relative flex flex-col items-center gap-8">
        {/* Spinning ring around logo */}
        <div className="relative w-28 h-28 flex items-center justify-center">
          <div
            className="absolute inset-0 rounded-full border-2 border-transparent"
            style={{
              borderTopColor: '#C8A54B',
              borderRightColor: 'rgba(200,165,75,0.2)',
              animation: 'spin-slow 1.2s linear infinite',
            }}
          />
          <div
            className="absolute inset-2 rounded-full border border-transparent"
            style={{
              borderBottomColor: '#D9BE72',
              borderLeftColor: 'rgba(217,190,114,0.15)',
              animation: 'spin-slow 2s linear infinite reverse',
            }}
          />
          <img
            src={marksdLogo}
            alt="MARKSD Group of Companies"
            className="w-16 h-16 rounded-full object-contain bg-black/20 p-1"
            style={{ filter: 'drop-shadow(0 0 12px rgba(200,165,75,0.28))' }}
          />
        </div>

        {/* Dots */}
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full animate-dot"
              style={{ background: '#C8A54B', animationDelay: `${i * 0.25}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Navbar ────────────────────────────────────────────────────────────────────

function Navbar() {
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('home')

  useEffect(() => {
    if (location.pathname !== '/') return
    const handler = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [location.pathname])

  useEffect(() => {
    if (location.pathname !== '/') return
    const sectionIds = ['home', 'companies', 'industries', 'about', 'contact']
    const onScroll = () => {
      const offset = window.scrollY + 140
      let current = 'home'
      sectionIds.forEach((id) => {
        const el = document.getElementById(id)
        if (el && el.offsetTop <= offset) current = id
      })
      setActiveSection(current)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [location.pathname])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const links = ['Home', 'Companies', 'Industries', 'About', 'Contact']
  const isHome = location.pathname === '/'
  const resolveAnchor = (label: string) => {
    const hash = `#${label.toLowerCase()}`
    return isHome ? hash : `/${hash}`
  }

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{
          background: scrolled ? 'rgba(5,5,5,0.94)' : 'transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(200,165,75,0.18)' : 'none',
        }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center gap-3 group">
            <img
              src={marksdLogo}
              alt="MARKSD Group of Companies"
              className="w-10 h-10 rounded-lg object-contain bg-black/20 p-0.5"
              style={{ filter: 'drop-shadow(0 0 10px rgba(200,165,75,0.22))' }}
            />
            <div>
              <span style={{ fontFamily: 'Playfair Display, Cormorant Garamond, serif', fontWeight: 800, fontSize: 16, letterSpacing: '0.1em', color: '#F4F4F4' }}>
                MARKSD
              </span>
              <span
                style={{ display: 'block', fontSize: 9, letterSpacing: '0.25em', color: 'rgba(200,165,75,0.7)', marginTop: -2 }}
              >
                GROUP OF COMPANIES
              </span>
            </div>
          </a>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((l) => (
              <a
                key={l}
                href={resolveAnchor(l)}
                className="nav-link text-sm font-semibold transition-colors duration-200"
                style={{ color: activeSection === l.toLowerCase() && isHome ? '#C8A54B' : 'rgba(181,181,181,0.96)', letterSpacing: '0.03em' }}
                onMouseEnter={(e) => ((e.target as HTMLElement).style.color = '#C8A54B')}
                onMouseLeave={(e) => ((e.target as HTMLElement).style.color = activeSection === l.toLowerCase() && isHome ? '#C8A54B' : 'rgba(181,181,181,0.96)')}
              >
                {l}
              </a>
            ))}
          </div>

          {/* CTA */}
          <a
            href={resolveAnchor('Contact')}
            className="hidden md:flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold glass-cta glass-cta-primary"
          >
            Contact
          </a>

          {/* Hamburger */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-6 h-0.5 transition-all duration-300"
                style={{ background: '#C8A54B' }}
              />
            ))}
          </button>
        </div>
      </nav>

      {/* Mobile fullscreen menu */}
      <div
        className="fixed inset-0 z-40 flex flex-col items-center justify-center transition-all duration-500 md:hidden"
        style={{
          background: 'rgba(5,5,5,0.97)',
          backdropFilter: 'blur(24px)',
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? 'auto' : 'none',
        }}
      >
        <button
          className="absolute top-6 right-6 text-3xl"
          style={{ color: '#C8A54B' }}
          onClick={() => setMenuOpen(false)}
        >
          ×
        </button>
        <div className="flex flex-col items-center gap-8">
          {links.map((l, i) => (
            <a
              key={l}
              href={resolveAnchor(l)}
              className="text-2xl font-bold tracking-widest transition-colors duration-200"
              style={{ color: 'rgba(255,255,255,0.8)', animationDelay: `${i * 0.08}s` }}
              onClick={() => setMenuOpen(false)}
              onMouseEnter={(e) => ((e.target as HTMLElement).style.color = '#C8A54B')}
              onMouseLeave={(e) => ((e.target as HTMLElement).style.color = 'rgba(255,255,255,0.8)')}
            >
              {l.toUpperCase()}
            </a>
          ))}
        </div>
      </div>
    </>
  )
}

// ─── Hero ──────────────────────────────────────────────────────────────────────

function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    const src = 'https://stream.mux.com/tLkHO1qZoaaQOUeVWo8hEBeGQfySP02EPS02BmnNFyXys.m3u8'

    if (Hls.isSupported()) {
      const hls = new Hls({ enableWorker: false })
      hls.loadSource(src)
      hls.attachMedia(video)
      hls.on(Hls.Events.MANIFEST_PARSED, () => { video.play().catch(() => {}) })
      return () => hls.destroy()
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = src
      video.play().catch(() => {})
    }
  }, [])

  return (
    <section id="home" className="relative w-full min-h-[100svh] flex items-center overflow-hidden">
      {/* Video background */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        muted
        loop
        playsInline
        style={{ opacity: 0.6 }}
      />

      {/* Overlay 1: Left dark gradient */}
      <div
        className="absolute inset-0 z-10"
        style={{ background: 'linear-gradient(90deg, #050505 0%, transparent 60%)' }}
      />

      {/* Overlay 2: Bottom fade */}
      <div
        className="absolute inset-0 z-10"
        style={{ background: 'linear-gradient(180deg, transparent 50%, #050505 100%)' }}
      />

      {/* Top fade */}
      <div
        className="absolute inset-0 z-10"
        style={{ background: 'linear-gradient(180deg, rgba(5,5,5,0.66) 0%, transparent 20%)' }}
      />

      {/* Desktop grid lines */}
      <div className="absolute inset-0 z-10 hidden md:block pointer-events-none">
        {[25, 50, 75].map((p) => (
          <div
            key={p}
            className="absolute top-0 bottom-0 w-px"
            style={{ left: `${p}%`, background: 'rgba(200,165,75,0.15)' }}
          />
        ))}
      </div>

      {/* Gold ambient glow ellipse */}
      <div
        className="absolute z-10 pointer-events-none"
        style={{
          top: '40%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 700,
          height: 200,
          background: 'radial-gradient(ellipse, rgba(200,165,75,0.18) 0%, rgba(184,146,50,0.1) 40%, transparent 70%)',
          filter: 'blur(25px)',
        }}
      />

      {/* Floating glass card (centered, elevated) */}
      <div
        className="absolute z-20 pointer-events-none hidden lg:block"
        style={{
          top: '22%',
          right: '8%',
          width: 200,
          height: 200,
          transform: 'translateY(-50px)',
          animation: 'float 7s ease-in-out infinite',
        }}
      >
        <div
          className="w-full h-full rounded-2xl relative overflow-hidden"
          style={{
            background: 'rgba(15,15,15,0.72)',
            backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)',
            backgroundBlendMode: 'luminosity',
            boxShadow: 'inset 0 1px 1px rgba(217,190,114,0.18), 0 12px 28px rgba(0,0,0,0.34)',
          }}
        >
          {/* Premium gradient border */}
          <div
            className="absolute inset-0 rounded-2xl pointer-events-none"
            style={{
              padding: '1.4px',
              background: 'linear-gradient(180deg, rgba(217,190,114,0.28) 0%, rgba(15,15,15,0.86) 100%)',
              WebkitMask: 'linear-gradient(#F4F4F4 0 0) content-box, linear-gradient(#F4F4F4 0 0)',
              WebkitMaskComposite: 'xor',
              maskComposite: 'exclude',
            }}
          />
          <div className="flex flex-col items-center justify-center h-full gap-3 p-4">
            <img
              src={marksdLogo}
              alt="MARKSD Group of Companies"
              className="w-20 h-20 rounded-xl object-contain bg-black/20 p-1"
              style={{ filter: 'drop-shadow(0 0 12px rgba(200,165,75,0.24))' }}
            />
            <p style={{ fontSize: 10, letterSpacing: '0.2em', color: 'rgba(181,181,181,0.9)', textAlign: 'center' }}>
              ENTERPRISE GROUP
            </p>
            <p style={{ fontSize: 11, color: 'rgba(200,165,75,0.8)', textAlign: 'center', fontWeight: 600 }}>
              6+ Companies
            </p>
          </div>
        </div>
      </div>

      {/* Hero content */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 pt-24 md:pt-28 pb-14 md:pb-20 w-full">
        <div className="max-w-3xl">
        {/* Eyebrow */}
        <div className="flex items-center gap-3 mb-5 md:mb-6 fade-up" style={{ animationDelay: '0.2s' }}>
          <div className="w-2 h-2 rounded-full animate-dot" style={{ background: '#B89232' }} />
          <span
            style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.3em', color: '#B89232', textTransform: 'uppercase' }}
          >
            Diversified Business Group
          </span>
        </div>

        {/* Main heading */}
        <h1
          className="fade-up"
          style={{
            fontFamily: 'Playfair Display, Cormorant Garamond, serif',
            fontWeight: 800,
            fontSize: 'clamp(34px, 7vw, 80px)',
            lineHeight: 1.05,
            letterSpacing: '0.02em',
            textTransform: 'uppercase',
            color: '#F4F4F4',
            maxWidth: 780,
            animationDelay: '0.35s',
          }}
        >
          BUILDING TOMORROW
          <br />
          ACROSS INDUSTRIES<span style={{ color: '#B89232' }}>.</span>
        </h1>

        {/* Description */}
        <p
          className="fade-up mt-5 md:mt-6 max-w-xl"
          style={{
            fontFamily: 'Inter',
            fontSize: 16,
            lineHeight: 1.75,
            color: 'rgba(181,181,181,0.96)',
            animationDelay: '0.5s',
          }}
        >
          MARKSD Group of Companies is a diversified enterprise operating across multiple industries including construction, digital transformation, food processing, trade, manufacturing and industrial solutions.
          <br />
          <br />
          Each subsidiary operates independently while sharing MARKSD's commitment to quality, innovation and sustainable growth.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-8 md:mt-10 fade-up w-full sm:w-auto" style={{ animationDelay: '0.65s' }}>
          <a
            href="#companies"
            className="flex items-center justify-center gap-2 px-7 py-3.5 rounded-full font-semibold text-sm glass-cta glass-cta-primary w-full sm:w-auto"
          >
            Explore Companies
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 7h12M7 1l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
          <a
            href="#contact"
            className="flex items-center justify-center gap-2 px-7 py-3.5 rounded-full font-semibold text-sm glass-cta w-full sm:w-auto"
          >
            Contact
          </a>
        </div>

        {/* Stats bar */}
        <div
          className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 mt-10 md:mt-14 pt-7 md:pt-8 fade-up"
          style={{ borderTop: '1px solid rgba(200,165,75,0.2)', animationDelay: '0.8s' }}
        >
          {STATS.map((s) => (
            <div key={s.label} className="min-w-0">
              <p style={{ fontFamily: 'Playfair Display, Cormorant Garamond, serif', fontWeight: 800, fontSize: 28, color: '#C8A54B', lineHeight: 1 }}>{s.value}</p>
              <p style={{ fontSize: 12, color: 'rgba(181,181,181,0.84)', marginTop: 4, letterSpacing: '0.05em' }}>{s.label}</p>
            </div>
          ))}
        </div>
        </div>
      </div>
    </section>
  )
}

// ─── Company Card ──────────────────────────────────────────────────────────────

function CompanyCard({ company }: { company: Company }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [hovered, setHovered] = useState(false)

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const dx = (e.clientX - cx) / (rect.width / 2)
    const dy = (e.clientY - cy) / (rect.height / 2)
    setTilt({ x: dy * -8, y: dx * 8 })
  }, [])

  return (
    <div
      ref={cardRef}
      className="relative rounded-2xl overflow-hidden cursor-pointer group h-full flex flex-col"
      style={{
        background: 'rgba(22,22,22,0.72)',
        border: '1px solid rgba(200,165,75,0.18)',
        transform: hovered ? `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(1.02)` : 'perspective(1000px) rotateX(0) rotateY(0) scale(1)',
        transition: 'transform 0.15s ease, box-shadow 0.3s ease',
        boxShadow: hovered ? '0 20px 60px rgba(200,165,75,0.12), 0 0 0 1px rgba(200,165,75,0.1)' : 'none',
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setTilt({ x: 0, y: 0 }) }}
    >
      {/* Image */}
      <div className="relative h-52 overflow-hidden bg-neutral-900">
        <img
          src={company.image}
          alt={`${company.fullName} - ${company.category}`}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(180deg, transparent 40%, rgba(5,5,5,0.9) 100%)' }}
        />
        {/* Category badge */}
        <div
          className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold"
          style={{ background: 'rgba(200,165,75,0.15)', border: '1px solid rgba(200,165,75,0.25)', color: '#C8A54B', letterSpacing: '0.05em' }}
        >
          {company.category}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col h-full">
        <h3 style={{ fontFamily: 'Playfair Display, Cormorant Garamond, serif', fontWeight: 800, fontSize: 20, color: '#F4F4F4', marginBottom: 4 }}>
          {company.name}
        </h3>
        <p style={{ fontSize: 12, color: 'rgba(200,165,75,0.7)', marginBottom: 12, letterSpacing: '0.03em' }}>
          {company.fullName}
        </p>
        {company.location && (
          <p style={{ fontSize: 12, color: 'rgba(181,181,181,0.8)', marginBottom: 10 }}>Location: {company.location}</p>
        )}
        <p style={{ fontSize: 14, lineHeight: 1.65, color: 'rgba(181,181,181,0.94)', marginBottom: 16 }}>
          {company.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {company.tags.map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-1 rounded-lg text-xs font-medium"
              style={{ background: 'rgba(22,22,22,0.82)', border: '1px solid rgba(200,165,75,0.2)', color: 'rgba(181,181,181,0.9)' }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Button */}
        <Link
          to={`/company/${company.slug}`}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 glass-cta mt-auto self-start"
        >
          Learn More
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M1 6h10M7 2l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </Link>
      </div>

      {/* Glow on hover */}
      {hovered && (
        <div
          className="absolute inset-0 pointer-events-none rounded-2xl"
          style={{ background: 'radial-gradient(circle at 50% 0%, rgba(200,165,75,0.06) 0%, transparent 70%)' }}
        />
      )}
    </div>
  )
}

// ─── Companies Section ─────────────────────────────────────────────────────────

function CompaniesSection() {
  return (
    <section id="companies" className="py-28 relative">
      <div className="max-w-7xl mx-auto px-6">
        <SectionLabel text="OUR COMPANIES" />
        <h2 className="section-heading mb-4" style={{ fontFamily: 'Playfair Display, Cormorant Garamond, serif', fontWeight: 800, fontSize: 'clamp(32px,5vw,56px)', color: '#F4F4F4', lineHeight: 1.1, letterSpacing: '0.02em' }}>
          A Portfolio of Excellence
        </h2>
        <p style={{ color: 'rgba(181,181,181,0.9)', fontSize: 16, maxWidth: 540, lineHeight: 1.7, marginBottom: 48 }}>
          Six specialized companies operating under the MARKSD Group of Companies.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {COMPANIES.map((c, i) => (
            <div key={c.id} className="section-reveal h-full" style={{ transitionDelay: `${i * 0.08}s` }}>
              <CompanyCard company={c} />
            </div>
          ))}

          {/* Coming soon card */}
          <div
            className="section-reveal rounded-2xl p-8 flex flex-col items-center justify-center text-center min-h-80 relative overflow-hidden"
            style={{
              background: 'rgba(15,15,15,0.72)',
              border: '1px solid rgba(200,165,75,0.18)',
              transitionDelay: '0.48s',
            }}
          >
            {/* Animated dots */}
            <div className="flex gap-3 mb-6">
              {[0, 1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full animate-dot"
                  style={{ background: '#C8A54B', animationDelay: `${i * 0.3}s`, opacity: 0.6 }}
                />
              ))}
            </div>

            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
              style={{ background: 'rgba(200,165,75,0.08)', border: '1px dashed rgba(200,165,75,0.3)' }}
            >
              <span style={{ fontSize: 28, color: '#C8A54B' }}>+</span>
            </div>

<h3 style={{ fontFamily: 'Playfair Display, Cormorant Garamond, serif', fontWeight: 700, fontSize: 18, color: '#F4F4F4', marginBottom: 8 }}>
               MORE COMPANIES
             </h3>
             <p style={{ fontSize: 13, letterSpacing: '0.15em', color: '#C8A54B', marginBottom: 16, fontWeight: 600 }}>
               COMING SOON
             </p>
<p style={{ fontSize: 14, color: 'rgba(181,181,181,0.8)', lineHeight: 1.65 }}>
                MARKSD Group continues to expand into new sectors across India while preparing for future international growth.
              </p>

            {/* Background glow */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: 'radial-gradient(circle at 50% 100%, rgba(200,165,75,0.04) 0%, transparent 60%)' }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── About / Timeline ──────────────────────────────────────────────────────────

function AboutSection() {
  return (
    <section id="about" className="py-28 relative overflow-hidden">
      {/* BG accent */}
      <div
        className="absolute pointer-events-none"
        style={{ top: '10%', right: '-20%', width: 600, height: 600, background: 'radial-gradient(circle, rgba(200,165,75,0.04) 0%, transparent 70%)', borderRadius: '50%' }}
      />

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
          {/* Left */}
          <div>
            <SectionLabel text="ABOUT MARKSD" />
            <h2 style={{ fontFamily: 'Playfair Display, Cormorant Garamond, serif', fontWeight: 800, fontSize: 'clamp(32px,4vw,52px)', color: '#F4F4F4', lineHeight: 1.1, letterSpacing: '0.02em', marginBottom: 24 }}>
              A Decade of{' '}
              <span className="font-serif-italic" style={{ color: '#C8A54B' }}>
                Building
              </span>{' '}
              Excellence
            </h2>
            <p style={{ fontSize: 16, lineHeight: 1.8, color: 'rgba(181,181,181,0.94)', marginBottom: 16 }}>
              MARKSD Group of Companies was established with a singular purpose: to build businesses that create lasting
              value. What began as a single enterprise has grown into a diversified conglomerate spanning seven
              distinct industries.
            </p>
            <p style={{ fontSize: 16, lineHeight: 1.8, color: 'rgba(181,181,181,0.94)', marginBottom: 40 }}>
              Each company within the MARKSD portfolio operates with independence, expertise, and a shared commitment to
              quality, innovation, and sustainable growth.
            </p>

            {/* Mission / Vision */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
              {[
                { title: 'Our Mission', text: 'To build high-impact businesses that solve real-world challenges and create measurable value for clients, partners, and communities.' },
                { title: 'Our Vision', text: 'To be a nationally respected conglomerate known for innovation, integrity, and operational excellence while building toward international expansion.' },
              ].map((item) => (
                <div
                  key={item.title}
                  className="p-5 rounded-xl"
                  style={{ background: 'rgba(22,22,22,0.72)', border: '1px solid rgba(200,165,75,0.18)' }}
                >
                  <h4 style={{ fontWeight: 700, fontSize: 14, color: '#C8A54B', marginBottom: 8, letterSpacing: '0.05em' }}>{item.title}</h4>
                  <p style={{ fontSize: 13, lineHeight: 1.65, color: 'rgba(181,181,181,0.92)' }}>{item.text}</p>
                </div>
              ))}
            </div>

            {/* Values */}
            <h3 style={{ fontWeight: 700, fontSize: 16, color: '#F4F4F4', marginBottom: 16, letterSpacing: '0.05em' }}>CORE VALUES</h3>
            <div className="space-y-3">
              {VALUES.map((v) => (
                <div key={v.title} className="flex items-start gap-4 p-4 rounded-xl transition-all duration-200 group cursor-default"
                  style={{ border: '1px solid rgba(22,22,22,0.82)' }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = 'rgba(22,22,22,0.78)')}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = 'transparent')}
                >
                  <span
                    className="w-6 h-6 mt-0.5 rounded-full flex items-center justify-center text-[10px] font-bold"
                    style={{ background: 'rgba(200,165,75,0.15)', color: '#C8A54B', border: '1px solid rgba(200,165,75,0.25)' }}
                  >
                    {v.title.charAt(0)}
                  </span>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: 14, color: '#F4F4F4', marginBottom: 3 }}>{v.title}</p>
                    <p style={{ fontSize: 13, color: 'rgba(181,181,181,0.9)', lineHeight: 1.55 }}>{v.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — timeline */}
          <div>
            <h3 style={{ fontWeight: 700, fontSize: 13, letterSpacing: '0.2em', color: 'rgba(181,181,181,0.74)', marginBottom: 32, textTransform: 'uppercase' }}>
              Our Journey
            </h3>
            <div className="relative lg:hidden">
              <div
                className="absolute left-6 top-0 bottom-0 w-px"
                style={{ background: 'linear-gradient(180deg, rgba(200,165,75,0.6) 0%, rgba(200,165,75,0.1) 100%)' }}
              />
              <div className="space-y-0">
                {TIMELINE.map((item, i) => (
                  <div key={i} className="flex gap-6 group">
                    <div className="relative flex-shrink-0 w-12 flex justify-center">
                      <div
                        className="relative z-10 w-3 h-3 rounded-full mt-1.5 transition-all duration-300 group-hover:scale-125"
                        style={{ background: i === 0 ? '#C8A54B' : 'rgba(200,165,75,0.4)', boxShadow: i === 0 ? '0 0 12px rgba(200,165,75,0.6)' : 'none' }}
                      />
                    </div>
                    <div className="pb-10">
                      <div className="flex items-center gap-3 mb-1 flex-wrap">
                        <span style={{ fontSize: 12, fontWeight: 700, color: '#C8A54B', letterSpacing: '0.05em' }}>{item.stage}</span>
                        <span
                          className="px-2.5 py-0.5 rounded-full text-xs font-semibold"
                          style={{ background: 'rgba(200,165,75,0.1)', color: '#C8A54B', border: '1px solid rgba(200,165,75,0.2)' }}
                        >
                          {item.label}
                        </span>
                      </div>
                      <p style={{ fontSize: 14, color: 'rgba(181,181,181,0.92)', lineHeight: 1.6 }}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="hidden lg:grid lg:grid-cols-4 gap-4">
              {TIMELINE.map((item, i) => (
                <div key={i} className="relative p-4 rounded-xl" style={{ background: 'rgba(15,15,15,0.72)', border: '1px solid rgba(200,165,75,0.16)' }}>
                  <div className="absolute -top-1 left-4 w-3 h-3 rounded-full" style={{ background: i === 0 ? '#C8A54B' : 'rgba(200,165,75,0.5)' }} />
                  <div className="mb-2 mt-2">
                    <p style={{ fontSize: 12, fontWeight: 700, color: '#C8A54B', letterSpacing: '0.05em' }}>{item.stage}</p>
                    <span
                      className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-semibold"
                      style={{ background: 'rgba(200,165,75,0.1)', color: '#C8A54B', border: '1px solid rgba(200,165,75,0.2)' }}
                    >
                      {item.label}
                    </span>
                  </div>
                  <p style={{ fontSize: 13, color: 'rgba(181,181,181,0.92)', lineHeight: 1.6 }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Industries Section ────────────────────────────────────────────────────────

function IndustriesSection() {
  const [active, setActive] = useState<number | null>(null)

  return (
    <section id="industries" className="py-28 relative">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'linear-gradient(180deg, transparent, rgba(200,165,75,0.03) 50%, transparent)' }}
      />
      <div className="max-w-7xl mx-auto px-6">
        <SectionLabel text="INDUSTRIES" />
        <h2 style={{ fontFamily: 'Playfair Display, Cormorant Garamond, serif', fontWeight: 800, fontSize: 'clamp(32px,5vw,56px)', color: '#F4F4F4', lineHeight: 1.1, letterSpacing: '0.02em', marginBottom: 16 }}>
          Where We Operate
        </h2>
        <p style={{ color: 'rgba(181,181,181,0.9)', fontSize: 16, maxWidth: 480, lineHeight: 1.7, marginBottom: 48 }}>
          MARKSD Group spans eight distinct industries, with each business unit bringing specialized expertise and market leadership.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {INDUSTRIES.map((ind, i) => (
            <div
              key={ind.label}
              className="p-6 rounded-2xl text-center cursor-pointer transition-all duration-300"
              style={{
                background: active === i ? 'rgba(200,165,75,0.08)' : 'rgba(22,22,22,0.72)',
                border: active === i ? '1px solid rgba(200,165,75,0.3)' : '1px solid rgba(200,165,75,0.15)',
                transform: active === i ? 'translateY(-6px)' : 'none',
                boxShadow: active === i ? '0 8px 32px rgba(200,165,75,0.12)' : 'none',
              }}
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
            >
              <div className="flex justify-center mb-3">
                <IndustryIcon icon={ind.icon} active={active === i} />
              </div>
              <p style={{ fontWeight: 700, fontSize: 14, color: active === i ? '#C8A54B' : '#F4F4F4', letterSpacing: '0.03em' }}>
                {ind.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Stats / Why MARKSD ────────────────────────────────────────────────────────

function StatsSection() {
  return (
    <section className="py-28 relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(200,165,75,0.05) 0%, transparent 70%)' }}
      />
      <div className="max-w-7xl mx-auto px-6">
        <SectionLabel text="WHY CHOOSE MARKSD" />
        <h2 style={{ fontFamily: 'Playfair Display, Cormorant Garamond, serif', fontWeight: 800, fontSize: 'clamp(32px,5vw,56px)', color: '#F4F4F4', lineHeight: 1.1, letterSpacing: '0.02em', marginBottom: 48 }}>
          Numbers That{' '}
          <span className="font-serif-italic" style={{ color: '#C8A54B' }}>Speak</span>
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          {STATS.map((s) => (
            <div
              key={s.label}
              className="p-8 rounded-2xl text-center transition-all duration-300 group cursor-default"
              style={{ background: 'rgba(22,22,22,0.72)', border: '1px solid rgba(200,165,75,0.18)' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.border = '1px solid rgba(200,165,75,0.2)'; (e.currentTarget as HTMLElement).style.background = 'rgba(200,165,75,0.04)' }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.border = '1px solid rgba(200,165,75,0.18)'; (e.currentTarget as HTMLElement).style.background = 'rgba(22,22,22,0.72)' }}
            >
              <p style={{ fontFamily: 'Playfair Display, Cormorant Garamond, serif', fontWeight: 800, fontSize: 48, color: '#C8A54B', lineHeight: 1 }}>{s.value}</p>
              <p style={{ fontSize: 13, color: 'rgba(181,181,181,0.9)', marginTop: 8, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Why choose grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { marker: '01', title: 'Proven Track Record', desc: 'Consistent growth, successful project delivery, and client satisfaction across every business vertical.' },
            { marker: '02', title: 'Integrated Ecosystem', desc: 'Our portfolio companies collaborate, share resources, and create synergies that drive superior outcomes for clients.' },
            { marker: '03', title: 'Growth-First Mindset', desc: 'Every decision is oriented toward long-term value creation, sustainable scaling, and measurable impact.' },
          ].map((item) => (
            <div
              key={item.title}
              className="p-8 rounded-2xl transition-all duration-300"
              style={{ background: 'rgba(22,22,22,0.72)', border: '1px solid rgba(200,165,75,0.18)' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-6px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 14px 42px rgba(200,165,75,0.12)' }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = 'none'; (e.currentTarget as HTMLElement).style.boxShadow = 'none' }}
            >
              <span
                className="inline-flex items-center justify-center w-11 h-11 rounded-full mb-4"
                style={{ background: 'rgba(200,165,75,0.12)', color: '#C8A54B', border: '1px solid rgba(200,165,75,0.25)', fontWeight: 700, letterSpacing: '0.08em', fontSize: 12 }}
              >
                {item.marker}
              </span>
              <h3 style={{ fontWeight: 700, fontSize: 18, color: '#F4F4F4', marginBottom: 10 }}>{item.title}</h3>
              <p style={{ fontSize: 14, lineHeight: 1.7, color: 'rgba(181,181,181,0.92)' }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Testimonials ──────────────────────────────────────────────────────────────

function TestimonialsSection() {
  const testimonials = [
    {
      quote: "MARKSD Group's digital marketing arm transformed our brand visibility within three months. The depth of expertise across their portfolio is unmatched.",
      name: 'Client A',
      role: 'Managing Director, Manufacturing Client',
      initials: 'CA',
    },
    {
      quote: "Working with the group gave us access to industrial-grade packaging solutions with precision and reliability we couldn't find elsewhere.",
      name: 'Client B',
      role: 'Technology Partner',
      initials: 'CB',
    },
    {
      quote: 'The food processing division supplied us with premium spice exports. Their quality control and logistics capabilities are consistently reliable.',
      name: 'Client C',
      role: 'Export Business Client',
      initials: 'CC',
    },
  ]

  return (
    <section className="py-28 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <SectionLabel text="TESTIMONIALS" />
        <h2 style={{ fontFamily: 'Playfair Display, Cormorant Garamond, serif', fontWeight: 800, fontSize: 'clamp(32px,5vw,56px)', color: '#F4F4F4', lineHeight: 1.1, letterSpacing: '0.02em', marginBottom: 48 }}>
          Trusted by{' '}
          <span className="font-serif-italic" style={{ color: '#C8A54B' }}>Leaders</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="p-8 rounded-2xl relative transition-all duration-300"
              style={{ background: 'rgba(22,22,22,0.72)', border: '1px solid rgba(200,165,75,0.18)' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.border = '1px solid rgba(200,165,75,0.15)' }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.border = '1px solid rgba(200,165,75,0.18)' }}
            >
              <div style={{ fontSize: 40, color: 'rgba(200,165,75,0.3)', lineHeight: 1, marginBottom: 16, fontFamily: 'Georgia' }}>"</div>
              <p style={{ fontSize: 15, lineHeight: 1.75, color: 'rgba(255,255,255,0.7)', marginBottom: 24, fontStyle: 'italic' }}>
                {t.quote}
              </p>
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg, #C8A54B, #D9BE72)' }}
                >
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#050505' }}>{t.initials}</span>
                </div>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 700, color: '#F4F4F4' }}>{t.name}</p>
                  <p style={{ fontSize: 12, color: 'rgba(181,181,181,0.8)' }}>{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Global Presence ───────────────────────────────────────────────────────────

function GlobalPresence() {
  const cities = [
    { name: 'Chittoor', state: 'Andhra Pradesh', type: 'HQ', x: 52, y: 72 },
    { name: 'Chennai', state: 'Tamil Nadu', type: 'Future', x: 56, y: 82 },
    { name: 'Bengaluru', state: 'Karnataka', type: 'Future', x: 48, y: 78 },
    { name: 'Hyderabad', state: 'Telangana', type: 'Future', x: 46, y: 68 },
    { name: 'Mumbai', state: 'Maharashtra', type: 'Future', x: 38, y: 52 },
    { name: 'Delhi', state: 'Delhi', type: 'Future', x: 42, y: 28 },
  ]

  const [hoveredCity, setHoveredCity] = useState<string | null>(null)

  return (
    <section className="py-28 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div
          className="rounded-3xl p-12 md:p-16 relative overflow-hidden"
          style={{ background: 'rgba(22,22,22,0.72)', border: '1px solid rgba(200,165,75,0.18)' }}
        >
          <div
            className="absolute pointer-events-none"
            style={{ top: '50%', left: '60%', transform: 'translate(-50%,-50%)', width: 500, height: 300, background: 'radial-gradient(ellipse, rgba(200,165,75,0.06), transparent 70%)', filter: 'blur(20px)' }}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
            <div>
              <SectionLabel text="NATIONAL PRESENCE" />
              <h2 style={{ fontFamily: 'Playfair Display, Cormorant Garamond, serif', fontWeight: 800, fontSize: 'clamp(28px,4vw,48px)', color: '#F4F4F4', lineHeight: 1.1, letterSpacing: '0.02em', marginBottom: 20 }}>
                Serving Clients Across{' '}
                <span className="font-serif-italic" style={{ color: '#C8A54B' }}>India</span>
              </h2>
              <p style={{ fontSize: 15, lineHeight: 1.8, color: 'rgba(181,181,181,0.94)', marginBottom: 32 }}>
                Headquartered in Chittoor, Andhra Pradesh, MARKSD Group operates throughout India with integrated capabilities across all our business verticals.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <div className="w-3 h-3 rounded-full mt-1" style={{ background: '#C8A54B', boxShadow: '0 0 12px rgba(200,165,75,0.6)' }} />
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 700, color: '#F4F4F4' }}>Headquarters</p>
                    <p style={{ fontSize: 13, color: 'rgba(181,181,181,0.8)' }}>Chittoor, Andhra Pradesh</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-3 h-3 rounded-full mt-1" style={{ background: 'rgba(200,165,75,0.4)' }} />
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 700, color: '#F4F4F4' }}>Future Expansion</p>
                    <p style={{ fontSize: 13, color: 'rgba(181,181,181,0.8)' }}>Chennai, Bengaluru, Hyderabad, Mumbai, Delhi</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {['Andhra Pradesh', 'Tamil Nadu', 'Karnataka', 'Telangana', 'Maharashtra', 'Delhi'].map((state) => (
                  <span
                    key={state}
                    className="px-3 py-1.5 rounded-full text-xs font-medium"
                    style={{ background: 'rgba(200,165,75,0.08)', border: '1px solid rgba(200,165,75,0.2)', color: '#C8A54B' }}
                  >
                    {state}
                  </span>
                ))}
              </div>
            </div>

            {/* Interactive India Map */}
            <div className="relative h-80 flex items-center justify-center">
              <div
                className="relative w-full h-full rounded-2xl overflow-hidden flex items-center justify-center"
                style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(200,165,75,0.15)' }}
              >
                <svg viewBox="0 0 100 100" className="w-full h-full p-4" style={{ maxWidth: 400 }}>
                  {/* Simplified India outline */}
                  <path
                    d="M35,5 L40,8 L45,7 L50,10 L55,8 L60,12 L62,18 L65,22 L63,28 L66,32 L64,38 L68,42 L70,48 L68,52 L72,58 L70,65 L68,70 L65,75 L62,78 L58,80 L55,75 L52,72 L50,78 L48,82 L45,85 L42,82 L40,78 L38,72 L35,68 L32,65 L30,58 L28,52 L25,48 L28,42 L26,35 L28,28 L30,22 L32,15 L35,10 Z"
                    fill="rgba(200,165,75,0.05)"
                    stroke="rgba(200,165,75,0.3)"
                    strokeWidth="0.5"
                  />
                  
                  {/* City markers */}
                  {cities.map((city) => (
                    <g
                      key={city.name}
                      onMouseEnter={() => setHoveredCity(city.name)}
                      onMouseLeave={() => setHoveredCity(null)}
                      className="cursor-pointer"
                    >
                      {/* Pulse effect for HQ */}
                      {city.type === 'HQ' && (
                        <>
                          <circle cx={city.x} cy={city.y} r="4" fill="rgba(200,165,75,0.2)">
                            <animate attributeName="r" from="2" to="6" dur="1.5s" repeatCount="indefinite" />
                            <animate attributeName="opacity" from="0.6" to="0" dur="1.5s" repeatCount="indefinite" />
                          </circle>
                          <circle cx={city.x} cy={city.y} r="2" fill="#C8A54B" style={{ filter: 'drop-shadow(0 0 8px rgba(200,165,75,0.8))' }} />
                        </>
                      )}
                      {/* Future expansion markers */}
                      {city.type === 'Future' && (
                        <circle cx={city.x} cy={city.y} r="1.5" fill="rgba(200,165,75,0.5)" className="transition-all duration-200" style={{ transformOrigin: `${city.x}% ${city.y}%`, transform: hoveredCity === city.name ? 'scale(1.5)' : 'scale(1)' }} />
                      )}
                    </g>
                  ))}
                </svg>

                {/* Tooltip */}
                {hoveredCity && (
                  <div
                    className="absolute px-3 py-2 rounded-lg text-xs font-semibold pointer-events-none transition-all duration-200"
                    style={{
                      top: cities.find(c => c.name === hoveredCity)?.type === 'HQ' ? '68%' : `${cities.find(c => c.name === hoveredCity)?.y || 50}%`,
                      left: `${(cities.find(c => c.name === hoveredCity)?.x || 50) + 5}%`,
                      background: 'rgba(22,22,22,0.95)',
                      border: '1px solid rgba(200,165,75,0.3)',
                      color: '#C8A54B',
                      transform: 'translateY(-50%)',
                      whiteSpace: 'nowrap',
                      zIndex: 20,
                    }}
                  >
                    {hoveredCity}
                    <span style={{ display: 'block', fontSize: 10, color: 'rgba(181,181,181,0.8)', fontWeight: 400 }}>
                      {cities.find(c => c.name === hoveredCity)?.state}
                      {cities.find(c => c.name === hoveredCity)?.type === 'HQ' && ' (HQ)'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Contact ────────────────────────────────────────────────────────────────────

function ContactSection() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', subject: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [statusMessage, setStatusMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (status === 'loading') return
    
    // Validate required fields
    if (!form.name || !form.email || !form.phone || !form.subject || !form.message) {
      setStatus('error')
      setStatusMessage('Please fill in all required fields.')
      return
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(form.email)) {
      setStatus('error')
      setStatusMessage('Please enter a valid email address.')
      return
    }
    
    // Phone validation (Indian phone numbers)
    const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/
    if (!phoneRegex.test(form.phone) || form.phone.replace(/\D/g, '').length < 10) {
      setStatus('error')
      setStatusMessage('Please enter a valid phone number.')
      return
    }
    
    setStatus('loading')
    setStatusMessage('')
    try {
      const { default: axios } = await import('axios')
      const apiBase = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || 'https://api.marksd.co'
      const response = await axios.post(`${apiBase}/api/contact`, form, { timeout: 15000 })
      setStatus('success')
      setStatusMessage(response.data?.message || 'Enquiry submitted successfully.')
      setForm({ name: '', email: '', phone: '', company: '', subject: '', message: '' })
    } catch (error: any) {
      const message = error?.response?.data?.message || error?.message || 'Unable to submit enquiry. Please try again.'
      setStatus('error')
      setStatusMessage(message)
    }
  }

  return (
    <section id="contact" className="py-28 relative overflow-hidden">
      <div
        className="absolute pointer-events-none"
        style={{ top: 0, left: '50%', transform: 'translateX(-50%)', width: 800, height: 400, background: 'radial-gradient(ellipse, rgba(200,165,75,0.05) 0%, transparent 70%)', filter: 'blur(40px)' }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SectionLabel text="CONTACT" />
        <h2 style={{ fontFamily: 'Playfair Display, Cormorant Garamond, serif', fontWeight: 800, fontSize: 'clamp(32px,5vw,56px)', color: '#F4F4F4', lineHeight: 1.1, letterSpacing: '0.02em', marginBottom: 12 }}>
          Partner With MARKSD
        </h2>
        <p style={{ color: 'rgba(181,181,181,0.9)', fontSize: 16, maxWidth: 480, lineHeight: 1.7, marginBottom: 56 }}>
          Connect with our team to discuss partnerships, investments, and strategic business requirements.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 md:gap-12">
          {/* Contact info */}
          <div className="lg:col-span-2 space-y-6">
            {[
              { icon: 'HQ', label: 'Office', value: 'Chittoor, Andhra Pradesh, India' },
              { icon: 'PH', label: 'Phone', value: '+91 XXXXX XXXXX', href: 'tel:+91' },
              { icon: 'EM', label: 'Email', value: 'info@marksd.co', href: 'mailto:info@marksd.co' },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-start gap-4 p-5 rounded-xl"
                style={{ background: 'rgba(22,22,22,0.72)', border: '1px solid rgba(200,165,75,0.18)' }}
              >
                <span
                  className="w-9 h-9 rounded-full flex items-center justify-center text-[10px] font-bold mt-0.5"
                  style={{ background: 'rgba(200,165,75,0.12)', border: '1px solid rgba(200,165,75,0.22)', color: '#C8A54B' }}
                >
                  {item.icon}
                </span>
                <div>
                  <p style={{ fontSize: 11, letterSpacing: '0.15em', color: '#C8A54B', fontWeight: 600, marginBottom: 4 }}>{item.label}</p>
                  {item.href ? (
                    <a href={item.href} style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }} onMouseEnter={(e) => (e.target as HTMLElement).style.color = '#C8A54B'} onMouseLeave={(e) => (e.target as HTMLElement).style.color = 'rgba(255,255,255,0.7)'}>{item.value}</a>
                  ) : (
                    <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>{item.value}</p>
                  )}
                </div>
              </div>
            ))}

            <div
              className="p-5 rounded-xl"
              style={{ background: 'rgba(200,165,75,0.05)', border: '1px solid rgba(200,165,75,0.15)' }}
            >
              <p style={{ fontWeight: 700, fontSize: 13, color: '#C8A54B', marginBottom: 8, letterSpacing: '0.05em' }}>BUSINESS HOURS</p>
              <p style={{ fontSize: 13, color: 'rgba(181,181,181,0.92)', lineHeight: 1.6 }}>
                Monday – Saturday<br />
                9:00 AM – 6:00 PM IST
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-3">
            <form
              onSubmit={handleSubmit}
              className="p-5 sm:p-8 rounded-2xl space-y-5"
              style={{ background: 'rgba(22,22,22,0.72)', border: '1px solid rgba(200,165,75,0.18)' }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <FormField label="Full Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} placeholder="John Doe" required />
                <FormField label="Email Address" value={form.email} onChange={(v) => setForm({ ...form, email: v })} placeholder="john@company.com" type="email" required />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <FormField label="Phone Number" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} placeholder="+91 XXXXX XXXXX" required />
                <FormField label="Subject" value={form.subject} onChange={(v) => setForm({ ...form, subject: v })} placeholder="Partnership Enquiry" required />
              </div>
              <FormField label="Company" value={form.company} onChange={(v) => setForm({ ...form, company: v })} placeholder="Your Company Name" />

              {/* Message */}
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, letterSpacing: '0.08em', color: 'rgba(181,181,181,0.9)', marginBottom: 8 }}>
                  MESSAGE
                </label>
                <textarea
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Tell us about your requirements..."
                  required
                  maxLength={2000}
                  className="w-full rounded-xl px-4 py-3 text-sm resize-none focus:outline-none transition-all duration-200"
                  style={{
                    background: 'rgba(22,22,22,0.78)',
                    border: '1px solid rgba(200,165,75,0.22)',
                    color: '#F4F4F4',
                    fontFamily: 'Inter',
                  }}
                  onFocus={(e) => ((e.target as HTMLElement).style.borderColor = 'rgba(200,165,75,0.4)')}
                  onBlur={(e) => ((e.target as HTMLElement).style.borderColor = 'rgba(200,165,75,0.22)')}
                />
              </div>

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full py-4 rounded-xl font-bold text-sm tracking-wider transition-all duration-300 glass-cta glass-cta-primary disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {status === 'loading' ? 'SUBMITTING...' : 'SEND MESSAGE'}
              </button>
              {status !== 'idle' && (
                <p style={{ fontSize: 13, color: status === 'error' ? '#E6A3A3' : '#D9BE72' }}>
                  {statusMessage || (status === 'success' ? 'Enquiry submitted successfully.' : 'Unable to submit enquiry.')}
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

function FormField({ label, value, onChange, placeholder, type = 'text', required = false }: {
  label: string; value: string; onChange: (v: string) => void; placeholder: string; type?: string; required?: boolean
}) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, letterSpacing: '0.08em', color: 'rgba(181,181,181,0.9)', marginBottom: 8 }}>
        {label.toUpperCase()}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none transition-all duration-200"
        style={{
          background: 'rgba(22,22,22,0.78)',
          border: '1px solid rgba(200,165,75,0.22)',
          color: '#F4F4F4',
          fontFamily: 'Inter',
        }}
        onFocus={(e) => ((e.target as HTMLElement).style.borderColor = 'rgba(200,165,75,0.4)')}
        onBlur={(e) => ((e.target as HTMLElement).style.borderColor = 'rgba(200,165,75,0.22)')}
      />
    </div>
  )
}

// ─── Footer ────────────────────────────────────────────────────────────────────

function Footer() {
  const location = useLocation()
  const isHome = location.pathname === '/'
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [newsletterMessage, setNewsletterMessage] = useState('')

  const resolveAnchor = (label: string) => {
    const hash = `#${label.toLowerCase()}`
    return isHome ? hash : `/${hash}`
  }

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newsletterStatus === 'loading' || !newsletterEmail) return
    setNewsletterStatus('loading')
    setNewsletterMessage('')
    try {
      const { default: axios } = await import('axios')
      const apiBase = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || 'https://api.marksd.co'
      const response = await axios.post(`${apiBase}/api/newsletter/subscribe`, { email: newsletterEmail }, { timeout: 10000 })
      setNewsletterStatus('success')
      setNewsletterMessage(response.data?.message || 'Successfully subscribed!')
      setNewsletterEmail('')
    } catch (error: any) {
      const message = error?.response?.data?.message || 'Unable to subscribe. Please try again.'
      setNewsletterStatus('error')
      setNewsletterMessage(message)
    }
  }

  return (
    <footer
      className="py-16 relative overflow-hidden"
      style={{ borderTop: '1px solid rgba(200,165,75,0.18)' }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'linear-gradient(180deg, transparent, rgba(200,165,75,0.02))' }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-5">
              <img
                src={marksdLogo}
                alt="MARKSD Group of Companies"
                className="w-10 h-10 rounded-xl object-contain bg-black/20 p-0.5"
                style={{ filter: 'drop-shadow(0 0 10px rgba(200,165,75,0.22))' }}
              />
              <div>
                <p style={{ fontFamily: 'Playfair Display, Cormorant Garamond, serif', fontWeight: 800, fontSize: 18, letterSpacing: '0.1em', color: '#F4F4F4' }}>MARKSD</p>
                <p style={{ fontSize: 11, letterSpacing: '0.25em', color: 'rgba(200,165,75,0.6)' }}>GROUP OF COMPANIES</p>
              </div>
            </div>
            <p style={{ fontSize: 14, lineHeight: 1.75, color: 'rgba(181,181,181,0.84)', maxWidth: 320, marginBottom: 20 }}>
              Building businesses across industries in India through innovation, integrity, and sustainable growth.
            </p>
            {/* Newsletter */}
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-4 py-2.5 rounded-xl text-sm focus:outline-none min-w-0"
                style={{ background: 'rgba(22,22,22,0.82)', border: '1px solid rgba(200,165,75,0.22)', color: '#F4F4F4', fontFamily: 'Inter' }}
              />
              <button
                onClick={handleNewsletterSubmit}
                disabled={newsletterStatus === 'loading'}
                className="px-4 py-2.5 rounded-xl text-xs font-bold tracking-wide glass-cta glass-cta-primary disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {newsletterStatus === 'loading' ? 'SUBSCRIBING...' : 'Subscribe'}
              </button>
            </div>
            {newsletterStatus !== 'idle' && (
              <p style={{ fontSize: 12, color: newsletterStatus === 'error' ? '#E6A3A3' : '#D9BE72', marginTop: 8 }}>
                {newsletterMessage || (newsletterStatus === 'success' ? 'Successfully subscribed!' : 'Unable to subscribe.')}
              </p>
            )}
          </div>

          {/* Quick links */}
          <div>
            <p style={{ fontWeight: 700, fontSize: 12, letterSpacing: '0.2em', color: 'rgba(181,181,181,0.74)', marginBottom: 20 }}>QUICK LINKS</p>
            <div className="space-y-3">
              {['Home', 'Companies', 'Industries', 'About', 'Contact'].map((l) => (
                <a
                  key={l}
                  href={resolveAnchor(l)}
                  className="block text-sm transition-colors duration-200"
                  style={{ color: 'rgba(181,181,181,0.84)' }}
                  onMouseEnter={(e) => ((e.target as HTMLElement).style.color = '#C8A54B')}
                  onMouseLeave={(e) => ((e.target as HTMLElement).style.color = 'rgba(181,181,181,0.84)')}
                >
                  {l}
                </a>
              ))}
            </div>
          </div>

          {/* Companies */}
          <div>
            <p style={{ fontWeight: 700, fontSize: 12, letterSpacing: '0.2em', color: 'rgba(181,181,181,0.74)', marginBottom: 20 }}>COMPANIES</p>
            <div className="space-y-3">
              {COMPANIES.map((c) => (
                <p key={c.id} className="text-sm" style={{ color: 'rgba(181,181,181,0.84)' }}>{c.name}</p>
              ))}
            </div>
          </div>
        </div>

        <div
          className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4"
          style={{ borderTop: '1px solid rgba(200,165,75,0.15)' }}
        >
<p style={{ fontSize: 13, color: 'rgba(181,181,181,0.72)' }}>
             © {new Date().getFullYear()} MARKSD Group of Companies. All Rights Reserved.
           </p>
          <div className="flex gap-6">
            {['Privacy Policy', 'Terms of Service', 'Sitemap'].map((l) => (
              <a key={l} href="#" className="text-xs transition-colors duration-200" style={{ color: 'rgba(181,181,181,0.72)' }}
                onMouseEnter={(e) => ((e.target as HTMLElement).style.color = '#C8A54B')}
                onMouseLeave={(e) => ((e.target as HTMLElement).style.color = 'rgba(181,181,181,0.72)' )}
              >
                {l}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

// ─── Shared helpers ────────────────────────────────────────────────────────────

function SectionLabel({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="w-5 h-px" style={{ background: '#C8A54B' }} />
      <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.3em', color: 'rgba(200,165,75,0.7)', textTransform: 'uppercase' }}>
        {text}
      </span>
    </div>
  )
}

function IndustryIcon({ icon, active }: { icon: string; active: boolean }) {
  const color = active ? '#D9BE72' : '#C8A54B'
  const common = { stroke: color, strokeWidth: 1.7, fill: 'none' as const, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }

  const paths: Record<string, JSX.Element> = {
    digital: (
      <>
        <rect x="5" y="5" width="14" height="14" rx="2" {...common} />
        <path d="M9 9h6M9 12h6M9 15h4" {...common} />
      </>
    ),
    manufacturing: (
      <>
        <path d="M4 18h16V9l-4 2V7l-4 2V5L4 9z" {...common} />
      </>
    ),
    food: (
      <>
        <path d="M8 5v7M11 5v7M14 5v7M17 5v7M8 12h9" {...common} />
        <path d="M12.5 12v7" {...common} />
      </>
    ),
    architecture: (
      <>
        <path d="M4 10l8-6 8 6" {...common} />
        <path d="M6 10v9h12v-9" {...common} />
        <path d="M10 19v-4h4v4" {...common} />
      </>
    ),
    construction: (
      <>
        <path d="M4 18h16M7 18V9h10v9M9 9V6h6v3" {...common} />
      </>
    ),
    exports: (
      <>
        <path d="M4 12h12" {...common} />
        <path d="M12 8l4 4-4 4" {...common} />
        <path d="M5 7h3M5 17h3" {...common} />
      </>
    ),
    automotive: (
      <>
        <path d="M5 15l2-5h10l2 5v3h-2a2 2 0 0 1-4 0H11a2 2 0 0 1-4 0H5z" {...common} />
        <circle cx="9" cy="18" r="0.8" fill={color} />
        <circle cx="15" cy="18" r="0.8" fill={color} />
      </>
    ),
    technology: (
      <>
        <rect x="7" y="7" width="10" height="10" rx="2" {...common} />
        <path d="M12 3v3M12 18v3M3 12h3M18 12h3M6 6l2 2M16 16l2 2M16 8l2-2M6 18l2-2" {...common} />
      </>
    ),
  }

  return (
    <span
      className="w-11 h-11 rounded-full flex items-center justify-center"
      style={{ background: 'rgba(200,165,75,0.1)', border: '1px solid rgba(200,165,75,0.24)' }}
    >
      <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
        {paths[icon]}
      </svg>
    </span>
  )
}

// ─── Scroll reveal hook ────────────────────────────────────────────────────────

function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.section-reveal')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
    )
    els.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])
}

// ─── App ───────────────────────────────────────────────────────────────────────

function HomePage() {
  const [loading, setLoading] = useState(true)
  useScrollReveal()

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 2200)
    return () => clearTimeout(t)
  }, [])

  return (
    <div style={{ background: '#050505', minHeight: '100vh' }}>
      <LoadingScreen done={!loading} />
      <Navbar />
      <Hero />
      <CompaniesSection />
      <AboutSection />
      <IndustriesSection />
      <StatsSection />
      <TestimonialsSection />
      <GlobalPresence />
      <ContactSection />
      <Footer />
    </div>
  )
}

function CompanyDetailPage() {
  const { slug } = useParams()
  const company = COMPANIES.find((item) => item.slug === slug)

  if (!company) {
    return (
      <div style={{ background: '#050505', minHeight: '100vh' }}>
        <Navbar />
        <section className="min-h-screen flex items-center justify-center px-6 pt-28">
          <div className="text-center max-w-xl">
            <h1 style={{ fontFamily: 'Playfair Display, Cormorant Garamond, serif', color: '#F4F4F4', fontSize: 'clamp(30px,5vw,48px)', marginBottom: 12 }}>
              Company Not Found
            </h1>
            <p style={{ color: 'rgba(181,181,181,0.9)', marginBottom: 24 }}>
              The requested company page is not available.
            </p>
            <Link to="/" className="inline-flex items-center px-6 py-3 rounded-full glass-cta glass-cta-primary text-sm font-semibold">
              Back to Home
            </Link>
          </div>
        </section>
<Footer />
    </div>
  )
}

function CompanyGallery({ images, company }: { images: string[]; company: Company }) {
  return (
    <section className="pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SectionLabel text="FACILITY HIGHLIGHTS" />
        <h2 style={{ fontFamily: 'Playfair Display, Cormorant Garamond, serif', fontWeight: 800, color: '#F4F4F4', fontSize: 'clamp(24px,4vw,40px)', lineHeight: 1.1, letterSpacing: '0.02em', marginBottom: 24 }}>
          {company.name} Operations
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {images.map((img, i) => (
            <div
              key={i}
              className="relative rounded-2xl overflow-hidden group"
              style={{ aspectRatio: '4/3' }}
            >
              <img
                src={img}
                alt={`${company.name} - ${['Scrap Sorting Facility', 'Metal Processing Equipment', 'Industrial Recycling Operations', 'Warehouse and Logistics'][i] || `View ${i + 1}`}`}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: 'linear-gradient(180deg, transparent 40%, rgba(5,5,5,0.85) 100%)' }}
              />
              <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p style={{ fontSize: 13, color: 'rgba(200,165,75,0.9)', fontWeight: 600, letterSpacing: '0.05em' }}>
                  {['Scrap Sorting Facility', 'Metal Processing Equipment', 'Industrial Recycling Operations', 'Warehouse and Logistics'][i] || `View ${i + 1}`}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

  return (
    <div style={{ background: '#050505', minHeight: '100vh' }}>
      <Navbar />

      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="rounded-3xl p-8 md:p-12" style={{ background: 'rgba(22,22,22,0.72)', border: '1px solid rgba(200,165,75,0.18)' }}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
              <div>
                <SectionLabel text="COMPANY PROFILE" />
                <h1 style={{ fontFamily: 'Playfair Display, Cormorant Garamond, serif', fontWeight: 800, color: '#F4F4F4', fontSize: 'clamp(30px,5vw,56px)', lineHeight: 1.1, letterSpacing: '0.02em', marginBottom: 12 }}>
                  {company.fullName}
                </h1>
                <p style={{ fontSize: 16, color: 'rgba(181,181,181,0.92)', lineHeight: 1.75, marginBottom: 28 }}>{company.intro}</p>
                <Link to="/" className="inline-flex items-center px-6 py-3 rounded-full glass-cta text-sm font-semibold">
                  Back to Home
                </Link>
              </div>
              <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(200,165,75,0.2)' }}>
                <img 
                  src={company.image} 
                  alt={`${company.fullName} - ${company.category} operations and facilities`} 
                  className="w-full h-72 md:h-80 object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="p-6 md:p-8 rounded-2xl" style={{ background: 'rgba(22,22,22,0.72)', border: '1px solid rgba(200,165,75,0.18)' }}>
              <SectionLabel text="ABOUT" />
              <p style={{ color: 'rgba(181,181,181,0.94)', lineHeight: 1.75, marginBottom: 18 }}>{company.overview}</p>
              <h3 style={{ color: '#C8A54B', fontWeight: 700, fontSize: 14, letterSpacing: '0.05em', marginBottom: 10 }}>INDUSTRIES SERVED</h3>
              <div className="flex flex-wrap gap-2 mb-5">
                {company.industriesServed.map((industry) => (
                  <span key={industry} className="px-3 py-1.5 rounded-full text-xs" style={{ background: 'rgba(200,165,75,0.1)', border: '1px solid rgba(200,165,75,0.2)', color: '#C8A54B' }}>
                    {industry}
                  </span>
                ))}
              </div>
              <h3 style={{ color: '#C8A54B', fontWeight: 700, fontSize: 14, letterSpacing: '0.05em', marginBottom: 8 }}>MISSION</h3>
              <p style={{ color: 'rgba(181,181,181,0.94)', lineHeight: 1.7, marginBottom: 16 }}>{company.mission}</p>
              <h3 style={{ color: '#C8A54B', fontWeight: 700, fontSize: 14, letterSpacing: '0.05em', marginBottom: 8 }}>EXPERTISE</h3>
              <p style={{ color: 'rgba(181,181,181,0.94)', lineHeight: 1.7 }}>{company.expertise}</p>
            </div>

            <div className="p-6 md:p-8 rounded-2xl" style={{ background: 'rgba(22,22,22,0.72)', border: '1px solid rgba(200,165,75,0.18)' }}>
              <SectionLabel text="SERVICES" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {company.services.map((service) => (
                  <div key={service.title} className="p-4 rounded-xl" style={{ background: 'rgba(15,15,15,0.72)', border: '1px solid rgba(200,165,75,0.14)' }}>
                    <h4 style={{ color: '#F4F4F4', fontWeight: 700, fontSize: 15, marginBottom: 6 }}>{service.title}</h4>
                    <p style={{ color: 'rgba(181,181,181,0.9)', fontSize: 13, lineHeight: 1.65 }}>{service.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {company.gallery && company.gallery.length > 0 && (
        <CompanyGallery images={company.gallery} company={company} />
      )}

      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/company/:slug" element={<CompanyDetailPage />} />
      <Route path="*" element={<HomePage />} />
    </Routes>
  )
}
