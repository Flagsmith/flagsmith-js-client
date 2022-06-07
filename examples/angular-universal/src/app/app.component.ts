import { Component } from '@angular/core';
import { FlagsmithService } from './flagsmith.service';
import flagsmith from 'flagsmith/isomorphic'
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private flagsmithService: FlagsmithService) {}

  setState = ()=> {
    this.fontSize = `${flagsmith.getValue("font_size")}`
    this.identity = !!flagsmith.identity;
    this.trait = flagsmith.getTrait("example_trait") + "";
    this.buttonClicks = parseInt(`${flagsmith.getTrait("button_clicks")}`);
  }

  ngOnInit() {
    this.flagsmithService.init(() => {
      this.setState()
    })
    this.setState()
  }

  logout = () => {
    flagsmith.logout();
  };

  login = () => {
    flagsmith.identify('flagsmith_sample_user');
  };

  submitTrait = () => {
    flagsmith.setTrait('example_trait', 'Some value ' + Math.floor(Math.random() * 10) + '');
  }

  increment = (value) => {
    flagsmith.setTrait('button_clicks', this.buttonClicks+value)
  };

  buttonClicks = 0;
  fontSize = '';
  identity = false
  trait = ''
}
