import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    // WCMF data parsed from 1997-2025
    const wcmfData = [
      { festival_name: 'World Creole Music Festival', year: 1997, stage_number: 1, lineup: 'RSB, WCK, Franky Vincent, Ruf Neg, Tabou Combo, Zouk Machine, Magnum Band', description: 'Oct 21st to Nov 2nd – Festival City – Mizik Kwéyòl a tout La Tè' },
      { festival_name: 'World Creole Music Festival', year: 1997, stage_number: 2, lineup: 'Taxi Creole, Ophelia Marie, Nelly Stharre' },
      { festival_name: 'World Creole Music Festival', year: 1997, stage_number: 3, lineup: 'Exile One, First Serenade, Midnight Groovers' },
      { festival_name: 'World Creole Music Festival', year: 1998, stage_number: 1, lineup: 'Apex Band, Phantom Band, Tanya St. Val, Francky Vincent, WCK' },
      { festival_name: 'World Creole Music Festival', year: 1998, stage_number: 2, lineup: 'Chiktay, Buck Wheat Zydeco, Ruff & Reddy, Ashanti, Kassav' },
      { festival_name: 'World Creole Music Festival', year: 1998, stage_number: 3, lineup: 'Zin, First Serenade, Levitation, Aurelus Marbele et Loketo, Grammacks New Generation' },
      { festival_name: 'World Creole Music Festival', year: 1999, stage_number: 1, lineup: 'Boukman Eksperyans, Ruff & Reddy, First Serenade, Nasio Fountaine, De De Saint Prix, Swinging Stars' },
      { festival_name: 'World Creole Music Festival', year: 1999, stage_number: 2, lineup: 'Malavoi, Opheila, Skah Shah # 1, Diblo Dibaia et Matchatcha, Grammack New Generation' },
      { festival_name: 'World Creole Music Festival', year: 1999, stage_number: 3, lineup: 'Mifie, WCK, Zouk All Stars, Exile One, Tabou Combo, Reasons Orchestra' },
      { festival_name: 'World Creole Music Festival', year: 2000, stage_number: 1, lineup: 'Sakis, Cuban Salsa Band, Sweet Mickey, Aswad, First Serenade' },
      { festival_name: 'World Creole Music Festival', year: 2000, stage_number: 2, lineup: 'Kassav, Jean Michael Carbrimol, Nathan & The Zydeco Cha Chas, Akiyo, WCK' },
      { festival_name: 'World Creole Music Festival', year: 2000, stage_number: 3, lineup: 'Top Vice, Kapital, Midnight Groovers, Kadan\'s, Anthony Gussie & Black Affairs Plus, Dominican All Star Band' },
      { festival_name: 'World Creole Music Festival', year: 2001, stage_number: 1, lineup: 'Ti-Vice, Raw Redeem, Aswad Krosfyah' },
      { festival_name: 'World Creole Music Festival', year: 2001, stage_number: 2, lineup: 'Kassav, Swinging Stars, Les Aiglons, Papa Wemba' },
      { festival_name: 'World Creole Music Festival', year: 2001, stage_number: 3, lineup: 'Tabou Combo, Taxi-Creole, WCK, First Serenade, Jean Luc Guanel & Kombo Band' },
      { festival_name: 'World Creole Music Festival', year: 2002, stage_number: 1, lineup: 'WCK, Michele Henderson, Look Us, Sweet Mickey, Typical, Glen Washington', description: 'Pottersville Savannah' },
      { festival_name: 'World Creole Music Festival', year: 2002, stage_number: 2, lineup: 'First Serenade, Square One, Carimi, Tripple Kay, 3KDJOL, Gordon Henderson' },
      { festival_name: 'World Creole Music Festival', year: 2002, stage_number: 3, lineup: 'Impromtu, Midnight Groovers, Top Vice, Skah Shah, Ophelia, Grmmacks New Generation' },
      { festival_name: 'World Creole Music Festival', year: 2003, stage_number: 1, lineup: 'Impromptu, Sweet Micky, Carimi, Swinging Stars, Escale', description: 'Pottersville Savannah' },
      { festival_name: 'World Creole Music Festival', year: 2003, stage_number: 2, lineup: 'Kassav, Buring Flames, Zeglen, Gaylords, Jeff Joseph & Luc Leandre' },
      { festival_name: 'World Creole Music Festival', year: 2003, stage_number: 3, lineup: 'Tabou Combo, Atlantik, Jakito/La Rose, WCK' },
      { festival_name: 'World Creole Music Festival', year: 2004, stage_number: 1, lineup: 'Sweet Micky, Escale, Canela Cuban Salsa Band, First Serenade, Belles Combo', description: 'Pottersville Savannah' },
      { festival_name: 'World Creole Music Festival', year: 2004, stage_number: 2, lineup: 'Elephant Man, T Vice, Rupee, Michele Henderson, Dominik Coco' },
      { festival_name: 'World Creole Music Festival', year: 2004, stage_number: 3, lineup: 'Carimi, Soukous Stars, Swinging Stars, Seramix, Magnum Band' },
      { festival_name: 'World Creole Music Festival', year: 2005, stage_number: 1, lineup: 'Sizzla, Cool Session Brass, WCK, Ban\'Biyo, Djakout Mizik', description: 'Pottersville Savannah' },
      { festival_name: 'World Creole Music Festival', year: 2005, stage_number: 2, lineup: 'Palenque Son Karibe, Ti Kabzy, Michele Henderson, Liquid Ice, Kassav' },
      { festival_name: 'World Creole Music Festival', year: 2005, stage_number: 3, lineup: 'X-Tatik, Nu-Look, Monique Seca, Midnight Groovers, Patrick St. Eloi' },
      { festival_name: 'World Creole Music Festival', year: 2006, stage_number: 1, lineup: 'Shaggy, Royalty Band, WCK, T-Vice, Zouk Flam', description: 'Pottersville Savannah' },
      { festival_name: 'World Creole Music Festival', year: 2006, stage_number: 2, lineup: 'Wyckef Jean, Triple Kay Int, Djakout, Swinging Stars, Sakis' },
      { festival_name: 'World Creole Music Festival', year: 2006, stage_number: 3, lineup: 'Byron Lee and the Dragonaires, Impromptu Band, Tabou Combo, Carimi, Admiral T.' },
      { festival_name: 'World Creole Music Festival', year: 2007, stage_number: 1, lineup: 'Top Vice, King Mensah, Kadans, Beenie Man, Triple Kay Int., Manu Dibango', description: 'Windsor Park Sports Stadium' },
      { festival_name: 'World Creole Music Festival', year: 2007, stage_number: 2, lineup: 'Skah Shah # 1, Djunny Claude, Beres Hammond, Shurwayne Winchester, WCK' },
      { festival_name: 'World Creole Music Festival', year: 2007, stage_number: 3, lineup: 'Bamboolaz, Michele Henderson, Kassav, Midnight Groovers, Grammacks Int.' },
      { festival_name: 'World Creole Music Festival', year: 2008, stage_number: 1, lineup: 'Grammack, Oliver N\'Goma, Nasio Fontaine, Carimi, WCK', description: 'Windsor Park Sports Stadium' },
      { festival_name: 'World Creole Music Festival', year: 2008, stage_number: 2, lineup: 'Swinging Stars, Djakout Mizik, Sean Paul, Tabou Combo, Triple Kay' },
      { festival_name: 'World Creole Music Festival', year: 2008, stage_number: 3, lineup: 'Julie Mourillon, Belles Combo, Kassav, Midnight Groovers, Machel Montano' },
      { festival_name: 'World Creole Music Festival', year: 2009, stage_number: 1, lineup: 'Swinging Stars, La Perfecta, MFR Band, Kassav, Zin & Alan Cave, Machine A Swinger', description: 'Windsor Park Sports Stadium' },
      { festival_name: 'World Creole Music Festival', year: 2009, stage_number: 2, lineup: 'Efex Band, Icons of Zouk, Sweet Mickey, Morgan Heritage, Triple Kay Band, Caribbean Vibes' },
      { festival_name: 'World Creole Music Festival', year: 2009, stage_number: 3, lineup: 'WCK, Cadence Icons, Maxi Priest, Michele Henderson, Roy Cape All Stars, Nature Boys' },
      { festival_name: 'World Creole Music Festival', year: 2010, stage_number: 1, lineup: 'Victor O, Les Aiglon, Kreyola, Luciano, Midnight Groovers', description: 'Windsor Park Sports Stadium' },
      { festival_name: 'World Creole Music Festival', year: 2010, stage_number: 2, lineup: 'Krosfyah, Les Etoiles du Cadence, Mas Compa, Jah Cure, WCK' },
      { festival_name: 'World Creole Music Festival', year: 2010, stage_number: 3, lineup: 'Princess Liver, Orlane, Stefan Ravor, Costuleta and MKG Band, T-Vice, Exile One, Ali Campbell\'s UB40, Triple Kay' },
      { festival_name: 'World Creole Music Festival', year: 2011, stage_number: 1, lineup: 'Cool Session Brass, Ali Campbell, Jeff Joseph & Grammacks New Generation, Harmonik, WCK, Kolo Barst', description: 'Windsor Park Sports Stadium' },
      { festival_name: 'World Creole Music Festival', year: 2011, stage_number: 2, lineup: 'Kassav, Third World, Carimi, Midnight Groovers, Dobet Gnahore\'' },
      { festival_name: 'World Creole Music Festival', year: 2011, stage_number: 3, lineup: 'Swinging Stars, Gyptian, Bunji Darlin & Fay-Ann Lyons, Alex Catherine, Joycelyne Labylle, Triple Kay, Zouk All Stars' },
      { festival_name: 'World Creole Music Festival', year: 2012, stage_number: 1, lineup: 'Zouk All Stars, Kreyola, WCK, Asa Bantan', description: 'Windsor Park Sports Stadium' },
      { festival_name: 'World Creole Music Festival', year: 2012, stage_number: 2, lineup: 'Fanatik with Fredo, Onyan, & Rah, Disip Gazzman, Krosfyah, Triple Kay' },
      { festival_name: 'World Creole Music Festival', year: 2012, stage_number: 3, lineup: 'T-Vice, Damian Marley, Grammacks Original, Michele Henderson, Ophelia Marie, Midnight Groovers' },
      { festival_name: 'World Creole Music Festival', year: 2013, stage_number: 1, lineup: 'Machel Montano, Kwaxikolor, Triple Kay, Nayee, NuLook, Asa Bantan', description: 'Windsor Park Sports Stadium' },
      { festival_name: 'World Creole Music Festival', year: 2013, stage_number: 2, lineup: 'Busy Signal, Bracket, Fitzroy Williams, Zouk Allstars' },
      { festival_name: 'World Creole Music Festival', year: 2013, stage_number: 3, lineup: 'Carimi, Tito Puente Jr, Swinging Stars' },
      { festival_name: 'World Creole Music Festival', year: 2014, stage_number: 1, lineup: 'Jah Cure, All for one Caribbean, Simon Jurad, T-Vice, Soukous Stars, Asa Bantan, Daly, Ridla, Triple Kay', description: 'Windsor Park Sports Stadium' },
      { festival_name: 'World Creole Music Festival', year: 2014, stage_number: 2, lineup: 'Flavour, Harry Soundoureyen, Jim Rama, Paola, Midnight Groovers, Frankie Vincent, Klass, Kerwin Dubois, Denise Belfon, Destra' },
      { festival_name: 'World Creole Music Festival', year: 2014, stage_number: 3, lineup: 'Elvis Crespo, Mavado, Tabou Combo, Extasy Band, Calypsonians, Fanatik, Michele Henderson' },
      { festival_name: 'World Creole Music Festival', year: 2015, stage_number: 0, lineup: '', description: 'Cancelled due to Tropical Storm Erica' },
      { festival_name: 'World Creole Music Festival', year: 2016, stage_number: 1, lineup: 'Timaya, Midnight Groovers, Original Bouyon Pioneers, Kreyolla, La Grand Mechant Zouk, Popcaan, Triple Kay International', description: 'Windsor Park Sports Stadium' },
      { festival_name: 'World Creole Music Festival', year: 2016, stage_number: 2, lineup: 'Extasy, De\'de\' St. Prix, Ophelia, Morgan Heritage, KesTheBand, Mr.Killa, Wyclef Jean, WCK' },
      { festival_name: 'World Creole Music Festival', year: 2016, stage_number: 3, lineup: 'Breve, T-Micky, Gentleman, Michele Henderson, Asa Bantan, Akon' },
      { festival_name: 'World Creole Music Festival', year: 2017, stage_number: 0, lineup: '', description: 'Cancelled due to Hurricane Maria' },
      { festival_name: 'World Creole Music Festival', year: 2018, stage_number: 1, lineup: 'Mavado, Kassav, Yemi Alade, Triple Kay Int, Klass, First Serenade', description: 'Windsor Park Sports Stadium' },
      { festival_name: 'World Creole Music Festival', year: 2018, stage_number: 2, lineup: 'Machel Montano, Asa Bantan, Zouk All Stars, Midnight Groovers, Kai, Marce Et Tumpak' },
      { festival_name: 'World Creole Music Festival', year: 2018, stage_number: 3, lineup: 'Chronix, Sweet Micky, Kes The Band, Mizik A Nou, Signal Band, Swinging Stars' },
      { festival_name: 'World Creole Music Festival', year: 2019, stage_number: 1, lineup: 'ASA Banton, Nu Look, Colton T, Davido, WCK, Patrice Roberts', description: 'Windsor Park Sports Stadium' },
      { festival_name: 'World Creole Music Festival', year: 2019, stage_number: 2, lineup: 'Buju Banton, Bunji Garlin & Fay-Ann Lyons, Gordon Henderson, Ophelia Marie, Linford John, Triple Kay Int, Mel, Princess Lover, Eric Virgal, Oswald, Extasy Band' },
      { festival_name: 'World Creole Music Festival', year: 2019, stage_number: 3, lineup: 'Mr.Killa, Romain Virgo, Etana, Vayb Ft Michael Guirand, Signal Band, Tasha P, Motto' },
      { festival_name: 'World Creole Music Festival', year: 2020, stage_number: 0, lineup: '', description: 'Cancelled due to COVID-19 pandemic' },
      { festival_name: 'World Creole Music Festival', year: 2021, stage_number: 0, lineup: '', description: 'Cancelled due to COVID-19 pandemic' },
      { festival_name: 'World Creole Music Festival', year: 2022, stage_number: 1, lineup: 'Shenseea, Kes The Band, Sizzla, K-dilak & Bedjine, Triple Kay Int, First Serenade, Caryln XP', description: 'Windsor Park Sports Stadium' },
      { festival_name: 'World Creole Music Festival', year: 2022, stage_number: 2, lineup: 'Burna Boy, Omah Lay, Jocelyne Béroard, Dexta Daps, Extacy Band, Triple K Int' },
      { festival_name: 'World Creole Music Festival', year: 2022, stage_number: 3, lineup: 'Patrice Roberts, Reo, Chiré Lakay, Admiral T, Enposib, Midnight Groovers, Christopher Martin' },
      { festival_name: 'World Creole Music Festival', year: 2023, stage_number: 1, lineup: 'Popcaan, DJ Stakz, Patrice Roberts, Michele Henderson, Vayb, Triple K Internationl, Mr.Ridge & Friends, Kenny G', description: 'Windsor Park Sports Stadium' },
      { festival_name: 'World Creole Music Festival', year: 2023, stage_number: 2, lineup: 'Kalash, Beres Hammond, JoeBoy, Tabou Combo, Jean Luc Guanel, Joelle Ursull, Njie, Medhy Custos, Ezra D\'Fun Machine & Jiggy' },
      { festival_name: 'World Creole Music Festival', year: 2023, stage_number: 3, lineup: 'Machel Montano, Jada Kingdom, Ezra, Midnight Groovers' },
      { festival_name: 'World Creole Music Festival', year: 2024, stage_number: 1, lineup: 'Extasy Band, Triple Kay Int, T-Vice, Nadia Batson, Valiant, Rotimi', description: 'Windsor Park Sports Stadium' },
      { festival_name: 'World Creole Music Festival', year: 2024, stage_number: 2, lineup: 'Asa Bantan, Ridge & Pudaz, Kassav, Damain & Stephen Marley, WizKid, Umpa & Subance' },
      { festival_name: 'World Creole Music Festival', year: 2024, stage_number: 3, lineup: 'Kai, Signal Band, Midnight Groovers, Skinny Fabulou, Voice, Tian Winter, Fanny J' },
      { festival_name: 'World Creole Music Festival', year: 2025, stage_number: 1, lineup: 'Masicka, Burning Flames, Giles, Halibut, Oswald, Nulook, Midnight Groovers, Steel Pulse, Romain Virgo, Triple Kay International', description: 'Windsor Park Sports Stadium – Silver Jubilee - 45 bands' },
      { festival_name: 'World Creole Music Festival', year: 2025, stage_number: 2, lineup: 'Vybz Kartel, Spice, Joe Dwet File, Kes, WCK, Gordon Henderson, Ophelia, Linford John, Asa Bantan, First Serenade, Rohie, Ridge, Pudaz, Kenny G, Faithi, Shanika, Ebony Empress, DJ MJ, Little Boy, Quan, Jixels, Ezra D Fun Machine' },
      { festival_name: 'World Creole Music Festival', year: 2025, stage_number: 3, lineup: 'Kehlani, Bunji Garlin, Fay-Ann-Lyons, Tiwa Savage, Kassav, Extasy Band, Michele Henderson, Elisha Benoit, Trilla G, Nice, Red, Signal Band' }
    ];

    const result = await base44.asServiceRole.entities.Festival.bulkCreate(wcmfData);
    return Response.json({ success: true, created: result.length });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});