import type { Event } from './types';

export const events: Event[] = [
  {
    id: '1',
    title: 'Summer Music Fest',
    description:
      'Join us for a three-day celebration of music under the sun. Featuring top artists from around the world, food trucks, and art installations. An experience you won\'t forget!',
    date: '2024-08-15',
    time: '14:00',
    location: 'Sunset Park, Meadowville',
    organizer: 'Music Lovers Inc.',
    category: 'Music',
    image: 'event-1',
  },
  {
    id: '2',
    title: 'Modern Art Exhibition',
    description:
      'Explore the future of art with stunning pieces from emerging contemporary artists. The exhibition includes interactive digital art, sculptures, and paintings that challenge perception.',
    date: '2024-09-05',
    time: '10:00',
    location: 'The Canvas Gallery, Art District',
    organizer: 'Art Forward',
    category: 'Art',
    image: 'event-2',
  },
  {
    id: '3',
    title: 'Gourmet Food Fair',
    description:
      'A paradise for foodies! Sample delicious creations from over 50 local and international chefs. Live cooking demonstrations and workshops available throughout the day.',
    date: '2024-09-21',
    time: '11:00',
    location: 'Central Plaza, Downtown',
    organizer: 'TasteMakers',
    category: 'Food',
    image: 'event-3',
  },
  {
    id: '4',
    title: 'Community Park Cleanup',
    description:
      'Let\'s make our city greener! Join our volunteer event to clean up and plant new trees in our local park. A great way to meet neighbors and contribute to the community.',
    date: '2024-10-12',
    time: '09:00',
    location: 'Greenleaf Community Park',
    organizer: 'Greenleaf Volunteers',
    category: 'Community',
    image: 'event-4',
  },
  {
    id: '5',
    title: 'Future of Tech Summit',
    description:
      'A two-day summit for tech enthusiasts, developers, and entrepreneurs. Hear from industry leaders about AI, blockchain, and the next wave of innovation. Networking opportunities included.',
    date: '2024-11-01',
    time: '09:30',
    location: 'Innovation Hub Convention Center',
    organizer: 'TechVisionaries',
    category: 'Tech',
    image: 'event-5',
  },
  {
    id: '6',
    title: 'An Evening of Classical Music',
    description:
      'Experience the timeless beauty of classical music performed by the renowned City Philharmonic Orchestra. The program includes masterpieces by Mozart, Beethoven, and Bach.',
    date: '2024-10-25',
    time: '19:30',
    location: 'Symphony Hall, Cultural Center',
    organizer: 'City Philharmonic',
    category: 'Music',
    image: 'event-6',
  },
  {
    id: '7',
    title: 'Harvest Farmers Market',
    description:
      'Celebrate the autumn harvest with fresh, locally grown produce, artisanal cheeses, and handmade crafts. A perfect family outing with live folk music and activities for kids.',
    date: '2024-09-28',
    time: '08:00',
    location: 'The Old Mill, Rivertown',
    organizer: 'Rivertown Community',
    category: 'Food',
    image: 'event-7',
  },
  {
    id: '8',
    title: 'Pottery & Clay Workshop',
    description:
      'Unleash your creativity in our hands-on pottery workshop. Learn the basics of wheel throwing and hand-building from an expert artist. All materials provided, no experience necessary.',
    date: '2024-08-24',
    time: '13:00',
    location: 'The Clay Studio, Arts & Crafts Village',
    organizer: 'Creative Hands',
    category: 'Art',
    image: 'event-8',
  },
];

export const eventCategories: Event['category'][] = ['Music', 'Art', 'Food', 'Community', 'Tech'];
