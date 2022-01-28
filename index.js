const puppeteer = require("puppeteer");
const fs = require("fs");
var co = [];
var osc = [];
var ost = [];

// Збирає весь текст з статтей на 58 сторінках html book

async function fun() {
	const browser = await puppeteer.launch();
	const page = await browser.newPage();
	await page.goto("http://htmlbook.ru/");
	for (var sdf = 0; sdf < 58; sdf++) {
		var res = await page.$$eval(".node-title a", (elements) => {
			let req = [];

			for (let i = 0; i < elements.length; i++) {
				req[i] = "http://htmlbook.ru" + elements[i].getAttribute("href");
			}
			return req;
		});
		co.push(res);
	}

	for (var t = 0; t < co.length; t++) {
		for (var u = 0; u < co[t].length; u++) {
			await page.goto(res[t]);
			var rea = await page.$$eval(
				".block-content article div:nth-child(2) p",
				(elements) => {
					let rev = [];
					for (var y = 0; y < elements.length; y++) {
						rev.push(elements[y].innerText);
					}
					return rev;
				}
			);
			osc.push(rea);
		}
		ost.push(osc);
	}
	if (!fs.existsSync("testFile.txt")) {
		fs.open("testFile.txt", "w", (err) => {
			if (err) throw err;
			console.log("File created");
		});
	}
	for (var g = 0; g < ost.length; g++) {
		ost[g] = ost[g].join("\r\n");
	}
	fs.writeFile("testFile.txt", ost.join("\r\n"), (err) => {
		if (err) throw err;
		console.log("Data has been added!");
	});
	await browser.close();
	console.log(res.join(" \n"));
}

fun();
