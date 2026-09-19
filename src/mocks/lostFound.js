export const mockLostFoundStats = [
  { key: 'total', title: 'Total Reports', value: 741 },
  { key: 'open', title: 'Open Reports', value: 168 },
  { key: 'claims', title: 'Claims', value: 96 },
  { key: 'matches', title: 'Matches', value: 46 },
]

export const mockLostFoundReports = [
  { id: 'lf1', item: 'Student ID card', reporter: 'Rithy Heng', location: 'Building C, Lobby', date: '2026-09-09', status: 'Open' },
  { id: 'lf2', item: 'Black umbrella', reporter: 'Sreymom Kea', location: 'Library, 2nd floor', date: '2026-09-07', status: 'Matched' },
  { id: 'lf3', item: 'USB-C charger', reporter: 'Dara Poeun', location: 'Engineering Hall', date: '2026-09-05', status: 'Claimed' },
  { id: 'lf4', item: 'Blue water bottle', reporter: 'Vanna Ly', location: 'Cafeteria', date: '2026-09-01', status: 'Closed' },
]

export const mockLocations = [
  { id: 'loc1', name: 'Engineering Hall', reports: 128, rooms: 42, floors: 6 },
  { id: 'loc2', name: 'Main Library', reports: 96, rooms: 16, floors: 4 },
  { id: 'loc3', name: 'Student Center', reports: 74, rooms: 20, floors: 3 },
]