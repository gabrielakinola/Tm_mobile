import { resolveVenueDisplay } from '@/features/my-events/utils/event-detail';

export const PAYMENT_METHOD_OPTIONS = [
  { label: 'Visa', value: 'Visa' },
  { label: 'Mastercard', value: 'Mastercard' },
  { label: 'American Express', value: 'American Express' },
  { label: 'Discover', value: 'Discover' },
  { label: 'Visa Debit', value: 'Visa Debit' },
  { label: 'Mastercard Debit', value: 'Mastercard Debit' },
] as const;

export interface BillingAddressFields {
  street: string;
  city: string;
  state: string;
  postalCode: string;
}

type StateAddressPool = {
  cities: { city: string; zips: string[] }[];
};

const STATE_NAME_TO_CODE: Record<string, string> = {
  ALABAMA: 'AL',
  ALASKA: 'AK',
  ARIZONA: 'AZ',
  ARKANSAS: 'AR',
  CALIFORNIA: 'CA',
  COLORADO: 'CO',
  CONNECTICUT: 'CT',
  DELAWARE: 'DE',
  FLORIDA: 'FL',
  GEORGIA: 'GA',
  HAWAII: 'HI',
  IDAHO: 'ID',
  ILLINOIS: 'IL',
  INDIANA: 'IN',
  IOWA: 'IA',
  KANSAS: 'KS',
  KENTUCKY: 'KY',
  LOUISIANA: 'LA',
  MAINE: 'ME',
  MARYLAND: 'MD',
  MASSACHUSETTS: 'MA',
  MICHIGAN: 'MI',
  MINNESOTA: 'MN',
  MISSISSIPPI: 'MS',
  MISSOURI: 'MO',
  MONTANA: 'MT',
  NEBRASKA: 'NE',
  NEVADA: 'NV',
  'NEW HAMPSHIRE': 'NH',
  'NEW JERSEY': 'NJ',
  'NEW MEXICO': 'NM',
  'NEW YORK': 'NY',
  'NORTH CAROLINA': 'NC',
  'NORTH DAKOTA': 'ND',
  OHIO: 'OH',
  OKLAHOMA: 'OK',
  OREGON: 'OR',
  PENNSYLVANIA: 'PA',
  'RHODE ISLAND': 'RI',
  'SOUTH CAROLINA': 'SC',
  'SOUTH DAKOTA': 'SD',
  TENNESSEE: 'TN',
  TEXAS: 'TX',
  UTAH: 'UT',
  VERMONT: 'VT',
  VIRGINIA: 'VA',
  WASHINGTON: 'WA',
  'WEST VIRGINIA': 'WV',
  WISCONSIN: 'WI',
  WYOMING: 'WY',
  'DISTRICT OF COLUMBIA': 'DC',
};

