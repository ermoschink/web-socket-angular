import { Component } from '@angular/core';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { MessageWords } from '../common/model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  /////////////////////////////////////////////////
  //
  title = 'app';
  private serverUrl = '/receiving';
  private stompClient;

  public wordInput = '';
  public wordsOutput: string[] = [];;
  /////////////////////////////////////////////////
  //
  constructor() {
    this.wordsOutput = [];
    this.initializeWebSocketConnection();
  }
  /////////////////////////////////////////////////
  //
  initializeWebSocketConnection() {
    let ws = new SockJS(this.serverUrl);
    this.stompClient = Stomp.over(ws);
    let that = this;
    this.stompClient.connect({}, function (frame) {
      that.stompClient.subscribe('/topic/departure', (message) => {
        if (message.body) {
          const tmpOutput: MessageWords = message.body && JSON.parse(message.body);
          console.log(tmpOutput);
          that.wordsOutput = tmpOutput.words;
        }
      });
    });
  }
  /////////////////////////////////////////////////
  //
  sendMessage() {
    const data = {
      message: this.wordInput
    };
    this.stompClient.send('/app/receiving', {}, JSON.stringify(data));
    // this.wordsOutput.push(this.wordInput);
    this.wordInput = '';

  }
  /////////////////////////////////////////////////
  //
}
