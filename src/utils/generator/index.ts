const fs = require('fs');
const index = require('readline');

const rl = index.createInterface({
    input: process.stdin,
    output: process.stdout
});

let files = [
    'routes',
    'controller',
    'service',
    'nosql.repo',
    'model',
    // 'test-spec',
    // 'sql.model',
    // 'sql.repo'
];

/*rl.question('Enter Module Name: ', (moduleName) => {
    if (!(moduleName === '' || moduleName === undefined)) {
        let modulePath = './src/modules/' + moduleName;
        let indexPath = './src/modules/';
        let apiPath = './src/io/api/';

        if (!fs.existsSync(modulePath)) {
            generator(moduleName);
        } else {
            console.error('Module already exists.', moduleName);
        }
    }
    rl.close();
});*/

function generator(moduleName, schema?: any) {
    console.log('mod', moduleName);
    if (moduleName === 'undefined' || moduleName === undefined) {
        return;
    }
    console.log('mod', moduleName);
    let modulePath = './src/modules/' + moduleName;
    let indexPath = './src/modules/';
    let apiPath = './src/io/api/';

    // create module folder
    fs.mkdirSync(modulePath, {recursive: true});
    // create controller folder
    fs.mkdirSync(apiPath + 'controller/' + moduleName, {recursive: true});
    // create service folder
    fs.mkdirSync(modulePath + '/service/', {recursive: true});
    // create repo folder
    fs.mkdirSync(modulePath + '/repo/', {recursive: true});
    // create model folder
    fs.mkdirSync(modulePath + '/model/', {recursive: true});
    for (let type of files) {
        let data = '';
        switch (type) {
            case 'model': {
                console.log('type', type);
                indexPath = modulePath + '/model';
                data = modelGenerator(moduleName, schema);
                break;
            }
            case 'sql.model': {
                indexPath = modulePath + '/model';
                data = sqlModelGenerator(moduleName);
                break;
            }
            case 'routes': {
                indexPath = apiPath + 'routes';
                data = routeGenerator(moduleName);
                break;
            }
            case 'test-spec' : {
                indexPath = apiPath + 'test-spec';
                data = testSpecGenerator(moduleName);
                break;
            }
            case 'controller': {
                indexPath = apiPath + 'controller/' + moduleName;
                data = controllerGenerator(moduleName);
                break;
            }
            case 'service': {
                indexPath = modulePath + '/service';
                data = serviceGenerator(moduleName);
                break;
            }
            case 'nosql.repo': {
                indexPath = modulePath + '/repo';
                data = repoGenerator(moduleName);
                break;
            }
            case 'sql.repo': {
                indexPath = modulePath + '/repo';
                data = sqlRepoGenerator(moduleName);

                const indexObj = repoIndex(moduleName);
                fs.writeFile(indexPath + `/index.ts`, indexObj, function (err) {
                    if (err) throw err;
                });
                break;
                break;
            }
        }
        if (type) {
            let fileType = type === 'test-spec' ? 'test.spec' : type;
            fs.writeFile(indexPath + `/${moduleName}.${fileType}.ts`, data, function (err) {
                if (err) throw err;
            });
        }

        indexPath = '';
    }

    let module = camelize(moduleName);
    let data = fs.readFileSync(apiPath + 'index.ts').toString().split('\n');
    data.splice(2, 0, `import { ${module}Route } from './routes/${moduleName}.routes';`);
    data.push(`api.use('/${moduleName}Route', ${moduleName}Route);`);
    let text = data.join('\n');
    fs.writeFileSync(apiPath + 'index.ts', text);
}

function camelize(str) {
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
        return index === 0 ? word.toLowerCase() : word.toUpperCase();
    }).replace(/\s+/g, '');
}

function routeGenerator(moduleGenerate) {
    let moduleName = camelize(moduleGenerate);
    return (`
import {Router} from 'express';
import {${moduleName}Controller} from "@controller/${moduleName}/${moduleName}.controller";
import {jwt} from '@middleware/jwt';
import acl from '@middleware/access.control';
import { Roles } from '@module/user/model/user.type';

export const ${moduleName}Route: Router = Router();

${moduleName}Route.post('/', [jwt.authenticateUser, acl( Roles.admin)], ${moduleName}Controller.create) // Create
.get('/:id', [jwt.authenticateUser, acl( Roles.admin)], ${moduleName}Controller.getById) // By id
.put('/:id', [jwt.authenticateUser, acl( Roles.admin)], ${moduleName}Controller.update) // Update
.get('/', [jwt.authenticateUser, acl( Roles.admin)], ${moduleName}Controller.get); // All
`);
}

