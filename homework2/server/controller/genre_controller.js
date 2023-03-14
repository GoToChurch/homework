const db = require('../db')

class GenreContoller {
    async createGenre(req, res) {
        const {name} = req.body;
        const newGenre = await db.query(`INSERT INTO genre (name) values ($1) RETURNING *`, [name]);
        res.send(newGenre.rows[0]);
    }

    async getGenres(req, res) {
        let genres;
        const id = req.params.id;

        try {
            if (id) {
                genres = await db.query(`SELECT * FROM genre
                                     WHERE id = $1`, [id]);
            } else {
                genres = await db.query(`SELECT * from genre`);
            }

            res.send(genres.rows);
        } catch (err) {
            res.send('Ошибка: Параметр id должен быть числом');
        }
    }

    async updateGenre(req, res) {
        const {id, name} = req.body;

        try {
            const genre = await db.query(`UPDATE genre SET name = $2
                                     WHERE id = $1 RETURNING *`, [id, name]);

            res.send(genre.rows[0])
        } catch (err) {
            res.send('Ошибка: Параметр id должен быть числом');
        }
    }

    async deleteGenre(req, res) {
        const id = req.params.id;

        try {
            if (id) {
                const genre = await db.query(`DELETE FROM genre 
                                     WHERE id = $1`, [id]);
                res.send(genre.rows[0]);
            }
        } catch (err) {
            res.send('Ошибка: Параметр id должен быть числом');
        }
    }
}

module.exports = new GenreContoller();