import { Input } from '../input';
import { withController } from './hoc/withController';
import { withWatcher } from './hoc/withWatcher';

export * from './form';

export const InputText = withWatcher(withController(Input));
