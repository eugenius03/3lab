async function getData() {
    const url = "https://chnu-student-interview-preparation.netlify.app/.netlify/functions/listItems?skip=29&take=1";
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const json = await response.json();
        return json;
    } catch (error) {
        console.error(error.message);
    }
    
}

async function loadNews() {
  let data = await getData();
  data = data[0]["news"];
  const container = document.getElementById("news-container");
  container.innerHTML = "";

  data.forEach(item => {
      const card = `
          <div class="col">
              <div class="card shadow-sm h-100">
                  <img src="${item.src}" alt="News image" width="100%" height="225">
                  <div class="card-body">
                      <p class="card-text">${item.description}</p>
                      <div class="d-flex justify-content-between align-items-center">
                          <div class="btn-group"></div>
                          <small class="text-body-secondary">${item.date}</small>
                      </div>
                  </div>
              </div>
          </div>
      `;
      container.innerHTML += card;
  });
}
  document.addEventListener("DOMContentLoaded", loadNews);