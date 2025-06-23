import { Routes } from '@angular/router';
import { MainpageComponent } from './mainpage/mainpage.component';
import { LegalnoticeComponent } from './pages/legalnotice/legalnotice.component';
import { PrivacypoliceComponent } from './pages/privacypolice/privacypolice.component';
import { ContactsComponent } from './mainpage/contacts/contacts.component';

export const routes: Routes = [
 { path: '', component: MainpageComponent },
 { path: 'contacts', component: ContactsComponent },
 { path: 'legalnotice', component: LegalnoticeComponent },
 { path: 'privacypolicy', component: PrivacypoliceComponent }
];
