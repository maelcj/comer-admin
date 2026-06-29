'use client';

import { LazyMotion } from 'framer-motion';

const loadFeaturesAsync = async () => import('./features').then((res) => res.default);

// ----------------------------------------------------------------------

export function MotionLazy({ children }) {
  return (
    <LazyMotion strict={false} features={loadFeaturesAsync}>
      {children}
    </LazyMotion>
  );
}
