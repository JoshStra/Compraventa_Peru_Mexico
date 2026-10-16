import { mockListings } from "../data/mockListings";

// Capa temporal: su API asíncrona permite sustituirla por fetch/Axios y una base de datos sin tocar la interfaz.
let listings = [...mockListings];

export const listingRepository = {
  async getAll() {
    return Promise.resolve([...listings]);
  },
  async create(listing) {
    const created = { ...listing, id: `ct-${Date.now()}` };
    listings = [created, ...listings];
    return Promise.resolve(created);
  },
};
