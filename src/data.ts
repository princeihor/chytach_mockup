/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Article, TopicOverview } from './types';

export const CORE_TOPICS = [
  'Modernism',
  'Village life',
  'Kharkiv',
  'Women’s education',
  'Theatre'
] as const;

export const TOPICS_OVERVIEWS: Record<string, TopicOverview> = {
  'Modernism': {
    topic: 'Modernism',
    articlesCount: 42,
    issuesCount: 18,
    publicationsCovered: 8,
    yearRange: '1910 - 1938',
    avgOcrConfidence: 0.81,
    narrativeText: {
      Researcher: 'Representations of Modernism in this interwar collection expose a fierce aesthetic debate between traditional Lviv-centered craftsmanship and Kharkiv\'s rapid, futuristic constructivism. The corpus traces how typography, stream-of-consciousness, and feminist theory challenged conservative Eastern European canons.',
      Editor: 'Modernism offers a goldmine of stories covering local rivalries, banned graphic design, and underground bohemian circles. Focus on the legendary clash between Lviv traditionalists and Kharkiv avant-garde futurists around the winter of 1928.',
      Archivist: 'The Modernism sub-corpus features visually exquisite journals but suffers from low OCR fidelity (average 81%) on stylized cyrillic fonts and diagonal text placements. Many constructivist journals require manual metadata remediation due to non-traditional layouts.'
    }
  },
  'Village life': {
    topic: 'Village life',
    articlesCount: 38,
    issuesCount: 25,
    publicationsCovered: 11,
    yearRange: '1902 - 1985',
    avgOcrConfidence: 0.88,
    narrativeText: {
      Researcher: 'Village life in this corpus stands as a crucial battleground for identity: first as a source of preserved Galician agrarian customs, then as a focal point for massive mid-century Soviet collectivization and rural literacy drives. The documents reflect local peasant cooperative schemes.',
      Editor: 'Explore how rural Carpathian weaving and embroidery associations transformed from simple craft guilds into highly organized, covert economic networks that funded independent primary education under foreign regimes.',
      Archivist: 'This segment boasts high OCR confidence (88%) but lacks author attributions on over 45% of correspondence reports. Physical conditions vary dramatically; local agrarian newsletters printed on low-grade paper are highly brittle.'
    }
  },
  'Kharkiv': {
    topic: 'Kharkiv',
    articlesCount: 35,
    issuesCount: 14,
    publicationsCovered: 6,
    yearRange: '1915 - 1989',
    avgOcrConfidence: 0.79,
    narrativeText: {
      Researcher: 'The Kharkiv archive chronicles the city\'s explosive transformation from a provincial Imperial railway hub into the roaring avant-garde industrial capital of the 1920s, followed by the tragic silencing of its academic and literary Renaissance.',
      Editor: 'The ultimate narrative arc centers on the "Slovo House" — a writers\' cooperative apartment designed in the shape of the Cyrillic letter "C", where dozens of Ukraine\'s finest writers lived, debated, and were ultimately arrested.',
      Archivist: 'The Kharkiv collection is critically impacted by mechanical page wear; many 1920s newspaper runs suffer from faded ink. 14 items are recommended for immediate high-resolution digital scanning and color extraction.'
    }
  },
  'Women’s education': {
    topic: 'Women’s education',
    articlesCount: 28,
    issuesCount: 16,
    publicationsCovered: 5,
    yearRange: '1905 - 1950',
    avgOcrConfidence: 0.92,
    narrativeText: {
      Researcher: 'Documents detail the systematic fight for women\'s high schools, regional teacher colleges, and university integration across Galicia and Central Ukraine, highlighting pioneer organizations like the Union of Ukrainian Women.',
      Editor: 'An inspiring angle: focus on the Galician "Girls\' Sewing & Bookkeeping Academy" of 1912, which established a radical self-funding model for women seeking higher academic credentials abroad.',
      Archivist: 'Highly stable archival condition with premium paper stock from Lviv printers. Metadata lacks standard demographic descriptors on students. High average OCR accuracy makes this a prime target for automated semantic indexing.'
    }
  },
  'Theatre': {
    topic: 'Theatre',
    articlesCount: 37,
    issuesCount: 19,
    publicationsCovered: 7,
    yearRange: '1907 - 1978',
    avgOcrConfidence: 0.84,
    narrativeText: {
      Researcher: 'Focuses primarily on the revolutionary Berezil Theatre founded by director Les Kurbas, exploring its integration of German expressionist acting, constructivist stage design by Vadym Meller, and philosophical dramatic adaptations.',
      Editor: 'An engaging story potential: "The Metronome Synchronicities of Les Kurbas" — an investigative look at how stage actors utilized hidden acoustic pulses to turn theater plays into clockwork modernist poetry.',
      Archivist: 'Visual showbills and theater programs constitute 40% of this sub-corpus. These contain rich typographical data but suffer from near-zero OCR reliability, requiring manual tagging of names and locations.'
    }
  }
};

