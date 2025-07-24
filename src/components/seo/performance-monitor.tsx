'use client';

import { useEffect } from 'react';

/**
 * Performance monitoring component for SEO and user experience
 * Tracks Core Web Vitals and other performance metrics
 */
export default function PerformanceMonitor() {
  useEffect(() => {
    // Only run in production and if performance API is available
    if (process.env.NODE_ENV !== 'production' || typeof window === 'undefined') {
      return;
    }

    // Track Core Web Vitals
    const trackWebVitals = () => {
      // Largest Contentful Paint (LCP)
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'largest-contentful-paint') {
            console.log('LCP:', entry.startTime);
            // You can send this to your analytics service
            // analytics.track('LCP', { value: entry.startTime });
          }
        }
      });
      
      try {
        observer.observe({ entryTypes: ['largest-contentful-paint'] });
      } catch {
        // Browser doesn't support this metric
      }

      // First Input Delay (FID) - using First Input Delay polyfill approach
      const fidObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'first-input') {
            const fidEntry = entry as PerformanceEventTiming;
            const fid = fidEntry.processingStart - fidEntry.startTime;
            console.log('FID:', fid);
            // analytics.track('FID', { value: fid });
          }
        }
      });
      
      try {
        fidObserver.observe({ entryTypes: ['first-input'] });
      } catch {
        // Browser doesn't support this metric
      }

      // Cumulative Layout Shift (CLS)
      let clsValue = 0;
      
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const layoutShiftEntry = entry as PerformanceEntry & {
            hadRecentInput?: boolean;
            value?: number;
          };
          if (entry.entryType === 'layout-shift' && !layoutShiftEntry.hadRecentInput) {
            clsValue += layoutShiftEntry.value || 0;
          }
        }
      });
      
      try {
        clsObserver.observe({ entryTypes: ['layout-shift'] });
      } catch {
        // Browser doesn't support this metric
      }

      // Report CLS when the page is about to be unloaded
      const reportCLS = () => {
        console.log('CLS:', clsValue);
        // analytics.track('CLS', { value: clsValue });
      };

      window.addEventListener('beforeunload', reportCLS);
      
      // Also report after a delay to catch most layout shifts
      setTimeout(reportCLS, 5000);

      return () => {
        observer.disconnect();
        fidObserver.disconnect();
        clsObserver.disconnect();
        window.removeEventListener('beforeunload', reportCLS);
      };
    };

    // Track page load performance
    const trackPageLoad = () => {
      window.addEventListener('load', () => {
        // Use setTimeout to ensure all resources are loaded
        setTimeout(() => {
          const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
          
          if (navigation) {
            const metrics = {
              // Time to First Byte
              ttfb: navigation.responseStart - navigation.requestStart,
              // DOM Content Loaded
              domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
              // Full page load
              loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
              // Total page load time
              totalLoadTime: navigation.loadEventEnd - navigation.fetchStart,
            };

            console.log('Page Load Metrics:', metrics);
            // You can send these to your analytics service
            // analytics.track('PageLoad', metrics);
          }
        }, 0);
      });
    };

    // Initialize tracking
    const cleanup = trackWebVitals();
    trackPageLoad();

    return cleanup;
  }, []);

  // This component doesn't render anything
  return null;
}

/**
 * Hook to track custom performance metrics
 */
export function usePerformanceTracking() {
  const trackCustomMetric = (name: string, value: number, unit: string = 'ms') => {
    if (process.env.NODE_ENV === 'production') {
      console.log(`Custom Metric - ${name}:`, value, unit);
      // You can send this to your analytics service
      // analytics.track('CustomMetric', { name, value, unit });
    }
  };

  const startTimer = (name: string) => {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const duration = endTime - startTime;
      trackCustomMetric(name, duration);
      return duration;
    };
  };

  return {
    trackCustomMetric,
    startTimer,
  };
}

/**
 * Component to preload critical resources
 */
export function ResourcePreloader({ resources }: { resources: Array<{ href: string; as: string; type?: string }> }) {
  useEffect(() => {
    resources.forEach(resource => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = resource.href;
      link.as = resource.as;
      if (resource.type) {
        link.type = resource.type;
      }
      document.head.appendChild(link);
    });
  }, [resources]);

  return null;
}