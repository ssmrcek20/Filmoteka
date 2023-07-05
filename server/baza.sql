PRAGMA foreign_keys = ON;

-- -----------------------------------------------------
-- Table `tip_korisnika`
-- -----------------------------------------------------
CREATE TABLE
  IF NOT EXISTS `tip_korisnika` (
    `id` INTEGER PRIMARY KEY AUTOINCREMENT,
    `naziv` VARCHAR(45) NOT NULL,
    `opis` TEXT NULL,
    UNIQUE (`naziv`)
  );

-- -----------------------------------------------------
-- Table `korisnik`
-- -----------------------------------------------------
CREATE TABLE
  IF NOT EXISTS `korisnik` (
    `id` INTEGER PRIMARY KEY AUTOINCREMENT,
    `korime` VARCHAR(20) NOT NULL,
    `lozinka` TEXT NOT NULL,
    `email` VARCHAR(100) NULL,
    `ime` VARCHAR(50) NULL,
    `prezime` VARCHAR(50) NULL,
    `TOTP_kljuc` TEXT NULL,
    `aktivacijski_kljuc` INTEGER NULL,
    `tip_korisnika_id` INTEGER NOT NULL,
    UNIQUE (`korime`),
    CONSTRAINT `fk_tip_korisnika` FOREIGN KEY (`tip_korisnika_id`) REFERENCES `tip_korisnika` (`id`)
  );

-- -----------------------------------------------------
-- Table `film`
-- -----------------------------------------------------
CREATE TABLE
  IF NOT EXISTS `film` (
    `id` INTEGER PRIMARY KEY,
    `naziv` VARCHAR(100) NOT NULL,
    `orginalni_naziv` VARCHAR(100) NULL,
    `opis` TEXT NULL,
    `datum_unosa` DATETIME NOT NULL,
    `popularnost` REAL NULL,
    `datum_izdanja` DATETIME NULL,
    `prihod` BIGINT NULL,
    `budžet` BIGINT NULL,
    `trajanje` INTEGER NULL,
    `status` VARCHAR(20) NULL,
    `za_odrasle` TINYINT NULL,
    `poster` TEXT NULL,
    `početna_stranica` TEXT NULL,
    `pozadinska_slika` TEXT NULL,
    `imdb_id` TEXT NULL,
    `prosječna_ocjena` REAL NULL,
    `broj_ocjena` BIGINT NULL,
    `orginalni_jezik` VARCHAR(5) NULL,
    `video` TINYINT NULL,
    `slogan` TEXT NULL,
    `odobren` TINYINT NOT NULL,
    `korisnik_id` INTEGER NOT NULL,
    `zanr` TEXT NULL,
    CONSTRAINT `fk_korisnik` FOREIGN KEY (`korisnik_id`) REFERENCES `korisnik` (`id`)
  );

-- -----------------------------------------------------
-- Table `žanr`
-- -----------------------------------------------------
CREATE TABLE
  IF NOT EXISTS `žanr` (
    `id` INTEGER PRIMARY KEY,
    `naziv` VARCHAR(30) NOT NULL,
    UNIQUE (`naziv`)
  );

-- -----------------------------------------------------
-- Table `žanr_filma`
-- -----------------------------------------------------
CREATE TABLE
  IF NOT EXISTS `žanr_filma` (
    `žanr_id` INTEGER NOT NULL,
    `film_id` INTEGER NOT NULL,
    PRIMARY KEY (`žanr_id`, `film_id`),
    CONSTRAINT `fk_žanr` FOREIGN KEY (`žanr_id`) REFERENCES `žanr` (`id`),
    CONSTRAINT `fk_film` FOREIGN KEY (`film_id`) REFERENCES `film` (`id`)
  );

-- -----------------------------------------------------
-- Insert
-- -----------------------------------------------------


INSERT INTO
  `tip_korisnika` (`id`, `naziv`, `opis`)
VALUES
  (1, 'admin', NULL),
  (2, 'registrirani korisnik', NULL),
  (3, 'gost', NULL);



INSERT INTO
  `korisnik` (
    `id`,
    `korime`,
    `lozinka`,
    `email`,
    `ime`,
    `prezime`,
    `TOTP_kljuc`,
    `aktivacijski_kljuc`,
    `tip_korisnika_id`
  )
