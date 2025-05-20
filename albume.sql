DROP TYPE IF EXISTS categ_album;
DROP TYPE IF EXISTS tip_editie;

CREATE TYPE categ_album AS ENUM('Hip Hop', 'R&B', 'Rock', 'Alternative');
CREATE TYPE tip_editie AS ENUM('Standard', 'Deluxe', 'Limitata');

CREATE TABLE IF NOT EXISTS albume (
   id serial PRIMARY KEY,
   nume VARCHAR(100) NOT NULL,
   descriere TEXT,
   imagine VARCHAR(300),
   categorie categ_album NOT NULL,
   tip_editie tip_editie DEFAULT 'Standard',
   pret NUMERIC(8,2) NOT NULL,
   nr_piese INT CHECK (nr_piese > 0),
   data_lansare DATE,
   culoare_vinil VARCHAR(50) DEFAULT 'Negru',
   tags VARCHAR[],
   bestseller BOOLEAN DEFAULT FALSE
);

INSERT INTO albume (nume, descriere, imagine, categorie, tip_editie, pret, nr_piese, data_lansare, culoare_vinil, tags, bestseller) VALUES
('Abbey Road', 'Ultimul album înregistrat de The Beatles', '/resurse/imagini/galerie/abbey_road.jpg', 'Rock', 'Standard', 179.99, 17, '1969-09-26', 'Negru', '{"clasic", "experimental"}', TRUE),
('The Dark Side Of The Moon', 'Album conceptual progresiv al trupei Pink Floyd', '/resurse/imagini/galerie/dark_side_of_the_moon.jpg', 'Rock', 'Deluxe', 199.99, 10, '1973-03-01', 'Negru', '{"clasic", "psihedelic", "experimental"}', TRUE),
('Currents', 'Album psihedelic modern al proiectului Tame Impala', '/resurse/imagini/galerie/currents.jpg', 'Alternative', 'Standard', 149.99, 13, '2015-07-17', 'Negru', '{"psihedelic", "experimental"}', FALSE),
('The Slow Rush', 'Al patrulea album de studio al lui Tame Impala', '/resurse/imagini/galerie/slow_rush.jpg', 'Alternative', 'Limitata', 159.99, 12, '2020-02-14', 'Roșu', '{"psihedelic", "experimental"}', FALSE),
('Kid A', 'Album experimental al trupei Radiohead', '/resurse/imagini/galerie/kid_a.jpg', 'Alternative', 'Deluxe', 169.99, 10, '2000-10-02', 'Negru', '{"experimental", "controversat"}', FALSE),
('Wolf', 'Al doilea album de studio al lui Tyler, The Creator', '/resurse/imagini/galerie/wolf.jpg', 'Hip Hop', 'Standard', 149.99, 18, '2013-04-02', 'Negru', '{"controversat", "liric", "experimental"}', FALSE),
('In Rainbows', 'Album lansat inițial în format digital de Radiohead', '/resurse/imagini/galerie/in_rainbows.jpg', 'Alternative', 'Standard', 159.99, 10, '2007-10-10', 'Negru', '{"experimental", "liric"}', FALSE),
('Circles', 'Album postum al lui Mac Miller', '/resurse/imagini/galerie/circles.jpg', 'Hip Hop', 'Limitata', 169.99, 12, '2020-01-17', 'Transparent', '{"liric", "psihedelic"}', FALSE),
('2000', 'Continuarea albumului 1999 al lui Joey Bada$$', '/resurse/imagini/galerie/2000.jpg', 'Hip Hop', 'Standard', 149.99, 14, '2022-07-22', 'Negru', '{"liric", "clasic"}', FALSE),
('The College Dropout', 'Albumul de debut al lui Kanye West', '/resurse/imagini/galerie/college_dropout.jpg', 'Hip Hop', 'Deluxe', 179.99, 21, '2004-02-10', 'Maro', '{"clasic", "liric", "controversat"}', TRUE),
('The Great Escape', 'O colaborare fantastică dintre Larry June și The Alchemist', '/resurse/imagini/galerie/great_escape.jpg', 'Alternative', 'Standard', 139.99, 15, '2023-03-31', 'Negru', '{"liric", "experimental"}', FALSE),
('Heaven Or Hell', 'Albumul prin care Don Toliver și-a câștigat reputația', '/resurse/imagini/galerie/heaven_hell.jpg', 'Hip Hop', 'Standard', 159.99, 12, '2020-03-13', 'Negru', '{"controversat", "liric"}', FALSE),
('Illmatic', 'Album de debut considerat clasic al lui Nas', '/resurse/imagini/galerie/illmatic.jpg', 'Hip Hop', 'Deluxe', 189.99, 10, '1994-04-19', 'Negru', '{"clasic", "liric"}', TRUE),
('Life of a DON', 'Al doilea album de studio al lui Don Toliver', '/resurse/imagini/galerie/life_of_a_don.jpg', 'Hip Hop', 'Standard', 149.99, 16, '2021-10-08', 'Negru', '{"experimental", "controversat"}', FALSE),
('Long Live A$AP', 'Album de debut al lui A$AP Rocky', '/resurse/imagini/galerie/long_live_asap.jpg', 'Hip Hop', 'Deluxe', 149.99, 18, '2013-01-15', 'Negru', '{"liric", "controversat"}', FALSE),
('Trilogy', 'Compilație a primelor trei mixtape-uri ale lui The Weeknd', '/resurse/imagini/galerie/trilogy.jpg', 'R&B', 'Limitata', 199.99, 30, '2012-11-13', 'Negru', '{"clasic", "liric", "psihedelic"}', TRUE);