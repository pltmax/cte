import React from 'react';
import { EmailDoc } from '@/components/doctypes/EmailDoc';
import { MemoDoc } from '@/components/doctypes/MemoDoc';
import { NoticeDoc } from '@/components/doctypes/NoticeDoc';
import { LetterDoc } from '@/components/doctypes/LetterDoc';
import { AdvertisementDoc } from '@/components/doctypes/AdvertisementDoc';
import { ArticleDoc } from '@/components/doctypes/ArticleDoc';
import { PressReleaseDoc } from '@/components/doctypes/PressReleaseDoc';
import { Part4TalkCard } from '@/components/doctypes/Part4TalkCard';
import { Part4Graphic } from '@/components/doctypes/Part4Graphic';
import type { Part4GraphicDocType } from '@/types/exam';

// ── Sample data from mockexamData/TOEIC ──────────────────────────────────────

const EMAIL_PART7 = `To: Marketing Team
From: Sarah Jenkins
Date: April 5
Subject: New Client Meeting

Dear Team,

Please be advised that our meeting with the representatives from Apex Solutions has been rescheduled. Instead of tomorrow at 10:00 AM, we will now meet on Friday at 2:00 PM in Conference Room B. Please update your calendars accordingly. I will send out the revised agenda by the end of today.`;

const EMAIL_PART6 = `To: David Wu
From: Support@FastWeb.com
Date: March 3
Subject: Your Inquiry #5592

Dear Mr. Wu,

This email is to _______ that we have received your request for a technical support appointment.

Our records show that your internet connection has been _______ for the last 48 hours.

A technician has been assigned to visit your home on Thursday between 1:00 PM and 3:00 PM. _______.

If you need to _______ or cancel this appointment, please call us at least 24 hours in advance.`;

const MEMO_PART6 = `To: All Staff
From: Office Manager
Date: October 12
Subject: New Security Protocol

Starting next Monday, the company will _______ a new security system for the main entrance. All employees must use their updated ID badges to enter the building.

If you have not yet received your new badge, please visit the security desk before Friday. Personnel who do not have a valid badge _______ entry into the facility.

_______, visitors must be pre-registered via the online portal. This ensures that we have a record of everyone on-site in case of an emergency.

_______`;

const NOTICE_PART6 = `Attention Residents of Bluehill Apartments

Please be advised that the annual water pipe inspection is scheduled for Wednesday, Nov 5. Work will begin at 8:00 AM and is _______ to conclude by 4:00 PM.

During this time, you may experience low water pressure or short periods without water. We apologize for any _______ this may cause.

Please ensure that all faucets are turned off tightly before you leave your apartment in the morning. _______, residents should avoid using washing machines during the inspection window.

_______`;

const LETTER_PART6 = `Dear Mr. Tanaka,

Thank you for your interest in the Senior Accountant position at Finstar Corp. We have reviewed your application and were _______ by your extensive experience in the field.

We would like to invite you for an interview at our downtown office. Please let us know if you are _______ on Tuesday afternoon.

The interview will last approximately one hour and will include a short skills assessment. _______.

We look forward to _______ from you soon.

Sincerely,

Finstar Corp Recruitment Team`;

const AD_PART7 = `Gleam & Go Car Wash

Get your vehicle looking like new! We offer full-service interior and exterior cleaning.

Standard Wash: $15
Deluxe Detail: $45 (Includes wax and upholstery steam cleaning)

Special Offer: Visit us on a Tuesday or Wednesday and receive $5 off any service!

Located on Miller Avenue, right next to the public library.`;

const AD_PART6 = `Unlock Your Creative Potential

Are you looking to improve your graphic design skills? The Greenville Art Institute is now _______ applications for its winter semester.

Our courses cover everything from basic color theory to advanced digital illustration. Each class is taught by a professional _______ with years of industry experience.

Classes are held in the evenings to accommodate working professionals. _______. Enroll before December 1st to receive a 15% discount on tuition.

Visit our website today to view the full _______ of available courses.`;

const ARTICLE_PART6 = `Navigating the Modern Workplace

In today's fast-paced corporate environment, effective communication is more _______ than ever.

Many companies are now adopting digital collaboration tools to bridge the gap between remote and in-office staff. These platforms allow teams to share files and ideas _______, regardless of their physical location.

However, technology alone cannot replace the value of face-to-face interaction. _______.

Ultimately, a _______ of both digital and physical communication is the key to a productive team.`;

