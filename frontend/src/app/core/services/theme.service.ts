import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';


@Injectable({providedIn: 'root'})
export class ThemeService {
  public isDarkMode = new FormControl(true);
}
