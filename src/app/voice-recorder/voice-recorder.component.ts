import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-voice-recorder',
  templateUrl: './voice-recorder.component.html',
  styleUrls: ['./voice-recorder.component.scss']
})
export class VoiceRecorderComponent implements OnInit {

  @ViewChild('audioPlayer') audioPlayer: ElementRef;

  mediaStream: MediaStream;
  mediaRecorder: MediaRecorder;
  chunks: Blob[] = [];
  isRecording: boolean = false;
  isPaused: boolean = false;

  constructor() { }

  async ngOnInit() {
    try {
      this.mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // this.audioPlayer.nativeElement.srcObject = this.mediaStream;
    } catch (error) {
      console.error('Error accessing the microphone: ', error);
    }
  }

  startRecording() {
    try {
      if (!this.isPaused) {
        this.mediaRecorder = new MediaRecorder(this.mediaStream);

        this.mediaRecorder.ondataavailable = (e: BlobEvent) => {
          if (e.data.size > 0) {
            this.chunks.push(e.data);
            const audioBlob = new Blob(this.chunks, { type: 'audio/mp4' });
            const audioURL = URL.createObjectURL(audioBlob);
            this.audioPlayer.nativeElement.src = audioURL;
          }
        };

        this.mediaRecorder.onstop = () => {
          if (this.chunks.length > 0) {
            const audioBlob = new Blob(this.chunks, { type: 'audio/mp4' });
            const audioURL = URL.createObjectURL(audioBlob);
            this.audioPlayer.nativeElement.src = audioURL;
          }
        };

      }

      if (!this.isRecording || this.isPaused) {
        this.mediaRecorder.start();
        this.isRecording = true;
        this.isPaused = false;
      }
    } catch(error) {
      console.error('Error accessing the microphone: ', error);
    };
  }

  pauseRecording() {
    if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
      this.mediaRecorder.requestData();
      this.mediaRecorder.pause();
      this.isRecording = false;
      this.isPaused = true;
    }
  }

  resumeRecording() {
    this.audioPlayer.nativeElement.src = "";
    if (this.mediaRecorder && this.mediaRecorder.state === 'paused') {
      this.mediaRecorder.resume();
      this.isRecording = true;
      this.isPaused = false;
    }
  }

  stopRecording() {
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
      this.isRecording = false;
      this.isPaused = false;
    }
  }

  ngOnDestroy() {
    // Clean up resources when the component is destroyed
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
    }
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
    }
  }

}
