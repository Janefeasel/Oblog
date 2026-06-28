-- ============================================================
-- Seed Data — Current Movie Posts for June 2026
-- Run this in the Supabase Dashboard > SQL Editor
-- Inserts sample posts after the schema has been created.
-- Safe to re-run: deletes existing posts first.
-- ============================================================

DELETE FROM posts;

-- ============================================================
-- FEATURED / PINNED POSTS
-- ============================================================

INSERT INTO posts (title, slug, content, excerpt, featured_image, category, genre, star_rating, is_pinned, post_date, status, directed_by, produced_by, seo_title, seo_description)
VALUES
(
  'Toy Story 5 Brings the Gang Back for a Digital-Age Adventure',
  'toy-story-5-review-2026',
  '<h2>Pixar Does It Again</h2><p>Andrew Stanton returns to direct <em>Toy Story 5</em>, a thoughtful and hilarious exploration of what happens when toys have to compete with tablets, smartphones, and streaming services for kids'' attention.</p><p>The film opens with Bonnie''s room looking very different from what we remember. The toys are dusty, the playtime is sparse, and Woody (voiced by Tom Hanks) is facing an existential crisis: what happens when children outgrow the very concept of physical toys?</p><p>Enter a new villain — not a toy destroyer, but a charismatic AI-powered smart speaker named NEX (voiced by Keegan-Michael Key) that slowly takes over the room''s ecosystem. The set pieces are inventive, the emotional beats land hard, and yes, you will cry.</p><p>What makes <em>Toy Story 5</em> so remarkable is how it evolves the franchise''s central thesis. The first film asked "what if toys were alive?" The second explored what it means to be a toy versus a collectible. The third dealt with growing up and letting go. The fourth gave Woody a new purpose. Now, this fifth installment tackles the most contemporary question yet: what happens when children don''t need toys at all?</p><p>Stanton, who directed the original and the third film, brings a warmth and understanding to the material that feels earned. The animation has never been better — Pixar continues to push the boundaries of what computer animation can achieve. The texture of aging plastic, the fuzz of well-loved stuffed animals, the cold gleam of the smart speaker — every detail is rendered with painstaking care.</p><p>The voice cast is impeccable. Tom Hanks and Tim Allen slip back into their roles as if no time has passed at all. Newcomer Keegan-Michael Key brings a charming menace to NEX that never veers into full villainy — because the real conflict isn''t good versus evil, but connection versus convenience.</p><blockquote><p>"The best Pixar sequel since Toy Story 3. Stanton reminds us why these characters matter." — Our Review</p></blockquote><p>Rated G | 102 minutes | In theaters June 19</p>',
  'Pixar''s beloved franchise returns with a clever take on digital-age childhood. Andrew Stanton delivers another emotional masterpiece.',
  'https://picsum.photos/seed/toystory5/800/450',
  'review', 'animation', 5, TRUE, NOW() - INTERVAL '1 day', 'published',
  'Andrew Stanton', 'Pete Docter',
  'Toy Story 5 Review — Pixar''s Best Since the Original',
  'Our review of Toy Story 5: Andrew Stanton returns to direct a thoughtful exploration of toys in the digital age.'
),
(
  'Spielberg Returns to Sci-Fi with Disclosure Day',
  'disclosure-day-review-2026',
  '<h2>Spielberg at His Best</h2><p>Steven Spielberg returns to the genre that made him a household name with <em>Disclosure Day</em>, a taut, cerebral sci-fi thriller starring Emily Blunt and Josh O''Connor.</p><p>The premise is deceptively simple: a government data analyst (Blunt) discovers that a routine transparency initiative will expose a secret that could rewrite human history. What follows is a race against time that channels the best of <em>Minority Report</em> and <em>Catch Me If You Can</em>.</p><p>Blunt delivers a career-best performance, and O''Connor matches her beat for beat as a skeptical journalist caught in the conspiracy. The third act reveal is genuinely shocking — the kind of twist that has audiences gasping.</p><p>Spielberg shoots the film with the precision of a master. The opening sequence — a single continuous take through a government data center — establishes the world and the stakes without a single line of exposition. We understand the scale of the operation, the anonymity of the workers, and the sheer volume of information being processed, all in one elegant tracking shot.</p><p>The screenplay, by first-time writer Lila Chen, weaves real-world concerns about government transparency, data privacy, and institutional trust into a narrative that never feels preachy. The ethical questions are allowed to breathe, and the answers aren''t as simple as the trailers suggest.</p><p>Supporting turns from Jeffrey Wright and Sandra Oh add depth to a world that feels fully realized. Janusz Kamiński''s cinematography is, as always, breathtaking — every frame could hang in a gallery.</p><p>Rated PG-13 | 148 minutes | In theaters June 12</p>',
  'Steven Spielberg returns to sci-fi with Emily Blunt in a taut thriller about government secrets and the cost of transparency.',
  'https://picsum.photos/seed/disclosure-day/800/450',
  'review', 'sci-fi', 5, TRUE, NOW() - INTERVAL '2 days', 'published',
  'Steven Spielberg', 'Kristie Macosko Krieger',
  'Disclosure Day Review — Spielberg''s Sci-Fi Triumph',
  'Steven Spielberg returns to sci-fi with Disclosure Day, starring Emily Blunt in a taut thriller about the cost of truth.'
);