const PRESS_PART6 = `For Immediate Release

VENTURA, CA — Solar-Tech Solutions announced today that it will _______ a new research facility in the downtown area.

The facility will focus on developing high-efficiency batteries for electric vehicles. This project is expected to create over 200 high-paying jobs for _______ engineers and technicians.

Construction is slated to begin next month and should be completed by the end of the year. _______.

Solar-Tech Solutions remains _______ to providing sustainable energy options for the future.`;

// Part 4 sample talks
const PART4_TALKS: import('@/types/exam').Part4Talk[] = [
  {
    title: 'Voicemail Message',
    text: '',
    graphic_title: null,
    graphic_doctype: null,
    graphic: null,
  },
  {
    title: 'Public Announcement',
    text: '',
    graphic_title: 'Store Directory',
    graphic_doctype: 'directory' as Part4GraphicDocType,
    graphic: {
      'Floor 1': 'Groceries and Bakery',
      'Floor 2': 'Clothing and Shoes',
      'Floor 3': 'Electronics and Appliances',
      'Floor 4': 'Furniture and Home Decor',
    },
  },
  {
    title: 'News Report',
    text: '',
    graphic_title: 'Weather Forecast',
    graphic_doctype: 'weather_chart' as Part4GraphicDocType,
    graphic: {
      Monday: 'Sunny (25°C)',
      Tuesday: 'Rainy (18°C)',
      Wednesday: 'Windy (15°C)',
      Thursday: 'Snowy (2°C)',
    },
  },
  {
    title: 'Business Presentation',
    text: '',
    graphic_title: 'Quarterly Sales Growth',
    graphic_doctype: 'chart' as Part4GraphicDocType,
    graphic: { Q1: '5%', Q2: '12%', Q3: '-2%', Q4: '18%' },
  },
  {
    title: 'Excerpt from a Meeting',
    text: '',
    graphic_title: 'Project Milestones',
    graphic_doctype: 'timeline' as Part4GraphicDocType,
    graphic: {
      Research: 'Completed',
      Prototype: 'In Progress',
      Testing: 'Not Started',
      Production: 'Not Started',
    },
  },
  {
    title: 'Instruction',
    text: '',
    graphic_title: 'Conference Schedule',
    graphic_doctype: 'schedule' as Part4GraphicDocType,
    graphic: {
      '9:00 – 10:00': 'Opening Remarks',
      '10:00 – 11:30': 'Marketing Workshop',
      '11:30 – 1:00': 'Networking Lunch',
      '1:00 – 2:30': 'Financial Planning',
    },
  },
  {
    title: 'Tour Guide',
    text: '',
    graphic_title: 'Museum Floor Plan',
    graphic_doctype: 'floor_plan' as Part4GraphicDocType,
    graphic: {
      'Room A': 'Ancient Egypt',
      'Room B': 'Renaissance Art',
      'Room C': 'Modern Sculpture',
      'Room D': 'Gift Shop',
    },
  },
  {
    title: 'Product Advertisement',
    text: '',
    graphic_title: 'Subscription Plans',
    graphic_doctype: 'table' as Part4GraphicDocType,
    graphic: {
      Basic: '$10/mo (1 device)',
      Family: '$20/mo (5 devices)',
      Premium: '$30/mo (10 devices)',
      Business: '$100/mo (Unlimited)',
    },
  },
];

// Question ranges for each talk
const QUESTION_RANGES = ['71–73', '74–76', '77–79', '80–82', '83–85', '86–88', '89–91', '92–94'];

// ── Layout helpers ────────────────────────────────────────────────────────────

function PartHeader({ part, title }: { part: string; title: string }) {
  return (
    <div className="border-b-2 border-gray-800 mb-6">
      <div className="bg-gray-800 inline-block px-3 py-1 mb-0">
        <span className="text-white text-xs font-bold tracking-widest uppercase">{part}</span>
      </div>
      <h2 className="text-sm font-bold text-gray-800 uppercase tracking-widest mt-2 mb-1">
        {title}
      </h2>
    </div>
  );
}

function DocRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-8">
      <p className="text-xs text-gray-500 font-mono mb-2 tracking-wide">
        doctype: <span className="text-gray-800 font-semibold">{label}</span>
      </p>
      {children}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function DoctypesPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-3xl mx-auto px-6 py-10">

        {/* Page title */}
        <div className="border-b-2 border-gray-800 pb-4 mb-10">
          <h1 className="text-xl font-bold text-gray-900 uppercase tracking-widest">
            Document Type Gallery
          </h1>
          <p className="text-xs text-gray-500 mt-1 tracking-wide">
            Visual components — TOEIC Parts 4, 6 &amp; 7
          </p>
        </div>

        {/* ── PARTS 6 & 7: READING DOCUMENT TYPES ──────────────────────── */}
        <section className="mb-14">
          <PartHeader part="Parts 6 & 7" title="Reading Document Types" />

          <DocRow label="email (Part 7 — no blanks)">
            <EmailDoc text={EMAIL_PART7} />
          </DocRow>

          <DocRow label="email (Part 6 — with blanks)">
            <EmailDoc text={EMAIL_PART6} withBlanks />
          </DocRow>

          <DocRow label="memo (Part 6 — with blanks)">
            <MemoDoc text={MEMO_PART6} withBlanks />
          </DocRow>

          <DocRow label="notice (Part 6 — with blanks)">
            <NoticeDoc text={NOTICE_PART6} withBlanks />
          </DocRow>

          <DocRow label="letter (Part 6 — with blanks)">
            <LetterDoc text={LETTER_PART6} withBlanks />
          </DocRow>

          <DocRow label="advertisement (Part 7 — no blanks)">
            <AdvertisementDoc text={AD_PART7} />
          </DocRow>

          <DocRow label="advertisement (Part 6 — with blanks)">
            <AdvertisementDoc text={AD_PART6} withBlanks />
          </DocRow>

          <DocRow label="article (Part 6 — with blanks)">
            <ArticleDoc text={ARTICLE_PART6} withBlanks />
          </DocRow>

          <DocRow label="press_release (Part 6 — with blanks)">
            <PressReleaseDoc text={PRESS_PART6} withBlanks />
          </DocRow>
        </section>

        {/* ── PART 4: TALK CARDS ────────────────────────────────────────── */}
        <section className="mb-14">
          <PartHeader part="Part 4" title="Talk Type Cards" />

          {PART4_TALKS.map((talk, i) => (
            <DocRow key={talk.title} label={talk.title}>
              <Part4TalkCard talk={talk} questionRange={QUESTION_RANGES[i]} />
            </DocRow>
          ))}
        </section>

        {/* ── PART 4: GRAPHIC TYPES (standalone) ───────────────────────── */}
        <section>
          <PartHeader part="Part 4 — Graphics" title="Graphic Insert Types" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {([
              {
                title: 'Store Directory',
                doctype: 'directory' as Part4GraphicDocType,
                data: { 'Floor 1': 'Groceries & Bakery', 'Floor 2': 'Clothing & Shoes', 'Floor 3': 'Electronics', 'Floor 4': 'Furniture' },
              },
              {
                title: 'Weather Forecast',
                doctype: 'weather_chart' as Part4GraphicDocType,
                data: { Monday: 'Sunny (25°C)', Tuesday: 'Rainy (18°C)', Wednesday: 'Windy (15°C)', Thursday: 'Snowy (2°C)' },
              },
              {
                title: 'Conference Schedule',
                doctype: 'schedule' as Part4GraphicDocType,
                data: { '9:00–10:00': 'Opening Remarks', '10:00–11:30': 'Workshop', '11:30–13:00': 'Lunch', '13:00–14:30': 'Finance Session' },
              },
              {
                title: 'Quarterly Sales Growth',
                doctype: 'chart' as Part4GraphicDocType,
                data: { Q1: '5%', Q2: '12%', Q3: '-2%', Q4: '18%' },
              },
              {
                title: 'Project Milestones',
                doctype: 'timeline' as Part4GraphicDocType,
                data: { Research: 'Completed', Prototype: 'In Progress', Testing: 'Not Started', Production: 'Not Started' },
              },
              {
                title: 'Museum Floor Plan',
                doctype: 'floor_plan' as Part4GraphicDocType,
                data: { 'Room A': 'Ancient Egypt', 'Room B': 'Renaissance Art', 'Room C': 'Modern Sculpture', 'Room D': 'Gift Shop' },
              },
              {
                title: 'Subscription Plans',
                doctype: 'table' as Part4GraphicDocType,
                data: { Basic: '$10/mo (1 device)', Family: '$20/mo (5 devices)', Premium: '$30/mo (10 devices)', Business: '$100/mo (Unlimited)' },
              },
            ] as { title: string; doctype: Part4GraphicDocType; data: Record<string, string> }[]).map((g) => (
              <div key={g.doctype} className="border border-gray-800 bg-white overflow-hidden">
                <Part4Graphic title={g.title} doctype={g.doctype} data={g.data} />
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
