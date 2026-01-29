import type { TicketCreator, User } from '../types';

const TICKET_CREATORS: TicketCreator[] = [
  {
    id: '1',
    name: 'Mohd Suboor',
    email: 'mohd.suboor@telecrm.in',
    coPartnerName: 'Zubair',
    coPartnerEmail: 'zubair@telecrm.in',
  },
  {
    id: '2',
    name: 'Saiyid Saqib Askari',
    email: 'saqib.askari@telecrm.in',
    coPartnerName: null,
    coPartnerEmail: null,
  },
  {
    id: '3',
    name: 'Ramsha Farooq',
    email: 'ramsha.farooq@telecrm.in',
    coPartnerName: null,
    coPartnerEmail: null,
  },
  {
    id: '4',
    name: 'Parmeet Kaur',
    email: 'parmeet.kaur@telecrm.in',
    coPartnerName: 'Lovekesh Gautam',
    coPartnerEmail: 'lovekesh.gautam@telecrm.in',
  },
  {
    id: '5',
    name: 'Ibad Ahmad',
    email: 'ibad.ahmad@telecrm.in',
    coPartnerName: 'Shubhra',
    coPartnerEmail: 'shubhra.kamthan@telecrm.in',
  },
  {
    id: '6',
    name: 'Mohammad Ahmad',
    email: 'ahmad@telecrm.in',
    coPartnerName: null,
    coPartnerEmail: null,
  },
  {
    id: '7',
    name: 'Yatendra Chaudhary',
    email: 'yatendra.chaudhary@telecrm.in',
    coPartnerName: 'Mohd Anas',
    coPartnerEmail: 'anas.khan@telecrm.in',
  },
  {
    id: '8',
    name: 'Murad Ali',
    email: 'murad.ali@telecrm.in',
    coPartnerName: 'Akansha Sengar',
    coPartnerEmail: 'akansha.sengar@telecrm.in',
  },
  {
    id: '9',
    name: 'Mohit Kumar 2',
    email: 'mohit@telecrm.in',
    coPartnerName: 'Khan Sabila',
    coPartnerEmail: 'sabila@telecrm.in',
  },
  {
    id: '10',
    name: 'Rahul Mohan Gupta',
    email: 'r@telecrm.in',
    coPartnerName: null,
    coPartnerEmail: null,
  },
  {
    id: '11',
    name: 'Lovekesh Gautam',
    email: 'lovekesh.gautam@telecrm.in',
    coPartnerName: 'Parmeet Kaur',
    coPartnerEmail: 'parmeet.kaur@telecrm.in',
  },
  {
    id: '12',
    name: 'Shubhra',
    email: 'shubhra.kamthan@telecrm.in',
    coPartnerName: 'Ibad Ahmad',
    coPartnerEmail: 'ibad.ahmad@telecrm.in',
  },
  {
    id: '13',
    name: 'Mohd Anas',
    email: 'anas.khan@telecrm.in',
    coPartnerName: 'Yatendra Chaudhary',
    coPartnerEmail: 'yatendra.chaudhary@telecrm.in',
  },
  {
    id: '14',
    name: 'Haroon Usmani',
    email: 'haroon.usmani@telecrm.in',
    coPartnerName: 'Mohd Danish',
    coPartnerEmail: 'danish@telecrm.in',
  },
  {
    id: '15',
    name: 'Yash',
    email: 'yash@telecrm.in',
    coPartnerName: null,
    coPartnerEmail: null,
  },
  {
    id: '16',
    name: 'Mohd Hammad',
    email: 'mohd.hammad@telecrm.in',
    coPartnerName: null,
    coPartnerEmail: null,
  },
  {
    id: '17',
    name: 'Love Varshney',
    email: 'love@telecrm.in',
    coPartnerName: null,
    coPartnerEmail: null,
  },
  {
    id: '18',
    name: 'Zubair',
    email: 'zubair@telecrm.in',
    coPartnerName: 'Mohd Suboor',
    coPartnerEmail: 'mohd.suboor@telecrm.in',
  },
  {
    id: '19',
    name: 'Himanshi Varshney',
    email: 'himanshi@telecrm.in',
    coPartnerName: null,
    coPartnerEmail: null,
  },
  {
    id: '20',
    name: 'Mohammad Ahamad',
    email: 'ahamad@telecrm.in',
    coPartnerName: null,
    coPartnerEmail: null,
  },
  {
    id: '21',
    name: 'Mohd Danish',
    email: 'danish@telecrm.in',
    coPartnerName: 'Haroon Usmani',
    coPartnerEmail: 'haroon.usmani@telecrm.in',
  },
  {
    id: '22',
    name: 'Akansha Sengar',
    email: 'akansha.sengar@telecrm.in',
    coPartnerName: 'Murad Ali',
    coPartnerEmail: 'murad.ali@telecrm.in',
  },
  {
    id: '23',
    name: 'Khan Sabila',
    email: 'sabila@telecrm.in',
    coPartnerName: 'Mohit Kumar 2',
    coPartnerEmail: 'mohit@telecrm.in',
  },
  {
    id: '24',
    name: 'Mohit Kumar',
    email: 'mohit.kumar@telecrm.in',
    coPartnerName: null,
    coPartnerEmail: null,
  },
]


