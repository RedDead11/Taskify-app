import React from "react";
import { Todo } from "../model";
import "./styles.css";
import editIcon from "../Images/Edit Icon.png";
import deleteIcon from "../Images/delete icon.png";
import doneIcon from "../Images/complete icon.png";

type Props = {
  todo: Todo;
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
};

const SingleTodo = ({ todo, todos, setTodos }: Props) => {
  return (
    <form className="todo-card">
      <div className="todo-text">
        <span>{todo.todo}</span>

        <div className="todo-icons-holder">
          <button className="icon-btn">
            <img src={editIcon} alt="Edit" />
          </button>

          <button className="icon-btn">
            <img src={deleteIcon} alt="Delete" />
          </button>

          <button className="icon-btn">
            <img src={doneIcon} alt="Done" />
          </button>
        </div>
      </div>
    </form>
  );
};

export default SingleTodo;
