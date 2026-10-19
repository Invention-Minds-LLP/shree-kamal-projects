// Single source of truth for the site's facts.
// Contact details come from the business card; company facts from the client's notes.
// Replace the SAMPLE projects below with real ones as photos and client names arrive.

export const company = {
  name: 'Shri Kamal Projects',
  tagline: 'Pioneer of Engineering Excellence',
  established: 2023,
  team: 25,
  projects: '30+',
  clients: 'Corporate & industrial only',
  city: 'Bengaluru',
};

export const contact = {
  person: 'Satheesh Kamalnath',
  role: 'Technical Advisor',
  phones: [
    { display: '+91 96069 48076', tel: '+919606948076' },
    { display: '+91 98454 30301', tel: '+919845430301' },
  ],
  whatsapp: '919606948076',
  email: 'shrikamalprojects@gmail.com',
  address: [
    '#142/ Soubhagya Nilaya',
    'Kaval Byrasandra, RT Nagar',
    'Bengaluru – 560032',
    'Karnataka, India',
  ],
  mapUrl:
    'https://www.google.com/maps/search/?api=1&query=Soubhagya+Nilaya+Kaval+Byrasandra+RT+Nagar+Bengaluru+560032',
};

export interface Stage {
  id: string;
  code: string;
  name: string;
  short: string;
  detail: string;
  includes: string[];
}

// The lifecycle the firm owns, in order. "Associated services" stays generic
// until the client confirms the exact trades.
export const stages: Stage[] = [
  {
    id: 'layout',
    code: 'L',
    name: 'Layout design',
    short: 'Plan the floor before a wall goes up.',
    detail:
      'We plan room layouts, flow of people and material, and service routes around how your facility has to run, whether that is a production line, a lab bench or a patient corridor.',
    includes: ['Space planning', 'Process & people flow', 'Service routing', 'Drawings for approval'],
  },
  {
    id: 'electrical',
    code: 'E',
    name: 'Electrical',
    short: 'Power and lighting for equipment that cannot stop.',
    detail:
      'Electrical works sized for the equipment, instruments and critical loads your sector runs on, coordinated with the building work so nothing is cut twice.',
    includes: ['Power distribution', 'Lighting', 'Equipment supply points', 'Coordination with civil works'],
  },
  {
    id: 'construction',
    code: 'C',
    name: 'Building construction',
    short: 'Civil and interior works to the approved layout.',
    detail:
      'Building and interior construction carried out to the approved layout, with the finishes and detailing that technical and clinical spaces need.',
    includes: ['Civil works', 'Interior build-out', 'Finishes', 'Site supervision'],
  },
  {
    id: 'services',
    code: 'S',
    name: 'Associated services',
    short: 'Everything else the building depends on.',
    detail:
      'The dependent works a working facility needs, brought under the same contractor so you are not managing a dozen vendors against each other.',
    includes: ['Dependent works coordination', 'Single point of accountability', 'One programme, one site team'],
  },
  {
    id: 'closure',
    code: 'H',
    name: 'Final closure',
    short: 'Handed over complete, not nearly complete.',
    detail:
      'We close out the project: snag lists cleared, documentation handed over, and the facility ready for your team to move in and start work.',
    includes: ['Snag clearance', 'Handover documentation', 'Client walk-through', 'Ready for occupation'],
  },
  {
    id: 'maintenance',
    code: 'M',
    name: 'Maintenance',
    short: 'We stay on after handover.',
    detail:
      'After closure we keep maintaining what we built. The team that knows every cable route is the team you call.',
    includes: ['Planned maintenance', 'Breakdown support', 'Modifications & extensions'],
  },
];

export interface Sector {
  id: string;
  name: string;
  board: string; // display form of the name, with soft hyphens for large sizes
  line: string;
  needs: string[];
  tone: 'navy' | 'yellow' | 'steel' | 'white' | 'ink';
}

