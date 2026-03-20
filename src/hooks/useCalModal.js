import { getCalApi } from '@calcom/embed-react';
import { useEffect } from 'react';

/**
 * useCalModal
 * ─────────────────────────────────────────────────────────
 * Initialises the Cal.com embed once per page and returns a
 * openCal() function you can attach to any button/element.
 *
 * Usage:
 *   const openCal = useCalModal();
 *   <button onClick={openCal}>Book Now</button>
 *
 * Replace CAL_LINK below with your actual Cal.com username/event-slug
 * e.g. "rakesh-patel-khushi/consultation"
 */

const CAL_LINK = 'het-patel-adejx8/bookings'; // 👈 Replace with your Cal.com link

export function useCalModal() {
  useEffect(() => {
    (async () => {
      const cal = await getCalApi({ namespace: CAL_LINK });

      cal('ui', {
        // ── Visual theme to match Khushi Films ──────────────────────
        theme: 'dark',
        styles: {
          branding: {
            brandColor: '#ffffff', // white accent — matches your site
          },
        },
        hideEventTypeDetails: false,
        layout: 'month_view',
      });
    })();
  }, []);

  const openCal = async () => {
    const cal = await getCalApi({ namespace: CAL_LINK });
    cal('modal', { calLink: CAL_LINK });
  };

  return openCal;
}