VALUES
  (
    3,
    'test',
    'rwa',
    'njnoadylmmedqyssze@tmmwj.com',
    NULL,
    NULL,
    '',
    0,
    2
  ),
  (
    20,
    'obican',
    '906a472189a22ab504c0ab208135954cd5e2873d76ef5b1d3873b60b1ff06cdd',
    'alw88705@xcoxc.com',
    '',
    '',
    'BABARBZIAZARAAZAAZERKAAHAAAAKAAAAAAAGAAGAABAGAAAAADAGBZBAAEROBRAAADAACIABABAACABAAARABRAARDAABIHAZBRABR',
    11420,
    2
  ),
  (
    21,
    'administrator',
    '0eb39c56862db09c5fb763bb2f92d28ec19e674bd6847a44594b74144ae74186',
    'stu33679@cdfaq.com',
    '',
    '',
    'AABATBAHAAAAACAABAARCAAAAZBAICIJAMAATAAAAEEAABAAARBREAABAAAAKCAABEDRABIAAIEARAIAAAARKAACAZEAABIJAEDRAAI',
    30015,
    1
  ),
  (
    22,
    'stanko',
    '13d062e2f2e8a7323624abf8a421ebfe3e62a6a2f4862dab84d949815afff06f',
    'stanko.smrcek2329@gmail.com',
    'stanko',
    'smrček',
    'AAAAACIDAEAARAIAARDROCAAA5EAMARAAADAAAAAAMAAAAZCAAAACAADAEDROBIBA5AAEAZHAAERRAAFARARABZABEAAGARAARAAIAR',
    65519,
    2
  );



INSERT INTO
  `žanr` (`id`, `naziv`)
VALUES
  (28, "Action"),
  (12, "Adventure"),
  (16, "Animation"),
  (35, "Comedy"),
  (80, "Crime"),
  (99, "Documentary"),
  (18, "Drama"),
  (10751, "Family"),
  (14, "Fantasy"),
  (36, "History"),
  (27, "Horror"),
  (10402, "Music"),
  (9648, "Mystery"),
  (10749, "Romance"),
  (878, "Science Fiction"),
  (10770, "TV Movie"),
  (53, "Thriller"),
  (10752, "War"),
  (37, "Western");



INSERT INTO
  `film` (
    `id`,
    `naziv`,
    `orginalni_naziv`,
    `opis`,
    `datum_unosa`,
    `popularnost`,
    `datum_izdanja`,
    `prihod`,
    `budžet`,
    `trajanje`,
    `status`,
    `za_odrasle`,
    `poster`,
    `početna_stranica`,
    `pozadinska_slika`,
    `imdb_id`,
    `prosječna_ocjena`,
    `broj_ocjena`,
    `orginalni_jezik`,
    `video`,
    `slogan`,
    `odobren`,
    `korisnik_id`,
    `zanr`
  )