function testSpecGenerator(moduleGenerate) {
    let moduleName = moduleGenerate.toLowerCase();
    return (`
import { testSpecObj } from './common';
export {};
let chai = require('chai');
let chaiHttp = require('chai-http');
chai.use(require('chai-things'));
let should = chai.should();
chai.use(chaiHttp);
let id = '';
export const url = testSpecObj.url;
let token = '';
const signInObj = {
    'data': {
        'email': testSpecObj.testUserName,
        'password': testSpecObj.testPassword
    }
};

function ${moduleName}TestSpec() {

describe('${moduleName}', () => {

    describe('Create ${moduleName}', () => {
    
        before(async () => {
            let dataObject = await chai.request(url)
                .post('auth/signIn')
                .send(signInObj);
            if (dataObject) {
                token = dataObject.body.data.token;
            } else {
                console.error('Invalid username or password');
            }
        });
            
        it('Test case for Create API', (done) => {

            chai.request(url)
                .post('/${moduleName}')
                .send({
                'data': {
                'name': 'srinivas'      
                }})
                .set('authorization', 'Bearer ' + token)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.data.should.be.a('object');                   
                    res.body.data.should.have.property('_id');
                    done();
                });
        });
    });
    
    describe('/GET ${moduleName}', () => {
        it('it should GET all ${moduleName}', (done) => {
            chai.request(url)
                .get('/${moduleName}')
                .set('authorization', 'Bearer ' + token)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.data.should.be.a('array');                   
                    res.body.data.should.all.have.property('_id');
                    done();
                });
        });
    });
    
    describe('/GET ${moduleName}', () => {
        it('it should GET by ${moduleName} Id', (done) => {
            chai.request(url)               
                .get('/${moduleName}/'+id)
                .set('authorization', 'Bearer ' + token)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.data.should.be.a('object');                   
                    res.body.data.should.have.property('_id');
                    done();
                });
        });
    });
    
    describe('/PUT ${moduleName}', () => {
        it('Test case for Update API', (done) => {

            chai.request(url)
                .put('/${moduleName}/'+id)
                .send({
                'data': {
                'name': 'Sri'      
                }})
                .set('authorization', 'Bearer ' + token)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.data.should.be.a('object');
                    res.body.data.should.have.property('name').eql('Sri');
                    done();
                });
        });
    });
    
    after(async () => {
            let dataObject = await chai.request(url)
                .delete('/${moduleName}/' + id)
                .set('authorization', 'Bearer ' + token);                
            if (dataObject) {
                if (dataObject.body.data.deletedCount === 1)
                    console.log('deleted successfully');
            } else {
                console.error('Failed to delete category');
            }
        });
  
});
}
module.exports = {
    ${moduleName}TestSpec
};
`);
}

