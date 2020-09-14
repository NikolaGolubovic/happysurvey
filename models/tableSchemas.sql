DROP TABLE question_votes;
DROP TABLE question_choices;
DROP TABLE question;
DROP TABLE survey;
DROP TABLE users;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


CREATE TABLE IF NOT EXISTS  users (
	id uuid  DEFAULT uuid_generate_v4() PRIMARY KEY,
	username VARCHAR(50) NOT NULL UNIQUE,
	PASSWORD VARCHAR(100),
   created_on DATE NOT NULL DEFAULT CURRENT_DATE
);

CREATE TABLE survey (
	id uuid  DEFAULT uuid_generate_v4() PRIMARY KEY,
	user_id uuid NOT NULL,
	survey_name VARCHAR(150) NOT NULL,
	survey_string TEXT,
	created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	deadline TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP + INTERVAL '5 days',
	FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);


CREATE TABLE question (
	id uuid  DEFAULT uuid_generate_v4() PRIMARY KEY,
	survey_id uuid,
	question_name VARCHAR(200),
	FOREIGN KEY(survey_id) REFERENCES survey(id) ON DELETE CASCADE
);

CREATE TABLE question_choices (
	id uuid  DEFAULT uuid_generate_v4() PRIMARY KEY,
	question_id uuid,
	choice VARCHAR(200),
   FOREIGN KEY(question_id) REFERENCES question(id) ON DELETE CASCADE
);

CREATE TABLE question_votes (
   id uuid  DEFAULT uuid_generate_v4() PRIMARY KEY,
   question_choices_id uuid,
	score INT DEFAULT 0,
   FOREIGN KEY (question_choices_id) REFERENCES question_choices(id) ON DELETE CASCADE
);



-- TESTING QUERIES

INSERT INTO users(username, password) VALUES ('nikola', 'misterija');

SELECT id FROM users;

INSERT INTO survey(id,  user_id, survey_string) VALUES (1, '36bb3091-e43d-4324-98dc-051204feb0c5', '101290', '{
            "type": "radiogroup",
            "name": "What is your Favorite TV Show?",
            "title": "What is your Favorite TV Show?",
            "isRequired": true,
            "colCount": 2,
            "choices": [
              "Breaking Bad",
              "Better Call Saul",
              "Shameless",
              "Leftovers"
            ]
          },
          {
            "type": "radiogroup",
            "name": "Who is your favorite actor?",
            "title": "Who is your favorite actor?",
            "isRequired": true,
            "colCount": 2,
            "choices": [
              "Joaquin Phoenix",
              "Gary Oldman",
              "Tom Hanks",
              "Jack Nicholson",
              "Marlon Brando"
            ]
          }');

INSERT INTO question(survey_id, question_name) VALUES (1, 'What is your Favorite TV Show');
INSERT INTO question(survey_id, question_name) VALUES (1, 'Who is your favorite actor');

INSERT INTO question_choices(question_id, choice) VALUES (1, 'Breaking Bad');
INSERT INTO question_choices(question_id, choice) VALUES (1, 'Better Call Saul');
INSERT INTO question_choices(question_id, choice) VALUES (1, 'Shameless');
INSERT INTO question_choices(question_id, choice) VALUES (1, 'Leftovers');

INSERT INTO question_votes(question_choices_id, score) VALUES (1, DEFAULT);
INSERT INTO question_votes(question_choices_id, score) VALUES (2, DEFAULT);

SELECT question_name, choice, score
FROM question_votes
LEFT JOIN question_choices
ON question_votes.question_choices_id = question_choices.id
LEFT JOIN question
ON question_choices.question_id = question.id
LEFT JOIN survey
ON question.survey_id = survey.id;

SELECT 
FROM survey
LEFT JOIN question
ON survey.id = question.survey_id
LEFT JOIN question_choices
ON question_choices.question_id = question.id
LEFT JOIN question_votes
ON question_votes.question_choices_id = question_choices.id;

UPDATE question_votes
SET score = score + 1
WHERE question_votes.id = 50;