-- ============================================================
-- NEWS POSTS
-- ============================================================

INSERT INTO posts (title, slug, content, excerpt, featured_image, category, post_date, status, directed_by, produced_by, seo_title)
VALUES
(
  'Supergirl Trailer Breaks Records Ahead of June 26 Release',
  'supergirl-trailer-records-2026',
  '<p>The trailer for James Gunn''s <em>Supergirl</em> has shattered viewership records, amassing over 200 million views in its first 24 hours. The film, starring Milly Alcock as Kara Zor-El, marks a pivotal moment in the new DC Universe.</p><p>The trailer opens on Krypton — not the destroyed planet we know, but a vibrant, alien world in its final days. Young Kara watches as her parents make the impossible decision to send her away. It''s a poignant, visually stunning sequence that immediately distinguishes this film from the Superman story we know by heart.</p><p>Jason Momoa reprises his role as Lobo in a surprise appearance that has fans buzzing. The brief glimpse shows Lobo on a motorcycle, chasing something across an alien landscape, cigar clenched between his teeth. Early social media reactions are calling it "the most exciting DC film since <em>The Suicide Squad</em>."</p><p>Director Craig Gillespie (<em>I, Tonya</em>) brings a grounded, character-first approach to the material. In interviews, he''s described Supergirl as "a refugee story first, a superhero story second."</p><p><em>Supergirl</em> hits theaters June 26.</p>',
  'The Supergirl trailer starring Milly Alcock shattered records with 200M+ first-day views. Jason Momoa appears as Lobo.',
  'https://picsum.photos/seed/supergirl-2026/800/450',
  'news', NOW() - INTERVAL '3 days', 'published',
  'Craig Gillespie', 'James Gunn',
  'Supergirl Trailer Breaks Records — 200M Views in 24 Hours'
),
(
  'Masters of the Universe: First Reactions Are In',
  'masters-of-the-universe-reactions-2026',
  '<p>The live-action <em>Masters of the Universe</em> has finally arrived, and early reactions are surprisingly positive. Nicholas Galitzine stars as Prince Adam/He-Man in a $200M epic that embraces the source material''s glorious absurdity.</p><p>Director Travis Knight (<em>Kubo and the Two Strings</em>) brings a visual flair that balances camp and genuine stakes. The film opens on Eternia — a world that looks like a Heavy Metal album cover brought to life, all impossible architecture and neon-lit castles.</p><p>Galitzine underwent an intense physical transformation for the role, gaining over 30 pounds of muscle. "I ate so much chicken I think I''m 40% protein now," he told us in an exclusive interview. His performance walks a tight line between sincerity and the inherent silliness of a man who shouts "By the power of Grayskull!" before transforming into a muscle-bound hero.</p><p>Critics praise the production design and the committed performances, though some note the pacing drags in the second act. The film''s treatment of Skeletor (played by Jared Leto under extensive prosthetics) has divided audiences — some love the operatic villainy, others find it over-the-top even for this franchise.</p><p><em>Masters of the Universe</em> is now playing in theaters.</p>',
  'Early reactions for the $200M live-action He-Man film are positive. Nicholas Galitzine stars as Prince Adam.',
  'https://picsum.photos/seed/masters-universe/800/450',
  'news', NOW() - INTERVAL '4 days', 'published',
  'Travis Knight', 'David S. Goyer',
  'Masters of the Universe — First Reactions Praise the $200M Epic'
),
(
  'Scary Movie 6 Reunites the Wayans Brothers',
  'scary-movie-6-wayans-2026',
  '<p>After nearly two decades, the Wayans brothers have reunited with Anna Faris for <em>Scary Movie 6</em>. The spoof franchise returns to its roots, taking aim at modern horror hits like <em>Hereditary</em>, <em>Midsommar</em>, and the <em>Conjuring</em> universe.</p><p>Marlon Wayans confirmed in a press conference that the film "goes harder than the originals" and promises cameos from current horror royalty. The script reportedly targets not just recent horror films but also the tropes of "elevated horror" that have dominated the genre since 2018.</p><p>Anna Faris slips back into the role of Cindy Campbell as if she never left. "The scream is still there," she joked at the premiere. "I practice in the shower." Early screenings report non-stop laughter and standing ovations, particularly for a sequence spoofing the final act of <em>Hereditary</em> that has to be seen to be believed.</p><p>The film is rated R for "pervasive crude humor, violent content, and language throughout." In other words, classic Scary Movie.</p><p>In theaters June 5.</p>',
  'The Wayans brothers and Anna Faris reunite for Scary Movie 6, spoofing Hereditary, Midsommar, and more.',
  'https://picsum.photos/seed/scary-movie-6/800/450',
  'news', NOW() - INTERVAL '5 days', 'published',
  'Keenen Ivory Wayans', 'Marlon Wayans',
  'Scary Movie 6 — Wayans Brothers Reunite with Anna Faris'
),
(
  'Jackass: Best And Last — The Final Farewell',
  'jackass-best-and-last-2026',
  '<p>Johnny Knoxville and the crew are back one last time. <em>Jackass: Best And Last</em> promises to be the final chapter for the franchise that defined a generation of stunt comedy.</p><p>The film features all the original cast members — Knoxville, Steve-O, Chris Pontius, Dave England, Wee Man, Danger Ehren, and Preston Lacy — alongside fan-favorite newer additions. The stunts are bigger, the pranks are more elaborate, and the production value is surprisingly cinematic for a movie about people hitting each other in the groin.</p><p>Knoxville has stated this is "genuinely the last one" — though he''s said that before. "I''m 55 years old," he told reporters. "My body can''t take another one of these. Every morning I wake up and something new hurts."</p><p>The film includes a tribute segment to Ryan Dunn, who passed away in 2011, that early viewers describe as surprisingly emotional. "It''s not just a stunt show," Steve-O said. "It''s a celebration of the weird, wonderful family we''ve built."</p><p>In theaters June 26.</p>',
  'Johnny Knoxville and the crew return for what they promise is the final Jackass film. New stunts, same chaos.',
  'https://picsum.photos/seed/jackass-final/800/450',
  'news', NOW() - INTERVAL '6 days', 'published',
  'Jeff Tremaine', 'Johnny Knoxville',
  'Jackass: Best And Last — The Crew Says Goodbye'
),
(
  'I Am Frankelda: Mexico''s Stop-Motion Triumph Hits Theaters',
  'i-am-frankelda-2026',
  '<p><em>I Am Frankelda</em> is a stunning stop-motion animated musical prequel to the acclaimed series <em>Frankelda''s Book of Spooks</em>. The Mexican production has been drawing comparisons to the works of Guillermo del Toro and Henry Selick.</p><p>The film tells the origin story of the mysterious Frankelda, a young girl who makes a deal with spectral forces to save her family. The animation is breathtaking — every frame a work of art. The puppets, built over three years by a team of artisans in Mexico City, are incredibly expressive, their movements capturing the weight and texture of real materials in a way that CGI still struggles to match.</p><p>The musical numbers, composed by Grammy winner Natalia Lafourcade, blend traditional Mexican folk music with haunting orchestral arrangements. The centerpiece, a duet between Frankelda and the ghost of her grandmother, is likely to be in conversation come awards season.</p><p>Now playing in select theaters.</p>',
  'This Mexican stop-motion animated musical prequel is drawing comparisons to Guillermo del Toro and Henry Selick.',
  'https://picsum.photos/seed/frankelda/800/450',
  'news', NOW() - INTERVAL '7 days', 'published',
  'Ana Cristina Franco', 'Guillermo del Toro',
  'I Am Frankelda Review — Stop-Motion Magic from Mexico'
);

