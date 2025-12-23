import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { GoogleAnalytics } from '@ionic-native/google-analytics';

import { OrderPage } from '../pages/order/order';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { TablesPage } from '../pages/tables/tables';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { CategoryProvider } from '../providers/category/category';
import { HttpClientModule } from '@angular/common/http';
import { ArticlesPage } from '../pages/articles/articles';
import { PedidoModalComponent } from '../components/pedido-modal/pedido-modal';
import { SettingsPage } from '../pages/settings/settings';
import { FilterPopoverComponent } from '../components/filter-popover/filter-popover';
import { SubcategoryProvider } from '../providers/subcategory/subcategory';
import { PreferenceModalComponent } from '../components/preference-modal/preference-modal';
import { ComboModalComponent } from '../components/combo-modal/combo-modal';
import { TablePage } from '../pages/table/table';

@NgModule({
  declarations: [
    MyApp,
    OrderPage,
    ContactPage,
    HomePage,
    TabsPage,
    ArticlesPage,
    PedidoModalComponent,
    PreferenceModalComponent,
    SettingsPage,
    FilterPopoverComponent,
    ComboModalComponent,
    TablesPage,
    TablePage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    OrderPage,
    ContactPage,
    HomePage,
    TabsPage,
    ArticlesPage,
    PedidoModalComponent,
    PreferenceModalComponent,
    SettingsPage,
    FilterPopoverComponent,
    ComboModalComponent,
    TablesPage,
    TablePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    GoogleAnalytics,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    CategoryProvider,
    SubcategoryProvider
  ]
})
export class AppModule {}
