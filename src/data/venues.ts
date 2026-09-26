// -----------------------------------------------------------------
//  Venue sponsors -- the "About the Venue Sponsor" blurb shown on the
//  next-meetup card. Keyed by the event's `venue` name. A venue that
//  isn't listed here simply shows no sponsor blurb.
// -----------------------------------------------------------------

export interface VenueSponsor {
  about: string;
  url: string;
  urlLabel: string;
}

export const venueSponsors: Record<string, VenueSponsor> = {
  Nerdery: {
    about:
      "Nerdery is a digital solutions provider with over 20 years of experience building business-critical software for when off-the-shelf solutions won't work and failure is not an option. As a strategic ally, we provide the Digital Strategy, System Modernization, and AI Optimization needed to bridge the gap between executive vision and technical execution.",
    url: 'https://www.nerdery.com',
    urlLabel: 'nerdery.com',
  },
};

export function getVenueSponsor(venue: string): VenueSponsor | undefined {
  return venueSponsors[venue];
}
