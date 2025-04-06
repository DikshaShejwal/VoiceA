export {};

declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }

  var SpeechRecognition: typeof SpeechRecognition;

  interface SpeechRecognitionEvent extends Event {
    readonly results: SpeechRecognitionResultList;
  }
}
