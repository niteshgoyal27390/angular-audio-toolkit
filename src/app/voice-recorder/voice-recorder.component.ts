import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-voice-recorder',
  templateUrl: './voice-recorder.component.html',
  styleUrls: ['./voice-recorder.component.scss']
})
export class VoiceRecorderComponent implements OnInit {

  @ViewChild('audioPlayer') audioPlayer: ElementRef;
  @ViewChild('playButton') playButton: ElementRef;
  @ViewChild('forwardButton') forwardButton: ElementRef;
  @ViewChild('backwardButton') backwardButton: ElementRef;

  mediaRecorder: MediaRecorder;
  chunks: Blob[] = [];
  isRecording: boolean = false;
  audioUrl = ""

  isPlaying = false;
  currentTime = 0;

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
      this.mediaRecorder.requestData();
      this.mediaRecorder.pause();
      this.isRecording = false;
      this.currentTime = 0;
      this.playButton.nativeElement.disabled = false;
    }
  }

  resumeRecording() {
    this.audioPlayer.nativeElement.src = "";
    if (this.mediaRecorder.state === 'paused') {
      this.mediaRecorder.resume();
      this.isRecording = true;
      this.playButton.nativeElement.disabled = true;
    }
  }

  stopRecording() {
    if (this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
      this.isRecording = false;
      this.playButton.nativeElement.disabled = false;
    }
  }


  playPause() {
    if (this.isPlaying) {
      this.audioPlayer.nativeElement.pause();
      this.playButton.nativeElement.textContent = 'Play';
    } else {
      this.audioPlayer.nativeElement.play();
      this.playButton.nativeElement.textContent = 'Pause';
    }
    this.isPlaying = !this.isPlaying;
  }
  
  forward(seconds: number) {
    this.currentTime = this.audioPlayer.nativeElement.currentTime;
    this.currentTime = Math.min(this.audioPlayer.nativeElement.duration, this.currentTime + seconds);
    this.audioPlayer.nativeElement.currentTime = this.currentTime;
  }
  
  backward(seconds: number) {
    this.currentTime = this.audioPlayer.nativeElement.currentTime;
    this.currentTime = Math.max(0, this.currentTime - seconds);
    this.audioPlayer.nativeElement.currentTime = this.currentTime;
  }

}
