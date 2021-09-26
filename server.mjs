import Express from 'express'
import Handlebars from 'express-handlebars'
import fs from 'fs'
import Markdown from 'markdown-it'

const app = Express();
const md = Markdown();
const hbs = Handlebars.create({
	extname: "hbs",
	defaultLayout: "main",
	layoutsDir: "views/layouts/",
	partialsDir: "views/partials/"
});

app.set("view engine", "hbs");
app.engine("hbs", hbs.engine)

app.use(Express.static("static"))

app.get("/", async (req, res) =>
{
	res.render("index", {
		recipeIndex: await getRecipeIndex()
	});

});

app.get("/recipes/:id", (req, res) =>
{
	fs.readFile(`views/recipes/${req.params.id}`, 'utf-8', async (err, data) =>
	{
		if (err)
			console.log("Couldn't find recipe.");
		else
			res.render("recipe", {
				content: md.render(data),
				recipeIndex: await getRecipeIndex()
			});
	});
});

// callback hell
function getRecipeIndex()
{
	return new Promise((res, rej) =>
	{
		fs.readdir("views/recipes", "utf-8", (err, files) =>
		{
			if (err)
				rej("No recipes?");
			else
			{
				let ret = [];
				files.forEach(file =>
				{
					const words = file.slice(0, -3).split('-');
					const capWords = [];
					words.forEach(word =>
					{
						capWords.push(
							word[0].toUpperCase() + word.substring(1));

					});
					ret.push({
						file: file,
						name: capWords.join(" ")
					});
				});
				res(ret);
			}
		})
	});
}

app.listen(3000);