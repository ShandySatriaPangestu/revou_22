let chartData = {};
let currentChart;

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
      chartData = prepareChartData(monthlyData);
      renderChart('Chart1', chartData.revenueData);
      displayTotals(monthlyData);
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

// Fungsi untuk memproses data bulanan dan menghitung total keseluruhan
function processData(data) {
  const monthlyData = {};
  let totalRevenue = 0;
  let totalSales = 0;
  let totalOrder = 0;

  data.forEach(entry => {
    const month = entry.date.split('-')[1];
    if (!monthlyData[month]) {
      monthlyData[month] = {
        revenue: 0,
        totalSales: 0,
        totalOrder: 0
      };
    }
    const revenue = parseFloat(entry.price) * parseInt(entry.quantity);
    monthlyData[month].revenue += revenue;
    monthlyData[month].totalSales += parseInt(entry.quantity); // Menggunakan kuantitas untuk total sales
    monthlyData[month].totalOrder += 1;

    // Hitung total keseluruhan
    totalRevenue += revenue;
    totalSales += parseInt(entry.quantity); // Menggunakan kuantitas untuk total sales
    totalOrder += 1;
  });

  // Menyimpan total keseluruhan di objek monthlyData
  monthlyData.totalRevenue = totalRevenue;
  monthlyData.totalSales = totalSales;
  monthlyData.totalOrder = totalOrder;

  return monthlyData;
}

// Fungsi untuk menampilkan total keseluruhan ke elemen HTML
function displayTotals(monthlyData) {
  document.getElementById('totalRevenue').innerText = `${monthlyData.totalRevenue}`;
  document.getElementById('totalSales').innerText = `${monthlyData.totalSales}`;
  document.getElementById('totalOrder').innerText = `${monthlyData.totalOrder}`;
}

// Fungsi untuk menyiapkan data chart dari data bulanan
function prepareChartData(monthlyData) {
  const sortedMonths = Object.keys(monthlyData).filter(month => month !== 'totalRevenue' && month !== 'totalSales' && month !== 'totalOrder').sort((a, b) => parseInt(a) - parseInt(b));
  const revenueValues = sortedMonths.map(month => monthlyData[month].revenue);
  const totalSalesValues = sortedMonths.map(month => monthlyData[month].totalSales);
  const totalOrderValues = sortedMonths.map(month => monthlyData[month].totalOrder);
  const labels = sortedMonths;
  return {
    revenueData: {
      labels: labels,
      datasets: [{
        label: 'Total Revenue',
        data: revenueValues,
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'white',
        borderWidth: 1,
        
      }]
    },
    salesData: {
      labels: labels,
      datasets: [{
        label: 'Total Sales',
        data: totalSalesValues,
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'white',
        borderWidth: 1
      }]
    },
    orderData: {
      labels: labels,
      datasets: [{
        label: 'Total Order',
        data: totalOrderValues,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'white',
        borderWidth: 1
      }]
    }
  };
}

// Fungsi untuk menampilkan chart pada canvas
function renderChart(canvasId, chartData) {
  const ctx = document.getElementById(canvasId).getContext('2d');
  if (currentChart) {
    currentChart.destroy();
  }
  currentChart = new Chart(ctx, {
    type: 'bar',
    data: chartData,
    options: {
      scales: {
        x: {
          ticks: {
            color: 'white' // Mengatur warna teks di sumbu x menjadi putih
          }
        },
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1000,
            color: 'white'
          }
        }
      }
    }
  });
}

// Fungsi untuk menampilkan chart sesuai dengan container yang diklik
function showChart(chartType) {
  renderChart('Chart1', chartData[chartType]);
}

// Panggil fungsi untuk menampilkan chart saat dokumen sudah dimuat
document.addEventListener('DOMContentLoaded', fetchDataAndShowChart);
