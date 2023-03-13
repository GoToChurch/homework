const db = require('../db')

class FilmContoller {
    async createFilm(req, res) {
        const {name, year} = req.body;
        const genres = req.body.genres.split(", ");
        const newFilm = await db.query(`INSERT INTO film (name, year) values ($1, $2) RETURNING *`, [name, year])

        for (let genre of genres) {
            let dbGenre = await db.query(`SELECT id FROM genre WHERE name = $1`, [genre]);
            await db.query(`INSERT INTO film_genres (film_id, genre_id) values ($1, $2)`, [newFilm.rows[0].id, dbGenre.rows[0].id]);
        }

        res.send(newFilm.rows[0]);
    }

    async getFilms(req, res) {
        let films;
        const id = req.params.id;

        if (id) {
            films = await db.query(`SELECT film.id, film.name, year, genre.name AS genre FROM film
                                     JOIN film_genres ON film_genres.film_id = film.id
                                     JOIN genre ON film_genres.genre_id = genre.id
                                     WHERE film.id = $1`, [id]);
        } else {
            films = await db.query(`SELECT film.id, film.name, year, genre.name AS genre FROM film
                                     JOIN film_genres ON film_genres.film_id = film.id
                                     JOIN genre ON film_genres.genre_id = genre.id`);
        }

        res.send(films.rows);
    }

    async updateFilm(req, res) {
        const {id, name, year} = req.body;
        const genres = req.body.genres.split(", ");
        const film = await db.query(`UPDATE film SET name = $1, year = $2
                                     WHERE id = $3 RETURNING *`, [name, year, id]);

        for (let genre of genres) {
            let dbGenre = await db.query(`SELECT id FROM genre WHERE name = $1`, [genre]);
            await db.query(`UPDATE film_genres SET genre_id = $2
                            WHERE film_id = $1`, [film.rows[0].id, dbGenre.rows[0].id]);
        }

        res.send(film.rows[0])
    }

    async deleteFilm(req, res) {
        const id = req.params.id;

        if (id) {
            const film = await db.query(`DELETE FROM film 
                                     WHERE id = $1`, [id]);
            res.send(film.rows[0]);
        }
    }
}

module.exports = new FilmContoller();