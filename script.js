// Admin credentials
const ADMIN_PASSWORD = '2333';

// Global variables
let model = null;
let analysisChart = null;
let statsChart = null;
let conditionChart = null;
let currentAnalysis = null;

const uploadInput = document.getElementById('imageInput');
const uploadArea = document.getElementById('uploadArea');
const resultsContent = document.getElementById('resultsContent');
const loadingSpinner = document.getElementById('loadingSpinner');
const previewContainer = document.getElementById('previewContainer');
const previewImage = document.getElementById('previewImage');
const submitButton = document.getElementById('submitButton');

// Car components data
const carComponentsData = {
    engine: {
        name: 'Engine',
        symptoms: ['Overheating', 'Unusual noises', 'Reduced power', 'Check engine light'],
        maintenance: ['Change oil every 5,000-7,500 miles', 'Replace air filter annually', 'Check coolant levels monthly', 'Inspect spark plugs']
    },
    tires: {
        name: 'Tires',
        symptoms: ['Uneven wear', 'Low pressure', 'Cracks or bulges', 'Vibration while driving'],
        maintenance: ['Rotate tires every 6,000-8,000 miles', 'Check pressure monthly', 'Replace when tread depth reaches 4/32 inch']
    },
    brakes: {
        name: 'Brakes',
        symptoms: ['Squealing sounds', 'Soft brake pedal', 'Reduced stopping power', 'Brake warning light'],
        maintenance: ['Replace brake pads every 25,000-70,000 miles', 'Flush brake fluid every 2 years', 'Inspect rotors for wear']
    },
    battery: {
        name: 'Battery',
        symptoms: ['Slow engine cranking', 'Dim lights', 'No start condition', 'Corrosion on terminals'],
        maintenance: ['Clean battery terminals monthly', 'Replace battery every 3-5 years', 'Check voltage regularly']
    },
    suspension: {
        name: 'Suspension',
        symptoms: ['Bouncy ride', 'Uneven height', 'Clunking noises', 'Poor handling'],
        maintenance: ['Replace shock absorbers every 50,000 miles', 'Inspect springs for cracks', 'Check alignment annually']
    },
    transmission: {
        name: 'Transmission',
        symptoms: ['Hesitation during shift', 'Slipping gears', 'Burning smell', 'Fluid leaks'],
        maintenance: ['Change transmission fluid every 30,000-60,000 miles', 'Use correct fluid type', 'Have transmission serviced regularly']
    }
};

// Initialize model
async function initializeModel() {
    try {
        console.log('Loading MobileNet model...');
        model = await mobilenet.load();
        console.log('Model loaded successfully!');
    } catch (error) {
        console.error('Error loading model:', error);
        alert('Error loading AI model. Please refresh the page.');
    }
}

// File upload handlers
uploadInput.addEventListener('change', handleFileSelect);
uploadArea.addEventListener('click', () => uploadInput.click());
uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('dragover');
});
uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('dragover');
});
uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        uploadInput.files = files;
        handleFileSelect();
    }
});

function handleFileSelect() {
    const file = uploadInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            previewImage.src = e.target.result;
            previewContainer.classList.remove('hidden');
            analyzeImage(e.target.result);
        };
        reader.readAsDataURL(file);
    }
}

// Analyze image
async function analyzeImage(imageSrc) {
    if (!model) {
        alert('AI model not loaded. Please wait and try again.');
        return;
    }

    loadingSpinner.classList.remove('hidden');
    resultsContent.classList.add('hidden');
    submitButton.style.display = 'none';
    
    try {
        const img = new Image();
        img.onload = async () => {
            const predictions = await model.classify(img);
            displayResults(predictions);
            loadingSpinner.classList.add('hidden');
            submitButton.style.display = 'block';
        };
        img.src = imageSrc;
    } catch (error) {
        console.error('Error analyzing image:', error);
        loadingSpinner.classList.add('hidden');
        alert('Error analyzing image. Please try again.');
    }
}

