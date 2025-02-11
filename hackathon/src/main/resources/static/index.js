// Global variables
let tempBalance = 0;
let actualBalance = 0;
let tempWeeks = 0;

// Fetch and display stock data
async function fetchStockData() {
    resetGameState();

    document.getElementById("start-button").style.visibility = "hidden";
    await updateBalance();
    document.getElementById("stock-info").style.visibility = "visible";

    const lst = ['AMZN', 'MSFT', 'GOOG', 'AAPL', 'NVDA', 'META', 'NFLX', 'WMT', 'COST'];
    const ticker = lst[Math.floor(Math.random() * lst.length)];
    document.getElementById('ticker-display').textContent = ticker;

    const url = `https://yahoo-finance15.p.rapidapi.com/api/v1/markets/stock/history?symbol=${ticker}&interval=1d&diffandsplits=false`;
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': '5271f027a1mshafaa054b903d680p14eae2jsnb72b85889940',
            'x-rapidapi-host': 'yahoo-finance15.p.rapidapi.com'
        }
    };

    try {
        const response = await fetch(url, options);
        const json = await response.json();
        localStorage.setItem('stockApiResponse', JSON.stringify(json));

        const items = json.body;
        if (!items || Object.keys(items).length === 0) {
            throw new Error('No data received for this ticker');
        }

        const randomYear = Math.floor(Math.random() * (2023 - 2020 + 1)) + 2020;
        document.getElementById('year-display').textContent = randomYear;

        const datesInYear = Object.keys(items).filter(timestamp => {
            return items[timestamp].date.endsWith(randomYear.toString());
        });

        const dates = [];
        const opens = [];
        const closes = [];

        for (let i = 0; i < Math.min(datesInYear.length, 7); i++) {
            const item = items[datesInYear[i]];
            const [day, month, year] = item.date.split('-');
            dates.push(`${day}/${month}/${year}`);
            opens.push(item.open);
            closes.push(item.close);
        }

        window.stockData = { dates, opens, closes };
        document.getElementById('game-title').style.visibility = "visible";
        document.getElementById("game-info").style.visibility = "visible";
        visualizeStock(dates, opens, closes);

    } catch (error) {
        console.error(`Error fetching stock: ${error}`);
        alert(`Error fetching stock: ${error.message}`);
    }
}

