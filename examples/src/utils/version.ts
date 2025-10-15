// Pega a versão do questro do package.json instalado
import packageJson from "../../package.json";

export const QUESTRO_VERSION = packageJson.dependencies.questro
  .replace("^", "")
  .replace("~", "");
