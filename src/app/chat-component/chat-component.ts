import { Component, NgZone, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { io } from 'socket.io-client';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import WaveSurfer from 'wavesurfer.js';
import Timeline from 'wavesurfer.js/plugins/timeline';


@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-component.html',
  styleUrls: ['./chat-component.scss']
})
export class ChatComponent {
  sessionId: string = this.generateSessionId();
  socket = io('http://localhost:3000');
  messages: { from: string, text: string, partial?: boolean }[] = [];
  recognizing = false;
  recognition: any;
  isSpeaking = false;
  mouthShape: 'normal' | 'wide' | 'narrow' = 'normal';
  chatInput: string = '';
  listeningSeconds: number = 0;
  waveSurfer: any;
  @ViewChild('widgetContainer') widgetContainer!: ElementRef;

  private speechPauseTimeout: any;
  private mediaRecorder: any;
  private audioChunks: any[] = [];
  private timerInterval: any;
  private dragging = false;
  private dragOffset = { x: 0, y: 0 };
  autoRestartTimeout: any = null;
  private lipSyncInterval: any;

  constructor(private zone: NgZone, private cdr: ChangeDetectorRef) {
    this.socket.on('bot', (msg: string) => {
      this.zone.run(() => {
        this.messages.push({ from: 'Bot', text: msg });
        this.cdr.detectChanges();
        this.speak(msg);
      });
    });
  }

private generateSessionId(): string {
    // Generates a random 16-character alphanumeric session ID
    return Math.random().toString(36).substr(2, 16) + Date.now().toString(36);
  }

  playAudio(audioUrl: string) {
   
  }
  // --- Widget Drag ---
  startDrag(event: MouseEvent) {
    this.dragging = true;
    const widget = this.widgetContainer.nativeElement;
    this.dragOffset.x = event.clientX - widget.offsetLeft;
    this.dragOffset.y = event.clientY - widget.offsetTop;
    document.addEventListener('mousemove', this.onDragMove);
    document.addEventListener('mouseup', this.stopDrag);
  }
  onDragMove = (event: MouseEvent) => {
    if (!this.dragging) return;
    const widget = this.widgetContainer.nativeElement;
    widget.style.left = `${event.clientX - this.dragOffset.x}px`;
    widget.style.top = `${event.clientY - this.dragOffset.y}px`;
    widget.style.position = 'fixed';
    widget.style.zIndex = 9999;
  };
  stopDrag = () => {
    this.dragging = false;
    document.removeEventListener('mousemove', this.onDragMove);
    document.removeEventListener('mouseup', this.stopDrag);
  };
  closeWidget() {
    const widget = this.widgetContainer.nativeElement;
    widget.style.display = 'none';
  }

  // --- Audio Recording ---
  async startAudioRecording() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    this.mediaRecorder = new (window as any).MediaRecorder(stream);
    this.audioChunks = [];

    this.mediaRecorder.ondataavailable = (event: any) => {
      if (event.data.size > 0) {
        this.audioChunks.push(event.data);
        this.socket.emit('audio', event.data);
      }
    };

    this.mediaRecorder.onstop = () => {
      const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
      this.socket.emit('audio-complete', audioBlob);
    };

