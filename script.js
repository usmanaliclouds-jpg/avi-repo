const ctx1 = document.getElementById('chart1').getContext('2d');
const ctx2 = document.getElementById('chart2').getContext('2d');

const chart1 = new Chart(ctx1, {
    type: 'line',
    data: {
        labels: ['January', 'February', 'March', 'April', 'May'],
        datasets: [{
            label: 'Dataset 1',
            data: [10, 20, 30, 40, 50],
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    }
});

const chart2 = new Chart(ctx2, {
    type: 'bar',
    data: {
        labels: ['January', 'February', 'March', 'April', 'May'],
        datasets: [{
            label: 'Dataset 2',
            data: [10, 20, 30, 40, 50],
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    }
});

const filterSelect = document.getElementById('filter-select');
const startDate = document.getElementById('start-date');
const endDate = document.getElementById('end-date');

filterSelect.addEventListener('change', (e) => {
    console.log(`Filter changed to: ${e.target.value}`);
});

startDate.addEventListener('change', (e) => {
    console.log(`Start date changed to: ${e.target.value}`);
});

endDate.addEventListener('change', (e) => {
    console.log(`End date changed to: ${e.target.value}`);
});