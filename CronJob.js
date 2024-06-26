import cron from "node-cron";
import fetch from "node-fetch";
import fs from "fs";
var path = "./views/Process.csv";
const cronJob = async () => {
    cron.schedule('*/1 * * * *', () => {
    console.log("Running CRON JOBS after 2 minutes");
     fetch("http://localhost:4000/getPrime");
     fetch('http://localhost:4000/usage/2');
})};
export default cronJob;