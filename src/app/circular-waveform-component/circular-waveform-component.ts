import { Component, ElementRef, Input, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-circular-waveform',
  template: `
    <canvas #waveformCanvas width="800" height="400" style="width:400px;height:200px;"></canvas>

  `,
  styles: [`
    canvas { background: #fff;  }
    button { margin-right: 8px; }
  `]
})
export class CircularWaveformComponent implements AfterViewInit, OnDestroy {
  @ViewChild('waveformCanvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  @Input() audioUrl: string = '';

  audioContext: AudioContext | null = null;
  audioBuffer: AudioBuffer | null = null;
  sourceNode: AudioBufferSourceNode | null = null;
  analyserNode: AnalyserNode | null = null;
  animationId: number | null = null;
  isPlaying = false;
  audioLoaded = false;
  info = 'Loading...';

  n_points = 200;
  angles = Array.from({length: 200}, (_, i) => (2 * Math.PI * i) / 200);
  base_radius = 70;
  amplitude_scale = 100;
  center_x = 400;
  center_y = 200;
  previousAmplitudes = new Array(200).fill(0);
  targetAmplitudes = new Array(200).fill(0);
  currentAmplitudes = new Array(200).fill(0);
  dampening = 0.38;
  minAmplitude = 0.25;
  maxAmplitude = 1.8;

  ngAfterViewInit() {
    this.initAudioContext();
    this.setupCanvas();
    this.loadDefaultAudio();
  }

  ngOnDestroy() {
    if (this.animationId) cancelAnimationFrame(this.animationId);
    if (this.audioContext) this.audioContext.close();
  }

  setupCanvas() {
    const ctx = this.canvasRef.nativeElement.getContext('2d');
    if (ctx) {
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, this.canvasRef.nativeElement.width, this.canvasRef.nativeElement.height);
      this.drawBaseCircle(ctx);
    }
  }

