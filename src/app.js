import {div, h, input} from '@cycle/dom';
import xs from 'xstream';

function validMatrix (matrix) {
  if ((matrix[0] === 0 && matrix[1] === 0) ||
      (matrix[2] === 0 && matrix[3] === 0)) {
    return false;
  }

  if (matrix[0] === matrix[2] && matrix[1] === matrix[3]) {
    return false;
  }

  return true;
}

function App ({DOM}) {
  const width = window.innerWidth;
  let height = window.innerHeight;
  let originalHeight = window.innerHeight;

  height = width;
  const viewBox = `${-(width / 2)} ${-(height / 2)} ${width} ${height}`;

  const vals = [
    {label: 'ix', initial: 1},
    {label: 'iy', initial: 0},
    {label: 'jx', initial: 0},
    {label: 'jy', initial: 1}
  ];

  const scalarStreams = vals.map(scalar =>
    DOM
      .select(`.${scalar.label}`)
      .events('input')
      .map(ev => parseFloat(ev.target.value))
      .filter(number => !isNaN(number))
      .startWith(scalar.initial)
  );

  const matrix$ = xs.combine(...scalarStreams)
    .map(([ix, iy, jx, jy]) => [
      ix, -iy,
      jx, -jy,
      0, 0
    ])
    .filter(validMatrix)

  const grid = renderGrid({width, height});

  return {
    DOM: matrix$.map(matrix =>
      div('.matrix-graph', [
        div('.inputs', [
          div('Controls'),
          div([
            input('.ix', {attrs: {value: matrix[0]}}),
            input('.jx', {attrs: {value: matrix[2]}}),
          ]),
          div([
            input('.iy', {attrs: {value: -matrix[1]}}),
            input('.jy', {attrs: {value: -matrix[3]}})
          ])
        ]),
        h('svg', {style: {'margin-top': `${-(height - originalHeight) / 2}px`, transform: `matrix(${matrix})`}, attrs: {preserveAspectRatio: 'none', viewBox}}, [
          grid,

          h('line', {
            attrs: {
              x1: 0,
              y1: 0,
              x2: 150,
              y2: 50,
              stroke: 'yellow'
            }
          })
        ])
      ])
    )
  };
}

function renderGrid ({width, height}) {
  const spacing = 50;

  width = Math.max(width, height);
  height = Math.max(width, height);

  const left = -(width / 2);
  const top = -(height / 2);
  const right = width * 2;
  const bottom = height * 2;

  return (
    h('g', [
      // TODO refactor
      ...new Array(20).fill(null).map((_, i) =>
        h('line', {
          attrs: {
            x1: left,
            y1: i * -spacing,
            x2: right,
            y2: i * -spacing,
            stroke: 'skyblue'
          }
        }),
      ),

      ...new Array(20).fill(null).map((_, i) =>
        h('line', {
          attrs: {
            x1: left,
            y1: i * spacing,
            x2: right,
            y2: i * spacing,
            stroke: 'skyblue'
          }
        }),
      ),

      ...new Array(20).fill(null).map((_, i) =>
        h('line', {
          attrs: {
            x1: i * spacing,
            y1: top,
            x2: i * spacing,
            y2: bottom,
            stroke: 'skyblue'
          }
        }),
      ),

      ...new Array(20).fill(null).map((_, i) =>
        h('line', {
          attrs: {
            x1: i * -spacing,
            y1: top,
            x2: i * -spacing,
            y2: bottom,
            stroke: 'skyblue'
          }
        }),
      ),

      h('circle', {
        attrs: {
          x: 0,
          y: 0,
          fill: 'skyblue',
          r: 5
        }
      })
    ])
  )
}

export default App;