// Display results
function displayResults(predictions) {
    resultsContent.classList.remove('hidden');
    
    const topPrediction = predictions[0];
    const confidence = (topPrediction.probability * 100).toFixed(2);
    
    const detectedComponent = detectCarComponent(topPrediction.className);
    
    document.getElementById('detectedComponent').textContent = detectedComponent.name || topPrediction.className;
    
    const condition = assessCondition(confidence);
    const statusBadge = document.getElementById('conditionStatus');
    statusBadge.textContent = condition;
    statusBadge.className = `status-badge ${condition.toLowerCase()}`;
    
    document.getElementById('confidenceBar').style.width = confidence + '%';
    document.getElementById('confidenceText').textContent = confidence + '%';
    
    // Store current analysis
    currentAnalysis = {
        component: detectedComponent.name,
        confidence: confidence,
        condition: condition,
        predictions: predictions,
        timestamp: new Date().toLocaleString()
    };
    
    displayChart(predictions);
    displayRecommendations(detectedComponent);
}

// Detect car component
function detectCarComponent(prediction) {
    const predictionLower = prediction.toLowerCase();
    
    for (let [key, value] of Object.entries(carComponentsData)) {
        if (predictionLower.includes(key) || predictionLower.includes(value.name.toLowerCase())) {
            return value;
        }
    }
    
    if (predictionLower.includes('wheel') || predictionLower.includes('tire')) return carComponentsData.tires;
    if (predictionLower.includes('engine')) return carComponentsData.engine;
    if (predictionLower.includes('brake')) return carComponentsData.brakes;
    if (predictionLower.includes('battery')) return carComponentsData.battery;
    if (predictionLower.includes('suspension') || predictionLower.includes('shock')) return carComponentsData.suspension;
    if (predictionLower.includes('transmission') || predictionLower.includes('gear')) return carComponentsData.transmission;
    
    return { name: 'Vehicle Component', symptoms: [], maintenance: [] };
}

// Assess condition
function assessCondition(confidence) {
    const conf = parseFloat(confidence);
    if (conf >= 75) return 'GOOD';
    if (conf >= 50) return 'FAIR';
    return 'POOR';
}

// Display chart
function displayChart(predictions) {
    const chartSection = document.getElementById('chartSection');
    chartSection.classList.remove('hidden');
    
    const topPredictions = predictions.slice(0, 5);
    const labels = topPredictions.map(p => p.className.substring(0, 20));
    const data = topPredictions.map(p => (p.probability * 100).toFixed(2));
    
    const ctx = document.getElementById('analysisChart').getContext('2d');
    
    if (analysisChart) {
        analysisChart.destroy();
    }
    
    analysisChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: [
                    '#FF6B35',
                    '#004E89',
                    '#1AC8ED',
                    '#2ECC71',
                    '#F39C12'
                ],
                borderColor: '#fff',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { font: { size: 12 }, padding: 15 }
                }
            }
        }
    });
}

// Display recommendations
function displayRecommendations(component) {
    const recommendationsSection = document.getElementById('recommendationsSection');
    const recommendationsList = document.getElementById('recommendationsList');
    
    let html = '';
    
    if (component.symptoms && component.symptoms.length > 0) {
        html += '<h4 style="margin: 20px 0 15px 0; color: #FF6B35;">⚠️ Common Symptoms to Watch For:</h4>';
        html += '<div class="recommendation-list">';
        component.symptoms.forEach(symptom => {
            html += `
                <div class="recommendation-item">
                    <div>• ${symptom}</div>
                </div>
            `;
        });
        html += '</div>';
    }
    
    if (component.maintenance && component.maintenance.length > 0) {
        html += '<h4 style="margin: 20px 0 15px 0; color: #004E89;">🔧 Recommended Maintenance:</h4>';
        html += '<div class="recommendation-list">';
        component.maintenance.forEach(maintenance => {
            html += `
                <div class="recommendation-item">
                    <div>✓ ${maintenance}</div>
                </div>
            `;
        });
        html += '</div>';
    }
    
    recommendationsList.innerHTML = html;
    recommendationsSection.classList.remove('hidden');
}

