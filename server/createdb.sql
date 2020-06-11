CREATE TABLE songs (
  ann_song_id INT PRIMARY KEY,
  ann_anime_id INT,
  name TEXT NOT NULL,
  artist TEXT,
  type SMALLINT,
  number SMALLINT,
  url TEXT,
  date_added TIMESTAMP NOT NULL
);

CREATE TABLE anime (
  ann_id INT PRIMARY KEY,
  display_name TEXT NOT NULL,
  acceptable_names TEXT[]
);

CREATE TABLE users (
  user_id SERIAL PRIMARY KEY,
  name TEXT NOT NULL
);

CREATE TABLE srs (
  ann_song_id INT NOT NULL,
  user_id INT NOT NULL,
  level SMALLINT NOT NULL,
  PRIMARY KEY (ann_song_id, user_id)
);
