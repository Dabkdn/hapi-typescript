import { Schema, model, FilterQuery } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';
export default class Model<IModelData> {
    private model;
    public constructor(modelName: string, modelSchema: Schema) {
        this.model = model<IModelData>(modelName, modelSchema);
    }

    public create = async (params: Omit<IModelData, 'id' | 'created_at'>) => {
        const id = uuidv4();
        const record = {
            ...params,
            id,
            created_at: moment().utc(),
        };
        return await this.model.create(record);
    };

    public find = async (id: string) => {
        const conditions = { id } as any;
        return await this.model.findOne(conditions).exec();
    };

    public findBy = async (params: FilterQuery<IModelData>) => {
        return await this.model.findOne(params).exec();
    };

    public update = async (id: string, params: FilterQuery<IModelData>) => {
        const conditions = { id } as any;
        return await this.model.findOneAndUpdate(conditions, params);
    };

    public updateBy = async (
        condition: FilterQuery<IModelData>,
        params: FilterQuery<IModelData>
    ) => {
        return await this.model.findOneAndUpdate(condition, params);
    };

    public delete = async (id: string) => {
        const conditions = { id } as any;
        return await this.model.findOneAndDelete(conditions);
    };

    public deleteMany = async (ids: string[]) => {
        const params = { id: { $in: ids } } as any;
        return await this.model.deleteMany(params);
    };

    public deleteBy = async (params: FilterQuery<IModelData>) => {
        return await this.model.deleteMany(params);
    };

    public getBy = async (params: FilterQuery<IModelData>) => {
        return await this.model.find(params).exec();
    };
    public getByWithLimit = async (
        params: FilterQuery<IModelData>,
        limit: number,
        offset: number
    ) => {
        return await this.model
            .find(params)
            .sort({created_at: -1})
            .skip(offset)
            .limit(limit)
            .exec();
    };

    public createMany = async (params: FilterQuery<IModelData>[]) => {
        const data = params.map(param => {
            return {
                id: uuidv4(),
                ...param,
                created_at: moment().utc(),
            };
        });
        return await this.model.create(data);
    };

    public getAll = async () => {
        return await this.model.find({});
    };
}
