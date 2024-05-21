const dollarToCent = dollars => Math.round(dollars * 100);
const centToDollar = cents => (cents / 100);
let price = dollarToCent(3.26);
let cid = [
  ["PENNY", dollarToCent(1.01)],
  ["NICKEL", dollarToCent(2.05)],
  ["DIME", dollarToCent(3.1)],
  ["QUARTER", dollarToCent(4.25)],
  ["ONE", dollarToCent(90)],
  ["FIVE", dollarToCent(55)],
  ["TEN", dollarToCent(20)],
  ["TWENTY", dollarToCent(60)],
  ["ONE HUNDRED", dollarToCent(100)]
];

const changeDueDiv = document.getElementById("change-due");
const cashInput = document.getElementById("cash");
const purchaseBtn = document.getElementById("purchase-btn");
const screen = document.getElementById("screen");
const register = document.getElementById("cid");
const total = cid.reduce((acc, curr) => acc + curr[1], 0);
const reversedCid = [...cid].reverse();

screen.innerHTML = `<p>Total: $${centToDollar(price)}</p>`;

const updateDisplay = (arr, div) => {
  for (let i=0; i < arr.length; i++) {
    div.innerHTML += `<p>${arr[i][0]}: $${centToDollar(arr[i][1])}</p>`
  }
};

updateDisplay(cid, register);

const calculateChange = (changeDue, currency, reversedCid) => {
  let updatedCid = [
    ["ONE HUNDRED", 0],
    ["TWENTY", 0],
    ["TEN", 0],
    ["FIVE", 0],
    ["ONE", 0],
    ["QUARTER", 0],
    ["DIME", 0],
    ["NICKEL", 0],
    ["PENNY", 0]
  ];
  for (let i = 0; i < currency.length; i++) {
    while (changeDue >= currency[i] && reversedCid[i][1] >= currency[i]) {
      changeDue -= currency[i];
      reversedCid[i][1] -= currency[i];
      updatedCid[i][1] += currency[i];
      changeDue = Math.round(changeDue * 100) / 100;
    }
  }
  updatedCid = updatedCid.filter(num => num[1] > 0);
  return { updatedCid, changeDue };
};

const checkRegister = cash => {
  const cashAmount = dollarToCent(Number(cash));

  if (cashAmount < price) {
    alert("Customer does not have enough money to purchase the item");
    return;
  };
  if (cashAmount === price) {
    changeDueDiv.innerHTML = "<p>No change due - customer paid with exact cash</p>";
    return;
  };

  let changeDue = cashAmount - price;

  if (total < changeDue) {
    changeDueDiv.innerHTML = "<p>Status: INSUFFICIENT_FUNDS</p>";
    return;
  };

  const currency = [
    10000,
    2000,
    1000,
    500,
    100,
    25,
    10,
    5,
    1
  ];
  const { updatedCid: newCid, changeDue: remainingChange} = calculateChange(changeDue, currency, reversedCid);
  const normalCid = [...reversedCid].reverse();
  register.innerHTML = "";
  updateDisplay(normalCid, register);

  if (remainingChange > 0) {
    changeDueDiv.innerHTML = "<p>Status: INSUFFICIENT_FUNDS</p>";
    return; 
  };
  if (total === changeDue) {
    changeDueDiv.innerHTML = "<p>Status: CLOSED </p>";
    updateDisplay(newCid, changeDueDiv);
    return;
  };
  if (total > changeDue) {
    changeDueDiv.innerHTML = "<p>Status: OPEN </p>";
    updateDisplay(newCid, changeDueDiv);
    return;
  };
};

cashInput.addEventListener("keydown", e => {
  if (e.key === "Enter") {
    changeDueDiv.innerHTML = "";
    checkRegister(cashInput.value);
    cashInput.value = "";
  };
});

purchaseBtn.addEventListener("click", () => {
  changeDueDiv.innerHTML = "";
  checkRegister(cashInput.value);
  cashInput.value = "";
});