-- ============================================================
-- FEATURE POSTS
-- ============================================================

INSERT INTO posts (title, slug, content, excerpt, featured_image, category, genre, post_date, status, directed_by, produced_by, seo_title)
VALUES
(
  'The Death of Robin Hood: Hugh Jackman Reinvents a Legend',
  'death-of-robin-hood-jackman-2026',
  '<p>Hugh Jackman trades Wolverine''s claws for a bow in <em>The Death of Robin Hood</em>, a gritty reimagining that asks: what happens to a hero when the story is over?</p><p>Directed by Michael Sarnoski (<em>Pig</em>), the film follows an aging Robin Hood (Jackman) years after his legendary exploits. He''s haunted, guilt-ridden, and living in obscurity when a ghost from his past drags him back into action.</p><p>This is not the Robin Hood you remember. There are no witty banquets with Little John, no daring arrow-splitting stunts. Instead, Sarnoski gives us a meditation on violence and its aftermath. Robin has killed — dozens of men, maybe hundreds, over the course of his "heroic" career. The film asks what that does to a person.</p><p>Jackman delivers a performance that rivals his Logan sendoff. There''s a scene, shot in a single take, where Robin tends to a wound on a young follower — the tenderness of the act conflicting with the brutal practicality of the cauterization — that ranks among the year''s finest acting.</p><p>The film is less a swashbuckling adventure and more a meditation on legacy, violence, and redemption. It won''t satisfy audiences looking for Errol Flynn heroics. But for those willing to sit with something more difficult, the rewards are immense.</p><p>In theaters June 19.</p>',
  'Hugh Jackman reinvents the folk hero in a gritty drama from the director of Pig. A meditation on violence and redemption.',
  'https://picsum.photos/seed/robin-hood/800/450',
  'feature', 'drama', NOW() - INTERVAL '8 days', 'published',
  'Michael Sarnoski', 'Dmitri M. Johnson',
  'Hugh Jackman Reinvents Robin Hood in The Death of Robin Hood'
),
(
  'Power Ballad: John Carney''s Musical Magic with Paul Rudd and Nick Jonas',
  'power-ballad-carney-2026',
  '<p>John Carney (<em>Sing Street</em>, <em>Once</em>) returns with <em>Power Ballad</em>, a musical comedy-drama starring Paul Rudd as a washed-up 90s rock star and Nick Jonas as a young songwriter who teams up with him for one last shot at glory.</p><p>The chemistry between Rudd and Jonas is electric — the older, cynical rocker and the earnest young musician bounce off each other in ways that feel natural and unforced. Carney has always excelled at finding the music in everyday moments, and <em>Power Ballad</em> continues that tradition.</p><p>The original songs, written by Carney and Grammy-winning producer Jack Antonoff, are genuinely catchy. The title track, performed in a single continuous take during the film''s climactic concert sequence, is destined for radio play.</p><p>Rudd brings his trademark charm but also an underlying melancholy to the role of Duke, a man who had one hit song twenty years ago and has been chasing that high ever since. Jonas holds his own, proving he''s more than just a pop star slumming it in movies.</p><p>Think <em>Bill & Ted</em> meets <em>Begin Again</em>. It''s a crowd-pleaser that earns every note.</p><p>Now playing in theaters.</p>',
  'John Carney returns with a musical comedy starring Paul Rudd as a washed-up rock star and Nick Jonas as his unlikely partner.',
  'https://picsum.photos/seed/power-ballad/800/450',
  'feature', 'comedy', NOW() - INTERVAL '9 days', 'published',
  'John Carney', 'Anthony Bregman',
  'Power Ballad — John Carney''s Feel-Good Musical Comedy'
),
(
  'Peddi: Ram Charan''s Sports Action Epic Takes India by Storm',
  'peddi-ram-charan-2026',
  '<p>Ram Charan follows up <em>RRR</em> with <em>Peddi</em>, a Telugu sports action drama that has become a massive box office phenomenon in India. Co-starring Janhvi Kapoor, the film tells the story of a small-town athlete who defies all odds to compete on the world stage.</p><p>Director S. S. Rajamouli protégé Prashanth Varma brings the same larger-than-life sensibility that made <em>RRR</em> a global sensation. The action sequences are choreographed with breathtaking intensity — a kabaddi match in the film''s second act plays out like a war sequence, each point scored feeling like a life-or-death struggle.</p><p>The film has already crossed ₹500 crore worldwide, making it one of the highest-grossing Indian films of the year. Its success has sparked conversations about the globalization of Indian cinema, with several major studios already bidding for remake rights.</p><p>Kapoor delivers a career-best performance as the coach who believes in her athlete when no one else will. The relationship between her and Charan''s character forms the emotional backbone of a film that never lets the spectacle overwhelm the story.</p><p>Now playing worldwide.</p>',
  'Ram Charan follows up RRR with a Telugu sports action epic that''s already a ₹500 crore box office phenomenon.',
  'https://picsum.photos/seed/peddi/800/450',
  'feature', 'action', NOW() - INTERVAL '10 days', 'published',
  'Prashanth Varma', 'D. V. V. Danayya',
  'Peddi — Ram Charan''s Sports Action Epic is a Box Office Phenomenon'
),
(
  'Blades of the Guardians: Yuen Woo-ping Returns to Wuxia',
  'blades-of-the-guardians-2026',
  '<p>Legendary action choreographer Yuen Woo-ping (<em>The Matrix</em>, <em>Crouching Tiger, Hidden Dragon</em>) steps behind the camera for <em>Blades of the Guardians</em>, a wuxia epic starring Wu Jing and Nicholas Tse.</p><p>The fight choreography is, unsurprisingly, spectacular — some of the best martial arts sequences committed to film. Yuen, now in his eighties, proves he still has nothing to prove. A mid-film fight in a bamboo forest, shot in a single unbroken take that lasts nearly seven minutes, will be studied by action directors for years to come.</p><p>The story follows a disgraced swordsman (Wu Jing) who must protect a sacred temple from an invading army. The plot is simple, even archetypal, but that''s by design — it exists to move us from one astonishing set piece to the next.</p><p>Nicholas Tse brings a dangerous charisma to the role of the villain, a general who believes that power justifies any means. Their final confrontation, staged on the steps of the temple as rain pours down, is the kind of sequence that reminds you why cinema was invented.</p><p>Opens June 30.</p>',
  'Legendary action choreographer Yuen Woo-ping directs a wuxia epic with some of the best fight scenes ever committed to film.',
  'https://picsum.photos/seed/blades-guardians/800/450',
  'feature', 'adventure', NOW() - INTERVAL '11 days', 'published',
  'Yuen Woo-ping', 'Bill Kong',
  'Blades of the Guardians — Yuen Woo-ping''s Wuxia Masterpiece'
);

