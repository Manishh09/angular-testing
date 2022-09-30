import { CalculatorService } from "./calculator.service";

describe('CalculatorService',() => { // contains the group of specs
  let loggerServ: any,
      calcServ: CalculatorService;
  beforeEach(() => {
    loggerServ = jasmine.createSpyObj('LoggerService', ['log']);
    calcServ =  new CalculatorService(loggerServ);
  })

  it('should add two numbers', ()=>{
    // pending(); // informs angular that this spec will be pending
    // main service classe's dependencies should be mocked
    //const loggerServ = new LoggerService(); // should be mocked
    //spyOn(loggerServ, 'log'); // creates whole new spy method which simulates the log method that is available on loggerservice class
    //const loggerServ = jasmine.createSpyObj('LoggerService', ['log']); // faking the dependency
    //const calcServ = new CalculatorService(loggerServ);
    const result = calcServ.add(2,4);
    expect(result).toBe(6);
    expect(loggerServ.log).toHaveBeenCalledTimes(2); // check if the method 'log' is called how many times
  })

  it('should substract two numbers', ()=>{
    // fail(); // informs angular that this spec will be failed
    //const calcServ = new CalculatorService(loggerServ);
    const result = calcServ.subtract(2,3);
    expect(result).toBe(-1, 'unexpected subtraction'); // can also provide the error description why the error has occured
    expect(loggerServ.log).toHaveBeenCalledTimes(2);
  })


})
