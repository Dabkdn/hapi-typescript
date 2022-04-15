import { v4 as uuidv4 } from "uuid";
import moment from "moment";
import Builder from "../query_builder";

export default class Model<IModelData> {
  private modelName: string;
  public builder: Builder;
  public constructor(modelName: string) {
    this.modelName = modelName;
    this.builder = new Builder(this.modelName);
  }

  public list = async (
    limit: number,
    offset: number,
    filter: any,
    sort?: any
  ): Promise<any> => {
    try {
      let result: any;
      if (sort) {
        result = await this.builder
          .where(filter)
          .paginate(limit, offset)
          .orderBy(sort[0], sort[1])
          .select();
      } else {
        result = await this.builder
          .where(filter)
          .paginate(limit, offset)
          .select();
      }
      return result;
    } catch (err) {
      return false;
    }
  };

  public create = async (params: Omit<IModelData, "id" | "created_at">) => {
    try {
      const id = uuidv4();
      const created_at = moment().toISOString();
      const record = {
        ...params,
        id,
        created_at,
      };
      const result = await this.builder.insert(record);
      if (result) {
        return record;
      }
      return false;
    } catch (err) {
      return false;
    }
  };

  public find = async (id: string): Promise<IModelData | false> => {
    try {
      const result: any = await this.builder.where("id", id).first();
      return result;
    } catch (error) {
      return false;
    }
  };

  public findBy = async (params: any): Promise<IModelData | false> => {
    try {
      const result: any = await this.builder.where(params).first();
      return result;
    } catch (error) {
      return false;
    }
  };

  public getBy = async (params: any): Promise<IModelData[] | false> => {
    try {
      const result: any = await this.builder.where(params).select();
      return result;
    } catch (error) {
      return false;
    }
  };

  public getAll = async (): Promise<IModelData[] | false> => {
    try {
      const result: any = await this.builder.select();
      return result;
    } catch (error) {
      return false;
    }
  };

  public update = async (
    id: string,
    params: object
  ): Promise<IModelData | false> => {
    try {
      const record = await this.find(id);
      if (record) {
        const isUpdated = await this.builder.where("id", id).update(params);
        if (isUpdated) {
          return isUpdated;
        }
      }
      return false;
    } catch (error) {
      return false;
    }
  };

  public delete = async (id: string): Promise<boolean> => {
    try {
      const record = await this.find(id);
      if (record) {
        await this.builder.where("id", id).delete();
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  };

  public deleteMany = async (ids: string[]): Promise<boolean> => {
    try {
      await this.builder.whereIn("id", ids).delete();
      return true;
    } catch (error) {
      return false;
    }
  };
}
