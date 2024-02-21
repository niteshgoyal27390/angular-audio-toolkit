import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { VoiceRecorderComponent } from './voice-recorder/voice-recorder.component';

@NgModule({
  declarations: [
    AppComponent,
    VoiceRecorderComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
