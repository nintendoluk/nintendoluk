import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-home',
  imports: [ReactiveFormsModule],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  jsonUrl = new FormControl('https://www.bloodstar.xyz/p/nintendoluk/final_fantasy_script_german/script.json?1b4ccb84',Validators.required);

  retrieveJson(){}
}
