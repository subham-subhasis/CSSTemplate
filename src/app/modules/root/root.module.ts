
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { LeftNavigationComponent } from './components/left-navigation/left-navigation.component';
import { HeaderComponent } from './components/header/header.component';
import { ConfirmdialogComponent } from './components/confirmdialog/confirmdialog.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RootDirective } from './services/rootDirectives/root.directive';
import { HelpComponent } from './components/help/help.component';
import { PersonalSettingsComponent } from './components/personal-settings/personal-settings.component';
import { ActivityLogComponent } from './components/activity-log/activity-log.component';
import { TableModule } from 'primeng/table';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { RegistrationComponent } from './components/registration/registration.component';
import { LazyElementsModule, LazyElementsLoaderService } from '@angular-extensions/elements';
import { SetPasswordComponent } from './components/set-password/set-password.component';
import { WorkflowComponent } from './components/workflow/workflow.component';
import { DocumentsComponent } from './components/documents/documents.component';

@NgModule({
  declarations: [
    HeaderComponent,
    LeftNavigationComponent,
    ConfirmdialogComponent,
    ChangePasswordComponent,
    RootDirective,
    HelpComponent,
    PersonalSettingsComponent,
    ActivityLogComponent,
    RegistrationComponent,
    SetPasswordComponent,
    WorkflowComponent,
    DocumentsComponent
  ],
  imports: [
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    OverlayPanelModule,
    LazyElementsModule
  ],
  exports: [
    HeaderComponent,
    LeftNavigationComponent
  ],
  providers: [LazyElementsLoaderService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class RootModule { }