// High-fidelity primary historical articles
const PRIMARY_ARTICLES: Article[] = [
  {
    id: 'art-001',
    topics: ['Modernism', 'Theatre'],
    title: 'New Scenography: The Expressionist Stage and Vadym Meller',
    publication: 'Kino (Kharkiv)',
    year: 1927,
    author: 'Les Kurbas',
    snippet: 'This essay outlines a radical break from realist theater decorations. Meller replaces passive canvas backdrops with steel beams, dynamic lighting, and moving scaffolding that interact directly with the actor\'s body as an industrial apparatus.',
    fullExcerpt: 'scaffolding, light cones, and motorized platforms are not mere additions—they form the structural apparatus of the drama. In our Berezil staging of "Gas", the actor does not speak against a set; they climb, lift, and sweat inside a kinetic machine of wires. Meller has realized what the bourgeois theatre has feared for generations: that art is physical labour synchronized with modern electric grids.',
    ocrConfidence: 0.94,
    documentType: 'Manifesto',
    language: 'Ukrainian',
    themes: ['Avant-garde', 'Expressionism', 'Constructivism', 'Scenography'],
    people: ['Vadym Meller', 'Les Kurbas', 'Georg Kaiser'],
    places: ['Kharkiv', 'Berlin'],
    organizations: ['Berezil Theatre', 'Art Academy of Kharkiv'],
    reasonBadge: 'High relevance',
    issueNumber: 'No. 8 (October)',
    pageRange: 'p. 14-17',
    physicalCondition: 'Excellent',
    preservationSignal: 'Archived',
    metadataGaps: [],
    archivalNotes: 'Signature piece of constructivist theory. Original layout contains photomontage illustrations by Meller.',
    editorialSnippet: 'Stunning visual descriptions of 1920s theatre machines. Offers a fantastic hook regarding how industrialization colonized art.'
  },
  {
    id: 'art-002',
    topics: ['Modernism', 'Kharkiv'],
    title: 'The Literary Debate and the Intellectual Frontier of Europe',
    publication: 'Chervonyi Shliakh',
    year: 1926,
    author: 'Mykola Khvylovy',
    snippet: 'An urgent, fiery appeal warning against cheap cultural imitation. The author argues that Eastern European modernism must establish a psychological path independent of imperial centers, looking directly to European avant-garde currents.',
    fullExcerpt: 'Europe, but not the Europe of compromise and decay—the psychological Europe of restless searchers, from Verhaeren to Einstein! Our young republic cannot afford to merely mimic old metropolitan forms. Our modernism must be a high-altitude flight of industrial lyricism and absolute autonomy. We must depart from the psychological drag of cultural dependency immediately.',
    ocrConfidence: 0.89,
    documentType: 'Manifesto',
    language: 'Ukrainian',
    themes: ['Literary Debates', 'New Poetics', 'Cultural Autonomy'],
    people: ['Mykola Khvylovy', 'Mykola Zerov', 'Pavlo Tychyna'],
    places: ['Kharkiv', 'Kyiv', 'Paris'],
    organizations: ['VAPLITE', 'State Publishing House'],
    reasonBadge: 'Key entity',
    issueNumber: 'Vol. 4',
    pageRange: 'p. 89-102',
    physicalCondition: 'Good',
    preservationSignal: 'Archived',
    metadataGaps: [],
    archivalNotes: 'The foundational pamphlet that sparked the famous literary discussion of 1925-1928.',
    editorialSnippet: 'Highly quoteable, emotive language representing the crest of the Ukrainian intellectual Renaissance.'
  },
  {
    id: 'art-003',
    topics: ['Women’s education', 'Modernism'],
    title: 'Feminist Ideals in Contemporary Female Secondary Gymnasiums',
    publication: 'Nova Khata (Lviv)',
    year: 1929,
    author: 'Milena Rudnytska',
    snippet: 'A detailed critique of high school curriculums for women. Rudnytska advocates for rigorous scientific training, economic self-reliance courses, and civic education to produce independent, professional modern citizens.',
    fullExcerpt: 'If we continue to educate our young girls solely in the art of embroidery and polite French conversation, we are preparing them for dependency in a world that is moving with extreme speed. The modern woman must master physics, bookkeeping, and constitutional law. Only with these intellectual weapons can she command her own fate in the new European matrix.',
    ocrConfidence: 0.96,
    documentType: 'Academic Essay',
    language: 'Ukrainian',
    themes: ['Feminist Literature', 'Gymnasiums', 'Civic Education'],
    people: ['Milena Rudnytska', 'Natalia Kobrynska'],
    places: ['Lviv', 'Przemysl', 'Vienna'],
    organizations: ['Union of Ukrainian Women', 'Private Girls School Association'],
    reasonBadge: 'Representative publication',
    issueNumber: 'Year 5, Issue 11',
    pageRange: 'p. 2-5',
    physicalCondition: 'Excellent',
    preservationSignal: 'Archived',
    metadataGaps: [],
    archivalNotes: 'Printed in premium serif font with modern layout. Clean crisp margins on heavy fibrous paper stock.',
    editorialSnippet: 'A sharp, progressive text highlighting early 20th-century feminist leadership and curriculum design templates.'
  },
  {
    id: 'art-004',
    topics: ['Village life', 'Women’s education'],
    title: 'Cooperative Lace-Weaving and the Funding of Rural Girls’ Schools',
    publication: 'Zhinocha Dolya',
    year: 1922,
    author: 'Olena Pchilka',
    snippet: 'An inspiring article detailing how rural women organized embroidery and lace workshops. By selling high-quality folk designs to urban centers in Prague and Krakow, they generated sufficient revenue to hire independent math teachers.',
    fullExcerpt: 'The craft of the loom has ceased to be a simple domestic chore. In the village of Kosiv, forty women consolidated their output into a collective cooperative. Their exquisite geometric lace was bought by a department store in Warsaw. With the gold earned, they registered a private room, bought forty desks, and hired a retired gymnasium master to instruct their daughters in arithmetic.',
    ocrConfidence: 0.78,
    documentType: 'Reportage',
    language: 'Ukrainian',
    themes: ['Peasant Cooperatives', 'Handicraft Cooperatives', 'Rural Schools'],
    people: ['Olena Pchilka', 'Sofia Rusova'],
    places: ['Kosiv', 'Warsaw', 'Krakow'],
    organizations: ['Kosiv Womens Cooperative', 'Galician Educational League'],
    reasonBadge: 'Bridge article',
    issueNumber: 'No. 3',
    pageRange: 'p. 18-21',
    physicalCondition: 'Brittle',
    preservationSignal: 'Needs Digitization Review',
    metadataGaps: ['Missing Author' /* but known contextually */],
    archivalNotes: 'Pages are highly yellowed, print ink is faded from margin exposures. Spine was re-stitched in 1952.',
    editorialSnippet: 'Excellent grassroots micro-history of economic autonomy and women\'s literacy programs.'
  },
  {
    id: 'art-005',
    topics: ['Theatre', 'Kharkiv'],
    title: 'The Premiere of "Narodnyi Malakhii": Chaos on Stage or Masterpiece?',
    publication: 'Kino (Kharkiv)',
    year: 1928,
    author: 'Mykola Kulish',
    snippet: 'A defense of Kurbas\' latest theater experiment. Critics accuse Berezil of baffling the provincial public, but the author explains the script utilizes fragmented choruses, musical tempos, and psychological surrealism to express revolutionary anxiety.',
    fullExcerpt: 'Our critics demand a simple chronicle where the bad are punished and the good rejoice. But life in our times is not a straightforward railway track! Malakhii is a man whose psychological wires have snapped under the voltage of change. Kurbas stages this fracture using circular mirrors, sirens, and polyphonic choirs who whisper conflicting instructions. It is magnificent and disorienting.',
    ocrConfidence: 0.85,
    documentType: 'Review',
    language: 'Ukrainian',
    themes: ['Avant-garde', 'Expressionist Scenography', 'Stage Design'],
    people: ['Les Kurbas', 'Mykola Kulish', 'Vadym Meller'],
    places: ['Kharkiv', 'Odesa'],
    organizations: ['Berezil Theatre'],
    reasonBadge: 'Representative year',
    issueNumber: 'No. 14',
    pageRange: 'p. 6-9',
    physicalCondition: 'Good',
    preservationSignal: 'Archived',
    metadataGaps: [],
    archivalNotes: 'Debate piece following the controversial premiere. Contains detailed transcripts of actor dialogue.',
    editorialSnippet: 'An essential item for understanding avant-garde scandal, theatrical structure, and state censorship debates.'
  },
  {
    id: 'art-006',
    topics: ['Village life', 'Kharkiv'],
    title: 'Slobozhanshchyna Folk Ballads and Their Synthesized Variations',
    publication: 'Literaturnyi Yarmarok',
    year: 1929,
    author: 'Mike Johansen',
    snippet: 'Johansen travels to rural settlements outside Izium, record-cataloging rare polyphonic songs of steppe workers and mixing their lyric structure with constructivist jazz poem metric grids.',
    fullExcerpt: 'In the fields of Barvinkove, the harvest chants do not employ the predictable scales of the conservatory. They are modal, rich with parallel fourths. We recorded these on wax cylinders under the hot afternoon sun. Back in Kharkiv, our jazz ensemble played these melodies over syncopated drum tracks. The old women say this is the speed of tractor gears in the field.',
    ocrConfidence: 0.72,
    documentType: 'Feature Article',
    language: 'Ukrainian',
    themes: ['Folklore', 'Harvest Rituals', 'New Poetics'],
    people: ['Mike Johansen', 'Mykhailo Semenko'],
    places: ['Izium', 'Kharkiv', 'Barvinkove'],
    organizations: ['Association of Pan-Futurists', 'Kharkiv Ethnography Museum'],
    reasonBadge: 'Rare but important',
    issueNumber: 'Notebook 8',
    pageRange: 'p. 45-52',
    physicalCondition: 'Faded',
    preservationSignal: 'Flagged for Rescan',
    metadataGaps: ['Damaged Page'],
    archivalNotes: 'Printed on cheap grey wood-pulp paper. OCR confidence is severely lowered due to extensive ink bleed and high letter density.',
    editorialSnippet: 'Charming cross-genre collision of folklore and modern synthesizers/jazz metrics in the 1920s.'
  },
  {
    id: 'art-007',
    topics: ['Women’s education', 'Kharkiv'],
    title: 'The Industrial Training Course for Kharkiv Women Workers',
    publication: 'Kharkivskyi Proletar',
    year: 1931,
    author: null, // Missing author
    snippet: 'A news report tracking the opening of technical mechanical training panels for women at the Kharkiv Locomotive Factory, outlining curriculum requirements, physical constraints, and test score outcomes.',
    fullExcerpt: 'Under the directive of industrial mobilization, the central mechanics guild opened classes for seventy female operatives. These women, many of whom arrived from rural Poltava three months ago, are learning to calibrate micrometers and operate lathe gears. The exam boards note that Comrade Hanna Morozova completed her engine housing calibration assessment with a near-perfect score.',
    ocrConfidence: 0.90,
    documentType: 'Letter to Editor', // Plausible news layout
    language: 'Ukrainian',
    themes: ['Technical Lyceums', 'Industrialization', 'Urbanization'],
    people: ['Hanna Morozova'],
    places: ['Kharkiv', 'Poltava'],
    organizations: ['Kharkiv Locomotive Factory (KhPZ)', 'State Education Committee'],
    reasonBadge: 'Quality warning',
    issueNumber: 'No. 294',
    pageRange: 'p. 3',
    physicalCondition: 'Brittle',
    preservationSignal: 'Needs Digitization Review',
    metadataGaps: ['Missing Author'],
    archivalNotes: 'Original copy is highly unstable; print ink is brittle on cheap post-revolutionary stock. Page corners are missing.',
    editorialSnippet: 'Fascinating archival evidence of women transitioning from agricultural peasants to high-precision urban industrial workers.'
  },
  {
    id: 'art-008',
    topics: ['Village life', 'Theatre'],
    title: 'Peasant Theatrical Circles and the Tragedy of Rural Didacticism',
    publication: 'Dilo (Lviv)',
    year: 1913,
    author: 'Ivan Franko',
    snippet: 'Franko criticizes the repetitiveness of village theater troupes. He argues that rural audiences deserve complex psychological translated plays rather than endlessly performing slapstick comedies about greedy merchants.',
    fullExcerpt: 'Go to any parish barn on a winter evening and you will find the same spectacle: a drunk father, a sobbing daughter, and a rich neighbor who trades in rye. Our villagers are not caricatures in an ethnographical book. They understand tragedy, they feel the crushing modern isolation. We must translate Chekhov, Ibsen, and Shakespeare and stage them for our weavers and plowmen.',
    ocrConfidence: 0.93,
    documentType: 'Editorial',
    language: 'Ukrainian',
    themes: ['National Drama', 'Customary Law', 'Folklore'],
    people: ['Ivan Franko', 'Lesya Ukrainka'],
    places: ['Lviv', 'Drohobych'],
    organizations: ['Galician Ruthenian Theater Co.'],
    reasonBadge: 'High OCR confidence',
    issueNumber: 'Vol. 34, No. 120',
    pageRange: 'p. 1-2',
    physicalCondition: 'Good',
    preservationSignal: 'Archived',
    metadataGaps: [],
    archivalNotes: 'Classic essay. Excellent font sharpness. Minor dust spots on edges of paper.',
    editorialSnippet: 'Franko\'s critique on high-culture versus low-folk performance. Deeply educational about class attitudes.'
  },
  {
    id: 'art-009',
    topics: ['Women’s education', 'Theatre'],
    title: 'The Female Voice in Dramaturgy: Sofia Rusova\'s Pedagogical Stage',
    publication: 'Osnova (Poltava)',
    year: 1908,
    author: 'Sofia Rusova',
    snippet: 'A comprehensive plan for using dramatic play and theatrical adaptation as core educational devices in girls\' primary gymnasiums to encourage confidence, spatial awareness, and public speech.',
    fullExcerpt: 'When a girl stands behind a wooden lectern to read Cicero, her throat tightens and her eyes drop. But when we drape a woolen shawl over her shoulders and tell her she is Antigone speaking to power, her spine straightens, her voice rises. Drama is not an idle luxury; it is the absolute foundation of self-expressive, fearless training for our daughters.',
    ocrConfidence: 0.95,
    documentType: 'Academic Essay',
    language: 'Ukrainian',
    themes: ['Gymnasiums', 'National Drama', 'Civic Education'],
    people: ['Sofia Rusova', 'Lesya Ukrainka'],
    places: ['Poltava', 'Kyiv'],
    organizations: ['Poltava Girls Gymnasium', 'Kyiv Women\'s Club'],
    reasonBadge: 'Rare but important',
    issueNumber: 'No. 4',
    pageRange: 'p. 31-40',
    physicalCondition: 'Good',
    preservationSignal: 'Archived',
    metadataGaps: [],
    archivalNotes: 'Highly structured formatting. Excellent margin condition. Original library stamp on cover pages.',
    editorialSnippet: 'Pioneering educational methodology showing theater as a tool of self-empowerment for girls in 1908.'
  },
  {
    id: 'art-010',
    topics: ['Modernism', 'Village life'],
    title: 'The Wooden Churches of the Boyko Region: A Study in pure Geometry',
    publication: 'Nova Khata (Lviv)',
    year: 1932,
    author: 'Mykhailo Boichuk',
    snippet: 'Boichuk examines classical wooden church architecture through a modernist lens, arguing that peasant woodcarvers pre-empted modern design by hundreds of years by using purely functional, geometric structural plans.',
    fullExcerpt: 'Look closely at the three-tiered dome in Kosmach. There are no ornamental columns, no decorative plaster. It is a mathematical configuration of rough logs and oak shingles, rising into the sky like a modern silo or a steel hangar. The Carpathian carpenter did not read Bauhaus magazines, but he understood perfectly that utility and geometry are the source of monumental style.',
    ocrConfidence: 0.91,
    documentType: 'Academic Essay',
    language: 'Ukrainian',
    themes: ['Avant-garde', 'Peasant Cooperatives', 'Woodcarving', 'Bauhaus Influence'],
    people: ['Mykhailo Boichuk', 'Walter Gropius'],
    places: ['Kosmach', 'Lviv', 'Weimar'],
    organizations: ['Boichuk School of Art', 'Lviv Industrial Museum'],
    reasonBadge: 'Bridge article',
    issueNumber: 'No. 18',
    pageRange: 'p. 22-25',
    physicalCondition: 'Excellent',
    preservationSignal: 'Archived',
    metadataGaps: [],
    archivalNotes: 'Contains illustrative diagrams of Boyko construction joins. High cultural art historical document.',
    editorialSnippet: 'Incredible synthesis. Blends traditional folk design with elite Weimar Bauhaus architectural theories.'
  }
];

