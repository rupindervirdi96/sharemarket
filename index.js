let isMarketOpen = false;
let portfolio = {
  investment: 0,
  currentValue: 0,
  change: 0,
  stocks: [
    {
      name: "Microsoft",
      currMarketPrice: 10,
      perSharePrice: 0,
      change: 0,
      nbShare: 0,
      investment: 0,
      currentValue: 0,
      openingPrice: 10,
    },
    {
      name: "Amazon",
      currMarketPrice: 10,
      perSharePrice: 0,
      change: 0,
      nbShare: 0,
      investment: 0,
      currentValue: 0,
      openingPrice: 10,
    },
    {
      name: "Tesla",
      currMarketPrice: 10,
      perSharePrice: 0,
      change: 0,
      nbShare: 0,
      investment: 0,
      currentValue: 0,
      openingPrice: 10,
    },
    {
      name: "BlackBerry",
      currMarketPrice: 1,
      perSharePrice: 0,
      change: 0,
      nbShare: 0,
      investment: 0,
      currentValue: 0,
      openingPrice: 1,
    },
  ],
  purchases: [],
};

const updateTables = () => {
  const marketTable = document.querySelector("#marketTable");
  marketTable.innerHTML = `
    <thead>
      <tr>
          <td colspan="8" class="bigHeading">Market</td>
      </tr>
      </thead>
  <tr>
      <th>Name</th>
      <th>Price</th>
      <th>perSharePrice</th>
      <th>Quantity</th>
      <th>Change today</th>
      <th>Investment</th>
      <th>Investment Now</th>
      <th>Total Return</th>
  </tr>`;
  portfolio.stocks.forEach((stock) => {
    marketTable.innerHTML += `
          <tr>
          <td>${stock.name}</td>
          <td>$${stock.currMarketPrice}</td>
          <td>$${stock.perSharePrice}</td>
          <td>${stock.nbShare}</td>
          <td>${stock.change}%</td>
          <td>$${Math.abs(stock.investment)}</td>
          <td>$${stock.currentValue}</td>
          <td>$${stock.currentValue - Math.abs(stock.investment)}</td>
          </tr>`;
  });
  const purchaseTable = document.querySelector(".purchaseTable");

  purchaseTable.innerHTML = `
    <tr>
        <td colspan="3" class="mediumHeading">Purchase Record</td>
    </tr>
  <tr>
  <th>Name</th>
  <th>Share Count</th>
  <th>Average</th>
  </tr>`;

  if (portfolio.purchases.length === 0) {
    purchaseTable.innerHTML += `<tr class="noPurchaseEntry"><td colspan="3">No Purchases made</td></tr>`;
  } else {
    document.querySelector(".noPurchaseEntry") &&
      document.querySelector(".noPurchaseEntry").remove();
    portfolio.purchases.forEach(
      (purchase) =>
        (purchaseTable.innerHTML += `<tr>
      <td>${purchase.name}</td>
      <td>${purchase.nbShares}</td>
      <td>$${purchase.purchasePrice}</td>
      </tr>`)
    );
  }

  const portfolioTable = document.querySelector(".portfolioTable");
  portfolioTable.innerHTML = `
  <tr>
      <th colspan="3" class="mediumHeading">Portfolio</th>
  </tr>
   <tr>
      <th>Investment</th>
      <th>Current</th>
      <th>Change</th>
  </tr>
   <tr>
      <td>${portfolio.investment}</td>
      <td>${portfolio.currentValue}</td>
      <td>${
        portfolio.investment && portfolio.currentValue
          ? calculateChangePercentage(
              portfolio.investment,
              portfolio.currentValue
            )
          : 0
      }%</td>
  </tr>
  `;
};

updateTables();

const stockOptionsSelect = document.querySelector(".stockSelect");
const loadStocksForPurchase = () => {
  stockOptionsSelect.innerHTML = `<option value="0">Select a stock</option>`;
  portfolio.stocks.map(
    (stock, key) =>
      (stockOptionsSelect.innerHTML += `<option value="${key + 1}">${
        stock.name
      }</option>`)
  );
};

