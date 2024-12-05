// events.js

// Function to fetch events from the database
async function fetchEvents() {
    try {
        const response = await fetch('http://localhost:8081/api/events');
        const events = await response.json();
        
        // Sort events into upcoming and previous based on date
        const now = new Date();
        const upcomingEvents = events.filter(event => new Date(event.DateTime) >= now);
        const previousEvents = events.filter(event => new Date(event.DateTime) < now);
        
        displayUpcomingEvents(upcomingEvents);
        displayPreviousEvents(previousEvents);
    } catch (error) {
        console.error('Error fetching events:', error);
    }
}

// Function to display upcoming events
function displayUpcomingEvents(events) {
    const container = document.getElementById('upcomingEvents');
    if (!container) return;
    
    events.forEach(event => {
        const date = new Date(event.DateTime);
        const dayName = date.toLocaleString('en-US', { weekday: 'short' }).toUpperCase();
        const dateStr = `${date.getMonth() + 1}/${date.getDate()}`;
        
        const eventCard = createEventCard(event, dayName, dateStr);
        container.appendChild(eventCard);
    });
}

// Function to display previous events
function displayPreviousEvents(events) {
    const container = document.getElementById('previousEvents');
    if (!container) return;
    
    events.forEach(event => {
        const date = new Date(event.DateTime);
        const dayName = date.toLocaleString('en-US', { weekday: 'short' }).toUpperCase();
        const dateStr = `${date.getMonth() + 1}/${date.getDate()}`;
        
        const eventCard = createEventCard(event, dayName, dateStr);
        container.appendChild(eventCard);
    });
}

// Helper function to create event card
function createEventCard(event, dayName, dateStr) {
    const div = document.createElement('div');
    div.className = 'flex bg-gray-100 rounded-lg shadow-md overflow-hidden mb-4';
    div.innerHTML = `
        <div class="flex-1 p-4">
            <h3 class="font-bold">${event.EventName}</h3>
            <p class="text-sm text-gray-600">Venue: ${event.Venue}</p>
            <p class="text-sm text-green-600">Status: ${event.Availability}</p>
        </div>
        <div class="w-24 bg-gray-200 flex flex-col items-center justify-center">
            <span class="text-sm font-semibold">${dayName}</span>
            <span class="text-sm">${dateStr}</span>
        </div>
    `;
    return div;
}

// Add corresponding server endpoint in server.js
/*
app.get('/api/events', (req, res) => {
    const sql = "SELECT * FROM events";
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: "Failed to fetch events" });
        }
        res.json(results);
    });
});
*/

// Initialize events when DOM is loaded
document.addEventListener('DOMContentLoaded', fetchEvents);