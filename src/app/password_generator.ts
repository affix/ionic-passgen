import { PasswordGeneratorOptions, GeneratedPassword } from './password_generator.interface';
import { latin1List, lowercaseLettersList, numbersList, specialCharactersList, uppercaseLettersList } from './charsets';

const defaultOptions: PasswordGeneratorOptions = {
  lowercaseLetters: true,
  uppercaseLetters: true,
  numbers: true,
  specialCharacters: true,
  latin1Characters: false,
  parts: {
    amount: 1,
    length: 30,
    delimiter: '-'
  }
}

export class PasswordGenerator {
  constructor(public options: PasswordGeneratorOptions = defaultOptions) {
  }

  /**
   * Checks if a password string contains at least one character from a string
   * array.
   */
  private containsFromCharset(password: string, charset: string[]): boolean {
    for (let char of charset) {
      if (password.indexOf(char) !== -1) {
        return true;
      }
    }
    return false;
  }

  /**
   * Count how many charsets are being used in the current configuration.
   */
  countActiveCharsets(): number {
    return [
      this.options.lowercaseLetters,
      this.options.uppercaseLetters,
      this.options.numbers,
      this.options.specialCharacters,
      this.options.latin1Characters
    ].reduce((prev, curr) => prev += +curr, 0);
  }

  get passwordLength() {
    let { amount, length, delimiter } = this.options.parts;
    return amount * length + (amount - 1) * delimiter.length;
  }

  random(): number {
    return Math.random()
  }

  /**
   * Generates a password based on this.options. This method will recursively
   * call itself if the password does not contain at least one character from
   * each specified charset.
   */
  generate(): GeneratedPassword {
    let list: string[] = []; // This will hold all the characters that are going to be used
    let password: string = '';

    if (this.passwordLength < this.countActiveCharsets()) {
      throw new Error('Cannot generate a password with the current configuration');
    }

    if (this.options.lowercaseLetters) {
      list = list.concat(lowercaseLettersList);
    }
    if (this.options.uppercaseLetters) {
      list = list.concat(uppercaseLettersList);
    }
    if (this.options.numbers) {
      list = list.concat(numbersList);
    }
    if (this.options.specialCharacters) {
      list = list.concat(specialCharactersList);
    }
    if (this.options.latin1Characters) {
      list = list.concat(latin1List);
    }

    // If the parts have a length of 0 or below, abort.
    if (this.options.parts.length <= 0) {
      return {
        value: '',
        charsetLength: list.length
      }
    }

    let { amount, length, delimiter } = this.options.parts;
    for (let partIndex = 0; partIndex < amount; partIndex++) {
      let part = '';

      while (part.length < length) {
        let randomIndex = Math.floor(this.random() * list.length);
        part += list[randomIndex];
      }

      // If this is not the last part, add the delimiter.
      if (partIndex !== amount - 1) {
        part += delimiter;
      }

      password += part;
    }

    // Make sure that at least one character from each used charset is present,
    // otherwise call this method again.
    if (
      (this.options.lowercaseLetters && !/[a-z]/.test(password))
      || (this.options.uppercaseLetters && !/[A-Z]/.test(password))
      || (this.options.numbers && !/[0-9]/.test(password))
      || (this.options.specialCharacters && !this.containsFromCharset(password, specialCharactersList))
      || (this.options.latin1Characters && !this.containsFromCharset(password, latin1List))
    ) {
      return this.generate();
    }

    return {
      value: password,
      charsetLength: list.length
    }
  }

  scorePassword(pass) {
    var score = 0;
    if (!pass)
      return score;

    // award every unique letter until 5 repetitions
    var letters = new Object();
    for (var i=0; i<pass.length; i++) {
      letters[pass[i]] = (letters[pass[i]] || 0) + 1;
      score += 5.0 / letters[pass[i]];
    }

    // bonus points for mixing it up
    var variations = {
      digits: /\d/.test(pass),
      lower: /[a-z]/.test(pass),
      upper: /[A-Z]/.test(pass),
      nonWords: /\W/.test(pass),
    }

    var variationCount = 0;
    for (var check in variations) {
      variationCount += (variations[check] == true) ? 1 : 0;
    }
    score += (variationCount - 1);

    return parseInt(score);
  }
}