// var startMarket = setInterval(function () {
//   portfolio.stocks.forEach((stock) => {
//     if (stock.nbShare) {
//       stock.perSharePrice = stock.currMarketPrice;
//     }
//   });
//   const selectedStock =
//     portfolio.stocks[Math.floor(Math.random() * portfolio.stocks.length)];
//   const change =
//     selectedStock && Math.floor(Math.random() * 10) % 2
//       ? "increment"
//       : "decrement";
//   switch (change) {
//     case "increment":
//       selectedStock.currMarketPrice += 0.5;
//       break;
//     case "decrement":
//       if (selectedStock.currMarketPrice !== 0) {
//         selectedStock.currMarketPrice -= 0.5;
//       }
//       break;
//   }
//   if (selectedStock.nbShare) {
//     selectedStock.perSharePrice = selectedStock.currMarketPrice;
//   }
//   marketUpdate(selectedStock.currMarketPrice, selectedStock.name);
// }, 1000);

const mktBtn = document.querySelector(".mktBtn");
mktBtn.onclick = () => {
  if (mktBtn.innerText === "Open Market") {
    mktBtn.innerText = "Close Market";
    var startMarket = setInterval(function () {
      portfolio.stocks.forEach((stock) => {
        if (stock.nbShare) {
          stock.perSharePrice = stock.currMarketPrice;
        }
      });
      const selectedStock =
        portfolio.stocks[Math.floor(Math.random() * portfolio.stocks.length)];
      const change =
        selectedStock && Math.floor(Math.random() * 10) % 2
          ? "increment"
          : "decrement";
      switch (change) {
        case "increment":
          selectedStock.currMarketPrice += 0.5;
          break;
        case "decrement":
          if (selectedStock.currMarketPrice !== 0) {
            selectedStock.currMarketPrice -= 0.5;
          }
          break;
      }
      if (selectedStock.nbShare) {
        selectedStock.perSharePrice = selectedStock.currMarketPrice;
      }
      marketUpdate(selectedStock.currMarketPrice, selectedStock.name);
    }, 1000);
  } else {
    clearInterval(startMarket);
    mktBtn.innerText = "Open Market";
  }
};

const calculateChangePercentage = (oldPrice, currMarketPrice) => {
  return parseInt(((currMarketPrice - oldPrice) / oldPrice) * 100);
};

const marketUpdate = (currMarketPrice, stockname) => {
  const stock = portfolio.stocks.find((stock) => stock.name === stockname);
  stock.change = calculateChangePercentage(stock.openingPrice, currMarketPrice);
  stock.currMarketPrice = currMarketPrice;
  stock.currentValue = stock.currMarketPrice * stock.nbShare;
  portfolio.currentValue = 0;
  portfolio.stocks.forEach((stock) => {
    portfolio.currentValue += stock.currentValue;
  });
  updateTables();
};

loadStocksForPurchase();

const makePurchase = (selectedStock, newBoughtNbShares) => {
  portfolio.investment += selectedStock.currMarketPrice * newBoughtNbShares;
  selectedStock.investment += selectedStock.currMarketPrice * newBoughtNbShares;
  if (selectedStock.nbShare === 0) {
    selectedStock.nbShare = newBoughtNbShares;
    selectedStock.perSharePrice = selectedStock.currMarketPrice;
  } else {
    //here change average based on last purchase and present purchase
  }
  portfolio.purchases.push({
    name: selectedStock.name,
    nbShares: newBoughtNbShares,
    purchasePrice: selectedStock.currMarketPrice,
  });
  emptyFields();
  updateTables();
};

// updateStock = (stock, newBoughtNbShares) => {};

// addNewStock = (stock, newBoughtNbShares) => {};

document.querySelector("#makePurchaseBtn").onclick = () => {
  const selectedStock = portfolio.stocks.find(
    (stock) =>
      stock.name ===
      portfolio.stocks[document.querySelector(".stockSelect")?.value - 1]?.name
  );
  const nbSharesToPurchase = document.querySelector(
    "#nbSharesToPurchase"
  )?.value;
  if (selectedStock && nbSharesToPurchase) {
    makePurchase(selectedStock, nbSharesToPurchase);
  }
};
const emptyFields = () => {
  document.querySelector(".stockSelect").value = 0;
  document.querySelector("#nbSharesToPurchase").value = 0;
};
