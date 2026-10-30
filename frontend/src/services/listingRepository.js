import { campusRepository } from "./campusRepository.js";

// Compatibility facade for an eventual HTTP repository with the same contract.
export const listingRepository = {
  async getAll() {
    return campusRepository.getSnapshot().listings;
  },
  async create(input) {
    return campusRepository.createListing(input).listings[0];
  },
  async update(id, input) {
    return campusRepository
      .updateListing(id, input)
      .listings.find((item) => item.id === id);
  },
};
