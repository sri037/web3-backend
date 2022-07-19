import {Router} from 'express';
import {generator} from '@utils/generator';
import {userRoutes} from './routes/user.routes';

export const api: Router = Router();
api.use('/auth/user', userRoutes)

api.post('/generate/module', (req: any, res: any) => {
    let moduleName = req.body.data.module;
    let schemaObj = req.body.data.schema;
    console.log('in post mod', moduleName);
    console.log('in post mod', req.body.data);
    generator(moduleName, schemaObj);
    res.json({
        data: schemaObj,
    });
});

