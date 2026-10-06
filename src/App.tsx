import { Route, Routes } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
const Explore = lazy(() => import('./pages/Explore'));
const CarDetail = lazy(() => import('./pages/CarDetail'));
const Brands = lazy(() => import('./pages/Brands'));
const BrandDetail = lazy(() => import('./pages/Brands').then((m) => ({ default: m.BrandDetail })));
const Models = lazy(() => import('./pages/Models'));
const Compare = lazy(() => import('./pages/Compare'));
const Collections = lazy(() => import('./pages/Collections'));
const MyCollection = lazy(() =>
  import('./pages/Collections').then((m) => ({ default: m.MyCollection })),
);
const Countries = lazy(() => import('./pages/Countries'));
const Timeline = lazy(() => import('./pages/Timeline'));
const Technology = lazy(() => import('./pages/Technology'));
const Glossary = lazy(() => import('./pages/Glossary'));
const Data = lazy(() => import('./pages/Data'));
const Credits = lazy(() => import('./pages/Credits'));
const NotFound = lazy(() => import('./pages/NotFound'));

export default function App() {
  return (
    <Suspense
      fallback={
        <div className="route-loading">
          <span className="loading-line" />
          <p className="eyebrow">OPENING THE ARCHIVE</p>
        </div>
      }
    >
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="cars" element={<Explore />} />
          <Route path="cars/:brand/:model/:generation/:variant" element={<CarDetail />} />
          <Route path="brands" element={<Brands />} />
          <Route path="brands/:brand" element={<BrandDetail />} />
          <Route path="models/:brand/:model" element={<Models />} />
          <Route path="models/:brand/:model/:generation" element={<Models />} />
          <Route path="compare" element={<Compare />} />
          <Route path="collection" element={<MyCollection />} />
          <Route path="collections" element={<Collections />} />
          <Route path="collections/:collection" element={<Collections />} />
          <Route path="countries" element={<Countries />} />
          <Route path="countries/:country" element={<Countries />} />
          <Route path="timeline" element={<Timeline />} />
          <Route path="technology" element={<Technology />} />
          <Route path="technology/:topic" element={<Technology />} />
          <Route path="glossary" element={<Glossary />} />
          <Route path="data" element={<Data />} />
          <Route path="credits" element={<Credits />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
