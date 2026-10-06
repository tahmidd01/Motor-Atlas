import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  ArrowUpRight,
  Menu,
  Search,
  Shuffle,
  X,
  Heart,
  GitCompareArrows,
} from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useGarage } from '../../features/garage/GarageContext';
import { cars, carPath } from '../../data/catalog';
import SearchCommand from '../search/SearchCommand';

export function Logo() {
  return (
    <Link to="/" className="logo" aria-label="Motor Atlas home">
      <svg viewBox="0 0 40 36" aria-hidden="true">
        <path d="M2 30 12 5h6l2 13 2-13h6l10 25h-8l-5-13-3 13h-4l-3-13-5 13Z" fill="currentColor" />
      </svg>
      <span>
        MOTOR<span className="logo-light">ATLAS</span>
        <sup>↗</sup>
      </span>
    </Link>
  );
}
const links = [
  ['/cars', 'Explore'],
  ['/brands', 'Manufacturers'],
  ['/timeline', 'The timeline'],
  ['/technology', 'Engineering'],
];
export default function Layout() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const reduced = useReducedMotion();
  const { favorites, comparison, notice } = useGarage();
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  useEffect(() => {
    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen((s) => !s);
      }
      if (e.key === 'Escape') setMobileOpen(false);
    };
    window.addEventListener('keydown', key);
    return () => window.removeEventListener('keydown', key);
  }, []);
  const random = () => navigate(carPath(cars[Math.floor(Math.random() * cars.length)]));
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <header
        className={`site-header ${scrolled ? 'scrolled' : ''} ${pathname !== '/' ? 'inner-header' : ''}`}
      >
        <div className="nav-shell">
          <Logo />
          <nav className="desktop-nav" aria-label="Main navigation">
            {links.map(([to, label]) => (
              <NavLink key={to} to={to}>
                {label}
              </NavLink>
            ))}
          </nav>
          <div className="nav-actions">
            <button
              className="nav-search"
              onClick={() => setSearchOpen(true)}
              aria-label="Search the atlas"
            >
              <Search size={18} />
              <span>Search</span>
              <kbd>{/Mac|iPhone|iPad/.test(navigator.platform) ? '⌘ K' : 'Ctrl K'}</kbd>
            </button>
            <Link
              to="/collection"
              className="icon-button desktop-collection"
              aria-label={`Collection, ${favorites.length} saved cars`}
            >
              <Heart size={18} />
              {favorites.length > 0 && <span className="count-badge">{favorites.length}</span>}
            </Link>
            <button
              className="icon-button mobile-menu-button"
              onClick={() => setMobileOpen((v) => !v)}
              aria-expanded={mobileOpen}
              aria-controls="mobile-navigation"
              aria-label={mobileOpen ? 'Close navigation' : 'Open navigation'}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
        {mobileOpen && (
          <nav id="mobile-navigation" className="mobile-nav" aria-label="Mobile navigation">
            {links.map(([to, label]) => (
              <NavLink key={to} to={to}>
                {label}
                <ArrowUpRight size={20} />
              </NavLink>
            ))}
            <NavLink to="/compare">
              Compare
              <GitCompareArrows size={20} />
            </NavLink>
            <NavLink to="/collection">
              My collection
              <Heart size={20} />
            </NavLink>
            <NavLink to="/countries">
              Around the world
              <ArrowUpRight size={20} />
            </NavLink>
          </nav>
        )}
      </header>
      <main id="main" tabIndex={-1}>
        <Outlet />
      </main>
      <footer className="site-footer">
        <div className="footer-top">
          <div>
            <Logo />
            <p>
              An independent archive of the machines
              <br />
              that move us.
            </p>
          </div>
          <div className="footer-links">
            <Link to="/cars">Explore the archive</Link>
            <Link to="/countries">Around the world</Link>
            <Link to="/glossary">Automotive glossary</Link>
            <Link to="/data">Inside the data</Link>
            <Link to="/credits">Sources & credits</Link>
          </div>
          <button className="footer-random" onClick={random}>
            <Shuffle size={22} />
            <span>
              Take the road
              <br />
              <strong>less expected.</strong>
            </span>
            <ArrowUpRight size={22} />
          </button>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Motor Atlas</span>
          <span>A curated archive. Always evolving.</span>
          <span>Made for curiosity, not commerce.</span>
        </div>
      </footer>
      <AnimatePresence>
        {comparison.length > 0 && pathname !== '/compare' && (
          <motion.div
            className="compare-dock"
            initial={reduced ? false : { y: 90, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 90, opacity: 0 }}
          >
            <GitCompareArrows size={18} />
            <span>{comparison.length} / 4 in comparison</span>
            <Link to="/compare">
              Compare
              <ArrowRight size={16} />
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="toast" role="status" aria-live="polite">
        {notice && <span>{notice}</span>}
      </div>
      {searchOpen && <SearchCommand onClose={() => setSearchOpen(false)} />}
    </>
  );
}
