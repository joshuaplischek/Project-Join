import { Routes } from '@angular/router';
import { LegalnoticeComponent } from './pages/legalnotice/legalnotice.component';
import { PrivacypoliceComponent } from './pages/privacypolice/privacypolice.component';
import { ContactsComponent } from './mainpage/contacts/contacts.component';
import { HelpComponent } from './pages/help/help.component';
import { BoardComponent } from './mainpage/board/board.component';
import { AddTaskComponent } from './mainpage/add-task/add-task.component';
import { AppComponent } from './app.component';

export const routes: Routes = [
 { path: '', component: AppComponent },
 { path: 'contacts', component: ContactsComponent },
 { path: 'board', component: BoardComponent },
 { path: 'add-task', component: AddTaskComponent },
 { path: 'legalnotice', component: LegalnoticeComponent },
 { path: 'privacypolicy', component: PrivacypoliceComponent },
 { path: 'help', component: HelpComponent }
];
