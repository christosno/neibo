import { useCallback, useEffect, useRef } from "react";

export function useThrottle(
  func: () => void,
  limit: number,
  options?: { trailing: boolean }
): () => void;
export function useThrottle<T>(
  func: (data: T) => void,
  limit: number,
  options?: { trailing: boolean }
): (data: T) => void;
export function useThrottle<T>(
  func: (data?: T) => void,
  limit: number,
  options = { trailing: false }
): (data?: T) => void {
  const lastCall = useRef(0);
  const lastCallTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (lastCallTimer.current) clearTimeout(lastCallTimer.current);
    };
  }, []);

  return useCallback(
    (data?: T) => {
      const now = Date.now();

      if (lastCallTimer.current) clearTimeout(lastCallTimer.current);

      if (now - lastCall.current >= limit) {
        func(data);
      } else if (options.trailing) {
        lastCallTimer.current = setTimeout(() => {
          func(data);
        }, limit);
      }

      lastCall.current = Date.now();
    },
    [func, limit, options.trailing]
  );
}
