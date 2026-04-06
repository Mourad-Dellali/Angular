import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import {key} from './app/licensekey.devextreme';
import { config } from 'devextreme/common';

config({ licenseKey: key });


bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
