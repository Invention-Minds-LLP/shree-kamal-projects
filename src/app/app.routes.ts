import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    title: 'Shri Kamal Projects | Pharma, lab & healthcare facility construction, Bengaluru',
    data: { description: 'Layout design, electrical and building construction for pharma, R&D labs, healthcare and diagnostics, from first drawing to handover and maintenance. Bengaluru.' },
    loadComponent: () => import('./pages/home').then((m) => m.Home),
  },
  {
    path: 'services',
    title: 'Services | Shri Kamal Projects',
    data: { description: 'Layout design, electrical, building construction, associated services, final closure and maintenance, run by one contractor.' },
    loadComponent: () => import('./pages/services').then((m) => m.Services),
  },
  {
    path: 'sectors',
    title: 'Sectors | Shri Kamal Projects',
    data: { description: 'Facilities for pharma, R&D labs, healthcare, rehab and polyclinics, and diagnostics. Corporate and industrial clients only.' },
    loadComponent: () => import('./pages/sectors').then((m) => m.Sectors),
  },
  {
    path: 'projects',
    title: 'Projects | Shri Kamal Projects',
    data: { description: '30+ technical facility projects delivered since 2023 across pharma, research, healthcare and diagnostics.' },
    loadComponent: () => import('./pages/projects').then((m) => m.Projects),
  },
  {
    path: 'about',
    title: 'About | Shri Kamal Projects',
    data: { description: 'A Bengaluru engineering and construction firm founded in 2023: about 25 people and 30+ projects for pharma, labs and healthcare.' },
    loadComponent: () => import('./pages/about').then((m) => m.About),
  },
  {
    path: 'contact',
    title: 'Contact | Shri Kamal Projects',
    data: { description: 'Call +91 96069 48076 or email shrikamalprojects@gmail.com. Office at RT Nagar, Bengaluru 560032.' },
    loadComponent: () => import('./pages/contact').then((m) => m.Contact),
  },
  { path: '**', redirectTo: '' },
];
