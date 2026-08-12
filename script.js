const revenueElement = document.getElementById('revenue');
const activeUsersElement = document.getElementById('active-users');
const conversionRateElement = document.getElementById('conversion-rate');
const systemUptimeElement = document.getElementById('system-uptime');
const chartCanvas = document.getElementById('chart');
const filterSelect = document.getElementById('filter-select');
const dataTable = document.getElementById('data-table');
const tableBody = document.getElementById('table-body');
const prevPageButton = document.getElementById('prev-page');
const nextPageButton = document.getElementById('next-page');

let currentPage = 1;
let data = [];

// Initialize chart
const chart = new Chart(chartCanvas, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Data',
            data: [],
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

// Fetch data from API
async function fetchData() {
    const response = await fetch('/api/data');
    const jsonData = await response.json();
    data = jsonData;
    updateMetricCards();
    updateChartData();
    updateDataTable();
}

// Update metric cards
function updateMetricCards() {
    revenueElement.textContent = `$${data.revenue}`;
    activeUsersElement.textContent = data.activeUsers;
    conversionRateElement.textContent = `${data.conversionRate}%`;
    systemUptimeElement.textContent = `${data.systemUptime}%`;
}

// Update chart data
function updateChartData() {
    chart.data.labels = data.chartLabels;
    chart.data.datasets[0].data = data.chartData;
    chart.update();
}

// Update data table
function updateDataTable() {
    tableBody.innerHTML = '';
    data.tableData.forEach((row) => {
        const rowElement = document.createElement('tr');
        rowElement.innerHTML = `
            <td>${row.id}</td>
            <td>${row.name}</td>
            <td>${row.email}</td>
        `;
        tableBody.appendChild(rowElement);
    });
}

// Handle filter select change
filterSelect.addEventListener('change', async (e) => {
    const filterValue = e.target.value;
    const response = await fetch(`/api/data?filter=${filterValue}`);
    const jsonData = await response.json();
    data = jsonData;
    updateMetricCards();
    updateChartData();
    updateDataTable();
});

// Handle pagination button clicks
prevPageButton.addEventListener('click', () => {
    currentPage--;
    updateDataTable();
});

nextPageButton.addEventListener('click', () => {
    currentPage++;
    updateDataTable();
});

// Initialize data
fetchData();