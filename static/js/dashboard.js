document.addEventListener("DOMContentLoaded", () => {
    // Initialize Feather icons
    feather.replace()
  
    // Theme toggle
    const themeToggle = document.getElementById("theme-toggle")
    const body = document.body
  
    // Check for saved theme preference or use system preference
    const savedTheme = localStorage.getItem("theme")
    if (savedTheme === "dark") {
      body.classList.add("dark-theme")
    } else if (savedTheme === "light") {
      body.classList.add("light-theme")
    } else {
      // Check system preference
      if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
        body.classList.add("dark-theme")
      } else {
        body.classList.add("light-theme")
      }
    }
  
    themeToggle.addEventListener("click", () => {
      if (body.classList.contains("dark-theme")) {
        body.classList.remove("dark-theme")
        body.classList.add("light-theme")
        localStorage.setItem("theme", "light")
      } else {
        body.classList.remove("light-theme")
        body.classList.add("dark-theme")
        localStorage.setItem("theme", "dark")
      }
    })
  
    // Sidebar toggle
    const sidebarToggle = document.getElementById("sidebar-toggle")
    const sidebar = document.getElementById("sidebar")
    const mainContent = document.querySelector(".main-content")
  
    sidebarToggle.addEventListener("click", () => {
      sidebar.classList.toggle("open")
      sidebar.classList.toggle("collapsed")
      mainContent.classList.toggle("expanded")
    })
  
    // Handle sliders
    const tempSlider = document.getElementById("avg-temperature")
    const tempValue = document.getElementById("avg-temperature-value")
  
    tempSlider.addEventListener("input", function () {
      tempValue.textContent = `${this.value}°C`
    })
  
    // Form submissions with real API calls
    const waterForm = document.getElementById("water-prediction-form")
    const waterResult = document.getElementById("water-result")
    const waterAmount = document.getElementById("water-amount")
  
    waterForm.addEventListener("submit", async (e) => {
      e.preventDefault()
  
      const formData = new FormData(waterForm)
  
      try {
        // Afficher un indicateur de chargement
        waterAmount.textContent = "Calcul en cours..."
        waterResult.classList.remove("hidden")
  
        const response = await fetch("/predict_eau", {
          method: "POST",
          body: formData,
        })
  
        if (response.ok) {
          const data = await response.json()
  
          if (data.error) {
            waterAmount.textContent = `Erreur: ${data.error}`
          } else {
            waterAmount.textContent = data.water_amount
          }
        } else {
          waterAmount.textContent = "Erreur lors de la prédiction"
        }
      } catch (error) {
        console.error("Error:", error)
        waterAmount.textContent = "Erreur de connexion"
      }
  
      // Re-initialize Feather icons
      feather.replace()
    })
  
    const cropForm = document.getElementById("crop-recommendation-form")
    const cropResult = document.getElementById("crop-result")
    const cropRecommendations = document.getElementById("crop-recommendations")
  
    cropForm.addEventListener("submit", async (e) => {
      e.preventDefault()
  
      const formData = new FormData(cropForm)
  
      try {
        // Afficher un indicateur de chargement
        cropRecommendations.innerHTML = "<p>Calcul des recommandations en cours...</p>"
        cropResult.classList.remove("hidden")
  
        const response = await fetch("/predict_culture", {
          method: "POST",
          body: formData,
        })
  
        if (response.ok) {
          const data = await response.json()
  
          if (data.error) {
            cropRecommendations.innerHTML = `<p>Erreur: ${data.error}</p>`
          } else {
            // Clear previous results
            cropRecommendations.innerHTML = ""
  
            // Add new results
            data.recommendations.forEach((crop) => {
              const cropItem = document.createElement("div")
              cropItem.className = "crop-item"
  
              cropItem.innerHTML = `
                <div class="crop-header">
                  <p class="crop-name">${crop.name}</p>
                  <span class="crop-confidence">${crop.confidence}% match</span>
                </div>
                <div class="crop-progress">
                  <div class="crop-progress-value" style="width: ${crop.confidence}%"></div>
                </div>
                <p class="crop-description">${crop.description}</p>
              `
  
              cropRecommendations.appendChild(cropItem)
            })
          }
        } else {
          cropRecommendations.innerHTML = "<p>Erreur lors de la prédiction</p>"
        }
      } catch (error) {
        console.error("Error:", error)
        cropRecommendations.innerHTML = "<p>Erreur de connexion</p>"
      }
  
      // Re-initialize Feather icons
      feather.replace()
    })
  
    // Pré-remplir les champs de température min/max en fonction de la température
    const temperatureInput = document.getElementById("temperature")
    const tempMinInput = document.getElementById("temp_min")
    const tempMaxInput = document.getElementById("temp_max")
  
    temperatureInput.addEventListener("input", function () {
      const temp = Number.parseFloat(this.value) || 0
      tempMinInput.value = (temp - 5).toFixed(1)
      tempMaxInput.value = (temp + 5).toFixed(1)
    })
  })
  
  