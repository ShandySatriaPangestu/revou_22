let chartData = {};
let currentChart;
let data; // Definisi variabel data
let pizzaNameChart, sizeChart, categoryChart; // Variabel untuk menyimpan chart Pizza Name, Size, dan Category

// Fungsi untuk mengambil data dari JSON dan menampilkan chart
function fetchDataAndShowChart() {
  return fetch('team22.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch JSON file');
      }
      return response.json();
    })
    .then(dataResponse => {
      data = dataResponse; // Menyimpan data yang diambil dari JSON
      const monthlyData = processData(data);
      chartData = prepareChartData(monthlyData);
      renderChart('Chart1', chartData.revenueData);
      displayTotals(monthlyData);
      processDataAndRenderCharts(data);
      return data; // Mengembalikan data untuk diproses selanjutnya
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
  document.getElementById('totalRevenue').innerText = `${Math.round(monthlyData.totalRevenue)}`;
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

// Fungsi untuk membuat chart Pizza Name
function renderPizzaNameChart(canvasId, data) {
  const ctx = document.getElementById(canvasId).getContext('2d');
  if (pizzaNameChart) {
    pizzaNameChart.destroy();
  }
  pizzaNameChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: data.labels,
      datasets: [{
        label: 'Pizza Name',
        data: data.values,
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
        
      }]
    }
  });
}

// Fungsi untuk membuat chart Size
function renderSizeChart(canvasId, data) {
  const ctx = document.getElementById(canvasId).getContext('2d');
  if (sizeChart) {
    sizeChart.destroy();
  }
  sizeChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: data.labels,
      datasets: [{
        label: 'Size',
        data: data.values,
        backgroundColor: 'rgba(255, 206, 86, 0.2)',
        borderColor: 'rgba(255, 206, 86, 1)',
        borderWidth: 1
      }]
    }
  });
}

// Fungsi untuk membuat chart Category
function renderCategoryChart(canvasId, data) {
  const ctx = document.getElementById(canvasId).getContext('2d');
  if (categoryChart) {
    categoryChart.destroy();
  }
  categoryChart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: data.labels,
      datasets: [{
        label: 'Category',
        data: data.values,
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      }]
    }
  });
}

// Memproses data untuk chart Pizza Name
function processPizzaNameData(data) {
  const pizzaNameData = {};
  data.forEach(entry => {
    const pizzaName = entry.pizza_name;
    if (!pizzaNameData[pizzaName]) {
      pizzaNameData[pizzaName] = 0;
    }
    pizzaNameData[pizzaName]++;
  });
  return {
    labels: Object.keys(pizzaNameData),
    values: Object.values(pizzaNameData)
  };
}

// Memproses data untuk chart Size
function processSizeData(data) {
  const sizeData = {};
  data.forEach(entry => {
    const size = entry.size;
    if (!sizeData[size]) {
      sizeData[size] = 0;
    }
    sizeData[size]++;
  });
  return {
    labels: Object.keys(sizeData),
    values: Object.values(sizeData)
  };
}

// Memproses data untuk chart Category
function processCategoryData(data) {
  const categoryData = {};
  data.forEach(entry => {
    const category = entry.category;
    if (!categoryData[category]) {
      categoryData[category] = 0;
    }
    categoryData[category]++;
  });
  return {
    labels: Object.keys(categoryData),
    values: Object.values(categoryData)
  };
}

// Memproses data JSON setelah didapatkan
function processDataAndRenderCharts(data) {
  const pizzaNameData = processPizzaNameData(data);
  const sizeData = processSizeData(data);
  const categoryData = processCategoryData(data);

  renderPizzaNameChart('chartpizzaname', pizzaNameData);
  renderSizeChart('chartsize', sizeData);
  renderCategoryChart('chartcategory', categoryData);
}

// Fungsi untuk menerapkan filter bulan
function applyFilters() {
  const selectedMonths = [];
  document.querySelectorAll('input[name="month"]:checked').forEach(checkbox => {
    selectedMonths.push(checkbox.value);
  });

  // Filter data berdasarkan bulan yang dipilih
  const filteredData = data.filter(entry => {
    const month = entry.date.split('-')[1];
    return selectedMonths.includes(month);
  });

  const monthlyData = processData(filteredData);
  chartData = prepareChartData(monthlyData);
  renderChart('Chart1', chartData.revenueData);
  displayTotals(monthlyData);

  processDataAndRenderCharts(filteredData);
}

// Panggil fungsi untuk memproses data dan membuat chart setelah dokumen dimuat
document.addEventListener('DOMContentLoaded', () => {
  fetchDataAndShowChart().then(data => {
    processDataAndRenderCharts(data);
  });
});

// Tambahkan event listener untuk tombol filter
document.getElementById('applyFilter').addEventListener('click', applyFilters);
