"use client";

import React from "react";

export function JsonLd() {
  const siteUrl = "https://fahedmbarek.com";

  // 1. Person Schema — Primary entity representation for Google Knowledge Graph
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${siteUrl}/#person`,
    name: "Fahed Mbarek",
    givenName: "Fahed",
    familyName: "Mbarek",
    alternateName: ["Fahed Mbarek Software Engineer", "Fahed Mbarek Full-Stack Developer"],
    gender: "Male",
    birthDate: "2000-11-14",
    birthPlace: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Gafsa",
        addressCountry: "Tunisia",
      },
    },
    nationality: {
      "@type": "Country",
      name: "Tunisia",
    },
    jobTitle: "Full-Stack Software Engineer & AI Systems Architect",
    description:
      "Full-Stack Software Engineer with a National Engineering Diploma and Data Science background. Specializing in scalable Java/Spring Boot microservices, modern Next.js/React web platforms, and AI-enabled integrations with 3+ years of client delivery.",
    url: siteUrl,
    image: `${siteUrl}/assets/lanyard/fahed_badge.svg`,
    sameAs: [
      "https://github.com/Fahedmb",
      "https://linkedin.com/in/fahed-mbarek",
      "https://www.youtube.com/@fahedmb",
    ],
    knowsAbout: [
      "Software Engineering",
      "Full-Stack Web Development",
      "Distributed Systems",
      "Microservices Architecture",
      "Java",
      "Spring Boot",
      "Next.js",
      "React",
      "TypeScript",
      "Python",
      "Artificial Intelligence",
      "Machine Learning",
      "Data Science",
      "Docker",
      "RESTful APIs",
      "PostgreSQL",
      "MongoDB",
      "Tailwind CSS",
      "Angular",
    ],
    alumniOf: [
      {
        "@type": "EducationalOrganization",
        name: "TEK-UP University",
        description: "National Engineering Diploma in Software Engineering (2025)",
      },
      {
        "@type": "EducationalOrganization",
        name: "ISET Gafsa",
        description: "Bachelor's in Information Systems Development (DSI) (2022)",
      },
    ],
    hasCredential: [
      {
        "@type": "EducationalOccupationalCredential",
        name: "National Engineering Diploma in Software Engineering",
        credentialCategory: "degree",
        recognizedBy: {
          "@type": "EducationalOrganization",
          name: "TEK-UP University",
        },
      },
      {
        "@type": "EducationalOccupationalCredential",
        name: "Bachelor's Degree in Information Systems Development (DSI)",
        credentialCategory: "degree",
        recognizedBy: {
          "@type": "EducationalOrganization",
          name: "ISET Gafsa",
        },
      },
    ],
    contactPoint: {
      "@type": "ContactPoint",
      email: "fahed.mbarek.eng@gmail.com",
      contactType: "professional / freelance inquiries",
      availableLanguage: ["English", "French", "Arabic"],
    },
  };

  // 2. ProfilePage Schema — Signals Google this is the authoritative personal portfolio
  const profilePageSchema = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${siteUrl}/#webpage`,
    url: siteUrl,
    name: "Fahed Mbarek // Full-Stack Software Engineer & AI Systems Portfolio",
    isPartOf: {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      name: "Fahed Mbarek Portfolio",
      url: siteUrl,
    },
    about: {
      "@id": `${siteUrl}/#person`,
    },
    mainEntity: {
      "@id": `${siteUrl}/#person`,
    },
    description:
      "Official portfolio of Fahed Mbarek, Full-Stack Software Engineer specializing in distributed microservices, Next.js web applications, and AI integrations.",
  };

  // 3. WebSite Schema with Site Search Potential
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    url: siteUrl,
    name: "Fahed Mbarek Portfolio",
    description:
      "Interactive 3D portfolio and software engineering showcase of Fahed Mbarek.",
    publisher: {
      "@id": `${siteUrl}/#person`,
    },
    inLanguage: "en-US",
  };

  // 4. FAQPage Schema — Direct questions and answers for Google Rich Snippets
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Who is Fahed Mbarek?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Fahed Mbarek is a Full-Stack Software Engineer and AI Systems Specialist with a National Engineering Diploma from TEK-UP University and a Data Science background. He specializes in building distributed Java/Spring Boot microservices, high-performance Next.js/React applications, and AI integrations.",
        },
      },
      {
        "@type": "Question",
        name: "What is Fahed Mbarek's educational background?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Fahed Mbarek obtained his High School Diploma in Computer Science in 2019, earned a Bachelor's in Information Systems Development (DSI) from ISET Gafsa in 2022, completed M1 studies in Data Science in 2023, and graduated with a National Engineering Diploma in Software Engineering from TEK-UP University in 2025.",
        },
      },
      {
        "@type": "Question",
        name: "What tech stack and engineering specializations does Fahed Mbarek have?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Fahed Mbarek specializes in Full-Stack development and Distributed Systems including Java, Spring Boot, Spring Cloud, Next.js, React, TypeScript, Python, Angular, Docker, PostgreSQL, MongoDB, microservices architecture, OAuth2/JWT security, and LLM/AI integrations.",
        },
      },
      {
        "@type": "Question",
        name: "What enterprise projects has Fahed Mbarek built?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Fahed Mbarek has engineered major enterprise platforms including CertifUp (Microservices Certification & Testing Platform), CPG Enterprise TMS (Rail Freight Fleet Management System with real-time telemetry), YAZAKI Talent Platform (Automated Talent Assessment & Recruitment Matrix), and an Enterprise HR Management Platform.",
        },
      },
      {
        "@type": "Question",
        name: "How can I contact or hire Fahed Mbarek?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "You can contact Fahed Mbarek via email at fahed.mbarek.eng@gmail.com, through the interactive transmission form on his official portfolio (https://fahedmbarek.com), or via his GitHub (https://github.com/Fahedmb) and LinkedIn profiles.",
        },
      },
    ],
  };

  // 5. ItemList of Projects / Software Applications
  const projectsSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Software Engineering Projects by Fahed Mbarek",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        item: {
          "@type": "SoftwareApplication",
          name: "CertifUp — Certification & Testing Platform",
          applicationCategory: "BusinessApplication",
          operatingSystem: "Web / Cloud",
          description:
            "Distributed microservices certification exam platform with automated anti-cheat monitoring, dynamic question banks, and instant grading.",
          author: {
            "@id": `${siteUrl}/#person`,
          },
        },
      },
      {
        "@type": "ListItem",
        position: 2,
        item: {
          "@type": "SoftwareApplication",
          name: "CPG Enterprise TMS — Rail Logistics Management",
          applicationCategory: "BusinessApplication",
          operatingSystem: "Web / Enterprise",
          description:
            "Industrial transport management system optimizing railcar assignment, maintenance scheduling, and phosphate freight dispatching across national rail corridors.",
          author: {
            "@id": `${siteUrl}/#person`,
          },
        },
      },
      {
        "@type": "ListItem",
        position: 3,
        item: {
          "@type": "SoftwareApplication",
          name: "YAZAKI Talent Platform — Automotive HR Automation",
          applicationCategory: "BusinessApplication",
          operatingSystem: "Web / Enterprise",
          description:
            "Automated recruitment and skill matrix platform for automotive wire harness manufacturing plants.",
          author: {
            "@id": `${siteUrl}/#person`,
          },
        },
      },
      {
        "@type": "ListItem",
        position: 4,
        item: {
          "@type": "SoftwareApplication",
          name: "Enterprise HR Management Platform",
          applicationCategory: "BusinessApplication",
          operatingSystem: "Web / Enterprise",
          description:
            "Multi-tenant human resources operations platform featuring automated payroll calculation, leave approval workflows, and biometric attendance sync.",
          author: {
            "@id": `${siteUrl}/#person`,
          },
        },
      },
    ],
  };

  const escapeJsonLd = (data: unknown) =>
    JSON.stringify(data).replace(/</g, "\\u003c");

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: escapeJsonLd(personSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: escapeJsonLd(profilePageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: escapeJsonLd(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: escapeJsonLd(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: escapeJsonLd(projectsSchema) }}
      />
    </>
  );
}
