import { type z } from 'zod';

export type FileType = 'svg' | 'png';

// eslint-disable-next-line @typescript-eslint/naming-convention
export interface IConfig {
  fileType?: FileType;
  layoutName: string;
}

export type ILayout<TConfig extends z.ZodType = z.AnyZodObject> = {
  name: string;
  config: TConfig;
  Component: LayoutComponent<z.infer<TConfig>>;
};

export type LayoutComponent<TConfig> = React.ComponentType<{
  config: TConfig;
}>;

export type ILayoutValue = string;
export type ILayoutConfig = Record<string, ILayoutValue>;

// export type ImageParamsMap = {
//   generic: GenericOgInput;
//   serviceRequest: ServiceRequestOgInput;
//   publicProfile: PublicProfileOgInput;
// };
