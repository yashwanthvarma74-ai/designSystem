import { useEffect, useLayoutEffect } from 'react';

// useLayoutEffect warns on the server, so fall back to useEffect there.
export const useIsomorphicLayoutEffect =
  typeof document !== 'undefined' ? useLayoutEffect : useEffect;
