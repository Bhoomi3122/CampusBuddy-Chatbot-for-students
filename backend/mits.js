const mitsKnowledge = [
  {
    query: "what is mits|about mits|mits gwalior|madhav institute",
    response: "MITS Gwalior (Madhav Institute of Technology & Science) is a premier engineering college in Madhya Pradesh, India..."
  },
  {
    query: "when was mits established|establishment|founded|history",
    response: "MITS Gwalior was established in 1957..."
  },
  {
    query: "courses|programs|degrees|departments",
    response: "MITS Gwalior offers programs like B.Tech, B.Arch, M.Tech, MBA, and Ph.D..."
  },
  {
    query: "vice chancellor|vc|current vc|head of institute",
    response: "The current Vice Chancellor of MITS Gwalior is Dr. R.K. Pandit."
  },
  {
    query: "head of cse|cse department head|cse hod",
    response: "The Head of the CSE Department is Dr. Manish Dixit."
  },
  {
    query: "branches in cse|cse branches|cse department programs",
    response: "The CSE Department has the following branches: CSE and CSD."
  },
  {
    query: "total branches|all branches|list of branches",
    response: "MITS has the following branches: AIDS, AIR, CSE, CSD, CSBS, CSBM, EE, EEIOT, EC, MECH, CHEMICAL, CIVIL, IT, IOT."
  },
  {
    query: "deemed university|naac rating|naac a++|university status",
    response: "MITS is a deemed university with a NAAC A++ accreditation, reflecting its high standards in education and research."
  },
  {
    query: "aicte approved|aicte accreditation|aicte",
    response: "MITS Gwalior is approved by AICTE (All India Council for Technical Education), ensuring compliance with national technical education standards."
  }
];


export function getMITSResponse(query) {
  const lowerQuery = query.toLowerCase();
  for (const item of mitsKnowledge) {
    const patterns = item.query.split("|");
    for (const pattern of patterns) {
      if (lowerQuery.includes(pattern.trim())) return item.response;
    }
  }
  return null;
}
