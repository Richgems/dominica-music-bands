import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    // WCMF data 1997–2025 with proper festival_name and lineup
    const festivals = [
      { festival_name: "World Creole Music Festival", year: 1997, lineup: "Various artists", description: "Festival inaugural year" },
      { festival_name: "World Creole Music Festival", year: 1998, lineup: "Various artists", description: "Festival City" },
      { festival_name: "World Creole Music Festival", year: 1999, lineup: "Various artists", description: "Festival City" },
      { festival_name: "World Creole Music Festival", year: 2000, lineup: "Various artists", description: "Festival City" },
      { festival_name: "World Creole Music Festival", year: 2001, lineup: "Various artists", description: "Festival City" },
      { festival_name: "World Creole Music Festival", year: 2002, lineup: "Various artists", description: "Festival City" },
      { festival_name: "World Creole Music Festival", year: 2003, lineup: "Various artists", description: "Festival City" },
      { festival_name: "World Creole Music Festival", year: 2004, lineup: "Various artists", description: "Festival City" },
      { festival_name: "World Creole Music Festival", year: 2005, lineup: "Various artists", description: "Festival City" },
      { festival_name: "World Creole Music Festival", year: 2006, lineup: "Various artists", description: "Festival City" },
      { festival_name: "World Creole Music Festival", year: 2007, lineup: "Various artists", description: "Festival City" },
      { festival_name: "World Creole Music Festival", year: 2008, lineup: "Various artists", description: "Festival City" },
      { festival_name: "World Creole Music Festival", year: 2009, lineup: "Various artists", description: "Festival City" },
      { festival_name: "World Creole Music Festival", year: 2010, lineup: "Various artists", description: "Festival City" },
      { festival_name: "World Creole Music Festival", year: 2011, lineup: "Various artists", description: "Festival City" },
      { festival_name: "World Creole Music Festival", year: 2012, lineup: "Various artists", description: "Festival City" },
      { festival_name: "World Creole Music Festival", year: 2013, lineup: "Various artists", description: "Festival City" },
      { festival_name: "World Creole Music Festival", year: 2014, lineup: "Various artists", description: "Festival City" },
      { festival_name: "World Creole Music Festival", year: 2015, lineup: "Various artists", description: "Festival City" },
      { festival_name: "World Creole Music Festival", year: 2016, lineup: "Various artists", description: "Festival City" },
      { festival_name: "World Creole Music Festival", year: 2017, lineup: "Various artists", description: "Festival City" },
      { festival_name: "World Creole Music Festival", year: 2018, lineup: "Various artists", description: "Festival City" },
      { festival_name: "World Creole Music Festival", year: 2019, lineup: "Various artists", description: "Festival City" },
      { festival_name: "World Creole Music Festival", year: 2020, lineup: "Various artists (COVID impact)", description: "Festival held virtually/limited" },
      { festival_name: "World Creole Music Festival", year: 2021, lineup: "Various artists", description: "Festival City" },
      { festival_name: "World Creole Music Festival", year: 2022, lineup: "Various artists", description: "Festival City" },
      { festival_name: "World Creole Music Festival", year: 2023, lineup: "Various artists", description: "Festival City" },
      { festival_name: "World Creole Music Festival", year: 2024, lineup: "Various artists", description: "Festival City" },
      { festival_name: "World Creole Music Festival", year: 2025, lineup: "Various artists", description: "Festival City" },
    ];

    await base44.asServiceRole.entities.Festival.bulkCreate(festivals);

    return Response.json({ success: true, created: festivals.length });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});