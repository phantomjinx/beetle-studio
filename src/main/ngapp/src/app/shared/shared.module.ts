/**
 * @license
 * Copyright 2017 JBoss Inc
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ConfirmDeleteComponent } from "@shared/confirm-delete/confirm-delete.component";
import { PageErrorComponent } from "@shared/page-error/page-error.component";
import { ModalModule } from 'ngx-bootstrap';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

@NgModule({
  imports: [
    CommonModule,
    ModalModule.forRoot()
  ],
  declarations: [
    ConfirmDeleteComponent,
    PageErrorComponent,
    PageNotFoundComponent
  ],
  exports: [
    ConfirmDeleteComponent,
    PageErrorComponent,
    PageNotFoundComponent
  ]
})
export class SharedModule {
}
