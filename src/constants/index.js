export const ROLES = {
  USER: 'USER',
  ADMIN: 'ADMIN',
};

export const QUESTION_CATEGORIES = [
  { id: 'all', name: 'All Categories', nameKh: 'គ្រប់ប្រភេទ' },
  { id: 'web-dev', name: 'Web Development', nameKh: 'ការអភិវឌ្ឍគេហទំព័រ', icon: 'Globe' },
  { id: 'mobile-dev', name: 'Mobile Dev & Flutter', nameKh: 'កម្មវិធីទូរស័ព្ទ', icon: 'Smartphone' },
  { id: 'spring-java', name: 'Spring Boot & Java', nameKh: 'ចាវ៉ា និង ស្ព្រីងប៊ូត', icon: 'Server' },
  { id: 'database', name: 'Database & SQL', nameKh: 'មូលដ្ឋានទិន្នន័យ', icon: 'Database' },
  { id: 'devops-cloud', name: 'DevOps & Cloud', nameKh: 'ក្លោដ និង ដេវអប', icon: 'Cloud' },
  { id: 'campus-life', name: 'Campus Life & Events', nameKh: 'ជីវិតក្នុងសាកលវិទ្យាល័យ', icon: 'GraduationCap' },
  { id: 'career', name: 'Internship & Career', nameKh: 'កម្មសិក្សា និង ការងារ', icon: 'Briefcase' },
];

export const ITEM_CATEGORIES = [
  { id: 'all', name: 'All Categories', nameKh: 'គ្រប់ប្រភេទ' },
  { id: 'electronics', name: 'Electronics & Laptops', nameKh: 'ឧបករណ៍អេឡិចត្រូនិច', icon: 'Laptop' },
  { id: 'phones', name: 'Smartphones & Tablets', nameKh: 'ទូរស័ព្ទ និង ថេបប្លេត', icon: 'Smartphone' },
  { id: 'id-cards', name: 'Student ID & Cards', nameKh: 'កាតសិស្ស និង អត្តសញ្ញាណប័ណ្ណ', icon: 'CreditCard' },
  { id: 'keys', name: 'Keys & Keychains', nameKh: 'សោ និង បន្តោងសោ', icon: 'Key' },
  { id: 'wallets', name: 'Wallets & Bags', nameKh: 'កាបូបលុយ និង កាតាប', icon: 'Briefcase' },
  { id: 'accessories', name: 'Accessories & Bottles', nameKh: 'ដបទឹក និង សម្ភារៈបន្ទាប់បន្សំ', icon: 'Sparkles' },
  { id: 'documents', name: 'Books & Documents', nameKh: 'សៀវភៅ និង ឯកសារ', icon: 'BookOpen' },
];

export const CAMPUS_LOCATIONS = [
  'ISTAD Main Building - Floor 1',
  'ISTAD Main Building - Floor 2 (Lab 201)',
  'ISTAD Main Building - Floor 3 (Lab 302)',
  'Campus Library & Study Area',
  'Cafeteria & Canteen Area',
  'Ground Floor Parking Lot',
  'Student Lounge & Discussion Room',
  'Auditorium / Conference Hall',
  'Outdoor Garden Courtyard',
];

export const ITEM_STATUS = {
  LOST: 'LOST',
  FOUND: 'FOUND',
  RECOVERED: 'RECOVERED',
  PENDING: 'PENDING',
  CLAIMED: 'CLAIMED',
};

export const CLAIM_STATUS = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  COMPLETED: 'COMPLETED',
};

export const MATCH_STATUS = {
  NEW: 'NEW',
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  REJECTED: 'REJECTED',
};

export const BADGE_TIERS = {
  BRONZE: { label: 'Bronze', color: 'text-amber-700 bg-amber-100 border-amber-300 dark:bg-amber-950/40 dark:text-amber-400' },
  SILVER: { label: 'Silver', color: 'text-slate-700 bg-slate-100 border-slate-300 dark:bg-slate-800 dark:text-slate-300' },
  GOLD: { label: 'Gold', color: 'text-yellow-800 bg-yellow-100 border-yellow-300 dark:bg-yellow-950/40 dark:text-yellow-400' },
  DIAMOND: { label: 'Diamond', color: 'text-blue-700 bg-blue-100 border-blue-300 dark:bg-blue-950/40 dark:text-blue-400' },
};
