const patent = (number, title, issueDate, assignee, coInventors = []) => ({
  number,
  title,
  issueDate,
  assignee,
  inventors: ['Gary A. Crocker', ...coInventors],
  url: `https://patents.google.com/patent/${number.replace(/\s|,/g, '')}`,
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

export const PATENTS = [...COMPUTERVISION_PATENTS, ...INTEGRITYWARE_PATENTS];
