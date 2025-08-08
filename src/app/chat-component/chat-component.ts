import { Component, NgZone, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
//import { io } from 'socket.io-client';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CircularWaveformComponent } from '../circular-waveform-component/circular-waveform-component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, CircularWaveformComponent],
  templateUrl: './chat-component.html',
  styleUrls: ['./chat-component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ChatComponent {
  sessionId: string = this.generateSessionId();
  //socket = io('http://localhost:3000');
  //awsSocket = new WebSocket('wss://9nzcin4iug.execute-api.us-east-1.amazonaws.com/production/');
  messages: { from: string, text: string, partial?: boolean }[] = [];
  recognizing = false;
  recognition: any;
  isSpeaking = false;
  mouthShape: 'normal' | 'wide' | 'narrow' = 'normal';
  private eventSource: EventSource | null = null;
  chatInput: string = '';
  listeningSeconds: number = 0;
  waveSurfer: any;
  @ViewChild('widgetContainer') widgetContainer!: ElementRef;
  @ViewChild('chatContainer') chatContainer!: ElementRef;

  @ViewChild(CircularWaveformComponent) waveformComponent!: CircularWaveformComponent;

  private speechPauseTimeout: any;
  private mediaRecorder: any;
  private audioChunks: any[] = [];
  private timerInterval: any;
  private dragging = false;
  private dragOffset = { x: 0, y: 0 };
  autoRestartTimeout: any = null;
  private lipSyncInterval: any;
  private lastAwsMessage: string = '';
  private lastSessionId: string = '';
  isGCP: boolean = false;
  constructor(private zone: NgZone, private cdr: ChangeDetectorRef) {
    // this.socket.on('bot', (msg: string) => {
    //   this.zone.run(() => {
    //     this.messages.push({ from: 'Bot', text: msg });
    //     this.cdr.detectChanges();
    //     this.speak(msg);
    //   });
    // });
    // this.awsSocket.onopen = () => {
    //   this.awsSocket.send(JSON.stringify({
    //     action: 'connect'
    //   }));
    // };
    // this.awsSocket.onmessage = (event: MessageEvent) => {
    //   const data = JSON.parse(event.data);

    //   this.lastAwsMessage = data.connectionId;
    //   // Store the received message for further use
    //   if (data && data.message) {
    //     this.zone.run(() => {
    //       this.messages.push({ from: 'Bot', text: data.message });
    //       this.cdr.detectChanges();
    //     });
    //   }

    //   this.lastAwsMessage = data.connectionId;
    // };

  }

  private generateSessionId(): string {
    // Generates a random 16-character alphanumeric session ID
    return Math.random().toString(36).substr(2, 16) + Date.now().toString(36);
  }

  playAudio(audioUrl: string) {

  }

  // // --- SSE Streaming ---
  // startEventSourceStreaming(transcript: string) {
  //   // Close previous connection
  //   if (this.eventSource) {
  //     this.eventSource.close();
  //   }

  //   // Lambda Function URL
  //   const lambdaUrl = 'YOUR_LAMBDA_FUNCTION_URL_HERE';

  //   // Request body
  //   const requestBody = {
  //     inputText: transcript,
  //     agentId: 'YOUR_AGENT_ID',
  //     agentAliasId: 'TSTALIASID'
  //   };

  //   // SSE URL with encoded data
  //   const url = `${lambdaUrl}?data=${encodeURIComponent(JSON.stringify(requestBody))}`;
  //   this.eventSource = new EventSource(url);

  //   this.eventSource.onopen = (event) => {
  //     // Optionally show status
  //   };

  //   this.eventSource.onmessage = (event) => {
  //     try {
  //       const data = JSON.parse(event.data);
  //       switch (data.type) {
  //         case 'connection':
  //           this.lastSessionId = data.sessionId;
  //           break;
  //         case 'chunk':
  //           this.zone.run(() => {
  //             this.messages.push({ from: 'Bot', text: data.data, partial: true });
  //             this.cdr.detectChanges();
  //           });
  //           break;
  //         case 'complete':
  //           // Optionally handle completion
  //           break;
  //         case 'error':
  //           this.zone.run(() => {
  //             this.messages.push({ from: 'Bot', text: `Error: ${data.error}` });
  //             this.cdr.detectChanges();
  //           });
  //           break;
  //         case 'end':
  //           this.eventSource?.close();
  //           break;
  //       }
  //     } catch (e) {
  //       console.error('Error parsing SSE data:', e);
  //     }
  //   };

  //   this.eventSource.onerror = (event) => {
  //     this.zone.run(() => {
  //       this.messages.push({ from: 'Bot', text: 'Connection error' });
  //       this.cdr.detectChanges();
  //     });
  //     this.eventSource?.close();
  //   };
  // }


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
        //this.socket.emit('audio', event.data);
      }
    };

    this.mediaRecorder.onstop = () => {
      const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
      //this.socket.emit('audio-complete', audioBlob);
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
      // this.awsSocket.send(JSON.stringify({
      //   // type: 'audio-transcript',
      //   // audio_data: convertedText,
      //   // session_id: this.sessionId || ''
      //   action: 'disconnect'
      // }));
    }
  }

  // --- Speech Recognition ---
  startListening() {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Speech Recognition not supported in this browser.');
      return;
    }
    this.recognizing = true;
    this.recognition = new (window as any).webkitSpeechRecognition();
    this.recognition.lang = 'en-US';
    this.recognition.continuous = false;
    this.recognition.interimResults = false;
    this.recognition.onstart = () => {
      this.startAudioRecording();
      this.zone.run(() => {
        this.listeningSeconds = 0;
        this.startTimer();
      });
    };
    this.recognition.onend = () => {
      this.zone.run(() => {
        this.stopTimer();
        this.clearSpeechPauseTimer();
      });
    };
    this.recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      this.zone.run(() => {
        this.messages.push({ from: 'You', text: transcript });
        // this.socket.emit('chat', transcript);
        this.cdr.detectChanges();
        this.triggerMl(transcript);
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

  }
  triggerMl(convertedText: string) {
    //this.sessionId = this.generateSessionId();
    if (/report|pdf/i.test(convertedText)) {
      this.zone.run(() => {
        this.messages.push({
          from: 'Bot',
          text: `
      <div class="generated-report-container">
        <img src="file.png" alt="PDF" class="pdf-icon">
        <span class="generated-report">Generated Report</span>
        <span><img src="download.png" alt="Download" class="download-icon"></span>
        
      </div>
    `
        });
        this.cdr.detectChanges();
        setTimeout(() => {
          const container = this.chatContainer?.nativeElement;
          if (container) {
            container.scrollTop = container.scrollHeight;
          }
        }, 100);
      });
      return;
    }
    else if (this.isGCP) {
      const url = 'https://discoveryengine.googleapis.com/v1alpha/projects/499356280647/locations/global/collections/default_collection/engines/agentspace-1754404159443_1754404159443/servingConfigs/default_search:search';
      const body = {
        query: convertedText,
        pageSize: 10,
        session: 'projects/499356280647/locations/global/collections/default_collection/engines/agentspace-1754404159443_1754404159443/sessions/-',
        spellCorrectionSpec: { mode: 'AUTO' },
        languageCode: 'en-US',
        relevanceScoreSpec: { returnRelevanceScore: true },
        userInfo: { timeZone: 'Asia/Calcutta' },
        contentSearchSpec: { snippetSpec: { returnSnippet: true } },
        naturalLanguageQueryUnderstandingSpec: { filterExtractionCondition: 'ENABLED' }
      };

      const accessToken = ''; 

      try {
        fetch(url, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(body)
        }).then(response => response.json())
          .then(data => {

            if (data && data.agent_response) {
              this.zone.run(() => {
                this.messages.push({ from: 'Bot', text: data.agent_response });
                this.cdr.detectChanges();
                this.textToSpeech(data.audio_response.audio_data);
                setTimeout(() => {
                  const container = this.chatContainer?.nativeElement;
                  if (container) {
                    container.scrollTop = container.scrollHeight;
                  }
                }, 100);
              });
            }
          });

      } catch (error) {
        console.error('Discovery search error:', error);
      }
    } else {
      fetch('https://27bokahdyhujxyjyjpyy5a7kya0rxokm.lambda-url.us-east-1.on.aws', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          audio_data: convertedText,
          session_id: this.sessionId || ''
        })
      })
        .then(response => response.json())
        .then(data => {

          if (data && data.agent_response) {
            this.zone.run(() => {
              this.messages.push({ from: 'Bot', text: data.agent_response });
              this.cdr.detectChanges();
              this.textToSpeech(data.audio_response.audio_data);
              setTimeout(() => {
                const container = this.chatContainer?.nativeElement;
                if (container) {
                  container.scrollTop = container.scrollHeight;
                }
              }, 100);
            });
          }
        });
    }




    // this.awsSocket.send(JSON.stringify({
    //   requestContext: {
    //     connectionId: this.lastAwsMessage,
    //     domainName: "test-api.execute-api.us-east-1.amazonaws.com",
    //     stage: "dev"
    //   },
    //   body: { action: "sendmessage", message: "Hello, how are you?", session_id: this.lastAwsMessage}
    // }));
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
      this.triggerMl(this.chatInput);
      //this.socket.emit('chat', this.chatInput);
      this.chatInput = '';
    }
  }
  textToSpeech(audioBase64: string) {
    const byteString = atob(audioBase64.split(',')[1] || audioBase64);
    const mimeString = audioBase64.startsWith('data:')
      ? audioBase64.split(';')[0].split(':')[1]
      : 'audio/mp3';
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    const audioBlob = new Blob([ab], { type: mimeString });

    // Play in waveform component
    if (this.waveformComponent && audioBlob) {
      this.waveformComponent.playAudioBlob(audioBlob);
    }

    // Optionally play with browser audio
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);
    audio.play();
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