export const sectors: Sector[] = [
  {
    id: 'pharma',
    name: 'Pharma',
    board: 'Pharma',
    line: 'Manufacturing and support areas where layout, cleanliness and reliable power decide whether you pass audit.',
    needs: ['Process-led layouts', 'Controlled-area finishes', 'Reliable power to production'],
    tone: 'navy',
  },
  {
    id: 'labs',
    name: 'R&D labs',
    board: 'R&D Labs',
    line: 'Research and testing labs with dense equipment loads, bench services and room to change later.',
    needs: ['Bench & equipment power', 'Flexible layouts', 'Service access'],
    tone: 'yellow',
  },
  {
    id: 'healthcare',
    name: 'Healthcare',
    board: 'Health­care',
    line: 'Hospital and clinical spaces planned around patients, staff movement and critical electrical loads.',
    needs: ['Patient & staff flow', 'Critical loads', 'Clinical finishes'],
    tone: 'steel',
  },
  {
    id: 'rehab',
    name: 'Rehab & polyclinics',
    board: 'Rehab & Poly­clinics',
    line: 'Outpatient, therapy and multi-speciality clinics where accessibility and day-to-day running come first.',
    needs: ['Accessible layouts', 'Consulting & therapy rooms', 'Low-disruption maintenance'],
    tone: 'white',
  },
  {
    id: 'diagnostics',
    name: 'Diagnostics',
    board: 'Diagnos­tics',
    line: 'Imaging and pathology centres where equipment, power quality and sample flow shape the building.',
    needs: ['Equipment-ready rooms', 'Power quality', 'Sample & patient flow'],
    tone: 'ink',
  },
];

export interface Project {
  id: string;
  title: string;
  sector: Sector['id'];
  scope: Stage['id'][];
  location: string;
  status: 'Handed over' | 'Under maintenance' | 'In progress';
  photo?: string; // e.g. '/projects/pharma-block.jpg' placed in /public/projects
  sample: boolean; // true = placeholder, shows the SAMPLE stamp on the site
}

// SAMPLE ENTRIES: placeholders until the client supplies real names and photos.
// Set sample:false once an entry holds real project facts.
export const projects: Project[] = [
  { id: 'p1', title: 'Production block fit-out', sector: 'pharma', scope: ['layout', 'electrical', 'construction', 'closure'], location: 'Karnataka', status: 'Handed over', sample: true },
  { id: 'p2', title: 'Analytical R&D laboratory', sector: 'labs', scope: ['layout', 'electrical', 'construction', 'services', 'closure'], location: 'Bengaluru', status: 'Under maintenance', sample: true },
  { id: 'p3', title: 'Hospital wing refurbishment', sector: 'healthcare', scope: ['electrical', 'construction', 'closure', 'maintenance'], location: 'Bengaluru', status: 'Under maintenance', sample: true },
  { id: 'p4', title: 'Multi-speciality polyclinic', sector: 'rehab', scope: ['layout', 'construction', 'services', 'closure'], location: 'Bengaluru', status: 'Handed over', sample: true },
  { id: 'p5', title: 'Diagnostic imaging centre', sector: 'diagnostics', scope: ['layout', 'electrical', 'construction', 'closure', 'maintenance'], location: 'Karnataka', status: 'Under maintenance', sample: true },
  { id: 'p6', title: 'QC laboratory expansion', sector: 'pharma', scope: ['electrical', 'construction', 'services'], location: 'Karnataka', status: 'In progress', sample: true },
];

export const nav = [
  { path: '/', label: 'Home', board: '01' },
  { path: '/services', label: 'Services', board: '02' },
  { path: '/sectors', label: 'Sectors', board: '03' },
  { path: '/projects', label: 'Projects', board: '04' },
  { path: '/about', label: 'About', board: '05' },
  { path: '/contact', label: 'Contact', board: '06' },
];

export const stageName = (id: string) => stages.find((s) => s.id === id)?.name ?? id;
export const sectorName = (id: string) => sectors.find((s) => s.id === id)?.name ?? id;