-- ============================================================
-- TRAILER POSTS
-- ============================================================

INSERT INTO posts (title, slug, content, excerpt, featured_image, category, post_date, status, directed_by, produced_by, seo_title)
VALUES
(
  'New Trailer: Girls Like Girls — Summer''s Most Anticipated Romance',
  'girls-like-girls-trailer-2026',
  '<p>The trailer for <em>Girls Like Girls</em> dropped this week and it''s already the most-talked-about romance of the summer. The film explores contemporary romantic dynamics with fresh energy and authentic representation.</p><p>Based on Hayley Kiyoko''s viral music video, the film expands the story into a full-length feature. The trailer introduces us to the two leads — a shy photographer and the confident musician who crashes into her life — and immediately establishes the chemistry that has early reviewers swooning.</p><p>The soundtrack, curated by Kiyoko herself, features an all-female and non-binary lineup that includes Phoebe Bridgers, Rina Sawayama, and MUNA. The trailer''s needle drop of Kiyoko''s "Feelings" has already spawned a TikTok dance trend.</p><p>Director Emma Seligman (<em>Shiva Baby</em>, <em>Bottoms</em>) brings her trademark blend of awkward humor and genuine heart to the project. If the trailer is any indication, this summer romance is going to be the one everyone''s talking about.</p><p>In theaters June 19.</p>',
  'The trailer for the Hayley Kiyoko-inspired romance is making waves. In theaters June 19.',
  'https://picsum.photos/seed/girls-like-girls/800/450',
  'trailer', NOW() - INTERVAL '12 days', 'published',
  'Emma Seligman', 'Hayley Kiyoko',
  'Girls Like Girls Trailer Drops — Summer Romance Heats Up'
),
(
  'World of Love: Korean Drama Sensation Gets Netflix Release Date',
  'world-of-love-netflix-2026',
  '<p>The critically acclaimed Korean drama <em>The World Of Love</em> is finally coming to Netflix for international audiences. The film, which has already broken records in Korea, arrives on the streaming platform June 5.</p><p>Early reviews praise its nuanced portrayal of modern relationships and its stunning cinematography. Director Park Chan-wook (<em>Oldboy</em>, <em>The Handmaiden</em>) brings his signature visual style to a story that is, surprisingly, his most gentle and romantic film to date.</p><p>The film follows two people who meet in a Seoul bookstore and, over the course of a year, navigate the complicated terrain of modern love. It''s a series of small moments — a shared umbrella, a late-night text, a meal that stretches into dinner — that accumulate into something profound.</p><p>If you loved <em>Past Lives</em> or <em>In the Mood for Love</em>, this one''s for you.</p><p>Streaming on Netflix June 5.</p>',
  'The acclaimed Korean drama arrives on Netflix June 5. A must-watch for fans of Past Lives and In the Mood for Love.',
  'https://picsum.photos/seed/world-of-love/800/450',
  'trailer', NOW() - INTERVAL '13 days', 'published',
  'Park Chan-wook', 'Lee Jae-won',
  'World of Love — Korean Drama Hit Gets Netflix Global Release'
);