    this.mediaRecorder.start(250);
  }

  stopAudioRecording() {
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.ondataavailable = null;
      this.mediaRecorder.onstop = null;
      this.mediaRecorder.stop();
      if (this.mediaRecorder.stream) {
        this.mediaRecorder.stream.getTracks().forEach((track: any) => track.stop());
      }
      this.mediaRecorder = null;
    }
  }

  // --- Speech Recognition ---
  startListening() {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Speech Recognition not supported in this browser.');
      return;
    }
    this.recognition = new (window as any).webkitSpeechRecognition();
    this.recognition.lang = 'en-US';
    this.recognition.continuous = false;
    this.recognition.interimResults = false;
    this.recognition.onstart = () => {
      this.startAudioRecording();
      this.zone.run(() => {
        this.recognizing = true;
        this.listeningSeconds = 0;
        this.startTimer();
      });
    };
    this.recognition.onend = () => {
      this.zone.run(() => {
        this.recognizing = false;
        this.stopTimer();
        this.clearSpeechPauseTimer();
      });
    };
    this.recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      this.zone.run(() => {
        this.messages.push({ from: 'You', text: transcript });
        this.socket.emit('chat', transcript);
        this.cdr.detectChanges();
      });
      this.stopAudioRecording();
      this.resetSpeechPauseTimer();
      this.stopListening();
    };

    this.recognition.start();
    this.listeningSeconds = 0;
    this.startTimer();
  }

  stopListening() {
    if (this.recognition && this.recognizing) {
      this.recognition.onend = null;
      this.recognition.stop();
      this.recognizing = false;
      this.stopTimer();
      this.clearSpeechPauseTimer();
      if (this.autoRestartTimeout) {
        clearTimeout(this.autoRestartTimeout);
        this.autoRestartTimeout = null;
      }
    }
    this.stopAudioRecording();
     // Send audio to API as base64
  if (this.audioChunks && this.audioChunks.length > 0) {
    const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Audio = (reader.result as string).split(',')[1];
      fetch('https://27bokahdyhujxyjyjpyy5a7kya0rxokm.lambda-url.us-east-1.on.aws', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({
          audio_data: base64Audio,
          session_id: this.sessionId || ''
        })
      });
    };
    reader.readAsDataURL(audioBlob);
  }
  }

  // --- Timers ---
  resetSpeechPauseTimer() {
    this.clearSpeechPauseTimer();
    this.speechPauseTimeout = setTimeout(() => {
      if (this.recognizing) {
        this.recognition.stop();
        this.recognizing = false;
        this.stopTimer();
        this.clearSpeechPauseTimer();
      }
    }, 2000);
  }
  clearSpeechPauseTimer() {
    if (this.speechPauseTimeout) {
      clearTimeout(this.speechPauseTimeout);
      this.speechPauseTimeout = null;
    }
  }
  startTimer() {
    this.stopTimer();
    this.timerInterval = setInterval(() => {
      this.zone.run(() => this.listeningSeconds++);
    }, 1000);
  }
  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  // --- Chat ---
  sendMessage() {
    if (this.chatInput.trim()) {
      this.messages.push({ from: 'You', text: this.chatInput });
      this.socket.emit('chat', this.chatInput);
      this.chatInput = '';
    }
  }

  // --- Speech Synthesis & Lip Sync ---
  speak(text: string) {
  const synth = window.speechSynthesis;
  const utter = new SpeechSynthesisUtterance(text);
  const voices = synth.getVoices();
  const indianVoice = voices.find(v => v.name.includes('Heera')) || voices.find(v => v.lang === 'en-IN') || voices.find(v => v.name.includes('India')) || voices[0];
  if (indianVoice) utter.voice = indianVoice;
  utter.pitch = 1.1;

  utter.onstart = () => {
    this.isSpeaking = true;
    // Trigger envelope animation (visual only)
    
  };
  utter.onend = () => {
    this.isSpeaking = false;
    
  };

  synth.speak(utter); // This will produce audible speech
  this.stopAudioRecording();
}

  startLipSync(text: string, pitch: number) {
    this.isSpeaking = true;
    const words = text.split(/\s+/);
    let wordIndex = 0;
    this.mouthShape = pitch > 1.2 ? 'wide' : pitch < 0.9 ? 'narrow' : 'normal';
    this.lipSyncInterval = setInterval(() => {
      this.mouthShape = (wordIndex % 2 === 0)
        ? (pitch > 1.2 ? 'wide' : 'normal')
        : (pitch < 0.9 ? 'narrow' : 'normal');
      wordIndex++;
      if (wordIndex >= words.length) {
        clearInterval(this.lipSyncInterval);
        this.mouthShape = 'normal';
      }
    }, 350);
  }

  stopLipSync() {
    this.mouthShape = 'normal';
    if (this.lipSyncInterval) {
      clearInterval(this.lipSyncInterval);
      this.lipSyncInterval = null;
    }
  }
}