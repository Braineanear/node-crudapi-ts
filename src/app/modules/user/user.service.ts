import User from "./user.model";
import { Service } from "nodeapi-cruds";

class UserService extends Service {

  model: any = User;
  modelName: string = "Usuário";
  filters: any[] = [];
}

export default new UserService();