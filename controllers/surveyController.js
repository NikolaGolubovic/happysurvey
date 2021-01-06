const router = require("express").Router();
const jwt = require("jsonwebtoken");
const db = require("../models/db");
const auth = require("../utils/auth");

router.get("/all", async (req, res) => {
  const recentString = `SELECT SUM(score), COUNT(distinct question.id) AS question_nums, survey.id, survey.survey_name
  FROM question_votes
  LEFT JOIN question_choices
  ON question_votes.question_choices_id = question_choices.id
  LEFT JOIN question
  ON question_choices.question_id = question.id
  LEFT JOIN survey
  ON question.survey_id = survey.id
  GROUP BY survey.id
  ORDER BY (SUM (score) / COUNT (distinct question.id)) DESC
  LIMIT $1`.replace(/(?:\r\n|\r|\n)/g, "");
  const surveys = await db.query(
    "SELECT id, survey_name, created_at, deadline FROM survey"
  );
  const popular = await db.query(recentString, [3]);
  res.json({ surveys: surveys.rows, popular: popular.rows });
});

router.get("/results/:id", async (req, res) => {
  // question name, choices, choices_votes, title
  const { id } = req.params;
  const resultString = `SELECT question_name, choice, score
  FROM question_votes
  LEFT JOIN question_choices
  ON question_votes.question_choices_id = question_choices.id
  LEFT JOIN question
  ON question_choices.question_id = question.id
  LEFT JOIN survey
  ON question.survey_id = survey.id
  WHERE survey.id = $1`.replace(/(?:\r\n|\r|\n)/g, "");
  const result = await db.query(resultString, [id]);
  res.send(result.rows);
});

router.get("/recentresults", async (req, res) => {
  const recentQuery = `SELECT id
  FROM survey
  ORDER BY created_at DESC
  LIMIT $1`;
  const response = await db.query(recentQuery, [3]);
  const ids = response.rows.map((row) => row.id);
  res.status(200).send(ids);
});

router.get("/single/:id", async (req, res) => {
  const { id } = req.params;
  const singleSurvey = await db.query(
    "SELECT survey_string, survey_name FROM survey WHERE id = $1",
    [id]
  );
  res.json({
    surveyString: singleSurvey.rows[0].survey_string,
    surveyTitle: singleSurvey.rows[0].survey_name,
  });
});
``;
router.post("/create", auth, async (req, res, next) => {
  try {
    const decoded = jwt.verify(req.token, process.env.SECRET);
    if (!decoded || !decoded.id) {
      return res.status(404).send("For That action you need to be log in");
    }
    const { survey, title } = req.body;
    const intoSurvey = await db.query(
      "INSERT INTO survey(user_id, survey_string, survey_name) VALUES ($1, $2, $3) returning *",
      [decoded.id, survey, title]
    );
    const surveyId = intoSurvey.rows[0].id;
    const surveyArr = JSON.parse(survey);
    const questionsIds = [];
    for (let i = 0; i < surveyArr.length; i++) {
      const question = await db.query(
        "INSERT INTO question(survey_id, question_name) VALUES ($1, $2) returning *",
        [surveyId, surveyArr[i].title]
      );
      if (question.rows[0].id) {
        questionsIds.push(question.rows[0].id);
      }
    }

    const choicesIds = [];
    for (let i = 0; i < surveyArr.length; i++) {
      for (let j = 0; j < surveyArr[i].choices.length; j++) {
        const choice = await db.query(
          "INSERT INTO question_choices(question_id, choice) VALUES ($1, $2) returning *",
          [questionsIds[i], surveyArr[i].choices[j]]
        );
        choicesIds.push(choice.rows[0].id);
      }
    }

    for (let i = 0; i < choicesIds.length; i++) {
      await db.query(
        "INSERT INTO question_votes(question_choices_id, score) VALUES ($1, 0)",
        [choicesIds[i]]
      );
    }

    return res.status(200).send("Survey is successfully created");
  } catch (err) {
    next(err);
  }
});

router.post("/updateVotes", async (req, res) => {
  const { data, id } = req.body;
  console.log("hello");
  let queryString = `UPDATE question_votes SET score = score +1
  FROM question_choices, question, survey
  WHERE question_votes.question_choices_id = question_choices.id
  AND question_choices.question_id = question.id
  AND question.survey_id = survey.id
  AND question.question_name = $1
  AND question_choices.choice = $2
  AND survey.id = $3`.replace(/(?:\r\n|\r|\n)/g, "");
  for (let key in data) {
    await db.query(queryString, [key, data[key], id]);
  }
});

module.exports = router;
