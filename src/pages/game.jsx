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
    score: 0,
    timer: 15,
    showTimer: true
  };

  componentDidMount() {
    this.handleGetQuestions();
  }

  componentWillUnmount() {
    clearInterval(this.tick);
  }


  handleGetQuestions = () => {
    const { level, category } = this.props.match.params;
    axios
      .get(
        `${api_url}/api.php?amount=${
        this.state.questionsAmount
        }&difficulty=${level}&category=${category}`
      )
      .then(({ data: { results } }) => {
        const shuffle = a => {
          for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
          }
          return a;
        };
        results.map(item =>
          item.answers = shuffle(item.incorrect_answers.concat(item.correct_answer))
        )
        this.setState({ questions: results })
        this.tick()
      });
  };

  increaseScore = () => {
    let { score, timer } = this.state,
      { level } = this.props.match.params;
    switch (level) {
      case "easy":
        return this.setState({ score: score + (5 * timer) });
      case "medium":
        return this.setState({ score: score + (10 * timer) });
      case "hard":
        return this.setState({ score: score + (15 * timer) });
      default:
        break;
    }
  };

  handleSaveScore = () => {
    const user = JSON.parse(sessionStorage.getItem("active_user")),
      { score } = this.state;
    const newHighScores = JSON.parse(localStorage.getItem("high_scores")).map(
      item => {
        if (item.name === user) {
          return { name: item.name, score };
        }
        return { name: item.name, score: item.score };
      }
    );
    localStorage.setItem("high_scores", JSON.stringify(newHighScores));
    this.props.history.push('/highscores')
  };

  handleCheckOldScore = () => {
    const user = JSON.parse(sessionStorage.getItem("active_user")),
      oldScore = JSON.parse(localStorage.getItem("high_scores")).find(
        ({ name }) => name === user
      ).score;
    return this.state.score > oldScore;
  };

  renderAnswers = (data, activeQuestion) => {

    if (activeQuestion < this.state.questionsAmount) {
      return (
        <div className="questions-container">
          <h1
            className="question"
            dangerouslySetInnerHTML={{ __html: data.question }}
          />
          <ListGroup as="ul" className="questions-list">
            {data.answers.map(item => (
              <ListGroup.Item
                as="li"
                key={item}
                onClick={({ target }) =>
                  this.handleAnswer(target, item, data.correct_answer)
                }
                dangerouslySetInnerHTML={{ __html: item }}
              />
            ))}
          </ListGroup>
        </div>
      );
    } else {
      return (
        <div className="results">
          <h2>Your's score: <span className='final-score'>{this.state.score}</span></h2>
          <ButtonToolbar>
            <Link className="btn btn-success" to="/">
              Change game
            </Link>
            <Link className="btn btn-success" to="/users">
              Change user
            </Link>
            <Button variant="success" onClick={() => this.handleReset()}>
              Restart
            </Button>
          </ButtonToolbar>
          {this.handleCheckOldScore() && (
            <>
              <p>New record!!!</p>
              <Button variant="success" onClick={() => this.handleSaveScore()}>
                Save Score
              </Button>
            </>
          )}
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
      this.setState({ activeQuestion: activeQuestion + 1, timer: 15 });
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
    } else if (activeQuestion === 10) {
      return "Results";
    }
  };

  tick = () => {
    setInterval(() => {
      const { timer, activeQuestion } = this.state;
      if (timer === 0) {
        clearInterval(this.tick);
        this.setState({ activeQuestion: activeQuestion + 1, timer: 15 })
      } else if (activeQuestion === 10) {
        clearInterval(this.tick);
        this.setState({ showTimer: false })
      } else {
        this.setState({ timer: timer - 1 })
      }
    }, 1000)
  };


  render() {
    const { questions, activeQuestion, questionsAmount, score, timer, showTimer } = this.state;
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
          {showTimer && <p className="timer">Time's left: {timer}</p>}
          {questions.length > 0 &&
            this.renderAnswers(questions[activeQuestion], activeQuestion)}
        </div>
      </Layout>
    );
  }
}

export default Game;