const STATE_ADDRESS_POOLS: Record<string, StateAddressPool> = {
  AL: { cities: [{ city: 'Birmingham', zips: ['35203', '35209'] }] },
  AK: { cities: [{ city: 'Anchorage', zips: ['99501', '99508'] }] },
  AZ: {
    cities: [
      { city: 'Phoenix', zips: ['85003', '85016'] },
      { city: 'Tempe', zips: ['85281'] },
    ],
  },
  AR: { cities: [{ city: 'Little Rock', zips: ['72201', '72205'] }] },
  CA: {
    cities: [
      { city: 'West Covina', zips: ['91790', '91791'] },
      { city: 'Inglewood', zips: ['90301', '90305'] },
      { city: 'Los Angeles', zips: ['90012', '90015'] },
      { city: 'San Diego', zips: ['92101', '92103'] },
      { city: 'San Jose', zips: ['95112', '95126'] },
    ],
  },
  CO: { cities: [{ city: 'Denver', zips: ['80202', '80205'] }] },
  CT: { cities: [{ city: 'Hartford', zips: ['06103', '06106'] }] },
  DE: { cities: [{ city: 'Wilmington', zips: ['19801', '19805'] }] },
  DC: { cities: [{ city: 'Washington', zips: ['20001', '20005'] }] },
  FL: {
    cities: [
      { city: 'Miami', zips: ['33101', '33132'] },
      { city: 'Orlando', zips: ['32801', '32805'] },
      { city: 'Tampa', zips: ['33602', '33606'] },
    ],
  },
  GA: { cities: [{ city: 'Atlanta', zips: ['30303', '30308'] }] },
  HI: { cities: [{ city: 'Honolulu', zips: ['96813', '96815'] }] },
  ID: { cities: [{ city: 'Boise', zips: ['83702', '83706'] }] },
  IL: { cities: [{ city: 'Chicago', zips: ['60601', '60611'] }] },
  IN: { cities: [{ city: 'Indianapolis', zips: ['46204', '46220'] }] },
  IA: { cities: [{ city: 'Des Moines', zips: ['50309', '50312'] }] },
  KS: { cities: [{ city: 'Kansas City', zips: ['66101', '66103'] }] },
  KY: { cities: [{ city: 'Louisville', zips: ['40202', '40207'] }] },
  LA: { cities: [{ city: 'New Orleans', zips: ['70112', '70119'] }] },
  ME: { cities: [{ city: 'Portland', zips: ['04101', '04103'] }] },
  MD: { cities: [{ city: 'Baltimore', zips: ['21201', '21218'] }] },
  MA: { cities: [{ city: 'Boston', zips: ['02108', '02116'] }] },
  MI: { cities: [{ city: 'Detroit', zips: ['48201', '48226'] }] },
  MN: { cities: [{ city: 'Minneapolis', zips: ['55401', '55415'] }] },
  MS: { cities: [{ city: 'Jackson', zips: ['39201', '39206'] }] },
  MO: { cities: [{ city: 'St. Louis', zips: ['63101', '63108'] }] },
  MT: { cities: [{ city: 'Billings', zips: ['59101', '59102'] }] },
  NE: { cities: [{ city: 'Omaha', zips: ['68102', '68108'] }] },
  NV: { cities: [{ city: 'Las Vegas', zips: ['89101', '89109'] }] },
  NH: { cities: [{ city: 'Manchester', zips: ['03101', '03104'] }] },
  NJ: { cities: [{ city: 'Newark', zips: ['07102', '07104'] }] },
  NM: { cities: [{ city: 'Albuquerque', zips: ['87102', '87106'] }] },
  NY: {
    cities: [
      { city: 'New York', zips: ['10001', '10011'] },
      { city: 'Brooklyn', zips: ['11201', '11215'] },
      { city: 'Buffalo', zips: ['14201', '14209'] },
    ],
  },
  NC: { cities: [{ city: 'Charlotte', zips: ['28202', '28205'] }] },
  ND: { cities: [{ city: 'Fargo', zips: ['58102', '58103'] }] },
  OH: { cities: [{ city: 'Columbus', zips: ['43215', '43201'] }] },
  OK: { cities: [{ city: 'Oklahoma City', zips: ['73102', '73106'] }] },
  OR: { cities: [{ city: 'Portland', zips: ['97201', '97209'] }] },
  PA: { cities: [{ city: 'Philadelphia', zips: ['19103', '19107'] }] },
  RI: { cities: [{ city: 'Providence', zips: ['02903', '02906'] }] },
  SC: { cities: [{ city: 'Charleston', zips: ['29401', '29403'] }] },
  SD: { cities: [{ city: 'Sioux Falls', zips: ['57104', '57105'] }] },
  TN: { cities: [{ city: 'Nashville', zips: ['37203', '37206'] }] },
  TX: {
    cities: [
      { city: 'Houston', zips: ['77002', '77019'] },
      { city: 'Dallas', zips: ['75201', '75204'] },
      { city: 'Austin', zips: ['78701', '78704'] },
    ],
  },
  UT: { cities: [{ city: 'Salt Lake City', zips: ['84101', '84111'] }] },
  VT: { cities: [{ city: 'Burlington', zips: ['05401', '05408'] }] },
  VA: { cities: [{ city: 'Richmond', zips: ['23219', '23220'] }] },
  WA: { cities: [{ city: 'Seattle', zips: ['98101', '98104'] }] },
  WV: { cities: [{ city: 'Charleston', zips: ['25301', '25304'] }] },
  WI: { cities: [{ city: 'Milwaukee', zips: ['53202', '53211'] }] },
  WY: { cities: [{ city: 'Cheyenne', zips: ['82001', '82007'] }] },
};

const STREET_NAMES = [
  'S Pricedale Ave',
  'N Maple St',
  'W Oak Blvd',
  'E Cedar Ln',
  'Highland Dr',
  'Sunset Ave',
  'Parkview Rd',
  'Lakewood Ct',
  'Meadowbrook Way',
  'Riverside Dr',
];

function pickRandom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)]!;
}

export function parseEventStateCode(venue: string, location?: string): string | null {
  const resolved = resolveVenueDisplay(venue, location).location || venue;
  const trimmed = resolved.trim();
  if (!trimmed) return null;

  const codeMatch = trimmed.match(/,\s*([A-Za-z]{2})(?:\s+\d{5})?$/);
  if (codeMatch) {
    const code = codeMatch[1].toUpperCase();
    if (STATE_ADDRESS_POOLS[code]) return code;
  }

  const trailingCode = trimmed.match(/\s([A-Za-z]{2})$/);
  if (trailingCode) {
    const code = trailingCode[1].toUpperCase();
    if (STATE_ADDRESS_POOLS[code]) return code;
  }

  const upper = trimmed.toUpperCase();
  const names = Object.keys(STATE_NAME_TO_CODE).sort((a, b) => b.length - a.length);
  for (const name of names) {
    if (upper.includes(name)) {
      return STATE_NAME_TO_CODE[name] ?? null;
    }
  }

  return null;
}

export function generateFakeBillingAddress(venue: string, location?: string): BillingAddressFields {
  const parsedState = parseEventStateCode(venue, location);
  const fallbackStates = Object.keys(STATE_ADDRESS_POOLS);
  const state =
    parsedState && STATE_ADDRESS_POOLS[parsedState] ? parsedState : pickRandom(fallbackStates);
  const pool = STATE_ADDRESS_POOLS[state] ?? STATE_ADDRESS_POOLS.CA;
  const cityEntry = pickRandom(pool.cities);
  const number = 100 + Math.floor(Math.random() * 8900);
  const street = `${number} ${pickRandom(STREET_NAMES)}`;

  return {
    street,
    city: cityEntry.city,
    state,
    postalCode: pickRandom(cityEntry.zips),
  };
}

export function sanitizeCardLast4(value: string): string {
  return value.replace(/\D/g, '').slice(0, 4);
}