// Submit analysis
function submitAnalysis() {
    const userName = document.getElementById('userName').value.trim();
    const userEmail = document.getElementById('userEmail').value.trim();
    const userPhone = document.getElementById('userPhone').value.trim();
    const carMake = document.getElementById('carMake').value.trim();
    const carModel = document.getElementById('carModel').value.trim();
    const carYear = document.getElementById('carYear').value.trim();
    const carMileage = document.getElementById('carMileage').value.trim();

    if (!userName || !userEmail || !carMake || !carModel || !carYear) {
        alert('Please fill in all required fields!');
        return;
    }

    const analysisData = {
        user: {
            name: userName,
            email: userEmail,
            phone: userPhone
        },
        car: {
            make: carMake,
            model: carModel,
            year: carYear,
            mileage: carMileage
        },
        analysis: currentAnalysis,
        image: previewImage.src,
        submittedAt: new Date().toISOString()
    };

    // Save to localStorage
    let allAnalyses = JSON.parse(localStorage.getItem('carAnalyses')) || [];
    allAnalyses.push(analysisData);
    localStorage.setItem('carAnalyses', JSON.stringify(allAnalyses));

    alert('✅ Analysis submitted successfully!');
    
    // Reset form
    document.getElementById('userName').value = '';
    document.getElementById('userEmail').value = '';
    document.getElementById('userPhone').value = '';
    document.getElementById('carMake').value = '';
    document.getElementById('carModel').value = '';
    document.getElementById('carYear').value = '';
    document.getElementById('carMileage').value = '';
    uploadInput.value = '';
    previewContainer.classList.add('hidden');
    resultsContent.classList.add('hidden');
    document.getElementById('chartSection').classList.add('hidden');
    document.getElementById('recommendationsSection').classList.add('hidden');
    submitButton.style.display = 'none';
}

// Admin functions
function openAdminLogin() {
    document.getElementById('adminLoginModal').classList.remove('hidden');
}

function closeAdminLogin() {
    document.getElementById('adminLoginModal').classList.add('hidden');
    document.getElementById('loginError').textContent = '';
    document.getElementById('adminPassword').value = '';
}

function adminLogin() {
    const password = document.getElementById('adminPassword').value;
    const errorDiv = document.getElementById('loginError');
    
    if (password === ADMIN_PASSWORD) {
        closeAdminLogin();
        loadAdminDashboard();
        document.getElementById('adminDashboard').classList.remove('hidden');
    } else {
        errorDiv.textContent = '❌ Incorrect password!';
    }
}

function closeAdminDashboard() {
    document.getElementById('adminDashboard').classList.add('hidden');
}

function loadAdminDashboard() {
    const analyses = JSON.parse(localStorage.getItem('carAnalyses')) || [];
    
    // Calculate stats
    const totalAnalyses = analyses.length;
    const uniqueUsers = new Set(analyses.map(a => a.user.email)).size;
    const goodConditions = analyses.filter(a => a.analysis.condition === 'GOOD').length;
    const avgConfidence = analyses.length > 0 
        ? (analyses.reduce((sum, a) => sum + parseFloat(a.analysis.confidence), 0) / analyses.length).toFixed(2)
        : 0;

    document.getElementById('totalAnalyses').textContent = totalAnalyses;
    document.getElementById('uniqueUsers').textContent = uniqueUsers;
    document.getElementById('goodCondition').textContent = (goodConditions / totalAnalyses * 100 || 0).toFixed(0) + '%';
    document.getElementById('avgConfidence').textContent = avgConfidence + '%';
    
    // Populate users list
    const usersList = document.getElementById('usersList');
    let usersHtml = '';
    analyses.forEach(analysis => {
        usersHtml += `
            <div class="user-item">
                <h4>${analysis.user.name}</h4>
                <p>📧 ${analysis.user.email}</p>
                <p>📱 ${analysis.user.phone}</p>
                <p>🚗 ${analysis.car.year} ${analysis.car.make} ${analysis.car.model}</p>
                <p>📊 Component: ${analysis.analysis.component}</p>
                <p>📈 Confidence: ${analysis.analysis.confidence}%</p>
                <p>⚙️ Condition: ${analysis.analysis.condition}</p>
                <p>📅 ${analysis.submittedAt}</p>
            </div>
        `;
    });
    usersList.innerHTML = usersHtml || '<p>No analyses yet</p>';
    
    // Create stats charts
    createStatsCharts(analyses);
}

