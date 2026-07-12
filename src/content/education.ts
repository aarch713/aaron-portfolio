import type { Certification, EducationItem } from "./types";

export const education: EducationItem[] = [
  {
    school: "Georgia Institute of Technology",
    degree: "M.S. in Computer Science",
    detail: "Atlanta, GA",
    year: "Expected 2027",
  },
  {
    school: "San Diego State University",
    degree: "B.S. in Computer Science",
    detail: "Dean's Honors List (GPA 3.5+)",
    year: "Dec 2023",
  },
];

export const certifications: Certification[] = [
  {
    name: "Frontend Developer Career Path",
    issuer: "Scrimba",
    year: "2025",
  },
  {
    name: "Spring by Google (Microservices)",
    issuer: "Coursera",
    year: "2025",
  },
  {
    name: "IBM Full-Stack Developer",
    issuer: "Coursera",
    year: "2024",
  },
];
