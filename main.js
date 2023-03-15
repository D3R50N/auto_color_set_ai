const network = new brain.NeuralNetwork();

const training_data = [
  { input: [1, 1, 1], output: [0] },
  { input: [0, 0, 0], output: [1] },
  { input: [1, 0, 0], output: [1] },
  { input: [0, 1, 0], output: [1] },
  { input: [0, 0, 1], output: [1] },
  { input: [1, 1, 0], output: [0] },
  { input: [1, 0, 1], output: [1] },
  { input: [0, 1, 1], output: [1] },
  { input: [0.1411764705882353, 0.9411764705882353, 1], output: [0] },
  { input: [0, 0, 0], output: [1] },
  { input: [1, 0.5019607843137255, 0.5019607843137255], output: [1] },
];

function rgbToData(r, g, b) {
  return [r / 255, g / 255, b / 255];
}
function dataToRgb(data) {
  return data.map((d) => Math.round(d * 255));
}

function hexToRgb(hex) {
  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  return [r, g, b];
}

network.train(training_data);

function domId(id) {
  return document.getElementById(id);
}
const preview = domId("preview");
const input = domId("input");
const text = domId("text");
const btn_c = domId("btn_c");
const btn_i = domId("btn_i");
const log = domId("log");

input.addEventListener("input", update);

var color, output;

function update() {
  preview.style.backgroundColor = input.value;
  color = hexToRgb(input.value.split("#").join(""));
  output = network.run(rgbToData(color[0], color[1], color[2]));

  // text.innerHTML = `Is ${input.value} dark? ${output[0] > 0.5 ? "Yes" : "No"}`;
  const isWhite = output[0] > 0.5;
  text.style.color = isWhite ? "white" : "black";

  btn_c.style.borderColor = isWhite ? "white" : "black";
  btn_c.style.color = isWhite ? "white" : "black";

  btn_i.style.borderColor = isWhite ? "white" : "black";
  btn_i.style.color = isWhite ? "white" : "black";

  //   debug.log(`${color} -> ${output[0]}`);
}

btn_c.addEventListener("click", () => {
  training_data.push({
    input: rgbToData(color[0], color[1], color[2]),
    output: [output[0] > 0.5 ? 1 : 0],
  });

  // debug.log(training_data[training_data.length - 1]);
  network.train(training_data);
});

btn_i.addEventListener("click", () => {
  training_data.push({
    input: rgbToData(color[0], color[1], color[2]),
    output: [output[0] > 0.5 ? 0 : 1],
  });
  // debug.log(training_data[training_data.length - 1]);
  network.train(training_data);
  update();
});

log.addEventListener("click", () => {
  let content = "";

  training_data.forEach((data) => {
    content += `{ input:[${data.input[0]},${data.input[1]},${data.input[2]}], output: [${data.output[0]}] },\n`;
  });
  content = "[\n" + content + "\n]";

  navigator.clipboard.writeText(content);

  notify("Données copiées dans le presse-papier. (Ctrl+V");

  debug.log(content);
});

update();

function notify(str) {
    const notif = document.createElement("div");
    notif.classList.add("notification");
    notif.classList.add("in");
    notif.innerHTML = str;
    document.body.appendChild(notif);
    setTimeout(() => {
      notif.style.opacity = 0;
        notif.style.transform = "translate(-50%, -100%)";
        setTimeout(() => {
      document.body.removeChild(notif);

        }, 400);

      // notif.classList.remove("in");
      // notif.classList.add("out");
    }, 1000);

}