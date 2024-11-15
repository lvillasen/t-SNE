var input;
var data;
var tsne;
var k;
var maxIter;
var perplexity;

var labels;

const colors = {};
BreastCancer();
function ownDataset() {
  document.getElementById("breastCancer").style.backgroundColor =
    "rgba(255, 255, 255, 0.6)";
  document.getElementById("MNIST").style.backgroundColor =
    "rgba(255, 255, 255, 0.6)";
  document.getElementById("ownDataset").style.backgroundColor =
    "rgba(0, 255, 0, 0.6)";
  //eraseText();
  readData();
}

function processData() {
  console.log("starting ....");
  maxIter = parseInt(document.getElementById("nIter").value);
  ColCat = parseInt(document.getElementById("ColCat").value);
  perplexity = parseInt(document.getElementById("perplexity").value);
  learningRate = parseInt(document.getElementById("learningRate").value);
  if (ColCat == -1) {
    labels = [];
    for (let i = 0; i <= data.length; i++) {
      labels.push("NL");
    }
  }
  tsne = new tsnejs.tSNE({
    dim: 3, // Dimensión de salida (2 o 3)
    perplexity: perplexity,
    earlyExaggeration: 4.0,
    learningRate: learningRate,
    nIter: maxIter, // Número de iteraciones
    metric: "euclidean",
  });

  // Alimenta los datos al modelo
  tsne.initDataRaw(data);
  k = 0;
  runTSNE();
}
function updateProgressBar(progress) {
  const progressBar = document.getElementById("progressBar");
  progressBar.style.width = progress + "%";
  progressBar.innerText = progress + "%";
}
function runTSNE() {
  if (k < maxIter) {
    tsne.step();
    k++;

    const progress = Math.floor((k / maxIter) * 100);
    updateProgressBar(progress);

    requestAnimationFrame(runTSNE);

    const tsneOutput3D = tsne.getSolution();
    const groups = {};

    tsneOutput3D.forEach((point, i) => {
      const label = labels[i];
      if (!groups[label]) {
        groups[label] = { x: [], y: [], z: [], text: [] };
      }
      groups[label].x.push(point[0]);
      groups[label].y.push(point[1]);
      groups[label].z.push(point[2]);
      groups[label].text.push(label);
    });

    const traces3D = Object.keys(groups).map((label) => ({
      x: groups[label].x,
      y: groups[label].y,
      z: groups[label].z,
      text: groups[label].text,
      mode: "markers",
      marker: {
        size: 5,
        opacity: 0.8,
      },
      name: label,
      type: "scatter3d",
    }));

    Plotly.newPlot("plot3D", traces3D, {
      title: "t-SNE 3D  " + "<br>Perplexity: " + perplexity + " Iter: " + k,
      scene: {
        xaxis: { title: "X" },
        yaxis: { title: "Y" },
        zaxis: { title: "Z" },
      },
    });

    const traces2D = Object.keys(groups).map((label) => ({
      x: groups[label].x,
      y: groups[label].y,
      text: groups[label].text,
      mode: "markers",
      marker: {
        size: 5,
        opacity: 0.8,
      },
      name: label,
      type: "scatter",
    }));

    Plotly.newPlot("plot2D", traces2D, {
      title: "t-SNE 2D" + "<br>Perplexity: " + perplexity + " Iter: " + k,
      xaxis: { title: "X" },
      yaxis: { title: "Y" },
    });

    // Completa la barra de progreso al 100%
    //updateProgressBar(100);
  }
}

function eraseText() {
  document.getElementById("dataInput").value = "";
  document.getElementById("breastCancer").style.backgroundColor =
    "rgba(255, 255, 255, 0.6)";
  document.getElementById("MNIST").style.backgroundColor =
    "rgba(255, 255, 255, 0.6)";
  document.getElementById("ownDataset").style.backgroundColor =
    "rgba(255, 255, 255, 0.6)";
  document.getElementById("Col1").value = 0;
  document.getElementById("Col2").value = 1;
  document.getElementById("ColCat").value = -1;
  document.getElementById("skipRow").value = 0;

  resultDim.innerHTML = `<strong>Number of Dimensions:</strong> 0`;
  resultPoints.innerHTML = `<strong>Number of Points:</strong> 0`;
}
