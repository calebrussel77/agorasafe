import { genericLayout } from './generic-layout';
import { publicProfileLayout } from './public-profile-layout';
import { serviceRequestLayout } from './service-request-layout';
import { type ILayout, type ILayoutConfig } from './types';

export const layouts: ILayout<any>[] = [
  genericLayout,
  publicProfileLayout,
  serviceRequestLayout,
];

export type LayoutsRecord = typeof layouts;

export const getLayout = (layoutName: string): ILayout => {
  const layout = layouts.find(l => l.name === layoutName);

  if (layout == null) {
    throw new Error(`Layout ${layoutName} not found`);
  }

  return layout;
};

export const getLayoutConfigFromQuery = async (
  layoutName: string,
  query: Record<string, string | string[] | undefined>
): Promise<ILayoutConfig> => {
  const layout = getLayout(layoutName);

  // Validate layout
  return layout.config.parseAsync(query);
};

export const getLayoutAndConfig = async (
  layoutName: string,
  query: Record<string, string | string[] | undefined>
): Promise<{ layout: ILayout; config: ILayoutConfig }> => {
  const layout = getLayout(layoutName);
  const config = await getLayoutConfigFromQuery(layoutName, query);

  return { layout, config };
};
