import { Component } from '@angular/core';
import bulletTrain from 'bullet-train-client';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  logs = [];
  loading = true;
  environmentID = 'tKnQSzLyxwkMWAABCJP9Yi';
  identity = null;
  buttonClicks = null;
  trait = null;

  constructor() {
    const { environmentID, handleFlags, handleFlagsError } = this;
    bulletTrain.init({
      environmentID,
      onChange: handleFlags,
      onError: handleFlagsError,
      defaultFlags: {
        default_feature: true,
        font_size: 12,
      }
    });
  }

  handleFlags = (oldFlags, params) => {
    this.loading = false;
    this.logs = [{
      timestamp: new Date().toTimeString(),
      params: JSON.stringify(params),
      data: JSON.stringify(bulletTrain.getAllFlags(), null, 2),
    }].concat(this.logs)
    this.identity = bulletTrain.identity;
    this.buttonClicks = bulletTrain.getTrait("button_clicks");
    this.trait = bulletTrain.getTrait("example_trait") + "";

  };

  handleFlagsError = (data) => {

  };

  logout = () => {
    bulletTrain.logout();
  };

  login = () => {
    bulletTrain.identify('bullet_train_sample_user');
  };

  submitTrait = () => {
    bulletTrain.setTrait('example_trait', 'Some value ' + Math.floor(Math.random() * 10) + '');
  }

  increment = (value) => {
    bulletTrain.incrementTrait('button_clicks', value)
  };

}