-- ============================================================
-- INTERVIEW POSTS
-- ============================================================

INSERT INTO posts (title, slug, content, excerpt, featured_image, category, post_date, status, directed_by, produced_by, seo_title)
VALUES
(
  'Exclusive: Nicholas Galitzine on Playing He-Man',
  'interview-nicholas-galitzine-he-man-2026',
  '<p>We sat down with Nicholas Galitzine to talk about stepping into the role of Prince Adam/He-Man in <em>Masters of the Universe</em>.</p><p>"I grew up with the action figures," Galitzine told us. "My older brother had a Castle Grayskull playset that I wasn''t allowed to touch. Naturally, that''s all I wanted to do. So when Travis called about this, it felt like coming full circle."</p><p>The challenge, he says, was making a character who literally says "By the power of Grayskull" feel grounded and real. "Travis [Knight] kept pushing me to find the humanity underneath the muscles. He said, ''You can''t play He-Man. You have to play Adam pretending to be He-Man.'' That was the key."</p><p>On the physical transformation: "I ate so much chicken I think I''m 40% protein now. But honestly, the diet was the hardest part. The training was actually therapeutic — there''s something meditative about lifting heavy things over and over."</p>',
  'We talk to Nicholas Galitzine about stepping into Prince Adam''s boots and the intense physical transformation for the role.',
  'https://picsum.photos/seed/galitzine-interview/800/450',
  'interview', NOW() - INTERVAL '14 days', 'published',
  NULL, NULL,
  'Nicholas Galitzine Interview — Becoming He-Man'
),
(
  'Milly Alcock on Supergirl and the Future of the DC Universe',
  'interview-milly-alcock-supergirl-2026',
  '<p>Milly Alcock, star of James Gunn''s <em>Supergirl</em>, talks about bringing Kara Zor-El to life in a brand-new DC Universe.</p><p>"Kara isn''t Clark," Alcock explains. "She didn''t grow up on Earth with loving parents. She arrived as a teenager, fully aware of Krypton''s destruction. There''s a trauma there that makes her very different from Superman."</p><p>Alcock, who broke out in <em>House of the Dragon</em>, underwent months of training to prepare for the physically demanding role. "I wanted to do as many of my own stunts as possible. The wire work is terrifying the first time — they hoist you up twenty feet and expect you to act — but after a while it becomes almost natural."</p><p>On working with Jason Momoa (Lobo): "He''s terrifying and hilarious in equal measure. Every scene we have together is chaos in the best way. He showed up on set the first day, completely in character, and didn''t break once. I don''t think I''ve ever laughed so hard between takes."</p><p><em>Supergirl</em> opens June 26.</p>',
  'Milly Alcock on bringing Kara Zor-El to life, working with Jason Momoa, and what makes Supergirl different from Superman.',
  'https://picsum.photos/seed/alcock-interview/800/450',
  'interview', NOW() - INTERVAL '15 days', 'published',
  NULL, NULL,
  'Milly Alcock Interview — Supergirl and the DC Universe'
);

