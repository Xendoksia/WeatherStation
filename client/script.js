document.addEventListener("DOMContentLoaded", () => {
  const tableBody = document.querySelector("#data-table tbody");

  fetch("http://localhost:3000/api/recent")
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      data.forEach((item) => {
        const row = document.createElement("td");

        const valueCell = document.createElement("th");
        valueCell.textContent = `${item.Temperature.toFixed(0)} °C`;
        row.appendChild(valueCell);
        tableBody.appendChild(row);
      });
    })
    .catch((error) => console.error("Error fetching data:", error));
});

document.addEventListener("DOMContentLoaded", () => {
  const lbButton = document.querySelector(".lb");
  const rbButton = document.querySelector(".rb");
  const scrollableContainer = document.querySelector(".hlycontainer");

  const scrollAmount = 900;
  const scrollDuration = 500;

  function smoothScroll(scrollDistance, duration) {
    const start = scrollableContainer.scrollLeft;
    const startTime = performance.now();

    function scrollAnimation(currentTime) {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      scrollableContainer.scrollLeft = start + scrollDistance * progress;

      if (elapsedTime < duration) {
        window.requestAnimationFrame(scrollAnimation);
      }
    }

    window.requestAnimationFrame(scrollAnimation);
  }

  lbButton.addEventListener("click", () => {
    smoothScroll(-scrollAmount, scrollDuration);
  });

  rbButton.addEventListener("click", () => {
    smoothScroll(scrollAmount, scrollDuration);
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const pElement = document.querySelector("#date");

  fetch("http://localhost:3000/api/recent")
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      const DateTime = data[0].DateTime;
      const shortenedDateTime = DateTime.substring(0, 10);

      pElement.textContent = shortenedDateTime;
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
});

document.addEventListener("DOMContentLoaded", () => {
  const pElement = document.querySelector("#tem");

  fetch("http://localhost:3000/api/recent")
    .then((response) => response.json())
    .then((data) => {
      console.log(data);

      const Temperature = data[12].Temperature;

      pElement.textContent = `${Temperature.toFixed(0)} `;
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
});

document.addEventListener("DOMContentLoaded", () => {
  const pElement = document.querySelector("#hum");

  fetch("http://localhost:3000/api/recent")
    .then((response) => response.json())
    .then((data) => {
      console.log(data);

      const Humidity = data[12].Humidity;

      pElement.textContent = `${Humidity.toFixed(1)} `;
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
});

document.addEventListener("DOMContentLoaded", () => {
  const pElement = document.querySelector("#spe");

  fetch("http://localhost:3000/api/recent")
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      const WindSpeed = data[12].WindSpeed;

      pElement.textContent = `${WindSpeed.toFixed(1)} `;
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
});

document.addEventListener("DOMContentLoaded", function () {
  const ctx = document.getElementById("temperatureChart").getContext("2d");
  let currentChart = null;

  // Function to fetch data from API
  function fetchDataAndUpdateChart(type) {
    fetch("http://localhost:3000/api/recent") // Replace with your API endpoint
      .then((response) => response.json())
      .then((data) => {
        const labels = data.map((item) => item.DateTime.slice(-13));
        const temperatures = data.map((item) => item.Temperature);

        if (currentChart) {
          currentChart.destroy();
        }

        currentChart = new Chart(ctx, {
          type: type,
          data: {
            labels: labels,
            datasets: [
              {
                label: "Temperature",
                data: temperatures,
                backgroundColor: "rgba(75, 192, 192, 0.2)",
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 1,
              },
            ],
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                position: "top",
              },
              title: {
                display: true,
                text: "Temperature Chart",
              },
            },
          },
        });
      })
      .catch((error) => console.error("Error fetching data:", error));
  }

  // Add click event listeners to buttons
  const chartButtons = document.querySelectorAll(".chart-btn");
  chartButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const type = this.getAttribute("data-type");
      fetchDataAndUpdateChart(type);

      // Toggle active class for buttons
      chartButtons.forEach((btn) => btn.classList.remove("active"));
      this.classList.add("active");
    });
  });

  // Initially create default chart
  fetchDataAndUpdateChart("line");
  document
    .querySelector('.chart-btn[data-type="line"]')
    .classList.add("active");
});
