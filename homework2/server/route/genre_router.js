const Router = require('../route/Router');
const genreController = require('../controller/genre_controller');


const router = new Router()

router.get('/genres', genreController.getGenres);
router.post('/genres', genreController.createGenre);
router.put('/genres', genreController.updateGenre);
router.delete('/genres', genreController.deleteGenre);

module.exports = router