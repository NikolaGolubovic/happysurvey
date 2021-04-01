DROP TABLE IF EXISTS question_votes;
DROP TABLE IF EXISTS question_choices;
DROP TABLE IF EXISTS question;
DROP TABLE IF EXISTS survey;
DROP TABLE IF EXISTS users;


CREATE TABLE IF NOT EXISTS  users (
	id serial PRIMARY KEY,
	username VARCHAR(50) NOT NULL UNIQUE,
	PASSWORD VARCHAR(100),
   created_on DATE NOT NULL DEFAULT CURRENT_DATE
);

CREATE TABLE survey (
	id serial PRIMARY KEY,
	user_id serial NOT NULL,
	survey_name VARCHAR(150) NOT NULL,
	survey_string TEXT,
	created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	deadline TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP + INTERVAL '5 days',
	FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);


CREATE TABLE question (
	id serial PRIMARY KEY,
	survey_id serial,
	question_name VARCHAR(200),
	FOREIGN KEY(survey_id) REFERENCES survey(id) ON DELETE CASCADE
);

CREATE TABLE question_choices (
	id serial PRIMARY KEY,
	question_id serial,
	choice VARCHAR(200),
   FOREIGN KEY(question_id) REFERENCES question(id) ON DELETE CASCADE
);

CREATE TABLE question_votes (
   id serial PRIMARY KEY,
   question_choices_id serial,
	score INT DEFAULT 0,
   FOREIGN KEY (question_choices_id) REFERENCES question_choices(id) ON DELETE CASCADE
);

INSERT INTO users(username, password) VALUES ('nikola', 'misterija');

select * from users;

INSERT INTO survey(id,  user_id, survey_name) VALUES (1, 1, 'Television Survey');

INSERT INTO question(survey_id, question_name) VALUES (1, 'What is your Favorite TV Show');
INSERT INTO question(survey_id, question_name) VALUES (1, 'Who is your favorite actor');

select * from question;


INSERT INTO question_choices(question_id, choice) VALUES (3, 'Breaking Bad');
INSERT INTO question_choices(question_id, choice) VALUES (3, 'Better Call Saul');
INSERT INTO question_choices(question_id, choice) VALUES (3, 'Shameless');
INSERT INTO question_choices(question_id, choice) VALUES (3, 'Leftovers');

select * from question_choices;

INSERT INTO question_votes(question_choices_id, score) VALUES (6, DEFAULT);
INSERT INTO question_votes(question_choices_id, score) VALUES (7, DEFAULT);

select * from question_votes;
