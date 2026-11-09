import type { Scholarship } from "@/lib/domain/types";

const VERIFIED = "2026-11-10";
const CAVEAT_DEADLINE =
  "Deadline not verified for the current cycle. Check the official page.";

/**
 * Official pages were reached on VERIFIED. Descriptions are deliberately general;
 * eligibility, amounts and deadlines change each cycle and must be confirmed.
 */
export const SCHOLARSHIPS: Scholarship[] = [
  {
    id: "daad",
    slug: "daad-scholarship-database",
    name: "DAAD scholarships (Germany)",
    sponsor: "DAAD, the German Academic Exchange Service",
    country: "Germany",
    levels: ["master", "doctoral"],
    fundingType: "Government",
    summary:
      "DAAD runs a searchable database of scholarships for international students and researchers who want to study in Germany. Programmes differ in level, field, and applicant country.",
    whoCanApply:
      "Depends on the individual programme. Many are aimed at postgraduate study, so filter by your degree level first.",
    howToApply:
      "Find a programme in the DAAD database, then follow the application route listed for that programme.",
    nomination: null,
    deadline: null,
    officialUrl:
      "https://www.daad.de/en/study-and-research-in-germany/scholarships/",
    verifiedOn: VERIFIED,
    caveats: [
      "Do not assume a DAAD programme covers bachelor's study. Check each programme's level.",
      CAVEAT_DEADLINE,
    ],
  },
  {
    id: "erasmus-mundus",
    slug: "erasmus-mundus-joint-masters",
    name: "Erasmus Mundus Joint Masters",
    sponsor: "European Union (Erasmus+)",
    country: "European Union",
    levels: ["master"],
    fundingType: "Joint programme",
    summary:
      "Integrated master's programmes delivered by a consortium of universities, with scholarships offered through the individual programmes.",
    whoCanApply:
      "Open to students worldwide who meet each programme's own admission rules. Master's level only.",
    howToApply:
      "Apply directly to the joint master's programme you choose, using the application route on its own website.",
    nomination: null,
    deadline: null,
    officialUrl:
      "https://erasmus-plus.ec.europa.eu/opportunities/opportunities-for-individuals/students/erasmus-mundus-joint-masters",
    verifiedOn: VERIFIED,
    caveats: ["Master's only.", CAVEAT_DEADLINE],
  },
  {
    id: "fulbright",
    slug: "fulbright-foreign-student-program",
    name: "Fulbright Foreign Student Program",
    sponsor: "U.S. Department of State",
    country: "United States",
    levels: ["master", "doctoral"],
    fundingType: "Government",
    summary:
      "A U.S. government programme for graduate study and research in the United States, run through national Fulbright commissions and U.S. embassies.",
    whoCanApply:
      "Eligibility and the application route depend on your country of citizenship. Confirm with the Fulbright commission or U.S. embassy that serves your country.",
    howToApply:
      "Through the Fulbright commission or U.S. embassy in your home country, not through a single global form.",
    nomination: null,
    deadline: null,
    officialUrl: "https://foreign.fulbrightonline.org/",
    verifiedOn: VERIFIED,
    caveats: ["Graduate level.", CAVEAT_DEADLINE],
  },
  {
    id: "gks",
    slug: "global-korea-scholarship",
    name: "Global Korea Scholarship",
    sponsor: "Government of the Republic of Korea",
    country: "South Korea",
    levels: ["bachelor", "master", "doctoral"],
    fundingType: "Government",
    summary:
      "A Korean government scholarship for international students. Information is published on the Study in Korea portal run by the Korean government.",
    whoCanApply:
      "Citizenship and academic conditions apply and differ by application route. Read the current guidelines before preparing documents.",
    howToApply:
      "The route depends on the track (embassy or university). Follow the current guidelines on the Study in Korea portal.",
    nomination: null,
    deadline: null,
    officialUrl: "https://www.studyinkorea.go.kr/en/main.do",
    verifiedOn: VERIFIED,
    caveats: [
      "The link opens the Study in Korea portal home page. Search it for the current scholarship guidelines.",
      CAVEAT_DEADLINE,
    ],
  },
  {
    id: "mext",
    slug: "japanese-government-mext-scholarship",
    name: "Japanese Government (MEXT) Scholarship",
    sponsor: "Government of Japan, via Study in Japan",
    country: "Japan",
    levels: ["bachelor", "master", "doctoral"],
    fundingType: "Government",
    summary:
      "Japan's Study in Japan site lists scholarships for international students, including government-funded programmes.",
    whoCanApply:
      "Varies by programme and by your country. Confirm eligibility on the official page and with the Japanese embassy that serves your country.",
    howToApply:
      "Typically through a Japanese embassy or through a university, depending on the programme. Check the current guidelines.",
    nomination: null,
    deadline: null,
    officialUrl: "https://www.studyinjapan.go.jp/en/planning/scholarships/",
    verifiedOn: VERIFIED,
    caveats: [CAVEAT_DEADLINE],
  },
  {
    id: "vanier",
    slug: "vanier-canada-graduate-scholarships",
    name: "Vanier Canada Graduate Scholarships",
    sponsor: "Government of Canada",
    country: "Canada",
    levels: ["doctoral"],
    fundingType: "Government",
    summary:
      "A Canadian government scholarship for doctoral students at Canadian institutions.",
    whoCanApply:
      "Doctoral candidates. Candidates are nominated by a Canadian institution, so you cannot apply on your own.",
    howToApply:
      "Contact the Canadian university where you plan to do your doctorate about nomination.",
    nomination: "Required. A Canadian institution nominates the candidate.",
    deadline: null,
    officialUrl: "https://vanier.gc.ca/en/home-accueil.html",
    verifiedOn: VERIFIED,
    caveats: ["Doctoral level only.", CAVEAT_DEADLINE],
  },
  {
    id: "swedish-institute",
    slug: "swedish-institute-scholarships",
    name: "Swedish Institute Scholarships",
    sponsor: "Swedish Institute",
    country: "Sweden",
    levels: ["master"],
    fundingType: "Government",
    summary:
      "The Swedish Institute offers scholarships for international students who want to study in Sweden. Programmes differ in who can apply.",
    whoCanApply:
      "Depends on the scheme. Check which countries and levels the current scheme covers.",
    howToApply:
      "Follow the scheme's instructions on the Swedish Institute website. Admission to a Swedish university is usually a separate step.",
    nomination: null,
    deadline: null,
    officialUrl: "https://si.se/en/apply/scholarships/",
    verifiedOn: VERIFIED,
    caveats: [
      "Check the level covered by the current scheme.",
      CAVEAT_DEADLINE,
    ],
  },
  {
    id: "eiffel",
    slug: "eiffel-excellence-scholarship",
    name: "Eiffel Excellence Scholarship",
    sponsor:
      "French Ministry for Europe and Foreign Affairs, via Campus France",
    country: "France",
    levels: ["master", "doctoral"],
    fundingType: "Government",
    summary:
      "A French government scholarship programme for international students at master's and doctoral level, run through Campus France.",
    whoCanApply:
      "Candidates are put forward by French higher education institutions. Individuals do not apply directly.",
    howToApply:
      "Contact the French institution you want to study at about nominating you.",
    nomination: "Required. A French institution submits the application.",
    deadline: null,
    officialUrl:
      "https://www.campusfrance.org/en/eiffel-scholarship-program-of-excellence",
    verifiedOn: VERIFIED,
    caveats: [
      "Check the programme's current status and rules on the official page.",
      CAVEAT_DEADLINE,
    ],
  },
];

export const SCHOLARSHIP_BY_SLUG = new Map(
  SCHOLARSHIPS.map((s) => [s.slug, s]),
);
