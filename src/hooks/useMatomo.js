import MatomoTracker from '@datapunt/matomo-tracker-js';
import configuration from 'shared/services/configuration/configuration';

// Setup Matomo
const urlBase = configuration?.matomo?.urlBase;
const siteId = configuration?.matomo?.siteId;

const useMatomo = () => {
  if (!(urlBase && siteId)) {
    return {};
  }

  const MatomoInstance = new MatomoTracker({
    urlBase,
    siteId,
  });

  return {
    track: MatomoInstance.track,
    trackEvent: MatomoInstance.trackEvent,
    trackEvents: MatomoInstance.trackEvents,
    trackLink: MatomoInstance.trackLink,
    trackPageView: MatomoInstance.trackPageView,
    trackSiteSearch: MatomoInstance.trackSiteSearch,
  };
};

export default useMatomo;
