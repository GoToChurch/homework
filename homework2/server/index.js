const PORT = process.env.PORT || 8080;
const Application = require('./application/Application');
const filmRouter = require('./route/film_router');
const genreRouter = require('./route/genre_router');
const jsonParser = require('./parser/json_parser');
const urlParser = require('./parser/url_parser');


const app = new Application()

app.use(jsonParser);
app.use(urlParser('http://localhost:8080'));

app.addRouter(filmRouter);
app.addRouter(genreRouter);


const start = async () => {
    try {
        app.listen(PORT, () => console.log(`Server started on PORT ${PORT}`))
    } catch (e) {
        console.log(e)
    }
}

start()