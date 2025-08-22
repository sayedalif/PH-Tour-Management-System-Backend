import { ITour, ITourType } from './tour.interface';
import { Tour, TourType } from './tour.model';

// Tours
const createTour = async (payload: ITour) => {
  const existingTour = await Tour.findOne({ title: payload.title });
  if (existingTour) {
    throw new Error('A tour with this title already exists.');
  }

  const baseSlug = payload.title.toLowerCase().split(' ').join('-');
  let slug = `${baseSlug}`;

  let counter = 0;
  while (await Tour.exists({ slug })) {
    slug = `${slug}-${counter++}`; // dhaka-division-2
  }

  payload.slug = slug;

  const tour = await Tour.create(payload);

  return tour;
};

// Tour Types

const createTourType = async (payload: ITourType) => {
  const existingTourType = await TourType.findOne({ name: payload });

  if (existingTourType) {
    throw new Error('Tour type already exists.');
  }

  return await TourType.create({ name: payload });
};

export const TourService = {
  createTour,
  createTourType,
};
