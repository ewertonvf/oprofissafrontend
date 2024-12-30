import { useTransition as useReactTransition, startTransition } from 'react';

export function useTransition() {
  const [isPending, startReactTransition] = useReactTransition();

  const startSafeTransition = (callback: () => void) => {
    startReactTransition(() => {
      startTransition(callback);
    });
  };

  return { isPending, startTransition: startSafeTransition };
}