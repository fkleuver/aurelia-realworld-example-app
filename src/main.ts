import {Aurelia} from 'aurelia-framework'
import environment from './environment';
import { PLATFORM } from 'aurelia-pal';
import Bluebird from 'bluebird';

Bluebird.config({ warnings: { wForgottenReturn: false } });

export function configure(aurelia: Aurelia) {
  aurelia.use
    .standardConfiguration()
    .feature(PLATFORM.moduleName('resources/index'))
    .feature(PLATFORM.moduleName('shared/index'))
    .plugin(PLATFORM.moduleName('aurelia-validation'));

  if (environment.debug) {
    aurelia.use.developmentLogging();
  }

  if (environment.testing) {
    aurelia.use.plugin(PLATFORM.moduleName('aurelia-testing'));
  }

  aurelia.start().then(() => aurelia.setRoot(PLATFORM.moduleName('app')));
}
