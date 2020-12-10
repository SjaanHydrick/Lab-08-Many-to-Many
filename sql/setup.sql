DROP TABLE IF EXISTS episodes CASCADE;
DROP TABLE IF EXISTS writers CASCADE;
DROP TABLE IF EXISTS episodes_writers;

CREATE TABLE episodes (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    season INT,
    episode INT,
    title TEXT NOT NULL
);

CREATE TABLE writers (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name TEXT NOT NULL,
);

CREATE TABLE episodes_writers (
    episode_id BIGINT REFERENCES episodes(id),
    writer_id BIGINT REFERENCES writers(id),
    PRIMARY KEY(episode_id, writer_id)
);