VALUES
  (
    168,
    'Star Trek IV: The Voyage Home',
    'Star Trek IV: The Voyage Home',
    'Its the 23rd century, and a mysterious alien power is threatening Earth by evaporating the oceans and destroying the atmosphere. In a frantic attempt to save mankind, Kirk and his crew must time travel back to 1986 San Francisco where they find a world of punk, pizza and exact-change buses that are as alien as anything theyve ever encountered in the far reaches of the galaxy. A thrilling, action-packed Star Trek adventure!',
    '01.01.2023. 19:07:33',
    22.06,
    '26.11.1986. 01:00:00',
    133000000,
    24000000,
    119,
    'Released',
    0,
    '/xY5TzGXJOB3L9rhZ1MbbPyVlW5J.jpg',
    'https://www.startrek.com/shows/star-trek-iv-the-voyage-home',
    '/wN3dgwkiWSLrMVukPQIeccv5EJ6.jpg',
    'tt0092007',
    7.203,
    1188,
    'en',
    0,
    'The key to saving the future can only be found in the past.',
    0,
    3,
    "Science Fiction"
  ),
  (
    605,
    'The Matrix Revolutions',
    'The Matrix Revolutions',
    'The human city of Zion defends itself against the massive invasion of the machines as Neo fights to end the war at another front while also opposing the rogue Agent Smith.',
    '01.01.2023. 19:07:33',
    42.493,
    '05.11.2003. 01:00:00',
    424988211,
    150000000,
    129,
    'Released',
    0,
    '/fgm8OZ7o4G1G1I9EeGcb85Noe6L.jpg',
    '',
    '/533xAMhhVyjTy8hwMUFEt5TuDfR.jpg',
    'tt0242653',
    6.699,
    8445,
    'en',
    0,
    'Everything that has a beginning has an end.',
    0,
    3,
    "Adventure"
  ),
  (
    1676,
    'Will Penny',
    'Will Penny',
    'Will Penny, an aging cowpoke, takes a job on a ranch which requires him to ride the line of the property looking for trespassers or, worse, squatters. He finds that his cabin in the high mountains has been appropriated by a woman whose guide to Oregon has deserted her and her son. Too ashamed to kick mother and child out just as the bitter winter of the mountains sets in, he agrees to share the cabin until the spring thaw. But it isnt just the snow that slowly thaws; the lonely man and woman soon forget their mutual hostility and start developing a deep love for one another.',
    '01.01.2023. 19:07:33',
    7.696,
    '19.12.1967. 01:00:00',
    0,
    0,
    110,
    'Released',
    0,
    '/v3RcNrqutEPGsiTLd31J3U735kB.jpg',
    '',
    '/u6QeHLm3NNAYwVzFnIiHtjqXowQ.jpg',
    'tt0063811',
    6.541,
    73,
    'en',
    0,
    'The brute in every man was also in him... And the love and the violence!',
    0,
    3,
    "Western"
  ),
  (
    9531,
    'Superman III',
    'Superman III',
    'Aiming to defeat the Man of Steel, wealthy executive Ross Webster hires bumbling but brilliant Gus Gorman to develop synthetic kryptonite, which yields some unexpected psychological effects in the third installment of the 1980s Superman franchise. Between rekindling romance with his high school sweetheart and saving himself, Superman must contend with a powerful supercomputer.',
    '01.01.2023. 19:07:33',
    14.124,
    '17.06.1983. 01:00:00',
    75850624,
    39000000,
    125,
    'Released',
    0,
    '/c4oR6qgZW2s5foGkQi2Dd86KuAS.jpg',
    '',
    '/q4imVVy0YkoVBGJfUj4sWJOzyXj.jpg',
    'tt0086393',
    5.497,
    1417,
    'en',
    0,
    'If the worlds most powerful computer can control even Superman...no one on earth is safe.',
    0,
    3,
    "Comedy"
  ),
  (
    19995,
    'Avatar',
    'Avatar',
    'In the 22nd century, a paraplegic Marine is dispatched to the moon Pandora on a unique mission, but becomes torn between following orders and protecting an alien civilization.',
    '01.01.2023. 19:07:33',
    664.299,
    '15.12.2009. 01:00:00',
    2920357254,
    237000000,
    162,
    'Released',
    0,
    '/jRXYjXNq0Cs2TcJjLkki24MLp7u.jpg',
    'https://www.avatar.com/movies/avatar',
    '/7ABsaBkO1jA2psC8Hy4IDhkID4h.jpg',
    'tt0499549',
    7.528,
    26496,
    'en',
    0,
    'Enter the world of Pandora.',
    0,
    3,
    "Action"
  );



INSERT INTO
  `žanr_filma` (`žanr_id`, `film_id`)
VALUES
  (12, 168),
  (878, 168),
  (12, 605),
  (28, 605),
  (53, 605),
  (878, 605),
  (37, 1676),
  (10749, 1676),
  (12, 9531),
  (28, 9531),
  (878, 9531),
  (35, 9531),
  (12, 19995),
  (14, 19995),
  (28, 19995),
  (878, 19995);

-- -----------------------------------------------------
-- Select
-- -----------------------------------------------------
SELECT
  *
FROM
  `tip_korisnika`;

SELECT
  *
FROM
  `korisnik`;

SELECT
  *
FROM
  `žanr`;

SELECT
  *
FROM
  `film`;

SELECT
  *
FROM
  `žanr_filma`;
