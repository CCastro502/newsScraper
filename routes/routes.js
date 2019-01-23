var cheerio = require("cheerio");
var axios = require("axios");
var mongoose = require("mongoose");
var db = require("../models");

module.exports = app => {

    app.get("/", (req, res) => {
        setTimeout(_ => {
            db.SavedArticle.find({}).then(data => {
                console.log(`render... ${data}`);
                res.render("saved", { articles: data });
            }).catch(err => console.log(err));
        }, 500)
    })

    app.get("/counterpunch", (req, res) => {
        let x = [];
        db.Article.find({}).then(data => {
            for (let i = 0; i < data.length; i++) {
                x.push(data[i]._id)
            }
        }).catch(err => console.log(err)).then(_ => {
            for (let i = 0; i < x.length; i++) {
                db.Article.findByIdAndRemove({ _id: x[i] }, (err, data) => err ? console.log(err) : console.log(`Data: ${data}`));
            };
        }).catch(err => console.log(err)).then(_ => {
            axios.get("https://www.counterpunch.org").then(response => {
                var $ = cheerio.load(response.data);
                $("div.left-sidebar-title").each((i, element) => {
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
                }).catch(err => console.log(err));
            }, 500)
        }).catch(err => console.log(err));
    });

    app.get("/democracynow", (req, res) => {
        let x = [];
        db.Article.find({}).then(data => {
            for (let i = 0; i < data.length; i++) {
                x.push(data[i]._id)
            }
        }).catch(err => console.log(err)).then(_ => {
            for (let i = 0; i < x.length; i++) {
                db.Article.findByIdAndRemove({ _id: x[i] }, (err, data) => err ? console.log(err) : console.log(`Data: ${data}`));
            };
        }).catch(err => console.log(err)).then(_ => {
            axios.get("https://www.democracynow.org").then(response => {
                var $ = cheerio.load(response.data);
                $("h3").each((i, element) => {
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
                }).catch(err => console.log(err));
            }, 1000)
        }).catch(err => console.log(err));
    });

    app.get("/intercept", (req, res) => {
        let x = [];
        db.Article.find({}).then(data => {
            for (let i = 0; i < data.length; i++) {
                x.push(data[i]._id)
            }
        }).catch(err => console.log(err)).then(_ => {
            for (let i = 0; i < x.length; i++) {
                db.Article.findByIdAndRemove({ _id: x[i] }, (err, data) => err ? console.log(err) : console.log(`Data: ${data}`));
            };
        }).catch(err => console.log(err)).then(_ => {
            console.log("Scrape.then is hit");
            axios.get("https://theintercept.com").then(response => {
                var $ = cheerio.load(response.data);
                $("h4.Promo-title").each((i, element) => {
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
                }).catch(err => console.log(err));
            }, 2500)
        }).catch(err => console.log(err));
    });

    app.post("/save/:row", (req, res) => {
        console.log(req.params.row);
        console.log(req.body);
        let savedLength;
        db.SavedArticle.find({}).then(data => {
            console.log(`Amount of articles in the saved data db: ${data.length}`)
            savedLength = data.length
        }).then(_ => {
            db.SavedArticle.create({ title: req.body.title, link: req.body.link, row: savedLength })
                .then(data => res.json(data))
                .catch(err => res.json(err));
        })

    })

    app.delete("/delete/:row", (req, res) => {
        console.log("I've been hit!");
        db.SavedArticle.findOneAndDelete({ row: req.params.row })
            .then(data => {
                console.log(data);
                res.json(data);
            })
            .catch(err => {
                res.json(err);
            });
    })
}