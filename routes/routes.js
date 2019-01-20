var cheerio = require("cheerio");
var axios = require("axios");
var mongoose = require("mongoose");
var db = require("../models");

module.exports = function (app) {

    app.get("/", function (req, res) {
        let x;
        db.Article.find({}, function (err, data) {
            x = data.length
            console.log(x);
        });
        for (let i = 0; i < x; i++) {
            db.Article.findOneAndDelete({});
            db.Article.remove();
        };
        axios.get("https://www.counterpunch.org").then(function (response) {
            var $ = cheerio.load(response.data);
            $("div.left-sidebar-title").each(function (i, element) {
                var title = $(element).text();
                var link = "https://www.counterpunch.org"
                link += $(element).find("a").attr("href");
                var obj = {
                    title: title,
                    link: link
                }
                db.Article.create(obj);
            });
            db.Article.find({}).then(function (data) {
                res.render("index", { articles: data });
            }).catch(function (err) {
                if (err) throw err;
            })
        });
    });

    app.get("/dn", function (req, res) {
        let x;
        db.Article.find({}, function (err, data) {
            x = data.length
            console.log(x);
        });
        for (let i = 0; i < x; i++) {
            db.Article.findOneAndDelete({});
            db.Article.remove();
        };
        axios.get("https://www.democracynow.org").then(function (response) {
            var $ = cheerio.load(response.data);
            $("h3").each(function (i, element) {
                var title = $(element).text();
                var link = "https://www.democracynow.org"
                link += $(element).find("a").attr("href");
                var obj = {
                    title: title,
                    link: link
                }
                db.Article.create(obj);
            });
            db.Article.find({}).then(function (data) {
                res.render("index", { articles: data });
            }).catch(function (err) {
                if (err) throw err;
            })
        });
    });

    app.get("/intercept", function (req, res) {
        let x = [];
        db.Article.find({}).then(function(data) {
            for (let i = 0; i < data.length; i++) {
                x.push(data[i]._id)
            }
        }).catch(function (err) {
            if (err) throw err;
        });
        for (let i = 0; i < x.length; i++) {
            db.Article.findByIdAndRemove({_id: x[i]}, function (err, data) {
                if (err) throw err;
                console.log(data);
            });
        };
        axios.get("https://theintercept.com").then(function (response) {
            var $ = cheerio.load(response.data);
            $("h4.Promo-title").each(function (i, element) {
                var title = $(element).text();
                var link = "https://theintercept.com"
                link += $(element).parent().parent().parent().parent().attr("href");
                var obj = {
                    title: title,
                    link: link
                }
                db.Article.create(obj);
            });
            db.Article.find({}).then(function (data) {
                res.render("index", { articles: data });
            }).catch(function (err) {
                if (err) throw err;
            })
        });
    });

}