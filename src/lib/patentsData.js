const patentUrl = (number) =>
  `https://patents.google.com/patent/${number.replace(/\s|,/g, '')}`;

const patent = (number, title, issueDate, assignee, coInventors = []) => ({
  number,
  title,
  issueDate,
  assignee,
  inventors: ['Gary A. Crocker', ...coInventors],
  url: patentUrl(number),
});

export const COMPUTERVISION_PATENTS = [
  patent('US 5,561,747', 'Boundary evaluation in non-manifold environment', '1996-10-01', 'Computervision Corporation', ['Kevin Weiler', 'William Reinke']),
  patent('US 5,655,063', 'Topology based tolerancing for geometric modeling operations', '1997-08-05', 'Computervision Corporation'),
];

export const INTEGRITYWARE_PATENTS = [
  patent('US 8,810,571', 'Methods and systems for generating continuous surfaces from polygonal data', '2014-08-19', 'IntegrityWare, Inc.'),
  patent('US 8,990,050', 'Systems and methods of updating graphical objects', '2015-03-24', 'IntegrityWare, Inc.'),
  patent('US 8,994,724', 'Methods and systems for generating continuous surfaces from polygonal data', '2015-03-31', 'IntegrityWare, Inc.'),
  patent('US 9,013,480', 'Methods and systems for generating and editing surfaces', '2015-04-21', 'IntegrityWare, Inc.'),
  patent('US 9,047,704', 'Method for filleting 3D mesh edges by subdivision', '2015-06-02', 'IntegrityWare, Inc.'),
  patent('US 9,292,970', 'Systems and methods of retopologizing graphical data', '2016-03-22', 'IntegrityWare, Inc.'),
  patent('US 9,501,868', 'Methods and systems for generating and editing surfaces', '2016-11-22', 'IntegrityWare, Inc.'),
  patent('US 9,563,340', 'Object manipulator and method of object manipulation', '2017-02-07', 'IntegrityWare, Inc.'),
  patent('US 9,639,992', 'Methods and systems for multilevel editing of subdivided polygonal data', '2017-05-02', 'IntegrityWare, Inc.'),
  patent('US 9,691,186', 'Constraint of a subdivided model', '2017-06-27', 'IntegrityWare, Inc.', ['Wei-en Ting']),
  patent('US 9,984,503', 'Systems and methods of updating graphical objects', '2018-05-29', 'IntegrityWare, Inc.'),
  patent('US 11,615,590', 'Methods and systems for generating surfaces from polygonal data', '2023-03-28', 'IntegrityWare, Inc.'),
  patent('US 12,511,833', 'Methods and systems for generating surfaces from polygonal data', '2025-12-30', 'IntegrityWare, Inc.'),
  patent('US 12,511,836', 'Object shelling and hollowing', '2025-12-30', 'IntegrityWare, Inc.'),
];

export const GILL_PATENTS = [
  {
    number: 'US 6,285,369',
    title: 'Electronic notebook for maintaining design information',
    filingDate: '1998-05-12',
    issueDate: '2001-09-04',
    assignee: 'Autodesk, Inc.',
    inventors: [
      'Robert L. Kross',
      'Amy B. Wagreich',
      'Guri A. Stark',
      'David L. Gill',
      'David G. Comfort',
      'William E. Bogan',
    ],
    summary:
      'An integrated electronic design notebook that records design information, intent, and history. It can copy portions of a design into notes and retain changing or dynamically linked design information.',
    url: patentUrl('US 6,285,369'),
  },
  {
    number: 'US 6,496,195',
    title: 'Method and apparatus for automatically displaying and manipulating identifiers of a mechanical design',
    filingDate: '2000-01-31',
    issueDate: '2002-12-17',
    assignee: 'Autodesk, Inc.',
    inventors: ['David L. Gill', 'William E. Bogan', 'Kanan Lozon'],
    summary:
      'Automatically creates and arranges identifiers for geometry visible in a mechanical drawing. In practical CAD terminology, it covers automated drawing callout or balloon placement, grouping, leader placement, and interactive rearrangement.',
    url: patentUrl('US 6,496,195'),
  },
  {
    number: 'US 6,950,113',
    title: 'Method and apparatus for automatically displaying and manipulating identifiers of a mechanical design',
    filingDate: '2002-11-01',
    publicationNumber: 'US 2003/0122849 A1',
    publicationDate: '2003-07-03',
    issueDate: '2005-09-27',
    assignee: 'Autodesk, Inc.',
    inventors: ['David L. Gill', 'William E. Bogan', 'Kanan Lozon'],
    summary:
      'A continuation of the earlier identifier patent, with claims involving generating, ordering, grouping, placing, and interactively manipulating identifiers around a drawing-view boundary.',
    continuationOf: 'US 6,496,195',
    continuationNote:
      'This is a continuation of U.S. Patent 6,496,195 and should not be counted as a third independent invention.',
    url: patentUrl('US 6,950,113'),
  },
];

export const PATENTS = [...COMPUTERVISION_PATENTS, ...INTEGRITYWARE_PATENTS, ...GILL_PATENTS];
