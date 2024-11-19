import { CSSProperties } from "react";

declare module "*.scss" {
  const content: CSSProperties;
  export default content;
}
