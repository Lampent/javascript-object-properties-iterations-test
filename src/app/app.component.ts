import { Component } from '@angular/core';

declare const PerformanceObserver: any;

Object.prototype[Symbol.iterator] = function*() {
  const keys = Object.keys(this);
  for (const key of keys) {
    yield this[key];
  }
};


enum MethodNames {
  ENTITIES = 'ENTITIES',
  KEYS = 'KEYS',
  VALUES = 'VALUES',
  FORIN = 'FORIN',
  GETOWP = 'GETOWP',
  REFLECT = 'REFLECT',
  CUSTOM_ITERATOR = 'CUSTOM_ITERATOR'
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  iterations: number = 100000;
  objectSize: number = 100;
  methodDuration = {};
  methodNamesEnum = MethodNames;

  constructor() {
    this.initPerformance();
    this.generateObject(this.objectSize);
    this.test();
  }

  initPerformance(): void {
    performance.clearMarks();
    performance.clearMeasures();
  }

  test(): void {
    for (let i = 0; i < this.iterations; i++) {
      const obj = this.generateObject(this.objectSize);
      performance.mark('Start');
      Object.entries(obj).forEach(entry => {
        const val = entry[1];
      });
      performance.mark('End');
      performance.measure(MethodNames.ENTITIES, 'Start', 'End');

      // Object.Keys
      performance.mark('Start');
      Object.keys(obj).forEach(key => {
        const val = obj[key];
      });
      performance.mark('End');
      performance.measure(MethodNames.KEYS, 'Start', 'End');

      // Object.Values
      performance.mark('Start');
      Object.values(obj).forEach(value => {
        const val = value;
      });
      performance.mark('End');
      performance.measure(MethodNames.VALUES, 'Start', 'End');

      // For In
      performance.mark('Start');
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          const val = obj[key];
        }
      }
      performance.mark('End');
      performance.measure(MethodNames.FORIN, 'Start', 'End');

      // Object.getOwnPropertyNames
      performance.mark('Start');
      Object.getOwnPropertyNames(obj).forEach(key => {
        const val = obj[key];
      });
      performance.mark('End');
      performance.measure(MethodNames.GETOWP, 'Start', 'End');

      // Reflect.ownKeys
      performance.mark('Start');
      Reflect.ownKeys(obj).forEach(key => {
        const val = obj[key];
      });
      performance.mark('End');
      performance.measure(MethodNames.REFLECT, 'Start', 'End');

      // Custom Iterator
      performance.mark('Start');
      for (const value of obj) {
        const val = value;
      }
      performance.mark('End');
      performance.measure(MethodNames.CUSTOM_ITERATOR, 'Start', 'End');
    }

    Object.keys(MethodNames).forEach((methodName: MethodNames) => {
       this.methodDuration[methodName] = ((performance.getEntriesByName(methodName)
         .map((measure) => measure.duration)
         .reduce((total, measureDuration) => total + measureDuration)) / this.iterations);
    });

    console.log(this.methodDuration);
  }

  generateObject(numberOfOwnProperties): any {
    const obj: any = {};
    for (let i = 0; i < numberOfOwnProperties; i++) {
      obj['key' + i] = `key number ${i}`;
    }
    return obj;
  }
}
