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
    const sunlightSlider = document.getElementById("sunlight")
    const sunlightValue = document.getElementById("sunlight-value")
  
    sunlightSlider.addEventListener("input", function () {
      const value = this.value
      let label
  
      if (value < 25) {
        label = "Faible"
      } else if (value < 50) {
        label = "Modéré"
      } else if (value < 75) {
        label = "Moyen"
      } else {
        label = "Élevé"
      }
  
      sunlightValue.textContent = label
    })
  
    const tempSlider = document.getElementById("avg-temperature")
    const tempValue = document.getElementById("avg-temperature-value")
  
    tempSlider.addEventListener("input", function () {
      tempValue.textContent = `${this.value}°C`
    })
  
    // Form submissions
    const waterForm = document.getElementById("water-prediction-form")
    const waterResult = document.getElementById("water-result")
    const waterAmount = document.getElementById("water-amount")
  
    waterForm.addEventListener("submit", (e) => {
      e.preventDefault()
  
      // In a real app, this would send the form data to your Flask API
      // For demo purposes, we'll just show a random result
      const formData = new FormData(waterForm)
  
      // Simulate API call
      setTimeout(() => {
        const amount = Math.floor(Math.random() * 500) + 100
        waterAmount.textContent = `${amount} ml par jour`
        waterResult.classList.remove("hidden")
  
        // Re-initialize Feather icons for the newly visible content
        feather.replace()
      }, 1000)
    })
  
    const cropForm = document.getElementById("crop-recommendation-form")
    const cropResult = document.getElementById("crop-result")
    const cropRecommendations = document.getElementById("crop-recommendations")
  
    cropForm.addEventListener("submit", (e) => {
      e.preventDefault()
  
      // In a real app, this would send the form data to your Flask API
      // For demo purposes, we'll just show sample results
      const formData = new FormData(cropForm)
  
      // Simulate API call
      setTimeout(() => {
        // Sample crop recommendations
        const crops = [
          {
            name: "Blé",
            confidence: 85,
            description: "Idéal pour vos conditions de sol avec une bonne efficacité hydrique.",
          },
          {
            name: "Orge",
            confidence: 72,
            description: "Bonne alternative avec des conditions de croissance similaires.",
          },
          {
            name: "Maïs",
            confidence: 65,
            description: "Option possible mais peut nécessiter plus d'eau.",
          },
        ]
  
        // Clear previous results
        cropRecommendations.innerHTML = ""
  
        // Add new results
        crops.forEach((crop) => {
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
  
        cropResult.classList.remove("hidden")
  
        // Re-initialize Feather icons for the newly visible content
        feather.replace()
      }, 1000)
    })
  
    // Handle form submission to Flask endpoints
    // In a real implementation, you would uncomment these and modify as needed
  
    /*
    waterForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      const formData = new FormData(waterForm);
      
      try {
        const response = await fetch('/predict_eau', {
          method: 'POST',
          body: formData
        });
        
        if (response.ok) {
          const data = await response.json();
          waterAmount.textContent = `${data.water_amount} ml par jour`;
          waterResult.classList.remove('hidden');
        } else {
          console.error('Error submitting form');
        }
      } catch (error) {
        console.error('Error:', error);
      }
      
      // Re-initialize Feather icons
      feather.replace();
    });
    
    cropForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      const formData = new FormData(cropForm);
      
      try {
        const response = await fetch('/predict_culture', {
          method: 'POST',
          body: formData
        });
        
        if (response.ok) {
          const data = await response.json();
          
          // Clear previous results
          cropRecommendations.innerHTML = '';
          
          // Add new results
          data.recommendations.forEach(crop => {
            const cropItem = document.createElement('div');
            cropItem.className = 'crop-item';
            
            cropItem.innerHTML = `
              <div class="crop-header">
                <p class="crop-name">${crop.name}</p>
                <span class="crop-confidence">${crop.confidence}% match</span>
              </div>
              <div class="crop-progress">
                <div class="crop-progress-value" style="width: ${crop.confidence}%"></div>
              </div>
              <p class="crop-description">${crop.description}</p>
            `;
            
            cropRecommendations.appendChild(cropItem);
          });
          
          cropResult.classList.remove('hidden');
        } else {
          console.error('Error submitting form');
        }
      } catch (error) {
        console.error('Error:', error);
      }
      
      // Re-initialize Feather icons
      feather.replace();
    });
    */
  })
  
  