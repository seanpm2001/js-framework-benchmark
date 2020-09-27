import React, { memo, useReducer, useCallback } from 'react';
import ReactDOM from 'react-dom';

function random(max) { return Math.round(Math.random() * 1000) % max; }

const A = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean",
  "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive",
  "cheap", "expensive", "fancy"];
const C = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"];
const N = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse",
  "keyboard"];

let nextId = 1;

function buildData(count) {
  const data = new Array(count);
  for (let i = 0; i < count; i++) {
    data[i] = {
      id: nextId++,
      label: `${A[random(A.length)]} ${C[random(C.length)]} ${N[random(N.length)]}`,
      clazz: ''
    };
  }
  return data;
}

function listReducer(state, action) {
  switch (action.type) {
    case 'RUN':
      return buildData(1000);
    case 'RUN_LOTS':
      return buildData(10000);
    case 'ADD':
      return state.concat(buildData(1000));
    case 'UPDATE':
      const newData = state.slice(0);
      for (let i = 0; i < newData.length; i += 10) {
        const r = newData[i];
        newData[i] = { id: r.id, label: r.label + " !!!", clazz: r.clazz };
      }
      return newData;
    case 'CLEAR':
      return [];
    case 'SWAP_ROWS':
      return (state.length > 998) ? [state[0], state[998], ...state.slice(2, 998), state[1], state[999]] : state;
    case 'REMOVE':
      const idx = state.findIndex((d) => d.id === action.id);
      return [...state.slice(0, idx), ...state.slice(idx + 1)];
    case 'SELECT':
      return state.map(d => {
        if (d.id === action.id) return {id: d.id, label: d.label, clazz: 'danger'};
        if (d.id !== action.id && d.clazz!=='') return {id: d.id, label: d.label, clazz: ''};
        return d;
      });
  }
  return state;
}

const GlyphIcon = <span className="glyphicon glyphicon-remove" aria-hidden="true"></span>;

const Row = memo(({ item, dispatch }) => {
  const select = useCallback(() => dispatch({ type: 'SELECT', id: item.id }), [item.id]),
    remove = useCallback(() => dispatch({ type: 'REMOVE', id: item.id }), [item.id]);

  return (<tr className={item.clazz}>
    <td className="col-md-1">{item.id}</td>
    <td className="col-md-4"><a onClick={select}>{item.label}</a></td>
    <td className="col-md-1"><a onClick={remove}>{GlyphIcon}</a></td>
    <td className="col-md-6"></td>
  </tr>);
});

const Button = ({ id, cb, title }) => (
  <div className="col-sm-6 smallpad">
    <button type="button" className="btn btn-primary btn-block" id={id} onClick={cb}>{title}</button>
  </div>
);

const Jumbotron = memo(({ dispatch }) =>
  <div className="jumbotron">
    <div className="row">
      <div className="col-md-6">
        <h1>React model hack</h1>
      </div>
      <div className="col-md-6">
        <div className="row">
          <Button id="run" title="Create 1,000 rows" cb={() => dispatch({ type: 'RUN' })} />
          <Button id="runlots" title="Create 10,000 rows" cb={() => dispatch({ type: 'RUN_LOTS' })} />
          <Button id="add" title="Append 1,000 rows" cb={() => dispatch({ type: 'ADD' })} />
          <Button id="update" title="Update every 10th row" cb={() => dispatch({ type: 'UPDATE' })} />
          <Button id="clear" title="Clear" cb={() => dispatch({ type: 'CLEAR' })} />
          <Button id="swaprows" title="Swap Rows" cb={() => dispatch({ type: 'SWAP_ROWS' })} />
        </div>
      </div>
    </div>
  </div>
, () => true);

const Main = () => {
  const [state, dispatch] = useReducer(listReducer, []);

  return (<div className="container">
    <Jumbotron dispatch={dispatch} />
    <table className="table table-hover table-striped test-data"><tbody>
      {state.map(item => (
        <Row key={item.id} item={item} dispatch={dispatch} />
      ))}
    </tbody></table>
    <span className="preloadicon glyphicon glyphicon-remove" aria-hidden="true"></span>
  </div>);
}

ReactDOM.render(<Main />, document.getElementById('main'));
