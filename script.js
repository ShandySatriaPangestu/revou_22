// Fungsi untuk mengambil data dari JSON dan menampilkan chart
function fetchDataAndShowChart() {
  fetch('team22.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch JSON file');
      }
      return response.json();
    })
    .then(data => {
      const monthlyData = processData(data);
      const chartData = prepareChartData(monthlyData);
      renderChart(chartData);
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

// Fungsi untuk memproses data bulanan
function processData(data) {
  const monthlyData = {};
  data.forEach(entry => {
    const month = entry.date.split('-')[1];
    if (!monthlyData[month]) {
      monthlyData[month] = {
        revenue: 0,
        totalSales: 0,
        totalPizza: 0
      };
    }
    const revenue = parseFloat(entry.price) * parseInt(entry.quantity);
    monthlyData[month].revenue += revenue;
    monthlyData[month].totalSales += parseInt(entry.order_id) * parseInt(entry.quantity);
    monthlyData[month].totalPizza += 1;
  });
  return monthlyData;
}

// Fungsi untuk menyiapkan data chart dari data bulanan
function prepareChartData(monthlyData) {
  const sortedMonths = Object.keys(monthlyData).sort((a, b) => parseInt(a) - parseInt(b));
  const revenueValues = sortedMonths.map(month => monthlyData[month].revenue);
  const totalSalesValues = sortedMonths.map(month => monthlyData[month].totalSales);
  const totalPizzaValues = sortedMonths.map(month => monthlyData[month].totalPizza);
  const labels = sortedMonths;
  return {
    labels: labels,
    datasets: [
      {
        label: 'Total Revenue',
        data: revenueValues,
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'white',
        borderWidth: 1
      },
      {
        label: 'Total Sales',
        data: totalSalesValues,
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'white',
        borderWidth: 1
      },
      {
        label: 'Total Pizza',
        data: totalPizzaValues,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'white',
        borderWidth: 1
      }
    ]
  };
}

// Fungsi untuk menampilkan chart pada canvas
function renderChart(chartData) {
  var ctx = document.getElementById('Chart1').getContext('2d');
  var Chart1 = new Chart(ctx, {
    type: 'line',
    data: chartData,
    options: {
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 2000 // Menetapkan jarak per 1000 pada sumbu y
          }
        }
      }
    }
  });
}

// Panggil fungsi untuk menampilkan chart saat dokumen sudah dimuat
document.addEventListener('DOMContentLoaded', fetchDataAndShowChart);

