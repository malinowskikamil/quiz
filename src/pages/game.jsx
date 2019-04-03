import axios from "axios";
import { api_url } from "../utils/defaults";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/layout";
import { Button, ButtonToolbar, ListGroup, ProgressBar } from "react-bootstrap";

class Game extends Component {
  state = {
    questions: [],
    questionsAmount: 10,
    activeQuestion: 0,
    score: 0
  };

  componentDidMount() {
    this.handleGetQuestions();
  }

  handleGetQuestions = () => {
    const { level, category } = this.props.match.params;
    axios
      .get(
        `${api_url}/api.php?amount=${
          this.state.questionsAmount
        }&difficulty=${level}&category=${category}`
      )
      .then(({ data: { results } }) => this.setState({ questions: results }));
  };

  increaseScore = () => {
    let { score } = this.state,
      { level } = this.props.match.params;
    switch (level) {
      case "easy":
        return this.setState({ score: score + 5 });
      case "medium":
        return this.setState({ score: score + 10 });
      case "hard":
        return this.setState({ score: score + 15 });
      default:
        break;
    }
  };

  renderAnswers = (data, activeQuestion) => {
    const shuffle = a => {
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    };
    if (activeQuestion < this.state.questionsAmount) {
      let answers = shuffle(data.incorrect_answers.concat(data.correct_answer));
      return (
        <div className="questions-container">
          <h1 className="question" dangerouslySetInnerHTML={{ __html: data.question }} />
          <ListGroup as="ul" className="questions-list">
            {answers.map(item => (
              <ListGroup.Item
                as="li"
                key={item}
                onClick={({ target }) =>
                  this.handleAnswer(target, item, data.correct_answer)
                }
                dangerouslySetInnerHTML={{ __html: item }}
              >
              </ListGroup.Item>
            ))}
          </ListGroup>
        </div>
      );
    } else {
      return (
        <div className="results">
          <h2>Your's score: {this.state.score}</h2>
          <ButtonToolbar>
            <Link className="btn btn-success" to="/">
              Change game
            </Link>
            <Button variant="success" onClick={() => this.handleReset()}>
              Restart
            </Button>
          </ButtonToolbar>
        </div>
      );
    }
  };

  handleAnswer = (target, answer, correct_answer) => {
    const { activeQuestion } = this.state;
    if (answer === correct_answer) {
      target.classList.add("success");
    } else {
      target.classList.add("danger");
    }
    setTimeout(() => {
      target.classList.remove("success");
      target.classList.remove("danger");
      answer === correct_answer && this.increaseScore();
      this.setState({ activeQuestion: activeQuestion + 1 });
    }, 300);
  };

  handleReset = () => {
    this.setState({ activeQuestion: 0, score: 0 });
    this.handleGetQuestions();
  };
  renderTitle = () => {
    const { questions, questionsAmount, activeQuestion } = this.state;
    if (questions.length === 0) {
      return "Loading ...";
    } else if (questions.length > 0 && activeQuestion < questionsAmount) {
      return `${questions[activeQuestion].category}`;
    } else if (questionsAmount === 10) {
      return "Results";
    }
  };

  render() {
    const { questions, activeQuestion, questionsAmount, score } = this.state;
    return (
      <Layout title={this.renderTitle()}>
        <div className="game-container">
          <ProgressBar
            variant={activeQuestion === 10 ? "success" : "primary"}
            now={activeQuestion * questionsAmount}
          />
          {activeQuestion < questionsAmount && (
            <p className="active-score"> Active score: {score}</p>
          )}
          {questions.length > 0 &&
            this.renderAnswers(questions[activeQuestion], activeQuestion)}
        </div>
      </Layout>
    );
  }
}

export default Game;