function switchTab(tabName) {
    // Hide all tabs
    document.getElementById('overviewTab').classList.add('hidden');
    document.getElementById('usersTab').classList.add('hidden');
    document.getElementById('statsTab').classList.add('hidden');
    
    // Remove active class from all buttons
    document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
    
    // Show selected tab
    document.getElementById(tabName + 'Tab').classList.remove('hidden');
    event.target.classList.add('active');
}

function createStatsCharts(analyses) {
    // Condition distribution chart
    const conditions = { GOOD: 0, FAIR: 0, POOR: 0 };
    analyses.forEach(a => {
        conditions[a.analysis.condition]++;
    });
    
    const ctx1 = document.getElementById('conditionChart').getContext('2d');
    if (conditionChart) conditionChart.destroy();
    
    conditionChart = new Chart(ctx1, {
        type: 'bar',
        data: {
            labels: ['GOOD', 'FAIR', 'POOR'],
            datasets: [{
                label: 'Vehicle Conditions',
                data: [conditions.GOOD, conditions.FAIR, conditions.POOR],
                backgroundColor: ['#2ECC71', '#F39C12', '#E74C3C']
            }]
        },
        options: { responsive: true }
    });
    
    // Component distribution chart
    const components = {};
    analyses.forEach(a => {
        components[a.analysis.component] = (components[a.analysis.component] || 0) + 1;
    });
    
    const ctx2 = document.getElementById('statsChart').getContext('2d');
    if (statsChart) statsChart.destroy();
    
    statsChart = new Chart(ctx2, {
        type: 'pie',
        data: {
            labels: Object.keys(components),
            datasets: [{
                data: Object.values(components),
                backgroundColor: ['#FF6B35', '#004E89', '#1AC8ED', '#2ECC71', '#F39C12', '#E74C3C']
            }]
        },
        options: { responsive: true }
    });
}

function searchUsers() {
    const searchTerm = document.getElementById('searchUser').value.toLowerCase();
    const analyses = JSON.parse(localStorage.getItem('carAnalyses')) || [];
    const usersList = document.getElementById('usersList');
    
    const filtered = analyses.filter(a => 
        a.user.name.toLowerCase().includes(searchTerm) || 
        a.user.email.toLowerCase().includes(searchTerm)
    );
    
    let usersHtml = '';
    filtered.forEach(analysis => {
        usersHtml += `
            <div class="user-item">
                <h4>${analysis.user.name}</h4>
                <p>📧 ${analysis.user.email}</p>
                <p>📱 ${analysis.user.phone}</p>
                <p>🚗 ${analysis.car.year} ${analysis.car.make} ${analysis.car.model}</p>
                <p>📊 Component: ${analysis.analysis.component}</p>
                <p>📈 Confidence: ${analysis.analysis.confidence}%</p>
                <p>⚙️ Condition: ${analysis.analysis.condition}</p>
            </div>
        `;
    });
    usersList.innerHTML = usersHtml || '<p>No users found</p>';
}

function exportData() {
    const analyses = JSON.parse(localStorage.getItem('carAnalyses')) || [];
    const dataStr = JSON.stringify(analyses, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `car-analyses-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
}

function clearHistory() {
    if (confirm('Are you sure you want to clear all history?')) {
        localStorage.removeItem('carAnalyses');
        loadAdminDashboard();
    }
}

function scrollToAnalyzer() {
    document.getElementById('analyzer').scrollIntoView({ behavior: 'smooth' });
}

// Initialize
window.addEventListener('DOMContentLoaded', () => {
    initializeModel();
    console.log('CarAI Analyzer initialized!');
});