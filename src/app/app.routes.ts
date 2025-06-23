import { Routes } from '@angular/router';
import { MainpageComponent } from './mainpage/mainpage.component';
import { LegalnoticeComponent } from './pages/legalnotice/legalnotice.component';
import { PrivacypoliceComponent } from './pages/privacypolice/privacypolice.component';
import { HelpComponent } from './pages/help/help.component';

export const routes: Routes = [
 { path: '', component: MainpageComponent },
 { path: 'legalnotice', component: LegalnoticeComponent },
 { path: 'privacypolicy', component: PrivacypoliceComponent },
 { path: 'help', component: HelpComponent}
];