-- ============================================================
-- DEMO POSTS (draft + aggregated for editor dashboard)
-- ============================================================

INSERT INTO posts (title, slug, content, excerpt, featured_image, category, genre, star_rating, post_date, status, is_aggregated, source_name, source_url, directed_by, produced_by)
VALUES
(
  'DC Announces Justice League: Legacy at Summer Showcase',
  'justice-league-legacy-announced-2026',
  '<p>At their annual Summer Showcase, DC Studios announced <em>Justice League: Legacy</em>, a new chapter uniting the current DC Universe heroes. The film is set for a 2027 release and will feature Supergirl (Milly Alcock), Batman (to be cast), and a new Superman.</p><p>James Gunn confirmed the project in a statement: "This isn''t the Justice League you remember. This is something new — a team that reflects the world we live in today. Different heroes, different challenges, different stakes."</p><p>The announcement was accompanied by concept art showing the team assembled in what appears to be the Hall of Justice, redesigned with a modern architectural aesthetic. A release date has not been announced.</p>',
  'DC announces Justice League: Legacy at their Summer Showcase, uniting the new DC Universe heroes for 2027.',
  'https://picsum.photos/seed/justice-league/800/450',
  'news', 'action', NULL, NOW() - INTERVAL '16 days', 'published', TRUE, 'Variety', 'https://variety.com',
  'James Gunn', 'Peter Safran'
),
(
  'Draft: Upcoming Horror Releases to Watch This Fall',
  'draft-upcoming-horror-fall-2026',
  '<p>This fall is shaping up to be a killer season for horror fans. From A24''s latest to big-budget studio scares, here''s what to watch.</p><p>First up is <em>The Hollow</em>, A24''s latest from director Ari Aster, described as a folk horror set in the Appalachian mountains. Early word suggests it''s his most accessible film since <em>Hereditary</em>.</p><p>Then there''s <em>Bloodline</em>, a Blumhouse production from first-time director Mia Torres, about a family reunion that goes terrifyingly wrong. The trailer has been called "the most disturbing of the year" by several outlets.</p><p>And finally, <em>Nightfall</em> — a big-budget vampire film from Michael B. Jordan''s production company that promises to reinvent the genre for a new generation.</p><p><em>This is a draft post — not yet published.</em></p>',
  'A preview of upcoming horror releases for fall 2026. This is a draft — not yet published.',
  NULL,
  'feature', 'horror', NULL, NOW() - INTERVAL '1 hour', 'draft', FALSE, NULL, NULL,
  NULL, NULL
);

-- Done
SELECT COUNT(*) || ' posts seeded successfully!' AS result FROM posts;
