const Router = require('../route/Router');
const filmController = require('../controller/film_controller');


const router = new Router()

router.get('/films', filmController.getFilms);
router.post('/films', filmController.createFilm);
router.put('/films', filmController.updateFilm);
router.delete('/films', filmController.deleteFilm);

module.exports = router