  drawBaseCircle(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.globalAlpha = 0.25;
    ctx.strokeStyle = 'gray';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(this.center_x, this.center_y, this.base_radius, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.restore();
  }

  async loadDefaultAudio() {
    this.info = 'Loading ...';
    try {
      const response = await fetch(this.audioUrl);
      if (response.ok) {
        const arrayBuffer = await response.arrayBuffer();
        this.audioBuffer = await this.audioContext!.decodeAudioData(arrayBuffer);
        this.audioLoaded = true;
        this.info = `Audio loaded: ${this.audioBuffer.duration.toFixed(2)} seconds - Ready to visualize!`;
      } else {
        this.info = 'Could not load audio file. Please upload manually.';
      }
    } catch (error) {
      this.info = 'Could not load audio file. Please upload manually.';
    }
  }

  async loadAudioFromFile(event: any) {
    const file = event.target.files[0];
    if (!file) return;
    this.info = 'Loading audio file...';
    try {
      const arrayBuffer = await file.arrayBuffer();
      this.audioBuffer = await this.audioContext!.decodeAudioData(arrayBuffer);
      this.audioLoaded = true;
      this.info = `Audio loaded: ${this.audioBuffer.duration.toFixed(2)} seconds - Ready to visualize!`;
    } catch (error) {
      this.info = 'Error loading audio file. Please try a different format.';
    }
  }

  initAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.analyserNode = this.audioContext.createAnalyser();
      this.analyserNode.fftSize = 1024;
      this.analyserNode.smoothingTimeConstant = 0.4;
    } catch (error) {
      this.info = 'Error: Web Audio API not supported';
    }
  }

  playAudio() {
    if (!this.audioBuffer || this.isPlaying) return;
    if (this.audioContext!.state === 'suspended') {
      this.audioContext!.resume();
    }
    this.previousAmplitudes.fill(0);
    this.targetAmplitudes.fill(0);
    this.currentAmplitudes.fill(this.minAmplitude);

    this.sourceNode = this.audioContext!.createBufferSource();
    this.sourceNode.buffer = this.audioBuffer!;
    this.sourceNode.connect(this.analyserNode!);
    this.analyserNode!.connect(this.audioContext!.destination);

    this.sourceNode.start(0);
    this.isPlaying = true;
    this.info = 'Playing and visualizing...';

    this.sourceNode.onended = () => {
      this.isPlaying = false;
      this.info = 'Playback finished';
      if (this.animationId) cancelAnimationFrame(this.animationId);
      this.setupCanvas();
    };

    this.visualize();
  }

  stopAudio() {
    if (this.sourceNode && this.isPlaying) {
      this.sourceNode.stop();
      this.isPlaying = false;
      this.info = 'Audio stopped';
      if (this.animationId) cancelAnimationFrame(this.animationId);
      this.setupCanvas();
    }
  }

  visualize() {
    const ctx = this.canvasRef.nativeElement.getContext('2d');
    const bufferLength = this.analyserNode!.fftSize;
    const timeDataArray = new Uint8Array(bufferLength);

    const draw = () => {
      if (!this.isPlaying) return;
      this.analyserNode!.getByteTimeDomainData(timeDataArray);
      this.targetAmplitudes = this.processWaveformData(timeDataArray);
      this.interpolateAmplitudes();

      ctx!.fillStyle = 'white';
      ctx!.fillRect(0, 0, this.canvasRef.nativeElement.width, this.canvasRef.nativeElement.height);

      this.drawBaseCircle(ctx!);

      const points = [];
      for (let i = 0; i < this.n_points; i++) {
        const amplitude = this.currentAmplitudes[i];
        const radius = this.base_radius + amplitude * this.amplitude_scale;
        const x = this.center_x + radius * Math.cos(this.angles[i]);
        const y = this.center_y + radius * Math.sin(this.angles[i]);
        points.push({x, y});
      }

      this.drawEnhancedCircularWaveform(ctx!, points);
      this.animationId = requestAnimationFrame(draw);
    };

    draw();
  }

  interpolateAmplitudes() {
    for (let i = 0; i < this.n_points; i++) {
      const diff = this.targetAmplitudes[i] - this.currentAmplitudes[i];
      this.currentAmplitudes[i] += diff * this.dampening;
      this.currentAmplitudes[i] = Math.max(this.minAmplitude, Math.min(this.maxAmplitude, this.currentAmplitudes[i]));
    }
  }

  processWaveformData(timeDataArray: Uint8Array) {
    const amplitudes = new Array(this.n_points);
    const dataLength = timeDataArray.length;
    const samplesPerPoint = Math.floor(dataLength / this.n_points);

    for (let i = 0; i < this.n_points; i++) {
      let sumSquares = 0;
      const startIdx = i * samplesPerPoint;
      const endIdx = Math.min(startIdx + samplesPerPoint, dataLength);

      for (let j = startIdx; j < endIdx; j++) {
        const normalizedSample = (timeDataArray[j] - 128) / 128;
        sumSquares += normalizedSample * normalizedSample;
      }

      const rms = Math.sqrt(sumSquares / (endIdx - startIdx));
      amplitudes[i] = Math.min(rms * 2.0, this.maxAmplitude);
    }

    const avgAmplitude = amplitudes.reduce((a, b) => a + b) / amplitudes.length;
    const energyMultiplier = 1.0 + (avgAmplitude * 0.6);

    for (let i = 0; i < amplitudes.length; i++) {
      amplitudes[i] *= energyMultiplier;
      amplitudes[i] = Math.min(amplitudes[i], this.maxAmplitude);
    }

    return this.applySmoothingFilter(amplitudes);
  }

  applySmoothingFilter(amplitudes: number[]) {
    const smoothed = new Array(this.n_points);
    const filterSize = 3;

    for (let i = 0; i < this.n_points; i++) {
      let sum = 0;
      let count = 0;

      for (let j = -Math.floor(filterSize / 2); j <= Math.floor(filterSize / 2); j++) {
        const idx = (i + j + this.n_points) % this.n_points;
        const weight = 1 - Math.abs(j) / (filterSize / 2);
        sum += amplitudes[idx] * weight;
        count += weight;
      }

      smoothed[i] = sum / count;
      smoothed[i] = Math.max(smoothed[i], this.minAmplitude);
    }

    return smoothed;
  }
async playAudioBlob(blob: Blob) {
  const url = URL.createObjectURL(blob);
  this.audioUrl = url;
  await this.loadAudioFromUrl(url);
  this.playAudio();
}
async playAudioUrl(url: string) {
  this.audioUrl = url;
  await this.loadAudioFromUrl(url);
  this.playAudio();
}

async loadAudioFromUrl(url: string) {
  this.info = 'Loading audio...';
  try {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    this.audioBuffer = await this.audioContext!.decodeAudioData(arrayBuffer);
    this.audioLoaded = true;
    this.info = `Audio loaded: ${this.audioBuffer.duration.toFixed(2)} seconds - Ready to visualize!`;
  } catch (error) {
    this.info = 'Error loading audio from blob/url.';
    this.audioLoaded = false;
  }
}

  drawEnhancedCircularWaveform(ctx: CanvasRenderingContext2D, points: {x: number, y: number}[]) {
    if (points.length === 0) return;

    ctx.strokeStyle = '#9745d5';
    ctx.lineWidth = 3.2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.globalAlpha = 1.0;
    ctx.shadowColor = '#9745d5';
    ctx.shadowBlur = 8;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);

    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }

    ctx.lineTo(points[0].x, points[0].y);
    ctx.stroke();

    ctx.shadowBlur = 0;

    ctx.strokeStyle = 'white';
    ctx.lineWidth = 1.3;
    ctx.globalAlpha = 0.6;

    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);

    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }

    ctx.lineTo(points[0].x, points[0].y);
    ctx.stroke();

    ctx.globalAlpha = 1;
  }
}