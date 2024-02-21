import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-voice-recorder',
  templateUrl: './voice-recorder.component.html',
  styleUrls: ['./voice-recorder.component.scss']
})
export class VoiceRecorderComponent implements OnInit {

  @ViewChild('audioPlayer') audioPlayer: ElementRef;

  mediaRecorder: MediaRecorder;
  chunks: Blob[] = [];
  isRecording: boolean = false;

  constructor() { }

  ngOnInit(): void {
    
  }

  startRecording() {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        this.mediaRecorder = new MediaRecorder(stream);

        this.mediaRecorder.ondataavailable = (e: any) => {
          this.chunks.push(e.data);
        };

        this.mediaRecorder.onstop = () => {
          const blob = new Blob(this.chunks, { type: 'audio/mp3' });
          this.chunks = [];
          const audioURL = window.URL.createObjectURL(blob);
          this.audioPlayer.nativeElement.src = audioURL;
        };

        this.mediaRecorder.onpause = () => {
          const blob = new Blob(this.chunks, { type: 'audio/mp3' });
          const audioURL = window.URL.createObjectURL(blob);
          this.audioPlayer.nativeElement.src = audioURL;
        };

        this.mediaRecorder.start();
        this.isRecording = true;
      })
      .catch(error => {
        console.error('Error accessing the microphone: ', error);
      });
  }

  pauseRecording() {
    if (this.mediaRecorder.state === 'recording') {
      this.mediaRecorder.pause();
      this.isRecording = false;
    }
  }

  resumeRecording() {
    this.audioPlayer.nativeElement.src = "";
    if (this.mediaRecorder.state === 'paused') {
      this.mediaRecorder.resume();
      this.isRecording = true;
    }
  }

  stopRecording() {
    if (this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
      this.isRecording = false;
    }
  }

}
