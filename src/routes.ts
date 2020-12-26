import { Router } from 'express'
import ClassesController from './controllers/ClassesControllers';
import ConnectionsControllers from './controllers/ConnectionsControllers';
import FavoritesControllers from './controllers/FavoritesControllers';

const routes = Router();
const classesController = new ClassesController()
const connectiosControllers = new ConnectionsControllers()
const favoritesController = new FavoritesControllers()

routes.post('/classes', classesController.create)
routes.get('/classes', classesController.show)
routes.get('/classesList', classesController.index)

routes.post('/favorites', favoritesController.create)
routes.get('/favorites/:id', favoritesController.index)
routes.delete('/favorites/:id', favoritesController.delete)

routes.get('/connections', connectiosControllers.index)
routes.post('/connections', connectiosControllers.create)

export default routes;