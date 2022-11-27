function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    console.log(data);
    var sampleNames = data.names;
    sampleNames.forEach((sample) => {
        selector
            .append("option")
            .text(sample)
            .property("value", sample);
    });


    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
};

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });
  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var sampleData = data.samples
    console.log(sampleData)
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var sampleArray = sampleData.filter(sampleObj => sampleObj.id == sample)
    console.log(sampleArray)
    //  5. Create a variable that holds the first sample in the array.
    var firstSample = sampleArray[0];
    console.log(firstSample)

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_ids = firstSample.otu_ids
    var otu_labels = firstSample.otu_labels
    var sample_values = firstSample.sample_values
    console.log(otu_ids)
    console.log(otu_labels)
    console.log(sample_values)
    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var yticks = otu_ids.slice(0,10).map(item => "OTU " + item + " ").reverse();
    var xticks = sample_values.slice(0,10).map(item => item).reverse();
    var markerLabel = otu_labels.slice(0,10).map(item => item).reverse();
    
    console.log(yticks)
    console.log(xticks)
    console.log(markerLabel)
    // 8. Create the trace for the bar chart. 
    var barData = {
      x: xticks,
      y: yticks,
      text: markerLabel,
      type: 'bar',
      orientation: 'h'
    };
    // // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: {text: "<b> Top 10 Bacteria Cultures Found </b>"},
      paper_bgcolor: "rgba(70,70,70,0)",
      plot_bgcolor: "rgba(70,70,70,0)",
      font: {
        color: "#f7f7f7"
      }
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", [barData], barLayout)
  
    //Bar and Bubble Charts
    // 1. Create the trace for the bubble chart.
    var bubbleData = [{
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: "markers",
      marker: {
        color: otu_ids,
        size: sample_values,
        colorscale: "Earth"
      }
    }];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: {text: "<b> Bacteria Cultures per Sample </b>"},
      xaxis: {title: "OTU ID",},
      hovermode: "closest",
      paper_bgcolor: "rgba(70,70,70,0)",
      plot_bgcolor: "rgba(70,70,70,0)",
      font: {
        color: "#f7f7f7",        
      }
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout); 
  
    

    // Gauge Starter Code
    // 1. initialize variable to hold metadata of id that matches sample
    var metadata = data.metadata;
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    // 2. create variable to hold first sample
    var result = resultArray[0];
    // 3. create a variable that holds wfreq as a float
    var wfreq = parseFloat(result.wfreq);
    console.log(wfreq)

    // 4. create trace for guage
    var gaugeData = [{
      value: wfreq,
      title: {text: "<b> Belly Button Washing Frequency </b> <br> Scrubs per Week"},
      type: "indicator",
      mode: "gauge+number",
      gauge: {
        axis: {range: [null, 10]},
        bar: {color: "black"},
        steps: [
          {range: [0, 2], color: "red"},
          {range: [2, 4], color: "orange"},
          {range: [4, 6], color: "yellow"},
          {range: [6, 8], color: "lightgreen"},
          {range: [8, 10], color: "green"}
        ]
      }
    }];

    var gaugeLayout = {
      paper_bgcolor: "rgba(70,70,70,0)",
      plot_bgcolor: "rgba(70,70,70,0)",
      font: {
        color: "#f7f7f7"
      }
    }

    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  });
};



