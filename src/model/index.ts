import Knex from "knex";
import { v4 as uuidv4 } from "uuid";
import { databaseConfig } from "../config";

export const knex = Knex(databaseConfig);

type IModelWhereCondition = "=" | ">" | ">=" | "<=" | "<" | "like";

export default class Model<IModelData> {
  private modelName: string;
  public constructor(modelName: string) {
    this.modelName = modelName;
  }

  public list = async (
    limit: number,
    offset: number,
    filter: any,
    sort?: any
  ): Promise<any[]> => {
    try {
      let result;
      if (sort) {
        result = await knex(this.modelName)
          .where(filter || {})
          .orderBy(sort[0], sort[1])
          .limit(limit)
          .offset(offset)
          .select();
      } else {
        result = await knex(this.modelName)
          .where(filter || {})
          .limit(limit)
          .offset(offset)
          .select();
      }
      return result;
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  public create = async (params: Omit<IModelData, "id" | "created_at">) => {
    const id = uuidv4();
    const record = {
      ...params,
      id,
    };
    const isCreated = await knex(this.modelName).insert(record);
    if (isCreated) {
      return record;
    }
    return false;
  };

  public find = async (id: string): Promise<IModelData | undefined> => {
    return await knex(this.modelName).where("id", id).first();
  };

  public findBy = async (params: any): Promise<IModelData | undefined> => {
    return await knex(this.modelName).where(params).first();
  };
  public findWhereBy = async (
    column: string,
    value: string,
    condition: IModelWhereCondition = "="
  ): Promise<IModelData | undefined> => {
    return await knex(this.modelName).where(column, condition, value).first();
  };

  public update = async (
    id: string,
    params: object
  ): Promise<IModelData | false> => {
    const record = await this.find(id);
    if (record) {
      const isUpdated = await knex(this.modelName).where({ id }).update(params);
      if (isUpdated) {
        return {
          ...record,
          ...params,
        };
      }
    }
    return false;
  };

  public updateBy = async (
    condition: object,
    params: object
  ): Promise<IModelData | false> => {
    const record = await this.findBy(condition);
    if (record) {
      const isUpdated = await knex(this.modelName)
        .where(condition)
        .update(params);
      if (isUpdated) {
        return {
          ...record,
          ...params,
        };
      }
    }
    return false;
  };

  public delete = async (id: string): Promise<IModelData | false> => {
    const record = await this.find(id);
    if (record) {
      await knex(this.modelName).where({ id }).del();
      return record;
    }
    return false;
  };

  public deleteMany = async (ids: string[]): Promise<boolean> => {
    try {
      await knex(this.modelName).whereIn("id", ids).del();
      return true;
    } catch (error) {
      return false;
    }
  };

  public deleteBy = async (params: any): Promise<boolean> => {
    try {
      await knex(this.modelName).where(params).del();
      return true;
    } catch (error) {
      return false;
    }
  };

  public getBy = async (params: any): Promise<IModelData[]> => {
    return await knex(this.modelName).where(params).select();
  };
  public createMany = async (params: any) => {
    const data = params.map((param: any) => {
      return {
        id: uuidv4(),
        ...param,
      };
    });
    return await knex(this.modelName).insert(data);
  };

  public getAll = async (): Promise<IModelData[]> => {
    return await knex(this.modelName).select();
  };

  public createManyWithTransaction = (params: any): Promise<any> => {
    return new Promise(async (resolve) => {
      const trx = await knex.transaction();
      const newParams = params.map((param: any) => ({
        id: uuidv4(),
        ...param,
      }));
      try {
        await Promise.all(
          newParams.map(async (param: any) => {
            await knex(this.modelName).transacting(trx).insert(param);
          })
        );
        await trx.commit();
        return resolve(newParams);
      } catch (error) {
        await trx.rollback();
        return resolve(false);
      }
    });
  };

  public getNotIn = async (
    ids: string[],
    condition: any
  ): Promise<IModelData[]> => {
    return await knex(this.modelName)
      .where(condition)
      .whereNotIn("id", ids)
      .select();
  };

  public getMany = async (ids: string[]): Promise<IModelData[]> => {
    return await knex(this.modelName).whereIn("id", ids).select();
  };

  public getManyBy = async (
    column: string,
    ids: string[]
  ): Promise<IModelData[]> => {
    return await knex(this.modelName).whereIn(column, ids).select();
  };

  public getLastDate = async () => {
    try {
      let lastDate;
      const lastUpdatedAt = await knex(this.modelName)
        .orderBy("updated_at", "desc")
        .first();
      lastDate = lastUpdatedAt.updated_at;
      if (!lastUpdatedAt || !lastUpdatedAt?.updated_at) {
        const lastCreatedAt = await knex(this.modelName)
          .orderBy("created_at", "desc")
          .first();
        lastDate = lastCreatedAt.created_at;
      }
      return lastDate;
    } catch (error) {
      return "";
    }
  };
}
