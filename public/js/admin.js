<script>
  let charts = [];

  function drawCharts() {
    // --- User Chart ---
    const userCtx = document.getElementById('userChart').getContext('2d');
    const userData = {
      labels: [ <% chartData.forEach(function(item, index) { %> '<%= item.day %>'<% if (index < chartData.length-1) { %>, <% } %> <% }); %> ],
      datasets: [{
        label: 'Posts',
        data: [ <% chartData.forEach(function(item, index) { %> <%= item.total %><% if (index < chartData.length-1) { %>, <% } %> <% }); %> ],
        backgroundColor: '#007bff'
      }]
    };
    const userChart = new Chart(userCtx, { type: 'bar', data: userData, options: { responsive: true } });
    charts.push(userChart);

    // --- Risk Level Chart ---
    const riskCtx = document.getElementById('riskLevelChart').getContext('2d');
    const riskData = {
      labels: [ <% riskLevelData.forEach(function(item, index) { %> '<%= item.risk_level %>'<% if (index < riskLevelData.length-1) { %>, <% } %> <% }); %> ],
      datasets: [{
        data: [ <% riskLevelData.forEach(function(item, index) { %> <%= item.total %><% if (index < riskLevelData.length-1) { %>, <% } %> <% }); %> ],
        backgroundColor: ['#007bff', '#28a745', '#ffc107', '#dc3545']
      }]
    };
    const riskChart = new Chart(riskCtx, { type: 'doughnut', data: riskData, options: { responsive: true } });
    charts.push(riskChart);

    // --- Checklist Chart ---
    const checklistCtx = document.getElementById('checklistChart').getContext('2d');
    const checklistData = {
      labels: ['Near River', 'Near Fault', 'Has Emergency Kit', 'Has Evacuation Plan'],
      datasets: [{
        label: 'Completed',
        data: [<%= checklistData.near_river %>, <%= checklistData.near_fault %>, <%= checklistData.has_emergency_kit %>, <%= checklistData.has_evacuation_plan %>],
        backgroundColor: '#17a2b8'
      }]
    };
    const checklistChart = new Chart(checklistCtx, { type: 'bar', data: checklistData, options: { responsive: true } });
    charts.push(checklistChart);

    // --- Trend Chart ---
    const trendCtx = document.getElementById('trendChart').getContext('2d');
    const trendData = {
      labels: [ <% trendData.forEach(function(item, index) { %> '<%= item.date %>'<% if (index < trendData.length-1) { %>, <% } %> <% }); %> ],
      datasets: [{
        label: 'Avg Risk Score',
        data: [ <% trendData.forEach(function(item, index) { %> <%= item.avg_score %><% if (index < trendData.length-1) { %>, <% } %> <% }); %> ],
        borderColor: '#007bff',
        fill: false
      }]
    };
    const trendChart = new Chart(trendCtx, { type: 'line', data: trendData, options: { responsive: true } });
    charts.push(trendChart);

    // --- Hazards Chart ---
    const hazardsCtx = document.getElementById('hazardsChart').getContext('2d');
    const hazardsData = {
      labels: ['Near River', 'Near Fault'],
      datasets: [{
        label: 'Users',
        data: [<%= hazardsData.near_river %>, <%= hazardsData.near_fault %>],
        backgroundColor: ['#ffc107', '#dc3545']
      }]
    };
    const hazardsChart = new Chart(hazardsCtx, { type: 'bar', data: hazardsData, options: { responsive: true } });
    charts.push(hazardsChart);
  }

  // Call when DOM is ready
  window.onload = drawCharts;
</script>
