import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {PasswordGenerator} from "../../app/password_generator";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  upper: boolean = true;
  lower: boolean = true;

  numeric: boolean = true;
  sym: boolean = true;
  latin1: boolean = false;

  length: number = 8;

  password: string = "p4$$w0rd";
  score: number = 0;

  onChange(ev: any) {
    this.password = this.randomPassword().value;
    document.getElementById('generated').innerHTML = this.password;
    document.getElementById('password-strength-meter').value = this.score;
  }

  randomPassword() {
    let generator = new PasswordGenerator();
    generator.options.parts.length = this.length;
    generator.options.latin1Characters = this.latin1;
    generator.options.lowercaseLetters = this.upper;
    generator.options.uppercaseLetters = this.lower;
    generator.options.numbers = this.numeric;
    generator.options.specialCharacters = this.sym;
    let password = generator.generate();
    this.score = generator.scorePassword(password.value);
    return password;
  }

  constructor(public navCtrl: NavController) {

  }
}