//Plots graph
function visualizeStock(labels, opens, closes) {
    const ctx = document.getElementById('stock').getContext('2d');
    // Destroy existing chart
    if (window.stockChart) window.stockChart.destroy();
    window.stockChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Opening Price',
                    data: opens,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 2,
                    fill: false
                },
                {
                    label: 'Closing Price',
                    data: closes,
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 2,
                    fill: false
                }
            ]
        },
        options: {
            plugins: {
                zoom: {
                    pan: {
                        enabled: true,
                    },
                    zoom: {
                        wheel: {
                            enabled: true,
                        },
                        pinch: {
                            enabled: true
                        },
                        mode: 'xy',
                    },
                },
            },
            scales: {
                y: {
                    beginAtZero: false,
                    title: {
                        display: true,
                        text: 'Price (USD)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Date'
                    }
                }
            },
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

// Reset game state before starting a new session
function resetGameState() {
    tempBalance = actualBalance;
    tempWeeks = 0;

    document.getElementById("money").value = "";
    document.getElementById("weeks").value = "";

    document.getElementById("start-button").style.visibility = "visible";
    document.getElementById("stock-info").style.visibility = "hidden";
    document.getElementById("game-title").style.visibility = "hidden";
    document.getElementById("game-info").style.visibility = "hidden";

    if (window.stockChart) window.stockChart.destroy();
}

//Grabs the current user logged in name to parse account details
async function getUsername() {
    try {
        const response = await fetch('/api/money/username');
        if (!response.ok) {
            throw new Error(response.statusText);
        }
        const username = await response.text();
        return username;
    } catch (error) {
        console.error(`Error fetching username: ${error}`);
    }
}
//Update user balance
async function updateBalance() {
    try {
        const username = await getUsername();
        if (!username) {
            return;
        }
        const response = await fetch(`/api/money/balance?username=${username}`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        actualBalance = await response.json();
        //Hacky solution should probably remove.
        let balanceDisplay = document.getElementById('balance-display');
        if (!balanceDisplay) {
            balanceDisplay = document.createElement('p');
            balanceDisplay.id = 'balance-display';
            document.getElementById("game-info").prepend(balanceDisplay);
            balanceDisplay.textContent = `Current Balance: $${actualBalance} \r\n`;
        }
        tempBalance = actualBalance;
    } catch (error) {
        console.error(`Error fetching balance: ${error}`);
    }
}
//Display user balance
async function displayBalance(balance) {
    try {
        let balanceDisplay = document.getElementById('balance-display');
        if (!balanceDisplay) {
            balanceDisplay = document.createElement('p');
            balanceDisplay.id = 'balance-display';
            document.getElementById("game-info").prepend(balanceDisplay);
        }
        balanceDisplay.textContent = `Current Balance: $${balance} \r\n`;
        return balance;
    } catch (error) {
        console.error(`Error fetching balance: ${error}`);
    }
}
async function displayWeeks(weeks) {
    try {
        let weekDisplay = document.getElementById('week-display');
        if (!weekDisplay) {
            weekDisplay = document.createElement('p');
            weekDisplay.id = 'week-display';
            document.getElementById("game-info").prepend(weekDisplay);
        }
        weekDisplay.textContent = `Weeks: ${weeks} \r\n`;
    } catch (error) {
        console.error(`Error fetching balance: ${error}`);
    }
}
//Subtracts money from a user account
async function subtractBalance(investedAmount) {
    if (investedAmount > 0) {
        try {
            const username = await getUsername();
            if (!username) {
                return;
            }
            const subtract = await fetch(`/api/money/subtract?username=${username}&money=${investedAmount}`);
            if (!subtract.ok) {
                throw new Error(`HTTP error: ${subtract.statusText}`);
            }
            actualBalance -= investedAmount;
            tempBalance = actualBalance;
            await displayBalance(actualBalance);
        } catch (error) {
            console.error(`Error fetching subtract: ${error}`);
        }
    } else {
        alert("No funds invested.")
    }
}
async function addBalance(investedAmount) {
    try {
        const username = await getUsername();
        if (!username) {
            return;
        }
        const addition = await fetch(`/api/money/add?username=${username}&money=${investedAmount}`);
        if (!addition.ok) {
            throw new Error(`HTTP error: ${addition.statusText}`);
        }
        actualBalance += investedAmount;
        tempBalance = actualBalance;
        await displayBalance(actualBalance);
    } catch (error) {
        console.error(`Error fetching add: ${error}`);
    }
}

// Calculate stock returns
function calculateStocks(balance, weeks) {
    const investedAmount = actualBalance - balance;
    if (balance === 0) {
        alert("It's not wise to go all in on one stock...");
        return;
    } else if (weeks === 0) {
        alert("Select weeks to invest");
        return;
    } else if (investedAmount === 0) {
        alert("Please invest some money in first")
        return;
    }

    const { dates, closes } = window.stockData;
    const initialDate = dates[dates.length - 1];
    const initialPrice = closes[closes.length - 1];

    const [initialDay, initialMonth, initialYear] = initialDate.split("/").map(Number);
    const initialDateObj = new Date(initialYear, initialMonth - 1, initialDay);

    const futureDateObj = new Date(initialDateObj);
    futureDateObj.setDate(futureDateObj.getDate() + (weeks * 7));

    const futureYear = futureDateObj.getFullYear();
    const futureMonth = String(futureDateObj.getMonth() + 1).padStart(2, '0');
    const futureDay = String(futureDateObj.getDate()).padStart(2, '0');
    const futureDateStr = `${futureDay}-${futureMonth}-${futureYear}`;

    const items = JSON.parse(localStorage.getItem('stockApiResponse')).body;
    let futurePrice = null;

    for (const timestamp in items) {
        if (items[timestamp].date === futureDateStr) {
            futurePrice = items[timestamp].close;
            break;
        }
    }

    console.log(`Future Date: ${futureDateStr}, Future Price: $${futurePrice}`);


    const percentageChange = (futurePrice - initialPrice) / initialPrice;

    const profitOrLoss = investedAmount * percentageChange;

    if (profitOrLoss > 0) {
        alert(`Congratulations! Your closing price of $${initialPrice.toFixed(2)} grew to $${futurePrice.toFixed(2)} (${(percentageChange * 100).toFixed(2)}% gain). You made $${profitOrLoss.toFixed(2)} on your $${investedAmount.toFixed(2)} investment.`);
        addBalance(Math.round(profitOrLoss));
    } else {
        const loss = Math.abs(profitOrLoss);
        alert(`Oh no! Your closing price of $${initialPrice.toFixed(2)} fell to $${futurePrice.toFixed(2)} (${(percentageChange * 100).toFixed(2)}% loss). You lost $${loss.toFixed(2)} on your $${investedAmount.toFixed(2)} investment.`);
        subtractBalance(Math.round(loss));
    }

    resetGameState();
}

document.getElementById("reset").addEventListener("click", () => {
    tempBalance = actualBalance;
    tempWeeks = 0;
    document.getElementById("money").value = "";
    document.getElementById("weeks").value = "";
    displayBalance(tempBalance);
    displayWeeks(tempWeeks);
});

document.getElementById("money").addEventListener("change", function () {
    const amount = parseFloat(this.value);
    if (!isNaN(amount) && amount >= 1 && amount <= 1000) {
        if (tempBalance >= amount) {
            tempBalance -= amount;
            displayBalance(tempBalance);
        } else {
            alert("Not enough funds!");
            this.value = "";
        }
    }
});

document.getElementById("weeks").addEventListener("change", function () {
    const weeks = parseFloat(this.value);
    if (!isNaN(weeks) && weeks >= 1 && weeks <= 52) {
        tempWeeks = weeks;
        displayWeeks(tempWeeks);
    } else {
        alert("You can only invest up until a year (52 weeks)");
        this.value = "";
    }
});

document.querySelectorAll("#game-info button[value]").forEach(button => {
    button.addEventListener("click", () => {
        const amount = parseFloat(button.value);
        if (tempBalance >= amount) {
            tempBalance -= amount;
            displayBalance(tempBalance);
        } else {
            alert("Not enough funds for this investment!");
        }
    });
});

document.getElementById("submit").addEventListener("click", async () => {
    calculateStocks(tempBalance, tempWeeks);
});
