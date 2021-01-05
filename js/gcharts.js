"use strict";

// Callback that creates and populates a data table,
// instantiates the pie chart, passes in the data and
// draws it.
function drawChart(id) {

  // Create the data table.
  var data = new google.visualization.DataTable();
  data.addColumn('string', 'Topping');
  data.addColumn('number', 'Slices');
  data.addRows([
    ['Mushrooms', 3],
    ['Onions', 1],
    ['Olives', 1],
    ['Zucchini', 1],
    ['Pepperoni', 2]
  ]);

  // Set chart options
  var options = {
    'title': 'How Much Pizza I Ate Last Night',
    'width': 1200,
    'height': 800
  };

  // Instantiate and draw our chart, passing in some options.
  const chart = new google.visualization.BarChart(document.getElementById(id));
  chart.draw(data, options);
}

function drawChartOne() {
  drawChart("chart_div")
}

function drawChartTwo() {
  drawChart("chart_div_2")
}