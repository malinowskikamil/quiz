import axios from "axios";
import { api_url } from "../utils/defaults";
import React, { Component } from "react";
import Layout from "../components/layout";
import { ListGroup, ProgressBar } from "react-bootstrap";

class Game extends Component {
  state = {
    questions: [],
    activeQuestion: 0
  };

  componentDidMount() {
    const { level, category } = this.props.match.params;
    axios
      .get(
        `${api_url}/api.php?amount=10&difficulty=${level}&category=${category}`
      )
      .then(({ data: { results } }) => this.setState({ questions: results }));
  }

  renderAnswers = data => {
    const shuffle = a => {
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    };
    console.log(data);
    let answers = data.incorrect_answers.concat(data.correct_answer);

    return (
      <>
        <h1 dangerouslySetInnerHTML={{ __html: data.question }} />
        <ListGroup as="ul" className="questions-list">
          {shuffle(answers).map(item => (
            <ListGroup.Item
              as="li"
              key={item}
              onClick={({ target }) =>
                this.handleAnswer(target, item, data.correct_answer)
              }
            >
              <span dangerouslySetInnerHTML={{ __html: item }} />
            </ListGroup.Item>
          ))}
        </ListGroup>
      </>
    );
  };

  handleAnswer = (target, answer, correct_answer) => {
    const { activeQuestion } = this.state;
    if (answer === correct_answer) {
      target.classList.add("success");
    } else {
      target.classList.add("danger");
    }
    setTimeout(() => {
      this.setState({ activeQuestion: activeQuestion + 1 });
    }, 1000);
  };

  render() {
    const { questions, activeQuestion } = this.state;
    return (
      <Layout
        title={
          questions.length > 0 ? `${questions[activeQuestion].category}` : ""
        }
      >
        <ProgressBar now={activeQuestion * 10} />
        {questions.length > 0 && this.renderAnswers(questions[activeQuestion])}
      </Layout>
    );
  }
}

export default Game;