function modelGenerator(moduleGenerate, schema) {
    let modelName = moduleGenerate.charAt(0).toUpperCase() + moduleGenerate.slice(1);
    if (schema === undefined) {
        schema = {
            name: 'String'
        };
    }
    let tempSchema = JSON.stringify(schema);
    let result = tempSchema.replace(/['"]+/g, '');
    result = result.replace('(', '\'');
    result = result.replace(')', '\'');
    return (`
import { Schema, model, Model, Document } from 'mongoose';
export class ${modelName}Model extends Schema {

    constructor() {

        const ${moduleGenerate}: any = super(${result}, 
            {timestamps: true});
        }
    }

let ${moduleGenerate}: ${modelName}Model = new ${modelName}Model();
export const ${moduleGenerate}Model: Model<Document> = model('${moduleGenerate}', ${moduleGenerate});
export default ${moduleGenerate}Model;
`);
}

function sqlModelGenerator(moduleGenerate) {
    let modelName = moduleGenerate.charAt(0).toUpperCase() + moduleGenerate.slice(1);
    return (
        `import {
    BaseEntity, Entity, PrimaryGeneratedColumn, Column, OneToOne,
    CreateDateColumn, UpdateDateColumn
} from 'typeorm';

@Entity('${modelName}')
export class ${modelName}SqlModel extends BaseEntity {
    @PrimaryGeneratedColumn()
    _id: number;
    
    @Column()
    name: string;
    
    @CreateDateColumn()
    created: Date;

    @UpdateDateColumn() 
    public updated: Date;   
}
`);
}

function sqlRepoGenerator(moduleGenerate) {
    let modelName = moduleGenerate.charAt(0).toUpperCase() + moduleGenerate.slice(1);
    let moduleName = moduleGenerate.toLowerCase();
    return (`
import {${modelName}SqlModel} from "@module/${moduleName}/model/${moduleName}.sql.model";
import { Repository, getManager } from 'typeorm';
    
class ${modelName}SQLRepo extends Repository<${modelName}SqlModel> {
  
        public async createObj(${moduleName}Object: any) {           
            let modelObj = new ${modelName}SqlModel();
            Object.assign(${moduleName}Object, modelObj);
            
            return await modelObj.save();
        }  
     
        public async update(${moduleName}Object: any): Promise<any> {           
            const modelRepo = getManager().getRepository(${modelName}SqlModel);
            
            return await modelRepo.save(${moduleName}Object);
        }
    
        public async find(query: any): Promise<any> {     
            try {
                const repoObj = getManager().getRepository(${modelName}SqlModel);
            
                return await repoObj.findOne({
                    where: query
                });
            } catch (e) {
                throw (e);
            }
        }
}
export const ${moduleName}SqlRepo: ${modelName}SQLRepo = new ${modelName}SQLRepo;
`);
}

function repoIndex(moduleGenerate) {
    let modelName = moduleGenerate.charAt(0).toUpperCase() + moduleGenerate.slice(1);
    let moduleName = camelize(moduleGenerate);
    return (`
import { ${moduleName}NoSqlRepo } from '@module/${moduleName}/repo/${moduleName}.nosql.repo';
import { ${moduleName}SqlRepo } from "@module/${moduleName}/repo/${moduleName}.sql.repo";

const ${modelName}Repo = process.env.DB_TYPE === 'nosql' ? ${moduleName}NoSqlRepo: ${moduleName}SqlRepo;
export default ${modelName}Repo;
`);
}

function repoGenerator(moduleGenerate) {
    let modelName = moduleGenerate.charAt(0).toUpperCase() + moduleGenerate.slice(1);
    let moduleName = camelize(moduleGenerate);
    return (`
import {${moduleName}Model} from "@module/${moduleName}/model/${moduleName}.model";
import { default as dbClient } from '@utils/db/mongoose';

const mongoose = require('mongoose');

class ${modelName}NoSqlRepo {
    constructor() {
    }
    
    public async createObj(${moduleName}Object: any) {
        return await new ${moduleName}Model(${moduleName}Object)
            .save()
    }  
 
    public async update(${moduleName}Object: any): Promise<any> {
        return await ${moduleName}Object.save();
    }

    public async find(query: any): Promise<any> {     
        try {
            let buildQuery = await dbClient.buildMongoQuery(query);
            let ${moduleName} = ${moduleName}Model.find(buildQuery);

            return ${moduleName};
        } catch (e) {
            throw (e);
        }
    }
}

export const ${moduleName}Repo: ${modelName}NoSqlRepo = new ${modelName}NoSqlRepo();
`);
}

function controllerGenerator(moduleGenerate) {
    let modelName = moduleGenerate.charAt(0).toUpperCase() + moduleGenerate.slice(1);
    let moduleName = camelize(moduleGenerate);
    return (`
import {${moduleName}Service} from "@module/${moduleName}/service/${moduleName}.service";

export class ${modelName}Controller {

    constructor() {
    }

    public async create(req: any, res: any, next: any): Promise<any> {
        try {
            let dataObject: any = req.body.data;
            let ${moduleName}Object: any = await ${moduleName}Service.create(dataObject);

            res.send({data: ${moduleName}Object});
        } catch (error) {
            next(error);
        }
    }
    
    public async get(req: any, res: any, next: any): Promise<any> {
        try {                           
            let ${moduleName}Object: any = await ${moduleName}Service.get();

            res.send({data: ${moduleName}Object});
        } catch (error) {
            next(error);
        }
    }
    
    public async getById(req: any, res: any, next: any): Promise<any> {
        try {
            let id: any = req.params.id;                           
            let ${moduleName}Object: any = await ${moduleName}Service.getById(id);

            res.send({data: ${moduleName}Object});
        } catch (error) {
            next(error);
        }
    }
    
    public async update(req: any, res: any, next: any): Promise<any> {
            try {
                let id: any = req.params.id;  
                let dataObject: any = req.body.data;                         
                let ${moduleName}Object: any = await ${moduleName}Service.update(id, dataObject);
    
                res.send({data: ${moduleName}Object});
            } catch (error) {
                next(error);
            }
        }    
}

export const ${moduleName}Controller: ${modelName}Controller = new ${modelName}Controller();
`);

}

function serviceGenerator(moduleGenerate) {
    let modelName = moduleGenerate.charAt(0).toUpperCase() + moduleGenerate.slice(1);
    let moduleName = camelize(moduleGenerate);
    return (`
import {${moduleName}Repo} from '@module/${moduleName}/repo/${moduleName}.nosql.repo';
export class ${modelName}Service {

    constructor() {       
    }
    
    public async create(${moduleName}Object: any): Promise<any> {
        try {
            return await ${moduleName}Repo.createObj(${moduleName}Object);           
        } catch (e) {
            throw e;
        }
    }

    public async update(id: any, ${moduleName}Object: any): Promise<any> {
        try {
            let ${moduleName}: any = await ${moduleName}Repo.find({_id: id});
            let newObj = Object.assign(${moduleName}[0], ${moduleName}Object);

            return await ${moduleName}Repo.update(newObj);           
        } catch (e) {
            throw e;
        }
    }

    public async getById(id: any): Promise<any> {
        try {
            return await ${moduleName}Repo.find({_id: id});          
        } catch (e) {
            throw e;
        }
    }

    public async get(): Promise<any> {
        try {
            return await ${moduleName}Repo.find({});
          
        } catch (e) {
            throw e;
        }
    }
}

export const ${moduleName}Service: ${modelName}Service = new ${modelName}Service();`);

}

export {generator};