const CUSTOMER_SUCCESS_TEAM_MEMBERS: User[] = [
  {
    id: '1',
    name: 'Mohd Suboor',
    email: 'mohd.suboor@telecrm.in',
  },
  {
    id: '2',
    name: 'Sajid Saqib Askari',
    email: 'saqib.askari@telecrm.in',
  },
  {
    id: '3',
    name: 'Ramsha Farooq',
    email: 'ramsha.farooq@telecrm.in',
  },
  {
    id: '4',
    name: 'Parmeet Kaur',
    email: 'parmeet.kaur@telecrm.in',
  },

  {
    id: '6',
    name: 'Ibad Ahmad',
    email: 'ibad.ahmad@telecrm.in',
  },
  {
    id: "7",
    name: 'Yatendra Chaudhary',
    email: 'yatendra.chaudhary@telecrm.in',
  },
  {
    id: "8",
    name: 'Murad Ali',
    email: 'murad.ali@telecrm.in',
  },
  {
    id: "9",
    name: 'Mohit Kumar 2',
    email: 'mohit@telecrm.in',
  },
  {
    id: '10',
    name: 'Workspace',
    email: 'h@telecrm.in',
  },
  {
    id: '11',
    name: 'Lovekesh Gautam',
    email: 'lovekesh.gautam@telecrm.in',
  },
  {
    id: '12',
    name: 'Haroon Usmani',
    email: 'haroon.usmani@telecrm.in',
  },
  {
    id: '13',
    name: 'Yash',
    email: 'yash@telecrm.in',
  },
  {
    id: '14',
    name: 'Mohd Hammad',
    email: 'mohd.hammad@telecrm.in',
  },
  {
    id: '15',
    name: 'Love Varshney',
    email: 'love@telecrm.in',
  },
  {
    id: '17',
    name: 'Mohammad Ahamad',
    email: 'ahamad@telecrm.in',
  },
  {
    id: '18',
    name: 'Mohd Danish',
    email: 'danish@telecrm.in',
  },
  {
    id: '19',
    name: 'Himanshi Varshney',
    email: 'himanshi@telecrm.in',
  },
  {
    id: '20',
    name: 'Akansha Sengar',
    email: 'akansha.sengar@telecrm.in',
  },
  {
    id: '21',
    name: 'Rahul Mohan Gupta',
    email: 'r@telecrm.in',
  }
];

export { TICKET_CREATORS, CUSTOMER_SUCCESS_TEAM_MEMBERS };
