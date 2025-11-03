import type { App } from "vue";
import { directivesList } from "@teek/directives";
import role from "./modules/role";
import auth from "./modules/auth";

const uacDirectivesList: any = {
  role,
  auth,
  ...directivesList,
};

const localDirectives = {
  install: function (app: App<Element>) {
    Object.keys(uacDirectivesList).forEach(key => {
      // 注册所有自定义指令
      app.directive(key, uacDirectivesList[key]);
    });
  },
};

export default localDirectives;
