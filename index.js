import express from "express";
import fetch from "node-fetch";
import fs from "fs";
import cors from 'cors';
import cronJob from './CronJob.js'
const app = express();
app.use(cors())
app.use(express.json());
app.set("view engine", "hbs");

app.get("/generatePrime/:start/:end", async (req, res) => {
  let a = req.params.end - req.params.start;
  let b = Math.round(a / 3);
  fetch(`http://localhost:5000/primeNumber/${req.params.start}/${b}`);
  fetch(`http://localhost:5001/primeNumber/${b + 1}/${b * 2}`);
  fetch(
    `http://localhost:5002/primeNumber/${b * 2 + 1}/${req.params.end}`
  );

  res.send("Load has been distributed. Please check files after a while! ");
});

app.get("/getPrime", async (req, res) => {
  fetch(`http://localhost:5000/getPrime`).then((response) =>
    response.text().then((result1) => {
      fs.appendFile("PrimeNumber.csv", result1 + ",", (err) =>
        console.log(err)
      );
    })
  );
  fetch(`http://localhost:5001/getPrime`).then((response) =>
    response.text().then((result2) => {
      fs.appendFile("PrimeNumber.csv", result2 + ",", (err) =>
        console.log(err)
      );
    })
  );
  fetch("http://localhost:5002/getPrime").then((response) =>
    response.text().then((result3) => {
      fs.appendFile("PrimeNumber.csv", result3 + ",", (err) =>
        console.log(err)
      );
    })
  );
  fs.readFile("PrimeNumber.csv", "utf-8", (err, data) => {
    if (!err && data) {
      res.send(data);
    } else {
      res.send(err);
    }
  });
});

app.get("/usage/:time", async (req, res) => {
  await fetch(`http://localhost:3000/usage/${req.params.time}`).then((stream) =>
    stream.text().then((data) => {
      fs.writeFile("views/Process.csv",data,(err)=>console.log(err));
    })
  );
  //   await Excel.run(async (context) => {
  //     let sheet = context.workbook.worksheets.getItem("Sample");
  //     let dataRange = sheet.getRange("A1:B13");
  //     let chart = sheet.charts.add(
  //       Excel.ChartType.line,
  //       dataRange,
  //       Excel.ChartSeriesBy.auto);

  //     chart.title.text = "Sales Data";
  //     chart.legend.position = Excel.ChartLegendPosition.right;
  //     chart.legend.format.fill.setSolidColor("white");
  //     chart.dataLabels.format.font.size = 15;
  //     chart.dataLabels.format.font.color = "black";

  //     await context.sync();
  // });
  res.render('index.hbs');
});

app.listen(4000, () => {
  console.log("listening on port 4000");
  //cronJob();                TODO not deleting file 
});
