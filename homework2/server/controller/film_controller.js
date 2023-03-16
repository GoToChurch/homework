const db = require('../db')
const WrongYearError = require('../errors/WrongYearError');

class FilmContoller {
    async createFilm(req, res) {
        let genre;
        const {name, year} = req.body;
        const genres = req.body.genres.split(", ");

        try {
            if (!isAppropriateYear(year)) {
                throw new WrongYearError("Поле 'year' должно быть числовым и быть больше 1888");
            }

            const newFilm = await db.query(`INSERT INTO film (name, year) values ($1, $2) RETURNING *`, [name, year])

            for (genre of genres) {
                let dbGenre = await db.query(`SELECT id FROM genre WHERE name = $1`, [genre]);
                await db.query(`INSERT INTO film_genres (film_id, genre_id) values ($1, $2)`, [newFilm.rows[0].id, dbGenre.rows[0].id]);
            }

            res.send(newFilm.rows[0]);
        } catch (err) {
            if (err instanceof TypeError) {
                res.send(`Жанра '${genre}' не существует. Добавьте его в таблицу 'genre'.`);
            } else if (err instanceof WrongYearError) {
                res.send(err.message);
            }
        }

    }

    async getFilms(req, res) {
        let films;
        const id = req.params.id;
        const name = req.params.name;
        const year = req.params.year;

        try {
            if (id) {
                films = await db.query(`SELECT film.id, film.name, year, genre.name AS genre FROM film
                                     JOIN film_genres ON film_genres.film_id = film.id
                                     JOIN genre ON film_genres.genre_id = genre.id
                                     WHERE film.id = $1`, [id]);
            } else if (name && year) {
                films = await db.query(`SELECT film.id, film.name, year, genre.name AS genre FROM film
                                     JOIN film_genres ON film_genres.film_id = film.id
                                     JOIN genre ON film_genres.genre_id = genre.id
                                     WHERE film.name = $1 AND film.year = $2`, [name, year]);
            } else if (name) {
                films = await db.query(`SELECT film.id, film.name, year, genre.name AS genre FROM film
                                     JOIN film_genres ON film_genres.film_id = film.id
                                     JOIN genre ON film_genres.genre_id = genre.id
                                     WHERE film.name = $1`, [name]);
            } else if (year) {
                films = await db.query(`SELECT film.id, film.name, year, genre.name AS genre FROM film
                                     JOIN film_genres ON film_genres.film_id = film.id
                                     JOIN genre ON film_genres.genre_id = genre.id
                                     WHERE film.year = $1`, [year]);
            } else {
                films = await db.query(`SELECT film.id, film.name, year, genre.name AS genre FROM film
                                     JOIN film_genres ON film_genres.film_id = film.id
                                     JOIN genre ON film_genres.genre_id = genre.id`);
            }

            res.send(films.rows);
        } catch (e) {
            res.send('Ошибка: Параметр id или year должны быть числом')
        }

    }

    async updateFilm(req, res) {
        let genre;
        const {id, name, year} = req.body;
        const genres = req.body.genres.split(", ");

        try {
            if (!isAppropriateYear(year)) {
                throw new WrongYearError("Поле 'year' должно быть числовым и быть больше 1888");
            }
            const film = await db.query(`UPDATE film SET name = $1, year = $2
                                     WHERE id = $3 RETURNING *`, [name, year, id]);

            for (genre of genres) {
                let dbGenre = await db.query(`SELECT id FROM genre WHERE name = $1`, [genre]);
                await db.query(`UPDATE film_genres SET genre_id = $2
                            WHERE film_id = $1`, [film.rows[0].id, dbGenre.rows[0].id]);
            }

            res.send(film.rows[0])
        } catch (err) {
            if (err instanceof WrongYearError) {
                res.send(err.message);
            } else {
                res.send(`Фильма с id = ${id} или жанра '${genre}' не сушествует.`);
            }
        }

    }

    async deleteFilm(req, res) {
        const id = req.params.id;

        try {
            if (id) {
                const film = await db.query(`DELETE FROM film 
                                     WHERE id = $1`, [id]);
                res.send(film.rows[0]);
            }
        } catch (e) {
            res.send('Ошибка: Параметр id должен быть числом');
        }
    }
}

function isAppropriateYear(year) {
    return Number.isFinite(year) && year > 1888
}

module.exports = new FilmContoller();