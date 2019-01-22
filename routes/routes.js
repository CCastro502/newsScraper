var cheerio = require("cheerio");
var axios = require("axios");
var mongoose = require("mongoose");
var db = require("../models");

module.exports = function (app) {

    app.get("/", function (req, res) {
        let x = [];
        db.Article.find({}).then(function (data) {
            for (let i = 0; i < data.length; i++) {
                x.push(data[i]._id)
            }
        }).catch(err => {
            if (err) throw err;
        }).then(_ => {
            for (let i = 0; i < x.length; i++) {
                db.Article.findByIdAndRemove({ _id: x[i] }, function (err, data) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(`Data: ${data}`);
                    };
                });
            };
        }).catch(err => {
            console.log(err);
        }).then(_ => {
            axios.get("https://www.counterpunch.org").then(function (response) {
                var $ = cheerio.load(response.data);
                $("div.left-sidebar-title").each(function (i, element) {
                    var title = $(element).text();
                    var link = $(element).find("a").attr("href");
                    var obj = {
                        title: title,
                        link: link,
                        row: i
                    }
                    db.Article.create(obj);
                });
            });
        }).then(_ => {
            setTimeout(_ => {
                db.Article.find({}).then(data => {
                    console.log(`render... ${data}`);
                    res.render("index", { articles: data });
                }).catch(function (err) {
                    if (err) throw err;
                });
            }, 2000)
        }).catch(err => console.log(err));
    });

    app.get("/dn", function (req, res) {
        let x = [];
        db.Article.find({}).then(function (data) {
            for (let i = 0; i < data.length; i++) {
                x.push(data[i]._id)
            }
        }).catch(err => {
            if (err) throw err;
        }).then(_ => {
            for (let i = 0; i < x.length; i++) {
                db.Article.findByIdAndRemove({ _id: x[i] }, function (err, data) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(`Data: ${data}`);
                    };
                });
            };
        }).catch(err => {
            if (err) throw err;
        }).then(_ => {
            axios.get("https://www.democracynow.org").then(function (response) {
                var $ = cheerio.load(response.data);
                $("h3").each(function (i, element) {
                    var title = $(element).text();
                    var link = "https://www.democracynow.org"
                    link += $(element).find("a").attr("href");
                    var obj = {
                        title: title,
                        link: link,
                        row: i
                    }
                    db.Article.create(obj);
                });
            });
        }).then(_ => {
            setTimeout(_ => {
                db.Article.find({}).then(data => {
                    console.log(`render... ${data}`);
                    res.render("index", { articles: data });
                }).catch(function (err) {
                    if (err) throw err;
                });
            }, 2000)
        }).catch(err => console.log(err));
    });

    app.get("/intercept", function (req, res) {
        let x = [];
        db.Article.find({}).then(function (data) {
            for (let i = 0; i < data.length; i++) {
                x.push(data[i]._id)
            }
        }).catch(err => {
            if (err) throw err;
        }).then(_ => {
            for (let i = 0; i < x.length; i++) {
                db.Article.findByIdAndRemove({ _id: x[i] }, function (err, data) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(`Data: ${data}`);
                    };
                });
            };
        }).catch(err => {
            if (err) throw err;
        }).then(_ => {
            console.log("Scrape.then is hit");
            axios.get("https://theintercept.com").then(function (response) {
                var $ = cheerio.load(response.data);
                $("h4.Promo-title").each(function (i, element) {
                    var title = $(element).text();
                    var link = "https://theintercept.com"
                    link += $(element).parent().parent().parent().parent().attr("href");
                    var obj = {
                        title: title,
                        link: link,
                        row: i
                    }
                    db.Article.create(obj);
                });
            })
        }).then(_ => {
            setTimeout(_ => {
                db.Article.find({}).then(data => {
                    console.log(`render... ${data}`);
                    res.render("index", { articles: data });
                }).catch(function (err) {
                    if (err) throw err;
                });
            }, 2000)
        }).catch(err => console.log(err));
    });
}