// Custom programmatically varied but realistic items to scale the total to exactly 160 articles,
// covering all 5 core topics, a broad year span (1900-1990), realistic Ukrainian authors/publications,
// overlapping entities, low-confidence entries, and distinct reasons badges.
const GENERATE_EXTRA_ARTICLES = (): Article[] => {
  const extra: Article[] = [];
  
  const publications = [
    'Nova Khata (Lviv)', 'Chervonyi Shliakh', 'Kino (Kharkiv)', 'Dilo (Lviv)', 
    'Osnova (Poltava)', 'Literaturnyi Yarmarok', 'Zhinocha Dolya', 'Vaplite', 
    'Kyivska Starovyna', 'Zhyttia i Revoliutsiia', 'Slovo (Prague)', 'Nasha Kul\'tura'
  ];

  const authors = [
    'Volodymyr Vynnychenko', 'Pavlo Tychyna', 'Olena Teliha', 'Valerian Pidmohylny',
    'Ostap Vyshnya', 'Natalia Kobrynska', 'Yuriy Yanovskyi', 'Irina Wilde',
    'Mykhailo Semenko', 'Hryhoriy Kosynka', 'Andriy Holovko', 'Sofia Parfanovych',
    'Bohdan Ihor Antonych', 'Viktor Domontovych', 'Mykhail Mykhailyn', 'Lesya Ukrainka'
  ];

  const themesPool = {
    'Modernism': ['Avant-garde', 'Graphic Design', 'Feminist Literature', 'Symbolism', 'Typographical Reforms', 'Futurism', 'Banned Poetry', 'Aestheticism', 'Surrealism'],
    'Village life': ['Folklore', 'Harvest Rituals', 'Agrarian Reforms', 'Peasant Cooperatives', 'Anarchism', 'Carpathian Crafts', 'Rural Literacy', 'Immigration Reports', 'Church Music'],
    'Kharkiv': ['Slovo House', 'Derzhprom Construction', 'Futurism', 'VAPLITE Circle', 'Locomotive Factory', 'Academic Integration', 'Executed Renaissance', 'Urban Planning'],
    'Women’s education': ['Gymnasiums', 'Teacher Training', 'Domestic Economy', 'Suffragist Campaigns', 'Micro-cooperatives', 'Kyiv Higher Courses', 'Women Writers League'],
    'Theatre': ['Berezil Theatre', 'Expressionist Scenography', 'Les Kurbas', 'Shakespearean Adaptations', 'Stage Design', 'Soviet Censorship', 'Opera Librettos', 'Galician Drama']
  };

  const peoplePool = ['Les Kurbas', 'Mykola Khvylovy', 'Milena Rudnytska', 'Olena Pchilka', 'Mykola Kulish', 'Mike Johansen', 'Sofia Rusova', 'Mykhailo Boichuk', 'Natalia Lypivska', 'Hanna Morozova', 'Yevhen Konovalets', 'Dmytro Dontsov', 'Valerian Pidmohylny', 'Vasyl Stefanyk', 'Pavlo Kovzhun'];
  const placesPool = ['Kharkiv', 'Lviv', 'Kyiv', 'Poltava', 'Drohobych', 'Przemysl', 'Stanislaviv', 'Kosiv', 'Vienna', 'Prague', 'Odesa', 'Chernivtsi'];
  const orgsPool = ['Berezil Theatre', 'VAPLITE', 'Union of Ukrainian Women', 'Boichuk School of Art', 'Shevchenko Scientific Society', 'Prosvita League', 'Galician Educational Association', 'State Publishing House', 'Kharkiv Locomotive Factory'];

  const reasons: Article['reasonBadge'][] = [
    'High relevance', 'Representative year', 'Representative publication', 
    'Key entity', 'Bridge article', 'Rare but important', 
    'High OCR confidence', 'Quality warning'
  ];

  const languages: Article['language'][] = ['Ukrainian', 'Polish', 'Yiddish', 'German', 'Russian'];
  const docTypes: Article['documentType'][] = ['Editorial', 'Feature Article', 'Review', 'Letter to Editor', 'Reportage', 'Academic Essay', 'Manifesto'];

  // Base generator seed to get realistic variety
  let articleId = 11;
  
  // Distribute across the 5 topics fairly
  CORE_TOPICS.forEach((topic) => {
    // We want about 30 items per topic category to reach ~150-160 total items.
    for (let i = 0; i < 30; i++) {
      const year = 1900 + (articleId * 7) % 91; // 1900 to 1990
      const currentAuthor = (articleId % 7 === 0) ? null : authors[articleId % authors.length];
      const currentPub = publications[articleId % publications.length];
      const lang = languages[articleId % languages.length];
      const docType = docTypes[articleId % docTypes.length];
      
      // Determine OCR Level
      let ocrConfidence = 0.85 + (articleId % 15) / 100;
      if (articleId % 9 === 0) ocrConfidence = 0.58 + (articleId % 10) / 100; // lower range warning
      if (ocrConfidence > 1.0) ocrConfidence = 1.0;

      // Ensure topics overlap sometimes
      const selectedTopics = [topic];
      if (articleId % 6 === 0) {
        const otherTopic = CORE_TOPICS[(articleId + 2) % CORE_TOPICS.length];
        if (otherTopic !== topic) selectedTopics.push(otherTopic);
      }

      // Generate a realistic title based on topic
      let title = '';
      let snippet = '';
      let fullExcerpt = '';
      const tThemes = themesPool[topic];
      const mainTheme1 = tThemes[articleId % tThemes.length];
      const mainTheme2 = tThemes[(articleId + 3) % tThemes.length];
      const selectedThemes = Array.from(new Set([mainTheme1, mainTheme2]));
      const selectedPeople = [peoplePool[articleId % peoplePool.length], peoplePool[(articleId + 4) % peoplePool.length]].filter(p => !!p);
      const selectedPlaces = [placesPool[articleId % placesPool.length], placesPool[(articleId + 3) % placesPool.length]].filter(p => !!p);
      const selectedOrgs = [orgsPool[articleId % orgsPool.length], orgsPool[(articleId + 5) % orgsPool.length]].filter(o => !!o);

      if (topic === 'Modernism') {
        const titleTemplates = [
          `The Manifestation of ${mainTheme1} in Interwar Literature`,
          `Typography Refined: Standardizing ${mainTheme1} Aesthetics`,
          `Revisiting the Avant-garde: ${mainTheme1} and the Kyiv Circles`,
          `Reflections of ${selectedPeople[0]} on ${mainTheme1}`,
          `The Underground Letters: Deciphering ${mainTheme1} Manifestos`,
          `An Uncharted Study: How ${mainTheme1} Altered Galician Poetics`,
          `The Silent Print: ${mainTheme2} and Clandestine Intellectualism`
        ];
        title = titleTemplates[articleId % titleTemplates.length];
        snippet = `A radical analysis exploring the emergence of ${mainTheme1.toLowerCase()} across Eastern European print mediums. It connects typography and spatial alignment directly with regional socio-political changes.`;
        fullExcerpt = `When studying the sheets printed between ${year - 3} and ${year}, we quickly discover that ${mainTheme1} is not merely a style; it represents a spatial crisis. The typography shifts dramatically, omitting standard decorative margins in favour of heavy, raw horizontal bars. This is the visual language of a society rebuilding itself from the ashes of empire.`;
      } else if (topic === 'Village life') {
        const titleTemplates = [
          `The Preservation of ${mainTheme1} in Carpathian Settlements`,
          `Agrarian Reforms and the Disintegration of ${mainTheme1}`,
          `Ethnographic Cataloging: Songs of ${mainTheme1} Workers`,
          `Letters on ${mainTheme1}: Reports from Customary Arbitrators`,
          `The Geometry of Traditional Crafts: Boyko-Hutsul ${mainTheme2}`,
          `${mainTheme1} and the Cooperatives of the San Valley`,
          `Folklore Transfused: How ${mainTheme1} Survived Collectivization`
        ];
        title = titleTemplates[articleId % titleTemplates.length];
        snippet = `A field survey focusing heavily on ${mainTheme1.toLowerCase()} and local custom rituals. The author documents structural shifts in how folk traditions interacted with regional cooperative networks.`;
        fullExcerpt = `Inside the wooden homes of ${selectedPlaces[0] || 'Kosiv'}, the old singers still retain the modal shifts of polyphony. Yet beneath this preservation lies a desperate attempt to defend ${mainTheme1} against administrative pressures. Traditional weaving guilds are being registered as formal state cooperative units, changing the social patterns of harvesting.`;
      } else if (topic === 'Kharkiv') {
        const titleTemplates = [
          `Constructing Derzhprom: ${mainTheme1} and Urban Architecture`,
          `The Slovo House Diaries: Life and Creative Work in ${selectedPlaces[0]}`,
          `The Avant-Garde Hub: Activism, Futurism, and ${mainTheme1}`,
          `Locomotive Calibration: Industrialization and ${mainTheme1}`,
          `VAPLITE After Hours: The Satirical Epistles of ${selectedPeople[0]}`,
          `The Steel Spires: ${mainTheme1} in Soviet Kharkiv Urbanism`,
          `Censored Corridors: The Suppression of ${mainTheme1} in Academic Spheres`
        ];
        title = titleTemplates[articleId % titleTemplates.length];
        snippet = `An intimate historical account tracking ${mainTheme1.toLowerCase()} in the heart of Kharkiv's cultural clusters. It draws on archival correspondence and municipal records from the late interwar era.`;
        fullExcerpt = `Walking through the concrete arches of Derzhprom, one is struck by the absence of historical ornaments. The building stands as an absolute monument of ${mainTheme1}. In the nearby apartments of the Slovo House, writers like ${selectedPeople[0]} spent their nights debating these exact architectural geometries, oblivious to the political storms gathering over their heads.`;
      } else if (topic === 'Women’s education') {
        const titleTemplates = [
          `Establishing Girls' Gymnasiums: The Battle for ${mainTheme1}`,
          `Teacher Credentials and the Social Status of ${mainTheme1}`,
          `Feminist Campaigns for ${mainTheme1} in Galicia`,
          `Lace and Accounting: The Micro-Economic Model of ${mainTheme1}`,
          `Sofia Rusova and the Expansion of ${mainTheme1} Curriculums`,
          `The Higher Educational Courses for Women in Kyiv and ${selectedPlaces[0]}`,
          `Pioneering Classrooms: The Female Autonomy Movements of ${year}`
        ];
        title = titleTemplates[articleId % titleTemplates.length];
        snippet = `A detailed policy review tracking the challenges of registering independent ${mainTheme1.toLowerCase()} modules for young women. Includes student lists, budget audits, and state petitions from ${year}.`;
        fullExcerpt = `The petition sent by the women of ${selectedPlaces[0]} was rejected twice on administrative pretexts. Yet, through stubborn local micro-credit networks, the organizers raised enough currency to rent three rooms and secure a syllabus on ${mainTheme1}. By winter, sixty young women were attending lectures on chemistry, defying regional restrictions on gendered instruction.`;
      } else { // Theatre
        const titleTemplates = [
          `Kurbas and the Metronome: Implementing ${mainTheme1} on Stage`,
          `The Berezil Stage: Expressionist Geometry and Vagym Meller's ${mainTheme2}`,
          `Staging Shakespeare in Kharkiv: A Constructivist Critique of ${mainTheme1}`,
          `The Playwright's Dilemma: Soviet Censorship on ${mainTheme1}`,
          `The Spatial Blueprint: Scenography, Scaffolding, and ${mainTheme1}`,
          `A Review of the Avant-Garde Performance of "Gas" in ${selectedPlaces[0]}`,
          `The Dynamic Ensemble: Physical Culture and Stage Movement Systems`
        ];
        title = titleTemplates[articleId % titleTemplates.length];
        snippet = `A critique profiling the visual choreography of the ${mainTheme1.toLowerCase()} ensemble. It details the technical apparatus, lighting designs, and actors' synchronized mechanical motions.`;
        fullExcerpt = `In Kurbas\' newest stage configuration, there are no velvet curtains. Direct white beams of light illuminate the bare scaffolding, emphasizing ${mainTheme1}. The performance demands absolute athletic exertion; actors utilize metronomic clicks to move in pure mathematical harmony, creating a human construct of modern ironworks.`;
      }

      const reason = reasons[articleId % reasons.length];
      
      const physicalConditions = ['Excellent', 'Good', 'Brittle', 'Faded', 'Water Damaged'] as const;
      const preservationSignals = ['Archived', 'Needs Digitization Review', 'Flagged for Rescan', 'Restricted Access'] as const;

      const gaps: string[] = [];
      if (currentAuthor === null) gaps.push('Missing Author');
      if (ocrConfidence < 0.7) gaps.push('Low-Level OCR');
      if (articleId % 13 === 0) gaps.push('Damaged Spine & Margins');
      if (articleId % 17 === 0) gaps.push('Uncertain Datation');

      extra.push({
        id: `art-${articleId.toString().padStart(3, '0')}`,
        topics: selectedTopics,
        title,
        publication: currentPub,
        year,
        author: currentAuthor,
        snippet,
        fullExcerpt,
        ocrConfidence,
        documentType: docType,
        language: lang,
        themes: selectedThemes,
        people: selectedPeople,
        places: selectedPlaces,
        organizations: selectedOrgs,
        reasonBadge: ocrConfidence < 0.7 ? 'Quality warning' : reason,
        issueNumber: `Issue No. ${(articleId % 20) + 1}`,
        pageRange: `pp. ${(articleId % 30) + 1}-${(articleId % 30) + 8}`,
        physicalCondition: physicalConditions[articleId % physicalConditions.length],
        preservationSignal: preservationSignals[articleId % preservationSignals.length],
        metadataGaps: gaps,
        archivalNotes: `Archived catalog entry ${articleId * 11}. Original printed in ${selectedPlaces[0] || 'Lviv'}. Bound in cardboard folder collection.`,
        editorialSnippet: `Offers a great historical perspective on the tensions surrounding ${mainTheme1.toLowerCase()} in the rural/urban divide.`
      });

      articleId++;
    }
  });

  return extra;
};

export const ALL_ARTICLES: Article[] = [
  ...PRIMARY_ARTICLES,
  ...GENERATE_EXTRA_ARTICLES()
];
