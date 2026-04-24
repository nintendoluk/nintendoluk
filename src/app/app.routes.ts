import { Routes } from '@angular/router';
import {Home} from './home/home';
import { Output } from './output/output';

export const routes: Routes = [
   {
    path: '',
    title: 'App Home Page',
    component: Home,
  },
  {
    path: 'output',
    title: 'Output Page',
    component: Output,
  },
];
