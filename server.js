const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = socketio(server, {
  cors: { origin: '*' }
});
const { SpeechClient } = require('@google-cloud/speech');
const speechClient = new SpeechClient();

// io.on('connection', (socket) => {
//   socket.on('audio-for-transcription', async (audioBuffer) => {
//     // Convert ArrayBuffer to Buffer
//     const buffer = Buffer.from(audioBuffer);

//     const audioBytes = buffer.toString('base64');
//     const request = {
//       audio: { content: audioBytes },
//       config: {
//         encoding: 'WEBM_OPUS',
//         sampleRateHertz: 48000,
//         languageCode: 'en-US',
//       },
//     };

//     try {
//       const [response] = await speechClient.recognize(request);
//       const transcription = response.results
//         .map(result => result.alternatives[0].transcript)
//         .join('\n');
//       socket.emit('transcription-result', transcription);
//     } catch (err) {
//       socket.emit('transcription-result', '[Transcription failed]');
//     }
//   });
// });

io.on('connection', socket => {
  console.log('User connected');

  socket.on('chat', msg => {
    console.log('Received:', msg);

    // Simulate typing delay for realism
    setTimeout(() => {
      let reply = getBotReply(msg);
      socket.emit('bot', reply);
    }, Math.floor(Math.random() * 800) + 400); // 400-1200ms delay
  });

  socket.on('audio', (audioChunk) => {
    // Handle audio chunk (Buffer)
    // Save, process, or forward to AI service
    console.log('Received audio chunk:', audioChunk);
  });

  socket.on('audio-complete', (audioBlob) => {
    // Handle complete audio blob
    console.log('Received complete audio');
  });
});

// Enhanced bot reply logic
function getBotReply(msg) {
  const text = msg.toLowerCase();
  if (text.includes("hello") || text.includes("hi")) {
    return "Hello! 👋 How can I help you today?";
  }
  if (text.includes("how are you")) {
    return "I'm doing well, thank you! How can I assist you?";
  }
  if (text.includes("what's your name") || text.includes("who are you")) {
    return "I'm your friendly AI assistant, here to help with your banking and wealth needs.";
  }
  if (text.includes("help")) {
    return "Sure, I can help! You can ask about your account, recent transactions, investment ideas, or anything else.";
  }
  if (text.includes("bye") || text.includes("goodbye")) {
    return "Goodbye! Have a wonderful day!";
  }
  if (text.includes("balance")) {
    return "Your current account balance is ₹1,25,000. Would you like a detailed statement?";
  }
  if (text.includes("portfolio")) {
    return "Your portfolio is performing well. Would you like to review your holdings or get new recommendations?";
  }
  if (text.includes("recommend")) {
    return "Based on your profile, I recommend considering ESG funds or a balanced mutual fund. Would you like more details?";
  }
  // Default fallback
  return "I'm here to assist you. Please ask me anything related to your banking or investments!";
}

server.listen(3000, () => console.log('Server running on port 3000'));