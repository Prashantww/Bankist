'use strict';

// Data
const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2020-07-26T17:01:17.194Z",
    "2020-07-28T23:36:17.929Z",
    "2020-08-01T10:51:36.790Z",
  ],
  currency: "EUR",
  locale: "pt-PT", // de-DE
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2020-07-26T12:01:20.894Z",
  ],
  currency: "USD",
  locale: "en-US",
};

const accounts = [account1, account2];


//////////////////   ELEMENTS   ////////////////////


const containerMovements = document.querySelector('.history');
const containerMain = document.querySelector('main');

const lableCurrentBalance = document.querySelector('.balance');
const lableInAmount = document.querySelector('.in-amount');
const lableOutAmount = document.querySelector('.out-amount');
const lableInterest = document.querySelector('.interest');
const lableGreeting = document.querySelector('h1');

const inputUserId = document.querySelector('.user-id');
const inputPin = document.querySelector('.pin');
const inputTransferTo = document.querySelector('.transfer-to');
const inputTransferAmount = document.querySelector('.transfer-amount');
const inputConfirmId = document.querySelector('.confirm-id');
const inputConfirmPin = document.querySelector('.confirm-pin');
const inputRequestLoan = document.querySelector('.loan-amount');

const btnEnter = document.querySelector('.enter');
const btnSend = document.querySelector('.send');
const btnConfirm = document.querySelector('.confirm');
const btnRequestLoan = document.querySelector('.request');
const btnSort = document.querySelector('.sort');

const lableDate = document.querySelector('.balance-date');
//////////////////   FUNCTION   ////////////////////

const createUsernames = function(accs){
  accs.forEach(function(acc){
    acc.userName = acc.owner.split(" ").map(naam => naam[0]).join("").toLowerCase();
  });
};

const getDateSuffix = function(day){
  if (day%10 == 1) return 'st';

  else if (day%10 == 2) return 'nd';
  
  else if(day%10 == 3)return 'rd';

  else return 'th';
}

createUsernames(accounts);


const displayMovements = function(acc, sort = false){


const now = new Date();
const formatedDate = new Intl.DateTimeFormat(acc.locale, {
  dateStyle: "short",
  timeStyle: "short",
}).format(now);

lableDate.textContent = `As of ${formatedDate}`;

  const combinedMovsDates = acc.movements.map((mov, i) => 
  ({
    movement: mov,
    movDate: acc.movementsDates.at(i),
  })
  );

  if (sort) {combinedMovsDates.sort((a,b) => a.movement - b.movement)};
 
  containerMovements.innerHTML = '';

  combinedMovsDates.forEach(function(obj, i){
    const movement2 = obj.movement;
    const movement2Date = obj.movDate;
    const date = new Date(movement2Date);

    const formatedNumber = new Intl.NumberFormat(acc.locale, {style: "currency", currency: acc.currency}).format(Math.abs(movement2));

    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });

    const type = movement2 > 0? "deposite" : "withdrawal";

    const html = `<div class="transaction">
            <div class="flex space-between align-center w100">
              <div>
                <div class="flex align-center h100">
                  <div class="status-lable-${type}"></div>
                  <h2 class="transaction-date">${day}<sup>${getDateSuffix(day)}</sup> ${month}</h2>
                </div>
                <p class="status">${`${i+1} ${type}`}</p>
              </div>
              <h2 class="money">${formatedNumber}</h2>
            </div>
          </div>`;
      containerMovements.insertAdjacentHTML("afterbegin", html);
  });

};

const displayCurrentBalance = function(acc){
  acc.balance = acc.movements.reduce((acc, cur) => acc + cur);
  lableCurrentBalance.textContent = `$${acc.balance.toFixed(2)}`
};

const displaySummary = function(acc){
  const inBalance = acc.movements.filter(mov => mov > 0).reduce((acc, cur) => acc + cur);
  lableInAmount.innerHTML = `<h2 class="in-amount"><b>IN</b>&nbsp; $${inBalance.toFixed(2)}</h2>`;

  const outBalance = acc.movements.filter(mov => mov < 0).reduce((acc, cur) => acc + cur);
  lableOutAmount.innerHTML = `<h2 class="out-amount"><b>OUT</b>&nbsp; $${(Math.abs(outBalance)).toFixed(2)}</h2>`;

  const interest = acc.movements.filter(mov => mov > 0).map(mov => mov * currentAccount.interestRate/100).filter(num => num >= 1).reduce((acc, cur) => acc + cur);
  lableInterest.innerHTML = `<h2 class="interest"><b>INTEREST</b>&nbsp; $${interest.toFixed(2)}</h2>`
};

const updateUi = function(acc){
    displayMovements(acc);
    displayCurrentBalance(acc);
    displaySummary(acc);
};
////// TRANSFER MONEY //////
btnSend.addEventListener('click', function(e){
  e.preventDefault();
  const reciverAccount = accounts.find(acc => acc.userName === inputTransferTo.value);
  const amount = Number(inputTransferAmount.value);

  if (reciverAccount && 
    amount > 0 && 
    amount <= currentAccount.balance && 
    reciverAccount.userName !== currentAccount.userName){

    reciverAccount?.movements.push(amount);
    currentAccount.movements.push(amount * -1);

    currentAccount.movementsDates.push(new Date());
    reciverAccount.movementsDates.push(new Date());

    updateUi(currentAccount);
  };

  inputTransferTo.value = inputTransferAmount.value = '';
});
////// TRANSFER MONEY END //////

//////  Request Loan  //////

btnRequestLoan.addEventListener('click', function(e){
  e.preventDefault();
  const amount = Number(inputRequestLoan.value);
  
  if (currentAccount.movements.some(mov => mov >= amount*0.1)){

    setTimeout(function(){
      currentAccount.movements.push(amount);

    currentAccount.movementsDates.push(new Date());

    updateUi(currentAccount);
    }, 2000);
    
  };
});

//////  Request Loan End //////


////// CLOSE ACCOUNT //////

btnConfirm.addEventListener('click', function(e){
  e.preventDefault();
  if (inputConfirmId.value === currentAccount.userName && Number(inputConfirmPin.value) === currentAccount.pin){
    const index = accounts.findIndex(acc => acc.userName === currentAccount.userName);
    accounts.splice(index, 1);
    containerMain.style.opacity = 0;
  };
});
////// CLOSE ACCOUNT END //////


let currentAccount;
btnEnter.addEventListener('click', function (e){
  e.preventDefault();

  currentAccount = accounts.find(acc => acc.userName === inputUserId.value);

  if(currentAccount?.pin === Number(inputPin.value)){
    lableGreeting.textContent = `Good Afternoon, ${currentAccount.owner.split(" ")[0]}!`;

    containerMain.style.opacity = 100;

    inputPin.value = inputUserId.value = '';
    inputTransferTo.value = inputTransferAmount.value = '';
    inputPin.blur();
  };

  updateUi(currentAccount);
});

///// Sort  /////
let sorted = false;
btnSort.addEventListener('click', function(e){
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});
///// Sort End /////



