# 🏎️ CarAI Analyzer - AI-Powered Vehicle Condition Detection

## Overview

**CarAI Analyzer** is a cutting-edge web application that uses artificial intelligence to assess vehicle conditions from images. Features a public analyzer for users and a secure admin dashboard to view all submissions.

### Key Features

✅ **Public Vehicle Analyzer**
- Upload car images for instant AI analysis
- Detect vehicle components (engine, tires, brakes, battery, suspension, transmission)
- Get confidence scores and condition assessments
- View detailed maintenance recommendations
- No data sent to servers - all processing local

✅ **Secure Admin Dashboard** (Password Protected)
- View all user submissions
- See complete user & car details
- Track vehicle diagnostics and conditions
- Analyze trends with interactive charts
- Search and filter user data
- Export all data as JSON
- Only accessible with admin password

✅ **Privacy & Security**
- Users can only submit analyses
- Admin-only access to view all data
- Local storage of all information
- No external API calls
- Secure password-protected admin panel

## 🚀 Getting Started

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/Prajansai-cod/car-condition-analyzer.git
cd car-condition-analyzer
```

2. **Start a local server:**
```bash
# Python 3
python -m http.server 8000

# Or Node.js
npx http-server

# Or simply open index.html in your browser
```

3. **Open in browser:**
```
http://localhost:8000
```

## 📖 How to Use

### For Users (Public)

1. **Enter Your Information**
   - Name, Email, Phone

2. **Enter Car Details**
   - Make, Model, Year, Mileage

3. **Upload Vehicle Image**
   - Drag & drop or click to select
   - Supported formats: JPG, PNG, WebP

4. **View AI Analysis**
   - Component detection
   - Confidence score
   - Vehicle condition (GOOD/FAIR/POOR)
   - Maintenance recommendations

5. **Submit Analysis**
   - Data saved locally
   - Ready for admin review

### For Admin (Secure Access)

1. **Click "Admin" in Navigation**

2. **Enter Password:** `2333`

3. **Access Dashboard with Tabs:**
   - **Overview:** Summary statistics
   - **User Analyses:** All submissions with full details
   - **Statistics:** Condition trends and component distribution

4. **Available Actions:**
   - Search users by name or email
   - View complete car and diagnostic details
   - Generate statistics and charts
   - Export all data as JSON
   - Clear history (with confirmation)

## 🛠️ Technology Stack

- **TensorFlow.js** - Machine learning framework
- **MobileNet** - Pre-trained image classification model
- **Chart.js** - Interactive data visualization
- **HTML5 / CSS3** - Responsive modern design
- **Vanilla JavaScript** - No external dependencies (except ML libraries)

## 🚗 Supported Components

The analyzer can identify and provide insights for:

1. **Engine** - Performance and maintenance needs
2. **Tires** - Wear patterns and replacement timing
3. **Brakes** - Safety assessment and service requirements
4. **Battery** - Condition and replacement indicators
5. **Suspension** - Comfort and handling diagnostics
6. **Transmission** - Efficiency and service needs

## 📊 Analysis Results

### Confidence Scoring
- **75%+** - GOOD condition ✅
- **50-75%** - FAIR condition ⚠️
- **Below 50%** - POOR condition ❌

### Data Collected (Admin Only)
- User name, email, phone
- Car make, model, year, mileage
- Component detected
- Confidence score
- Condition assessment
- Maintenance recommendations
- Uploaded image
- Timestamp

## 🎨 Design Highlights

### Color Scheme
- **Orange (#FF6B35)** - Primary action and energy
- **Deep Blue (#004E89)** - Trust and stability
- **Cyan (#1AC8ED)** - Modern tech accent
- **Green (#2ECC71)** - Good/Success states
- **Yellow (#F39C12)** - Warnings
- **Red (#E74C3C)** - Critical issues

### UI Features
- Smooth animations and transitions
- Interactive hover effects
- Clear visual hierarchy
- Mobile-responsive design
- Drag-and-drop file upload
- Real-time analysis

## 🔒 Security & Privacy

✅ **Data Protection:**
- All analysis happens locally on user's device
- Images never uploaded to external servers
- Data stored in browser localStorage
- Admin password required to view submissions
- No user tracking or analytics

✅ **Admin Access:**
- Password-protected dashboard
- Only admin can access user data
- Users cannot see each other's submissions
- Export functionality for backup

## 📱 Browser Compatibility

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)
- ✅ Tablets (responsive design)

## 💡 Use Cases

1. **Used Car Buyers** - Quick pre-purchase inspection
2. **Fleet Managers** - Bulk vehicle assessments
3. **Mechanics** - Initial diagnostics support
4. **Car Owners** - DIY maintenance planning
5. **Insurance Companies** - Damage assessment
6. **Dealerships** - Vehicle condition documentation

## 🚀 Future Enhancements

- [ ] Multi-image batch analysis
- [ ] PDF report generation
- [ ] Email notifications for admins
- [ ] Cost estimation for repairs
- [ ] Parts marketplace integration
- [ ] Mobile app (React Native)
- [ ] AR visualization
- [ ] SMS notifications
- [ ] Admin user management
- [ ] Advanced analytics

## 📝 Admin Dashboard Features

### Overview Tab
- Total analyses count
- Unique users count
- Good condition percentage
- Average confidence score

### User Analyses Tab
- Search by name or email
- View complete user information
- See car details
- Review analysis results
- Check submission timestamps

### Statistics Tab
- Condition distribution chart
- Component distribution pie chart
- Trend analysis

## 🔑 Admin Credentials

- **Username:** Admin (optional)
- **Password:** `2333`

⚠️ **Important:** Change this password in production!

## 📄 File Structure

```
car-condition-analyzer/
├── index.html          # Main HTML structure
├── styles.css          # Complete styling
├── script.js           # AI logic and functionality
├── README.md           # This file
└── .gitignore          # Git ignore rules
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📜 License

MIT License - Feel free to use this project for personal and commercial purposes.

## 📞 Support

For issues, suggestions, or feedback:
- Open a GitHub issue
- Contact: support@carai.com

---

**Made with ❤️ by CarAI Team**

🚗 **CarAI Analyzer - Making vehicle diagnostics accessible to everyone!** ⚡